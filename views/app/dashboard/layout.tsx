'use client';

import { useSession, signOut } from 'next-auth/react';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import axios from 'axios';

const NAV_ITEMS = [
  {
    label: 'Overview',
    href: '/dashboard',
    icon: (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/>
        <rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/>
      </svg>
    ),
  },
  {
    label: 'Problems',
    href: '/dashboard/problems',
    icon: (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/>
        <line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/>
        <line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/>
      </svg>
    ),
  },
  {
    label: 'Profile',
    href: '/dashboard/profile',
    icon: (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
        <circle cx="12" cy="7" r="4"/>
      </svg>
    ),
  },
  {
    label: 'Billing',
    href: '/dashboard/billing',
    icon: (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="1" y="4" width="22" height="16" rx="2" ry="2"/>
        <line x1="1" y1="10" x2="23" y2="10"/>
      </svg>
    ),
  },
  {
    label: 'Settings',
    href: '/dashboard/settings',
    icon: (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="3"/>
        <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/>
      </svg>
    ),
  },
];

const SIDEBAR_W = 220;

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [credits, setCredits] = useState({ daily: 0, pack: 0 });

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  useEffect(() => {
    if (status === 'unauthenticated') router.push('/login');
  }, [status, router]);

  useEffect(() => {
    if (status !== 'authenticated') return;
    const refetch = () => {
      axios.get('/api/credits/balance').then(res => {
        setCredits({ daily: res.data.dailyCredits, pack: res.data.packCredits });
      }).catch(() => {});
    };
    refetch();
    window.addEventListener('credits:refresh', refetch);
    return () => window.removeEventListener('credits:refresh', refetch);
  }, [status]);

  if (status === 'loading') {
    return (
      <div style={{ display: 'flex', height: '100vh', background: '#0B0F19', alignItems: 'center', justifyContent: 'center', color: '#3f3f46', fontSize: '14px', fontFamily: 'system-ui' }}>
        Loading...
      </div>
    );
  }

  if (!session) return null;

  const userName = session.user?.name || session.user?.email || 'User';
  const avatarInitial = userName[0].toUpperCase();
  const totalCredits = credits.daily + credits.pack;

  return (
    <div style={{ display: 'flex', height: '100vh', overflow: 'hidden', background: '#0B0F19', fontFamily: 'system-ui, -apple-system, sans-serif', color: '#f4f4f5' }}>

      {/* Mobile overlay */}
      {isMobile && sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.65)', zIndex: 40 }}
        />
      )}

      {/* Sidebar */}
      <aside style={{
        width: SIDEBAR_W,
        flexShrink: 0,
        background: '#0d1117',
        borderRight: '1px solid #1e1e1e',
        display: 'flex',
        flexDirection: 'column',
        height: '100vh',
        position: 'fixed',
        left: 0,
        top: 0,
        zIndex: 50,
        transform: isMobile && !sidebarOpen ? `translateX(-${SIDEBAR_W}px)` : 'translateX(0)',
        transition: 'transform 0.22s ease',
      }}>

        {/* Logo */}
        <div style={{ padding: '18px 16px 14px', borderBottom: '1px solid #1e1e1e', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <a href="/" style={{ display: 'flex', alignItems: 'center', gap: '8px', textDecoration: 'none' }}>
            <span style={{ color: '#3B82F6', fontWeight: '700', fontSize: '15px', fontFamily: 'monospace' }}>&lt;/&gt;</span>
            <span style={{ fontSize: '14px', fontWeight: '700', color: '#f4f4f5' }}>TutorAI</span>
          </a>
          {isMobile && (
            <button onClick={() => setSidebarOpen(false)} style={{ background: 'transparent', border: 'none', color: '#71717a', cursor: 'pointer', fontSize: '18px', padding: 0 }}>
              ✕
            </button>
          )}
        </div>

        {/* Nav */}
        <nav style={{ flex: 1, padding: '10px 8px', overflowY: 'auto' }}>
          {NAV_ITEMS.map(item => {
            const isActive = pathname === item.href;
            return (
              <a
                key={item.href}
                href={item.href}
                onClick={() => isMobile && setSidebarOpen(false)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  padding: '9px 12px',
                  marginBottom: '2px',
                  borderRadius: '8px',
                  textDecoration: 'none',
                  fontSize: '13px',
                  fontWeight: isActive ? '600' : '400',
                  background: isActive ? 'rgba(59,130,246,0.1)' : 'transparent',
                  color: isActive ? '#3B82F6' : '#71717a',
                  borderLeft: `2px solid ${isActive ? '#3B82F6' : 'transparent'}`,
                  transition: 'all 0.15s ease',
                }}
              >
                {item.icon}
                {item.label}
              </a>
            );
          })}
        </nav>

        {/* Credits badge */}
        <div style={{ padding: '10px 10px 6px', borderTop: '1px solid #1e1e1e' }}>
          <a
            href="/dashboard/billing"
            style={{ display: 'block', background: '#0f1729', borderRadius: '8px', padding: '10px 12px', border: '1px solid #1e3a5f', textDecoration: 'none' }}
          >
            <div style={{ fontSize: '10px', color: '#52525b', marginBottom: '3px', textTransform: 'uppercase', letterSpacing: '0.07em' }}>Credits</div>
            <div style={{ fontSize: '22px', fontWeight: '700', color: '#3B82F6', lineHeight: 1 }}>{totalCredits}</div>
            <div style={{ fontSize: '10px', color: '#3f3f46', marginTop: '3px' }}>{credits.daily} daily · {credits.pack} pack</div>
          </a>
        </div>

        {/* User */}
        <div style={{ padding: '10px 10px 18px', borderTop: '1px solid #1e1e1e', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{ width: '30px', height: '30px', borderRadius: '50%', background: '#0f1729', border: '1px solid #1e3a5f', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: '700', color: '#3B82F6', flexShrink: 0, overflow: 'hidden' }}>
            {session.user?.image
              ? <img src={session.user.image} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              : avatarInitial
            }
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: '12px', fontWeight: '600', color: '#e4e4e7', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {userName.split(' ')[0]}
            </div>
            <div style={{ fontSize: '10px', color: '#52525b', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {session.user?.email}
            </div>
          </div>
          <button
            onClick={() => signOut({ callbackUrl: '/' })}
            title="Sign out"
            style={{ background: 'transparent', border: '1px solid #27272a', borderRadius: '5px', color: '#52525b', cursor: 'pointer', fontSize: '10px', padding: '3px 7px', flexShrink: 0 }}
          >
            Out
          </button>
        </div>
      </aside>

      {/* Main */}
      <div style={{ marginLeft: isMobile ? 0 : SIDEBAR_W, flex: 1, overflow: 'auto', height: '100vh', display: 'flex', flexDirection: 'column' }}>

        {/* Mobile top bar */}
        {isMobile && (
          <div style={{ height: '48px', flexShrink: 0, display: 'flex', alignItems: 'center', padding: '0 16px', borderBottom: '1px solid #1e1e1e', background: '#0d1117', gap: '12px' }}>
            <button
              onClick={() => setSidebarOpen(true)}
              style={{ background: 'transparent', border: 'none', color: '#71717a', cursor: 'pointer', fontSize: '20px', padding: 0 }}
            >
              ☰
            </button>
            <span style={{ color: '#3B82F6', fontWeight: '700', fontSize: '14px', fontFamily: 'monospace' }}>&lt;/&gt;</span>
            <span style={{ fontSize: '14px', fontWeight: '700', color: '#f4f4f5' }}>TutorAI</span>
          </div>
        )}

        <div style={{ flex: 1, overflow: 'auto' }}>
          {children}
        </div>
      </div>
    </div>
  );
}
