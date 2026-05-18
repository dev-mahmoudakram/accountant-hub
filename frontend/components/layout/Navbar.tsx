'use client';

import Link from 'next/link';
import { useAuth } from '@/components/auth/AuthProvider';
import Container from './Container';
import Button from '@/components/ui/Button';

export default function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-white/95 backdrop-blur-sm">
      <Container>
        <div className="flex h-16 items-center justify-between">
          <Link href="/" className="text-xl font-bold text-brand">
            Accountant Hub
          </Link>

          <nav className="flex items-center gap-2">
            <Link
              href="/jobs"
              className="text-sm font-medium text-muted hover:text-ink transition-colors px-3 py-2 rounded-lg hover:bg-surface"
            >
              Browse Jobs
            </Link>

            {isAuthenticated ? (
              <>
                <Link
                  href="/dashboard"
                  className="text-sm font-medium text-muted hover:text-ink transition-colors px-3 py-2 rounded-lg hover:bg-surface"
                >
                  My Bids
                </Link>
                <span className="text-sm text-muted px-2 hidden sm:block">{user?.name}</span>
                <Button variant="outline" size="sm" onClick={logout}>
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Link href="/login">
                  <Button variant="ghost" size="sm">Login</Button>
                </Link>
                <Link href="/register">
                  <Button variant="primary" size="sm">Get Started</Button>
                </Link>
              </>
            )}
          </nav>
        </div>
      </Container>
    </header>
  );
}
