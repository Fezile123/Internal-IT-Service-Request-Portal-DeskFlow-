import { LayoutDashboard, Ticket, Sparkles, LogOut, LifeBuoy } from 'lucide-react';
import { useAuth } from '../hooks/useAuth.js';

export default function Sidebar({ active, onNavigate }) {
  const { user, logout, isAdmin } = useAuth();
  const items = isAdmin
    ? [{ key: 'tickets', label: 'All Tickets', icon: LayoutDashboard }, { key: 'analytics', label: 'Analytics', icon: Ticket }, { key: 'ai', label: 'AI Assistant', icon: Sparkles }]
    : [{ key: 'tickets', label: 'My Tickets', icon: Ticket }, { key: 'ai', label: 'AI Assistant', icon: Sparkles }];

  return (
    <aside className="w-64 shrink-0 bg-surface-panel border-r border-surface-border h-screen sticky top-0 flex flex-col">
      <div className="px-5 py-5 flex items-center gap-2 border-b border-surface-border">
        <LifeBuoy className="text-brand-500" size={22} />
        <span className="font-semibold text-lg tracking-tight">DeskFlow</span>
      </div>
      <nav className="flex-1 px-3 py-4 space-y-1">
        {items.map(({ key, label, icon: Icon }) => (
          <button key={key} onClick={() => onNavigate(key)}
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${active === key ? 'bg-brand-600/20 text-brand-400 border border-brand-600/30' : 'text-gray-400 hover:bg-surface-border hover:text-gray-200'}`}>
            <Icon size={17} />{label}
          </button>
        ))}
      </nav>
      <div className="p-4 border-t border-surface-border">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-8 h-8 rounded-full bg-brand-600 flex items-center justify-center text-xs font-semibold">{user?.name?.[0]?.toUpperCase() || '?'}</div>
          <div className="min-w-0"><p className="text-sm font-medium truncate">{user?.name}</p><p className="text-xs text-gray-500 capitalize">{user?.role}</p></div>
        </div>
        <button onClick={logout} className="w-full flex items-center gap-2 text-sm text-gray-400 hover:text-red-400 transition-colors px-3 py-2"><LogOut size={16} /> Log out</button>
      </div>
    </aside>
  );
}
