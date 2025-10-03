const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

// Load environment variables
dotenv.config();

// Create Express app
const app = express();

// Trust proxy (CRITICAL for Render.com)
app.set('trust proxy', 1);

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('✅ MongoDB Connected'))
  .catch((err) => {
    console.error('❌ MongoDB Connection Error:', err.message);
    process.exit(1);
  });

// Rate limiter
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
});

// Middleware
app.use(helmet());
app.use(cors({
  origin: process.env.CLIENT_URL || '*',
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use('/api/', limiter);

// Health check (before routes)
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    status: 'OK',
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
    database: mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected',
    environment: process.env.NODE_ENV || 'production'
  });
});

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    message: 'Construction Workers & Payroll Management API',
    version: '1.0.0',
    status: 'Running',
    endpoints: {
      health: '/api/health',
      auth: '/api/auth',
      employees: '/api/employees',
      contractors: '/api/contractors',
      attendance: '/api/attendance',
      reports: '/api/reports'
    }
  });
});

// API Routes (with error handling for missing files)
try {
  app.use('/api/auth', require('./routes/auth'));
  console.log('✅ Auth routes loaded');
} catch (err) {
  console.error('❌ Error loading auth routes:', err.message);
}

try {
  app.use('/api/employees', require('./routes/employees'));
  console.log('✅ Employee routes loaded');
} catch (err) {
  console.error('❌ Error loading employee routes:', err.message);
}

try {
  app.use('/api/contractors', require('./routes/contractors'));
  console.log('✅ Contractor routes loaded');
} catch (err) {
  console.error('❌ Error loading contractor routes:', err.message);
}

try {
  app.use('/api/attendance', require('./routes/attendance'));
  console.log('✅ Attendance routes loaded');
} catch (err) {
  console.error('❌ Error loading attendance routes:', err.message);
}

try {
  app.use('/api/reports', require('./routes/reports'));
  console.log('✅ Report routes loaded');
} catch (err) {
  console.error('❌ Error loading report routes:', err.message);
}

try {
  app.use('/api/payroll', require('./routes/payroll'));
  console.log('✅ Payroll routes loaded');
} catch (err) {
  console.error('❌ Error loading payroll routes:', err.message);
}

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.method} ${req.path} not found`
  });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('❌ Server Error:', err);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal server error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

// Start server
const PORT = process.env.PORT || 10000;
const HOST = process.env.HOST || '0.0.0.0';

app.listen(PORT, HOST, () => {
  console.log('═══════════════════════════════════════');
  console.log('🏗️  Construction Workers & Payroll');
  console.log('═══════════════════════════════════════');
  console.log(`📡 Server: ${HOST}:${PORT}`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV || 'production'}`);
  console.log(`🗄️  Database: ${mongoose.connection.readyState === 1 ? 'Connected ✅' : 'Connecting...'}`);
  console.log('═══════════════════════════════════════');
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM signal received: closing server');
  mongoose.connection.close(() => {
    console.log('MongoDB connection closed');
    process.exit(0);
  });
});

module.exports = app;
