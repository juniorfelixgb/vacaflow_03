'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import AppLayout from '@/components/layout/AppLayout';
import StatCard from '@/components/ui/StatCard';
import StatusPill from '@/components/ui/StatusPill';
import Icon from '@/components/ui/Icon';
import { userApi, requestApi, absenceTypeApi } from '@/lib/api';
import { User, Request, AbsenceType } from '@/lib/types';
import { formatDate, formatDateRange, calculateWorkingDays } from '@/lib/utils';
import { getAbsenceTypeEmoji, getAbsenceTypeName } from '@/lib/absenceTypeMapping';

function greeting(): string {
  const h = new Date().getHours();
  if (h < 12) return 'Good morning';
  if (h < 18) return 'Good afternoon';
  return 'Good evening';
}

export default function DashboardPage() {
  const [user, setUser] = useState<User | null>(null);
  const [myRequests, setMyRequests] = useState<Request[]>([]);
  const [queue, setQueue] = useState<Request[]>([]);
  const [absenceTypes, setAbsenceTypes] = useState<AbsenceType[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userData = await userApi.getCurrentUser();
        setUser(userData);

        const [reqs, types] = await Promise.all([
          requestApi.getAll().catch(() => []),
          absenceTypeApi.getAll().catch(() => []),
        ]);
        setMyRequests(reqs);
        setAbsenceTypes(types);

        if (userData.role === 'Manager') {
          const submitted = await requestApi.getSubmittedAll().catch(() => []);
          setQueue(submitted);
        }
      } catch (err) {
        console.error('Failed to load dashboard:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const isManager = user?.role === 'Manager';
  const firstName = user?.fullName?.split(' ')[0] ?? '';

  const count = (s: Request['status']) => myRequests.filter((r) => r.status === s).length;
  const getType = (id: string) => absenceTypes.find((t) => t.id === id);

  const recent = [...myRequests]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);

  const queuePreview = queue.slice(0, 5);

  if (loading) {
    return (
      <AppLayout>
        <div className="flex items-center gap-3 text-text-muted py-8">
          <div className="w-5 h-5 border-2 border-border-warm-alt border-t-brand-orange rounded-full animate-spin" />
          <p className="text-sm">Loading your dashboard…</p>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      {/* Greeting */}
      <div className="flex items-start justify-between gap-4 mb-8">
        <div>
          <h1 className="text-h1 text-text-primary mb-1">
            {greeting()}, {firstName}
          </h1>
          <p className="text-sm text-text-muted">
            {isManager
              ? "Here's what needs your attention today."
              : 'Track your absence requests from draft to decision.'}
          </p>
        </div>
        {!isManager && (
          <Link
            href="/requests/new"
            className="inline-flex items-center gap-2 bg-brand-orange hover:bg-brand-orange-hover text-white font-bold text-sm px-5 py-3 rounded-btn shadow-button-orange transition whitespace-nowrap"
          >
            <Icon name="plus" size={16} />
            New Request
          </Link>
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {isManager ? (
          <>
            <StatCard label="Awaiting review" value={queue.length} icon="inbox" tone="amber" hint="Submitted by your team" />
            <StatCard label="My requests" value={myRequests.length} icon="list" tone="orange" />
            <StatCard label="Approved" value={count('Approved')} icon="check-circle" tone="green" />
            <StatCard label="Drafts" value={count('Draft')} icon="file" tone="gray" />
          </>
        ) : (
          <>
            <StatCard label="Pending" value={count('Submitted')} icon="clock" tone="amber" hint="Awaiting decision" />
            <StatCard label="Approved" value={count('Approved')} icon="check-circle" tone="green" />
            <StatCard label="Drafts" value={count('Draft')} icon="file" tone="gray" />
            <StatCard label="Total requests" value={myRequests.length} icon="list" tone="orange" />
          </>
        )}
      </div>

      {/* Two columns */}
      <div className="grid grid-cols-1 lg:grid-cols-[1.6fr_1fr] gap-6">
        {/* Left: activity list */}
        <div className="bg-bg-surface border border-border-warm rounded-card overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4 border-b border-border-hairline">
            <h2 className="text-h3 text-text-primary">
              {isManager ? 'Awaiting your review' : 'Recent requests'}
            </h2>
            <Link
              href={isManager ? '/manager/queue' : '/requests'}
              className="inline-flex items-center gap-1 text-xs font-bold text-brand-orange-hover hover:text-brand-orange-deep transition"
            >
              View all
              <Icon name="chevron-right" size={14} />
            </Link>
          </div>

          <ActivityList
            items={isManager ? queuePreview : recent}
            getType={getType}
            hrefFor={(r) => (isManager ? `/manager/review/${r.id}` : `/requests/${r.id}`)}
            emptyLabel={isManager ? 'No requests awaiting review.' : 'No requests yet.'}
            showStatus={!isManager}
          />
        </div>

        {/* Right: quick actions + tip */}
        <div className="space-y-6">
          <div className="bg-bg-surface border border-border-warm rounded-card p-6">
            <h2 className="text-h3 text-text-primary mb-4">Quick actions</h2>
            <div className="space-y-2">
              {!isManager && (
                <QuickAction href="/requests/new" icon="plus" title="New request" desc="Draft a new absence" />
              )}
              <QuickAction
                href={isManager ? '/manager/queue' : '/requests'}
                icon={isManager ? 'inbox' : 'list'}
                title={isManager ? 'Review queue' : 'My requests'}
                desc={isManager ? 'Approve or reject pending' : 'View and manage requests'}
              />
            </div>
          </div>

          <div className="bg-bg-warm-tint border border-border-warm rounded-card p-6">
            <div className="w-9 h-9 rounded-[10px] bg-bg-orange-tint text-brand-orange flex items-center justify-center mb-3">
              <Icon name="sun" size={18} />
            </div>
            <h3 className="text-h3 text-text-primary mb-2">
              {isManager ? 'Keep the queue moving' : 'Plan ahead'}
            </h3>
            <p className="text-sm text-text-body leading-relaxed">
              {isManager
                ? 'Review requests promptly so your team can plan their time off with confidence.'
                : 'Save requests as drafts and submit when ready. Your manager reviews each submission.'}
            </p>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}

function ActivityList({
  items,
  getType,
  hrefFor,
  emptyLabel,
  showStatus,
}: {
  items: Request[];
  getType: (id: string) => AbsenceType | undefined;
  hrefFor: (r: Request) => string;
  emptyLabel: string;
  showStatus: boolean;
}) {
  if (items.length === 0) {
    return (
      <div className="px-6 py-12 text-center">
        <div className="w-11 h-11 rounded-full bg-bg-warm-tint text-text-faint flex items-center justify-center mx-auto mb-3">
          <Icon name="inbox" size={20} />
        </div>
        <p className="text-sm text-text-muted">{emptyLabel}</p>
      </div>
    );
  }

  return (
    <div>
      {items.map((r) => {
        const type = getType(r.absenceTypeId);
        return (
          <Link
            key={r.id}
            href={hrefFor(r)}
            className="flex items-center gap-4 px-6 py-4 border-b border-border-hairline last:border-b-0 hover:bg-bg-warm-tint transition"
          >
            <div className="w-10 h-10 rounded-[10px] bg-bg-orange-tint flex items-center justify-center text-lg flex-shrink-0">
              {type ? getAbsenceTypeEmoji(type.code) : '📝'}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-bold text-text-primary truncate">
                {type ? getAbsenceTypeName(type) : 'Request'}
              </p>
              <p className="text-xs text-text-faint truncate">
                {formatDateRange(r.startDate, r.endDate)} · {calculateWorkingDays(r.startDate, r.endDate)} working days
              </p>
            </div>
            {showStatus ? (
              <StatusPill status={r.status} />
            ) : (
              <span className="text-xs text-text-faint whitespace-nowrap">
                {r.submittedAt ? formatDate(r.submittedAt) : ''}
              </span>
            )}
            <Icon name="chevron-right" size={16} className="text-text-faint flex-shrink-0" />
          </Link>
        );
      })}
    </div>
  );
}

function QuickAction({
  href,
  icon,
  title,
  desc,
}: {
  href: string;
  icon: 'plus' | 'list' | 'inbox';
  title: string;
  desc: string;
}) {
  return (
    <Link
      href={href}
      className="flex items-center gap-3 p-3 rounded-btn border border-border-warm hover:border-border-warm-alt hover:bg-bg-warm-tint transition group"
    >
      <span className="w-9 h-9 rounded-[10px] bg-bg-orange-tint text-brand-orange flex items-center justify-center flex-shrink-0">
        <Icon name={icon} size={18} />
      </span>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-bold text-text-primary">{title}</p>
        <p className="text-xs text-text-faint truncate">{desc}</p>
      </div>
      <Icon name="arrow-right" size={16} className="text-text-faint group-hover:text-brand-orange transition" />
    </Link>
  );
}
