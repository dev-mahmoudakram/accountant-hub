'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/auth/AuthProvider';
import Container from '@/components/layout/Container';

export default function ProfilePage() {
  const { user, isAuthenticated, isReady } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isReady) return;
    if (!isAuthenticated) router.replace('/login?redirect=/profile');
  }, [isReady, isAuthenticated, router]);

  if (!isReady || !isAuthenticated || !user) return null;

  const initial = user.name.charAt(0).toUpperCase();
  const roleLabel = user.role === 'client' ? 'Client' : 'Accountant';

  return (
    <Container>
      <div className="py-10 lg:py-12 max-w-lg mx-auto">
        <h1 className="text-2xl font-bold text-ink mb-8">Profile</h1>

        <div className="bg-white border border-border rounded-2xl p-8 space-y-6">
          {/* Avatar */}
          <div className="flex items-center gap-5">
            <div className="w-16 h-16 rounded-full bg-brand-light border-2 border-brand/20 flex items-center justify-center shrink-0">
              <span className="text-2xl font-bold text-brand">{initial}</span>
            </div>
            <div>
              <p className="text-lg font-semibold text-ink">{user.name}</p>
              <span className="inline-block mt-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-brand/10 text-brand border border-brand/20">
                {roleLabel}
              </span>
            </div>
          </div>

          <div className="border-t border-border" />

          {/* Details */}
          <dl className="space-y-4">
            <div>
              <dt className="text-xs font-medium text-muted uppercase tracking-wider mb-1">Full Name</dt>
              <dd className="text-sm text-ink font-medium">{user.name}</dd>
            </div>
            <div>
              <dt className="text-xs font-medium text-muted uppercase tracking-wider mb-1">Email Address</dt>
              <dd className="text-sm text-ink font-medium">{user.email}</dd>
            </div>
            <div>
              <dt className="text-xs font-medium text-muted uppercase tracking-wider mb-1">Current Role</dt>
              <dd className="text-sm text-ink font-medium">{roleLabel}</dd>
            </div>
          </dl>
        </div>
      </div>
    </Container>
  );
}
