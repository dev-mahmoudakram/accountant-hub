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
    <article className="bg-white border border-border rounded-xl p-5 flex flex-col hover:border-brand hover:shadow-md transition-all duration-200 h-full">
      {/* category + status */}
      <div className="flex items-center justify-between gap-2 mb-3">
        <span className="text-xs font-medium text-muted bg-surface px-2.5 py-1 rounded-full truncate max-w-35">
          {bid.job.category?.name ?? 'Uncategorized'}
        </span>
        <Badge variant={bid.status}>{STATUS_LABEL[bid.status]}</Badge>
      </div>

      {/* job title + company */}
      <Link
        href={`/jobs/${bid.job.id}`}
        className="font-semibold text-ink text-base leading-snug line-clamp-2 mb-1 hover:text-brand transition-colors"
      >
        {bid.job.title}
      </Link>
      <p className="text-xs font-medium text-muted mb-4">{bid.job.company_name}</p>

      {/* bid details */}
      <div className="pt-4 border-t border-border mt-auto">
        <div className="flex items-center justify-between mb-2">
          <span className="text-base font-bold text-brand">
            {formatCurrency(bid.proposed_price)}
          </span>
          <span className="text-xs text-muted">{bid.estimated_delivery_time}</span>
        </div>

        <p className="text-sm text-muted line-clamp-2 leading-relaxed mb-3">
          {bid.cover_letter}
        </p>

        <div className="flex items-center justify-between text-xs text-muted">
          <span>Due {formatDate(bid.job.deadline)}</span>
          <span>{formatRelative(bid.created_at)}</span>
        </div>
      </div>
    </article>
  );
}
