import { useEffect, useState, useCallback } from 'react';
import toast from 'react-hot-toast';
import DashboardLayout from '../layouts/DashboardLayout.jsx';
import TicketForm from '../components/TicketForm.jsx';
import TicketCard from '../components/TicketCard.jsx';
import SkeletonLoader from '../components/SkeletonLoader.jsx';
import EmptyState from '../components/EmptyState.jsx';
import AIAssistantPanel from '../components/AIAssistantPanel.jsx';
import { getTicketsRequest } from '../api/ticketApi';
import { Search } from 'lucide-react';

export default function EmployeeDashboard() {
  const [tab, setTab] = useState('tickets');
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  const fetchTickets = useCallback(async () => {
    setLoading(true);
    try {
      const res = await getTicketsRequest({ search: search || undefined, status: statusFilter || undefined });
      setTickets(res.data.tickets);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  }, [search, statusFilter]);

  useEffect(() => {
    const t = setTimeout(fetchTickets, 300);
    return () => clearTimeout(t);
  }, [fetchTickets]);

  return (
    <DashboardLayout active={tab} onNavigate={setTab} title={tab === 'tickets' ? 'My Tickets' : 'AI Assistant'} subtitle={tab === 'tickets' ? 'Submit and track your IT support requests' : 'Get instant triage on any issue'}>
      {tab === 'tickets' && (
        <div className="grid md:grid-cols-3 gap-6">
          <div className="md:col-span-1"><TicketForm onCreated={fetchTickets} /></div>
          <div className="md:col-span-2 space-y-4">
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                <input className="input-field pl-9" placeholder="Search my tickets..." value={search} onChange={(e) => setSearch(e.target.value)} />
              </div>
              <select className="input-field w-40" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
                <option value="">All statuses</option><option>Open</option><option>In Progress</option><option>Resolved</option>
              </select>
            </div>
            {loading && <SkeletonLoader rows={3} />}
            {!loading && tickets.length === 0 && <EmptyState title="No tickets yet" subtitle="Submit your first request using the form on the left." />}
            {!loading && tickets.map((t) => <TicketCard key={t.id} ticket={t} isAdmin={false} onStatusChange={() => {}} />)}
          </div>
        </div>
      )}
      {tab === 'ai' && <AIAssistantPanel />}
    </DashboardLayout>
  );
}
