import { Suspense } from 'react';
import Container from '@/components/layout/Container';
import { Skeleton } from '@/components/ui/Skeleton';
import JobDetailContent from '@/components/jobs/JobDetail';

function LoadingFallback() {
  return (
    <div className="py-10">
      <Container>
        <div className="max-w-5xl mx-auto">
          <Skeleton className="h-9 w-2/3 mb-3" />
          <Skeleton className="h-5 w-48 mb-8" />
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <Skeleton key={i} className={`h-4 ${i % 3 === 2 ? 'w-3/4' : 'w-full'}`} />
              ))}
            </div>
            <Skeleton className="h-56 rounded-xl" />
          </div>
        </div>
      </Container>
    </div>
  );
}

export default async function JobPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return (
    <Suspense fallback={<LoadingFallback />}>
      <JobDetailContent jobId={Number(id)} />
    </Suspense>
  );
}
