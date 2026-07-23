'use client';

import { TextareaHTMLAttributes } from 'react';

interface TextAreaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
  error?: string;
}

export default function TextArea({
  label,
  error,
  className = '',
  ...props
}: TextAreaProps) {
  return (
    <div className="flex flex-col gap-2">
      <label className="text-label uppercase text-text-faint">{label}</label>
      <textarea
        className={`
          px-3 py-2 border border-border-warm rounded-btn
          bg-bg-surface text-text-primary
          focus:outline-none focus:ring-2 focus:ring-brand-orange focus:border-brand-orange
          disabled:bg-gray-100 disabled:text-gray-500
          resize-none min-h-[96px]
          ${error ? 'border-status-rejected-text' : ''}
          ${className}
        `}
        {...props}
      />
      {error && <p className="text-xs text-status-rejected-text">{error}</p>}
    </div>
  );
}
