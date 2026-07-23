'use client';

import { InputHTMLAttributes } from 'react';

interface DateInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

export default function DateInput({ label, error, className = '', ...props }: DateInputProps) {
  return (
    <div className="flex flex-col gap-2">
      <label className="text-label uppercase text-text-faint">{label}</label>
      <input
        type="date"
        className={`
          px-3 py-2 border border-border-warm rounded-btn
          bg-bg-surface text-text-primary
          focus:outline-none focus:ring-2 focus:ring-brand-orange focus:border-brand-orange
          disabled:bg-gray-100 disabled:text-gray-500
          ${error ? 'border-status-rejected-text' : ''}
          ${className}
        `}
        {...props}
      />
      {error && <p className="text-xs text-status-rejected-text">{error}</p>}
    </div>
  );
}
