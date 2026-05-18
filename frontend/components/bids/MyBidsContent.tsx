'use client';

import { useEffect, useState, useTransition } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/components/auth/AuthProvider';
import { api } from '@/lib/api';
import { Bid } from '@/types/bid';
import { PaginatedResponse } from '@/types/api';
import MyBidCard from './MyBidCard';
import { BidCardSkeleton } from '@/components/ui/Skeleton';
import EmptyState from '@/components/ui/EmptyState';
import Pagination from '@/components/ui/Pagination';

interface Meta {
  current_page: number;
  last_page: number;
  total: number;
}

export default function MyBidsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { isAuthenticated, isReady } = useAuth();
  const [isPending, startTransition] = useTransition();
  const [bids, setBids] = useState<Bid[] | null>(null);
  const [meta, setMeta] = useState<Meta>({ current_page: 1, last_page: 1, total: 0 });

  const page = Number(searchParams.get('page') ?? '1');

  useEffect(() => {
    if (isReady && !isAuthenticated) {
      router.replace('/login?redirect=/dashboard');
    }
  }, [isReady, isAuthenticated, router]);

  useEffect(() => {
    if (!isReady || !isAuthenticated) return;
    let cancelled = false;

    startTransition(async () => {
      const res = await api.get<PaginatedResponse<Bid>>(`/my-bids?page=${page}`);
      if (!cancelled) {
        setBids(res.data);
        setMeta(res.meta);
      }
    });

    return () => { cancelled = true; };
  }, [isReady, isAuthenticated, page]);

  function handlePageChange(p: number) {
    const params = new URLSearchParams(window.location.search);
    params.set('page', String(p));
    router.push(`/dashboard?${params.toString()}`);
  }

  const isLoading = !isReady || !isAuthenticated || bids === null || isPending;

  if (!isReady || !isAuthenticated) return null;

  return (
    <div className="py-10">
      {/* header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-ink">My Bids</h1>
        {!isLoading && (
          <p className="text-sm text-muted mt-1">
            {meta.total === 0
              ? 'You haven\'t submitted any bids yet.'
              : `${meta.total} bid${meta.total !== 1 ? 's' : ''} submitted`}
          </p>
        )}
      </div>

      {/* grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => <BidCardSkeleton key={i} />)}
        </div>
      ) : bids!.length === 0 ? (
        <EmptyState
          title="No bids yet"
          description="Browse open accounting jobs and submit your first bid to get started."
          icon={
            <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          }
          action={
            <Link
              href="/jobs"
              className="inline-flex items-center justify-center rounded-lg font-semibold px-5 py-2.5 text-sm bg-brand text-white hover:bg-brand-dark transition-colors"
            >
              Browse Jobs
            </Link>
          }
        />
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {bids!.map((bid) => <MyBidCard key={bid.id} bid={bid} />)}
          </div>

          {meta.last_page > 1 && (
            <div className="mt-10">
              <Pagination
                currentPage={meta.current_page}
                lastPage={meta.last_page}
                onPageChange={handlePageChange}
              />
            </div>
          )}
        </>
      )}
    </div>
  );
}
