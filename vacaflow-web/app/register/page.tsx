'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import AuthShell from '@/components/layout/AuthShell';
import TextInput from '@/components/forms/TextInput';
import ActionButton from '@/components/ui/ActionButton';
import { authApi, RegisterRequest } from '@/lib/api';

export default function RegisterPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<RegisterRequest>({
    fullName: '',
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
      if (!formData.fullName.trim()) {
        throw new Error('Full name is required');
      }
      if (!formData.email.trim()) {
        throw new Error('Email is required');
      }
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
        throw new Error('Please enter a valid email address');
      }
      if (!formData.password) {
        throw new Error('Password is required');
      }
      if (formData.password.length < 8) {
        throw new Error('Password must be at least 8 characters long');
      }

      await authApi.register(formData);
      router.push('/login');
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Registration failed';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthShell
      title="Create account"
      subtitle="Join VacaFlow to manage your absences."
      footer={
        <>
          Already have an account?{' '}
          <Link
            href="/login"
            className="text-brand-orange-hover hover:text-brand-orange-deep font-bold transition"
          >
            Sign in
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
          label="Full Name"
          type="text"
          id="fullName"
          name="fullName"
          value={formData.fullName}
          onChange={handleChange}
          placeholder="John Doe"
          disabled={loading}
          autoComplete="name"
        />

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
          placeholder="At least 8 characters"
          disabled={loading}
          autoComplete="new-password"
          hint="Minimum 8 characters required"
        />

        <ActionButton variant="primary" type="submit" loading={loading} disabled={loading} fullWidth>
          Create Account
        </ActionButton>
      </form>
    </AuthShell>
  );
}
