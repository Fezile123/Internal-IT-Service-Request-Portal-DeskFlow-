const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const xss = require('xss-clean');
const swaggerUi = require('swagger-ui-express');

const swaggerSpec = require('./config/swagger');
const { apiLimiter } = require('./middleware/rateLimiter');
const {
  notFound,
  errorHandler,
} = require('./middleware/errorHandler');

const authRoutes = require('./routes/authRoutes');
const ticketRoutes = require('./routes/ticketRoutes');
const aiRoutes = require('./routes/aiRoutes');

const app = express();

/* ==========================================
   SECURITY
========================================== */

app.use(helmet());

/* ==========================================
   CORS
========================================== */

const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:5174',
  'http://127.0.0.1:5173',
  'http://127.0.0.1:5174',

  process.env.CLIENT_URL,
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) {
        return callback(null, true);
      }

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(
        new Error(
          `CORS blocked for origin: ${origin}`
        )
      );
    },
    credentials: true,
  })
);

/* ==========================================
   BODY PARSER
========================================== */

app.use(
  express.json({
    limit: '10kb',
  })
);

app.use(
  express.urlencoded({
    extended: true,
    limit: '10kb',
  })
);

/* ==========================================
   XSS PROTECTION
========================================== */

app.use(xss());

/* ==========================================
   LOGGING
========================================== */

app.use(
  morgan(
    process.env.NODE_ENV === 'production'
      ? 'combined'
      : 'dev'
  )
);

/* ==========================================
   RATE LIMITER
========================================== */

app.use('/api', apiLimiter);

/* ==========================================
   SWAGGER DOCS
========================================== */

app.use(
  '/api-docs',
  swaggerUi.serve,
  swaggerUi.setup(swaggerSpec)
);

/* ==========================================
   ROOT ROUTE
========================================== */

app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    name: 'DeskFlow API',
    version: '2.0.0',
    database: 'Neon PostgreSQL',
    status: 'Running',
  });
});

/* ==========================================
   HEALTH CHECK
========================================== */

app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'DeskFlow API is healthy',
    environment: process.env.NODE_ENV,
    timestamp: new Date(),
  });
});

/* ==========================================
   API ROUTES
========================================== */

app.use('/api/auth', authRoutes);
app.use('/api/tickets', ticketRoutes);
app.use('/api/ai', aiRoutes);

/* ==========================================
   ERROR HANDLERS
========================================== */

app.use(notFound);
app.use(errorHandler);

module.exports = app;