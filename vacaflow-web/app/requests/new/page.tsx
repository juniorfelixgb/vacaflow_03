'use client';

import { useState, useEffect, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import AppLayout from '@/components/layout/AppLayout';
import ActionButton from '@/components/ui/ActionButton';
import DateInput from '@/components/forms/DateInput';
import TextArea from '@/components/forms/TextArea';
import { absenceTypeApi, requestApi } from '@/lib/api';
import { AbsenceType } from '@/lib/types';
import { getAbsenceTypeEmoji, getAbsenceTypeName } from '@/lib/absenceTypeMapping';

interface FormData {
  absenceTypeId: string;
  startDate: string;
  endDate: string;
  reason: string;
}

export default function NewRequestPage() {
  const router = useRouter();
  const [absenceTypes, setAbsenceTypes] = useState<AbsenceType[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<FormData>({
    absenceTypeId: '',
    startDate: '',
    endDate: '',
    reason: '',
  });

  useEffect(() => {
    const fetchAbsenceTypes = async () => {
      try {
        const types = await absenceTypeApi.getAll();
        setAbsenceTypes(types);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load absence types');
      }
    };

    fetchAbsenceTypes();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError(null);
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Client-side validation
      if (!formData.absenceTypeId) {
        throw new Error('Absence type is required');
      }
      if (!formData.startDate) {
        throw new Error('Start date is required');
      }
      if (!formData.endDate) {
        throw new Error('End date is required');
      }
      if (!formData.reason.trim()) {
        throw new Error('Reason is required');
      }

      const today = new Date().toISOString().split('T')[0];
      if (formData.startDate < today) {
        throw new Error('Start date cannot be in the past');
      }
      if (formData.endDate < formData.startDate) {
        throw new Error('End date must be on or after start date');
      }

      const result = await requestApi.create(formData);
      router.push(`/requests/${result.id}`);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to create request';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const selectedAbsenceType = absenceTypes.find((t) => t.id === formData.absenceTypeId);

  return (
    <AppLayout backLink={{ label: 'Back to requests', href: '/requests' }}>
      <div className="max-w-2xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-h1 font-bold text-text-primary mb-2">Create Request</h1>
          <p className="text-sm text-text-muted">
            Draft your absence request. You can edit it before submitting.
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-status-rejected-bg border border-status-rejected-border rounded-card">
            <p className="text-sm text-status-rejected-text">{error}</p>
          </div>
        )}

        {/* Form Card */}
        <form onSubmit={handleSubmit} className="bg-bg-surface border border-border-warm rounded-card p-6 space-y-6">
          {/* Absence Type Selection */}
          <div>
            <label htmlFor="absenceTypeId" className="block text-label uppercase text-text-faint mb-3">
              Absence Type
            </label>
            <select
              id="absenceTypeId"
              name="absenceTypeId"
              value={formData.absenceTypeId}
              onChange={handleChange}
              disabled={loading}
              className="w-full px-3 py-2 border border-border-warm rounded-btn bg-bg-surface text-text-primary focus:outline-none focus:ring-2 focus:ring-brand-orange disabled:bg-gray-100"
            >
              <option value="">Select absence type</option>
              {absenceTypes.map((type) => (
                <option key={type.id} value={type.id}>
                  {getAbsenceTypeEmoji(type.code)} {getAbsenceTypeName(type)}
                </option>
              ))}
            </select>
          </div>

          {/* Absence Type Preview */}
          {selectedAbsenceType && (
            <div className="bg-bg-orange-tint border border-border-warm rounded-card p-4 flex items-center gap-3">
              <span className="text-2xl">{getAbsenceTypeEmoji(selectedAbsenceType.code)}</span>
              <div>
                <p className="text-sm font-bold text-text-primary">
                  {getAbsenceTypeName(selectedAbsenceType)}
                </p>
                <p className="text-xs text-text-faint">{selectedAbsenceType.code.toUpperCase()}</p>
              </div>
            </div>
          )}

          {/* Dates */}
          <div className="grid grid-cols-2 gap-4">
            <DateInput
              label="Start Date"
              name="startDate"
              value={formData.startDate}
              onChange={handleChange}
              disabled={loading}
            />
            <DateInput
              label="End Date"
              name="endDate"
              value={formData.endDate}
              onChange={handleChange}
              disabled={loading}
            />
          </div>

          {/* Reason */}
          <TextArea
            label="Reason"
            name="reason"
            value={formData.reason}
            onChange={handleChange}
            disabled={loading}
            placeholder="Provide details about your request..."
          />

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <ActionButton
              variant="primary"
              type="submit"
              loading={loading}
              disabled={loading}
              fullWidth
            >
              Create Request
            </ActionButton>
            <Link href="/requests" className="flex-1">
              <button
                type="button"
                className="w-full px-6 py-3 rounded-btn font-bold text-sm transition bg-white border-2 border-border-warm text-text-primary hover:border-border-warm-alt disabled:opacity-50"
              >
                Cancel
              </button>
            </Link>
          </div>
        </form>
      </div>
    </AppLayout>
  );
}
