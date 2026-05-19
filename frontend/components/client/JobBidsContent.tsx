'use client';

import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { api } from '@/lib/api';
import { BidWithAccountant } from '@/types/bid';
import { PaginatedResponse, ApiResponse } from '@/types/api';
import BidReviewCard from './BidReviewCard';
import EmptyState from '@/components/ui/EmptyState';
import { BidCardSkeleton } from '@/components/ui/Skeleton';

interface Props {
  jobId: number;
  jobOpen: boolean;
}

export default function JobBidsContent({ jobId, jobOpen }: Props) {
  const [bids, setBids] = useState<BidWithAccountant[] | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get<PaginatedResponse<BidWithAccountant>>(`/client/jobs/${jobId}/bids`)
      .then((res) => setBids(res.data))
      .catch(() => toast.error('Failed to load bids.'))
      .finally(() => setLoading(false));
  }, [jobId]);

  async function handleStatusChange(bidId: number, status: 'accepted' | 'rejected') {
    try {
      const res = await api.patch<ApiResponse<BidWithAccountant>>(
        `/client/jobs/${jobId}/bids/${bidId}`,
        { status }
      );
      setBids((prev) =>
        prev?.map((b) => (b.id === bidId ? { ...b, status: res.data.status } : b)) ?? null
      );
      toast.success(status === 'accepted' ? 'Bid accepted. Job is now closed.' : 'Bid rejected.');
    } catch {
      toast.error('Failed to update bid status.');
    }
  }

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {Array.from({ length: 4 }).map((_, i) => <BidCardSkeleton key={i} />)}
      </div>
    );
  }

  if (!bids || bids.length === 0) {
    return (
      <EmptyState
        title="No bids yet"
        description="Bids from accountants will appear here once they apply."
        icon={
          <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        }
      />
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {bids.map((bid) => (
        <BidReviewCard
          key={bid.id}
          bid={bid}
          jobOpen={jobOpen}
          onStatusChange={handleStatusChange}
        />
      ))}
    </div>
  );
}
