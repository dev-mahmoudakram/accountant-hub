interface SkeletonProps {
  className?: string;
}

export function Skeleton({ className = '' }: SkeletonProps) {
  return (
    <div className={`animate-pulse rounded bg-gray-200 ${className}`} />
  );
}

export function JobCardSkeleton() {
  return (
    <div className="bg-white border border-border rounded-xl p-6 flex flex-col">
      {/* category chip + status badge */}
      <div className="flex items-center justify-between gap-2 mb-3">
        <Skeleton className="h-5 w-28 rounded-full" />
        <Skeleton className="h-5 w-14 rounded-full" />
      </div>

      {/* title — up to 2 lines */}
      <Skeleton className="h-5 w-full mb-1" />
      <Skeleton className="h-5 w-2/3 mb-1" />

      {/* company name */}
      <Skeleton className="h-4 w-32 mb-3" />

      {/* description — 2 lines */}
      <Skeleton className="h-4 w-full mb-1.5" />
      <Skeleton className="h-4 w-5/6 mb-4 flex-1" />

      {/* footer */}
      <div className="pt-4 border-t border-border space-y-2">
        <div className="flex items-center justify-between">
          <Skeleton className="h-5 w-28" />
          <Skeleton className="h-4 w-10" />
        </div>
        <div className="flex items-center justify-between">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-4 w-12" />
        </div>
      </div>
    </div>
  );
}
