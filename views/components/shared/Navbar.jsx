'use client';

import { useState } from 'react';
import { Menu, X } from 'lucide-react';
import { useSession, signOut } from 'next-auth/react';

const NAV_LINKS = [
  { label: 'Features', href: '#features' },
  { label: 'How It Works', href: '#how-it-works' },
  { label: 'Demo', href: '#demo' },
  { label: 'Pricing', href: '#pricing' },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const { data: session } = useSession();

  function scrollTo(e, href) {
    e.preventDefault();
    setOpen(false);
    document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' });
  }

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/5 bg-[#0B0F19]/80 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">

        <a href="/" className="flex items-center gap-2 font-bold text-white text-lg">
          <div className="w-8 h-8 rounded-lg bg-electric-blue flex items-center justify-center text-sm font-mono">
            {'</>'}
          </div>
          TutorAI
        </a>

        <div className="hidden md:flex items-center gap-8">
          {NAV_LINKS.map(l => (
            <a key={l.label} href={l.href} onClick={e => scrollTo(e, l.href)} className="text-sm text-white/60 hover:text-white transition-colors">
              {l.label}
            </a>
          ))}
        </div>

        {/* Desktop auth */}
        <div className="hidden md:flex items-center gap-3">
          {session ? (
            <div className="relative">
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center gap-2 hover:opacity-80 transition-opacity"
              >
                <img
                  src={session.user?.image || '/default-avatar.png'}
                  alt={session.user?.name ?? ''}
                  className="w-8 h-8 rounded-full border border-white/20"
                />
                <span className="text-sm text-white/80">
                  {session.user?.name?.split(' ')[0]}
                </span>
              </button>
              {dropdownOpen && (
                <div className="absolute top-full right-0 mt-2 bg-[#0d0d0d] border border-white/10 rounded-xl py-1 min-w-[140px] shadow-xl">
                  <button
                    onClick={() => { signOut({ callbackUrl: '/' }); setDropdownOpen(false); }}
                    className="w-full text-left px-4 py-2 text-sm text-white/60 hover:text-white hover:bg-white/5 transition-colors"
                  >
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <a href="/login" className="text-sm text-white/60 hover:text-white transition-colors">
                Log in
              </a>
              <a href="/signup" className="bg-electric-blue hover:bg-blue-400 text-white px-5 py-2 rounded-full text-sm font-semibold transition-all">
                Sign up
              </a>
            </div>
          )}
        </div>

        <button onClick={() => setOpen(!open)} className="md:hidden text-white/60" style={{ touchAction: 'manipulation', cursor: 'pointer' }}>
          {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile menu */}
      <div
        className="md:hidden bg-[#0B0F19] border-t border-white/5 px-6 py-4 flex flex-col gap-4"
        style={{
          opacity: open ? 1 : 0,
          pointerEvents: open ? 'auto' : 'none',
          transform: open ? 'translateY(0)' : 'translateY(-8px)',
          transition: 'opacity 0.15s ease, transform 0.15s ease',
          position: 'absolute',
          top: '64px',
          left: 0,
          right: 0,
        }}
      >
        {NAV_LINKS.map(l => (
          <a key={l.label} href={l.href} onClick={e => scrollTo(e, l.href)} className="text-sm text-white/60 hover:text-white">
            {l.label}
          </a>
        ))}
        {session ? (
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <img
                src={session.user?.image || '/default-avatar.png'}
                alt={session.user?.name ?? ''}
                className="w-8 h-8 rounded-full border border-white/20"
              />
              <span className="text-sm text-white/80">{session.user?.name?.split(' ')[0]}</span>
            </div>
            <button
              onClick={() => signOut({ callbackUrl: '/' })}
              className="text-sm text-white/40 hover:text-white transition-colors"
            >
              Sign Out
            </button>
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            <a href="/login" className="text-sm text-white/60 hover:text-white transition-colors text-center py-2">
              Log in
            </a>
            <a href="/signup" className="bg-electric-blue text-white px-5 py-2 rounded-full text-sm font-semibold text-center">
              Sign up free
            </a>
          </div>
        )}
      </div>
    </nav>
  );
}
