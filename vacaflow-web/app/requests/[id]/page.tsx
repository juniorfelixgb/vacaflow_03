'use client';

import { useEffect, useState, FormEvent } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';

interface Request {
  id: string;
  absenceTypeId: string;
  startDate: string;
  endDate: string;
  reason: string;
  status: string;
  approvalComment?: string;
  createdAt: string;
}

interface EditData {
  startDate: string;
  endDate: string;
  reason: string;
}

export default function RequestDetailPage() {
  const router = useRouter();
  const { id } = useParams();
  const [request, setRequest] = useState<Request | null>(null);
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
    const fetchRequest = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/requests/${id}`, {
          credentials: 'include',
        });

        if (!response.ok) {
          throw new Error('Failed to fetch request');
        }

        const data = await response.json();
        setRequest(data);
        setEditData({
          startDate: data.startDate,
          endDate: data.endDate,
          reason: data.reason,
        });
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load request');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchRequest();
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
      const response = await fetch(`http://localhost:5000/api/requests/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(editData),
      });

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.message || 'Failed to update request');
      }

      const updated = await response.json();
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
      const response = await fetch(`http://localhost:5000/api/requests/${id}/submit`, {
        method: 'POST',
        credentials: 'include',
      });

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.message || 'Failed to submit request');
      }

      const updated = await response.json();
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
      const response = await fetch(`http://localhost:5000/api/requests/${id}/cancel`, {
        method: 'POST',
        credentials: 'include',
      });

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.message || 'Failed to cancel request');
      }

      const updated = await response.json();
      setRequest(updated);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to cancel request');
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return <div className="min-h-screen bg-gray-50 p-8 flex items-center justify-center">Loading...</div>;
  }

  if (!request) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-2xl mx-auto">
          <p className="text-red-800">Request not found</p>
          <Link href="/requests" className="text-blue-600 hover:underline mt-4">
            Back to requests
          </Link>
        </div>
      </div>
    );
  }

  const isDraft = request.status === 'Draft';
  const isSubmitted = request.status === 'Submitted';
  const isFinal = ['Approved', 'Rejected', 'Cancelled'].includes(request.status);

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-2xl mx-auto">
        <Link href="/requests" className="text-blue-600 hover:underline mb-4 inline-block">
          ← Back to requests
        </Link>

        <h1 className="text-4xl font-bold text-gray-900 mb-8">Request Details</h1>

        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-md">
            <p className="text-red-800">{error}</p>
          </div>
        )}

        <div className="bg-white rounded-lg shadow p-8 space-y-6">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm text-gray-600">Status</p>
              <p className="text-lg font-semibold text-gray-900">{request.status}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Created</p>
              <p className="text-lg font-semibold text-gray-900">
                {new Date(request.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>

          {isEditing && isDraft ? (
            <form onSubmit={handleSaveEdit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 mb-1">
                    Start Date
                  </label>
                  <input
                    type="date"
                    id="startDate"
                    name="startDate"
                    value={editData.startDate}
                    onChange={handleEditChange}
                    disabled={actionLoading}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label htmlFor="endDate" className="block text-sm font-medium text-gray-700 mb-1">
                    End Date
                  </label>
                  <input
                    type="date"
                    id="endDate"
                    name="endDate"
                    value={editData.endDate}
                    onChange={handleEditChange}
                    disabled={actionLoading}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
              <div>
                <label htmlFor="reason" className="block text-sm font-medium text-gray-700 mb-1">
                  Reason
                </label>
                <textarea
                  id="reason"
                  name="reason"
                  value={editData.reason}
                  onChange={handleEditChange}
                  disabled={actionLoading}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="flex gap-4">
                <button
                  type="submit"
                  disabled={actionLoading}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-semibold py-2 rounded-md"
                >
                  {actionLoading ? 'Saving...' : 'Save Changes'}
                </button>
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-900 font-semibold py-2 rounded-md"
                >
                  Cancel Edit
                </button>
              </div>
            </form>
          ) : (
            <>
              <div className="grid grid-cols-2 gap-6 border-t pt-6">
                <div>
                  <p className="text-sm text-gray-600">Start Date</p>
                  <p className="text-lg font-semibold text-gray-900">{request.startDate}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">End Date</p>
                  <p className="text-lg font-semibold text-gray-900">{request.endDate}</p>
                </div>
              </div>

              <div className="border-t pt-6">
                <p className="text-sm text-gray-600">Reason</p>
                <p className="text-gray-900 whitespace-pre-wrap">{request.reason}</p>
              </div>

              {request.approvalComment && (
                <div className="border-t pt-6 bg-blue-50 p-4 rounded">
                  <p className="text-sm text-gray-600">Manager Comment</p>
                  <p className="text-gray-900">{request.approvalComment}</p>
                </div>
              )}
            </>
          )}

          <div className="border-t pt-6 flex gap-3 flex-wrap">
            {isDraft && !isEditing && (
              <>
                <button
                  onClick={() => setIsEditing(true)}
                  disabled={actionLoading}
                  className="bg-gray-600 hover:bg-gray-700 disabled:bg-gray-400 text-white font-semibold py-2 px-4 rounded-md"
                >
                  Edit
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={actionLoading}
                  className="bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white font-semibold py-2 px-4 rounded-md"
                >
                  {actionLoading ? 'Submitting...' : 'Submit'}
                </button>
                <button
                  onClick={handleCancel}
                  disabled={actionLoading}
                  className="bg-red-600 hover:bg-red-700 disabled:bg-gray-400 text-white font-semibold py-2 px-4 rounded-md"
                >
                  Cancel Request
                </button>
              </>
            )}
            {isSubmitted && (
              <button
                onClick={handleCancel}
                disabled={actionLoading}
                className="bg-red-600 hover:bg-red-700 disabled:bg-gray-400 text-white font-semibold py-2 px-4 rounded-md"
              >
                Cancel Request
              </button>
            )}
            {isFinal && (
              <p className="text-sm text-gray-600">This request cannot be modified.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
