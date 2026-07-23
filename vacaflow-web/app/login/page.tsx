'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import AuthShell from '@/components/layout/AuthShell';
import TextInput from '@/components/forms/TextInput';
import ActionButton from '@/components/ui/ActionButton';

interface LoginRequest {
  email: string;
  password: string;
}

export default function LoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<LoginRequest>({
    email: '',
    password: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError(null);
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (!formData.email.trim()) {
        throw new Error('Email is required');
      }
      if (!formData.password) {
        throw new Error('Password is required');
      }

      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Login failed');
      }

      router.push('/dashboard');
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Login failed';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthShell
      title="Sign in"
      subtitle="Access your absence requests."
      footer={
        <>
          Don&apos;t have an account?{' '}
          <Link
            href="/register"
            className="text-brand-orange-hover hover:text-brand-orange-deep font-bold transition"
          >
            Sign up
          </Link>
        </>
      }
    >
      {error && (
        <div className="mb-6 p-4 bg-status-rejected-bg border border-status-rejected-border rounded-card">
          <p className="text-sm text-status-rejected-text">{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        <TextInput
          label="Email Address"
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="you@example.com"
          disabled={loading}
          autoComplete="email"
        />

        <TextInput
          label="Password"
          type="password"
          id="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          placeholder="Your password"
          disabled={loading}
          autoComplete="current-password"
        />

        <ActionButton variant="primary" type="submit" loading={loading} disabled={loading} fullWidth>
          Sign In
        </ActionButton>
      </form>

      <div className="mt-6 p-4 bg-bg-warm-tint border border-border-warm rounded-card">
        <p className="text-label uppercase text-text-faint mb-2">Demo Account</p>
        <p className="text-xs text-text-body">Email: james.parker@igs.com</p>
        <p className="text-xs text-text-body">Password: Demo1234!</p>
      </div>
    </AuthShell>
  );
}
