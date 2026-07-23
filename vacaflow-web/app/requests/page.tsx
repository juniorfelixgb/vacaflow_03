'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import AppLayout from '@/components/layout/AppLayout';
import FilterTabs from '@/components/ui/FilterTabs';
import RequestTable from '@/components/ui/RequestTable';
import ActionButton from '@/components/ui/ActionButton';
import { requestApi, absenceTypeApi } from '@/lib/api';
import { Request, AbsenceType, RequestStatus } from '@/lib/types';

export default function RequestsPage() {
  const [requests, setRequests] = useState<Request[]>([]);
  const [absenceTypes, setAbsenceTypes] = useState<AbsenceType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeFilter, setActiveFilter] = useState('All');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [reqs, types] = await Promise.all([
          requestApi.getAll(),
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

  const getFilteredRequests = () => {
    if (activeFilter === 'All') return requests;
    if (activeFilter === 'Closed')
      return requests.filter((r) => r.status === 'Rejected' || r.status === 'Cancelled');
    return requests.filter((r) => r.status === activeFilter);
  };

  const filteredRequests = getFilteredRequests();

  const filterTabs = [
    { id: 'All', label: 'All', count: requests.length },
    { id: 'Draft', label: 'Draft', count: requests.filter((r) => r.status === 'Draft').length },
    {
      id: 'Submitted',
      label: 'Submitted',
      count: requests.filter((r) => r.status === 'Submitted').length,
    },
    {
      id: 'Approved',
      label: 'Approved',
      count: requests.filter((r) => r.status === 'Approved').length,
    },
    {
      id: 'Closed',
      label: 'Closed',
      count: requests.filter((r) => r.status === 'Rejected' || r.status === 'Cancelled').length,
    },
  ];

  return (
    <AppLayout>
      <div>
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-h1 font-bold text-text-primary mb-2">My Requests</h1>
          <p className="text-sm text-text-muted mb-6">
            Track your absence requests from draft to decision.
          </p>

          <div className="flex justify-end">
            <Link href="/requests/new">
              <ActionButton variant="primary" fullWidth={false}>
                + New Request
              </ActionButton>
            </Link>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-status-rejected-bg border border-border-warm rounded-card">
            <p className="text-sm text-status-rejected-text">{error}</p>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="text-center py-8">
            <p className="text-text-muted">Loading requests...</p>
          </div>
        )}

        {/* Content */}
        {!loading && (
          <>
            {/* Filter Tabs */}
            <FilterTabs
              tabs={filterTabs}
              activeTab={activeFilter}
              onChange={setActiveFilter}
            />

            {/* Request Table */}
            <RequestTable requests={filteredRequests} absenceTypes={absenceTypes} />
          </>
        )}
      </div>
    </AppLayout>
  );
}
