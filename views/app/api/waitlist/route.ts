import { NextRequest, NextResponse } from 'next/server';
import supabase from '@/lib/db';
import { validateEmail } from '@/lib/sanitize';
import { validateOrigin } from '@/lib/csrf';

export async function GET(): Promise<NextResponse> {
  try {
    const { count } = await supabase
      .from('waitlist')
      .select('*', { count: 'exact', head: true });
    return NextResponse.json({ count }, { status: 200 });
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json({ error: 'Failed to fetch waitlist count.' }, { status: 500 });
  }
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  if (!validateOrigin(request)) {
    return NextResponse.json({ error: 'Invalid origin' }, { status: 403 });
  }

  const contentLength = request.headers.get('content-length');
  if (contentLength && parseInt(contentLength) > 51200) {
    return NextResponse.json({ error: 'Request too large' }, { status: 413 });
  }

  let body: { email?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Valid email is required.' }, { status: 400 });
  }

  const { email } = body;

  if (!email || !validateEmail(email)) {
    return NextResponse.json({ error: 'Valid email is required.' }, { status: 400 });
  }

  try {
    const { error } = await supabase
      .from('waitlist')
      .insert({ email });

    if (error?.code === '23505') {
      return NextResponse.json({ error: 'Email is already on the waitlist.' }, { status: 409 });
    }
    if (error) {
      console.error('Database error:', error);
      return NextResponse.json({ error: 'Failed to join waitlist.' }, { status: 500 });
    }

    return NextResponse.json({ message: 'Successfully joined waitlist!' }, { status: 201 });
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json({ error: 'Failed to join waitlist.' }, { status: 500 });
  }
}
