import Link from 'next/link';
import Container from '@/components/layout/Container';
import Button from '@/components/ui/Button';

export default function NotFound() {
  return (
    <div className="flex-1 flex items-center justify-center py-20">
      <Container>
        <div className="max-w-lg mx-auto text-center">

          {/* Big number */}
          <div className="relative mb-6 select-none">
            <span className="text-[9rem] sm:text-[12rem] font-black leading-none text-brand/10">
              404
            </span>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-20 h-20 rounded-full bg-brand-light flex items-center justify-center">
                <svg className="w-10 h-10 text-brand" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                    d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>

          <h1 className="text-2xl sm:text-3xl font-bold text-ink mb-3">
            Page not found
          </h1>
          <p className="text-muted mb-8 max-w-sm mx-auto leading-relaxed">
            The page you&apos;re looking for doesn&apos;t exist or has been moved.
            Let&apos;s get you back on track.
          </p>

          <div className="flex flex-col sm:flex-row justify-center gap-3">
            <Link href="/">
              <Button variant="primary" size="lg">Go Home</Button>
            </Link>
            <Link href="/jobs">
              <Button variant="outline" size="lg">Browse Jobs</Button>
            </Link>
          </div>

        </div>
      </Container>
    </div>
  );
}
