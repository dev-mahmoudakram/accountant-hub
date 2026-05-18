'use client';

import { useEffect, useState, useTransition } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Container from '@/components/layout/Container';
import JobCard from './JobCard';
import JobFiltersPanel from './JobFilters';
import Pagination from '@/components/ui/Pagination';
import EmptyState from '@/components/ui/EmptyState';
import { JobCardSkeleton } from '@/components/ui/Skeleton';
import { api } from '@/lib/api';
import { JobCategory, JobListItem } from '@/types/job';
import { ApiResponse, PaginatedResponse } from '@/types/api';

export default function JobsContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const [jobs, setJobs] = useState<JobListItem[] | null>(null);
  const [categories, setCategories] = useState<JobCategory[]>([]);
  const [meta, setMeta] = useState({ currentPage: 1, lastPage: 1, total: 0 });

  useEffect(() => {
    api
      .get<ApiResponse<JobCategory[]>>('/categories')
      .then((r) => setCategories(r.data))
      .catch(() => {});
  }, []);

  useEffect(() => {
    let cancelled = false;

    startTransition(async () => {
      const params: Record<string, string | number> = {};
      searchParams.forEach((value, key) => {
        if (value) params[key] = value;
      });
      if (!params.per_page) params.per_page = 12;

      try {
        const data = await api.get<PaginatedResponse<JobListItem>>('/jobs', params);
        if (!cancelled) {
          setJobs(data.data);
          setMeta({
            currentPage: data.meta.current_page,
            lastPage: data.meta.last_page,
            total: data.meta.total,
          });
        }
      } catch {
        if (!cancelled) setJobs([]);
      }
    });

    return () => { cancelled = true; };
  }, [searchParams]);

  function handlePageChange(page: number) {
    const params = new URLSearchParams(searchParams.toString());
    params.set('page', String(page));
    router.push(`/jobs?${params.toString()}`);
  }

  const isLoading = jobs === null || isPending;

  return (
    <div className="py-10">
      <Container>
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-ink">Browse Jobs</h1>
          {!isLoading && (
            <p className="text-muted mt-1">
              {meta.total} {meta.total === 1 ? 'job' : 'jobs'} available
            </p>
          )}
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          <aside className="w-full lg:w-72 shrink-0">
            <div className="sticky top-24">
              <JobFiltersPanel categories={categories} />
            </div>
          </aside>

          <div className="flex-1 min-w-0">
            {isLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {Array.from({ length: 6 }).map((_, i) => (
                  <JobCardSkeleton key={i} />
                ))}
              </div>
            ) : jobs!.length === 0 ? (
              <EmptyState
                title="No jobs found"
                description="Try adjusting your filters or search terms to find available jobs."
              />
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  {jobs!.map((job) => (
                    <JobCard key={job.id} job={job} />
                  ))}
                </div>
                <div className="mt-10">
                  <Pagination
                    currentPage={meta.currentPage}
                    lastPage={meta.lastPage}
                    onPageChange={handlePageChange}
                  />
                </div>
              </>
            )}
          </div>
        </div>
      </Container>
    </div>
  );
}
