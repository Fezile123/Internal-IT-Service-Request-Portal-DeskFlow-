const asyncHandler = require('../middleware/asyncHandler');
const ApiError = require('../utils/ApiError');
const ApiResponse = require('../utils/ApiResponse');
const groqService = require('../services/groqService');
const { prisma } = require('../config/prisma');

// POST /api/ai/analyze-ticket
const analyzeTicket = asyncHandler(async (req, res) => {
  const { title, description, ticketId } = req.body;

  if (!title || !description) {
    throw new ApiError(400, 'title and description are required');
  }

  const analysis = await groqService.analyzeTicket({ title, description });

  // --- BEFORE (Mongoose) ---
  // await Ticket.findByIdAndUpdate(ticketId, { category, aiAnalysis: {...} });
  //
  // --- AFTER (Prisma) ---
  // The embedded `aiAnalysis` sub-document is now flattened columns on the
  // ticket row (see prisma/schema.prisma), so the update is a flat object.
  if (ticketId) {
    await prisma.ticket.update({
      where: { id: ticketId },
      data: {
        category: analysis.category,
        aiSummary: analysis.summary,
        aiTroubleshootingSteps: analysis.troubleshootingSteps,
        aiSuggestedResolution: analysis.suggestedResolution,
        aiRecommendedPriority: analysis.recommendedPriority,
        aiAnalyzedAt: new Date(),
      },
    });
  }

  res.status(200).json(new ApiResponse(200, 'Ticket analyzed successfully', analysis));
});

module.exports = { analyzeTicket };
