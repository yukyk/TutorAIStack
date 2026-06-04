'use client';

import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { PROBLEMS } from '@/lib/problems';

interface Attempt {
  problem_id: string;
  attempts: number;
  solved: boolean;
  solved_at: string | null;
  last_attempted_at: string;
}

function computeStreak(attempts: Attempt[]): number {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const dates = [...new Set(
    attempts.filter(a => a.last_attempted_at).map(a => a.last_attempted_at.split('T')[0])
  )].sort().reverse();
  let streak = 0;
  for (let i = 0; i < dates.length; i++) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    if (dates[i] === d.toISOString().split('T')[0]) streak++;
    else break;
  }
  return streak;
}

function ProgressRing({ value, max }: { value: number; max: number }) {
  const r = 36;
  const circ = 2 * Math.PI * r;
  const pct = max > 0 ? value / max : 0;
  return (
    <div style={{ position: 'relative', width: 90, height: 90 }}>
      <svg width={90} height={90} style={{ transform: 'rotate(-90deg)' }}>
        <circle cx={45} cy={45} r={r} fill="none" stroke="#1e1e1e" strokeWidth="7" />
        <circle cx={45} cy={45} r={r} fill="none" stroke="#3B82F6" strokeWidth="7"
          strokeDasharray={circ} strokeDashoffset={circ * (1 - pct)} strokeLinecap="round"
          style={{ transition: 'stroke-dashoffset 0.5s ease' }} />
      </svg>
      <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <span style={{ fontSize: '16px', fontWeight: '700', color: '#f4f4f5', lineHeight: 1 }}>{value}</span>
        <span style={{ fontSize: '9px', color: '#52525b' }}>/{max}</span>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [attempts, setAttempts] = useState<Attempt[]>([]);
  const [credits, setCredits] = useState({ daily: 0, dailyLimit: 5, pack: 0, resetAt: null as string | null });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status !== 'authenticated' || !session) return;
    const userId = (session.user as any).id;
    axios.get('/api/user/onboarding').then(res => {
      if (res.data.complete === false) {
        router.replace('/onboarding');
        return;
      }
      Promise.all([
        axios.get(`/api/attempts/${userId}`),
        axios.get('/api/credits/balance'),
      ]).then(([aRes, cRes]) => {
        setAttempts(aRes.data.attempts ?? []);
        setCredits({ daily: cRes.data.dailyCredits, dailyLimit: cRes.data.dailyLimit, pack: cRes.data.packCredits, resetAt: cRes.data.resetAt });
      }).finally(() => setLoading(false));
    }).catch(() => {
      const uid = (session.user as any).id;
      Promise.all([
        axios.get(`/api/attempts/${uid}`),
        axios.get('/api/credits/balance'),
      ]).then(([aRes, cRes]) => {
        setAttempts(aRes.data.attempts ?? []);
        setCredits({ daily: cRes.data.dailyCredits, dailyLimit: cRes.data.dailyLimit, pack: cRes.data.packCredits, resetAt: cRes.data.resetAt });
      }).finally(() => setLoading(false));
    });
  }, [status, session, router]);

  if (loading) return <div style={{ padding: '48px', color: '#52525b', fontSize: '13px' }}>Loading...</div>;

  const firstName = (session?.user?.name || session?.user?.email || 'User').split(' ')[0];
  const solvedCount = attempts.filter(a => a.solved).length;
  const streak = computeStreak(attempts);
  const totalCredits = credits.daily + credits.pack;
  const resetInH = credits.resetAt ? Math.max(0, Math.round((new Date(credits.resetAt).getTime() - Date.now()) / 3_600_000)) : null;

  const recent = [...attempts]
    .sort((a, b) => (b.last_attempted_at || '').localeCompare(a.last_attempted_at || ''))
    .slice(0, 5);

  const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86_400_000);
  const featured = (PROBLEMS as any[])[dayOfYear % PROBLEMS.length];

  const card: React.CSSProperties = { background: '#0d1117', borderRadius: '12px', border: '1px solid #1e1e1e', padding: '20px' };

  function diffBadge(difficulty: string) {
    const easy = difficulty === 'Easy';
    return { fontSize: '10px', padding: '2px 7px', borderRadius: '4px', background: easy ? '#0a1f0a' : '#1a150a', color: easy ? '#4ade80' : '#fbbf24', border: `1px solid ${easy ? '#166534' : '#78350f'}` } as React.CSSProperties;
  }

  return (
    <div style={{ padding: '28px 32px', maxWidth: '900px' }}>

      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '22px', fontWeight: '700', color: '#f4f4f5', margin: '0 0 4px' }}>
          Welcome back, {firstName} 👋
        </h1>
        <p style={{ fontSize: '13px', color: '#71717a', margin: 0 }}>Here's your progress overview.</p>
      </div>

      {/* Stats row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px', marginBottom: '20px' }}>
        {[
          { label: 'Solved', value: `${solvedCount}/35`, color: '#4ade80' },
          { label: 'Streak', value: `${streak}d`, color: '#f4f4f5' },
          { label: 'Credits', value: String(totalCredits), color: '#3B82F6' },
          { label: 'Plan', value: 'Free', color: '#71717a' },
        ].map(s => (
          <div key={s.label} style={{ ...card, textAlign: 'center', padding: '16px' }}>
            <div style={{ fontSize: '24px', fontWeight: '700', color: s.color, marginBottom: '4px' }}>{s.value}</div>
            <div style={{ fontSize: '10px', color: '#52525b', textTransform: 'uppercase', letterSpacing: '0.07em' }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Progress + Recent activity */}
      <div style={{ display: 'grid', gridTemplateColumns: '160px 1fr', gap: '16px', marginBottom: '20px' }}>

        <div style={{ ...card, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px' }}>
          <div style={{ fontSize: '10px', color: '#52525b', textTransform: 'uppercase', letterSpacing: '0.07em', alignSelf: 'flex-start' }}>Progress</div>
          <ProgressRing value={solvedCount} max={35} />
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '12px', fontWeight: '600', color: '#e4e4e7' }}>{solvedCount} of 35</div>
            <div style={{ fontSize: '10px', color: '#52525b' }}>{Math.round((solvedCount / 35) * 100)}% done</div>
          </div>
          {resetInH !== null && (
            <div style={{ fontSize: '10px', color: '#3f3f46', textAlign: 'center', marginTop: '4px' }}>Credits reset in ~{resetInH}h</div>
          )}
        </div>

        <div style={card}>
          <div style={{ fontSize: '10px', color: '#52525b', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: '12px' }}>Recent Activity</div>
          {recent.length === 0 ? (
            <p style={{ fontSize: '13px', color: '#3f3f46', textAlign: 'center', padding: '20px 0', margin: 0 }}>No activity yet. Start solving!</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '7px' }}>
              {recent.map(att => {
                const prob = (PROBLEMS as any[]).find(p => p.id === att.problem_id);
                if (!prob) return null;
                return (
                  <div key={att.problem_id} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '8px 10px', background: '#111827', borderRadius: '7px', border: '1px solid #1e1e1e' }}>
                    <span style={{ fontSize: '13px', color: att.solved ? '#4ade80' : '#fbbf24', flexShrink: 0 }}>{att.solved ? '✓' : '~'}</span>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: '12px', color: '#e4e4e7', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{prob.title}</div>
                      <div style={{ fontSize: '10px', color: '#52525b' }}>
                        {att.last_attempted_at ? new Date(att.last_attempted_at).toLocaleDateString() : ''}
                      </div>
                    </div>
                    <span style={diffBadge(prob.difficulty)}>{prob.difficulty}</span>
                    <a href={`/compiler?problem=${att.problem_id}`} style={{ fontSize: '11px', color: '#3B82F6', textDecoration: 'none', background: 'rgba(59,130,246,0.1)', padding: '3px 8px', borderRadius: '4px', border: '1px solid rgba(59,130,246,0.2)', whiteSpace: 'nowrap' }}>
                      Continue
                    </a>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Featured problem */}
      <div style={{ ...card, display: 'flex', alignItems: 'center', gap: '20px' }}>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: '10px', color: '#3B82F6', textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: '600', marginBottom: '6px' }}>Problem of the Day</div>
          <div style={{ fontSize: '16px', fontWeight: '700', color: '#f4f4f5', marginBottom: '7px' }}>{featured.title}</div>
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            <span style={diffBadge(featured.difficulty)}>{featured.difficulty}</span>
            <span style={{ fontSize: '11px', color: '#52525b' }}>{featured.pattern}</span>
          </div>
        </div>
        <a href={`/compiler?problem=${featured.id}`} style={{ background: '#3B82F6', color: '#fff', padding: '10px 20px', borderRadius: '8px', textDecoration: 'none', fontSize: '13px', fontWeight: '600', whiteSpace: 'nowrap', flexShrink: 0 }}>
          Start Solving →
        </a>
      </div>
    </div>
  );
}
