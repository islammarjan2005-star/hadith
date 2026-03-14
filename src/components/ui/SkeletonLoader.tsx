export function CardSkeleton() {
  return (
    <div className="bg-sp-dark rounded-lg p-4 animate-pulse">
      <div className="w-full aspect-square bg-sp-gray rounded-md mb-4" />
      <div className="h-4 bg-sp-gray rounded w-3/4 mb-2" />
      <div className="h-3 bg-sp-gray rounded w-1/2" />
    </div>
  );
}

export function RowSkeleton() {
  return (
    <div className="flex items-center gap-4 p-3 animate-pulse">
      <div className="w-10 h-10 bg-sp-gray rounded" />
      <div className="flex-1">
        <div className="h-4 bg-sp-gray rounded w-1/3 mb-2" />
        <div className="h-3 bg-sp-gray rounded w-1/4" />
      </div>
    </div>
  );
}

export function GridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
      {Array.from({ length: count }).map((_, i) => (
        <CardSkeleton key={i} />
      ))}
    </div>
  );
}
