import { RequestStatus } from './types';

export interface StatusColors {
  pillBg: string;
  pillText: string;
  dotColor: string;
  borderColor: string;
}

export function getStatusColors(status: RequestStatus): StatusColors {
  switch (status) {
    case 'Draft':
      return {
        pillBg: 'status-draft-bg',
        pillText: 'status-draft-text',
        dotColor: 'status-draft-dot',
        borderColor: 'status-draft-border',
      };
    case 'Submitted':
      return {
        pillBg: 'status-submitted-bg',
        pillText: 'status-submitted-text',
        dotColor: 'status-submitted-dot',
        borderColor: 'status-submitted-border',
      };
    case 'Approved':
      return {
        pillBg: 'status-approved-bg',
        pillText: 'status-approved-text',
        dotColor: 'status-approved-dot',
        borderColor: 'status-approved-border',
      };
    case 'Rejected':
      return {
        pillBg: 'status-rejected-bg',
        pillText: 'status-rejected-text',
        dotColor: 'status-rejected-text',
        borderColor: 'status-rejected-border',
      };
    case 'Cancelled':
      return {
        pillBg: 'status-cancelled-bg',
        pillText: 'status-cancelled-text',
        dotColor: 'status-cancelled-dot',
        borderColor: 'status-cancelled-border',
      };
    default:
      return {
        pillBg: 'bg-gray-100',
        pillText: 'text-gray-800',
        dotColor: 'text-gray-400',
        borderColor: 'border-gray-200',
      };
  }
}

export function getStatusLabel(status: RequestStatus): string {
  return status;
}

export function isStatusTerminal(status: RequestStatus): boolean {
  return ['Approved', 'Rejected', 'Cancelled'].includes(status);
}

export function isDraft(status: RequestStatus): boolean {
  return status === 'Draft';
}

export function isSubmitted(status: RequestStatus): boolean {
  return status === 'Submitted';
}
