import { useState } from 'react';

import {
  StatusBadge,
  PriorityBadge,
} from './StatusBadge.jsx';

import {
  Clock,
  User,
  Ticket,
  Save,
} from 'lucide-react';

export default function TicketCard({
  ticket,
  isAdmin,
  onUpdate,
}) {
  const [status, setStatus] = useState(
    ticket.status
  );

  const [assignedTo, setAssignedTo] =
    useState(ticket.assignedTo || '');

  const [adminNotes, setAdminNotes] =
    useState(ticket.adminNotes || '');

  return (
    <div className="card p-5 hover:border-brand-500/40 transition-all duration-200">

      {/* HEADER */}
      <div className="flex justify-between items-start gap-4">

        <div className="flex-1">

          <div className="flex items-center gap-2 mb-2">
            <Ticket
              size={16}
              className="text-brand-400"
            />

            <span className="text-sm font-semibold text-brand-400">
              {ticket.ticketNumber ||
                `#${ticket.id?.slice(0, 8)}`}
            </span>
          </div>

          <h3 className="font-semibold text-lg text-white">
            {ticket.title}
          </h3>

          <p className="text-sm text-gray-400 mt-2">
            {ticket.description}
          </p>

        </div>

        <div className="flex flex-col gap-2 items-end">
          <StatusBadge status={status} />
          <PriorityBadge priority={ticket.priority} />
        </div>

      </div>

      {/* FOOTER */}
      <div className="mt-4 pt-4 border-t border-surface-border">

        <div className="flex flex-wrap gap-3 text-xs text-gray-500 mb-4">

          <span className="flex items-center gap-1">
            <Clock size={12} />
            {new Date(
              ticket.createdAt
            ).toLocaleDateString()}
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

        {/* EMPLOYEE VIEW */}
        {!isAdmin && (
          <>
            {ticket.assignedTo && (
              <div className="mb-3 text-sm text-blue-400">
                Assigned To: {ticket.assignedTo}
              </div>
            )}

            {ticket.adminNotes && (
              <div className="p-3 rounded-lg bg-amber-500/10 border border-amber-500/20">
                <p className="text-xs font-semibold text-amber-400 mb-1">
                  Admin Notes
                </p>

                <p className="text-sm text-gray-300">
                  {ticket.adminNotes}
                </p>
              </div>
            )}
          </>
        )}

        {/* ADMIN VIEW */}
        {isAdmin && (
          <div className="space-y-4">

            <div>
              <label className="text-xs text-gray-400 block mb-1">
                Status
              </label>

              <select
                value={status}
                onChange={(e) =>
                  setStatus(e.target.value)
                }
                className="input-field"
              >
                <option value="Open">
                  Open
                </option>

                <option value="In Progress">
                  In Progress
                </option>

                <option value="Resolved">
                  Resolved
                </option>
              </select>
            </div>

            <div>
              <label className="text-xs text-gray-400 block mb-1">
                Assigned To
              </label>

              <input
                type="text"
                value={assignedTo}
                onChange={(e) =>
                  setAssignedTo(
                    e.target.value
                  )
                }
                placeholder="IT Technician"
                className="input-field"
              />
            </div>

            <div>
              <label className="text-xs text-gray-400 block mb-1">
                Admin Notes
              </label>

              <textarea
                rows={3}
                value={adminNotes}
                onChange={(e) =>
                  setAdminNotes(
                    e.target.value
                  )
                }
                className="input-field resize-none"
              />
            </div>

            <button
              onClick={() =>
                onUpdate(ticket.id, {
                  status,
                  assignedTo,
                  adminNotes,
                })
              }
              className="btn-primary flex items-center gap-2"
            >
              <Save size={16} />
              Save Changes
            </button>

          </div>
        )}

      </div>

    </div>
  );
}