'use client';

import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { TIERS, PACKS } from '@/lib/pricing';
import PaymentModal from '@/components/shared/PaymentModal';

interface Transaction {
  id: string;
  amount: number;
  type: string;
  description: string;
  created_at: string;
}

export default function BillingPage() {
  const { data: session, status } = useSession();
  const [credits, setCredits] = useState({ daily: 0, dailyLimit: 5, pack: 0, resetAt: null as string | null });
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState<{ type: 'pack' | 'subscription'; item: any } | null>(null);

  useEffect(() => {
    if (status !== 'authenticated' || !session) return;
    Promise.all([
      axios.get('/api/credits/balance'),
      axios.get('/api/billing/transactions'),
    ]).then(([cRes, tRes]) => {
      setCredits({ daily: cRes.data.dailyCredits, dailyLimit: cRes.data.dailyLimit, pack: cRes.data.packCredits, resetAt: cRes.data.resetAt });
      setTransactions(tRes.data.transactions ?? []);
    }).finally(() => setLoading(false));
  }, [status, session]);

  useEffect(() => {
    const refetch = () => {
      axios.get('/api/credits/balance').then(res => {
        setCredits(c => ({ ...c, daily: res.data.dailyCredits, dailyLimit: res.data.dailyLimit, pack: res.data.packCredits, resetAt: res.data.resetAt }));
      }).catch(() => {});
    };
    window.addEventListener('credits:refresh', refetch);
    return () => window.removeEventListener('credits:refresh', refetch);
  }, []);

  const resetInH = credits.resetAt ? Math.max(0, Math.round((new Date(credits.resetAt).getTime() - Date.now()) / 3_600_000)) : null;
  const totalCredits = credits.daily + credits.pack;

  const card: React.CSSProperties = { background: '#0d1117', borderRadius: '12px', border: '1px solid #1e1e1e', padding: '20px' };
  const label: React.CSSProperties = { fontSize: '10px', color: '#52525b', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: '8px' };

  if (loading) return <div style={{ padding: '48px', color: '#52525b', fontSize: '13px' }}>Loading...</div>;

  return (
    <div style={{ padding: '28px 32px', maxWidth: '900px' }}>

      <h1 style={{ fontSize: '20px', fontWeight: '700', color: '#f4f4f5', marginBottom: '20px' }}>Billing</h1>

      {/* Plan + Credits */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '20px' }}>

        <div style={card}>
          <div style={label}>Current Plan</div>
          <div style={{ fontSize: '22px', fontWeight: '700', color: '#f4f4f5', marginBottom: '6px' }}>Free</div>
          <div style={{ display: 'inline-block', fontSize: '10px', padding: '2px 8px', borderRadius: '4px', background: '#0a1f0a', color: '#4ade80', border: '1px solid #166534', marginBottom: '12px' }}>Active</div>
          <div style={{ fontSize: '12px', color: '#52525b', lineHeight: '1.6' }}>5 AI interactions / day<br />All 35 problems<br />All 5 tutor modes</div>
        </div>

        <div style={card}>
          <div style={label}>Credits</div>
          <div style={{ fontSize: '30px', fontWeight: '700', color: '#3B82F6', lineHeight: 1, marginBottom: '4px' }}>{totalCredits}</div>
          <div style={{ fontSize: '11px', color: '#52525b', marginBottom: '12px' }}>total available</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px' }}>
              <span style={{ color: '#71717a' }}>Daily credits</span>
              <span style={{ color: '#e4e4e7', fontWeight: '600' }}>{credits.daily} / {credits.dailyLimit}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px' }}>
              <span style={{ color: '#71717a' }}>Pack credits</span>
              <span style={{ color: '#e4e4e7', fontWeight: '600' }}>{credits.pack}</span>
            </div>
            {resetInH !== null && (
              <div style={{ fontSize: '10px', color: '#3f3f46', marginTop: '4px' }}>Daily credits reset in ~{resetInH}h</div>
            )}
          </div>
        </div>
      </div>

      {/* Subscription Tiers */}
      <div style={{ marginBottom: '24px' }}>
        <div style={{ fontSize: '14px', fontWeight: '600', color: '#e4e4e7', marginBottom: '12px' }}>Subscription Plans</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
          {TIERS.map((tier: any) => (
            <div key={tier.id} style={{ ...card, position: 'relative', border: tier.highlight ? '1px solid #3B82F6' : '1px solid #1e1e1e', padding: '18px' }}>
              {tier.badge && (
                <div style={{ position: 'absolute', top: '-10px', left: '50%', transform: 'translateX(-50%)', fontSize: '9px', padding: '2px 10px', borderRadius: '10px', background: '#3B82F6', color: '#fff', fontWeight: '700', whiteSpace: 'nowrap' }}>
                  {tier.badge}
                </div>
              )}
              <div style={{ fontSize: '13px', fontWeight: '700', color: '#f4f4f5', marginBottom: '4px' }}>{tier.label}</div>
              <div style={{ fontSize: '22px', fontWeight: '700', color: tier.highlight ? '#3B82F6' : '#f4f4f5', lineHeight: 1 }}>
                ₹{tier.priceINR}<span style={{ fontSize: '11px', fontWeight: '400', color: '#52525b' }}>{tier.period}</span>
              </div>
              <div style={{ fontSize: '10px', color: '#52525b', marginBottom: '12px', marginTop: '2px' }}>{tier.subtitle}</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', marginBottom: '14px' }}>
                {tier.features.map((f: string) => (
                  <div key={f} style={{ fontSize: '11px', color: '#71717a', display: 'flex', gap: '6px', alignItems: 'flex-start' }}>
                    <span style={{ color: '#4ade80', flexShrink: 0 }}>✓</span>{f}
                  </div>
                ))}
              </div>
              {tier.id === 'free' ? (
                <button
                  onClick={() => window.location.href = tier.cta.href}
                  style={{ width: '100%', padding: '8px', borderRadius: '7px', border: '1px solid #27272a', background: 'transparent', color: '#e4e4e7', fontSize: '12px', fontWeight: '600', cursor: 'pointer' }}
                >
                  {tier.cta.label}
                </button>
              ) : (
                <button
                  onClick={() => setModal({ type: 'subscription', item: tier })}
                  style={{ width: '100%', padding: '8px', borderRadius: '7px', border: tier.highlight ? 'none' : '1px solid #27272a', background: tier.highlight ? '#3B82F6' : 'transparent', color: tier.highlight ? '#fff' : '#e4e4e7', fontSize: '12px', fontWeight: '600', cursor: 'pointer' }}
                >
                  {tier.cta.label}
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Credit Packs */}
      <div style={{ marginBottom: '24px' }}>
        <div style={{ fontSize: '14px', fontWeight: '600', color: '#e4e4e7', marginBottom: '12px' }}>Credit Packs <span style={{ fontSize: '11px', fontWeight: '400', color: '#52525b' }}>— never expire</span></div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
          {PACKS.map((pack: any) => (
            <div key={pack.id} style={{ ...card, position: 'relative', border: pack.popular ? '1px solid #3B82F6' : '1px solid #1e1e1e', padding: '14px 16px' }}>
              {pack.popular && (
                <div style={{ position: 'absolute', top: '-9px', left: '50%', transform: 'translateX(-50%)', fontSize: '9px', padding: '2px 8px', borderRadius: '10px', background: '#3B82F6', color: '#fff', fontWeight: '700', whiteSpace: 'nowrap' }}>Popular</div>
              )}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                <span style={{ fontSize: '12px', fontWeight: '700', color: '#f4f4f5' }}>{pack.credits} credits</span>
                {pack.savings && <span style={{ fontSize: '9px', padding: '1px 6px', borderRadius: '4px', background: '#0a1f0a', color: '#4ade80', border: '1px solid #166534' }}>{pack.savings}</span>}
              </div>
              <div style={{ fontSize: '18px', fontWeight: '700', color: '#f4f4f5', marginBottom: '2px' }}>₹{pack.priceINR}</div>
              <div style={{ fontSize: '10px', color: '#52525b', marginBottom: '12px' }}>{pack.perCredit} per credit{pack.sublabel ? ` · ${pack.sublabel}` : ''}</div>
              <button
                onClick={() => setModal({ type: 'pack', item: pack })}
                style={{ width: '100%', padding: '7px', borderRadius: '6px', border: '1px solid #27272a', background: 'transparent', color: '#e4e4e7', fontSize: '11px', fontWeight: '600', cursor: 'pointer' }}
              >
                Buy ₹{pack.priceINR}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Transaction History */}
      <div>
        <div style={{ fontSize: '14px', fontWeight: '600', color: '#e4e4e7', marginBottom: '12px' }}>Transaction History</div>
        <div style={{ background: '#0d1117', borderRadius: '12px', border: '1px solid #1e1e1e', overflow: 'hidden' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 120px 80px', padding: '9px 16px', borderBottom: '1px solid #1e1e1e', fontSize: '10px', color: '#52525b', textTransform: 'uppercase', letterSpacing: '0.07em' }}>
            <div>Description</div>
            <div>Date</div>
            <div style={{ textAlign: 'right' }}>Amount</div>
          </div>
          {transactions.length === 0 ? (
            <div style={{ padding: '32px', textAlign: 'center', color: '#3f3f46', fontSize: '13px' }}>No transactions yet.</div>
          ) : transactions.map((tx, i) => (
            <div key={tx.id} style={{ display: 'grid', gridTemplateColumns: '1fr 120px 80px', padding: '11px 16px', borderBottom: i < transactions.length - 1 ? '1px solid #111827' : 'none', alignItems: 'center' }}>
              <div style={{ fontSize: '12px', color: '#e4e4e7', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', paddingRight: '8px' }}>{tx.description}</div>
              <div style={{ fontSize: '11px', color: '#52525b' }}>{new Date(tx.created_at).toLocaleDateString()}</div>
              <div style={{ fontSize: '12px', fontWeight: '600', color: tx.amount > 0 ? '#4ade80' : '#f87171', textAlign: 'right' }}>
                {tx.amount > 0 ? '+' : ''}{tx.amount}
              </div>
            </div>
          ))}
        </div>
      </div>

      {modal && (
        <PaymentModal
          isOpen
          onClose={() => setModal(null)}
          type={modal.type}
          item={modal.item}
        />
      )}

    </div>
  );
}
