'use client';

import Link from 'next/link';
import { Request, AbsenceType } from '@/lib/types';
import { formatDate, calculateWorkingDays } from '@/lib/utils';
import { getAbsenceTypeEmoji, getAbsenceTypeName } from '@/lib/absenceTypeMapping';
import StatusPill from './StatusPill';

interface RequestTableProps {
  requests: Request[];
  absenceTypes: AbsenceType[];
}

export default function RequestTable({ requests, absenceTypes }: RequestTableProps) {
  const getAbsenceType = (id: string) => absenceTypes.find((t) => t.id === id);

  return (
    <div className="bg-bg-surface rounded-card border border-border-warm overflow-hidden">
      {/* Table Header */}
      <div
        className="grid gap-6 px-6 py-4 bg-bg-app border-b border-border-hairline text-xs font-bold tracking-wider uppercase text-text-faint"
        style={{
          gridTemplateColumns: '1.6fr 1.7fr 1fr 1fr 0.7fr',
        }}
      >
        <div>Type</div>
        <div>Dates</div>
        <div>Status</div>
        <div>Created</div>
        <div className="text-right">Action</div>
      </div>

      {/* Table Body */}
      <div>
        {requests.map((request, index) => {
          const absenceType = getAbsenceType(request.absenceTypeId);
          const workingDays = calculateWorkingDays(request.startDate, request.endDate);

          return (
            <div
              key={request.id}
              className={`
                grid gap-6 px-6 py-5 items-center border-b border-border-hairline last:border-b-0
                hover:bg-bg-app transition
                ${index > 0 ? '' : ''}
              `}
              style={{
                gridTemplateColumns: '1.6fr 1.7fr 1fr 1fr 0.7fr',
              }}
            >
              {/* Type Cell */}
              <div className="flex items-start gap-3">
                <div className="w-[34px] h-[34px] bg-bg-orange-tint rounded-[8px] flex items-center justify-center text-xl flex-shrink-0">
                  {absenceType ? getAbsenceTypeEmoji(absenceType.code) : '📝'}
                </div>
                <div>
                  <p className="text-sm font-bold text-text-primary">
                    {absenceType ? getAbsenceTypeName(absenceType) : 'Unknown'}
                  </p>
                  <p className="text-xs text-text-faint">RQ-{request.id.substring(request.id.length - 4).toUpperCase()}</p>
                </div>
              </div>

              {/* Dates Cell */}
              <div>
                <p className="text-sm text-text-body">
                  {formatDate(request.startDate)} – {formatDate(request.endDate)}
                </p>
                <p className="text-xs text-text-faint">{workingDays} working days</p>
              </div>

              {/* Status Cell */}
              <div>
                <StatusPill status={request.status} />
              </div>

              {/* Created Cell */}
              <div>
                <p className="text-xs text-text-muted">{formatDate(request.createdAt)}</p>
              </div>

              {/* Action Cell */}
              <div className="text-right">
                <Link
                  href={`/requests/${request.id}`}
                  className="text-sm font-bold text-brand-orange-hover hover:text-brand-orange-deep transition"
                >
                  View ›
                </Link>
              </div>
            </div>
          );
        })}

        {requests.length === 0 && (
          <div className="px-6 py-8 text-center text-text-muted">
            <p className="text-sm">No requests found</p>
          </div>
        )}
      </div>
    </div>
  );
}
