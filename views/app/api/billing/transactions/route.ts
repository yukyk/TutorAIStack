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
    .from('credit_transactions')
    .select('id, amount, type, description, created_at')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(50);

  return NextResponse.json({ transactions: data ?? [] });
}
