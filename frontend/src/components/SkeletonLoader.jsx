export default function SkeletonLoader({ rows = 4 }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="card p-4 animate-pulse space-y-2">
          <div className="h-4 w-1/3 bg-surface-border rounded" />
          <div className="h-3 w-2/3 bg-surface-border rounded" />
        </div>
      ))}
    </div>
  );
}
