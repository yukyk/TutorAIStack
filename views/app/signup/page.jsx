'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { signIn, useSession } from 'next-auth/react';

export default function SignupPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (status === 'authenticated') router.replace('/compiler');
  }, [status, router]);

  function change(e) {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));
    setError('');
  }

  async function handleGoogleSignup() {
    setGoogleLoading(true);
    await signIn('google', { callbackUrl: '/onboarding' });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError('');

    const res = await fetch('/api/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });

    const data = await res.json();

    if (!res.ok) {
      setError(data.error || 'Something went wrong');
      setLoading(false);
      return;
    }

    const result = await signIn('credentials', {
      email: form.email,
      password: form.password,
      redirect: false,
    });

    if (result?.error) {
      setError('Account created — please log in.');
      router.push('/login');
      return;
    }

    router.push('/onboarding');
  }

  if (status === 'loading') return null;

  return (
    <div style={bg}>
      <div style={{ width: '100%', maxWidth: '400px' }}>

        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <a href="/" style={logoLink}>
            <div style={logoBox}>{'</>'}</div>
            TutorAI
          </a>
          <h1 style={heading}>Create your account</h1>
          <p style={sub}>Start learning DSA the right way</p>
        </div>

        <div style={card}>
          <button onClick={handleGoogleSignup} disabled={googleLoading || loading} style={googleBtn}>
            <GoogleIcon />
            {googleLoading ? 'Redirecting...' : 'Continue with Google'}
          </button>

          <div style={divider}>
            <div style={dividerLine} />
            <span style={dividerText}>or continue with email</span>
            <div style={dividerLine} />
          </div>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <input
              type="text"
              name="name"
              placeholder="Full name"
              value={form.name}
              onChange={change}
              required
              style={input}
              onFocus={e => (e.target.style.borderColor = '#3B82F6')}
              onBlur={e => (e.target.style.borderColor = 'rgba(255,255,255,0.1)')}
            />
            <input
              type="email"
              name="email"
              placeholder="Email address"
              value={form.email}
              onChange={change}
              required
              style={input}
              onFocus={e => (e.target.style.borderColor = '#3B82F6')}
              onBlur={e => (e.target.style.borderColor = 'rgba(255,255,255,0.1)')}
            />
            <input
              type="password"
              name="password"
              placeholder="Password (min 8 characters)"
              value={form.password}
              onChange={change}
              required
              minLength={8}
              style={input}
              onFocus={e => (e.target.style.borderColor = '#3B82F6')}
              onBlur={e => (e.target.style.borderColor = 'rgba(255,255,255,0.1)')}
            />

            {error && <p style={{ color: '#f87171', fontSize: '13px', margin: 0 }}>{error}</p>}

            <button
              type="submit"
              disabled={loading || googleLoading}
              style={{ ...submitBtn, opacity: loading || googleLoading ? 0.7 : 1 }}
              onMouseEnter={e => { if (!loading && !googleLoading) e.target.style.background = '#2563EB'; }}
              onMouseLeave={e => { e.target.style.background = '#3B82F6'; }}
            >
              {loading ? 'Creating account...' : 'Create account'}
            </button>
          </form>
        </div>

        <p style={switchText}>
          Already have an account?{' '}
          <a href="/login" style={switchLink}>Log in</a>
        </p>
      </div>
    </div>
  );
}

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" style={{ flexShrink: 0 }}>
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
    </svg>
  );
}

const bg = {
  minHeight: '100vh',
  background: '#0B0F19',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '24px',
  fontFamily: 'system-ui, sans-serif',
};

const logoLink = {
  display: 'inline-flex', alignItems: 'center', gap: '8px',
  textDecoration: 'none', color: '#fff', fontWeight: '700', fontSize: '18px',
};

const logoBox = {
  width: '32px', height: '32px', borderRadius: '8px',
  background: '#3B82F6', display: 'flex', alignItems: 'center',
  justifyContent: 'center', fontSize: '10px', fontFamily: 'monospace', color: '#fff',
};

const heading = {
  color: '#fff', fontSize: '24px', fontWeight: '700',
  marginTop: '24px', marginBottom: '6px', letterSpacing: '-0.02em',
};

const sub = { color: '#6b7280', fontSize: '14px', margin: 0 };

const card = {
  background: 'linear-gradient(145deg, rgba(30,58,138,0.08), rgba(11,15,25,0.6))',
  border: '1px solid rgba(255,255,255,0.08)',
  borderRadius: '16px',
  padding: '28px',
  backdropFilter: 'blur(16px)',
};

const googleBtn = {
  width: '100%', padding: '12px', borderRadius: '10px',
  background: '#fff', border: 'none', cursor: 'pointer',
  display: 'flex', alignItems: 'center', justifyContent: 'center',
  gap: '10px', fontSize: '14px', fontWeight: '600', color: '#111',
  transition: 'opacity 0.15s',
};

const divider = {
  display: 'flex', alignItems: 'center', gap: '12px', margin: '20px 0',
};

const dividerLine = { flex: 1, height: '1px', background: 'rgba(255,255,255,0.07)' };

const dividerText = { fontSize: '12px', color: '#4b5563', whiteSpace: 'nowrap' };

const input = {
  width: '100%', padding: '12px 14px', borderRadius: '10px',
  background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)',
  color: '#fff', fontSize: '14px', outline: 'none', boxSizing: 'border-box',
  transition: 'border-color 0.15s',
};

const submitBtn = {
  width: '100%', padding: '13px', borderRadius: '10px',
  background: '#3B82F6', color: '#fff', border: 'none',
  cursor: 'pointer', fontSize: '14px', fontWeight: '700',
  transition: 'background 0.15s', marginTop: '4px',
};

const switchText = {
  textAlign: 'center', marginTop: '20px',
  fontSize: '14px', color: '#6b7280',
};

const switchLink = {
  color: '#3B82F6', textDecoration: 'none', fontWeight: '500',
};
