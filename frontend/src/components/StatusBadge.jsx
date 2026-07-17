const STATUS_STYLES = {
  Open:
    'bg-blue-500/15 text-blue-400 border-blue-500/30',

  'In Progress':
    'bg-amber-500/15 text-amber-400 border-amber-500/30',

  Resolved:
    'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
};

const PRIORITY_STYLES = {
  Low:
    'bg-slate-500/15 text-slate-400 border-slate-500/30',

  Medium:
    'bg-amber-500/15 text-amber-400 border-amber-500/30',

  High:
    'bg-red-500/15 text-red-400 border-red-500/30',
};

export function StatusBadge({
  status,
}) {
  return (
    <span
      className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold border transition-all duration-200 ${
        STATUS_STYLES[status] ||
        STATUS_STYLES.Open
      }`}
    >
      <span className="w-2 h-2 rounded-full bg-current opacity-80" />
      {status}
    </span>
  );
}

export function PriorityBadge({
  priority,
}) {
  return (
    <span
      className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border transition-all duration-200 ${
        PRIORITY_STYLES[priority] ||
        PRIORITY_STYLES.Medium
      }`}
    >
      {priority} Priority
    </span>
  );
}