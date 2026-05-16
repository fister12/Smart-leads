import express, { Express } from 'express';
import helmet from 'helmet';
import cors from 'cors';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import { config } from './config/env.js';
import { connectDatabase } from './config/db.js';
import { errorMiddleware } from './middleware/error.middleware.js';
import authRoutes from './modules/auth/auth.routes.js';
import leadRoutes from './modules/leads/lead.routes.js';

const app: Express = express();

// Initialize database connection
connectDatabase().catch((error) => {
  console.error('Failed to connect to database:', error);
  process.exit(1);
});

// Middleware Pipeline in Exact Order

// 1. Security headers
app.use(helmet());

// 2. CORS with whitelist
const corsOptions = {
  origin: config.clientUrl,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};
app.use(cors(corsOptions));

// 3. Rate limiting (global and auth-specific)
const globalLimiter = rateLimit({
  windowMs: config.rateLimitWindowMs,
  max: config.rateLimitMaxRequests,
  message: 'Too many requests from this IP, please try again later.',
});

const authLimiter = rateLimit({
  windowMs: config.authRateLimitWindowMs,
  max: config.authRateLimitMaxRequests,
  message: 'Too many login attempts, please try again later.',
});

app.use(globalLimiter);

// 4. Body parsing
app.use(express.json({ limit: '10kb' }));

// 5. Request logging
if (config.nodeEnv === 'production') {
  app.use(morgan('json'));
} else {
  app.use(morgan('combined'));
}

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Routes with auth middleware applied
app.use('/api/auth', authLimiter, authRoutes);
app.use('/api/leads', leadRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
  });
});

// 6. Error handling middleware (must be last)
app.use(errorMiddleware);

// Start server
const port = config.port;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

export default app;
