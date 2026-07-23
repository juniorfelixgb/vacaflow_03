'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function LogoutPage() {
  const router = useRouter();

  useEffect(() => {
    const logout = async () => {
      try {
        await fetch('http://localhost:5000/api/auth/logout', {
          method: 'POST',
          credentials: 'include',
        });
      } catch (err) {
        console.error('Logout error:', err);
      }
      router.push('/');
    };

    logout();
  }, [router]);

  return (
    <div className="min-h-screen bg-bg-page flex items-center justify-center p-6">
      <div className="text-center">
        {/* Brand */}
        <div className="flex items-center gap-3 justify-center mb-6">
          <div className="w-[42px] h-[42px] bg-brand-orange rounded-[8px] flex items-center justify-center text-white font-bold text-lg shadow-button-orange">
            V
          </div>
          <span className="font-bold text-lg text-text-primary tracking-tight">VacaFlow</span>
        </div>
        <p className="text-sm text-text-muted">Signing you out…</p>
      </div>
    </div>
  );
}
