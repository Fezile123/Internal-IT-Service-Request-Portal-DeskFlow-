const { prisma } = require('../config/prisma');
const ApiError = require('../utils/ApiError');

/**
 * ============================================================
 * MONGOOSE -> PRISMA: BEFORE / AFTER REFERENCE
 * ============================================================
 *
 * Create:
 *   BEFORE: Ticket.create({ title, description, priority, category, createdBy })
 *   AFTER:  prisma.ticket.create({ data: { title, description, priority, category, createdById } })
 *
 * Find many with filter + populate + sort:
 *   BEFORE: Ticket.find(filter).populate('createdBy', 'name email').sort({ createdAt: -1 })
 *   AFTER:  prisma.ticket.findMany({ where: filter, include: { createdBy: { select: { name: true, email: true } } }, orderBy: { createdAt: 'desc' } })
 *
 * Find by id:
 *   BEFORE: Ticket.findById(id)
 *   AFTER:  prisma.ticket.findUnique({ where: { id } })
 *
 * Update:
 *   BEFORE: Ticket.findByIdAndUpdate(id, updates, { new: true })
 *   AFTER:  prisma.ticket.update({ where: { id }, data: updates })
 *
 * Text search ($text):
 *   BEFORE: filter.$text = { $search: search }
 *   AFTER:  OR: [{ title: { contains: search, mode: 'insensitive' } }, { description: { contains: search, mode: 'insensitive' } }]
 *   (For heavier full-text search needs, Postgres supports native tsvector/GIN
 *   indexes or the pg_trgm extension — see README "Future Improvements".)
 * ============================================================
 */

const createTicket = async ({ title, description, priority, category, createdById }) => {
  const ticket = await prisma.ticket.create({
    data: { title, description, priority, category, createdById },
  });
  return ticket;
};

const listTicketsForUser = async (user, { search, status, priority, category } = {}) => {
  const where = {};

  // Employees only ever see their own tickets; admins see everything.
  if (user.role === 'employee') {
    where.createdById = user.id;
  }

  if (status) where.status = status;
  if (priority) where.priority = priority;
  if (category) where.category = category;
  if (search) {
    where.OR = [
      { title: { contains: search, mode: 'insensitive' } },
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

  // Same business rule as before: employees may only update their own
  // tickets and cannot change status (only admins resolve/progress tickets).
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
  return updated;
};

module.exports = { createTicket, listTicketsForUser, updateTicket };
