import {
  useEffect,
  useState,
  useCallback,
} from 'react';

import toast from 'react-hot-toast';

import {
  Search,
  Ticket,
  Clock,
  CheckCircle,
  AlertCircle,
} from 'lucide-react';

import DashboardLayout from '../layouts/DashboardLayout.jsx';
import TicketForm from '../components/TicketForm.jsx';
import TicketCard from '../components/TicketCard.jsx';
import SkeletonLoader from '../components/SkeletonLoader.jsx';
import EmptyState from '../components/EmptyState.jsx';
import AIAssistantPanel from '../components/AIAssistantPanel.jsx';

import { getTicketsRequest } from '../api/ticketApi';

export default function EmployeeDashboard() {
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
    [search, statusFilter]
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

  const stats = {
    total: tickets.length,

    open: tickets.filter(
      (t) =>
        t.status === 'Open'
    ).length,

    inProgress:
      tickets.filter(
        (t) =>
          t.status ===
          'In Progress'
      ).length,

    resolved:
      tickets.filter(
        (t) =>
          t.status ===
          'Resolved'
      ).length,
  };

  return (
    <DashboardLayout
      active={tab}
      onNavigate={setTab}
      title={
        tab === 'tickets'
          ? 'Employee Dashboard'
          : 'AI Assistant'
      }
      subtitle={
        tab === 'tickets'
          ? 'Create and monitor your IT service requests'
          : 'Get AI-powered troubleshooting assistance'
      }
    >
      {tab === 'tickets' && (
        <>
          {/* KPI CARDS */}

          <div className="grid md:grid-cols-4 gap-4 mb-6">

            <StatCard
              icon={Ticket}
              label="Total Tickets"
              value={stats.total}
              color="text-brand-400"
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
              icon={CheckCircle}
              label="Resolved"
              value={stats.resolved}
              color="text-emerald-400"
            />

          </div>

          {/* MAIN CONTENT */}

          <div className="grid lg:grid-cols-3 gap-6">

            {/* FORM */}

            <div>
              <TicketForm
                onCreated={
                  fetchTickets
                }
              />
            </div>

            {/* TICKETS */}

            <div className="lg:col-span-2 space-y-4">

              {/* FILTERS */}

              <div className="card p-4 flex flex-col md:flex-row gap-3">

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
                  className="input-field md:w-48"
                  value={
                    statusFilter
                  }
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

              </div>

              {/* TICKET LIST */}

              {loading && (
                <SkeletonLoader
                  rows={4}
                />
              )}

              {!loading &&
                tickets.length ===
                  0 && (
                  <EmptyState
                    title="No Tickets Found"
                    subtitle="Create your first IT support request using the form."
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
                      isAdmin={
                        false
                      }
                    />
                  )
                )}

            </div>

          </div>
        </>
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
    <div className="card p-5">

      <div className="flex items-center justify-between">

        <div>

          <p className="text-sm text-gray-500">
            {label}
          </p>

          <h3 className="text-3xl font-bold mt-2">
            {value}
          </h3>

        </div>

        <div
          className={`p-3 rounded-xl bg-surface-border ${color}`}
        >
          <Icon size={20} />
        </div>

      </div>

    </div>
  );
}