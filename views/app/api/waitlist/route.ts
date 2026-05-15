import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function GET(): Promise<NextResponse> {
  try {
    const [rows] = await pool.query('SELECT COUNT(*) as count FROM waitlist');
    const count = (rows as Array<{ count: number }>)[0].count;
    return NextResponse.json({ count }, { status: 200 });
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json({ error: 'Failed to fetch waitlist count.' }, { status: 500 });
  }
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  let body: { email?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Valid email is required.' }, { status: 400 });
  }

  const { email } = body;

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: 'Valid email is required.' }, { status: 400 });
  }

  try {
    const [result] = await pool.query('INSERT INTO waitlist (email) VALUES (?)', [email]);
    return NextResponse.json(
      { message: 'Successfully joined waitlist!', id: (result as { insertId: number }).insertId },
      { status: 201 }
    );
  } catch (error: unknown) {
    if ((error as { code?: string }).code === 'ER_DUP_ENTRY') {
      return NextResponse.json({ error: 'Email is already on the waitlist.' }, { status: 409 });
    }
    console.error('Database error:', error);
    return NextResponse.json({ error: 'Failed to join waitlist.' }, { status: 500 });
  }
}
