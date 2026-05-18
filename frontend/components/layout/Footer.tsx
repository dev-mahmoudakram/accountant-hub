import Link from 'next/link';
import Container from './Container';

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-border bg-surface mt-auto">
      <Container>
        {/* Main footer content */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 py-12">

          {/* Brand */}
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center gap-2.5 mb-4 group w-fit">
              <div className="w-7 h-7 rounded-lg bg-brand flex items-center justify-center">
                <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
              </div>
              <span className="text-base font-bold text-ink">
                Accountant<span className="text-brand">Hub</span>
              </span>
            </Link>
            <p className="text-sm text-muted leading-relaxed max-w-xs">
              The marketplace connecting companies with skilled accounting professionals
              for tax, bookkeeping, auditing, and more.
            </p>
          </div>

          {/* Platform Links */}
          <div>
            <p className="text-xs font-semibold text-ink uppercase tracking-wider mb-4">Platform</p>
            <ul className="space-y-3">
              <li>
                <Link href="/jobs" className="text-sm text-muted hover:text-brand transition-colors">
                  Browse Jobs
                </Link>
              </li>
              <li>
                <Link href="/register" className="text-sm text-muted hover:text-brand transition-colors">
                  Create Account
                </Link>
              </li>
              <li>
                <Link href="/login" className="text-sm text-muted hover:text-brand transition-colors">
                  Sign In
                </Link>
              </li>
              <li>
                <Link href="/dashboard" className="text-sm text-muted hover:text-brand transition-colors">
                  My Bids
                </Link>
              </li>
            </ul>
          </div>

          {/* For Accountants */}
          <div>
            <p className="text-xs font-semibold text-ink uppercase tracking-wider mb-4">For Accountants</p>
            <ul className="space-y-3">
              <li><span className="text-sm text-muted">Tax Filing</span></li>
              <li><span className="text-sm text-muted">Bookkeeping</span></li>
              <li><span className="text-sm text-muted">Auditing</span></li>
              <li><span className="text-sm text-muted">Financial Planning</span></li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 py-5 border-t border-border">
          <p className="text-xs text-muted">
            © {year} AccountantHub. All rights reserved.
          </p>
          <div className="flex items-center gap-1">
            <div className="w-1.5 h-1.5 rounded-full bg-brand animate-pulse" />
            <span className="text-xs text-muted">Platform is live</span>
          </div>
        </div>
      </Container>
    </footer>
  );
}
