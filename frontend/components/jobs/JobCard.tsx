import Link from 'next/link';
import Badge from '@/components/ui/Badge';
import { JobListItem } from '@/types/job';
import { formatBudget, formatDate, formatRelative } from '@/lib/formatters';

interface JobCardProps {
  job: JobListItem;
}

function UserBidBadge({ status }: { status: 'pending' | 'accepted' | 'rejected' }) {
  const map = {
    pending: { label: 'Applied', cls: 'bg-brand-light text-brand border-brand/20' },
    accepted: { label: 'Won', cls: 'bg-brand text-white border-brand' },
    rejected: { label: 'Rejected', cls: 'bg-red-50 text-red-600 border-red-200' },
  } as const;
  const { label, cls } = map[status];
  return (
    <span
      className={`text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full border ${cls}`}
      title={`Your bid status: ${status}`}
    >
      {label}
    </span>
  );
}

export default function JobCard({ job }: JobCardProps) {
  return (
    <Link href={`/jobs/${job.id}`} className="group block h-full">
      <article className="relative bg-white border border-border rounded-2xl p-6 hover:border-brand/40 hover:shadow-lg transition-all duration-300 h-full flex flex-col overflow-hidden">
        {/* Top accent line on hover */}
        <div className="absolute top-0 left-0 right-0 h-0.5 bg-brand scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left rounded-t-2xl" />

        {/* Header row */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <span className="text-xs font-medium text-muted bg-surface border border-border px-2.5 py-1 rounded-full truncate max-w-35">
            {job.category?.name ?? 'Uncategorized'}
          </span>
          <div className="flex items-center gap-1.5 shrink-0">
            {job.user_bid && <UserBidBadge status={job.user_bid.status} />}
            <Badge variant={job.status} dot>
              {job.status === 'open' ? 'Open' : 'Closed'}
            </Badge>
          </div>
        </div>

        {/* Title */}
        <h3 className="font-semibold text-ink text-base leading-snug mb-1 group-hover:text-brand transition-colors line-clamp-2">
          {job.title}
        </h3>

        {/* Company + Poster */}
        <div className="flex items-center justify-between mb-3 gap-2">
          <p className="text-xs font-medium text-muted flex items-center gap-1.5 truncate">
            <svg className="w-3 h-3 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
            <span className="truncate">{job.company_name}</span>
          </p>
          {job.poster && (
            <span className="text-xs text-muted shrink-0 flex items-center gap-1">
              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              {job.poster.name}
            </span>
          )}
        </div>

        {/* Description */}
        <p className="text-sm text-muted line-clamp-2 flex-1 mb-4 leading-relaxed">
          {job.short_description}
        </p>

        {/* Footer */}
        <div className="pt-4 border-t border-border/60">
          <div className="flex items-center justify-between mb-2">
            <span className="text-base font-bold text-brand">
              {formatBudget(job.budget_min, job.budget_max)}
            </span>
            <span className="text-xs text-muted flex items-center gap-1">
              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                  d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              {job.bids_count} {job.bids_count === 1 ? 'bid' : 'bids'}
            </span>
          </div>
          <div className="flex items-center justify-between text-xs text-muted">
            <span className="flex items-center gap-1">
              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              Due {formatDate(job.deadline)}
            </span>
            <span>{formatRelative(job.created_at)}</span>
          </div>
        </div>
      </article>
    </Link>
  );
}
