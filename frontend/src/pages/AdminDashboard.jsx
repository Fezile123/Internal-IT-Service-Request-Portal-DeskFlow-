import {
  useEffect,
  useState,
  useCallback,
  useMemo,
} from 'react';

import toast from 'react-hot-toast';

import DashboardLayout from '../layouts/DashboardLayout.jsx';
import TicketCard from '../components/TicketCard.jsx';
import SkeletonLoader from '../components/SkeletonLoader.jsx';
import EmptyState from '../components/EmptyState.jsx';
import AIAssistantPanel from '../components/AIAssistantPanel.jsx';
import AnalyticsPanel from '../components/AnalyticsPanel.jsx';

import {
  getTicketsRequest,
  updateTicketRequest,
} from '../api/ticketApi';

import {
  Search,
  TicketCheck,
  Clock,
  AlertCircle,
  LayoutDashboard,
} from 'lucide-react';

export default function AdminDashboard() {
  const [tab, setTab] = useState('tickets');

  const [tickets, setTickets] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [search, setSearch] =
    useState('');

  const [statusFilter, setStatusFilter] =
    useState('');

  const [
    priorityFilter,
    setPriorityFilter,
  ] = useState('');

  const fetchTickets = useCallback(
    async () => {
      setLoading(true);

      try {
        const res =
          await getTicketsRequest({
            search:
              search || undefined,
            status:
              statusFilter ||
              undefined,
            priority:
              priorityFilter ||
              undefined,
          });

        setTickets(
          res.data.tickets
        );
      } catch (err) {
        toast.error(
          err.message
        );
      } finally {
        setLoading(false);
      }
    },
    [
      search,
      statusFilter,
      priorityFilter,
    ]
  );

  useEffect(() => {
    const timer =
      setTimeout(
        fetchTickets,
        300
      );

    return () =>
      clearTimeout(timer);
  }, [fetchTickets]);

  const handleTicketUpdate =
    async (
      id,
      payload
    ) => {
      try {
        await updateTicketRequest(
          id,
          payload
        );

        toast.success(
          'Ticket updated successfully'
        );

        fetchTickets();
      } catch (err) {
        toast.error(
          err.message
        );
      }
    };

  const stats = useMemo(
    () => ({
      total: tickets.length,

      open: tickets.filter(
        (ticket) =>
          ticket.status ===
          'Open'
      ).length,

      inProgress:
        tickets.filter(
          (ticket) =>
            ticket.status ===
            'In Progress'
        ).length,

      resolved:
        tickets.filter(
          (ticket) =>
            ticket.status ===
            'Resolved'
        ).length,
    }),
    [tickets]
  );

  const pageTitle =
    tab === 'ai'
      ? 'AI Assistant'
      : tab === 'analytics'
      ? 'Analytics Dashboard'
      : 'IT Service Desk';

  const pageSubtitle =
    tab === 'ai'
      ? 'Analyze any ticket instantly'
      : tab === 'analytics'
      ? 'Insights and performance metrics'
      : 'Manage and resolve employee support requests';

  return (
    <DashboardLayout
      active={tab}
      onNavigate={setTab}
      title={pageTitle}
      subtitle={pageSubtitle}
    >
      {tab === 'tickets' && (
        <>
          {/* KPI SECTION */}
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-8">

            <StatCard
              icon={LayoutDashboard}
              label="Total Tickets"
              value={stats.total}
              color="text-purple-400"
            />

            <StatCard
              icon={AlertCircle}
              label="Open"
              value={stats.open}
              color="text-blue-400"
            />

            <StatCard
              icon={Clock}
              label="In Progress"
              value={stats.inProgress}
              color="text-amber-400"
            />

            <StatCard
              icon={TicketCheck}
              label="Resolved"
              value={stats.resolved}
              color="text-emerald-400"
            />

          </div>

          {/* FILTER BAR */}
          <div className="card p-4 mb-6">

            <div className="flex flex-col lg:flex-row gap-3">

              <div className="relative flex-1">

                <Search
                  size={16}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
                />

                <input
                  className="input-field pl-10"
                  placeholder="Search tickets..."
                  value={search}
                  onChange={(e) =>
                    setSearch(
                      e.target.value
                    )
                  }
                />

              </div>

              <select
                className="input-field lg:w-48"
                value={statusFilter}
                onChange={(e) =>
                  setStatusFilter(
                    e.target.value
                  )
                }
              >
                <option value="">
                  All Statuses
                </option>
                <option>Open</option>
                <option>
                  In Progress
                </option>
                <option>
                  Resolved
                </option>
              </select>

              <select
                className="input-field lg:w-48"
                value={priorityFilter}
                onChange={(e) =>
                  setPriorityFilter(
                    e.target.value
                  )
                }
              >
                <option value="">
                  All Priorities
                </option>
                <option>Low</option>
                <option>Medium</option>
                <option>High</option>
              </select>

            </div>

          </div>

          {/* RESULTS */}
          <div className="flex justify-between items-center mb-4">

            <h3 className="text-lg font-semibold">
              Ticket Queue
            </h3>

            <span className="text-sm text-gray-400">
              {tickets.length} tickets found
            </span>

          </div>

          <div className="space-y-4">

            {loading && (
              <SkeletonLoader rows={4} />
            )}

            {!loading &&
              tickets.length ===
                0 && (
                <EmptyState
                  title="No tickets found"
                  subtitle="Try adjusting your filters."
                />
              )}

            {!loading &&
              tickets.map(
                (ticket) => (
                  <TicketCard
                    key={
                      ticket.id
                    }
                    ticket={
                      ticket
                    }
                    isAdmin
                    onUpdate={
                      handleTicketUpdate
                    }
                  />
                )
              )}

          </div>
        </>
      )}

      {tab === 'analytics' && (
        <AnalyticsPanel
          tickets={tickets}
        />
      )}

      {tab === 'ai' && (
        <AIAssistantPanel />
      )}
    </DashboardLayout>
  );
}

function StatCard({
  icon: Icon,
  label,
  value,
  color,
}) {
  return (
    <div className="card p-5 hover:border-brand-500/30 transition-all">

      <div className="flex items-center justify-between">

        <div>
          <p className="text-gray-400 text-sm">
            {label}
          </p>

          <h3 className="text-3xl font-bold mt-1">
            {value}
          </h3>
        </div>

        <div
          className={`p-3 rounded-xl bg-surface-border ${color}`}
        >
          <Icon size={22} />
        </div>

      </div>

    </div>
  );
}