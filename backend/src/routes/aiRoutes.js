const express = require('express');
const { analyzeTicket } = require('../controllers/aiController');
const { protect } = require('../middleware/auth');

const router = express.Router();

/**
 * @swagger
 * /ai/analyze-ticket:
 *   post:
 *     summary: AI-analyze a ticket (category, summary, priority, troubleshooting steps, resolution)
 *     tags: [AI Assistant]
 *     security: [{ bearerAuth: [] }]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [title, description]
 *             properties:
 *               title: { type: string }
 *               description: { type: string }
 *               ticketId: { type: string, format: uuid, description: "Optional - persists analysis onto this ticket row" }
 *     responses:
 *       200: { description: AI analysis result }
 *       502: { description: AI service error }
 */
router.post('/analyze-ticket', protect, analyzeTicket);

module.exports = router;
