import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import supabase from '@/lib/db';

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
): Promise<NextResponse> {
  const { userId } = await params;
  const session = await getServerSession(authOptions);
  const sessionUserId = (session?.user as any)?.id;
  if (!session || !sessionUserId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  if (userId !== sessionUserId) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const [attemptsResult, userResult] = await Promise.all([
    supabase
      .from('problem_attempts')
      .select('problem_id, attempts, solved, solved_at, last_attempted_at')
      .eq('user_id', sessionUserId),
    supabase
      .from('users')
      .select('created_at')
      .eq('id', sessionUserId)
      .single(),
  ]);

  return NextResponse.json({
    attempts: attemptsResult.data ?? [],
    user: userResult.data ?? null,
  });
}
