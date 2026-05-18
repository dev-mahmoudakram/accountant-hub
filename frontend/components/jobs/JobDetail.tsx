'use client';

import { useEffect, useState, useTransition } from 'react';
import Link from 'next/link';
import Container from '@/components/layout/Container';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import { Skeleton } from '@/components/ui/Skeleton';
import BidForm from '@/components/bids/BidForm';
import { useAuth } from '@/components/auth/AuthProvider';
import { api } from '@/lib/api';
import { formatBudget, formatDate, formatRelative } from '@/lib/formatters';
import { JobDetail } from '@/types/job';
import { ApiResponse } from '@/types/api';

interface JobDetailProps {
  jobId: number;
}

function DetailSkeleton() {
  return (
    <div className="py-10">
      <Container>
        <div className="max-w-5xl mx-auto">
          <Skeleton className="h-9 w-2/3 mb-3" />
          <Skeleton className="h-5 w-48 mb-8" />
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <Skeleton key={i} className={`h-4 ${i % 3 === 2 ? 'w-3/4' : 'w-full'}`} />
              ))}
            </div>
            <Skeleton className="h-56 rounded-xl" />
          </div>
        </div>
      </Container>
    </div>
  );
}

export default function JobDetailContent({ jobId }: JobDetailProps) {
  const { isAuthenticated } = useAuth();
  const [isPending, startTransition] = useTransition();
  const [job, setJob] = useState<JobDetail | null>(null);
  const [hasApplied, setHasApplied] = useState(false);

  useEffect(() => {
    let cancelled = false;
    startTransition(async () => {
      try {
        const data = await api.get<ApiResponse<JobDetail>>(`/jobs/${jobId}`);
        if (!cancelled) {
          setJob(data.data);
          setHasApplied(data.data.user_has_bid ?? false);
        }
      } catch {
        // handled by job === null state
      }
    });
    return () => { cancelled = true; };
  }, [jobId]);

  if (job === null || isPending) return <DetailSkeleton />;

  return (
    <div className="py-10">
      <Container>
        <div className="max-w-5xl mx-auto">

          {/* Header */}
          <div className="mb-8">
            <div className="flex items-start gap-4 mb-3">
              <h1 className="text-2xl sm:text-3xl font-bold text-ink leading-tight flex-1">
                {job.title}
              </h1>
              <Badge variant={job.status} className="shrink-0 mt-1 text-sm px-3 py-1">
                {job.status === 'open' ? 'Open' : 'Closed'}
              </Badge>
            </div>
            <div className="flex flex-wrap items-center gap-2 text-sm text-muted">
              <span className="font-medium text-ink">{job.company_name}</span>
              <span>·</span>
              <span>{job.category?.name}</span>
              <span>·</span>
              <span>Posted {formatRelative(job.created_at)}</span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

            {/* Main content */}
            <div className="lg:col-span-2 space-y-8">
              <section>
                <h2 className="text-base font-semibold text-ink mb-3">Job Description</h2>
                <p className="text-sm text-muted leading-relaxed whitespace-pre-wrap">{job.description}</p>
              </section>

              {job.required_skills.length > 0 && (
                <section>
                  <h2 className="text-base font-semibold text-ink mb-3">Required Skills</h2>
                  <div className="flex flex-wrap gap-2">
                    {job.required_skills.map((skill) => (
                      <span key={skill} className="text-xs font-medium px-3 py-1 rounded-full bg-brand-light text-brand">
                        {skill}
                      </span>
                    ))}
                  </div>
                </section>
              )}

              {job.attachments.length > 0 && (
                <section>
                  <h2 className="text-base font-semibold text-ink mb-3">Attachments</h2>
                  <ul className="space-y-2">
                    {job.attachments.map((file, i) => (
                      <li key={i} className="flex items-center gap-2 text-sm text-brand hover:underline cursor-pointer">
                        <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                            d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                        </svg>
                        {file}
                      </li>
                    ))}
                  </ul>
                </section>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-5">

              {/* Job meta */}
              <div className="bg-white border border-border rounded-xl p-5 space-y-3">
                <div className="flex items-center justify-between py-1 border-b border-border">
                  <span className="text-xs text-muted">Budget</span>
                  <span className="text-sm font-bold text-brand">{formatBudget(job.budget_min, job.budget_max)}</span>
                </div>
                <div className="flex items-center justify-between py-1 border-b border-border">
                  <span className="text-xs text-muted">Deadline</span>
                  <span className="text-xs font-medium text-ink">{formatDate(job.deadline)}</span>
                </div>
                <div className="flex items-center justify-between py-1 border-b border-border">
                  <span className="text-xs text-muted">Delivery time</span>
                  <span className="text-xs font-medium text-ink">{job.expected_delivery_time}</span>
                </div>
                <div className="flex items-center justify-between py-1">
                  <span className="text-xs text-muted">Bids received</span>
                  <span className="text-xs font-medium text-ink">{job.bids_count}</span>
                </div>
              </div>

              {/* Bid CTA */}
              {job.status === 'closed' ? (
                <div className="bg-surface border border-border rounded-xl p-5 text-center">
                  <p className="text-sm font-semibold text-muted">This job is closed</p>
                  <p className="text-xs text-muted mt-1">No longer accepting bids</p>
                </div>
              ) : !isAuthenticated ? (
                <div className="bg-brand-light border border-brand rounded-xl p-5 text-center space-y-3">
                  <p className="text-sm font-semibold text-ink">Want to bid on this job?</p>
                  <Link href={`/login?redirect=/jobs/${jobId}`}>
                    <Button variant="primary" size="md" className="w-full">
                      Login to Submit a Bid
                    </Button>
                  </Link>
                  <p className="text-xs text-muted">
                    No account?{' '}
                    <Link href="/register" className="text-brand hover:underline font-medium">
                      Register free
                    </Link>
                  </p>
                </div>
              ) : hasApplied ? (
                <div className="bg-brand-light border border-brand rounded-xl p-5 text-center">
                  <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center mx-auto mb-3">
                    <svg className="w-5 h-5 text-brand" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <p className="text-sm font-semibold text-brand">Bid Submitted</p>
                  <p className="text-xs text-muted mt-1">You've already applied for this job</p>
                </div>
              ) : (
                <div className="bg-white border border-border rounded-xl p-5">
                  <h2 className="text-base font-semibold text-ink mb-4">Submit Your Bid</h2>
                  <BidForm jobId={jobId} onSuccess={() => setHasApplied(true)} />
                </div>
              )}

            </div>
          </div>
        </div>
      </Container>
    </div>
  );
}
