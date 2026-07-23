'use client';

import { ReactNode } from 'react';

interface AuthShellProps {
  title: string;
  subtitle?: string;
  children: ReactNode;
  footer?: ReactNode;
}

export default function AuthShell({ title, subtitle, children, footer }: AuthShellProps) {
  return (
    <div className="min-h-screen bg-bg-page flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        {/* Brand */}
        <div className="flex items-center gap-3 justify-center mb-8">
          <div className="w-[42px] h-[42px] bg-brand-orange rounded-[8px] flex items-center justify-center text-white font-bold text-lg shadow-button-orange">
            V
          </div>
          <span className="font-bold text-lg text-text-primary tracking-tight">VacaFlow</span>
        </div>

        {/* Card */}
        <div className="bg-bg-surface border border-border-warm-alt rounded-frame shadow-frame p-8">
          <h1 className="text-h1 text-text-primary mb-2">{title}</h1>
          {subtitle && <p className="text-sm text-text-muted mb-6">{subtitle}</p>}
          {children}
        </div>

        {/* Footer */}
        {footer && <div className="text-center text-sm text-text-muted mt-6">{footer}</div>}

        <p className="text-center text-xs text-text-faint mt-8">
          For IGS Solutions employees
        </p>
      </div>
    </div>
  );
}
