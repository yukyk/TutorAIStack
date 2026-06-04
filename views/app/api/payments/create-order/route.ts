import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { findPack, findTier } from '@/lib/pricing';
import Razorpay from 'razorpay';

export async function POST(req: NextRequest): Promise<NextResponse> {
  const session = await getServerSession(authOptions);
  const userId = (session?.user as any)?.id;
  if (!session || !userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await req.json();
  const { type, packId, planId } = body;

  if (!type || !['pack', 'subscription'].includes(type)) {
    return NextResponse.json({ error: 'Invalid type' }, { status: 400 });
  }

  const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID!,
    key_secret: process.env.RAZORPAY_KEY_SECRET!,
  });

  let amountPaise: number;
  let description: string;
  let itemId: string;

  if (type === 'pack') {
    const pack = findPack(packId);
    if (!pack) return NextResponse.json({ error: 'Invalid packId' }, { status: 400 });
    amountPaise = pack.priceINR * 100;
    description = `Credit pack: ${pack.label} (${pack.credits} credits)`;
    itemId = pack.id;
  } else {
    const tier = findTier(planId);
    if (!tier || tier.id === 'free') return NextResponse.json({ error: 'Invalid planId' }, { status: 400 });
    amountPaise = tier.priceINR * 100;
    description = `Subscription: ${tier.label}`;
    itemId = tier.id;
  }

  const order = await razorpay.orders.create({
    amount: amountPaise,
    currency: 'INR',
    notes: { userId, type, itemId } as Record<string, string>,
  });

  return NextResponse.json({
    orderId: order.id,
    amount: order.amount,
    currency: 'INR',
    name: 'TutorAI',
    description,
  });
}
