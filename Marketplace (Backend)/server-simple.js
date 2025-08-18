const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const rateLimit = require('express-rate-limit');
const morgan = require('morgan');
const multer = require('multer');
const path = require('path');
require('dotenv').config();

const web3Manager = require('./web3');

const app = express();
const PORT = process.env.PORT || 5000;

// Initialize Web3 or Mock
let web3Instance;

// Security middleware
app.use(helmet({
  crossOriginEmbedderPolicy: false,
  contentSecurityPolicy: false, // Disable for development
  crossOriginResourcePolicy: { policy: "cross-origin" }
}));

// CORS - allow frontend connections
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:8080', 'http://localhost:8081', 'http://localhost:8082'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'x-user-id', 'Accept', 'Origin', 'X-Requested-With', 'cache-control', 'pragma', 'expires'],
  optionsSuccessStatus: 200
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10000, // limit each IP to 10000 requests per windowMs (much higher for development)
  message: 'Too many requests from this IP, please try again later.'
});
app.use('/api/', limiter);

// Body parsing middleware
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));
app.use(compression());
app.use(morgan('combined'));

// Request logging middleware
app.use((req, res, next) => {
  console.log(`🔍 [${new Date().toISOString()}] ${req.method} ${req.originalUrl}`);
  next();
});

// Static files - serve uploads and root static files with CORS headers
app.use('/uploads', (req, res, next) => {
  // Add CORS headers for uploaded files
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  res.header('Cross-Origin-Resource-Policy', 'cross-origin');
  next();
}, express.static(path.join(__dirname, 'uploads')));

app.use(express.static(path.join(__dirname, '.')));

// Health check
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    web3Connected: web3Manager.connected
  });
});

// Marketplace API endpoints
app.get('/api/marketplace/items', async (req, res) => {
  try {
    const items = await web3Instance.getMarketplaceItems();
    res.json({ success: true, items });
  } catch (error) {
    console.error('❌ Error fetching marketplace items:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Frontend expects this route for marketplace items
app.get('/api/marketplace', async (req, res) => {
  try {
    const items = await web3Instance.getMarketplaceItems();
    res.json({ success: true, items });
  } catch (error) {
    console.error('❌ Error fetching marketplace items:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Marketplace stats endpoint (MUST come before /:id route)
app.get('/api/marketplace/stats', async (req, res) => {
  try {
    const result = await web3Instance.getMarketplaceItems();
    console.log('📊 Raw marketplace result:', JSON.stringify(result, null, 2));
    
    // Handle different response structures
    const items = result.items || result || [];
    console.log('📊 Items array:', Array.isArray(items), items.length);
    
    if (!Array.isArray(items)) {
      console.log('⚠️ Items is not an array:', typeof items, items);
      return res.json({ 
        success: true, 
        stats: {
          totalItems: 0,
          activeItems: 0,
          soldItems: 0,
          totalVolume: 0
        }
      });
    }
    
    const stats = {
      totalItems: items.length,
      activeItems: items.filter(item => !item.sold).length,
      soldItems: items.filter(item => item.sold).length,
      totalVolume: items.reduce((sum, item) => sum + parseFloat(item.price || 0), 0)
    };
    res.json({ success: true, stats });
  } catch (error) {
    console.error('❌ Error fetching marketplace stats:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Individual marketplace item by ID (MUST come after specific routes like /stats)
app.get('/api/marketplace/:id', async (req, res) => {
  try {
    const itemId = req.params.id;
    console.log(`🔍 Fetching item with ID: ${itemId}`);
    
    // Get all items first
    const items = await web3Instance.getMarketplaceItems();
    
    // Handle different response structures  
    const itemsArray = items.items || items || [];
    
    if (!Array.isArray(itemsArray)) {
      console.log('⚠️ Items is not an array:', typeof itemsArray);
      return res.status(404).json({ success: false, error: 'Item not found' });
    }
    
    // Find the specific item by ID
    const item = itemsArray.find(item => item.id === itemId || item.tokenId === itemId);
    
    if (!item) {
      console.log(`❌ Item not found for ID: ${itemId}`);
      return res.status(404).json({ success: false, error: 'Item not found' });
    }
    
    console.log(`✅ Found item:`, item);
    res.json({ success: true, item });
  } catch (error) {
    console.error(`❌ Error fetching marketplace item ${req.params.id}:`, error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Web3 status endpoint
app.get('/api/web3/status', async (req, res) => {
  try {
    const blockNumber = await web3Instance.getBlockNumber();
    const status = {
      connected: web3Instance.connected,
      name: 'localhost',
      chainId: 31337, // Hardhat default chain ID
      contractAddress: web3Instance.contractAddress,
      contractDeployed: web3Instance.isContractDeployed(),
      blockNumber: blockNumber
    };
    console.log('📡 Web3 Status Response:', status);
    res.json({ success: true, data: status }); // Send as 'data' not 'status'
  } catch (error) {
    console.error('❌ Error fetching Web3 status:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Multer setup for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/')
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname))
  }
});
const upload = multer({ storage: storage });

app.post('/api/marketplace/create', upload.fields([
  { name: 'image', maxCount: 1 },
  { name: 'model', maxCount: 1 }
]), async (req, res) => {
  try {
    const { title, description, price, category, tags, seller } = req.body;
    const imageFile = req.files['image'] ? req.files['image'][0] : null;
    const modelFile = req.files['model'] ? req.files['model'][0] : null;
    
    console.log('📤 Creating marketplace item:', { title, price, seller });
    
    const result = await web3Instance.createMarketItem({
      title,
      description, 
      price,
      category,
      tags: typeof tags === 'string' ? JSON.parse(tags) : tags,
      seller,
      imageUrl: imageFile ? `/uploads/${imageFile.filename}` : null,
      modelUrl: modelFile ? `/uploads/${modelFile.filename}` : null
    }, process.env.PRIVATE_KEY); // Pass the private key from env
    
    res.json({ success: true, ...result });
  } catch (error) {
    console.error('❌ Error creating marketplace item:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

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
  
  res.status(500).json({ error: 'Internal server error' });
});

// Initialize Web3 and start server
async function startServer() {
  try {
    console.log('🚀 Starting ChainTorque Marketplace Backend...');
    console.log(`📍 Environment: ${process.env.NODE_ENV || 'development'}`);
    
    // Always use real Web3 since we cleaned up mock data
    console.log('🌐 Initializing Real Web3 Manager...');
    web3Instance = web3Manager;
    await web3Instance.initialize();
    
    if (!web3Instance.connected) {
      console.error('❌ Failed to connect to Web3. Please check:');
      console.error('   1. Hardhat node is running on http://127.0.0.1:8545');
      console.error('   2. Contract is deployed');
      console.error('   3. Environment variables are correct');
      process.exit(1);
    }
    
    console.log('✅ Web3 Manager initialized successfully');
    console.log(`📄 Contract Address: ${web3Instance.contractAddress}`);
    console.log(`🔗 Network: Connected to blockchain`);
    
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
      console.log(`🌐 CORS enabled for: http://localhost:8080`);
      console.log(`📁 Static files served from: ${path.join(__dirname, 'uploads')}`);
      console.log('📋 Available routes:');
      console.log('   GET  /health');
      console.log('   GET  /api/marketplace');
      console.log('   GET  /api/marketplace/:id');
      console.log('   GET  /api/marketplace/items');
      console.log('   GET  /api/marketplace/stats');
      console.log('   GET  /api/web3/status');
      console.log('   POST /api/marketplace/create');
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
}

startServer();
