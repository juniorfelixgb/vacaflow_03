'use client';

import { ReactNode, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { userApi } from '@/lib/api';
import { User } from '@/lib/types';
import Sidebar from './Sidebar';
import Header from './Header';

interface AppLayoutProps {
  children: ReactNode;
  isDarkSidebar?: boolean;
  backLink?: {
    label: string;
    href: string;
  };
}

export default function AppLayout({
  children,
  isDarkSidebar = false,
  backLink,
}: AppLayoutProps) {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userData = await userApi.getCurrentUser();
        setUser(userData);
      } catch (error) {
        console.error('Failed to fetch user:', error);
        router.push('/login');
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [router]);

  if (loading || !user) {
    return (
      <div className="min-h-screen bg-bg-page flex items-center justify-center">
        <p className="text-text-muted">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bg-page flex items-center justify-center p-4">
      <div
        className={`
          w-full max-w-app-frame bg-bg-app rounded-frame border border-border-warm
          shadow-frame flex min-h-[820px] overflow-hidden
        `}
      >
        {/* Sidebar */}
        <Sidebar user={user} isDarkMode={isDarkSidebar} />

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col">
          {/* Header */}
          <Header user={user} backLink={backLink} isDarkSidebar={isDarkSidebar} />

          {/* Content */}
          <div className="flex-1 bg-bg-surface overflow-y-auto">
            <div className="px-[40px] py-[34px]">{children}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
