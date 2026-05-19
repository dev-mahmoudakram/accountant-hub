'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/auth/AuthProvider';
import Container from '@/components/layout/Container';
import PostJobForm from '@/components/client/PostJobForm';

export default function PostJobPage() {
  const { user, isAuthenticated, isReady } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isReady) return;
    if (!isAuthenticated) { router.replace('/login'); return; }
    if (user?.role !== 'client') { router.replace('/dashboard'); }
  }, [isReady, isAuthenticated, user, router]);

  if (!isReady || !isAuthenticated || user?.role !== 'client') return null;

  return (
    <Container>
      <div className="py-10 lg:py-12 max-w-2xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-ink">Post a New Job</h1>
          <p className="text-sm text-muted mt-1">
            Fill in the details below to start receiving bids from qualified accountants.
          </p>
        </div>
        <PostJobForm />
      </div>
    </Container>
  );
}
