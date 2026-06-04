'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function DashboardProfilePage() {
  const router = useRouter();
  useEffect(() => { router.replace('/profile'); }, [router]);
  return (
    <div style={{ padding: '48px', color: '#52525b', fontSize: '13px' }}>Redirecting to profile...</div>
  );
}
