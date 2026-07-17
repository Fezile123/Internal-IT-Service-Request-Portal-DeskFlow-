import {
  LayoutDashboard,
  Ticket,
  Sparkles,
  LogOut,
  LifeBuoy,
  ShieldCheck,
  User,
  BarChart3,
} from 'lucide-react';

import { useAuth } from '../hooks/useAuth.js';

export default function Sidebar({
  active,
  onNavigate,
}) {
  const {
    user,
    logout,
    isAdmin,
  } = useAuth();

  const items = isAdmin
    ? [
        {
          key: 'tickets',
          label: 'All Tickets',
          icon: LayoutDashboard,
        },
        {
          key: 'analytics',
          label: 'Analytics',
          icon: BarChart3,
        },
        {
          key: 'ai',
          label: 'AI Assistant',
          icon: Sparkles,
        },
      ]
    : [
        {
          key: 'tickets',
          label: 'My Tickets',
          icon: Ticket,
        },
        {
          key: 'ai',
          label: 'AI Assistant',
          icon: Sparkles,
        },
      ];

  return (
    <aside className="w-72 shrink-0 bg-surface-panel border-r border-surface-border h-screen sticky top-0 flex flex-col">

      {/* LOGO */}
      <div className="px-6 py-6 border-b border-surface-border">

        <div className="flex items-center gap-3">

          <div className="w-10 h-10 rounded-xl bg-brand-600/20 flex items-center justify-center">
            <LifeBuoy
              className="text-brand-400"
              size={22}
            />
          </div>

          <div>
            <h2 className="font-bold text-lg">
              DeskFlow
            </h2>

            <p className="text-xs text-gray-500">
              IT Service Portal
            </p>
          </div>

        </div>

      </div>

      {/* USER PROFILE */}
      <div className="px-5 py-5 border-b border-surface-border">

        <div className="flex items-center gap-3">

          <div className="w-12 h-12 rounded-full bg-brand-600 flex items-center justify-center font-semibold text-white">
            {user?.name?.[0]?.toUpperCase() || 'U'}
          </div>

          <div className="min-w-0 flex-1">

            <p className="font-medium truncate">
              {user?.name}
            </p>

            <div className="flex items-center gap-2 mt-1">

              {isAdmin ? (
                <span className="flex items-center gap-1 text-xs px-2 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  <ShieldCheck size={12} />
                  Admin
                </span>
              ) : (
                <span className="flex items-center gap-1 text-xs px-2 py-1 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20">
                  <User size={12} />
                  Employee
                </span>
              )}

            </div>

          </div>

        </div>

      </div>

      {/* NAVIGATION */}
      <nav className="flex-1 px-4 py-5 space-y-2">

        <p className="text-xs uppercase tracking-wider text-gray-500 px-3 mb-3">
          Navigation
        </p>

        {items.map(
          ({
            key,
            label,
            icon: Icon,
          }) => (
            <button
              key={key}
              onClick={() =>
                onNavigate(key)
              }
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-sm font-medium ${
                active === key
                  ? 'bg-brand-600/20 text-brand-400 border border-brand-600/30 shadow-lg shadow-brand-600/10'
                  : 'text-gray-400 hover:bg-surface-border hover:text-white'
              }`}
            >
              <Icon size={18} />

              <span>{label}</span>
            </button>
          )
        )}

      </nav>

      {/* FOOTER */}
      <div className="p-4 border-t border-surface-border">

        <button
          onClick={logout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-gray-400 hover:bg-red-500/10 hover:text-red-400 transition-all"
        >
          <LogOut size={18} />
          Sign Out
        </button>

      </div>

    </aside>
  );
}