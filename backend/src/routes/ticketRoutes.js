const express = require('express');
const { createTicket, getTickets, updateTicket } = require('../controllers/ticketController');
const { validateCreateTicket, validateUpdateTicket } = require('../validations/ticketValidation');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router.use(protect);

/**
 * @swagger
 * /tickets:
 *   post:
 *     summary: Create a new support ticket (employee or admin)
 *     tags: [Tickets]
 *     security: [{ bearerAuth: [] }]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [title, description]
 *             properties:
 *               title: { type: string, example: "VPN not connecting" }
 *               description: { type: string, example: "VPN client fails at 80% with error 619" }
 *               priority: { type: string, enum: [Low, Medium, High] }
 *     responses:
 *       201:
 *         description: Ticket created
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *               message: Ticket created successfully
 *               data:
 *                 ticket: { id: "a1b2c3d4-...", title: "VPN not connecting", status: "Open", priority: "Medium", createdById: "3f2b6c1e-..." }
 *       400: { description: Validation error }
 *   get:
 *     summary: List tickets (employees see only their own, admins see all)
 *     tags: [Tickets]
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: query
 *         name: search
 *         schema: { type: string }
 *       - in: query
 *         name: status
 *         schema: { type: string, enum: [Open, In Progress, Resolved] }
 *       - in: query
 *         name: priority
 *         schema: { type: string, enum: [Low, Medium, High] }
 *     responses:
 *       200: { description: List of tickets, each including its createdBy relation }
 */
router.post('/', validateCreateTicket, createTicket);
router.get('/', getTickets);

/**
 * @swagger
 * /tickets/{id}:
 *   put:
 *     summary: Update a ticket (admins can change status; owners can edit their own ticket)
 *     tags: [Tickets]
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string, format: uuid }
 *     responses:
 *       200: { description: Ticket updated }
 *       403: { description: Forbidden }
 *       404: { description: Ticket not found }
 */
router.put('/:id', validateUpdateTicket, updateTicket);

module.exports = router;
