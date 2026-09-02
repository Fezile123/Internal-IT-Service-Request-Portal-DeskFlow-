const { prisma } = require('../config/prisma');
const ApiError = require('../utils/ApiError');
const {
  notifyAdminsNewTicket,
  notifyUserTicketUpdated,
  notifyUserTicketResolved,
} = require('./notificationService');

const createTicket = async ({ title, description, priority, category, createdById }) => {
  const ticket = await prisma.ticket.create({
    data: { title, description, priority, category, createdById },
  });

  const creator = await prisma.user.findUnique({
    where: { id: createdById },
    select: { name: true },
  });

  await notifyAdminsNewTicket(ticket, creator?.name || 'An employee');

  return ticket;
};

const listTicketsForUser = async (user, { search, status, priority, category } = {}) => {
  const where = {};

  if (user.role === 'employee') {
    where.createdById = user.id;
  }
  if (status)   where.status   = status;
  if (priority) where.priority = priority;
  if (category) where.category = category;
  if (search) {
    where.OR = [
      { title:       { contains: search, mode: 'insensitive' } },
      { description: { contains: search, mode: 'insensitive' } },
    ];
  }

  return prisma.ticket.findMany({
    where,
    include: { createdBy: { select: { id: true, name: true, email: true } } },
    orderBy: { createdAt: 'desc' },
  });
};

const updateTicket = async (ticketId, updates, user) => {
  const ticket = await prisma.ticket.findUnique({ where: { id: ticketId } });
  if (!ticket) throw new ApiError(404, 'Ticket not found');

  if (user.role === 'employee') {
    if (ticket.createdById !== user.id) {
      throw new ApiError(403, 'You can only update your own tickets');
    }
    if (updates.status) {
      throw new ApiError(403, 'Only admins can change ticket status');
    }
  }

  const updated = await prisma.ticket.update({
    where: { id: ticketId },
    data: updates,
  });

  // Notify the ticket owner when an admin changes the status
  if (updates.status && user.role === 'admin') {
    // Attach createdById explicitly so notificationService can find the right user
    const ticketWithOwner = { ...updated, createdById: updated.createdById };

    if (updates.status === 'Resolved') {
      await notifyUserTicketResolved(ticketWithOwner, user.name || 'Admin');
    } else {
      await notifyUserTicketUpdated(ticketWithOwner, updates.status, user.name || 'Admin');
    }
  }

  return updated;
};

module.exports = { createTicket, listTicketsForUser, updateTicket };