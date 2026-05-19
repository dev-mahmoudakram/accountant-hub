'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/components/auth/AuthProvider';
import { api } from '@/lib/api';
import { JobDetail } from '@/types/job';
import { ApiResponse } from '@/types/api';
import Container from '@/components/layout/Container';
import PostJobForm from '@/components/client/PostJobForm';
import { toast } from 'sonner';

export default function EditJobPage() {
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
      .then((res) => {
        if (res.data.status === 'closed') {
          toast.error('Closed jobs cannot be edited.');
          router.replace(`/client/jobs/${id}`);
          return;
        }
        setJob(res.data);
      })
      .catch(() => {
        toast.error('Job not found.');
        router.replace('/client/jobs');
      })
      .finally(() => setLoading(false));
  }, [isReady, isAuthenticated, user, id, router]);

  if (!isReady || !isAuthenticated || user?.role !== 'client') return null;

  if (loading) {
    return (
      <Container>
        <div className="py-10 animate-pulse space-y-4 max-w-2xl mx-auto">
          <div className="h-8 bg-surface rounded-xl w-1/2" />
          <div className="h-64 bg-surface rounded-2xl" />
        </div>
      </Container>
    );
  }

  if (!job) return null;

  return (
    <Container>
      <div className="py-10 lg:py-12 max-w-2xl mx-auto">
        {/* Breadcrumb */}
        <nav className="text-sm text-muted mb-6">
          <Link href="/client/jobs" className="hover:text-brand transition-colors">My Jobs</Link>
          <span className="mx-2">›</span>
          <Link href={`/client/jobs/${job.id}`} className="hover:text-brand transition-colors">{job.title}</Link>
          <span className="mx-2">›</span>
          <span className="text-ink">Edit</span>
        </nav>

        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-ink">Edit Job</h1>
          <p className="text-sm text-muted mt-1">{job.title}</p>
        </div>

        <PostJobForm initialData={job} jobId={Number(id)} />
      </div>
    </Container>
  );
}
