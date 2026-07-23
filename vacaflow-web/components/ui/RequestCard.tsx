'use client';

import { Request, AbsenceType } from '@/lib/types';
import { formatDate, getDayOfWeek, calculateWorkingDays } from '@/lib/utils';
import { getAbsenceTypeEmoji, getAbsenceTypeName } from '@/lib/absenceTypeMapping';

interface RequestCardProps {
  request: Request;
  absenceType: AbsenceType | undefined;
  showStatus?: boolean;
}

export default function RequestCard({
  request,
  absenceType,
  showStatus = false,
}: RequestCardProps) {
  const workingDays = calculateWorkingDays(request.startDate, request.endDate);

  return (
    <div className="bg-bg-surface border border-border-warm rounded-card p-6">
      {/* Header with emoji and title */}
      <div className="flex items-start gap-3 mb-6">
        <div className="w-[42px] h-[42px] bg-bg-orange-tint rounded-[8px] flex items-center justify-center text-2xl flex-shrink-0">
          {absenceType ? getAbsenceTypeEmoji(absenceType.code) : '📝'}
        </div>

        <div className="flex-1">
          <h3 className="text-h3 font-bold text-text-primary">
            {absenceType ? getAbsenceTypeName(absenceType) : 'Unknown'}
          </h3>
          <p className="text-xs text-text-faint mt-1">
            Request RQ-{request.id.substring(request.id.length - 4).toUpperCase()} · created{' '}
            {formatDate(request.createdAt)}
          </p>
        </div>

        {showStatus && (
          <div>
            {/* Status pill would go here */}
          </div>
        )}
      </div>

      {/* Dates Section */}
      <div className="grid grid-cols-2 gap-6 pb-6 border-b border-border-hairline mb-6">
        <div>
          <p className="text-label uppercase text-text-faint mb-2">Start Date</p>
          <p className="text-base font-bold text-text-primary">{formatDate(request.startDate)}</p>
          <p className="text-xs text-text-muted">{getDayOfWeek(request.startDate)}</p>
        </div>

        <div>
          <p className="text-label uppercase text-text-faint mb-2">End Date</p>
          <p className="text-base font-bold text-text-primary">{formatDate(request.endDate)}</p>
          <p className="text-xs text-text-muted">{getDayOfWeek(request.endDate)}</p>
        </div>
      </div>

      {/* Reason Section */}
      <div>
        <p className="text-label uppercase text-text-faint mb-3">Reason</p>
        <p className="text-sm text-text-body leading-relaxed whitespace-pre-wrap">
          {request.reason}
        </p>
      </div>

      {/* Total absence info */}
      {showStatus && (
        <div className="mt-6 pt-6 border-t border-border-hairline">
          <div className="flex justify-between items-center">
            <p className="text-sm text-text-muted">Total absence</p>
            <p className="text-sm font-bold text-brand-orange">{workingDays} working days</p>
          </div>
        </div>
      )}
    </div>
  );
}
