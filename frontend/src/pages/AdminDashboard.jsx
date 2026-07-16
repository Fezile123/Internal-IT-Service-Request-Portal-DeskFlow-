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
} from 'lucide-react';

export default function AdminDashboard() {
  const [tab, setTab] =
    useState('tickets');

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
      : 'All Tickets';

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
          <div className="grid grid-cols-3 gap-4 mb-6">

            <StatCard
              icon={AlertCircle}
              label="Open"
              value={stats.open}
              color="text-blue-400"
            />

            <StatCard
              icon={Clock}
              label="In Progress"
              value={
                stats.inProgress
              }
              color="text-amber-400"
            />

            <StatCard
              icon={TicketCheck}
              label="Resolved"
              value={
                stats.resolved
              }
              color="text-emerald-400"
            />

          </div>

          <div className="flex gap-2 mb-4">

            <div className="relative flex-1">

              <Search
                size={15}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
              />

              <input
                className="input-field pl-9"
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
              className="input-field w-40"
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

              <option>
                Open
              </option>

              <option>
                In Progress
              </option>

              <option>
                Resolved
              </option>

            </select>

            <select
              className="input-field w-40"
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

              <option>
                Low
              </option>

              <option>
                Medium
              </option>

              <option>
                High
              </option>

            </select>

          </div>

          <div className="space-y-3">

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
    <div className="card p-4 flex items-center gap-3">

      <div
        className={`p-2 rounded-lg bg-surface-border ${color}`}
      >
        <Icon size={18} />
      </div>

      <div>
        <p className="text-xl font-semibold">
          {value}
        </p>

        <p className="text-xs text-gray-500">
          {label}
        </p>
      </div>

    </div>
  );
}