'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

interface CurrentUser {
  id: string;
  fullName: string;
  email: string;
  role: string;
}

export default function DashboardPage() {
  const [user, setUser] = useState<CurrentUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/users/me', {
          credentials: 'include',
        });

        if (!response.ok) {
          throw new Error('Failed to fetch user');
        }

        const data = await response.json();
        setUser(data);
      } catch (err) {
        console.error('Failed to fetch current user:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  const isManager = user?.role === 'Manager';

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-start mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Dashboard</h1>
            {!loading && user && (
              <p className="text-gray-600">
                Welcome, <span className="font-semibold">{user.fullName}</span> ({user.role})
              </p>
            )}
          </div>
          <a
            href="/logout"
            className="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-md transition"
          >
            Sign Out
          </a>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Employee Links */}
          <Link
            href="/requests"
            className="bg-white hover:shadow-lg rounded-lg p-6 border border-gray-200 hover:border-blue-400 transition"
          >
            <h2 className="text-2xl font-bold text-gray-900 mb-2">My Requests</h2>
            <p className="text-gray-600">View, create, and manage your absence requests</p>
          </Link>

          {/* Manager Links */}
          {isManager && (
            <Link
              href="/manager/queue"
              className="bg-white hover:shadow-lg rounded-lg p-6 border border-gray-200 hover:border-green-400 transition"
            >
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Review Queue</h2>
              <p className="text-gray-600">Review and approve/reject pending requests from your team</p>
            </Link>
          )}
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-blue-900 mb-2">Getting Started</h3>
          <ul className="text-blue-800 space-y-1 list-disc list-inside">
            <li>Create a new absence request by clicking "My Requests"</li>
            <li>Save requests as drafts before submitting</li>
            <li>Submit requests for your manager's approval</li>
            {isManager && <li>Review submitted requests from your team members</li>}
          </ul>
        </div>
      </div>
    </div>
  );
}
