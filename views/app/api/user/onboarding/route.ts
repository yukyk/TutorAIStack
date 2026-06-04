import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import supabase from '@/lib/db';

export async function GET(): Promise<NextResponse> {
  const session = await getServerSession(authOptions);
  const userId = (session?.user as any)?.id;
  if (!session || !userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { data } = await supabase
    .from('users')
    .select('onboarding_complete')
    .eq('id', userId)
    .single();

  return NextResponse.json({ complete: data?.onboarding_complete ?? null });
}

export async function PATCH(): Promise<NextResponse> {
  const session = await getServerSession(authOptions);
  const userId = (session?.user as any)?.id;
  if (!session || !userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  await supabase
    .from('users')
    .update({ onboarding_complete: true })
    .eq('id', userId);

  return NextResponse.json({ success: true });
}
