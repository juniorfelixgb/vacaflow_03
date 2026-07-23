'use client';

import { InputHTMLAttributes } from 'react';

interface TextInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  hint?: string;
}

export default function TextInput({
  label,
  error,
  hint,
  className = '',
  ...props
}: TextInputProps) {
  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={props.id} className="text-label uppercase text-text-faint">
        {label}
      </label>
      <input
        className={`
          px-3.5 py-2.5 border border-border-warm rounded-btn
          bg-bg-surface text-text-primary text-sm
          placeholder:text-text-faint
          focus:outline-none focus:ring-2 focus:ring-brand-orange focus:border-brand-orange
          disabled:bg-bg-warm-tint disabled:text-text-faint
          transition
          ${error ? 'border-status-rejected-text' : ''}
          ${className}
        `}
        {...props}
      />
      {hint && !error && <p className="text-xs text-text-faint">{hint}</p>}
      {error && <p className="text-xs text-status-rejected-text">{error}</p>}
    </div>
  );
}
