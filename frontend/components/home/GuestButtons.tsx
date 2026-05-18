'use client';

import Link from 'next/link';
import { useAuth } from '@/components/auth/AuthProvider';

export function HeroGuestButton() {
  const { isAuthenticated, isReady } = useAuth();
  if (!isReady || isAuthenticated) return null;
  return (
    <Link
      href="/register"
      className="inline-flex items-center justify-center rounded-lg font-semibold px-6 py-3 text-base border-2 border-white/60 text-white hover:bg-white/10 transition-colors"
    >
      Create Account
    </Link>
  );
}

export function CtaGuestButton() {
  const { isAuthenticated, isReady } = useAuth();
  if (!isReady || isAuthenticated) return null;
  return (
    <Link
      href="/register"
      className="inline-flex items-center justify-center rounded-lg font-semibold px-6 py-3 text-base bg-brand text-white hover:bg-brand-dark transition-colors"
    >
      Get Started Free
    </Link>
  );
}
