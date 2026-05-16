'use client';

import { useState, useEffect, useCallback } from 'react';
import { useSession } from 'next-auth/react';
import axios from 'axios';

const ADMIN_EMAIL = 'yusufkhambaty1@gmail.com';
const STORAGE_KEY = 'tutorai_admin';
const SEO_TITLE = 'AI Coding Tutor | Stop Memorizing LeetCode';
const SEO_DESC = 'An AI tutor that teaches you how to think — not just what to code.';

function formatUptime(s) {
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = s % 60;
  return `${h}h ${m}m ${sec}s`;
}

function formatDate(iso) {
  if (!iso) return '—';
  return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

function Card({ title, children, fullWidth }) {
  return (
    <div style={{
      background: '#111827', border: '1px solid #1f2937', borderRadius: 12,
      padding: 24, gridColumn: fullWidth ? '1 / -1' : undefined,
    }}>
      <div style={{ color: '#6b7280', fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 18 }}>
        {title}
      </div>
      {children}
    </div>
  );
}

function BigStat({ label, value, highlight }) {
  return (
    <div style={{ marginBottom: 16 }}>
      <div style={{ color: '#6b7280', fontSize: 12, marginBottom: 4 }}>{label}</div>
      <div style={{ color: highlight ? '#60a5fa' : '#f9fafb', fontSize: 32, fontWeight: 700, fontFamily: 'monospace', lineHeight: 1 }}>
        {value !== null && value !== undefined ? String(value) : '—'}
      </div>
    </div>
  );
}

function SmallStat({ label, value }) {
  return (
    <div style={{ marginBottom: 14 }}>
      <div style={{ color: '#6b7280', fontSize: 12, marginBottom: 4 }}>{label}</div>
      <div style={{ color: '#f9fafb', fontSize: 15, fontWeight: 600, fontFamily: 'monospace' }}>
        {value !== null && value !== undefined ? String(value) : '—'}
      </div>
    </div>
  );
}

const MODE_LABELS = { hint: 'Hint', logic: 'Logic', humanize: 'Humanize', debug: 'Debug', optimize: 'Optimize' };

const tableHeaderStyle = {
  color: '#6b7280', fontSize: 11, fontWeight: 600, textTransform: 'uppercase',
  letterSpacing: '0.08em', padding: '0 12px 10px 0', textAlign: 'left', borderBottom: '1px solid #1f2937',
};
const tableCellStyle = {
  color: '#f9fafb', fontSize: 13, padding: '10px 12px 10px 0', borderBottom: '1px solid #111827',
};

export default function AdminPage() {
  const { data: session, status } = useSession();
  const [authed, setAuthed] = useState(false);
  const [token, setToken] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [loginLoading, setLoginLoading] = useState(false);
  const [stats, setStats] = useState(null);
  const [waitlistCount, setWaitlistCount] = useState(null);
  const [usersData, setUsersData] = useState(null);
  const [waitlistData, setWaitlistData] = useState(null);
  const [lastRefresh, setLastRefresh] = useState(null);

  useEffect(() => {
    if (status === 'authenticated' && session?.user?.isAdmin && session?.user?.adminToken) {
      setToken(session.user.adminToken);
      setAuthed(true);
      return;
    }
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const { token: t } = JSON.parse(stored);
        if (t) { setToken(t); setAuthed(true); }
      } catch (_) { localStorage.removeItem(STORAGE_KEY); }
    }
  }, [status, session]);

  const fetchData = useCallback(async (t) => {
    try {
      const [statsRes, waitlistRes, adminWaitlistRes] = await Promise.all([
        axios.get('/api/admin/stats', { headers: { Authorization: t } }),
        axios.get('/api/waitlist').catch(() => ({ data: { count: null } })),
        axios.get('/api/admin/waitlist', { headers: { Authorization: t } }).catch(() => ({ data: { users: [], waitlist: [] } })),
      ]);
      setStats(statsRes.data);
      setWaitlistCount(waitlistRes.data.count);
      setUsersData(adminWaitlistRes.data.users ?? []);
      setWaitlistData(adminWaitlistRes.data.waitlist ?? []);
      setLastRefresh(new Date());
    } catch (err) {
      if (err.response?.status === 401) {
        localStorage.removeItem(STORAGE_KEY);
        setAuthed(false);
        setToken('');
      }
    }
  }, []);

  useEffect(() => {
    if (!authed || !token) return;
    fetchData(token);
    const iv = setInterval(() => fetchData(token), 30000);
    return () => clearInterval(iv);
  }, [authed, token, fetchData]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginError('');
    if (email.trim().toLowerCase() !== ADMIN_EMAIL) {
      setLoginError('Access denied');
      return;
    }
    setLoginLoading(true);
    try {
      await axios.get('/api/admin/stats', { headers: { Authorization: password } });
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ token: password }));
      setToken(password);
      setAuthed(true);
    } catch (_) {
      setLoginError('Access denied');
    } finally {
      setLoginLoading(false);
    }
  };

  const handleSignOut = () => {
    localStorage.removeItem(STORAGE_KEY);
    setAuthed(false);
    setToken('');
    setStats(null);
    setWaitlistCount(null);
    setUsersData(null);
    setWaitlistData(null);
    setEmail('');
    setPassword('');
  };

  const inputStyle = {
    width: '100%', background: '#0d1117', border: '1px solid #1f2937',
    borderRadius: 8, padding: '10px 12px', color: '#f9fafb',
    fontSize: 14, outline: 'none', boxSizing: 'border-box',
  };

  if (status === 'loading') {
    return (
      <div style={{ minHeight: '100vh', background: '#030712', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#6b7280', fontFamily: 'system-ui, sans-serif', fontSize: 14 }}>
        Loading...
      </div>
    );
  }

  if (!authed) {
    return (
      <div style={{ minHeight: '100vh', background: '#030712', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'system-ui, sans-serif' }}>
        <div style={{ background: '#111827', border: '1px solid #1f2937', borderRadius: 16, padding: 40, width: 360 }}>
          <h1 style={{ color: '#f9fafb', fontSize: 22, fontWeight: 700, margin: '0 0 4px' }}>TutorAI Admin</h1>
          <p style={{ color: '#6b7280', fontSize: 13, margin: '0 0 28px' }}>Private dashboard</p>
          <form onSubmit={handleLogin}>
            <div style={{ marginBottom: 16 }}>
              <label style={{ display: 'block', color: '#9ca3af', fontSize: 12, marginBottom: 6 }}>Email</label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} required autoComplete="email" style={inputStyle} />
            </div>
            <div style={{ marginBottom: 24 }}>
              <label style={{ display: 'block', color: '#9ca3af', fontSize: 12, marginBottom: 6 }}>Password</label>
              <input type="password" value={password} onChange={e => setPassword(e.target.value)} required autoComplete="current-password" style={inputStyle} />
            </div>
            {loginError && <p style={{ color: '#f87171', fontSize: 13, margin: '0 0 16px' }}>{loginError}</p>}
            <button type="submit" disabled={loginLoading} style={{ width: '100%', background: '#2563eb', border: 'none', borderRadius: 8, padding: '12px 0', color: '#fff', fontSize: 15, fontWeight: 600, cursor: loginLoading ? 'not-allowed' : 'pointer', opacity: loginLoading ? 0.7 : 1 }}>
              {loginLoading ? 'Verifying...' : 'Sign In'}
            </button>
          </form>
        </div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div style={{ minHeight: '100vh', background: '#030712', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#6b7280', fontFamily: 'system-ui, sans-serif', fontSize: 14 }}>
        Loading...
      </div>
    );
  }

  const totalModeCounts = Object.values(stats.modeCounts).reduce((a, b) => a + b, 0);

  return (
    <div style={{ minHeight: '100vh', background: '#030712', fontFamily: 'system-ui, sans-serif', padding: 32 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 28 }}>
        <div>
          <h1 style={{ color: '#f9fafb', fontSize: 22, fontWeight: 700, margin: 0 }}>TutorAI Admin</h1>
          {lastRefresh && (
            <p style={{ color: '#6b7280', fontSize: 12, margin: '4px 0 0' }}>
              Updated {lastRefresh.toLocaleTimeString()} · auto-refreshes every 30s
            </p>
          )}
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <a href="/compiler" style={{ background: '#2563eb', border: 'none', borderRadius: 8, padding: '8px 16px', color: '#fff', fontSize: 13, fontWeight: 600, cursor: 'pointer', textDecoration: 'none', display: 'inline-flex', alignItems: 'center' }}>
            Open Compiler
          </a>
          <button onClick={handleSignOut} style={{ background: 'transparent', border: '1px solid #1f2937', borderRadius: 8, padding: '8px 16px', color: '#9ca3af', fontSize: 13, cursor: 'pointer' }}>
            Sign Out
          </button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 16 }}>

        <Card title="Traffic">
          <BigStat label="Page visits (since restart)" value={stats.pageVisits} />
          <div style={{ marginBottom: 14 }}>
            <div style={{ color: '#6b7280', fontSize: 12, marginBottom: 4 }}>Online now</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{ width: 8, height: 8, borderRadius: '50%', background: stats.onlineNow > 0 ? '#4ade80' : '#374151', boxShadow: stats.onlineNow > 0 ? '0 0 6px #4ade80' : 'none' }} />
              <div style={{ color: '#f9fafb', fontSize: 24, fontWeight: 700, fontFamily: 'monospace', lineHeight: 1 }}>
                {stats.onlineNow}
              </div>
            </div>
          </div>
        </Card>

        <Card title="AI Usage">
          <BigStat label="AI requests (since restart)" value={stats.aiRequests} />
          <BigStat label="Code executions" value={stats.codeExecutions} />
          <div style={{ marginTop: 8 }}>
            <div style={{ color: '#6b7280', fontSize: 12, marginBottom: 10 }}>Mode breakdown</div>
            {Object.entries(stats.modeCounts).map(([mode, count]) => (
              <div key={mode} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 7 }}>
                <span style={{ color: mode === stats.mostUsedMode ? '#60a5fa' : '#9ca3af', fontSize: 12, width: 68 }}>
                  {MODE_LABELS[mode]}
                </span>
                <div style={{ flex: 1, height: 5, background: '#1f2937', borderRadius: 3, overflow: 'hidden' }}>
                  <div style={{ height: '100%', background: mode === stats.mostUsedMode ? '#2563eb' : '#374151', borderRadius: 3, width: totalModeCounts > 0 ? `${(count / totalModeCounts) * 100}%` : '0%', transition: 'width 0.4s' }} />
                </div>
                <span style={{ color: '#f9fafb', fontSize: 12, fontFamily: 'monospace', width: 18, textAlign: 'right' }}>{count}</span>
              </div>
            ))}
            <div style={{ color: '#60a5fa', fontSize: 11, marginTop: 10 }}>
              Top mode: {MODE_LABELS[stats.mostUsedMode]}
            </div>
          </div>
        </Card>

        <Card title="Waitlist">
          <BigStat label="Total signups" value={waitlistCount} highlight />
        </Card>

        <Card title="System">
          <SmallStat label="Server uptime" value={formatUptime(stats.uptime)} />
          <SmallStat label="Node.js version" value={stats.nodeVersion} />
          <div>
            <div style={{ color: '#6b7280', fontSize: 12, marginBottom: 6 }}>Environment</div>
            <span style={{
              background: stats.env === 'production' ? '#14532d' : '#1e3a5f',
              color: stats.env === 'production' ? '#4ade80' : '#60a5fa',
              fontSize: 12, fontFamily: 'monospace', padding: '3px 10px', borderRadius: 20,
            }}>
              {stats.env}
            </span>
          </div>
        </Card>

        <Card title="SEO Controls" fullWidth>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <div>
              <div style={{ color: '#6b7280', fontSize: 12, marginBottom: 6 }}>Meta Title</div>
              <div style={{ color: '#f9fafb', fontSize: 13, fontFamily: 'monospace', background: '#0d1117', padding: '10px 14px', borderRadius: 8 }}>{SEO_TITLE}</div>
            </div>
            <div>
              <div style={{ color: '#6b7280', fontSize: 12, marginBottom: 6 }}>Meta Description</div>
              <div style={{ color: '#f9fafb', fontSize: 13, fontFamily: 'monospace', background: '#0d1117', padding: '10px 14px', borderRadius: 8 }}>{SEO_DESC}</div>
            </div>
          </div>
          <div style={{ color: '#374151', fontSize: 11, marginTop: 12 }}>To update SEO, edit views/app/layout.tsx</div>
        </Card>

        <Card title={`Registered Users (${usersData ? usersData.length : '…'})`} fullWidth>
          {!usersData || usersData.length === 0 ? (
            <div style={{ color: '#6b7280', fontSize: 13 }}>No registered users yet.</div>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr>
                    <th style={tableHeaderStyle}>Name</th>
                    <th style={tableHeaderStyle}>Email</th>
                    <th style={tableHeaderStyle}>Auth</th>
                    <th style={tableHeaderStyle}>Joined</th>
                  </tr>
                </thead>
                <tbody>
                  {usersData.map((u, i) => (
                    <tr key={i}>
                      <td style={tableCellStyle}>{u.name || '—'}</td>
                      <td style={{ ...tableCellStyle, color: '#93c5fd' }}>{u.email}</td>
                      <td style={tableCellStyle}>
                        <span style={{
                          fontSize: 11, fontFamily: 'monospace', padding: '2px 8px', borderRadius: 20,
                          background: u.auth_method === 'google' ? '#1e3a5f' : '#1f2937',
                          color: u.auth_method === 'google' ? '#60a5fa' : '#9ca3af',
                        }}>
                          {u.auth_method}
                        </span>
                      </td>
                      <td style={{ ...tableCellStyle, color: '#6b7280' }}>{formatDate(u.created_at)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card>

        <Card title={`Waitlist Emails (${waitlistData ? waitlistData.length : '…'})`} fullWidth>
          {!waitlistData || waitlistData.length === 0 ? (
            <div style={{ color: '#6b7280', fontSize: 13 }}>No waitlist signups yet.</div>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr>
                    <th style={tableHeaderStyle}>Email</th>
                    <th style={tableHeaderStyle}>Signed up</th>
                  </tr>
                </thead>
                <tbody>
                  {waitlistData.map((w, i) => (
                    <tr key={i}>
                      <td style={{ ...tableCellStyle, color: '#93c5fd' }}>{w.email}</td>
                      <td style={{ ...tableCellStyle, color: '#6b7280' }}>{formatDate(w.created_at)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card>

      </div>
    </div>
  );
}
