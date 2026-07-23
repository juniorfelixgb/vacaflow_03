import { RequestStatus } from '@/lib/types';

interface StatusPillProps {
  status: RequestStatus;
  className?: string;
}

const statusStyles: Record<RequestStatus, { bg: string; text: string; border: string; dot: string }> = {
  Draft: {
    bg: 'bg-status-draft-bg',
    text: 'text-status-draft-text',
    border: 'border-status-draft-border',
    dot: 'bg-status-draft-dot',
  },
  Submitted: {
    bg: 'bg-status-submitted-bg',
    text: 'text-status-submitted-text',
    border: 'border-status-submitted-border',
    dot: 'bg-status-submitted-dot',
  },
  Approved: {
    bg: 'bg-status-approved-bg',
    text: 'text-status-approved-text',
    border: 'border-status-approved-border',
    dot: 'bg-status-approved-dot',
  },
  Rejected: {
    bg: 'bg-status-rejected-bg',
    text: 'text-status-rejected-text',
    border: 'border-status-rejected-border',
    dot: 'bg-status-rejected-text',
  },
  Cancelled: {
    bg: 'bg-status-cancelled-bg',
    text: 'text-status-cancelled-text',
    border: 'border-status-cancelled-border',
    dot: 'bg-status-cancelled-dot',
  },
};

export default function StatusPill({ status, className = '' }: StatusPillProps) {
  const style = statusStyles[status];

  return (
    <span
      className={`
        inline-flex items-center gap-2 px-3 py-1 rounded-full
        text-xs font-bold border
        ${style.bg} ${style.text} ${style.border}
        ${className}
      `}
    >
      <span className={`w-2 h-2 rounded-full ${style.dot}`} />
      {status}
    </span>
  );
}
