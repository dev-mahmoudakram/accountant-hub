'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Suspense } from 'react';
import Container from '@/components/layout/Container';
import MyBidsContent from '@/components/bids/MyBidsContent';
import { useAuth } from '@/components/auth/AuthProvider';

export default function DashboardPage() {
  const { user, isAuthenticated, isReady } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isReady) return;
    if (!isAuthenticated) {
      router.replace('/login?redirect=/dashboard');
      return;
    }
    if (user?.role === 'client') {
      router.replace('/client/jobs');
    }
  }, [isReady, isAuthenticated, user, router]);

  if (!isReady || !isAuthenticated || user?.role === 'client') return null;

  return (
    <Container>
      <Suspense>
        <MyBidsContent />
      </Suspense>
    </Container>
  );
}
