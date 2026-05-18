import Link from 'next/link';
import Badge from '@/components/ui/Badge';
import { JobListItem } from '@/types/job';
import { formatBudget, formatDate, formatRelative } from '@/lib/formatters';

interface JobCardProps {
  job: JobListItem;
}

export default function JobCard({ job }: JobCardProps) {
  return (
    <Link href={`/jobs/${job.id}`} className="group block h-full">
      <article className="bg-white border border-border rounded-xl p-6 hover:border-brand hover:shadow-md transition-all duration-200 h-full flex flex-col">
        <div className="flex items-center justify-between gap-2 mb-3">
          <span className="text-xs font-medium text-muted bg-surface px-2.5 py-1 rounded-full truncate max-w-35">
            {job.category?.name ?? 'Uncategorized'}
          </span>
          <Badge variant={job.status}>{job.status === 'open' ? 'Open' : 'Closed'}</Badge>
        </div>

        <h3 className="font-semibold text-ink text-lg leading-snug mb-1 group-hover:text-brand transition-colors line-clamp-2">
          {job.title}
        </h3>
        <p className="text-sm font-medium text-muted mb-3">{job.company_name}</p>
        <p className="text-sm text-muted line-clamp-2 flex-1 mb-4 leading-relaxed">
          {job.short_description}
        </p>

        <div className="pt-4 border-t border-border">
          <div className="flex items-center justify-between mb-2">
            <span className="text-base font-bold text-brand">
              {formatBudget(job.budget_min, job.budget_max)}
            </span>
            <span className="text-xs text-muted">
              {job.bids_count} {job.bids_count === 1 ? 'bid' : 'bids'}
            </span>
          </div>
          <div className="flex items-center justify-between text-xs text-muted">
            <span>Due {formatDate(job.deadline)}</span>
            <span>{formatRelative(job.created_at)}</span>
          </div>
        </div>
      </article>
    </Link>
  );
}
