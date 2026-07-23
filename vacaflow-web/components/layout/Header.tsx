'use client';

import Link from 'next/link';
import { User } from '@/lib/types';
import Icon from '@/components/ui/Icon';

interface HeaderProps {
  user: User;
  backLink?: {
    label: string;
    href: string;
  };
}

export default function Header({ user, backLink }: HeaderProps) {
  const initials = user.fullName
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  return (
    <div className="px-[36px] py-[18px] border-b border-border-warm-alt2 flex items-center justify-between bg-bg-surface">
      {/* Left: Back link or org name */}
      <div>
        {backLink ? (
          <Link
            href={backLink.href}
            className="inline-flex items-center gap-1.5 text-sm font-medium text-text-muted hover:text-text-primary transition"
          >
            <Icon name="arrow-left" size={16} />
            {backLink.label}
          </Link>
        ) : (
          <p className="text-sm font-medium text-text-muted">IGS Solutions</p>
        )}
      </div>

      {/* Right: User info + Avatar */}
      <div className="flex items-center gap-3">
        <div className="text-right">
          <p className="text-sm font-bold text-text-primary">{user.fullName}</p>
          <p className="text-xs text-text-muted">{user.role}</p>
        </div>
        <div className="w-[38px] h-[38px] bg-bg-orange-tint text-brand-orange rounded-avatar-sm flex items-center justify-center font-bold text-sm">
          {initials}
        </div>
      </div>
    </div>
  );
}
