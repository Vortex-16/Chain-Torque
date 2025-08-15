const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const rateLimit = require('express-rate-limit');
const morgan = require('morgan');
const path = require('path');
require('dotenv').config();

const web3Manager = require('./web3');
const MockWeb3Manager = require('./web3-mock');
const apiRoutes = require('./routes');

const app = express();
const PORT = process.env.PORT || 5000;

// Initialize Web3 or Mock
let web3Instance;

// Security middleware
app.use(helmet({
  crossOriginEmbedderPolicy: false,
  contentSecurityPolicy: false // Disable for development
}));

// CORS - allow frontend connections
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:8080'],
  credentials: true
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100
});
app.use('/api', limiter);

// Body parsing
app.use(compression());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Logging
app.use(morgan('dev'));

// Static files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Health check
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    web3Connected: web3Manager.connected
  });
});

// API routes
app.use('/api', apiRoutes);

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Error handler
app.use((error, req, res, next) => {
  console.error('❌ Error:', error);
  
  if (error.code === 'LIMIT_FILE_SIZE') {
    return res.status(413).json({ error: 'File too large' });
  }
  
  res.status(500).json({ 
    error: 'Server error',
    details: process.env.NODE_ENV === 'development' ? error.message : undefined
  });
});

// Start server
async function startServer() {
  try {
    console.log('🚀 Starting ChainTorque Web3 Marketplace Backend...');
    
    // Try to initialize real Web3 first
    const web3Connected = await web3Manager.initialize();
    
    if (web3Connected) {
      web3Instance = web3Manager;
      console.log('✅ Using real Web3 connection');
    } else {
      console.log('⚠️  Web3 connection failed, switching to Mock Mode...');
      web3Instance = new MockWeb3Manager();
      await web3Instance.initialize();
      console.log('🎭 Using Mock Web3 for testing');
    }
    
    // Make web3Instance available to routes
    app.locals.web3 = web3Instance;
    
    app.listen(PORT, () => {
      console.log(`\n✅ Server running on http://localhost:${PORT}`);
      console.log(`🌐 Web3 Status: ${web3Connected ? 'Connected' : 'Mock Mode'}`);
      console.log(`\n📋 Available endpoints:`);
      console.log(`   GET  /health - Health check`);
      console.log(`   GET  /api/web3/status - Web3 status`);
      console.log(`   GET  /api/marketplace - Get all items`);
      console.log(`   POST /api/marketplace/create - Create new item`);
      console.log(`   POST /api/upload - Upload file`);
      console.log(`   GET  /api/web3/balance/:address - Get wallet balance`);
    });
    
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
}

startServer();
