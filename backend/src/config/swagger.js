const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',

    info: {
      title: 'DeskFlow API',
      version: '2.0.0',
      description:
        'Internal IT Service Request Portal API powered by PostgreSQL, Prisma, JWT Authentication, and AI Ticket Analysis.',
      contact: {
        name: 'DeskFlow Engineering',
      },
    },

    servers: [
      {
        url: 'http://localhost:5000/api',
        description: 'Local dev server',
      },
      {
        url: 'https://your-render-service.onrender.com/api',
        description: 'Production server',
      },
    ],

    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },

      schemas: {
        ApiResponse: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
            },
            message: {
              type: 'string',
            },
            data: {
              type: 'object',
            },
          },
        },

        User: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              format: 'uuid',
            },
            name: {
              type: 'string',
              example: 'John Doe',
            },
            email: {
              type: 'string',
              example: 'john@example.com',
            },
            role: {
              type: 'string',
              enum: ['employee', 'admin'],
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
            },
          },
        },

        RegisterRequest: {
          type: 'object',
          required: ['name', 'email', 'password'],
          properties: {
            name: {
              type: 'string',
              example: 'John Doe',
            },
            email: {
              type: 'string',
              example: 'john@example.com',
            },
            password: {
              type: 'string',
              example: 'Password123',
            },
          },
        },

        LoginRequest: {
          type: 'object',
          required: ['email', 'password'],
          properties: {
            email: {
              type: 'string',
              example: 'john@example.com',
            },
            password: {
              type: 'string',
              example: 'Password123',
            },
          },
        },

        AuthResponse: {
          type: 'object',
          properties: {
            token: {
              type: 'string',
              example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
            },
            user: {
              $ref: '#/components/schemas/User',
            },
          },
        },

        Ticket: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              format: 'uuid',
            },
            title: {
              type: 'string',
              example: 'Cannot connect to VPN',
            },
            description: {
              type: 'string',
              example: 'VPN disconnects after login',
            },
            priority: {
              type: 'string',
              enum: ['Low', 'Medium', 'High'],
            },
            status: {
              type: 'string',
              enum: ['Open', 'In Progress', 'Resolved'],
            },
            category: {
              type: 'string',
              enum: [
                'Hardware',
                'Software',
                'Network',
                'Account Access',
                'Other',
              ],
            },
            createdById: {
              type: 'string',
              format: 'uuid',
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
            },
          },
        },
      },
    },

    security: [
      {
        bearerAuth: [],
      },
    ],

    tags: [
      {
        name: 'Auth',
        description: 'Authentication endpoints',
      },
      {
        name: 'Tickets',
        description: 'Ticket management',
      },
      {
        name: 'AI Assistant',
        description: 'AI-powered ticket analysis',
      },
    ],
  },

  apis: [
    './src/routes/*.js',
    './src/routes/**/*.js',
  ],
};

module.exports = swaggerJsdoc(options);