export default function SkeletonLoader({
  rows = 4,
}) {
  return (
    <div className="space-y-4">
      {Array.from({
        length: rows,
      }).map((_, index) => (
        <div
          key={index}
          className="card p-5 animate-pulse"
        >
          {/* Header */}
          <div className="flex justify-between items-start mb-4">

            <div className="space-y-2 flex-1">
              <div className="h-4 w-32 bg-surface-border rounded" />

              <div className="h-6 w-64 bg-surface-border rounded" />
            </div>

            <div className="space-y-2">
              <div className="h-7 w-24 bg-surface-border rounded-full" />

              <div className="h-7 w-20 bg-surface-border rounded-full" />
            </div>

          </div>

          {/* Description */}
          <div className="space-y-2 mb-5">

            <div className="h-3 w-full bg-surface-border rounded" />

            <div className="h-3 w-5/6 bg-surface-border rounded" />

            <div className="h-3 w-2/3 bg-surface-border rounded" />

          </div>

          {/* Footer */}
          <div className="flex gap-3">

            <div className="h-6 w-24 bg-surface-border rounded-full" />

            <div className="h-6 w-28 bg-surface-border rounded-full" />

            <div className="h-6 w-20 bg-surface-border rounded-full" />

          </div>
        </div>
      ))}
    </div>
  );
}
