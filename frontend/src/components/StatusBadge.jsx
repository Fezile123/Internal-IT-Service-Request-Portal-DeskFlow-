const STATUS_STYLES = {
  Open: 'bg-blue-500/15 text-blue-400 border-blue-500/30',
  'In Progress': 'bg-amber-500/15 text-amber-400 border-amber-500/30',
  Resolved: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
};
const PRIORITY_STYLES = {
  Low: 'bg-gray-500/15 text-gray-400 border-gray-500/30',
  Medium: 'bg-amber-500/15 text-amber-400 border-amber-500/30',
  High: 'bg-red-500/15 text-red-400 border-red-500/30',
};
export function StatusBadge({ status }) {
  return <span className={`text-xs font-medium px-2 py-1 rounded-full border ${STATUS_STYLES[status] || ''}`}>{status}</span>;
}
export function PriorityBadge({ priority }) {
  return <span className={`text-xs font-medium px-2 py-1 rounded-full border ${PRIORITY_STYLES[priority] || ''}`}>{priority}</span>;
}
