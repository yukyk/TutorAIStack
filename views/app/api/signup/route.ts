import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import supabase from '@/lib/db';

function stripHtml(str: string): string {
  return str.replace(/<[^>]*>/g, '');
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  let body: { name?: string; email?: string; password?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  const { name, email, password } = body;

  const cleanName = name ? stripHtml(name).trim() : undefined;
  const cleanEmail = email ? stripHtml(email).trim() : undefined;

  if (!cleanName || !cleanEmail || !password) {
    return NextResponse.json({ error: 'Name, email, and password are required' }, { status: 400 });
  }

  if (password.length < 8) {
    return NextResponse.json({ error: 'Password must be at least 8 characters' }, { status: 400 });
  }

  try {
    const { data: existing } = await supabase
      .from('users')
      .select('id')
      .eq('email', cleanEmail)
      .single();

    if (existing) {
      return NextResponse.json({ error: 'An account with this email already exists' }, { status: 409 });
    }

    const hash = await bcrypt.hash(password, 12);
    const { error } = await supabase
      .from('users')
      .insert({ name: cleanName, email: cleanEmail, password_hash: hash });

    if (error) {
      console.error('Signup error:', error);
      return NextResponse.json({ error: 'Something went wrong. Please try again.' }, { status: 500 });
    }

    return NextResponse.json({ success: true }, { status: 201 });
  } catch (err) {
    console.error('Signup error:', err);
    return NextResponse.json({ error: 'Something went wrong. Please try again.' }, { status: 500 });
  }
}
