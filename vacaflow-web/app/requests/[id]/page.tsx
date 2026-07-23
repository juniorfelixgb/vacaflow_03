'use client';

import { useEffect, useState, FormEvent } from 'react';
import { useParams } from 'next/navigation';
import AppLayout from '@/components/layout/AppLayout';
import RequestCard from '@/components/ui/RequestCard';
import TimelineStep from '@/components/ui/TimelineStep';
import ReviewerBox from '@/components/ui/ReviewerBox';
import ActionButton from '@/components/ui/ActionButton';
import DateInput from '@/components/forms/DateInput';
import TextArea from '@/components/forms/TextArea';
import StatusPill from '@/components/ui/StatusPill';
import { requestApi, absenceTypeApi } from '@/lib/api';
import { Request, AbsenceType } from '@/lib/types';
import { formatDate, formatDateTime, calculateWorkingDays } from '@/lib/utils';
import { isDraft, isSubmitted } from '@/lib/statusMapping';

interface EditData {
  startDate: string;
  endDate: string;
  reason: string;
}

export default function RequestDetailPage() {
  const { id } = useParams();
  const [request, setRequest] = useState<Request | null>(null);
  const [absenceType, setAbsenceType] = useState<AbsenceType | undefined>(undefined);
  const [allAbsenceTypes, setAllAbsenceTypes] = useState<AbsenceType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState<EditData>({
    startDate: '',
    endDate: '',
    reason: '',
  });
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [req, types] = await Promise.all([
          requestApi.getById(id as string),
          absenceTypeApi.getAll(),
        ]);
        setRequest(req);
        setAllAbsenceTypes(types);
        const type = types.find((t) => t.id === req.absenceTypeId);
        setAbsenceType(type);
        setEditData({
          startDate: req.startDate,
          endDate: req.endDate,
          reason: req.reason,
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

  const handleEditChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setEditData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSaveEdit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setActionLoading(true);
    setError(null);

    try {
      const updated = await requestApi.update(id as string, editData);
      setRequest(updated);
      setIsEditing(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update request');
    } finally {
      setActionLoading(false);
    }
  };

  const handleSubmit = async () => {
    setActionLoading(true);
    setError(null);

    try {
      const updated = await requestApi.submit(id as string);
      setRequest(updated);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to submit request');
    } finally {
      setActionLoading(false);
    }
  };

  const handleCancel = async () => {
    if (!confirm('Are you sure you want to cancel this request?')) return;

    setActionLoading(true);
    setError(null);

    try {
      const updated = await requestApi.cancel(id as string);
      setRequest(updated);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to cancel request');
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return (
      <AppLayout backLink={{ label: 'Back to requests', href: '/requests' }}>
        <div className="text-center py-8">
          <p className="text-text-muted">Loading...</p>
        </div>
      </AppLayout>
    );
  }

  if (!request) {
    return (
      <AppLayout backLink={{ label: 'Back to requests', href: '/requests' }}>
        <p className="text-status-rejected-text">Request not found</p>
      </AppLayout>
    );
  }

  const isDraftStatus = isDraft(request.status);
  const isSubmittedStatus = isSubmitted(request.status);
  const isFinalStatus = ['Approved', 'Rejected', 'Cancelled'].includes(request.status);
  const workingDays = calculateWorkingDays(request.startDate, request.endDate);

  return (
    <AppLayout backLink={{ label: 'Back to requests', href: '/requests' }}>
      <div className="grid grid-cols-[1.55fr_1fr] gap-7">
        {/* Left Column */}
        <div className="space-y-6">
          {/* Error Message */}
          {error && (
            <div className="p-4 bg-status-rejected-bg border border-status-rejected-border rounded-card">
              <p className="text-sm text-status-rejected-text">{error}</p>
            </div>
          )}

          {/* Request Card */}
          {!isEditing ? (
            <RequestCard request={request} absenceType={absenceType} showStatus={true} />
          ) : (
            <form onSubmit={handleSaveEdit} className="bg-bg-surface border border-border-warm rounded-card p-6 space-y-4">
              <DateInput
                label="Start Date"
                name="startDate"
                value={editData.startDate}
                onChange={handleEditChange}
                disabled={actionLoading}
              />
              <DateInput
                label="End Date"
                name="endDate"
                value={editData.endDate}
                onChange={handleEditChange}
                disabled={actionLoading}
              />
              <TextArea
                label="Reason"
                name="reason"
                value={editData.reason}
                onChange={handleEditChange}
                disabled={actionLoading}
              />
              <div className="flex gap-3 pt-4">
                <ActionButton
                  variant="primary"
                  type="submit"
                  disabled={actionLoading}
                  loading={actionLoading}
                  fullWidth
                >
                  Save Changes
                </ActionButton>
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="flex-1 px-6 py-3 rounded-btn font-bold text-sm transition bg-white border-2 border-border-warm text-text-primary hover:border-border-warm-alt disabled:opacity-50"
                >
                  Cancel Edit
                </button>
              </div>
            </form>
          )}

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-3">
            {isDraftStatus && !isEditing && (
              <>
                <ActionButton
                  variant="primary"
                  loading={actionLoading}
                  disabled={actionLoading}
                  onClick={handleSubmit}
                  icon="✈️"
                >
                  Submit for approval
                </ActionButton>
                <ActionButton
                  variant="secondary"
                  disabled={actionLoading}
                  onClick={() => setIsEditing(true)}
                  icon="✏️"
                >
                  Edit
                </ActionButton>
                <ActionButton
                  variant="reject"
                  disabled={actionLoading}
                  onClick={handleCancel}
                  icon="✕"
                >
                  Cancel request
                </ActionButton>
              </>
            )}

            {isSubmittedStatus && (
              <ActionButton
                variant="reject"
                disabled={actionLoading}
                onClick={handleCancel}
                icon="✕"
              >
                Cancel request
              </ActionButton>
            )}

            {isFinalStatus && (
              <p className="text-sm text-text-muted">This request cannot be modified.</p>
            )}
          </div>
        </div>

        {/* Right Column - Timeline */}
        <div className="space-y-6">
          {/* Timeline */}
          <div className="bg-bg-surface border border-border-warm rounded-card p-6">
            <h3 className="text-h3 font-bold text-text-primary mb-6">Request timeline</h3>

            <div className="space-y-2">
              <TimelineStep
                stepNumber={1}
                title="Created as draft"
                timestamp={formatDateTime(request.createdAt)}
                isCompleted={true}
              />

              <TimelineStep
                stepNumber={2}
                title="Submitted for approval"
                timestamp={request.submittedAt ? formatDateTime(request.submittedAt) : undefined}
                isCompleted={!isDraftStatus}
                isPending={isDraftStatus}
              />

              <TimelineStep
                stepNumber={3}
                title="Manager decision"
                timestamp={request.reviewedAt ? formatDateTime(request.reviewedAt) : undefined}
                isCompleted={isFinalStatus}
                isPending={false}
                isLastStep={true}
              />
            </div>
          </div>

          {/* Reviewer Box */}
          <ReviewerBox
            name={request.approverName ?? request.assignedManagerName}
            role={request.approverName ? 'Reviewed this request' : 'Your manager'}
            emptyLabel="Pending manager assignment"
          />
        </div>
      </div>
    </AppLayout>
  );
}
