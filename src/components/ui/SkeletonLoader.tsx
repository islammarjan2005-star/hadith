export function CardSkeleton() {
  return (
    <div className="flex items-center gap-4 p-3 rounded-xl bg-nr-surface/50">
      <div className="w-12 h-12 skeleton-shimmer rounded-lg shrink-0" />
      <div className="flex-1">
        <div className="h-4 skeleton-shimmer rounded w-1/3 mb-2" />
        <div className="h-3 skeleton-shimmer rounded w-2/3" />
      </div>
    </div>
  );
}

export function RowSkeleton() {
  return (
    <div className="flex items-center gap-4 p-3">
      <div className="w-10 h-10 skeleton-shimmer rounded" />
      <div className="flex-1">
        <div className="h-4 skeleton-shimmer rounded w-1/3 mb-2" />
        <div className="h-3 skeleton-shimmer rounded w-1/4" />
      </div>
    </div>
  );
}

export function GridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
      {Array.from({ length: count }).map((_, i) => (
        <CardSkeleton key={i} />
      ))}
    </div>
  );
}
