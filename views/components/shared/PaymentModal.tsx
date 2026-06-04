'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import axios from 'axios';
import type { Pack, Tier } from '@/lib/pricing';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  type: 'pack' | 'subscription';
  item: Pack | Tier;
}

function loadRazorpayScript(): Promise<void> {
  return new Promise((resolve) => {
    if (document.getElementById('razorpay-checkout-js')) { resolve(); return; }
    const s = document.createElement('script');
    s.id = 'razorpay-checkout-js';
    s.src = 'https://checkout.razorpay.com/v1/checkout.js';
    s.onload = () => resolve();
    document.body.appendChild(s);
  });
}

export default function PaymentModal({ isOpen, onClose, type, item }: Props) {
  const { data: session } = useSession();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      setSuccess(false);
      setError(null);
      setLoading(false);
      loadRazorpayScript();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const isPack = type === 'pack';
  const pack = isPack ? (item as Pack) : null;
  const tier = !isPack ? (item as Tier) : null;

  async function handlePay() {
    setLoading(true);
    setError(null);

    let orderData: any;
    try {
      const body = isPack ? { type: 'pack', packId: item.id } : { type: 'subscription', planId: item.id };
      const res = await axios.post('/api/payments/create-order', body);
      orderData = res.data;
    } catch (e: any) {
      setError(e?.response?.data?.error ?? 'Could not create order. Please try again.');
      setLoading(false);
      return;
    }

    const RazorpayClass = (window as any).Razorpay;
    if (!RazorpayClass) {
      setError('Payment SDK failed to load. Please refresh and try again.');
      setLoading(false);
      return;
    }

    const rzp = new RazorpayClass({
      key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
      order_id: orderData.orderId,
      amount: orderData.amount,
      currency: orderData.currency,
      name: orderData.name,
      description: orderData.description,
      theme: { color: '#2563eb' },
      prefill: {
        email: session?.user?.email ?? '',
        name: session?.user?.name ?? '',
      },
      modal: {
        ondismiss: () => setLoading(false),
      },
      handler: async (response: any) => {
        try {
          const verifyBody: any = {
            razorpay_order_id: response.razorpay_order_id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature: response.razorpay_signature,
            type,
          };
          if (isPack) verifyBody.packId = item.id;
          else verifyBody.planId = item.id;

          await axios.post('/api/payments/verify', verifyBody);

          setSuccess(true);
          window.dispatchEvent(new CustomEvent('credits:refresh'));
          setTimeout(() => { onClose(); }, 1200);
        } catch (e: any) {
          setError(e?.response?.data?.error ?? 'Payment verification failed. Contact support.');
          setLoading(false);
        }
      },
    });

    rzp.open();
  }

  const overlay: React.CSSProperties = {
    position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', zIndex: 100,
    display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px',
  };
  const card: React.CSSProperties = {
    background: '#0d1117', border: '1px solid #1e1e1e', borderRadius: '14px',
    padding: '28px 24px', width: '100%', maxWidth: '400px', position: 'relative',
  };

  return (
    <div style={overlay} onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div style={card}>
        <button
          onClick={onClose}
          style={{ position: 'absolute', top: '14px', right: '16px', background: 'transparent', border: 'none', color: '#52525b', cursor: 'pointer', fontSize: '18px', lineHeight: 1 }}
        >
          ✕
        </button>

        <div style={{ fontSize: '11px', color: '#52525b', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: '6px' }}>
          {isPack ? 'Credit Pack' : 'Subscription'}
        </div>
        <div style={{ fontSize: '20px', fontWeight: '700', color: '#f4f4f5', marginBottom: '4px' }}>{item.label}</div>

        {isPack && pack && (
          <div style={{ fontSize: '13px', color: '#71717a', marginBottom: '16px' }}>{pack.credits} credits · {pack.perCredit} per credit</div>
        )}
        {!isPack && tier && (
          <ul style={{ margin: '0 0 16px', padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '5px' }}>
            {tier.features.map(f => (
              <li key={f} style={{ fontSize: '12px', color: '#71717a', display: 'flex', gap: '7px' }}>
                <span style={{ color: '#4ade80', flexShrink: 0 }}>✓</span>{f}
              </li>
            ))}
          </ul>
        )}

        <div style={{ fontSize: '32px', fontWeight: '700', color: '#3B82F6', marginBottom: '20px', lineHeight: 1 }}>
          ₹{item.priceINR}
          {!isPack && <span style={{ fontSize: '13px', fontWeight: '400', color: '#52525b' }}>/month</span>}
        </div>

        {error && (
          <div style={{ background: '#2a0a0a', border: '1px solid #7f1d1d', borderRadius: '8px', padding: '10px 12px', fontSize: '12px', color: '#f87171', marginBottom: '14px' }}>
            {error}
          </div>
        )}

        {success ? (
          <div style={{ background: '#0a1f0a', border: '1px solid #166534', borderRadius: '8px', padding: '12px', fontSize: '13px', color: '#4ade80', textAlign: 'center', fontWeight: '600' }}>
            Payment successful ✓
          </div>
        ) : (
          <button
            onClick={handlePay}
            disabled={loading}
            style={{
              width: '100%', padding: '11px', borderRadius: '8px', border: 'none',
              background: loading ? '#1e3a5f' : '#2563eb', color: loading ? '#71717a' : '#fff',
              fontSize: '14px', fontWeight: '600', cursor: loading ? 'not-allowed' : 'pointer',
              transition: 'background 0.15s',
            }}
          >
            {loading ? 'Processing…' : `Pay ₹${item.priceINR}`}
          </button>
        )}
      </div>
    </div>
  );
}
