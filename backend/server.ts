import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { sendSMSRoute } from './routes/send-sms';
import { validateInput } from './middleware/validation';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(express.json({ limit: '1kb' }));

// CORS configuration
const corsOrigin = process.env.CORS_ORIGIN || 'http://localhost:3000';
app.use(cors({
  origin: corsOrigin,
  credentials: true,
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type'],
  maxAge: 3600,
}));

// Health check endpoint
app.get('/health', (req: Request, res: Response) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// SMS send endpoint with validation
app.post(
  '/api/send-sms',
  validateInput,
  sendSMSRoute
);

// 404 handler
app.use((req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    error: 'Endpoint not found',
    code: 'NOT_FOUND',
  });
});

// Error handling middleware
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error('Error:', err);

  // Don't expose sensitive details in error messages
  const isDev = process.env.NODE_ENV === 'development';
  const message = isDev ? err.message : 'Internal server error';

  res.status(err.statusCode || 500).json({
    success: false,
    error: message,
    code: err.code || 'INTERNAL_ERROR',
  });
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM signal received: closing HTTP server');
  server.close(() => {
    console.log('HTTP server closed');
    process.exit(0);
  });
});

// Start server
const server = app.listen(PORT, () => {
  console.log(`✓ SMS Gateway server running on port ${PORT}`);
  console.log(`✓ CORS enabled for: ${corsOrigin}`);
  console.log(`✓ Environment: ${process.env.NODE_ENV || 'development'}`);
  
  if (!process.env.TWILIO_ACCOUNT_SID) {
    console.warn('⚠ TWILIO_ACCOUNT_SID not set - SMS sending will fail');
  }
  if (!process.env.TWILIO_AUTH_TOKEN) {
    console.warn('⚠ TWILIO_AUTH_TOKEN not set - SMS sending will fail');
  }
});

export default app;
