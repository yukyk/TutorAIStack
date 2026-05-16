import { NextRequest, NextResponse } from 'next/server';
import supabase from '@/lib/db';

export async function GET(request: NextRequest): Promise<NextResponse> {
  const auth = request.headers.get('authorization');
  if (!auth || auth !== process.env.ADMIN_PASSWORD) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const [usersResult, waitlistResult] = await Promise.all([
    supabase.from('users').select('name, email, password_hash, created_at').order('created_at', { ascending: false }),
    supabase.from('waitlist').select('email, created_at').order('created_at', { ascending: false }),
  ]);

  if (usersResult.error) {
    console.error('Admin waitlist — users query error:', usersResult.error);
    return NextResponse.json({ error: 'Failed to fetch users' }, { status: 500 });
  }
  if (waitlistResult.error) {
    console.error('Admin waitlist — waitlist query error:', waitlistResult.error);
    return NextResponse.json({ error: 'Failed to fetch waitlist' }, { status: 500 });
  }

  const users = (usersResult.data ?? []).map(u => ({
    name: u.name,
    email: u.email,
    auth_method: u.password_hash ? 'email' : 'google',
    created_at: u.created_at,
  }));

  return NextResponse.json({
    users,
    waitlist: waitlistResult.data ?? [],
  });
}
