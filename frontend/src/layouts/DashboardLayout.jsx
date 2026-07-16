import Sidebar from '../components/Sidebar.jsx';

export default function DashboardLayout({
  children,
  active,
  onNavigate,
  title,
  subtitle,
}) {
  return (
    <div className="min-h-screen bg-surface flex">
      <Sidebar active={active} onNavigate={onNavigate} />

      <main className="flex-1 overflow-y-auto">
        <div className="max-w-7xl mx-auto px-6 lg:px-10 py-8">
          <header className="mb-8">
            <div className="flex flex-col gap-2">
              <h1 className="text-3xl font-bold tracking-tight text-white">
                {title}
              </h1>

              {subtitle && (
                <p className="text-gray-400 text-sm md:text-base">
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