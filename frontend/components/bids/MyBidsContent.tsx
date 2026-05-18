'use client';

import { useEffect, useState, useTransition } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useAuth } from '@/components/auth/AuthProvider';
import { api } from '@/lib/api';
import { Bid, BidStatus } from '@/types/bid';
import { PaginatedResponse } from '@/types/api';
import MyBidCard from './MyBidCard';
import { BidCardSkeleton } from '@/components/ui/Skeleton';
import EmptyState from '@/components/ui/EmptyState';
import Pagination from '@/components/ui/Pagination';
import { staggerContainer, fadeUp } from '@/lib/animations';

interface Meta {
  current_page: number;
  last_page: number;
  total: number;
}

function StatCard({
  label,
  value,
  color,
}: {
  label: string;
  value: number;
  color: string;
}) {
  return (
    <div className="bg-white border border-border rounded-2xl p-5">
      <p className="text-2xl font-bold text-ink">{value}</p>
      <div className="flex items-center gap-1.5 mt-1">
        <span className={`w-2 h-2 rounded-full ${color}`} />
        <p className="text-xs text-muted font-medium">{label}</p>
      </div>
    </div>
  );
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

  const counts: Record<BidStatus, number> =
    bids?.reduce(
      (acc, b) => ({ ...acc, [b.status]: (acc[b.status] ?? 0) + 1 }),
      { pending: 0, accepted: 0, rejected: 0 } as Record<BidStatus, number>
    ) ?? { pending: 0, accepted: 0, rejected: 0 };

  return (
    <div className="py-10 lg:py-12">

      {/* Page header */}
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-ink">My Bids</h1>
        {!isLoading && (
          <p className="text-sm text-muted mt-1">
            {meta.total === 0
              ? 'No bids submitted yet'
              : `${meta.total} bid${meta.total !== 1 ? 's' : ''} submitted`}
          </p>
        )}
      </div>

      {/* Stats row */}
      {!isLoading && bids!.length > 0 && (
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-3 gap-4 mb-8"
        >
          <motion.div variants={fadeUp}>
            <StatCard label="Pending" value={counts.pending} color="bg-yellow-400" />
          </motion.div>
          <motion.div variants={fadeUp}>
            <StatCard label="Accepted" value={counts.accepted} color="bg-brand" />
          </motion.div>
          <motion.div variants={fadeUp}>
            <StatCard label="Rejected" value={counts.rejected} color="bg-red-500" />
          </motion.div>
        </motion.div>
      )}

      {/* Bids grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <BidCardSkeleton key={i} />
          ))}
        </div>
      ) : bids!.length === 0 ? (
        <EmptyState
          title="No bids yet"
          description="Browse open accounting jobs and submit your first bid to get started."
          icon={
            <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          }
          action={
            <Link
              href="/jobs"
              className="inline-flex items-center gap-2 justify-center rounded-lg font-semibold px-5 py-2.5 text-sm bg-brand text-white hover:bg-brand-dark transition-colors"
            >
              Browse Jobs
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          }
        />
      ) : (
        <>
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
          >
            {bids!.map((bid) => (
              <motion.div key={bid.id} variants={fadeUp} className="h-full">
                <MyBidCard bid={bid} />
              </motion.div>
            ))}
          </motion.div>

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
