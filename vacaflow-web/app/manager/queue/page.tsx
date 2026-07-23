'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import AppLayout from '@/components/layout/AppLayout';
import { requestApi, absenceTypeApi } from '@/lib/api';
import { Request, AbsenceType } from '@/lib/types';
import { formatDate } from '@/lib/utils';
import { getAbsenceTypeEmoji, getAbsenceTypeName } from '@/lib/absenceTypeMapping';

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
    <AppLayout isDarkSidebar={true}>
      <div>
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-h1 font-bold text-text-primary mb-2">Review Queue</h1>
          <p className="text-sm text-text-muted">
            {requests.length} request{requests.length !== 1 ? 's' : ''} awaiting your review
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-status-rejected-bg border border-status-rejected-border rounded-card">
            <p className="text-sm text-status-rejected-text">{error}</p>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="text-center py-8">
            <p className="text-text-muted">Loading requests...</p>
          </div>
        )}

        {/* Empty State */}
        {!loading && requests.length === 0 && (
          <div className="bg-bg-surface border border-border-warm rounded-card p-8 text-center">
            <p className="text-text-muted">No requests to review at this time.</p>
            <Link href="/dashboard" className="text-brand-orange-hover hover:text-brand-orange-deep font-bold text-sm mt-4 inline-block transition">
              ← Back to Dashboard
            </Link>
          </div>
        )}

        {/* Queue Table */}
        {!loading && requests.length > 0 && (
          <div className="bg-bg-surface rounded-card border border-border-warm overflow-hidden">
            {/* Table Header */}
            <div
              className="grid gap-6 px-6 py-4 bg-bg-app border-b border-border-hairline text-xs font-bold tracking-wider uppercase text-text-faint"
              style={{
                gridTemplateColumns: '1.5fr 1.5fr 1.5fr 1.5fr 0.8fr',
              }}
            >
              <div>Employee</div>
              <div>Type</div>
              <div>Dates</div>
              <div>Submitted</div>
              <div className="text-right">Action</div>
            </div>

            {/* Table Body */}
            <div>
              {requests.map((request, index) => {
                const absenceType = getAbsenceType(request.absenceTypeId);
                return (
                  <div
                    key={request.id}
                    className={`
                      grid gap-6 px-6 py-5 items-center border-b border-border-hairline last:border-b-0
                      hover:bg-bg-app transition
                      ${index > 0 ? '' : ''}
                    `}
                    style={{
                      gridTemplateColumns: '1.5fr 1.5fr 1.5fr 1.5fr 0.8fr',
                    }}
                  >
                    {/* Employee */}
                    <div>
                      <p className="text-sm font-bold text-text-primary">Employee</p>
                      <p className="text-xs text-text-faint">{request.employeeId}</p>
                    </div>

                    {/* Type */}
                    <div className="flex items-center gap-2">
                      <span className="text-lg">
                        {absenceType ? getAbsenceTypeEmoji(absenceType.code) : '📝'}
                      </span>
                      <p className="text-sm font-bold text-text-primary">
                        {absenceType ? getAbsenceTypeName(absenceType) : 'Unknown'}
                      </p>
                    </div>

                    {/* Dates */}
                    <div>
                      <p className="text-sm text-text-body">
                        {formatDate(request.startDate)} – {formatDate(request.endDate)}
                      </p>
                    </div>

                    {/* Submitted */}
                    <div>
                      <p className="text-xs text-text-muted">
                        {request.submittedAt ? formatDate(request.submittedAt) : 'Pending'}
                      </p>
                    </div>

                    {/* Action */}
                    <div className="text-right">
                      <Link
                        href={`/manager/review/${request.id}`}
                        className="text-sm font-bold text-brand-orange-hover hover:text-brand-orange-deep transition"
                      >
                        Review ›
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
