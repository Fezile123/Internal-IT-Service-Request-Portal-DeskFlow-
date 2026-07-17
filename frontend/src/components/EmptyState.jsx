import {
  Inbox,
  Sparkles,
} from 'lucide-react';

export default function EmptyState({
  title = 'Nothing here yet',
  subtitle = '',
}) {
  return (
    <div className="card p-12 text-center">

      <div className="flex justify-center mb-5">

        <div className="relative">

          <div className="absolute inset-0 blur-2xl bg-brand-500/20 rounded-full" />

          <div className="relative w-20 h-20 rounded-2xl bg-brand-600/15 border border-brand-600/20 flex items-center justify-center">
            <Inbox
              size={36}
              className="text-brand-400"
            />
          </div>

        </div>

      </div>

      <h3 className="text-xl font-semibold text-white mb-2">
        {title}
      </h3>

      {subtitle && (
        <p className="text-gray-400 max-w-md mx-auto mb-4">
          {subtitle}
        </p>
      )}

      <div className="inline-flex items-center gap-2 px-3 py-2 rounded-full bg-surface-border text-gray-400 text-sm">
        <Sparkles size={14} />
        DeskFlow Workspace
      </div>

    </div>
  );
}
