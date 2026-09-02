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
const notificationRoutes = require('./routes/notificationRoutes');

const app = express();

/* ==================================================
   SECURITY
================================================== */

app.use(helmet());

/* ==================================================
   CORS
================================================== */

const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:5174',
  'http://127.0.0.1:5173',
  'http://127.0.0.1:5174',
  'https://deskflow-frontend-app.onrender.com', 
  process.env.CLIENT_URL,
].filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow Postman, Render health checks, server-to-server requests
      if (!origin) {
        return callback(null, true);
      }

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      console.log(
        `❌ CORS blocked origin: ${origin}`
      );

      return callback(
        new Error(
          `CORS policy does not allow access from ${origin}`
        )
      );
    },
    credentials: true,
  })
);

/* ==================================================
   BODY PARSERS
================================================== */

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

/* ==================================================
   XSS PROTECTION
================================================== */

app.use(xss());

/* ==================================================
   LOGGING
================================================== */

app.use(
  morgan(
    process.env.NODE_ENV === 'production'
      ? 'combined'
      : 'dev'
  )
);

/* ==================================================
   RATE LIMITING
================================================== */

app.use('/api', apiLimiter);

/* ==================================================
   SWAGGER DOCUMENTATION
================================================== */

app.use(
  '/api-docs',
  swaggerUi.serve,
  swaggerUi.setup(swaggerSpec)
);

/* ==================================================
   ROOT ROUTE
================================================== */

app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    name: 'DeskFlow API',
    version: '2.0.0',
    database: 'Neon PostgreSQL',
    status: 'Running',
    environment:
      process.env.NODE_ENV || 'development',
  });
});

/* ==================================================
   HEALTH CHECK
================================================== */

app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'DeskFlow API is healthy',
    timestamp: new Date().toISOString(),
    environment:
      process.env.NODE_ENV || 'development',
  });
});

/* ==================================================
   API ROUTES
================================================== */

app.use('/api/auth', authRoutes);
app.use('/api/tickets', ticketRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/notifications', notificationRoutes);

/* ==================================================
   404 HANDLER
================================================== */

app.use(notFound);

/* ==================================================
   GLOBAL ERROR HANDLER
================================================== */

app.use(errorHandler);

module.exports = app;