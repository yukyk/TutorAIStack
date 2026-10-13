import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import crypto from 'crypto';
import Razorpay from 'razorpay';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { findPack, findTier } from '@/lib/pricing';
import { updateDailyLimit, getOrCreateCredits } from '@/lib/credits';
import supabase from '@/lib/db';

function signatureMatches(expected: string, received: string): boolean {
  const a = Buffer.from(expected);
  const b = Buffer.from(received);
  return a.length === b.length && crypto.timingSafeEqual(a, b);
}

export async function POST(req: NextRequest): Promise<NextResponse> {
  const session = await getServerSession(authOptions);
  const sessionUser = session?.user as { imageId?: string } | undefined;
  const userId = sessionUser?.imageId;
  if (!session || !userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = await req.json();
  if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
    return NextResponse.json({ error: 'Missing payment fields' }, { status: 400 });
  }

  const expectedSig = crypto
    .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET!)
    .update(`${razorpay_order_id}|${razorpay_payment_id}`)
    .digest('hex');

  if (!signatureMatches(expectedSig, String(razorpay_signature))) {
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
  }

  // Trust Razorpay and our own order, not the request body
  const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID!,
    key_secret: process.env.RAZORPAY_KEY_SECRET!,
  });
  const [order, payment] = await Promise.all([
    razorpay.orders.fetch(razorpay_order_id),
    razorpay.payments.fetch(razorpay_payment_id),
  ]);

  const notes = (order.notes ?? {}) as Record<string, string>;
  if (String(notes.userId) !== String(userId)) {
    return NextResponse.json({ error: 'Order does not belong to this user' }, { status: 403 });
  }
  if (payment.order_id !== razorpay_order_id || payment.status !== 'captured') {
    return NextResponse.json({ error: 'Payment not captured' }, { status: 400 });
  }

  await getOrCreateCredits(userId); // make sure the credits row exists

  if (notes.type === 'pack') {
    const pack = findPack(notes.itemId);
    if (!pack || Number(payment.amount) !== pack.priceINR * 100) {
      return NextResponse.json({ error: 'Amount mismatch' }, { status: 400 });
    }
    const { error } = await supabase.rpc('fulfil_pack_payment', {
      p_payment_id: razorpay_payment_id,
      p_order_id: razorpay_order_id,
      p_user_id: userId,
      p_item_id: pack.id,
      p_amount_paise: Number(payment.amount),
      p_credits: pack.credits,
      p_description: `Razorpay pack: ${pack.label}`,
    });
    if (error) {
      console.error('fulfil_pack_payment failed:', error);
      return NextResponse.json({ error: 'Could not apply payment' }, { status: 500 });
    }
    // A replay returns false from the function; we still respond success (idempotent).
  } else if (notes.type === 'subscription') {
    const tier = findTier(notes.itemId);
    if (!tier || tier.id === 'free' || Number(payment.amount) !== tier.priceINR * 100) {
      return NextResponse.json({ error: 'Amount mismatch' }, { status: 400 });
    }
    const { error: dupError } = await supabase.from('payments').insert({
      razorpay_payment_id,
      razorpay_order_id,
      user_id: userId,
      type: 'subscription',
      item_id: tier.id,
      amount_paise: Number(payment.amount),
    });
    if (dupError && dupError.code !== '23505') {
      return NextResponse.json({ error: 'Could not record payment' }, { status: 500 });
    }
    if (!dupError) { // first time we see this payment
      const currentPeriodEnd = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString();
      await supabase.from('subscriptions').upsert({
        user_id: userId,
        plan: tier.id,
        status: 'active',
        razorpay_id: razorpay_payment_id,
        current_period_end: currentPeriodEnd,
        updated_at: new Date().toISOString(),
      });
      await updateDailyLimit(userId, tier.dailyCredits);
      await supabase.from('credit_transactions').insert({
        user_id: userId,
        amount: 0,
        type: 'subscription_activated',
        description: `Razorpay subscription: ${tier.label}`,
      });
    }
  } else {
    return NextResponse.json({ error: 'Invalid order type' }, { status: 400 });
  }

  const credits = await getOrCreateCredits(userId);
  return NextResponse.json({
    success: true,
    newBalance: {
      daily: credits.daily_credits,
      dailyLimit: credits.daily_limit,
      pack: credits.pack_credits,
    },
  });
}