'use client';

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Dashboard</h1>
        <p className="text-gray-600 mb-8">Welcome to VacaFlow. Your absence management dashboard will be displayed here.</p>

        <div className="space-y-4">
          <a
            href="/logout"
            className="inline-block bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-md transition"
          >
            Sign Out
          </a>
        </div>
      </div>
    </div>
  );
}
