'use client';

import { useEffect, useState, useTransition } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
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
import { fadeUp, staggerContainer } from '@/lib/animations';

interface JobDetailProps {
  jobId: number;
}

function DetailSkeleton() {
  return (
    <div className="py-10 lg:py-12">
      <Container>
        <div className="max-w-5xl mx-auto">
          <Skeleton className="h-4 w-48 mb-6" />
          <Skeleton className="h-9 w-2/3 mb-3" />
          <Skeleton className="h-5 w-64 mb-10" />
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-3">
              {Array.from({ length: 8 }).map((_, i) => (
                <Skeleton key={i} className={`h-4 ${i % 3 === 2 ? 'w-3/4' : 'w-full'}`} />
              ))}
            </div>
            <div className="space-y-3">
              <Skeleton className="h-52 rounded-2xl" />
              <Skeleton className="h-36 rounded-2xl" />
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
}

function MetaRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between py-3 border-b border-border last:border-0">
      <span className="text-xs font-medium text-muted">{label}</span>
      <span className="text-sm font-semibold text-ink text-right">{value}</span>
    </div>
  );
}

export default function JobDetailContent({ jobId }: JobDetailProps) {
  const { isAuthenticated, user } = useAuth();
  const [isPending, startTransition] = useTransition();
  const [job, setJob] = useState<JobDetail | null>(null);
  const [bidStatus, setBidStatus] = useState<'pending' | 'accepted' | 'rejected' | null>(null);

  useEffect(() => {
    let cancelled = false;
    startTransition(async () => {
      try {
        const data = await api.get<ApiResponse<JobDetail>>(`/jobs/${jobId}`);
        if (!cancelled) {
          setJob(data.data);
          setBidStatus(data.data.user_bid?.status ?? null);
        }
      } catch {
        // handled by job === null state
      }
    });
    return () => { cancelled = true; };
  }, [jobId]);

  if (job === null || isPending) return <DetailSkeleton />;

  return (
    <div className="py-10 lg:py-12">
      <Container>
        <div className="max-w-5xl mx-auto">

          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-xs text-muted mb-6">
            <Link href="/jobs" className="hover:text-brand transition-colors">
              Browse Jobs
            </Link>
            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
            <span className="text-ink font-medium truncate max-w-48">{job.title}</span>
          </nav>

          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
          >
            {/* Job Header */}
            <motion.div variants={fadeUp} className="mb-8">
              <div className="flex items-start gap-4 mb-3 flex-wrap">
                <h1 className="text-2xl sm:text-3xl font-bold text-ink leading-tight flex-1 min-w-0">
                  {job.title}
                </h1>
                <Badge variant={job.status} dot className="shrink-0 mt-1 text-sm px-3 py-1">
                  {job.status === 'open' ? 'Open' : 'Closed'}
                </Badge>
              </div>
              <div className="flex flex-wrap items-center gap-2 text-sm text-muted">
                <span className="flex items-center gap-1.5">
                  <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                      d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                  <span className="font-medium text-ink">{job.company_name}</span>
                </span>
                <span className="text-border">·</span>
                <span>{job.category?.name}</span>
                <span className="text-border">·</span>
                <span>Posted {formatRelative(job.created_at)}</span>
              </div>
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

              {/* Main content */}
              <motion.div variants={fadeUp} className="lg:col-span-2 space-y-8">

                <section className="bg-white border border-border rounded-2xl p-6">
                  <h2 className="text-sm font-semibold text-ink mb-4 flex items-center gap-2">
                    <svg className="w-4 h-4 text-brand" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    Job Description
                  </h2>
                  <p className="text-sm text-muted leading-relaxed whitespace-pre-wrap wrap-break-word">
                    {job.description}
                  </p>
                </section>

                {job.required_skills.length > 0 && (
                  <section className="bg-white border border-border rounded-2xl p-6">
                    <h2 className="text-sm font-semibold text-ink mb-4 flex items-center gap-2">
                      <svg className="w-4 h-4 text-brand" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                          d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                      </svg>
                      Required Skills
                    </h2>
                    <div className="flex flex-wrap gap-2">
                      {job.required_skills.map((skill) => (
                        <span
                          key={skill}
                          className="text-xs font-medium px-3 py-1.5 rounded-lg bg-brand-light text-brand border border-brand/20"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </section>
                )}

                {job.attachments.length > 0 && (
                  <section className="bg-white border border-border rounded-2xl p-6">
                    <h2 className="text-sm font-semibold text-ink mb-4 flex items-center gap-2">
                      <svg className="w-4 h-4 text-brand" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                          d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                      </svg>
                      Attachments
                    </h2>
                    <ul className="space-y-2">
                      {job.attachments.map((file) => (
                        <li key={file.path}>
                          <a
                            href={file.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 text-sm text-brand hover:underline py-1"
                          >
                          <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                              d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                          </svg>
                          {file.name}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </section>
                )}
              </motion.div>

              {/* Sidebar */}
              <motion.div variants={fadeUp} className="space-y-4">

                {/* Job meta card */}
                <div className="bg-white border border-border rounded-2xl p-5 shadow-sm">
                  <p className="text-xs font-semibold uppercase tracking-wider text-muted mb-3">
                    Job Details
                  </p>
                  <MetaRow
                    label="Budget"
                    value={
                      <span className="text-brand">
                        {formatBudget(job.budget_min, job.budget_max)}
                      </span>
                    }
                  />
                  <MetaRow label="Deadline" value={formatDate(job.deadline)} />
                  <MetaRow label="Delivery time" value={job.expected_delivery_time} />
                  <MetaRow
                    label="Bids received"
                    value={
                      <span className="flex items-center gap-1">
                        <svg className="w-3.5 h-3.5 text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                            d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        {job.bids_count}
                      </span>
                    }
                  />
                  {job.poster && (
                    <MetaRow
                      label="Posted by"
                      value={
                        <span className="flex items-center gap-1.5">
                          <span className="w-5 h-5 rounded-full bg-brand-light border border-brand/20 flex items-center justify-center text-[10px] font-bold text-brand shrink-0">
                            {job.poster.name.charAt(0).toUpperCase()}
                          </span>
                          {job.poster.name}
                        </span>
                      }
                    />
                  )}
                </div>

                {/* Bid action area */}
                {job.status === 'closed' ? (
                  <div className="bg-surface border border-border rounded-2xl p-5 text-center">
                    <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-3">
                      <svg className="w-5 h-5 text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                          d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                    </div>
                    <p className="text-sm font-semibold text-ink">Job Closed</p>
                    <p className="text-xs text-muted mt-1">No longer accepting bids</p>
                  </div>
                ) : !isAuthenticated ? (
                  <div className="bg-white border border-brand/30 rounded-2xl p-5 text-center space-y-3 shadow-sm">
                    <div className="w-10 h-10 rounded-full bg-brand-light flex items-center justify-center mx-auto">
                      <svg className="w-5 h-5 text-brand" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                          d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-ink">Want to bid on this job?</p>
                      <p className="text-xs text-muted mt-0.5">Sign in to submit your proposal</p>
                    </div>
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
                ) : user?.role === 'client' ? (
                  <div className="bg-surface border border-border rounded-2xl p-5 text-center">
                    <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-3">
                      <svg className="w-5 h-5 text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                          d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <p className="text-sm font-semibold text-ink">You&apos;re a Client</p>
                    <p className="text-xs text-muted mt-1">Clients post jobs — accountants bid on them</p>
                    <Link href="/client/jobs" className="mt-3 block">
                      <Button variant="outline" size="sm" className="w-full">
                        Go to My Jobs
                      </Button>
                    </Link>
                  </div>
                ) : job.poster && user?.id === job.poster.id ? (
                  <div className="bg-surface border border-border rounded-2xl p-5 text-center">
                    <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-3">
                      <svg className="w-5 h-5 text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                          d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                      </svg>
                    </div>
                    <p className="text-sm font-semibold text-ink">This is your job</p>
                    <p className="text-xs text-muted mt-1">You can&apos;t bid on a job you posted</p>
                    <Link href={`/client/jobs/${jobId}`} className="mt-3 block">
                      <Button variant="outline" size="sm" className="w-full">
                        Manage This Job
                      </Button>
                    </Link>
                  </div>
                ) : bidStatus === 'accepted' ? (
                  <div className="space-y-3">
                    <div className="bg-brand-light border border-brand/30 rounded-2xl p-5 text-center shadow-sm">
                      <div className="w-10 h-10 rounded-full bg-brand flex items-center justify-center mx-auto mb-3 shadow-sm">
                        <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5}
                            d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <p className="text-sm font-semibold text-brand">Bid Accepted!</p>
                      <p className="text-xs text-muted mt-1">Congratulations — the client chose your bid for this job</p>
                    </div>
                    <Link href="/dashboard" className="block">
                      <Button variant="primary" size="sm" className="w-full">
                        View My Bids
                      </Button>
                    </Link>
                  </div>
                ) : bidStatus === 'rejected' ? (
                  <div className="space-y-3">
                    <div className="bg-red-50 border border-red-200 rounded-2xl p-5 text-center">
                      <div className="w-10 h-10 rounded-full bg-white border border-red-200 flex items-center justify-center mx-auto mb-3 shadow-sm">
                        <svg className="w-5 h-5 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                            d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </div>
                      <p className="text-sm font-semibold text-red-600">Bid Rejected</p>
                      <p className="text-xs text-muted mt-1">The client didn&apos;t move forward with your bid this time.</p>
                    </div>
                    <Link href="/dashboard" className="block">
                      <Button variant="outline" size="sm" className="w-full">
                        View My Bids
                      </Button>
                    </Link>
                  </div>
                ) : bidStatus === 'pending' ? (
                  <div className="space-y-3">
                    <div className="bg-brand-light border border-brand/30 rounded-2xl p-5 text-center shadow-sm">
                      <div className="w-10 h-10 rounded-full bg-white border border-brand/20 flex items-center justify-center mx-auto mb-3 shadow-sm">
                        <svg className="w-5 h-5 text-brand" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5}
                            d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <p className="text-sm font-semibold text-brand">Bid Submitted!</p>
                      <p className="text-xs text-muted mt-1">You&apos;ve already applied for this job — awaiting the client&apos;s decision</p>
                    </div>
                    <Link href="/dashboard" className="block">
                      <Button variant="outline" size="sm" className="w-full">
                        View My Bids
                      </Button>
                    </Link>
                  </div>
                ) : (
                  <div className="bg-white border border-border rounded-2xl p-5 shadow-sm">
                    <h2 className="text-sm font-semibold text-ink mb-4 flex items-center gap-2">
                      <svg className="w-4 h-4 text-brand" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                          d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                      </svg>
                      Submit Your Bid
                    </h2>
                    <BidForm
                      jobId={jobId}
                      budgetMin={job.budget_min}
                      budgetMax={job.budget_max}
                      expectedDeliveryTime={job.expected_delivery_time}
                      onSuccess={() => setBidStatus('pending')}
                    />
                  </div>
                )}

              </motion.div>
            </div>
          </motion.div>
        </div>
      </Container>
    </div>
  );
}
