export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="text-center max-w-md">
        <h1 className="text-5xl font-bold text-gray-900 mb-4">VacaFlow</h1>
        <p className="text-xl text-gray-600 mb-8">
          Manage your absence requests with ease
        </p>

        <div className="space-y-3">
          <a
            href="/login"
            className="block w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-md transition"
          >
            Sign In
          </a>
          <a
            href="/register"
            className="block w-full bg-white hover:bg-gray-50 text-blue-600 font-semibold py-3 rounded-md border border-blue-200 transition"
          >
            Create Account
          </a>
        </div>

        <p className="text-sm text-gray-500 mt-8">
          For IGS Solutions employees
        </p>
      </div>
    </div>
  );
}
