interface SkeletonCardProps {
  rows?: number;
  hasAvatar?: boolean;
  className?: string;
}

function SkeletonLine({ width = 'full' }: { width?: 'full' | '3/4' | '1/2' | '1/3' }) {
  const widthClass = {
    full: 'w-full',
    '3/4': 'w-3/4',
    '1/2': 'w-1/2',
    '1/3': 'w-1/3',
  }[width];

  return (
    <div
      className={`h-3 ${widthClass} animate-pulse rounded-full bg-slate-100 dark:bg-gray-800`}
      aria-hidden="true"
    />
  );
}

export function SkeletonCard({ rows = 3, hasAvatar = false, className = '' }: SkeletonCardProps) {
  const widths: Array<'full' | '3/4' | '1/2' | '1/3'> = ['full', '3/4', '1/2', '1/3'];

  return (
    <div
      className={`rounded-2xl border border-[#E2E8F0] bg-white p-5 dark:border-gray-800 dark:bg-gray-900 ${className}`}
      aria-busy="true"
      aria-label="Loading content"
    >
      {hasAvatar && (
        <div className="flex items-center gap-3 mb-4">
          <div className="h-10 w-10 shrink-0 animate-pulse rounded-full bg-slate-100 dark:bg-gray-800" />
          <div className="flex-1 space-y-2">
            <SkeletonLine width="1/2" />
            <SkeletonLine width="1/3" />
          </div>
        </div>
      )}
      <div className="space-y-3">
        {Array.from({ length: rows }).map((_, i) => (
          <SkeletonLine key={i} width={widths[i % widths.length]} />
        ))}
      </div>
    </div>
  );
}
