import Link from 'next/link';
import Container from '@/components/layout/Container';

export default function HomePage() {
  return (
    <div>
      {/* Hero */}
      <section className="bg-linear-to-br from-brand to-brand-dark py-24">
        <Container>
          <div className="max-w-2xl">
            <h1 className="text-4xl sm:text-5xl font-bold text-white leading-tight mb-5">
              Find Accounting<br />Talent on Demand
            </h1>
            <p className="text-lg text-white/80 mb-8 max-w-xl leading-relaxed">
              Connect with skilled accounting professionals for tax filing, bookkeeping,
              auditing, and more. Browse open jobs and submit your bid today.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <Link
                href="/jobs"
                className="inline-flex items-center justify-center rounded-lg font-semibold px-6 py-3 text-base bg-white text-brand hover:bg-white/90 transition-colors"
              >
                Browse Jobs
              </Link>
              <Link
                href="/register"
                className="inline-flex items-center justify-center rounded-lg font-semibold px-6 py-3 text-base border-2 border-white/60 text-white hover:bg-white/10 transition-colors"
              >
                Create Account
              </Link>
            </div>
          </div>
        </Container>
      </section>

      {/* How it works */}
      <section className="py-20 bg-surface">
        <Container>
          <div className="text-center mb-14">
            <h2 className="text-2xl font-bold text-ink mb-2">How It Works</h2>
            <p className="text-muted">Three simple steps to get started</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-10">
            {[
              {
                step: '01',
                title: 'Browse Jobs',
                desc: 'Search and filter accounting jobs by category, budget, and deadline.',
              },
              {
                step: '02',
                title: 'Submit Your Bid',
                desc: 'Write a compelling proposal with your price and estimated delivery time.',
              },
              {
                step: '03',
                title: 'Get Hired',
                desc: 'Clients review bids and select the best accountant for their needs.',
              },
            ].map(({ step, title, desc }) => (
              <div key={step} className="text-center">
                <div className="w-12 h-12 rounded-full bg-brand-light flex items-center justify-center text-brand font-bold text-sm mx-auto mb-4">
                  {step}
                </div>
                <h3 className="font-semibold text-ink mb-2">{title}</h3>
                <p className="text-sm text-muted leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* Why us */}
      <section className="py-20">
        <Container>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {[
              {
                icon: (
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                ),
                title: 'Verified Professionals',
                desc: 'All accountants go through a profile review process.',
              },
              {
                icon: (
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                ),
                title: 'Competitive Pricing',
                desc: 'Get multiple bids and choose the best value for your budget.',
              },
              {
                icon: (
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                ),
                title: 'Fast Turnaround',
                desc: 'Clear deadlines and delivery times on every job posting.',
              },
            ].map(({ icon, title, desc }) => (
              <div key={title} className="bg-white border border-border rounded-xl p-6">
                <div className="w-10 h-10 rounded-lg bg-brand-light flex items-center justify-center text-brand mb-4">
                  {icon}
                </div>
                <h3 className="font-semibold text-ink mb-1">{title}</h3>
                <p className="text-sm text-muted leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* CTA */}
      <section className="py-16 bg-surface">
        <Container>
          <div className="bg-brand-light rounded-2xl p-10 text-center">
            <h2 className="text-2xl font-bold text-ink mb-2">Ready to find your next client?</h2>
            <p className="text-muted mb-8 max-w-md mx-auto">
              Join hundreds of accounting professionals on Accountant Hub and start bidding today.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-3">
              <Link
                href="/register"
                className="inline-flex items-center justify-center rounded-lg font-semibold px-6 py-3 text-base bg-brand text-white hover:bg-brand-dark transition-colors"
              >
                Get Started Free
              </Link>
              <Link
                href="/jobs"
                className="inline-flex items-center justify-center rounded-lg font-semibold px-6 py-3 text-base border border-brand text-brand hover:bg-brand-light transition-colors"
              >
                Browse Jobs
              </Link>
            </div>
          </div>
        </Container>
      </section>
    </div>
  );
}
