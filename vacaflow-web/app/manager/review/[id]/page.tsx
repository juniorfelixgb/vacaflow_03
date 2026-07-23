'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import AppLayout from '@/components/layout/AppLayout';
import ActionButton from '@/components/ui/ActionButton';
import TextArea from '@/components/forms/TextArea';
import ReviewerBox from '@/components/ui/ReviewerBox';
import { requestApi, absenceTypeApi, userApi } from '@/lib/api';
import { Request, AbsenceType, User } from '@/lib/types';
import { formatDate, calculateWorkingDays } from '@/lib/utils';
import { getAbsenceTypeEmoji, getAbsenceTypeName, formatAbsenceTypeWithCode } from '@/lib/absenceTypeMapping';

interface EmployeeInfo {
  name: string;
  department: string;
  initials: string;
}

export default function ManagerReviewPage() {
  const router = useRouter();
  const { id } = useParams();
  const [request, setRequest] = useState<Request | null>(null);
  const [absenceType, setAbsenceType] = useState<AbsenceType | undefined>(undefined);
  const [employee, setEmployee] = useState<EmployeeInfo | null>(null);
  const [manager, setManager] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [comment, setComment] = useState('');
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [req, types, mgr] = await Promise.all([
          requestApi.getById(id as string),
          absenceTypeApi.getAll(),
          userApi.getCurrentUser(),
        ]);

        setRequest(req);
        setManager(mgr);

        const type = types.find((t) => t.id === req.absenceTypeId);
        setAbsenceType(type);

        // Mock employee data - in a real app, this would come from the API
        setEmployee({
          name: 'Alex Morgan',
          department: 'Design Team',
          initials: 'AM',
        });
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load request');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchData();
    }
  }, [id]);

  const handleApprove = async () => {
    setActionLoading(true);
    setError(null);

    try {
      await requestApi.approve(id as string, { comment });
      router.push('/manager/queue');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to approve request');
      setActionLoading(false);
    }
  };

  const handleReject = async () => {
    setActionLoading(true);
    setError(null);

    try {
      await requestApi.reject(id as string, { comment });
      router.push('/manager/queue');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to reject request');
      setActionLoading(false);
    }
  };

  if (loading) {
    return (
      <AppLayout isDarkSidebar={true} backLink={{ label: 'Back to queue', href: '/manager/queue' }}>
        <div className="text-center py-8">
          <p className="text-text-muted">Loading...</p>
        </div>
      </AppLayout>
    );
  }

  if (!request || !employee) {
    return (
      <AppLayout isDarkSidebar={true} backLink={{ label: 'Back to queue', href: '/manager/queue' }}>
        <p className="text-status-rejected-text">Request not found</p>
      </AppLayout>
    );
  }

  const workingDays = calculateWorkingDays(request.startDate, request.endDate);

  return (
    <AppLayout isDarkSidebar={true} backLink={{ label: 'Back to queue', href: '/manager/queue' }}>
      <div className="grid grid-cols-[1fr_1.5fr] gap-7">
        {/* Left Column - Employee Card */}
        <div className="bg-bg-surface border border-border-warm rounded-card p-6">
          {/* Employee Header */}
          <div className="flex items-start gap-3 mb-6 pb-6 border-b border-border-hairline">
            <div className="w-[52px] h-[52px] bg-bg-orange-tint rounded-avatar-md flex items-center justify-center font-bold text-sm text-brand-orange flex-shrink-0">
              {employee.initials}
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-sm text-text-primary">{employee.name}</h3>
              <p className="text-xs text-text-muted">{employee.department} · Employee</p>
            </div>
          </div>

          {/* Absence Type */}
          <div className="mb-4 pb-4 border-b border-border-hairline">
            <p className="text-label uppercase text-text-faint mb-2">Absence type</p>
            <div className="flex items-center gap-2">
              <span className="text-lg">{absenceType ? getAbsenceTypeEmoji(absenceType.code) : '📝'}</span>
              <p className="text-sm font-bold text-text-primary">
                {absenceType ? formatAbsenceTypeWithCode(absenceType) : 'Unknown'}
              </p>
            </div>
          </div>

          {/* Dates */}
          <div className="grid grid-cols-2 gap-3 mb-4 pb-4 border-b border-border-hairline">
            <div>
              <p className="text-xs text-text-faint font-bold tracking-wider uppercase mb-1">Start</p>
              <p className="text-sm font-bold text-text-primary">{formatDate(request.startDate)}</p>
            </div>
            <div>
              <p className="text-xs text-text-faint font-bold tracking-wider uppercase mb-1">End</p>
              <p className="text-sm font-bold text-text-primary">{formatDate(request.endDate)}</p>
            </div>
          </div>

          {/* Total Absence */}
          <div className="bg-bg-orange-tint border border-border-warm rounded-card p-3 mb-4 text-center">
            <p className="text-xs text-text-faint">Total absence</p>
            <p className="text-base font-bold text-brand-orange">{workingDays} working days</p>
          </div>

          {/* Submitted Timestamp */}
          <p className="text-xs text-text-muted">
            Submitted {request.submittedAt ? formatDate(request.submittedAt) : 'pending'} · 09:12
          </p>
        </div>

        {/* Right Column - Review */}
        <div className="space-y-6">
          {/* Header */}
          <div>
            <h2 className="text-h2 font-bold text-text-primary mb-1">Review request</h2>
            <p className="text-sm text-text-muted">
              Read the request and record your decision. The employee will see your comment.
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="p-4 bg-status-rejected-bg border border-status-rejected-border rounded-card">
              <p className="text-sm text-status-rejected-text">{error}</p>
            </div>
          )}

          {/* Reason Card */}
          <div className="bg-bg-surface border border-border-warm rounded-card p-6">
            <p className="text-label uppercase text-text-faint mb-3">Reason from employee</p>
            <p className="text-sm text-text-body leading-relaxed whitespace-pre-wrap">
              {request.reason}
            </p>
          </div>

          {/* Comment Card */}
          <div className="bg-bg-surface border border-border-warm rounded-card p-6">
            <TextArea
              label="Your comment (optional)"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              disabled={actionLoading}
              placeholder="Add any comments about your decision"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <ActionButton
              variant="approve"
              icon="✓"
              fullWidth
              loading={actionLoading}
              disabled={actionLoading}
              onClick={handleApprove}
            >
              Approve
            </ActionButton>
            <ActionButton
              variant="reject"
              icon="✕"
              fullWidth
              loading={actionLoading}
              disabled={actionLoading}
              onClick={handleReject}
            >
              Reject
            </ActionButton>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
