'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, useInView, animate } from 'framer-motion';
import { useAuth } from '@/components/auth/AuthProvider';
import { IMAGES } from '@/lib/images';
import { fadeUp, staggerContainer, slideInLeft, slideInRight } from '@/lib/animations';

/* ─────────────────────────── Count-up ─────────────────────────── */
function CountUp({ end, suffix = '' }: { end: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-40px' });
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (!isInView) return;
    const controls = animate(0, end, {
      duration: 1.8,
      ease: 'easeOut',
      onUpdate: (v) => setDisplay(Math.round(v)),
    });
    return controls.stop;
  }, [isInView, end]);

  return (
    <span ref={ref}>
      {display}{suffix}
    </span>
  );
}

/* ─────────────────────────── Data ─────────────────────────── */
const STATS = [
  { end: 500, suffix: '+', label: 'Jobs Posted' },
  { end: 200, suffix: '+', label: 'Accountants' },
  { end: 95,  suffix: '%', label: 'Success Rate' },
  { end: 24,  suffix: 'h', label: 'Avg Response' },
];

const CATEGORIES = [
  {
    slug: 'tax-compliance',
    label: 'Tax & Compliance',
    count: '120+ jobs',
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
          d="M9 14l6-6m-5.5.5h.01m4.99 5h.01M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16l3.5-2 3.5 2 3.5-2 3.5 2z" />
      </svg>
    ),
  },
  {
    slug: 'bookkeeping',
    label: 'Bookkeeping',
    count: '95+ jobs',
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
          d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
      </svg>
    ),
  },
  {
    slug: 'audit-assurance',
    label: 'Audit & Assurance',
    count: '60+ jobs',
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
          d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      </svg>
    ),
  },
  {
    slug: 'financial-advisory',
    label: 'Financial Advisory',
    count: '80+ jobs',
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
          d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
      </svg>
    ),
  },
  {
    slug: 'payroll-management',
    label: 'Payroll Management',
    count: '45+ jobs',
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
          d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
      </svg>
    ),
  },
  {
    slug: 'financial-reporting',
    label: 'Financial Reporting',
    count: '70+ jobs',
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
          d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    ),
  },
];

const STEPS = [
  {
    num: '01',
    title: 'Browse Jobs',
    desc: 'Search and filter accounting jobs by category, budget, and deadline.',
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
      </svg>
    ),
  },
  {
    num: '02',
    title: 'Submit Your Bid',
    desc: 'Write a compelling proposal with your price and estimated delivery time.',
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
      </svg>
    ),
  },
  {
    num: '03',
    title: 'Get Hired',
    desc: 'Clients review bids and select the best accountant for their needs.',
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
];

const TESTIMONIALS = [
  {
    name: 'Sarah Mitchell',
    role: 'Senior Accountant',
    location: 'New York, USA',
    text: 'AccountantHub helped me land 3 long-term clients within my first month. The bidding process is simple and the job quality is excellent.',
    avatar: IMAGES.avatar1,
    rating: 5,
  },
  {
    name: 'James Okafor',
    role: 'Tax Specialist',
    location: 'London, UK',
    text: 'The platform is transparent and fair. I can filter jobs by budget and category which saves me hours of searching every week.',
    avatar: IMAGES.avatar2,
    rating: 5,
  },
  {
    name: 'David Chen',
    role: 'Financial Advisor',
    location: 'Toronto, Canada',
    text: "I've doubled my client base since joining. The dashboard makes it easy to track all my bids and follow up professionally.",
    avatar: IMAGES.avatar3,
    rating: 5,
  },
];

/* ─────────────────────────── Auth-aware CTA buttons ─────────────────────────── */
function HeroCTAButtons() {
  const { isAuthenticated, isReady } = useAuth();
  if (!isReady) return null;
  return (
    <div className="flex flex-col sm:flex-row gap-3">
      <Link
        href="/jobs"
        className="inline-flex items-center justify-center rounded-lg font-semibold px-6 py-3 text-base bg-white text-ink hover:bg-white/90 transition-colors shadow-sm"
      >
        Browse Jobs
        <svg className="w-4 h-4 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
        </svg>
      </Link>
      {!isAuthenticated && (
        <Link
          href="/register"
          className="inline-flex items-center justify-center rounded-lg font-semibold px-6 py-3 text-base border-2 border-white/30 text-white hover:bg-white/10 transition-colors"
        >
          Create Account
        </Link>
      )}
    </div>
  );
}

function BottomCTAButtons() {
  const { isAuthenticated, isReady } = useAuth();
  if (!isReady) return null;
  return (
    <div className="flex flex-col sm:flex-row justify-center gap-3">
      {!isAuthenticated ? (
        <>
          <Link href="/register" className="inline-flex items-center justify-center rounded-lg font-semibold px-6 py-3 text-base bg-brand text-white hover:bg-brand-dark transition-colors">
            Get Started Free
          </Link>
          <Link href="/jobs" className="inline-flex items-center justify-center rounded-lg font-semibold px-6 py-3 text-base border-2 border-white/30 text-white hover:bg-white/10 transition-colors">
            Browse Jobs
          </Link>
        </>
      ) : (
        <Link href="/jobs" className="inline-flex items-center justify-center rounded-lg font-semibold px-6 py-3 text-base bg-brand text-white hover:bg-brand-dark transition-colors">
          Browse Available Jobs
        </Link>
      )}
    </div>
  );
}

function AccountantCTAButton() {
  const { isAuthenticated, isReady } = useAuth();
  if (!isReady || isAuthenticated) return null;
  return (
    <Link
      href="/register"
      className="inline-flex items-center gap-2 rounded-lg font-semibold px-6 py-3 text-base bg-brand text-white hover:bg-brand-dark transition-colors"
    >
      Get Started Free
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
      </svg>
    </Link>
  );
}

/* ─────────────────────────── Star rating ─────────────────────────── */
function Stars({ count }: { count: number }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: count }).map((_, i) => (
        <svg key={i} className="w-4 h-4 text-yellow-400 fill-yellow-400" viewBox="0 0 24 24">
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
        </svg>
      ))}
    </div>
  );
}

/* ─────────────────────────── Page ─────────────────────────── */
export default function HomeContent() {
  return (
    <div>

      {/* ════════════════ HERO ════════════════ */}
      <section className="relative bg-ink overflow-hidden min-h-[calc(100vh-4rem)] flex items-center">
        <div className="hero-glow absolute inset-0 pointer-events-none" />

        <div className="relative w-full mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-20 lg:py-0">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">

            {/* Left – text */}
            <motion.div
              variants={staggerContainer}
              initial="hidden"
              animate="visible"
            >
              <motion.div variants={fadeUp} className="mb-6">
                <span className="inline-flex items-center gap-2 bg-white/10 border border-white/10 text-white/70 rounded-full px-4 py-1.5 text-xs font-medium">
                  <span className="w-1.5 h-1.5 rounded-full bg-brand animate-pulse" />
                  Trusted by accounting professionals
                </span>
              </motion.div>

              <motion.h1
                variants={fadeUp}
                className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight mb-5"
              >
                Find Accounting<br />
                <span className="text-brand">Talent</span> on Demand
              </motion.h1>

              <motion.p
                variants={fadeUp}
                className="text-lg text-white/60 mb-10 leading-relaxed"
              >
                Connect with verified accounting professionals for tax filing,
                bookkeeping, auditing, and more. Browse open jobs and submit
                your bid today.
              </motion.p>

              <motion.div variants={fadeUp}>
                <HeroCTAButtons />
              </motion.div>

              {/* Mini trust row */}
              <motion.div
                variants={fadeUp}
                className="mt-10 flex items-center gap-6 flex-wrap"
              >
                {[
                  { val: '500+', txt: 'open jobs' },
                  { val: '200+', txt: 'professionals' },
                  { val: '95%', txt: 'success rate' },
                ].map(({ val, txt }) => (
                  <div key={txt} className="flex items-center gap-2">
                    <span className="text-brand font-bold text-base">{val}</span>
                    <span className="text-white/40 text-sm">{txt}</span>
                  </div>
                ))}
              </motion.div>
            </motion.div>

            {/* Right – image card */}
            <motion.div
              variants={slideInRight}
              initial="hidden"
              animate="visible"
              className="hidden lg:block"
            >
              <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                <Image
                  src={IMAGES.heroDesk}
                  alt="Financial analytics dashboard"
                  width={600}
                  height={420}
                  className="w-full h-full object-cover"
                  priority
                />
                {/* Overlay gradient for depth */}
                <div className="absolute inset-0 bg-linear-to-tr from-ink/60 via-transparent to-transparent" />

                {/* Floating stat card */}
                <div className="absolute bottom-5 left-5 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl px-4 py-3 flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-brand flex items-center justify-center shrink-0">
                    <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-white text-sm font-semibold leading-none">New jobs daily</p>
                    <p className="text-white/50 text-xs mt-0.5">Always fresh opportunities</p>
                  </div>
                </div>
              </div>
            </motion.div>

          </div>
        </div>
      </section>

      {/* ════════════════ STATS ════════════════ */}
      <section className="border-b border-border bg-white">
        <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-40px' }}
            className="grid grid-cols-2 lg:grid-cols-4 divide-x divide-border"
          >
            {STATS.map(({ end, suffix, label }) => (
              <motion.div
                key={label}
                variants={fadeUp}
                className="flex flex-col items-center justify-center py-10 px-4 text-center"
              >
                <span className="text-3xl sm:text-4xl font-bold text-ink tabular-nums">
                  <CountUp end={end} suffix={suffix} />
                </span>
                <span className="text-xs text-muted mt-1.5 font-medium uppercase tracking-widest">
                  {label}
                </span>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ════════════════ FEATURED CATEGORIES ════════════════ */}
      <section className="py-20 lg:py-24 bg-surface">
        <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.5 }}
            className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-10"
          >
            <div>
              <span className="text-xs font-semibold uppercase tracking-widest text-brand mb-2 block">
                Explore
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold text-ink">Browse by Category</h2>
              <p className="text-muted mt-2 max-w-sm">
                Find accounting work that matches your expertise and experience.
              </p>
            </div>
            <Link
              href="/jobs"
              className="text-sm font-semibold text-brand hover:underline shrink-0 flex items-center gap-1"
            >
              View all jobs
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </motion.div>

          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-60px' }}
            className="grid grid-cols-1 md:grid-cols-3 gap-4"
          >
            {CATEGORIES.map(({ slug, label, count, icon }) => (
              <motion.div key={slug} variants={fadeUp}>
                <Link
                  href={`/jobs?category=${slug}`}
                  className="group flex items-center gap-4 bg-white border border-border rounded-2xl p-5 hover:border-brand/40 hover:shadow-md transition-all duration-300"
                >
                  <div className="w-12 h-12 rounded-xl bg-brand-light flex items-center justify-center text-brand shrink-0 group-hover:bg-brand group-hover:text-white transition-all duration-300">
                    {icon}
                  </div>
                  <div className="min-w-0">
                    <p className="font-semibold text-ink text-sm leading-snug group-hover:text-brand transition-colors">
                      {label}
                    </p>
                    <p className="text-xs text-muted mt-0.5">{count}</p>
                  </div>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ════════════════ HOW IT WORKS ════════════════ */}
      <section className="py-20 lg:py-24 bg-white">
        <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.5 }}
            className="text-center mb-14"
          >
            <span className="text-xs font-semibold uppercase tracking-widest text-brand mb-3 block">Simple Process</span>
            <h2 className="text-2xl sm:text-3xl font-bold text-ink mb-3">How It Works</h2>
            <p className="text-muted max-w-sm mx-auto">Three simple steps to connect with the right accounting talent.</p>
          </motion.div>

          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-60px' }}
            className="grid grid-cols-1 sm:grid-cols-3 gap-8"
          >
            {STEPS.map(({ num, title, desc, icon }) => (
              <motion.div key={num} variants={fadeUp} className="relative text-center group">
                <div className="relative flex justify-center mb-5">
                  <div className="w-14 h-14 rounded-2xl bg-surface border border-border shadow-sm flex items-center justify-center text-brand group-hover:bg-brand group-hover:text-white group-hover:border-brand transition-all duration-300">
                    {icon}
                  </div>
                  <span className="absolute -top-2 -left-2 w-6 h-6 rounded-full bg-brand text-white text-xs font-bold flex items-center justify-center shadow-sm">
                    {num.slice(1)}
                  </span>
                </div>
                <h3 className="font-semibold text-ink mb-2">{title}</h3>
                <p className="text-sm text-muted leading-relaxed">{desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ════════════════ WHO IS IT FOR? ════════════════ */}
      <section className="py-20 lg:py-24 bg-surface">
        <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.5 }}
            className="text-center mb-14"
          >
            <span className="text-xs font-semibold uppercase tracking-widest text-brand mb-3 block">Who Is It For?</span>
            <h2 className="text-2xl sm:text-3xl font-bold text-ink mb-3">Built for Both Sides</h2>
            <p className="text-muted max-w-md mx-auto">
              Whether you need accounting work done or you&apos;re a professional looking for clients, AccountantHub has you covered.
            </p>
          </motion.div>

          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-60px' }}
            className="grid grid-cols-1 lg:grid-cols-2 gap-6"
          >
            {/* Clients */}
            <motion.div variants={fadeUp} className="bg-white border border-border rounded-2xl p-8">
              <div className="w-12 h-12 rounded-2xl bg-brand-light flex items-center justify-center text-brand mb-5">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <span className="text-xs font-semibold uppercase tracking-widest text-brand mb-2 block">For Clients</span>
              <h3 className="text-xl font-bold text-ink mb-3">Post your job and hire with confidence</h3>
              <p className="text-sm text-muted leading-relaxed mb-6">
                Businesses and individuals who need accounting services can post jobs and receive bids from qualified professionals.
              </p>
              <ul className="space-y-3">
                {[
                  'Post a job with your budget and deadline',
                  'Receive competitive bids from verified accountants',
                  'Attach documents and requirements directly to your job',
                  'Review bids and accept the best fit',
                  'Close the job once the work is complete',
                ].map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <span className="w-5 h-5 rounded-full bg-brand/10 border border-brand/20 flex items-center justify-center shrink-0 mt-0.5">
                      <svg className="w-3 h-3 text-brand" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                      </svg>
                    </span>
                    <span className="text-sm text-muted leading-relaxed">{item}</span>
                  </li>
                ))}
              </ul>
            </motion.div>

            {/* Accountants */}
            <motion.div variants={fadeUp} className="bg-white border border-border rounded-2xl p-8">
              <div className="w-12 h-12 rounded-2xl bg-brand-light flex items-center justify-center text-brand mb-5">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
              </div>
              <span className="text-xs font-semibold uppercase tracking-widest text-brand mb-2 block">For Accountants</span>
              <h3 className="text-xl font-bold text-ink mb-3">Find clients and grow your practice</h3>
              <p className="text-sm text-muted leading-relaxed mb-6">
                Accounting professionals can browse jobs, submit proposals, and manage their entire client pipeline from one dashboard.
              </p>
              <ul className="space-y-3">
                {[
                  'Browse jobs filtered by category, budget and deadline',
                  'Submit a bid with your price and cover letter',
                  'Track all your bids — pending, accepted, rejected',
                  'Download client documents and attachments',
                  'No subscription fee — free to join and bid',
                ].map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <span className="w-5 h-5 rounded-full bg-brand/10 border border-brand/20 flex items-center justify-center shrink-0 mt-0.5">
                      <svg className="w-3 h-3 text-brand" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                      </svg>
                    </span>
                    <span className="text-sm text-muted leading-relaxed">{item}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ════════════════ SPLIT SECTION — FOR ACCOUNTANTS ════════════════ */}
      <section className="py-20 lg:py-24 bg-ink overflow-hidden">
        <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">

            {/* Image */}
            <motion.div
              variants={slideInLeft}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-80px' }}
              className="relative order-2 lg:order-1"
            >
              <div className="relative rounded-2xl overflow-hidden shadow-2xl aspect-4/3">
                <Image
                  src={IMAGES.splitWork}
                  alt="Accountant reviewing financial documents"
                  fill
                  className="object-cover opacity-80"
                />
                <div className="absolute inset-0 bg-linear-to-br from-ink/40 via-transparent to-brand/10" />
              </div>

              {/* Floating badge */}
              <div className="absolute -bottom-4 -right-4 bg-brand rounded-2xl px-5 py-4 shadow-xl hidden sm:block">
                <p className="text-white font-bold text-2xl leading-none">500+</p>
                <p className="text-white/70 text-xs mt-1 font-medium">Active Jobs</p>
              </div>
            </motion.div>

            {/* Text */}
            <motion.div
              variants={slideInRight}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-80px' }}
              className="order-1 lg:order-2"
            >
              <span className="text-xs font-semibold uppercase tracking-widest text-brand mb-4 block">
                For Accountants
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4 leading-tight">
                Grow your accounting practice with confidence
              </h2>
              <p className="text-white/60 mb-8 leading-relaxed">
                Join a marketplace built specifically for accounting professionals.
                Browse real jobs from verified companies, submit competitive bids,
                and manage all your opportunities in one clean dashboard.
              </p>

              <ul className="space-y-4 mb-8">
                {[
                  'Browse jobs filtered by category, budget & deadline',
                  'Submit professional bids with cover letters',
                  'Track all your bids in a personal dashboard',
                  'No subscription — completely free to join',
                ].map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <span className="w-5 h-5 rounded-full bg-brand/20 border border-brand/30 flex items-center justify-center shrink-0 mt-0.5">
                      <svg className="w-3 h-3 text-brand" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                      </svg>
                    </span>
                    <span className="text-sm text-white/70 leading-relaxed">{item}</span>
                  </li>
                ))}
              </ul>

              <AccountantCTAButton />
            </motion.div>
          </div>
        </div>
      </section>

      {/* ════════════════ TESTIMONIALS ════════════════ */}
      <section className="py-20 lg:py-24 bg-surface">
        <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.5 }}
            className="text-center mb-12"
          >
            <span className="text-xs font-semibold uppercase tracking-widest text-brand mb-3 block">
              Testimonials
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-ink mb-3">
              Trusted by professionals worldwide
            </h2>
            <p className="text-muted max-w-sm mx-auto">
              Here&apos;s what accounting professionals say about AccountantHub.
            </p>
          </motion.div>

          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-60px' }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6"
          >
            {TESTIMONIALS.map(({ name, role, location, text, avatar, rating }) => (
              <motion.div
                key={name}
                variants={fadeUp}
                className="bg-white border border-border rounded-2xl p-6 flex flex-col hover:shadow-md hover:border-brand/20 transition-all duration-300"
              >
                {/* Stars */}
                <Stars count={rating} />

                {/* Quote */}
                <p className="text-sm text-muted leading-relaxed mt-4 flex-1">
                  &ldquo;{text}&rdquo;
                </p>

                {/* Author */}
                <div className="flex items-center gap-3 mt-6 pt-5 border-t border-border">
                  <div className="relative w-10 h-10 rounded-full overflow-hidden shrink-0 ring-2 ring-brand-light">
                    <Image
                      src={avatar}
                      alt={name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-ink truncate">{name}</p>
                    <p className="text-xs text-muted truncate">{role} · {location}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ════════════════ FINAL CTA ════════════════ */}
      <section className="py-20 bg-ink">
        <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.5 }}
            className="text-center"
          >
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3">
              Ready to find your next client?
            </h2>
            <p className="text-white/50 mb-8 max-w-md mx-auto">
              Join accounting professionals on AccountantHub and start bidding on
              jobs today. Free to join.
            </p>
            <BottomCTAButtons />
          </motion.div>
        </div>
      </section>

    </div>
  );
}
