'use client';

import { ReactNode } from 'react';

type ButtonVariant = 'primary' | 'secondary' | 'approve' | 'reject';

interface ActionButtonProps {
  variant: ButtonVariant;
  icon?: string;
  children: ReactNode;
  onClick?: () => void;
  loading?: boolean;
  disabled?: boolean;
  className?: string;
  fullWidth?: boolean;
  type?: 'button' | 'submit' | 'reset';
}

const variantStyles: Record<ButtonVariant, string> = {
  primary:
    'bg-brand-orange hover:bg-brand-orange-hover text-white shadow-button-orange disabled:bg-gray-400',
  secondary:
    'bg-white border-2 border-border-warm text-text-primary hover:border-border-warm-alt disabled:opacity-50',
  approve:
    'bg-status-approved-text hover:bg-[#15803D] text-white shadow-button-green disabled:bg-gray-400',
  reject:
    'bg-white border-2 border-status-rejected-btn-border text-status-rejected-text hover:bg-status-rejected-bg disabled:opacity-50',
};

export default function ActionButton({
  variant,
  icon,
  children,
  onClick,
  loading = false,
  disabled = false,
  className = '',
  fullWidth = false,
  type = 'button',
}: ActionButtonProps) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={`
        px-6 py-3 rounded-btn font-bold text-sm transition
        inline-flex items-center justify-center gap-2
        ${variantStyles[variant]}
        ${fullWidth ? 'w-full' : ''}
        ${disabled || loading ? 'cursor-not-allowed' : 'cursor-pointer'}
        ${className}
      `}
    >
      {icon && <span>{icon}</span>}
      {loading ? 'Processing...' : children}
    </button>
  );
}
