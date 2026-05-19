import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { getOrCreateCredits } from '@/lib/credits';

export async function GET() {
  const session = await getServerSession(authOptions);
  const userId = (session?.user as any)?.id;
  if (!session || !userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const credits = await getOrCreateCredits(userId);

  return NextResponse.json({
    dailyCredits: credits.daily_credits,
    dailyLimit: credits.daily_limit,
    packCredits: credits.pack_credits,
    resetAt: credits.daily_reset_at,
  });
}
