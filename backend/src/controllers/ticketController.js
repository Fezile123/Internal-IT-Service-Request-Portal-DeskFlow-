const asyncHandler = require('../middleware/asyncHandler');
const ApiResponse = require('../utils/ApiResponse');
const ticketService = require('../services/ticketService');

// POST /api/tickets
const createTicket = asyncHandler(async (req, res) => {
  const { title, description, priority, category } = req.body;
  const ticket = await ticketService.createTicket({
    title,
    description,
    priority,
    category,
    createdById: req.user.id, // Prisma uses createdById (FK scalar) instead of Mongoose's createdBy ObjectId ref
  });
  res.status(201).json(new ApiResponse(201, 'Ticket created successfully', { ticket }));
});

// GET /api/tickets?search=&status=&priority=&category=
const getTickets = asyncHandler(async (req, res) => {
  const { search, status, priority, category } = req.query;
  const tickets = await ticketService.listTicketsForUser(req.user, { search, status, priority, category });
  res.status(200).json(new ApiResponse(200, 'Tickets fetched successfully', { tickets, count: tickets.length }));
});

// PUT /api/tickets/:id
const updateTicket = asyncHandler(async (req, res) => {
  const ticket = await ticketService.updateTicket(req.params.id, req.body, req.user);
  res.status(200).json(new ApiResponse(200, 'Ticket updated successfully', { ticket }));
});

module.exports = { createTicket, getTickets, updateTicket };
