'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { useAuth } from '@/components/auth/AuthProvider';
import { api } from '@/lib/api';
import { JobListItem } from '@/types/job';
import { PaginatedResponse } from '@/types/api';
import ClientJobCard from './ClientJobCard';
import { JobCardSkeleton } from '@/components/ui/Skeleton';
import EmptyState from '@/components/ui/EmptyState';
import Pagination from '@/components/ui/Pagination';
import Button from '@/components/ui/Button';
import ConfirmDialog from '@/components/ui/ConfirmDialog';
import { staggerContainer, fadeUp } from '@/lib/animations';

interface Meta {
  current_page: number;
  last_page: number;
  total: number;
}

export default function ClientJobsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, isAuthenticated, isReady } = useAuth();
  const [jobs, setJobs] = useState<JobListItem[] | null>(null);
  const [meta, setMeta] = useState<Meta>({ current_page: 1, last_page: 1, total: 0 });
  const [loading, setLoading] = useState(true);
  const [pendingDeleteId, setPendingDeleteId] = useState<number | null>(null);
  const [deleting, setDeleting] = useState(false);

  const page = Number(searchParams.get('page') ?? '1');
  const pendingDeleteJob = pendingDeleteId !== null
    ? jobs?.find((j) => j.id === pendingDeleteId) ?? null
    : null;

  useEffect(() => {
    if (!isReady) return;
    if (!isAuthenticated) { router.replace('/login'); return; }
    if (user?.role !== 'client') { router.replace('/dashboard'); return; }
  }, [isReady, isAuthenticated, user, router]);

  useEffect(() => {
    if (!isReady || !isAuthenticated || user?.role !== 'client') return;
    setLoading(true);

    api.get<PaginatedResponse<JobListItem>>(`/client/jobs?page=${page}`)
      .then((res) => {
        setJobs(res.data);
        setMeta(res.meta);
      })
      .catch(() => toast.error('Failed to load your jobs.'))
      .finally(() => setLoading(false));
  }, [isReady, isAuthenticated, user, page]);

  function handleDelete(id: number) {
    setPendingDeleteId(id);
  }

  async function confirmDelete() {
    if (pendingDeleteId === null) return;
    setDeleting(true);
    try {
      await api.delete(`/client/jobs/${pendingDeleteId}`);
      setJobs((prev) => prev?.filter((j) => j.id !== pendingDeleteId) ?? null);
      setMeta((prev) => ({ ...prev, total: Math.max(0, prev.total - 1) }));
      toast.success('Job deleted.');
      setPendingDeleteId(null);
    } catch {
      toast.error('Failed to delete job.');
    } finally {
      setDeleting(false);
    }
  }

  function handlePageChange(p: number) {
    const params = new URLSearchParams(window.location.search);
    params.set('page', String(p));
    router.push(`/client/jobs?${params.toString()}`);
  }

  if (!isReady || !isAuthenticated || user?.role !== 'client') return null;

  return (
    <div className="py-10 lg:py-12">
      {/* Header */}
      <div className="flex items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-ink">My Jobs</h1>
          {!loading && (
            <p className="text-sm text-muted mt-1">
              {meta.total === 0
                ? 'No jobs posted yet'
                : `${meta.total} job${meta.total !== 1 ? 's' : ''} posted`}
            </p>
          )}
        </div>
        <Link href="/client/jobs/new">
          <Button variant="primary" size="sm">
            <svg className="w-4 h-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Post a Job
          </Button>
        </Link>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => <JobCardSkeleton key={i} />)}
        </div>
      ) : jobs?.length === 0 ? (
        <EmptyState
          title="No jobs posted yet"
          description="Post your first job and start receiving bids from qualified accountants."
          icon={
            <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          }
          action={
            <Link href="/client/jobs/new">
              <Button variant="primary">Post Your First Job</Button>
            </Link>
          }
        />
      ) : (
        <>
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
          >
            {jobs!.map((job) => (
              <motion.div key={job.id} variants={fadeUp}>
                <ClientJobCard job={job} onDelete={handleDelete} />
              </motion.div>
            ))}
          </motion.div>

          {meta.last_page > 1 && (
            <div className="mt-10">
              <Pagination
                currentPage={meta.current_page}
                lastPage={meta.last_page}
                onPageChange={handlePageChange}
              />
            </div>
          )}
        </>
      )}

      <ConfirmDialog
        open={pendingDeleteId !== null}
        variant="danger"
        title="Delete this job?"
        description={
          pendingDeleteJob
            ? `"${pendingDeleteJob.title}" and all its bids will be permanently removed. This cannot be undone.`
            : 'This cannot be undone.'
        }
        confirmLabel="Delete job"
        cancelLabel="Cancel"
        loading={deleting}
        onConfirm={confirmDelete}
        onCancel={() => { if (!deleting) setPendingDeleteId(null); }}
      />
    </div>
  );
}
