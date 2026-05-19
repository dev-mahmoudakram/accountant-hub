'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/components/auth/AuthProvider';
import { api } from '@/lib/api';
import { JobDetail } from '@/types/job';
import { ApiResponse } from '@/types/api';
import Container from '@/components/layout/Container';
import JobBidsContent from '@/components/client/JobBidsContent';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import { formatCurrency, formatDate } from '@/lib/formatters';
import { toast } from 'sonner';

export default function ClientJobDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { user, isAuthenticated, isReady } = useAuth();
  const router = useRouter();
  const [job, setJob] = useState<JobDetail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isReady) return;
    if (!isAuthenticated) { router.replace('/login'); return; }
    if (user?.role !== 'client') { router.replace('/dashboard'); return; }
  }, [isReady, isAuthenticated, user, router]);

  useEffect(() => {
    if (!isReady || !isAuthenticated || user?.role !== 'client') return;

    api.get<ApiResponse<JobDetail>>(`/client/jobs/${id}`)
      .then((res) => setJob(res.data))
      .catch(() => {
        toast.error('Job not found or you do not have permission to view it.');
        router.replace('/client/jobs');
      })
      .finally(() => setLoading(false));
  }, [isReady, isAuthenticated, user, id, router]);

  if (!isReady || !isAuthenticated || user?.role !== 'client') return null;

  if (loading) {
    return (
      <Container>
        <div className="py-10 animate-pulse space-y-4">
          <div className="h-8 bg-surface rounded-xl w-2/3" />
          <div className="h-4 bg-surface rounded-xl w-1/3" />
          <div className="h-32 bg-surface rounded-xl" />
        </div>
      </Container>
    );
  }

  if (!job) return null;

  const isOpen = job.status === 'open';

  return (
    <Container>
      <div className="py-10 lg:py-12">
        {/* Breadcrumb */}
        <nav className="text-sm text-muted mb-6">
          <Link href="/client/jobs" className="hover:text-brand transition-colors">My Jobs</Link>
          <span className="mx-2">›</span>
          <span className="text-ink">{job.title}</span>
        </nav>

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-8">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-2xl font-bold text-ink leading-tight">{job.title}</h1>
              <Badge variant={isOpen ? 'success' : 'default'}>
                {isOpen ? 'Open' : 'Closed'}
              </Badge>
            </div>
            <p className="text-sm text-muted">{job.category.name} · {job.company_name}</p>
          </div>

          {isOpen && (
            <Link href={`/client/jobs/${job.id}/edit`}>
              <Button variant="outline" size="sm">Edit Job</Button>
            </Link>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main content */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white border border-border rounded-2xl p-6">
              <h2 className="text-base font-semibold text-ink mb-3">Description</h2>
              <p className="text-sm text-ink leading-relaxed whitespace-pre-line">{job.description}</p>
            </div>

            {job.required_skills.length > 0 && (
              <div className="bg-white border border-border rounded-2xl p-6">
                <h2 className="text-base font-semibold text-ink mb-3">Required Skills</h2>
                <div className="flex flex-wrap gap-2">
                  {job.required_skills.map((skill) => (
                    <span key={skill} className="px-3 py-1 rounded-full bg-brand/10 text-brand text-xs font-medium border border-brand/20">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Bids Section */}
            <div>
              <h2 className="text-lg font-semibold text-ink mb-4">
                Bids ({job.bids_count})
              </h2>
              {!isOpen && (
                <div className="mb-4 p-4 bg-amber-50 border border-amber-200 rounded-xl text-sm text-amber-800">
                  This job is closed. No further bids can be accepted.
                </div>
              )}
              <JobBidsContent jobId={job.id} jobOpen={isOpen} />
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            <div className="bg-white border border-border rounded-2xl p-5 space-y-4">
              <h3 className="text-sm font-semibold text-ink">Job Overview</h3>
              <dl className="space-y-3">
                <div>
                  <dt className="text-xs text-muted">Budget</dt>
                  <dd className="text-sm font-semibold text-ink mt-0.5">
                    {formatCurrency(job.budget_min)} – {formatCurrency(job.budget_max)}
                  </dd>
                </div>
                <div>
                  <dt className="text-xs text-muted">Deadline</dt>
                  <dd className="text-sm font-semibold text-ink mt-0.5">{formatDate(job.deadline)}</dd>
                </div>
                <div>
                  <dt className="text-xs text-muted">Expected Delivery</dt>
                  <dd className="text-sm font-semibold text-ink mt-0.5">{job.expected_delivery_time}</dd>
                </div>
                <div>
                  <dt className="text-xs text-muted">Total Bids</dt>
                  <dd className="text-sm font-semibold text-ink mt-0.5">{job.bids_count}</dd>
                </div>
              </dl>
            </div>
          </div>
        </div>
      </div>
    </Container>
  );
}
