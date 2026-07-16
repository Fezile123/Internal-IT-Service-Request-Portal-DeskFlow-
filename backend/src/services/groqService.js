const Groq = require('groq-sdk');
const ApiError = require('../utils/ApiError');

// Unchanged from the MongoDB version — the AI service layer never touched
// the database directly, so this file is untouched by the migration.
// (It's included here for completeness / to show what did NOT need to change.)

let client = null;
const getClient = () => {
  if (!client) {
    if (!process.env.GROQ_API_KEY) {
      throw new ApiError(500, 'GROQ_API_KEY is not configured on the server');
    }
    client = new Groq({ apiKey: process.env.GROQ_API_KEY });
  }
  return client;
};

const MODEL = process.env.GROQ_MODEL || 'llama-3.3-70b-versatile';

const SYSTEM_PROMPT = `You are DeskFlow's IT support triage assistant.
Given a ticket title and description, respond with ONLY a JSON object (no markdown, no preamble) matching exactly this shape:

{
  "category": "Hardware" | "Software" | "Network" | "Account Access" | "Other",
  "summary": "one or two sentence plain-language summary of the issue",
  "recommendedPriority": "Low" | "Medium" | "High",
  "troubleshootingSteps": ["step 1", "step 2", "step 3"],
  "suggestedResolution": "a concise recommended resolution for the IT admin"
}

Rules:
- category must be exactly one of the five allowed values.
- recommendedPriority must reflect business impact (e.g. outages/security/multiple users affected = High).
- troubleshootingSteps should be 3-5 short, actionable items an employee or admin could try first.
- Output must be valid JSON only.`;

const analyzeTicket = async ({ title, description }) => {
  const groq = getClient();

  const completion = await groq.chat.completions.create({
    model: MODEL,
    temperature: 0.3,
    max_tokens: 600,
    response_format: { type: 'json_object' },
    messages: [
      { role: 'system', content: SYSTEM_PROMPT },
      { role: 'user', content: `Title: ${title}\n\nDescription: ${description}` },
    ],
  });

  const raw = completion.choices?.[0]?.message?.content;
  if (!raw) {
    throw new ApiError(502, 'AI service returned an empty response');
  }

  let parsed;
  try {
    parsed = JSON.parse(raw);
  } catch (err) {
    throw new ApiError(502, 'AI service returned malformed JSON');
  }

  const ALLOWED_CATEGORIES = ['Hardware', 'Software', 'Network', 'Account Access', 'Other'];
  const ALLOWED_PRIORITIES = ['Low', 'Medium', 'High'];

  return {
    category: ALLOWED_CATEGORIES.includes(parsed.category) ? parsed.category : 'Other',
    summary: parsed.summary || '',
    recommendedPriority: ALLOWED_PRIORITIES.includes(parsed.recommendedPriority)
      ? parsed.recommendedPriority
      : 'Medium',
    troubleshootingSteps: Array.isArray(parsed.troubleshootingSteps) ? parsed.troubleshootingSteps : [],
    suggestedResolution: parsed.suggestedResolution || '',
  };
};

module.exports = { analyzeTicket };
