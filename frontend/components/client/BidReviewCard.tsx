'use client';

import { useState } from 'react';
import { BidWithAccountant, BidStatus } from '@/types/bid';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import { formatCurrency } from '@/lib/formatters';

interface Props {
  bid: BidWithAccountant;
  jobOpen: boolean;
  onStatusChange: (bidId: number, status: 'accepted' | 'rejected') => Promise<void>;
}

const STATUS_BADGE: Record<BidStatus, 'success' | 'error' | 'warning'> = {
  accepted: 'success',
  rejected: 'error',
  pending: 'warning',
};

export default function BidReviewCard({ bid, jobOpen, onStatusChange }: Props) {
  const [expanded, setExpanded] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleAction(status: 'accepted' | 'rejected') {
    setLoading(true);
    try {
      await onStatusChange(bid.id, status);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="bg-white border border-border rounded-2xl p-5 space-y-4">
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-semibold text-ink">{bid.accountant.name}</p>
          <p className="text-xs text-muted">{bid.accountant.email}</p>
        </div>
        <Badge variant={STATUS_BADGE[bid.status]}>
          {bid.status.charAt(0).toUpperCase() + bid.status.slice(1)}
        </Badge>
      </div>

      {/* Key details */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-surface rounded-xl p-3">
          <p className="text-xs text-muted mb-0.5">Proposed Price</p>
          <p className="text-sm font-bold text-brand">{formatCurrency(bid.proposed_price)}</p>
        </div>
        <div className="bg-surface rounded-xl p-3">
          <p className="text-xs text-muted mb-0.5">Delivery Time</p>
          <p className="text-sm font-semibold text-ink">{bid.estimated_delivery_time}</p>
        </div>
      </div>

      {/* Cover letter preview / expand */}
      <div>
        <p className="text-xs font-medium text-muted mb-1.5">Cover Letter</p>
        <p className={`text-sm text-ink leading-relaxed ${expanded ? '' : 'line-clamp-3'}`}>
          {bid.cover_letter}
        </p>
        {bid.cover_letter.length > 180 && (
          <button
            type="button"
            onClick={() => setExpanded((v) => !v)}
            className="text-xs text-brand hover:underline mt-1 focus-visible:outline-none"
          >
            {expanded ? 'Show less' : 'Read more'}
          </button>
        )}
      </div>

      {expanded && (
        <div>
          <p className="text-xs font-medium text-muted mb-1.5">Experience Summary</p>
          <p className="text-sm text-ink leading-relaxed">{bid.experience_summary}</p>
        </div>
      )}

      {/* Actions */}
      {jobOpen && bid.status === 'pending' && (
        <div className="flex gap-2 pt-1 border-t border-border">
          <Button
            variant="primary"
            size="sm"
            className="flex-1"
            loading={loading}
            onClick={() => handleAction('accepted')}
          >
            Accept
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="flex-1 !border-red-200 !text-red-500 hover:!bg-red-50"
            loading={loading}
            onClick={() => handleAction('rejected')}
          >
            Reject
          </Button>
        </div>
      )}
    </div>
  );
}
