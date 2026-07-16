import { Inbox } from 'lucide-react';
export default function EmptyState({ title = 'Nothing here yet', subtitle = '' }) {
  return (
    <div className="card p-10 flex flex-col items-center text-center text-gray-400 gap-2">
      <Inbox size={32} className="text-gray-600" />
      <p className="font-medium text-gray-300">{title}</p>
      {subtitle && <p className="text-sm">{subtitle}</p>}
    </div>
  );
}
