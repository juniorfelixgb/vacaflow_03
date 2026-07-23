'use client';

import Link from 'next/link';
import { User } from '@/lib/types';

interface HeaderProps {
  user: User;
  backLink?: {
    label: string;
    href: string;
  };
  isDarkSidebar?: boolean;
}

export default function Header({ user, backLink, isDarkSidebar = false }: HeaderProps) {
  const initials = user.fullName
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase();

  const avatarBgColor = isDarkSidebar ? 'bg-gray-600' : 'bg-bg-orange-tint';
  const avatarTextColor = isDarkSidebar ? 'text-white' : 'text-brand-orange';

  return (
    <div
      className={`
        px-[36px] py-[20px] border-b border-border-warm-alt2 flex items-center justify-between
        ${isDarkSidebar ? 'bg-bg-manager-dark' : 'bg-bg-surface'}
      `}
    >
      {/* Left: Back link or org name */}
      <div>
        {backLink ? (
          <Link
            href={backLink.href}
            className={`
              text-sm font-medium transition hover:opacity-80
              ${isDarkSidebar ? 'text-gray-300' : 'text-text-muted'}
            `}
          >
            ← {backLink.label}
          </Link>
        ) : (
          <p className={`text-sm font-medium ${isDarkSidebar ? 'text-gray-400' : 'text-text-muted'}`}>
            IGS Solutions
          </p>
        )}
      </div>

      {/* Right: User info + Avatar */}
      <div className="flex items-center gap-3">
        <div className="text-right">
          <p
            className={`text-sm font-bold ${isDarkSidebar ? 'text-white' : 'text-text-primary'}`}
          >
            {user.fullName}
          </p>
          <p
            className={`text-xs ${isDarkSidebar ? 'text-gray-400' : 'text-text-muted'}`}
          >
            {user.role}
          </p>
        </div>
        <div
          className={`
            w-[38px] h-[38px] ${avatarBgColor} ${avatarTextColor}
            rounded-avatar-sm flex items-center justify-center
            font-bold text-sm
          `}
        >
          {initials}
        </div>
      </div>
    </div>
  );
}
