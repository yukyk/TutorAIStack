import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import crypto from 'crypto';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { findPack, findTier } from '@/lib/pricing';
import { addPackCredits, updateDailyLimit, getOrCreateCredits } from '@/lib/credits';
import supabase from '@/lib/db';

export async function POST(req: NextRequest): Promise<NextResponse> {
  const session = await getServerSession(authOptions);
  const userId = (session?.user as any)?.id;
  if (!session || !userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await req.json();
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature, type, packId, planId } = body;

  if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
    return NextResponse.json({ error: 'Missing payment fields' }, { status: 400 });
  }

  const expectedSig = crypto
    .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET!)
    .update(`${razorpay_order_id}|${razorpay_payment_id}`)
    .digest('hex');

  if (expectedSig !== razorpay_signature) {
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
  }

  if (type === 'pack') {
    const pack = findPack(packId);
    if (!pack) return NextResponse.json({ error: 'Invalid packId' }, { status: 400 });
    await addPackCredits(userId, pack.credits, `Razorpay pack: ${pack.label}`);
  } else if (type === 'subscription') {
    const tier = findTier(planId);
    if (!tier || tier.id === 'free') return NextResponse.json({ error: 'Invalid planId' }, { status: 400 });

    const currentPeriodEnd = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString();
    await supabase.from('subscriptions').upsert({
      user_id: userId,
      plan: planId,
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
  } else {
    return NextResponse.json({ error: 'Invalid type' }, { status: 400 });
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
