'use client';

import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { PROBLEMS } from '@/lib/problems';

interface Attempt {
  problem_id: string;
  attempts: number;
  solved: boolean;
  last_attempted_at: string;
}

export default function ProblemsPage() {
  const { data: session, status } = useSession();
  const [attempts, setAttempts] = useState<Attempt[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [diffFilter, setDiffFilter] = useState('All');
  const [patternFilter, setPatternFilter] = useState('All');

  useEffect(() => {
    if (status !== 'authenticated' || !session) return;
    const userId = (session.user as any).id;
    axios.get(`/api/attempts/${userId}`)
      .then(res => setAttempts(res.data.attempts ?? []))
      .finally(() => setLoading(false));
  }, [status, session]);

  const attemptMap = new Map(attempts.map(a => [a.problem_id, a]));
  const patterns = [...new Set((PROBLEMS as any[]).map((p: any) => p.pattern))].sort();

  const filtered = (PROBLEMS as any[]).filter((p: any) => {
    if (search && !p.title.toLowerCase().includes(search.toLowerCase())) return false;
    if (diffFilter !== 'All' && p.difficulty !== diffFilter) return false;
    if (patternFilter !== 'All' && p.pattern !== patternFilter) return false;
    return true;
  });

  const solvedCount = attempts.filter(a => a.solved).length;

  const inp: React.CSSProperties = {
    background: '#0d1117', border: '1px solid #1e1e1e', borderRadius: '8px',
    color: '#f4f4f5', fontSize: '13px', padding: '8px 12px', outline: 'none',
  };

  function StatusDot({ id }: { id: string }) {
    const att = attemptMap.get(id);
    if (att?.solved) return <span style={{ color: '#4ade80', fontSize: '15px' }}>✓</span>;
    if (att?.attempts) return <span style={{ color: '#fbbf24', fontSize: '13px' }}>~</span>;
    return <span style={{ color: '#27272a', fontSize: '13px' }}>○</span>;
  }

  function diffBadge(d: string): React.CSSProperties {
    const easy = d === 'Easy';
    return { fontSize: '11px', padding: '2px 8px', borderRadius: '4px', background: easy ? '#0a1f0a' : '#1a150a', color: easy ? '#4ade80' : '#fbbf24', border: `1px solid ${easy ? '#166534' : '#78350f'}` };
  }

  return (
    <div style={{ padding: '28px 32px', maxWidth: '900px' }}>

      <h1 style={{ fontSize: '20px', fontWeight: '700', color: '#f4f4f5', marginBottom: '20px' }}>Problems</h1>

      {/* Filter bar */}
      <div style={{ display: 'flex', gap: '10px', marginBottom: '12px', flexWrap: 'wrap' }}>
        <input
          type="text"
          placeholder="Search problems..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{ ...inp, flex: '1', minWidth: '160px' }}
        />
        <select value={diffFilter} onChange={e => setDiffFilter(e.target.value)} style={{ ...inp, cursor: 'pointer' }}>
          <option>All</option>
          <option>Easy</option>
          <option>Medium</option>
        </select>
        <select value={patternFilter} onChange={e => setPatternFilter(e.target.value)} style={{ ...inp, cursor: 'pointer' }}>
          <option>All</option>
          {patterns.map((p: any) => <option key={p}>{p}</option>)}
        </select>
      </div>

      <div style={{ marginBottom: '10px', fontSize: '12px', color: '#52525b' }}>
        Showing {filtered.length} of {PROBLEMS.length} problems · {solvedCount} solved
      </div>

      {/* Table */}
      <div style={{ background: '#0d1117', borderRadius: '12px', border: '1px solid #1e1e1e', overflow: 'hidden' }}>

        <div style={{ display: 'grid', gridTemplateColumns: '36px 1fr 90px 120px 120px', padding: '9px 16px', borderBottom: '1px solid #1e1e1e', fontSize: '10px', color: '#52525b', textTransform: 'uppercase', letterSpacing: '0.07em' }}>
          <div></div>
          <div>Title</div>
          <div>Difficulty</div>
          <div>Pattern</div>
          <div>Last Attempted</div>
        </div>

        {loading ? (
          <div style={{ padding: '40px', textAlign: 'center', color: '#52525b', fontSize: '13px' }}>Loading...</div>
        ) : filtered.length === 0 ? (
          <div style={{ padding: '40px', textAlign: 'center', color: '#52525b', fontSize: '13px' }}>No problems match your filters.</div>
        ) : filtered.map((prob: any, i: number) => {
          const att = attemptMap.get(prob.id);
          return (
            <a
              key={prob.id}
              href={`/compiler?problem=${prob.id}`}
              style={{ display: 'grid', gridTemplateColumns: '36px 1fr 90px 120px 120px', padding: '11px 16px', borderBottom: i < filtered.length - 1 ? '1px solid #111827' : 'none', textDecoration: 'none', transition: 'background 0.1s ease' }}
              onMouseEnter={e => (e.currentTarget.style.background = '#111827')}
              onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
            >
              <div style={{ display: 'flex', alignItems: 'center' }}><StatusDot id={prob.id} /></div>
              <div style={{ display: 'flex', alignItems: 'center', fontSize: '13px', color: '#e4e4e7', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', paddingRight: '8px' }}>{prob.title}</div>
              <div style={{ display: 'flex', alignItems: 'center' }}><span style={diffBadge(prob.difficulty)}>{prob.difficulty}</span></div>
              <div style={{ display: 'flex', alignItems: 'center', fontSize: '11px', color: '#52525b', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{prob.pattern}</div>
              <div style={{ display: 'flex', alignItems: 'center', fontSize: '11px', color: '#52525b' }}>
                {att?.last_attempted_at ? new Date(att.last_attempted_at).toLocaleDateString() : '—'}
              </div>
            </a>
          );
        })}
      </div>
    </div>
  );
}
