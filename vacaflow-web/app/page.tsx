import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-bg-page flex items-center justify-center p-6">
      <div className="w-full max-w-md text-center">
        {/* Brand */}
        <div className="flex items-center gap-3 justify-center mb-8">
          <div className="w-[52px] h-[52px] bg-brand-orange rounded-[14px] flex items-center justify-center text-white font-bold text-2xl shadow-button-orange">
            V
          </div>
          <span className="font-bold text-2xl text-text-primary tracking-tight">VacaFlow</span>
        </div>

        {/* Card */}
        <div className="bg-bg-surface border border-border-warm-alt rounded-frame shadow-frame p-8">
          <h1 className="text-h1 text-text-primary mb-2">Time off, made simple.</h1>
          <p className="text-sm text-text-muted mb-8">
            Manage your absence requests from draft to decision.
          </p>

          <div className="space-y-3">
            <Link
              href="/login"
              className="block w-full bg-brand-orange hover:bg-brand-orange-hover text-white font-bold text-sm py-3 rounded-btn shadow-button-orange transition"
            >
              Sign In
            </Link>
            <Link
              href="/register"
              className="block w-full bg-bg-surface hover:border-border-warm-alt text-text-primary font-bold text-sm py-3 rounded-btn border-2 border-border-warm transition"
            >
              Create Account
            </Link>
          </div>
        </div>

        <p className="text-center text-xs text-text-faint mt-8">
          For IGS Solutions employees
        </p>
      </div>
    </div>
  );
}
