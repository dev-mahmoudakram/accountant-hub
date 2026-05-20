'use client';

import { useEffect, useState, useTransition } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { useAuth } from '@/components/auth/AuthProvider';
import { api } from '@/lib/api';
import { Bid } from '@/types/bid';
import { ApiResponse, PaginatedResponse } from '@/types/api';
import MyBidCard from './MyBidCard';
import EditBidModal from './EditBidModal';
import { BidCardSkeleton } from '@/components/ui/Skeleton';
import EmptyState from '@/components/ui/EmptyState';
import Pagination from '@/components/ui/Pagination';
import ConfirmDialog from '@/components/ui/ConfirmDialog';
import { staggerContainer, fadeUp } from '@/lib/animations';

type StatusFilter = 'all' | 'pending' | 'accepted' | 'rejected';

interface Meta {
  current_page: number;
  last_page: number;
  total: number;
}

interface Stats {
  total: number;
  pending: number;
  accepted: number;
  rejected: number;
}

const STATUS_TABS: { value: StatusFilter; label: string; dot: string }[] = [
  { value: 'all',      label: 'All',      dot: 'bg-gray-400' },
  { value: 'pending',  label: 'Pending',  dot: 'bg-yellow-400' },
  { value: 'accepted', label: 'Accepted', dot: 'bg-brand' },
  { value: 'rejected', label: 'Rejected', dot: 'bg-red-500' },
];

function FilterPill({
  label,
  count,
  dot,
  active,
  onClick,
}: {
  label: string;
  count: number;
  dot: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={`Filter by ${label} bids${active ? ' (currently selected)' : ''}`}
      className={[
        'inline-flex items-center gap-2 px-3.5 py-2 rounded-full border text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/30',
        active
          ? 'bg-brand text-white border-brand'
          : 'bg-white text-ink border-border hover:border-brand/40 hover:bg-surface',
      ].join(' ')}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${active ? 'bg-white' : dot}`} />
      <span>{label}</span>
      <span
        className={[
          'inline-flex items-center justify-center min-w-5 h-5 px-1.5 rounded-full text-xs font-semibold',
          active ? 'bg-white/20 text-white' : 'bg-surface text-muted',
        ].join(' ')}
      >
        {count}
      </span>
    </button>
  );
}

export default function MyBidsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { isAuthenticated, isReady } = useAuth();
  const [isPending, startTransition] = useTransition();
  const [bids, setBids] = useState<Bid[] | null>(null);
  const [meta, setMeta] = useState<Meta>({ current_page: 1, last_page: 1, total: 0 });
  const [stats, setStats] = useState<Stats>({ total: 0, pending: 0, accepted: 0, rejected: 0 });
  const [refreshKey, setRefreshKey] = useState(0);
  const [editingBid, setEditingBid] = useState<Bid | null>(null);
  const [withdrawingBid, setWithdrawingBid] = useState<Bid | null>(null);
  const [withdrawLoading, setWithdrawLoading] = useState(false);

  const page = Number(searchParams.get('page') ?? '1');
  const statusParam = (searchParams.get('status') ?? 'all') as StatusFilter;
  const validStatuses: StatusFilter[] = ['all', 'pending', 'accepted', 'rejected'];
  const status: StatusFilter = validStatuses.includes(statusParam) ? statusParam : 'all';

  useEffect(() => {
    if (isReady && !isAuthenticated) {
      router.replace('/login?redirect=/dashboard');
    }
  }, [isReady, isAuthenticated, router]);

  // Stats — refresh on auth, page, status, or after a bid change
  useEffect(() => {
    if (!isReady || !isAuthenticated) return;
    let cancelled = false;
    api.get<ApiResponse<Stats>>('/my-bids/stats')
      .then((res) => { if (!cancelled) setStats(res.data); })
      .catch(() => {});
    return () => { cancelled = true; };
  }, [isReady, isAuthenticated, page, status, refreshKey]);

  // Bids list
  useEffect(() => {
    if (!isReady || !isAuthenticated) return;
    let cancelled = false;

    startTransition(async () => {
      try {
        const params = new URLSearchParams({ page: String(page) });
        if (status !== 'all') params.set('status', status);
        const res = await api.get<PaginatedResponse<Bid>>(`/my-bids?${params.toString()}`);
        if (!cancelled) {
          setBids(res.data);
          setMeta(res.meta);
        }
      } catch {
        if (!cancelled) setBids([]);
      }
    });

    return () => { cancelled = true; };
  }, [isReady, isAuthenticated, page, status, refreshKey]);

  async function confirmWithdraw() {
    if (!withdrawingBid) return;
    setWithdrawLoading(true);
    try {
      await api.delete(`/my-bids/${withdrawingBid.id}`);
      toast.success('Bid withdrawn.');
      setWithdrawingBid(null);
      setRefreshKey((k) => k + 1);
    } catch (err: unknown) {
      const error = err as { status?: number; message?: string };
      if (error.status === 403) {
        toast.error('This bid can no longer be withdrawn.');
      } else {
        toast.error(error.message ?? 'Could not withdraw the bid. Please try again.');
      }
    } finally {
      setWithdrawLoading(false);
    }
  }

  function pushQuery(next: { status?: StatusFilter; page?: number }) {
    const params = new URLSearchParams(window.location.search);
    if (next.status !== undefined) {
      if (next.status === 'all') params.delete('status');
      else params.set('status', next.status);
      params.delete('page'); // reset pagination on filter change
    }
    if (next.page !== undefined) params.set('page', String(next.page));
    router.push(`/dashboard${params.toString() ? `?${params.toString()}` : ''}`);
  }

  const isLoading = !isReady || !isAuthenticated || bids === null || isPending;

  if (!isReady || !isAuthenticated) return null;

  return (
    <div className="py-10 lg:py-12">
      {/* Page header */}
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-ink">My Bids</h1>
        <p className="text-sm text-muted mt-1">
          {stats.total === 0
            ? 'No bids submitted yet'
            : `${stats.total} bid${stats.total !== 1 ? 's' : ''} submitted`}
        </p>
      </div>

      {/* Status filter pills — click to filter */}
      {stats.total > 0 && (
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          className="flex flex-wrap items-center gap-2 mb-8"
          role="group"
          aria-label="Filter bids by status"
        >
          {STATUS_TABS.map((t) => (
            <FilterPill
              key={t.value}
              label={t.label}
              count={t.value === 'all' ? stats.total : stats[t.value]}
              dot={t.dot}
              active={status === t.value}
              onClick={() => pushQuery({ status: t.value })}
            />
          ))}
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
          title={status === 'all' ? 'No bids yet' : `No ${status} bids`}
          description={
            status === 'all'
              ? 'Browse open accounting jobs and submit your first bid to get started.'
              : `You don't have any ${status} bids right now.`
          }
          icon={
            <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          }
          action={
            status === 'all' ? (
              <Link
                href="/jobs"
                className="inline-flex items-center gap-2 justify-center rounded-lg font-semibold px-5 py-2.5 text-sm bg-brand text-white hover:bg-brand-dark transition-colors"
              >
                Browse Jobs
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
            ) : (
              <button
                type="button"
                onClick={() => pushQuery({ status: 'all' })}
                className="inline-flex items-center gap-2 justify-center rounded-lg font-semibold px-5 py-2.5 text-sm bg-brand text-white hover:bg-brand-dark transition-colors focus-visible:outline-none"
              >
                Show all bids
              </button>
            )
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
                <MyBidCard
                  bid={bid}
                  onEdit={setEditingBid}
                  onWithdraw={setWithdrawingBid}
                />
              </motion.div>
            ))}
          </motion.div>

          {meta.last_page > 1 && (
            <div className="mt-10">
              <Pagination
                currentPage={meta.current_page}
                lastPage={meta.last_page}
                onPageChange={(p) => pushQuery({ page: p })}
              />
            </div>
          )}
        </>
      )}

      <EditBidModal
        open={editingBid !== null}
        bid={editingBid}
        onClose={() => setEditingBid(null)}
        onSaved={() => setRefreshKey((k) => k + 1)}
      />

      <ConfirmDialog
        open={withdrawingBid !== null}
        variant="danger"
        title="Withdraw this bid?"
        description={
          withdrawingBid
            ? `Your pending bid for "${withdrawingBid.job.title}" will be permanently removed. This cannot be undone.`
            : 'This cannot be undone.'
        }
        confirmLabel="Withdraw bid"
        cancelLabel="Keep bid"
        loading={withdrawLoading}
        onConfirm={confirmWithdraw}
        onCancel={() => { if (!withdrawLoading) setWithdrawingBid(null); }}
      />
    </div>
  );
}
