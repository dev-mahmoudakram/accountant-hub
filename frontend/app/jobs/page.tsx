import { Suspense } from 'react';
import Container from '@/components/layout/Container';
import { JobCardSkeleton } from '@/components/ui/Skeleton';
import JobsContent from '@/components/jobs/JobsContent';

function LoadingFallback() {
  return (
    <div className="py-10">
      <Container>
        <div className="mb-8">
          <div className="h-8 w-40 bg-gray-200 rounded-lg animate-pulse mb-2" />
          <div className="h-4 w-28 bg-gray-200 rounded animate-pulse" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {Array.from({ length: 6 }).map((_, i) => (
            <JobCardSkeleton key={i} />
          ))}
        </div>
      </Container>
    </div>
  );
}

export default function JobsPage() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <JobsContent />
    </Suspense>
  );
}
