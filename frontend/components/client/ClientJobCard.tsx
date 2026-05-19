import Link from 'next/link';
import { JobListItem } from '@/types/job';
import Badge from '@/components/ui/Badge';
import { formatCurrency, formatDate } from '@/lib/formatters';

interface Props {
  job: JobListItem;
  onDelete: (id: number) => void;
}

export default function ClientJobCard({ job, onDelete }: Props) {
  return (
    <div className="bg-white border border-border rounded-2xl p-5 flex flex-col gap-4 hover:border-brand/30 hover:shadow-sm transition-all">
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <Link
            href={`/client/jobs/${job.id}`}
            className="text-base font-semibold text-ink hover:text-brand transition-colors line-clamp-2 leading-snug"
          >
            {job.title}
          </Link>
          <p className="text-xs text-muted mt-1">{job.category.name}</p>
        </div>
        <Badge variant={job.status === 'open' ? 'success' : 'default'}>
          {job.status === 'open' ? 'Open' : 'Closed'}
        </Badge>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-surface rounded-xl p-3">
          <p className="text-xs text-muted mb-0.5">Budget</p>
          <p className="text-sm font-semibold text-ink">
            {formatCurrency(job.budget_min)} – {formatCurrency(job.budget_max)}
          </p>
        </div>
        <div className="bg-surface rounded-xl p-3">
          <p className="text-xs text-muted mb-0.5">Bids Received</p>
          <p className="text-sm font-semibold text-ink">
            {job.bids_count} bid{job.bids_count !== 1 ? 's' : ''}
          </p>
        </div>
      </div>

      {/* Deadline */}
      <p className="text-xs text-muted">
        Deadline: <span className="text-ink font-medium">{formatDate(job.deadline)}</span>
      </p>

      {/* Actions */}
      <div className="flex gap-2 pt-1 border-t border-border">
        <Link
          href={`/client/jobs/${job.id}`}
          className="flex-1 text-center text-sm font-semibold text-brand hover:text-brand-dark transition-colors py-2 rounded-lg hover:bg-brand/5"
        >
          View Bids
        </Link>
        {job.status === 'open' && (
          <Link
            href={`/client/jobs/${job.id}/edit`}
            className="flex-1 text-center text-sm font-semibold text-muted hover:text-ink transition-colors py-2 rounded-lg hover:bg-surface"
          >
            Edit
          </Link>
        )}
        <button
          type="button"
          onClick={() => onDelete(job.id)}
          className="flex-1 text-center text-sm font-semibold text-red-500 hover:text-red-700 transition-colors py-2 rounded-lg hover:bg-red-50"
        >
          Delete
        </button>
      </div>
    </div>
  );
}
