'use client';

import { useSession, signOut } from 'next-auth/react';
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

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [attempts, setAttempts] = useState<Attempt[]>([]);
  const [joinDate, setJoinDate] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  useEffect(() => {
    if (status === 'unauthenticated') router.push('/login');
  }, [status, router]);

  useEffect(() => {
    if (status !== 'authenticated' || !session) return;
    const userId = (session.user as any).id;
    axios
      .get(`/api/attempts/${userId}`)
      .then(res => {
        setAttempts(res.data.attempts ?? []);
        setJoinDate(res.data.user?.created_at ?? null);
      })
      .finally(() => setLoading(false));
  }, [status, session]);

  if (status === 'loading' || loading) {
    return (
      <div style={{ display: 'flex', height: '100vh', background: '#0B0F19', alignItems: 'center', justifyContent: 'center', color: '#3f3f46', fontSize: '14px', fontFamily: 'system-ui' }}>
        Loading...
      </div>
    );
  }

  if (!session) return null;

  const userName = session.user?.name || session.user?.email || 'User';
  const avatarInitial = userName[0].toUpperCase();

  const attemptMap = new Map<string, Attempt>(attempts.map(a => [a.problem_id, a]));
  const solvedIds = new Set(attempts.filter(a => a.solved).map(a => a.problem_id));

  const easyProblems  = PROBLEMS.filter((p: any) => p.difficulty === 'Easy');
  const mediumProblems = PROBLEMS.filter((p: any) => p.difficulty === 'Medium');
  const solvedEasy   = easyProblems.filter((p: any)   => solvedIds.has(p.id)).length;
  const solvedMedium = mediumProblems.filter((p: any) => solvedIds.has(p.id)).length;

  const patterns: string[] = [...new Set(PROBLEMS.map((p: any) => p.pattern as string))].sort();
  const patternStats = patterns.map(pattern => {
    const pp = PROBLEMS.filter((p: any) => p.pattern === pattern);
    return { pattern, solved: pp.filter((p: any) => solvedIds.has(p.id)).length, total: pp.length };
  });

  // 90-day heatmap (GitHub-style: 7 rows × 13 cols, column = week)
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const todayDow = today.getDay();
  const activeDates = new Set(
    attempts.filter(a => a.last_attempted_at).map(a => a.last_attempted_at.split('T')[0])
  );
  const totalSlots = 13 * 7;
  const heatCells: { date: string | null; active: boolean; inRange: boolean }[] = Array(totalSlots)
    .fill(null)
    .map(() => ({ date: null, active: false, inRange: false }));
  const todayFlatIdx = 12 * 7 + todayDow;
  for (let i = 0; i < 90; i++) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const ds = d.toISOString().split('T')[0];
    const idx = todayFlatIdx - i;
    if (idx >= 0) heatCells[idx] = { date: ds, active: activeDates.has(ds), inRange: true };
  }

  const card: React.CSSProperties = { padding: '24px', background: '#0d1117', borderRadius: '12px', border: '1px solid #1e1e1e' };
  const label: React.CSSProperties = { fontSize: '12px', fontWeight: '600', color: '#52525b', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: '16px' };

  return (
    <div style={{ minHeight: '100vh', background: '#0B0F19', color: '#f4f4f5', fontFamily: 'system-ui, -apple-system, sans-serif' }}>

      {/* Top bar */}
      <div style={{ height: '48px', display: 'flex', alignItems: 'center', padding: '0 24px', borderBottom: '1px solid #1e1e1e', background: '#0d1117', gap: '12px' }}>
        <a href="/compiler" style={{ display: 'flex', alignItems: 'center', gap: '7px', textDecoration: 'none' }}>
          <span style={{ color: '#3B82F6', fontWeight: '700', fontSize: '14px', fontFamily: 'monospace' }}>&lt;/&gt;</span>
          <span style={{ fontSize: '14px', fontWeight: '600', color: '#f4f4f5' }}>TutorAI</span>
        </a>
        <div style={{ flex: 1 }} />
        <a href="/compiler" style={{ color: '#71717a', fontSize: '13px', textDecoration: 'none' }}>← Compiler</a>
      </div>

      {/* Content */}
      <div style={{ maxWidth: '860px', margin: '0 auto', padding: '32px 24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>

        {/* Header */}
        <div style={{ ...card, display: 'flex', alignItems: 'center', gap: '20px' }}>
          <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: '#0f1729', border: '2px solid #3B82F6', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '26px', fontWeight: '700', color: '#3B82F6', flexShrink: 0, overflow: 'hidden' }}>
            {session.user?.image
              ? <img src={session.user.image} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              : avatarInitial
            }
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: '19px', fontWeight: '700', color: '#f4f4f5', marginBottom: '3px' }}>{userName}</div>
            <div style={{ fontSize: '13px', color: '#71717a' }}>{session.user?.email}</div>
            {joinDate && (
              <div style={{ fontSize: '12px', color: '#52525b', marginTop: '2px' }}>
                Joined {new Date(joinDate).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
              </div>
            )}
          </div>
          <button
            onClick={() => signOut({ callbackUrl: '/' })}
            style={{ background: 'transparent', border: '1px solid #27272a', color: '#71717a', padding: '7px 16px', borderRadius: '6px', fontSize: '13px', cursor: 'pointer' }}
          >
            Sign Out
          </button>
        </div>

        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
          {[
            { label: 'Total Solved', value: `${solvedIds.size} / ${PROBLEMS.length}`, color: '#f4f4f5' },
            { label: 'Easy',         value: `${solvedEasy} / ${easyProblems.length}`,  color: '#4ade80' },
            { label: 'Medium',       value: `${solvedMedium} / ${mediumProblems.length}`, color: '#fbbf24' },
          ].map(s => (
            <div key={s.label} style={{ ...card, textAlign: 'center' }}>
              <div style={{ fontSize: '30px', fontWeight: '700', color: s.color, marginBottom: '6px' }}>{s.value}</div>
              <div style={{ fontSize: '11px', color: '#52525b', textTransform: 'uppercase', letterSpacing: '0.07em' }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* Pattern breakdown */}
        <div style={card}>
          <div style={label}>Pattern Breakdown</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px' }}>
            {patternStats.map(({ pattern, solved, total }) => (
              <div key={pattern} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ width: '96px', fontSize: '12px', color: '#a1a1aa', flexShrink: 0 }}>{pattern}</div>
                <div style={{ flex: 1, height: '5px', background: '#1e1e1e', borderRadius: '3px', overflow: 'hidden' }}>
                  <div style={{ width: `${total > 0 ? (solved / total) * 100 : 0}%`, height: '100%', background: '#3B82F6', borderRadius: '3px' }} />
                </div>
                <div style={{ fontSize: '11px', color: '#52525b', width: '32px', textAlign: 'right', flexShrink: 0 }}>{solved}/{total}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Problem grid */}
        <div style={card}>
          <div style={label}>Problems — {solvedIds.size} Solved</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', position: 'relative' }}>
            {PROBLEMS.map((problem: any) => {
              const attempt = attemptMap.get(problem.id);
              const isSolved   = !!attempt?.solved;
              const isAttempted = !!(attempt && !attempt.solved && attempt.attempts > 0);
              const isHovered  = hoveredId === problem.id;

              let bg = '#111111', border = '#1e1e1e', iconColor = '#3f3f46';
              if (isSolved)    { bg = '#0a1f0a'; border = '#166534'; iconColor = '#4ade80'; }
              else if (isAttempted) { bg = '#1a150a'; border = '#78350f'; iconColor = '#fbbf24'; }

              return (
                <div
                  key={problem.id}
                  onMouseEnter={() => setHoveredId(problem.id)}
                  onMouseLeave={() => setHoveredId(null)}
                  style={{
                    position: 'relative',
                    width: '34px',
                    height: '34px',
                    borderRadius: '6px',
                    background: isHovered ? (isSolved ? '#0d2b0d' : isAttempted ? '#261e0e' : '#1c1c1c') : bg,
                    border: `1px solid ${border}`,
                    cursor: 'default',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '12px',
                    color: iconColor,
                    transition: 'background 0.1s ease',
                  }}
                >
                  {isSolved ? '✓' : isAttempted ? '~' : ''}
                  {isHovered && (
                    <div style={{
                      position: 'absolute',
                      bottom: 'calc(100% + 6px)',
                      left: '50%',
                      transform: 'translateX(-50%)',
                      background: '#18181b',
                      border: '1px solid #27272a',
                      borderRadius: '8px',
                      padding: '8px 12px',
                      whiteSpace: 'nowrap',
                      zIndex: 20,
                      fontSize: '11px',
                      lineHeight: '1.6',
                      pointerEvents: 'none',
                    }}>
                      <div style={{ color: '#f4f4f5', fontWeight: '600', maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis' }}>{problem.title}</div>
                      <div style={{ color: problem.difficulty === 'Easy' ? '#4ade80' : '#fbbf24' }}>{problem.difficulty} · {problem.pattern}</div>
                      {attempt?.last_attempted_at && (
                        <div style={{ color: '#52525b', marginTop: '1px' }}>
                          Last: {new Date(attempt.last_attempted_at).toLocaleDateString()}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
          <div style={{ display: 'flex', gap: '16px', marginTop: '14px', fontSize: '11px', color: '#52525b' }}>
            {[
              { bg: '#0a1f0a', border: '#166534', text: 'Solved' },
              { bg: '#1a150a', border: '#78350f', text: 'Attempted' },
              { bg: '#111111', border: '#1e1e1e', text: 'Not started' },
            ].map(({ bg: b, border: br, text }) => (
              <span key={text} style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                <span style={{ display: 'inline-block', width: '10px', height: '10px', background: b, border: `1px solid ${br}`, borderRadius: '2px' }} />
                {text}
              </span>
            ))}
          </div>
        </div>

        {/* 90-day heatmap */}
        <div style={card}>
          <div style={label}>Activity — Last 90 Days</div>
          <div style={{ display: 'grid', gridTemplateRows: 'repeat(7, 11px)', gridAutoFlow: 'column', gap: '3px' }}>
            {heatCells.map((cell, i) => (
              <div
                key={i}
                title={cell.date ?? ''}
                style={{
                  width: '11px',
                  height: '11px',
                  borderRadius: '2px',
                  background: !cell.inRange ? 'transparent' : cell.active ? '#3B82F6' : '#1a1f2e',
                }}
              />
            ))}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '10px', fontSize: '11px', color: '#52525b' }}>
            <span>Less</span>
            <div style={{ width: '11px', height: '11px', borderRadius: '2px', background: '#1a1f2e' }} />
            <div style={{ width: '11px', height: '11px', borderRadius: '2px', background: '#3B82F6' }} />
            <span>More</span>
          </div>
        </div>

      </div>
    </div>
  );
}
