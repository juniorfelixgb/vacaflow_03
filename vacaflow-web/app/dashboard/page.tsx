'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import AppLayout from '@/components/layout/AppLayout';
import { userApi } from '@/lib/api';
import { User } from '@/lib/types';

export default function DashboardPage() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userData = await userApi.getCurrentUser();
        setUser(userData);
      } catch (err) {
        console.error('Failed to fetch current user:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  const isManager = user?.role === 'Manager';

  if (loading) {
    return (
      <AppLayout>
        <div className="text-center py-8">
          <p className="text-text-muted">Loading...</p>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div>
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-h1 font-bold text-text-primary mb-2">Dashboard</h1>
          {user && (
            <p className="text-sm text-text-muted">
              Welcome, <span className="font-bold text-text-primary">{user.fullName}</span> ({user.role})
            </p>
          )}
        </div>

        {/* Quick Actions Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* My Requests Card */}
          <Link href="/requests">
            <div className="bg-bg-surface border border-border-warm rounded-card p-6 hover:shadow-frame transition cursor-pointer h-full">
              <div className="flex items-start gap-4 mb-4">
                <div className="w-12 h-12 bg-bg-orange-tint rounded-card flex items-center justify-center text-xl">
                  📋
                </div>
                <div className="flex-1">
                  <h2 className="text-h3 font-bold text-text-primary mb-2">My Requests</h2>
                  <p className="text-sm text-text-muted">
                    View, create, and manage your absence requests
                  </p>
                </div>
              </div>
              <p className="text-sm font-bold text-brand-orange-hover">View requests ›</p>
            </div>
          </Link>

          {/* Manager Review Queue Card */}
          {isManager && (
            <Link href="/manager/queue">
              <div className="bg-bg-surface border border-border-warm rounded-card p-6 hover:shadow-frame transition cursor-pointer h-full">
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-12 h-12 bg-status-submitted-bg rounded-card flex items-center justify-center text-xl">
                    ✓
                  </div>
                  <div className="flex-1">
                    <h2 className="text-h3 font-bold text-text-primary mb-2">Review Queue</h2>
                    <p className="text-sm text-text-muted">
                      Review and approve/reject pending requests from your team
                    </p>
                  </div>
                </div>
                <p className="text-sm font-bold text-status-submitted-text">Review requests ›</p>
              </div>
            </Link>
          )}
        </div>

        {/* Getting Started Card */}
        <div className="bg-bg-warm-tint border border-border-warm rounded-card p-6">
          <h3 className="text-h3 font-bold text-text-primary mb-4">Getting Started</h3>
          <ul className="text-sm text-text-body space-y-2 list-inside list-disc">
            <li>Create a new absence request by clicking "My Requests"</li>
            <li>Save requests as drafts before submitting for approval</li>
            <li>Submit requests for your manager's review</li>
            {isManager && <li>Review submitted requests from your team members</li>}
            {isManager && <li>Approve or reject requests with optional comments</li>}
          </ul>
        </div>
      </div>
    </AppLayout>
  );
}
