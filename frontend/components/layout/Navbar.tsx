'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/components/auth/AuthProvider';
import Container from './Container';
import Button from '@/components/ui/Button';
import { mobileMenuOverlay, mobileMenuDrawer } from '@/lib/animations';

function NavLink({
  href,
  children,
  onClick,
}: {
  href: string;
  children: React.ReactNode;
  onClick?: () => void;
}) {
  const pathname = usePathname();
  const active = pathname === href || (href !== '/' && pathname.startsWith(href));
  return (
    <Link
      href={href}
      onClick={onClick}
      className={[
        'text-sm font-medium transition-colors px-3 py-2 rounded-lg focus-visible:outline-none',
        active
          ? 'text-brand bg-brand-light'
          : 'text-muted hover:text-ink hover:bg-surface',
      ].join(' ')}
    >
      {children}
    </Link>
  );
}

function BriefcaseIcon() {
  return (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
        d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
    </svg>
  );
}

function ClipboardIcon() {
  return (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
        d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
    </svg>
  );
}

function PlusIcon() {
  return (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4v16m8-8H4" />
    </svg>
  );
}

export default function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

  const isClient = user?.role === 'client';
  const initial = user?.name?.charAt(0)?.toUpperCase() ?? 'A';
  const roleLabel = isClient ? 'Client' : 'Accountant';

  return (
    <>
      <header className="sticky top-0 z-40 border-b border-border bg-white/95 backdrop-blur-sm">
        <Container>
          <div className="flex h-16 items-center justify-between gap-4">

            {/* Logo */}
            <Link
              href="/"
              className="flex items-center gap-2.5 shrink-0 group focus-visible:outline-none"
            >
              <div className="w-8 h-8 rounded-lg bg-brand flex items-center justify-center shadow-sm group-hover:bg-brand-dark transition-colors">
                <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
              </div>
              <span className="text-base font-bold text-ink leading-none">
                Accountant<span className="text-brand">Hub</span>
              </span>
            </Link>

            {/* Desktop Nav Links */}
            <nav className="hidden lg:flex items-center gap-0.5 flex-1 ml-4">
              <NavLink href="/jobs">Browse Jobs</NavLink>
              {isAuthenticated && isClient && (
                <>
                  <NavLink href="/client/jobs">My Jobs</NavLink>
                  <NavLink href="/client/jobs/new">Post a Job</NavLink>
                </>
              )}
              {isAuthenticated && !isClient && (
                <NavLink href="/dashboard">My Bids</NavLink>
              )}
            </nav>

            {/* Desktop Auth */}
            <div className="hidden lg:flex items-center gap-2 shrink-0">
              {isAuthenticated ? (
                <>
                  <div className="flex items-center gap-2.5 pr-1">
                    <div className="w-8 h-8 rounded-full bg-brand-light border border-brand/20 flex items-center justify-center">
                      <span className="text-xs font-bold text-brand">{initial}</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-sm font-medium text-ink max-w-32 truncate leading-none">{user?.name}</span>
                      <span className="text-xs text-muted mt-0.5">{roleLabel}</span>
                    </div>
                  </div>
                  <Button variant="outline" size="sm" onClick={logout}>
                    Sign Out
                  </Button>
                </>
              ) : (
                <>
                  <Link href="/login" className="focus-visible:outline-none">
                    <Button variant="ghost" size="sm">Sign In</Button>
                  </Link>
                  <Link href="/register" className="focus-visible:outline-none">
                    <Button variant="primary" size="sm">Get Started</Button>
                  </Link>
                </>
              )}
            </div>

            {/* Mobile Hamburger */}
            <button
              type="button"
              className="lg:hidden p-2 -mr-1 rounded-lg text-muted hover:text-ink hover:bg-surface transition-colors focus-visible:outline-none"
              onClick={() => setMobileOpen(true)}
              aria-label="Open navigation menu"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </Container>
      </header>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              variants={mobileMenuOverlay}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="fixed inset-0 z-50 bg-black/50 lg:hidden"
              onClick={() => setMobileOpen(false)}
            />

            {/* Drawer */}
            <motion.div
              variants={mobileMenuDrawer}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="fixed right-0 top-0 h-full w-72 z-50 bg-ink flex flex-col lg:hidden shadow-2xl"
            >
              {/* Drawer Header */}
              <div className="flex items-center justify-between px-5 py-4 border-b border-white/10">
                <Link
                  href="/"
                  className="text-white font-bold text-base leading-none focus-visible:outline-none"
                  onClick={() => setMobileOpen(false)}
                >
                  Accountant<span className="text-brand">Hub</span>
                </Link>
                <button
                  type="button"
                  onClick={() => setMobileOpen(false)}
                  aria-label="Close menu"
                  className="p-2 rounded-lg hover:bg-white/10 transition-colors text-white/70 hover:text-white focus-visible:outline-none"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Nav Links */}
              <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
                <Link
                  href="/jobs"
                  className="flex items-center gap-3 px-4 py-3 rounded-xl text-white/70 hover:text-white hover:bg-white/10 transition-colors text-sm font-medium focus-visible:outline-none"
                  onClick={() => setMobileOpen(false)}
                >
                  <BriefcaseIcon />
                  Browse Jobs
                </Link>

                {isAuthenticated && isClient && (
                  <>
                    <Link
                      href="/client/jobs"
                      className="flex items-center gap-3 px-4 py-3 rounded-xl text-white/70 hover:text-white hover:bg-white/10 transition-colors text-sm font-medium focus-visible:outline-none"
                      onClick={() => setMobileOpen(false)}
                    >
                      <ClipboardIcon />
                      My Jobs
                    </Link>
                    <Link
                      href="/client/jobs/new"
                      className="flex items-center gap-3 px-4 py-3 rounded-xl text-white/70 hover:text-white hover:bg-white/10 transition-colors text-sm font-medium focus-visible:outline-none"
                      onClick={() => setMobileOpen(false)}
                    >
                      <PlusIcon />
                      Post a Job
                    </Link>
                  </>
                )}

                {isAuthenticated && !isClient && (
                  <Link
                    href="/dashboard"
                    className="flex items-center gap-3 px-4 py-3 rounded-xl text-white/70 hover:text-white hover:bg-white/10 transition-colors text-sm font-medium focus-visible:outline-none"
                    onClick={() => setMobileOpen(false)}
                  >
                    <ClipboardIcon />
                    My Bids
                  </Link>
                )}
              </nav>

              {/* Auth Section */}
              <div className="p-4 border-t border-white/10 space-y-3">
                {isAuthenticated ? (
                  <>
                    <div className="flex items-center gap-3 px-2 py-2">
                      <div className="w-10 h-10 rounded-full bg-brand flex items-center justify-center shrink-0">
                        <span className="text-sm font-bold text-white">{initial}</span>
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-white truncate">{user?.name}</p>
                        <p className="text-xs text-white/40">{roleLabel}</p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => { logout(); setMobileOpen(false); }}
                      className="w-full text-left px-4 py-3 rounded-xl text-white/70 hover:text-white hover:bg-white/10 transition-colors text-sm font-medium focus-visible:outline-none"
                    >
                      Sign Out
                    </button>
                  </>
                ) : (
                  <>
                    <Link href="/login" onClick={() => setMobileOpen(false)} className="block focus-visible:outline-none">
                      <button type="button" className="w-full px-4 py-3 rounded-xl border border-white/20 text-white text-sm font-semibold hover:bg-white/10 transition-colors focus-visible:outline-none">
                        Sign In
                      </button>
                    </Link>
                    <Link href="/register" onClick={() => setMobileOpen(false)} className="block focus-visible:outline-none">
                      <button type="button" className="w-full px-4 py-3 rounded-xl bg-brand text-white text-sm font-semibold hover:bg-brand-dark transition-colors focus-visible:outline-none">
                        Get Started Free
                      </button>
                    </Link>
                  </>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
