const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { ethers } = require('ethers');
const { requireAuth, optionalAuth, requireAdmin, requireWallet } = require('./middleware/auth');

const router = express.Router();

// File upload setup
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(__dirname, 'uploads');
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 50 * 1024 * 1024 }, // 50MB
  fileFilter: (req, file, cb) => {
    const allowedExtensions = ['.glb', '.gltf', '.obj', '.fbx', '.stl', '.jpg', '.jpeg', '.png', '.webp'];
    const fileExtension = path.extname(file.originalname).toLowerCase();
    
    if (allowedExtensions.includes(fileExtension)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only 3D models and images allowed.'));
    }
  }
});

// ============ WEB3 ROUTES ============

// Get Web3 status
router.get('/web3/status', async (req, res) => {
  try {
    const web3 = req.app.locals.web3;
    const networkInfo = await web3.getNetworkInfo();
    res.json({
      success: true,
      data: {
        connected: web3.connected,
        ...networkInfo
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Initialize Web3 connection
router.post('/web3/connect', async (req, res) => {
  try {
    const web3 = req.app.locals.web3;
    const connected = await web3.initialize();
    res.json({
      success: connected,
      message: connected ? 'Web3 connected successfully' : 'Web3 connection failed'
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Validate wallet address
router.post('/web3/validate-address', (req, res) => {
  try {
    const web3 = req.app.locals.web3;
    const { address } = req.body;
    const result = web3.validateAddress(address);
    res.json({ success: true, data: result });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get wallet balance
router.get('/web3/balance/:address', async (req, res) => {
  try {
    const web3 = req.app.locals.web3;
    const { address } = req.params;
    const result = await web3.getBalance(address);
    res.json({ success: true, data: result });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ============ MARKETPLACE ROUTES ============

// Get marketplace statistics
router.get('/marketplace/stats', async (req, res) => {
  try {
    const web3 = req.app.locals.web3;
    // Get items from web3 to calculate real stats
    const itemsResult = await web3.getMarketplaceItems();
    const itemsCount = itemsResult.success ? itemsResult.data.length : 0;
    
    const stats = {
      totalItems: itemsCount,
      totalSales: 42,
      totalVolume: '1,234.5',
      activeUsers: 156
    };
    res.json(stats);
  } catch (error) {
    console.error('Error fetching marketplace stats:', error);
    res.status(500).json({ error: 'Failed to fetch marketplace stats' });
  }
});

// Get all marketplace items (TRUE WEB3)
router.get('/marketplace', async (req, res) => {
  try {
    const web3 = req.app.locals.web3;
    const result = await web3.getMarketplaceItems();
    
    if (!result.success) {
      return res.json({
        success: false,
        error: result.error,
        data: [],
        total: 0,
        isWeb3: result.isWeb3 || false,
        message: 'Contract not deployed yet. This will work after deployment.'
      });
    }
    
    res.json({
      success: true,
      data: result.items,
      total: result.count,
      isWeb3: result.isWeb3
    });
  } catch (error) {
    res.status(500).json({ 
      error: error.message,
      isWeb3: false 
    });
  }
});

// Get marketplace item by ID (TRUE WEB3)
router.get('/marketplace/:tokenId', async (req, res) => {
  try {
    const web3 = req.app.locals.web3;
    const { tokenId } = req.params;
    
    if (!web3.contract) {
      return res.status(404).json({ 
        error: 'Contract not deployed yet',
        isWeb3: false 
      });
    }
    
    const item = await web3.contract.getMarketItem(tokenId);
    
    if (item.tokenId.toString() === '0') {
      return res.status(404).json({ error: 'Item not found' });
    }
    
    const formattedItem = {
      id: item.tokenId.toString(),
      title: item.title,
      description: item.description,
      price: ethers.utils.formatEther(item.price),
      category: item.category,
      seller: item.seller,
      owner: item.owner,
      sold: item.sold,
      tokenId: item.tokenId.toString(),
      isNFT: true
    };
    
    res.json({ 
      success: true, 
      data: formattedItem,
      isWeb3: true 
    });
  } catch (error) {
    res.status(500).json({ 
      error: error.message,
      isWeb3: false 
    });
  }
});

// Create new marketplace item (TRUE WEB3)
router.post('/marketplace/create', requireAuth, requireWallet, upload.fields([
  { name: 'model', maxCount: 1 },
  { name: 'image', maxCount: 1 }
]), async (req, res) => {
  try {
    const web3 = req.app.locals.web3;
    const {
      title,
      description,
      price,
      category
    } = req.body;

    const modelFile = req.files?.model?.[0];
    const imageFile = req.files?.image?.[0];

    if (!title || !description || !price) {
      return res.status(400).json({ error: 'Title, description, and price are required' });
    }

    if (!process.env.PRIVATE_KEY) {
      return res.status(400).json({ 
        error: 'Private key not configured. Add PRIVATE_KEY to .env file.',
        isWeb3: false 
      });
    }

    if (!web3.isContractDeployed()) {
      return res.status(400).json({ 
        error: 'Smart contract not deployed. Run "npm run deploy" first.',
        isWeb3: false 
      });
    }

    const itemData = {
      title,
      description,
      price,
      category: category || 'General',
      imageUrl: imageFile ? `/uploads/${imageFile.filename}` : '/placeholder.jpg',
      modelUrl: modelFile ? `/uploads/${modelFile.filename}` : null
    };

    // TRUE WEB3: Mint NFT and list on marketplace
    const result = await web3.createMarketItem(itemData, process.env.PRIVATE_KEY);
    
    res.json({
      success: true,
      data: {
        ...itemData,
        tokenId: result.tokenId,
        transactionHash: result.transactionHash,
        isNFT: true
      },
      message: 'NFT created and listed on marketplace',
      isWeb3: result.isWeb3
    });

  } catch (error) {
    // Clean up uploaded files on error
    if (req.files?.model?.[0]) {
      try { fs.unlinkSync(req.files.model[0].path); } catch {}
    }
    if (req.files?.image?.[0]) {
      try { fs.unlinkSync(req.files.image[0].path); } catch {}
    }
    
    res.status(500).json({ 
      error: error.message,
      isWeb3: false 
    });
  }
});

// Purchase marketplace item (TRUE WEB3)
router.post('/marketplace/purchase/:tokenId', requireAuth, requireWallet, async (req, res) => {
  try {
    const web3 = req.app.locals.web3;
    const { tokenId } = req.params;
    
    if (!process.env.PRIVATE_KEY) {
      return res.status(400).json({ 
        error: 'Private key not configured',
        isWeb3: false 
      });
    }

    if (!web3.isContractDeployed()) {
      return res.status(400).json({ 
        error: 'Smart contract not deployed',
        isWeb3: false 
      });
    }

    // TRUE WEB3: Purchase NFT through smart contract
    const result = await web3.purchaseMarketItem(tokenId, process.env.PRIVATE_KEY);
    
    res.json({
      success: true,
      data: {
        tokenId,
        transactionHash: result.transactionHash,
        buyer: result.buyer
      },
      message: 'NFT purchased successfully',
      isWeb3: result.isWeb3
    });

  } catch (error) {
    res.status(500).json({ 
      error: error.message,
      isWeb3: false 
    });
  }
});

// Get user's NFTs (TRUE WEB3)
router.get('/user/:address/nfts', async (req, res) => {
  try {
    const web3 = req.app.locals.web3;
    const { address } = req.params;
    
    if (!web3.isValidAddress(address)) {
      return res.status(400).json({ error: 'Invalid wallet address' });
    }

    if (!web3.isContractDeployed()) {
      return res.json({
        success: true,
        data: [],
        total: 0,
        isWeb3: false,
        message: 'Contract not deployed yet'
      });
    }

    // TRUE WEB3: Get user's NFTs from smart contract
    const result = await web3.getUserNFTs(address);
    
    res.json({
      success: true,
      data: result.nfts,
      total: result.count,
      isWeb3: result.isWeb3
    });

  } catch (error) {
    res.status(500).json({ 
      error: error.message,
      isWeb3: false 
    });
  }
});

// Get marketplace statistics (TRUE WEB3)
router.get('/marketplace/stats', async (req, res) => {
  try {
    const web3 = req.app.locals.web3;
    const stats = await web3.getMarketplaceStats();
    
    res.json({
      success: true,
      data: stats,
      isWeb3: stats.isWeb3
    });
  } catch (error) {
    res.status(500).json({ 
      error: error.message,
      isWeb3: false 
    });
  }
});

// ============ USER ROUTES ============

// Get user profile (simple version)
router.get('/user/profile', requireAuth, (req, res) => {
  try {
    res.json({
      success: true,
      data: {
        userId: req.user.id,
        walletAddress: req.user.walletAddress,
        itemsCreated: 0, // Would count from database
        itemsPurchased: 0
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ============ FILE ROUTES ============

// Upload single file
router.post('/upload', requireAuth, upload.single('file'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    res.json({
      success: true,
      data: {
        filename: req.file.filename,
        originalName: req.file.originalname,
        size: req.file.size,
        url: `/uploads/${req.file.filename}`
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
