import { useState, useEffect } from 'react';

import {
  StatusBadge,
  PriorityBadge,
} from './StatusBadge.jsx';

import {
  Clock,
  User,
  Ticket,
  Save,
  CalendarDays,
  UserCog,
  StickyNote,
} from 'lucide-react';

import axiosClient from '../api/axiosClient';

export default function TicketCard({
  ticket,
  isAdmin,
  onUpdate,
}) {
  const [status, setStatus] = useState(ticket.status);
  const [assignedTo, setAssignedTo] = useState(ticket.assignedTo || '');
  const [adminNotes, setAdminNotes] = useState(ticket.adminNotes || '');
  const [technicians, setTechnicians] = useState([]);

  useEffect(() => {
    if (!isAdmin) return;
    axiosClient
      .get('/users')
      .then((res) => {
        const users = res.data?.users || res.data?.data?.users || res.data || [];
        // Show all users or filter to admins only depending on your needs
        setTechnicians(Array.isArray(users) ? users : []);
      })
      .catch(() => {
        // If no users endpoint, fall back to a static list
        setTechnicians([]);
      });
  }, [isAdmin]);

  return (
    <div className="card p-6 hover:border-brand-500/40 hover:shadow-lg transition-all duration-300">

      {/* HEADER */}
      <div className="flex flex-col lg:flex-row lg:justify-between gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-3">
            <Ticket size={16} className="text-brand-400" />
            <span className="text-xs uppercase tracking-wider font-semibold text-brand-400">
              Ticket
            </span>
            <span className="text-xs text-gray-500">
              {ticket.ticketNumber || `#${ticket.id?.slice(0, 8)}`}
            </span>
          </div>
          <h3 className="text-lg font-semibold text-white">{ticket.title}</h3>
          <p className="text-gray-400 mt-3 leading-relaxed">{ticket.description}</p>
        </div>
        <div className="flex flex-col items-start lg:items-end gap-2">
          <StatusBadge status={status} />
          <PriorityBadge priority={ticket.priority} />
        </div>
      </div>

      {/* METADATA */}
      <div className="mt-5 pt-5 border-t border-surface-border">
        <div className="flex flex-wrap gap-3 text-xs text-gray-500">
          <span className="flex items-center gap-1">
            <Clock size={12} />
            {new Date(ticket.createdAt).toLocaleDateString()}
          </span>
          <span className="flex items-center gap-1">
            <CalendarDays size={12} />
            {Math.max(0, Math.floor((Date.now() - new Date(ticket.createdAt)) / (1000 * 60 * 60 * 24)))} days ago
          </span>
          {ticket.createdBy?.name && (
            <span className="flex items-center gap-1">
              <User size={12} />
              {ticket.createdBy.name}
            </span>
          )}
          {ticket.category && (
            <span className="px-2 py-1 rounded-full bg-surface-border">
              {ticket.category}
            </span>
          )}
        </div>
      </div>

      {/* EMPLOYEE VIEW */}
      {!isAdmin && (
        <div className="mt-5 space-y-4">
          {ticket.assignedTo && (
            <div className="p-3 rounded-xl bg-blue-500/10 border border-blue-500/20">
              <div className="flex items-center gap-2 text-blue-400 mb-1">
                <UserCog size={15} />
                <span className="font-medium">Assigned Technician</span>
              </div>
              <p className="text-sm text-gray-300">{ticket.assignedTo}</p>
            </div>
          )}
          {ticket.adminNotes && (
            <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20">
              <div className="flex items-center gap-2 text-amber-400 mb-2">
                <StickyNote size={15} />
                <span className="font-medium">Admin Notes</span>
              </div>
              <p className="text-sm text-gray-300 leading-relaxed">{ticket.adminNotes}</p>
            </div>
          )}
        </div>
      )}

      {/* ADMIN VIEW */}
      {isAdmin && (
        <div className="mt-6 pt-6 border-t border-surface-border space-y-5">
          <div className="grid md:grid-cols-2 gap-4">

            {/* Ticket Status dropdown */}
            <div>
              <label className="block text-xs text-gray-400 mb-2">
                Ticket Status
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="input-field"
              >
                <option>Open</option>
                <option>In Progress</option>
                <option>Resolved</option>
              </select>
            </div>

            {/* Assigned Technician dropdown */}
            <div>
              <label className="block text-xs text-gray-400 mb-2">
                Assigned Technician
              </label>
              <select
                value={assignedTo}
                onChange={(e) => setAssignedTo(e.target.value)}
                className="input-field"
              >
                <option value="">— Unassigned —</option>
                {technicians.length > 0 ? (
                  technicians.map((tech) => (
                    <option key={tech.id} value={tech.name}>
                      {tech.name} {tech.role === 'admin' ? '(Admin)' : ''}
                    </option>
                  ))
                ) : (
                  /* Fallback static options if /users endpoint doesn't exist */
                  <>
                    <option>IT Support Team</option>
                    <option>Network Admin</option>
                    <option>Help Desk</option>
                    <option>Systems Administrator</option>
                  </>
                )}
              </select>
            </div>

          </div>

          <div>
            <label className="block text-xs text-gray-400 mb-2">
              Resolution Notes
            </label>
            <textarea
              rows={4}
              value={adminNotes}
              onChange={(e) => setAdminNotes(e.target.value)}
              placeholder="Add troubleshooting notes or resolution details..."
              className="input-field resize-none"
            />
          </div>

          <button
            onClick={() => onUpdate(ticket.id, { status, assignedTo, adminNotes })}
            className="btn-primary flex items-center gap-2"
          >
            <Save size={16} />
            Save Changes
          </button>

        </div>
      )}

    </div>
  );
}