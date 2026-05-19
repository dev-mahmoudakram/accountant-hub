'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import Container from '@/components/layout/Container';
import JobCard from './JobCard';
import JobFiltersPanel from './JobFilters';
import Pagination from '@/components/ui/Pagination';
import EmptyState from '@/components/ui/EmptyState';
import { JobCardSkeleton } from '@/components/ui/Skeleton';
import { api } from '@/lib/api';
import { JobCategory, JobListItem } from '@/types/job';
import { ApiResponse, PaginatedResponse } from '@/types/api';
import { staggerContainer, fadeUp } from '@/lib/animations';

export default function JobsContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [jobs, setJobs] = useState<JobListItem[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<JobCategory[]>([]);
  const [years, setYears] = useState<number[]>([]);
  const [meta, setMeta] = useState({ currentPage: 1, lastPage: 1, total: 0 });

  useEffect(() => {
    api.get<ApiResponse<JobCategory[]>>('/categories').then((r) => setCategories(r.data)).catch(() => {});
    api.get<ApiResponse<number[]>>('/jobs/years').then((r) => setYears(r.data)).catch(() => {});
  }, []);

  useEffect(() => {
    let cancelled = false;

    async function fetchJobs() {
      setLoading(true);
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
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    fetchJobs();

    return () => { cancelled = true; };
  }, [searchParams]);

  function handlePageChange(page: number) {
    const params = new URLSearchParams(searchParams.toString());
    params.set('page', String(page));
    router.push(`/jobs?${params.toString()}`);
  }

  const isLoading = jobs === null || loading;

  return (
    <div className="py-10 lg:py-12">
      <Container>
        {/* Page header */}
        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-ink">Browse Jobs</h1>
          <p className="text-sm text-muted mt-1">
            {isLoading
              ? 'Loading available jobs…'
              : `${meta.total} ${meta.total === 1 ? 'job' : 'jobs'} available`}
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters sidebar */}
          <aside className="w-full lg:w-72 shrink-0">
            <div className="sticky top-24">
              <JobFiltersPanel categories={categories} years={years} />
            </div>
          </aside>

          {/* Job grid */}
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
                icon={
                  <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                }
              />
            ) : (
              <>
                <motion.div
                  variants={staggerContainer}
                  initial="hidden"
                  animate="visible"
                  className="grid grid-cols-1 sm:grid-cols-2 gap-5"
                >
                  {jobs!.map((job) => (
                    <motion.div key={job.id} variants={fadeUp}>
                      <JobCard job={job} />
                    </motion.div>
                  ))}
                </motion.div>

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
