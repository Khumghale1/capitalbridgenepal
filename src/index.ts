import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

// Import routes
import authRoutes from './routes/auth.routes';
import uploadRoutes from './routes/upload.routes';
import onboardingRoutes from './routes/onboarding.routes';
import businessRoutes from './routes/business.routes';
import interestRoutes from './routes/interest.routes';
import businessProfileRoutes from './routes/businessProfile.routes';

// Import error handler
import { errorHandler } from './middlewares/errorHandler.middleware';

// Load environment variables
dotenv.config();

const app: Application = express();
const PORT = process.env.PORT || 3000;

// Middleware
// Configure CORS to allow specific origins
const allowedOrigins = [
  'http://localhost:8080',     // Vite dev server
  'http://localhost:3000',     // Alternative local port
  'http://localhost:4173',     // Vite preview
  process.env.FRONTEND_URL,    // Production frontend
].filter(Boolean); // Remove undefined values

// Log CORS configuration on startup
console.log('CORS Configuration:');
console.log('Allowed origins:', allowedOrigins);
console.log('FRONTEND_URL env var:', process.env.FRONTEND_URL);

app.use(cors({
  origin: (origin, callback) => {
    // Log incoming requests for debugging
    console.log('CORS request from origin:', origin);

    // Allow requests with no origin (like mobile apps, Postman, etc.)
    if (!origin) {
      console.log('✓ Allowing request with no origin');
      return callback(null, true);
    }

    if (allowedOrigins.includes(origin)) {
      console.log('✓ Origin allowed:', origin);
      callback(null, true);
    } else {
      console.log('✗ Origin rejected:', origin);
      console.log('  Allowed origins:', allowedOrigins);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true, // Allow cookies and auth headers
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.get('/', (req: Request, res: Response) => {
  res.json({
    message: 'Capital Bridge Nepal API',
    version: '1.0.0',
    endpoints: {
      onboarding: '/api/onboarding',
      businesses: '/api/businesses',
      business: '/api/business',
      interests: '/api/interests',
      upload: '/api/upload'
    }
  });
});

app.use('/api/auth', authRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/onboarding', onboardingRoutes);
app.use('/api/businesses', businessRoutes);
app.use('/api/interests', interestRoutes);
app.use('/api/business', businessProfileRoutes);

// Error handling middleware (must be last)
app.use(errorHandler);

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
});
