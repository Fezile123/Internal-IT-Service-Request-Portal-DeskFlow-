import Sidebar from '../components/Sidebar.jsx';
import { Bell, Search } from 'lucide-react';

export default function DashboardLayout({
  children,
  active,
  onNavigate,
  title,
  subtitle,
}) {
  return (
    <div className="min-h-screen bg-surface flex">

      <Sidebar
        active={active}
        onNavigate={onNavigate}
      />

      <main className="flex-1 overflow-y-auto">

        {/* TOP NAVBAR */}
        <div className="sticky top-0 z-20 bg-surface/90 backdrop-blur-md border-b border-surface-border">
          <div className="px-6 lg:px-10 py-4 flex items-center justify-between">

            <div className="relative w-full max-w-md">

              <Search
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
              />

              <input
                type="text"
                placeholder="Search tickets, users, categories..."
                className="input-field pl-10"
              />

            </div>

            <div className="flex items-center gap-4">

              <button className="relative p-2 rounded-lg hover:bg-surface-panel transition-colors">
                <Bell
                  size={18}
                  className="text-gray-400"
                />

                <span className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full" />
              </button>

            </div>

          </div>
        </div>

        {/* PAGE CONTENT */}
        <div className="max-w-7xl mx-auto px-6 lg:px-10 py-8">

          {/* PAGE HEADER */}
          <header className="mb-8">

            <div className="flex flex-col gap-2">

              <h1 className="text-3xl font-bold tracking-tight text-white">
                {title}
              </h1>

              {subtitle && (
                <p className="text-gray-400 text-sm md:text-base max-w-3xl">
                  {subtitle}
                </p>
              )}

            </div>

          </header>

          {children}

        </div>

      </main>

    </div>
  );
}