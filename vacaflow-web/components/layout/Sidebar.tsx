'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { User } from '@/lib/types';

interface SidebarProps {
  user: User;
  isDarkMode?: boolean;
}

export default function Sidebar({ user, isDarkMode = false }: SidebarProps) {
  const pathname = usePathname();
  const isManager = user.role === 'Manager';

  const navItems = [
    {
      label: 'Dashboard',
      href: '/dashboard',
      active: pathname === '/dashboard',
    },
    {
      label: 'My Requests',
      href: '/requests',
      active: pathname.startsWith('/requests') && !pathname.includes('/manager'),
      visible: !isManager,
    },
    {
      label: 'Review Queue',
      href: '/manager/queue',
      active: pathname.includes('/manager'),
      visible: isManager,
    },
  ];

  if (isDarkMode) {
    return (
      <div className="w-sidebar bg-bg-manager-dark text-white px-[18px] py-[26px] flex flex-col">
        {/* Brand */}
        <div className="mb-8">
          <div className="w-[42px] h-[42px] bg-brand-orange rounded-[8px] flex items-center justify-center text-white font-bold text-lg mb-2">
            V
          </div>
          <h1 className="font-bold text-sm">VacaFlow</h1>
        </div>

        {/* Manager Caption */}
        <div className="text-text-muted text-xs font-bold tracking-wider mb-6">
          MANAGER
        </div>

        {/* Navigation */}
        <nav className="space-y-2 flex-1">
          {navItems.map((item) => {
            if (item.visible === false) return null;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`
                  block px-3 py-2 rounded-nav-pill text-sm font-medium transition
                  ${
                    item.active
                      ? 'bg-brand-orange text-white font-bold'
                      : 'text-gray-300 hover:text-white'
                  }
                `}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Bottom Stats Card */}
        <div className="bg-[#292524] rounded-card p-4 text-center">
          <div className="text-3xl font-bold text-white mb-1">3</div>
          <div className="text-xs text-text-muted">requests awaiting your review</div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-sidebar bg-bg-surface border-r border-border-warm px-[18px] py-[26px] flex flex-col">
      {/* Brand */}
      <div className="mb-8">
        <Link
          href="/dashboard"
          className="flex items-center gap-2 hover:opacity-80 transition"
        >
          <div className="w-[42px] h-[42px] bg-brand-orange rounded-[8px] flex items-center justify-center text-white font-bold text-lg">
            V
          </div>
          <h1 className="font-bold text-base">VacaFlow</h1>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="space-y-2 flex-1">
        {navItems.map((item) => {
          if (item.visible === false) return null;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`
                block px-3 py-2 rounded-nav-pill text-sm font-medium transition
                ${
                  item.active
                    ? 'bg-bg-orange-tint text-brand-orange-hover font-bold'
                    : 'text-text-muted hover:text-text-primary'
                }
              `}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Promo Card */}
      {!isManager && (
        <div className="bg-bg-warm-tint border border-border-warm rounded-card p-4">
          <h3 className="font-bold text-sm text-text-primary mb-2">Need time off?</h3>
          <p className="text-xs text-text-muted mb-3">
            Draft it first, submit when ready.
          </p>
          <Link
            href="/requests/new"
            className="block w-full bg-bg-manager-dark text-white text-center py-2 rounded-btn text-xs font-bold hover:opacity-90 transition"
          >
            + New Request
          </Link>
        </div>
      )}
    </div>
  );
}
