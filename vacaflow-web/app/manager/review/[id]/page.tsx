'use client';

import { useEffect, useState, FormEvent } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';

interface Request {
  id: string;
  employeeId: string;
  absenceTypeId: string;
  startDate: string;
  endDate: string;
  reason: string;
  status: string;
  submittedAt: string;
}

interface ReviewData {
  comment: string;
}

export default function ManagerReviewPage() {
  const router = useRouter();
  const { id } = useParams();
  const [request, setRequest] = useState<Request | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [reviewData, setReviewData] = useState<ReviewData>({ comment: '' });
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

  const handleCommentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setReviewData({ comment: e.target.value });
  };

  const handleApprove = async () => {
    setActionLoading(true);
    setError(null);

    try {
      const response = await fetch(`http://localhost:5000/api/requests/${id}/approve`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(reviewData),
      });

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.message || 'Failed to approve request');
      }

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
      const response = await fetch(`http://localhost:5000/api/requests/${id}/reject`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(reviewData),
      });

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.message || 'Failed to reject request');
      }

      router.push('/manager/queue');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to reject request');
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
          <Link href="/manager/queue" className="text-blue-600 hover:underline mt-4">
            Back to queue
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-2xl mx-auto">
        <Link href="/manager/queue" className="text-blue-600 hover:underline mb-4 inline-block">
          ← Back to queue
        </Link>

        <h1 className="text-4xl font-bold text-gray-900 mb-8">Review Request</h1>

        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-md">
            <p className="text-red-800">{error}</p>
          </div>
        )}

        <div className="bg-white rounded-lg shadow p-8 space-y-6">
          <div className="border-b pb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Request Details</h2>
            <div className="grid grid-cols-2 gap-6">
              <div>
                <p className="text-sm text-gray-600">Employee</p>
                <p className="text-lg font-semibold text-gray-900">{request.employeeId}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Absence Type</p>
                <p className="text-lg font-semibold text-gray-900">{request.absenceTypeId}</p>
              </div>
            </div>
          </div>

          <div className="border-b pb-6">
            <div className="grid grid-cols-2 gap-6">
              <div>
                <p className="text-sm text-gray-600">Start Date</p>
                <p className="text-lg font-semibold text-gray-900">{request.startDate}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">End Date</p>
                <p className="text-lg font-semibold text-gray-900">{request.endDate}</p>
              </div>
            </div>
          </div>

          <div className="border-b pb-6">
            <p className="text-sm text-gray-600 mb-2">Reason</p>
            <p className="text-gray-900 whitespace-pre-wrap">{request.reason}</p>
          </div>

          <div>
            <label htmlFor="comment" className="block text-sm font-medium text-gray-700 mb-2">
              Your Comment (Optional)
            </label>
            <textarea
              id="comment"
              value={reviewData.comment}
              onChange={handleCommentChange}
              disabled={actionLoading}
              rows={4}
              placeholder="Add any comments about your decision"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
            />
          </div>

          <div className="flex gap-3 pt-6">
            <button
              onClick={handleApprove}
              disabled={actionLoading}
              className="flex-1 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white font-semibold py-3 rounded-md transition"
            >
              {actionLoading ? 'Processing...' : '✓ Approve'}
            </button>
            <button
              onClick={handleReject}
              disabled={actionLoading}
              className="flex-1 bg-red-600 hover:bg-red-700 disabled:bg-gray-400 text-white font-semibold py-3 rounded-md transition"
            >
              {actionLoading ? 'Processing...' : '✗ Reject'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
