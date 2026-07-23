'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import AppLayout from '@/components/layout/AppLayout';
import Icon from '@/components/ui/Icon';
import { requestApi, absenceTypeApi } from '@/lib/api';
import { Request, AbsenceType } from '@/lib/types';
import { formatDate, formatDateRange, calculateWorkingDays } from '@/lib/utils';
import { getAbsenceTypeEmoji, getAbsenceTypeName } from '@/lib/absenceTypeMapping';

function initialsFrom(name?: string): string {
  if (!name) return '—';
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

export default function ManagerQueuePage() {
  const [requests, setRequests] = useState<Request[]>([]);
  const [absenceTypes, setAbsenceTypes] = useState<AbsenceType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [reqs, types] = await Promise.all([
          requestApi.getSubmittedAll(),
          absenceTypeApi.getAll(),
        ]);
        setRequests(reqs);
        setAbsenceTypes(types);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load requests');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const getAbsenceType = (id: string) => absenceTypes.find((t) => t.id === id);

  return (
    <AppLayout>
      {/* Header */}
      <div className="flex items-start justify-between gap-4 mb-8">
        <div>
          <h1 className="text-h1 text-text-primary mb-1">Review Queue</h1>
          <p className="text-sm text-text-muted">
            {requests.length} request{requests.length !== 1 ? 's' : ''} awaiting your review.
          </p>
        </div>
        <div className="flex items-center gap-2.5 bg-status-submitted-bg border border-status-submitted-border rounded-card px-4 py-2.5">
          <span className="w-9 h-9 rounded-[10px] bg-status-submitted-text/10 text-status-submitted-text flex items-center justify-center">
            <Icon name="inbox" size={18} />
          </span>
          <div>
            <p className="text-xl font-extrabold text-text-primary leading-none">{requests.length}</p>
            <p className="text-[11px] text-text-muted mt-0.5">pending</p>
          </div>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="mb-6 p-4 bg-status-rejected-bg border border-status-rejected-border rounded-card">
          <p className="text-sm text-status-rejected-text">{error}</p>
        </div>
      )}

      {/* Loading */}
      {loading && (
        <div className="flex items-center gap-3 text-text-muted py-8">
          <div className="w-5 h-5 border-2 border-border-warm-alt border-t-brand-orange rounded-full animate-spin" />
          <p className="text-sm">Loading requests…</p>
        </div>
      )}

      {/* Empty */}
      {!loading && requests.length === 0 && !error && (
        <div className="bg-bg-surface border border-border-warm rounded-card px-6 py-16 text-center">
          <div className="w-12 h-12 rounded-full bg-status-approved-bg text-status-approved-text flex items-center justify-center mx-auto mb-4">
            <Icon name="check" size={22} />
          </div>
          <h3 className="text-h3 text-text-primary mb-1">All caught up</h3>
          <p className="text-sm text-text-muted mb-4">No requests to review at this time.</p>
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-1.5 text-sm font-bold text-brand-orange-hover hover:text-brand-orange-deep transition"
          >
            <Icon name="arrow-left" size={16} />
            Back to Dashboard
          </Link>
        </div>
      )}

      {/* Table */}
      {!loading && requests.length > 0 && (
        <div className="bg-bg-surface rounded-card border border-border-warm overflow-hidden">
          <div
            className="grid gap-6 px-6 py-3.5 bg-[#FBF8F4] border-b border-border-hairline text-label uppercase text-text-faint"
            style={{ gridTemplateColumns: '1.4fr 1.3fr 1.5fr 1fr 0.7fr' }}
          >
            <div>Employee</div>
            <div>Type</div>
            <div>Dates</div>
            <div>Submitted</div>
            <div className="text-right">Action</div>
          </div>

          <div>
            {requests.map((request) => {
              const absenceType = getAbsenceType(request.absenceTypeId);
              return (
                <Link
                  key={request.id}
                  href={`/manager/review/${request.id}`}
                  className="grid gap-6 px-6 py-4 items-center border-b border-border-hairline last:border-b-0 hover:bg-bg-warm-tint transition"
                  style={{ gridTemplateColumns: '1.4fr 1.3fr 1.5fr 1fr 0.7fr' }}
                >
                  {/* Employee */}
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="w-9 h-9 rounded-avatar-sm bg-bg-orange-tint text-brand-orange flex items-center justify-center text-xs font-bold flex-shrink-0">
                      {initialsFrom(request.employeeName)}
                    </span>
                    <div className="min-w-0">
                      <p className="text-sm font-bold text-text-primary truncate">
                        {request.employeeName ?? 'Unknown'}
                      </p>
                      {request.employeeEmail && (
                        <p className="text-xs text-text-faint truncate">{request.employeeEmail}</p>
                      )}
                    </div>
                  </div>

                  {/* Type */}
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="text-base flex-shrink-0">
                      {absenceType ? getAbsenceTypeEmoji(absenceType.code) : '📝'}
                    </span>
                    <p className="text-sm font-bold text-text-primary truncate">
                      {absenceType ? getAbsenceTypeName(absenceType) : 'Unknown'}
                    </p>
                  </div>

                  {/* Dates */}
                  <div className="min-w-0">
                    <p className="text-sm text-text-body truncate">
                      {formatDateRange(request.startDate, request.endDate)}
                    </p>
                    <p className="text-xs text-text-faint">
                      {calculateWorkingDays(request.startDate, request.endDate)} working days
                    </p>
                  </div>

                  {/* Submitted */}
                  <p className="text-xs text-text-muted">
                    {request.submittedAt ? formatDate(request.submittedAt) : 'Pending'}
                  </p>

                  {/* Action */}
                  <div className="text-right">
                    <span className="inline-flex items-center gap-1 text-sm font-bold text-brand-orange-hover">
                      Review
                      <Icon name="chevron-right" size={14} />
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </AppLayout>
  );
}
