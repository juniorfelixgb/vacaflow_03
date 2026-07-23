'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { User } from '@/lib/types';
import Icon, { IconName } from '@/components/ui/Icon';

interface SidebarProps {
  user: User;
}

export default function Sidebar({ user }: SidebarProps) {
  const pathname = usePathname();
  const isManager = user.role === 'Manager';

  const initials = user.fullName
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  const navItems: {
    label: string;
    href: string;
    icon: IconName;
    active: boolean;
    visible?: boolean;
  }[] = [
    {
      label: 'Dashboard',
      href: '/dashboard',
      icon: 'dashboard',
      active: pathname === '/dashboard',
    },
    {
      label: 'My Requests',
      href: '/requests',
      icon: 'list',
      active: pathname.startsWith('/requests'),
      visible: !isManager,
    },
    {
      label: 'Review Queue',
      href: '/manager/queue',
      icon: 'inbox',
      active: pathname.startsWith('/manager'),
      visible: isManager,
    },
  ];

  return (
    <div className="w-sidebar bg-bg-surface border-r border-border-warm px-[18px] py-[24px] flex flex-col">
      {/* Brand */}
      <Link
        href="/dashboard"
        className="flex items-center gap-2.5 px-2 mb-8 hover:opacity-80 transition"
      >
        <div className="w-[38px] h-[38px] bg-brand-orange rounded-[10px] flex items-center justify-center text-white font-bold text-lg shadow-button-orange">
          V
        </div>
        <span className="font-bold text-base text-text-primary tracking-tight">VacaFlow</span>
      </Link>

      {/* Navigation */}
      <nav className="space-y-1 flex-1">
        {navItems.map((item) => {
          if (item.visible === false) return null;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`
                flex items-center gap-3 px-3 py-2.5 rounded-nav-pill text-sm transition
                ${
                  item.active
                    ? 'bg-bg-orange-tint text-brand-orange-hover font-bold'
                    : 'text-text-muted hover:bg-bg-warm-tint hover:text-text-primary font-medium'
                }
              `}
            >
              <Icon name={item.icon} size={18} />
              {item.label}
            </Link>
          );
        })}

        {!isManager && (
          <Link
            href="/requests/new"
            className="flex items-center gap-3 px-3 py-2.5 rounded-nav-pill text-sm font-medium text-text-muted hover:bg-bg-warm-tint hover:text-text-primary transition"
          >
            <Icon name="plus" size={18} />
            New Request
          </Link>
        )}
      </nav>

      {/* User block + logout */}
      <div className="mt-4 pt-4 border-t border-border-warm">
        <div className="flex items-center gap-2.5 px-2 mb-2">
          <div className="w-[36px] h-[36px] bg-bg-orange-tint text-brand-orange rounded-avatar-sm flex items-center justify-center font-bold text-xs flex-shrink-0">
            {initials}
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-xs font-bold text-text-primary truncate">{user.fullName}</p>
            <p className="text-[11px] text-text-faint">{user.role}</p>
          </div>
        </div>
        <Link
          href="/logout"
          className="flex items-center gap-3 px-3 py-2.5 rounded-nav-pill text-sm font-medium text-text-muted hover:bg-status-rejected-bg hover:text-status-rejected-text transition"
        >
          <Icon name="logout" size={18} />
          Sign out
        </Link>
      </div>
    </div>
  );
}
