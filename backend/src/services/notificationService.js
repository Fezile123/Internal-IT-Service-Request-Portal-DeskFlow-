// backend/src/notificationService.js
// Central service to create notifications. Import and call these
// from your existing ticket routes whenever a ticket event occurs.

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// SSE clients map: userId -> res (response stream)
const sseClients = new Map();

/**
 * Register an SSE client connection for a user.
 * Called from the /api/notifications/stream route.
 */
function addSSEClient(userId, res) {
  sseClients.set(userId, res);
}

/**
 * Remove an SSE client (on disconnect).
 */
function removeSSEClient(userId) {
  sseClients.delete(userId);
}

/**
 * Push a real-time event to a specific user if they are connected.
 */
function pushToUser(userId, data) {
  const client = sseClients.get(userId);
  if (client) {
    client.write(`data: ${JSON.stringify(data)}\n\n`);
  }
}

/**
 * Push a real-time event to ALL connected admin users.
 * You must pass in the list of admin userIds.
 */
async function pushToAdmins(data) {
  try {
    const admins = await prisma.user.findMany({
      where: { role: { in: ['admin'] } },
      select: { id: true },
    });
    admins.forEach(({ id }) => pushToUser(id, data));
  } catch (e) {
    console.error('pushToAdmins error:', e);
  }
}

/**
 * Create a notification in the database and push it live via SSE.
 *
 * @param {object} opts
 * @param {string}   opts.userId    - recipient user ID
 * @param {string}   opts.type      - notification type string
 * @param {string}   opts.title     - short title
 * @param {string}   opts.message   - detail message
 * @param {string}  [opts.ticketId] - optional related ticket ID
 */
async function createNotification({ userId, type, title, message, ticketId }) {
  try {
    const notification = await prisma.notification.create({
      data: { userId, type, title, message, ticketId: ticketId || null },
    });
    // Push live
    pushToUser(userId, { type: 'NEW_NOTIFICATION', notification });
    return notification;
  } catch (e) {
    console.error('createNotification error:', e);
  }
}

// ─── Convenience helpers ───────────────────────────────────────

/** Notify all admins when a new ticket is created by an employee */
async function notifyAdminsNewTicket(ticket, submitterName) {
  try {
    const admins = await prisma.user.findMany({
      where: { role: { in: ['admin'] } },
      select: { id: true },
    });
    for (const admin of admins) {
      await createNotification({
        userId: admin.id,
        type: 'ticket_created',
        title: '🎫 New Ticket Submitted',
        message: `${submitterName} submitted: "${ticket.title}"`,
        ticketId: ticket.id,
      });
    }
  } catch (e) {
    console.error('notifyAdminsNewTicket error:', e);
  }
}

/** Notify the ticket owner when their ticket status changes */
async function notifyUserTicketUpdated(ticket, newStatus, updatedByName) {
  const statusLabels = {
    OPEN: 'Open',
    IN_PROGRESS: 'In Progress',
    RESOLVED: 'Resolved',
    CLOSED: 'Closed',
  };
  await createNotification({
    userId: ticket.createdById,
    type: 'ticket_updated',
    title: '🔄 Ticket Status Updated',
    message: `Your ticket "${ticket.title}" was updated to ${statusLabels[newStatus] || newStatus} by ${updatedByName}.`,
    ticketId: ticket.id,
  });
}

/** Notify the ticket owner when their ticket is resolved */
async function notifyUserTicketResolved(ticket, resolvedByName) {
  await createNotification({
    userId: ticket.createdById,
    type: 'ticket_resolved',
    title: '✅ Ticket Resolved',
    message: `Your ticket "${ticket.title}" has been resolved by ${resolvedByName}. Please rate your experience.`,
    ticketId: ticket.id,
  });
}

/** Notify a user when a comment is added to their ticket */
async function notifyUserNewComment(ticket, commenterName) {
  if (ticket.createdById === ticket.commenterId) return; // don't notify yourself
  await createNotification({
    userId: ticket.createdById,
    type: 'new_comment',
    title: '💬 New Comment',
    message: `${commenterName} commented on your ticket "${ticket.title}".`,
    ticketId: ticket.id,
  });
}

module.exports = {
  addSSEClient,
  removeSSEClient,
  createNotification,
  notifyAdminsNewTicket,
  notifyUserTicketUpdated,
  notifyUserTicketResolved,
  notifyUserNewComment,
  pushToUser,
  pushToAdmins,
};
