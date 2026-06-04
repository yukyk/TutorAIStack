import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import supabase from '@/lib/db';
import bcrypt from 'bcryptjs';

export async function POST(request: NextRequest): Promise<NextResponse> {
  const session = await getServerSession(authOptions);
  const userId = (session?.user as any)?.id;
  if (!session || !userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  let body: { name?: string; newPassword?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  const { name, newPassword } = body;

  if (name !== undefined) {
    const trimmed = name.trim();
    if (!trimmed || trimmed.length > 100) {
      return NextResponse.json({ error: 'Name must be 1–100 characters.' }, { status: 400 });
    }
    await supabase.from('users').update({ name: trimmed }).eq('id', userId);
    return NextResponse.json({ ok: true });
  }

  if (newPassword !== undefined) {
    const { data: user } = await supabase
      .from('users')
      .select('password_hash')
      .eq('id', userId)
      .single();

    if (!user?.password_hash) {
      return NextResponse.json({ error: 'Password change is not available for OAuth accounts.' }, { status: 403 });
    }
    if (newPassword.length < 8) {
      return NextResponse.json({ error: 'Password must be at least 8 characters.' }, { status: 400 });
    }
    const hash = await bcrypt.hash(newPassword, 12);
    await supabase.from('users').update({ password_hash: hash }).eq('id', userId);
    return NextResponse.json({ ok: true });
  }

  return NextResponse.json({ error: 'Nothing to update.' }, { status: 400 });
}
