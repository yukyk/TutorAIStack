import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import supabase from '@/lib/db';

export async function POST(request: NextRequest): Promise<NextResponse> {
  const session = await getServerSession(authOptions);
  const userId = (session?.user as any)?.id;
  if (!session || !userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  let body: { problemId?: string; solved?: boolean };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  const { problemId, solved } = body;
  if (!problemId) {
    return NextResponse.json({ error: 'problemId is required' }, { status: 400 });
  }

  const { data: existing } = await supabase
    .from('problem_attempts')
    .select('id, attempts, solved')
    .eq('user_id', userId)
    .eq('problem_id', problemId)
    .single();

  const now = new Date().toISOString();

  if (existing) {
    const updates: Record<string, unknown> = {
      attempts: existing.attempts + 1,
      last_attempted_at: now,
    };
    if (solved && !existing.solved) {
      updates.solved = true;
      updates.solved_at = now;
    }
    await supabase
      .from('problem_attempts')
      .update(updates)
      .eq('user_id', userId)
      .eq('problem_id', problemId);
  } else {
    await supabase.from('problem_attempts').insert({
      user_id: userId,
      problem_id: problemId,
      attempts: 1,
      solved: solved ?? false,
      solved_at: solved ? now : null,
      last_attempted_at: now,
    });
  }

  return NextResponse.json({ ok: true });
}
