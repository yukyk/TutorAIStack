import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { updateDailyLimit } from '@/lib/credits';
import supabase from '@/lib/db';

export async function POST(req: NextRequest): Promise<NextResponse> {
  const raw = await req.text();
  const incomingSig = req.headers.get('x-razorpay-signature') ?? '';

  const expectedSig = crypto
    .createHmac('sha256', process.env.RAZORPAY_WEBHOOK_SECRET!)
    .update(raw)
    .digest('hex');

  if (expectedSig !== incomingSig) {
    console.warn('[webhook] invalid signature');
    return NextResponse.json({ ok: false });
  }

  let payload: any;
  try {
    payload = JSON.parse(raw);
  } catch {
    return NextResponse.json({ ok: false });
  }

  const event: string = payload?.event ?? '';

  if (event === 'subscription.activated') {
    const entity = payload?.payload?.subscription?.entity ?? {};
    const userId: string = entity?.notes?.userId;
    if (userId) {
      await supabase.from('subscriptions').upsert({
        user_id: userId,
        status: 'active',
        updated_at: new Date().toISOString(),
      });
    }
  } else if (event === 'subscription.cancelled') {
    const entity = payload?.payload?.subscription?.entity ?? {};
    const userId: string = entity?.notes?.userId;
    if (userId) {
      await supabase.from('subscriptions').update({
        status: 'cancelled',
        updated_at: new Date().toISOString(),
      }).eq('user_id', userId);
      await updateDailyLimit(userId, 5);
    }
  } else if (event === 'payment.failed') {
    const entity = payload?.payload?.payment?.entity ?? {};
    const userId: string = entity?.notes?.userId;
    if (userId) {
      await supabase.from('credit_transactions').insert({
        user_id: userId,
        amount: 0,
        type: 'failed',
        description: entity?.error_description ?? 'Payment failed',
      });
    }
  }

  return NextResponse.json({ ok: true });
}
