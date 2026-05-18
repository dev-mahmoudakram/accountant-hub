import Link from 'next/link';
import Badge from '@/components/ui/Badge';
import { Bid, BidStatus } from '@/types/bid';
import { formatCurrency, formatDate, formatRelative } from '@/lib/formatters';

interface MyBidCardProps {
  bid: Bid;
}

const STATUS_LABEL: Record<BidStatus, string> = {
  pending: 'Pending',
  accepted: 'Accepted',
  rejected: 'Rejected',
};

export default function MyBidCard({ bid }: MyBidCardProps) {
  return (
    <article className="group bg-white border border-border rounded-2xl overflow-hidden hover:border-brand/30 hover:shadow-lg transition-all duration-300 h-full flex flex-col">
      {/* Status accent bar */}
      <div
        className={[
          'h-1 w-full',
          bid.status === 'accepted'
            ? 'bg-brand'
            : bid.status === 'rejected'
            ? 'bg-red-500'
            : 'bg-yellow-400',
        ].join(' ')}
      />

      <div className="p-5 flex flex-col flex-1">
        {/* Category + Status */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <span className="text-xs font-medium text-muted bg-surface border border-border px-2.5 py-1 rounded-full truncate max-w-35">
            {bid.job.category?.name ?? 'Uncategorized'}
          </span>
          <Badge variant={bid.status} dot>{STATUS_LABEL[bid.status]}</Badge>
        </div>

        {/* Job title + company */}
        <Link
          href={`/jobs/${bid.job.id}`}
          className="font-semibold text-ink text-base leading-snug line-clamp-2 mb-1 hover:text-brand transition-colors group-hover:text-brand"
        >
          {bid.job.title}
        </Link>
        <p className="text-xs font-medium text-muted mb-4 flex items-center gap-1.5">
          <svg className="w-3 h-3 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
              d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
          </svg>
          {bid.job.company_name}
        </p>

        {/* Bid details */}
        <div className="pt-4 border-t border-border/60 mt-auto space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-base font-bold text-brand">
              {formatCurrency(bid.proposed_price)}
            </span>
            <span className="text-xs text-muted bg-surface px-2 py-0.5 rounded-md">
              {bid.estimated_delivery_time}
            </span>
          </div>

          <p className="text-sm text-muted line-clamp-2 leading-relaxed">
            {bid.cover_letter}
          </p>

          <div className="flex items-center justify-between text-xs text-muted pt-1">
            <span className="flex items-center gap-1">
              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              Due {formatDate(bid.job.deadline)}
            </span>
            <span>{formatRelative(bid.created_at)}</span>
          </div>
        </div>
      </div>
    </article>
  );
}
