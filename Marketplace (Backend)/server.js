const express = require('express');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const Web3Manager = require('./web3');
const PinataService = require('./services/pinata');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(
  cors({
    origin: ['http://localhost:8080', 'http://localhost:3000'],
    credentials: true,
  })
);
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// File upload configuration
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = path.join(__dirname, 'uploads');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const fileExt = path.extname(file.originalname);
    const fileName =
      file.fieldname +
      '-' +
      Date.now() +
      '-' +
      Math.random().toString(36).substr(2, 6) +
      fileExt;
    cb(null, fileName);
  },
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 100 * 1024 * 1024, // 100MB limit
  },
});

// Initialize services
const web3 = new Web3Manager();
const pinata = new PinataService();
let marketplaceItems = [];
let itemCounter = 1;

// Initialize both Web3 and Pinata services
async function initializeServices() {
  console.log('🔗 Initializing services...');

  try {
    // Initialize Web3
    await web3.initialize();

    // Initialize Pinata IPFS
    await pinata.initialize();

    const storageInfo = pinata.getStorageInfo();
    console.log('📦 Storage configuration:', storageInfo);

    // 🚀 CRITICAL FIX: Load existing NFTs from blockchain on startup
    await loadExistingNFTs();
    
  } catch (error) {
    console.error('❌ Service initialization failed:', error.message);
  }
}

// 🎯 Load existing NFTs from blockchain (IPFS data is permanent!)
async function loadExistingNFTs() {
  console.log('🔄 [DEBUG] Loading existing NFTs from blockchain...');
  
  try {
    if (!web3.isReady()) {
      console.log('⚠️ Web3 not ready, skipping NFT loading');
      return;
    }

    // Get all market items from the smart contract
    const result = await web3.getMarketItems();
    console.log('[DEBUG] web3.getMarketItems() result:', JSON.stringify(result, null, 2));
    if (result.success && result.items.length > 0) {
      console.log(`[DEBUG] Found ${result.items.length} existing NFTs on blockchain`);
      for (const blockchainItem of result.items) {
        console.log('[DEBUG] Blockchain item:', JSON.stringify(blockchainItem, null, 2));
        const marketItem = {
          id: itemCounter++,
          tokenId: blockchainItem.tokenId,
          title: blockchainItem.title,
          description: blockchainItem.description,
          price: parseFloat(blockchainItem.price),
          category: blockchainItem.category,
          imageUrl: blockchainItem.imageUrl,
          modelUrl: blockchainItem.modelUrl,
          tokenURI: blockchainItem.tokenURI,
          seller: blockchainItem.seller,
          createdAt: blockchainItem.createdAt,
          isBlockchain: true,
          isPermanent: true,
          storage: blockchainItem.tokenURI?.startsWith('http') ? 'ipfs' : 'local',
          transactionHash: blockchainItem.transactionHash,
          blockNumber: blockchainItem.blockNumber
        };
        marketplaceItems.push(marketItem);
      }
      console.log(`[DEBUG] Loaded ${marketplaceItems.length} NFTs from blockchain`);
    } else {
      console.log('[DEBUG] No existing NFTs found on blockchain');
    }
    
  } catch (error) {
    console.error('❌ Failed to load existing NFTs:', error.message);
    console.log('📝 Starting with empty marketplace');
  }
}

// Routes

// Health check
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    message: 'ChainTorque Backend is running',
    timestamp: new Date().toISOString(),
  });
});

// Web3 status
app.get('/api/web3/status', (req, res) => {
  console.log('🔍 2025-08-19T02:37:32.150Z GET /api/web3/status');

  try {
    if (web3.isReady()) {
      const response = {
        success: true,
        connected: true,
        network: 'unknown',
        chainId: 31337,
        contractAddress: web3.contractAddress,
        contractDeployed: true,
        signerAddress: web3.signer.address,
        balance: '10000.0',
        listingPrice: '0.00025',
        message: 'Web3 connected successfully',
      };

      console.log('📡 Sending Web3 status response:', response);
      res.json(response);
    } else {
      const response = {
        success: false,
        connected: false,
        contractDeployed: false,
        message: 'Web3 not initialized',
      };

      console.log('📡 Sending Web3 status response:', response);
      res.json(response);
    }
  } catch (error) {
    res.json({
      success: false,
      connected: false,
      contractDeployed: false,
      message: `Web3 error: ${error.message}`,
    });
  }
});

// Marketplace items endpoint
app.get('/api/marketplace', async (req, res) => {
  console.log('📥 Fetching items from marketplace...');

  try {
    // Return items from memory (which now includes both IPFS and blockchain items)
    console.log(`📦 Found ${marketplaceItems.length} items in marketplace`);

    res.json({
      success: true,
      data: marketplaceItems,
      total: marketplaceItems.length,
      source: pinata.isAvailable() ? 'ipfs+blockchain' : 'local+blockchain',
    });
  } catch (error) {
    console.error('❌ Marketplace fetch error:', error.message);
    res.status(500).json({
      success: false,
      message: 'Server error fetching marketplace items',
      error: error.message,
    });
  }
});

// Create marketplace item - Real NFT Marketplace with IPFS
app.post(
  '/api/marketplace/create',
  upload.fields([
    { name: 'image', maxCount: 1 },
    { name: 'model', maxCount: 1 },
  ]),
  async (req, res) => {
    try {
      const { title, description, price, category } = req.body;
      const imageFile = req.files['image'] ? req.files['image'][0] : null;
      const modelFile = req.files['model'] ? req.files['model'][0] : null;

      console.log('[DEBUG] Creating Real NFT:', {
        title,
        description,
        price,
        category,
      });

      if (!imageFile) {
        return res
          .status(400)
          .json({ success: false, message: 'Image file is required' });
      }

      let result = { success: true };

      // 🌐 Real NFT Marketplace: Try IPFS upload via Pinata first
      if (pinata.isAvailable()) {
        console.log('📡 Using IPFS storage (Real NFT Marketplace mode)...');

        try {
          const nftData = {
            title,
            description,
            category,
            imagePath: imageFile.path,
            imageFileName: imageFile.filename,
            modelPath: modelFile ? modelFile.path : null,
            modelFileName: modelFile ? modelFile.filename : null,
            externalUrl: `${req.protocol}://${req.get('host')}`,
          };

          // Upload to IPFS
          console.log('🌐 Uploading to IPFS (permanent storage)...');
          const ipfsResult = await pinata.uploadNFT(nftData);

          // Create NFT on blockchain with IPFS metadata
          if (web3.isReady()) {
            console.log('⛓️ Minting NFT on blockchain...');

            const blockchainResult = await web3.createMarketItem({
              tokenURI: ipfsResult.tokenURI, // Real NFT standard: IPFS metadata URL
              price: parseFloat(price),
              category,
              royalty: 0,
            });

            // Store in marketplace (permanent, shows immediately)
            const nftItem = {
              id: itemCounter++,
              tokenId: blockchainResult.tokenId,
              title,
              description,
              price: parseFloat(price),
              category,
              imageUrl: ipfsResult.imageUrl, // IPFS URL (global, permanent)
              modelUrl: ipfsResult.modelUrl, // IPFS URL (global, permanent)
              tokenURI: ipfsResult.tokenURI, // Metadata IPFS URL
              seller: blockchainResult.seller || 'blockchain-user',
              createdAt: new Date().toISOString(),
              isBlockchain: true,
              isPermanent: true,
              storage: 'ipfs',
              transactionHash: blockchainResult.transactionHash,
              blockNumber: blockchainResult.blockNumber,
              gasUsed: blockchainResult.gasUsed,
            };

            marketplaceItems.push(nftItem);

            result = {
              success: true,
              ...ipfsResult,
              ...blockchainResult,
              message:
                '🎉 Real NFT created! Permanent IPFS storage + Blockchain',
              storage: 'ipfs',
              isPermanent: true,
            };

            console.log('✅ Real NFT marketplace item created successfully!');
          }
        } catch (ipfsError) {
          console.error('❌ IPFS creation failed:', ipfsError.message);
          // Continue to fallback below
        }
      }

      // 📁 Fallback: Local storage (development mode)
      if (!result.storage) {
        console.log('📁 Using local storage (development mode)...');

        const imageUrl = `/uploads/${imageFile.filename}`;
        const modelUrl = modelFile ? `/uploads/${modelFile.filename}` : null;

        // Try blockchain with local URLs
        if (web3.isReady()) {
          try {
            const blockchainResult = await web3.createMarketItem({
              tokenURI: `${req.protocol}://${req.get('host')}${imageUrl}`,
              price: parseFloat(price),
              category,
              royalty: 0,
            });

            const blockchainItem = {
              id: itemCounter++,
              tokenId: blockchainResult.tokenId || Date.now(),
              title,
              description,
              price: parseFloat(price),
              category,
              imageUrl,
              modelUrl,
              seller: blockchainResult.seller || 'blockchain-user',
              createdAt: new Date().toISOString(),
              isBlockchain: true,
              isPermanent: false,
              storage: 'local',
              transactionHash: blockchainResult.transactionHash,
              blockNumber: blockchainResult.blockNumber,
              gasUsed: blockchainResult.gasUsed,
            };

            marketplaceItems.push(blockchainItem);

            result = {
              success: true,
              imageUrl,
              modelUrl,
              ...blockchainResult,
              message: 'NFT created on blockchain (local storage)',
              storage: 'local',
              isPermanent: false,
            };
          } catch (blockchainError) {
            console.error(
              '❌ Blockchain creation failed:',
              blockchainError.message
            );

            // Pure local storage fallback
            const localItem = {
              id: itemCounter++,
              tokenId: Date.now(),
              title,
              description,
              price: parseFloat(price),
              category,
              imageUrl,
              modelUrl,
              seller: 'local-user',
              createdAt: new Date().toISOString(),
              isBlockchain: false,
              isPermanent: false,
              storage: 'local',
            };

            marketplaceItems.push(localItem);

            result = {
              success: true,
              imageUrl,
              modelUrl,
              message: 'NFT created (local storage)',
              storage: 'local',
              isPermanent: false,
            };
          }
        }
      }

  console.log('[DEBUG] NFT created:', result);
  console.log('[DEBUG] marketplaceItems after upload:', JSON.stringify(marketplaceItems, null, 2));
        // Always include tokenId in the response for frontend
        let tokenId = undefined;
        if (result.tokenId) {
          tokenId = result.tokenId;
        } else if (result.transactionHash) {
          // Try to find the last item added to marketplaceItems
          if (marketplaceItems.length > 0) {
            tokenId = marketplaceItems[marketplaceItems.length - 1].tokenId;
          }
        }
        res.json({ ...result, tokenId });
    } catch (error) {
      console.error('❌ NFT creation error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to create NFT',
        error: error.message,
      });
    }
  }
);

// Stats endpoint
app.get('/api/marketplace/stats', async (req, res) => {
  try {
    const stats = {
      totalItems: marketplaceItems.length,
      totalSold: 0,
      totalActive: marketplaceItems.length,
      totalValue: marketplaceItems
        .reduce((sum, item) => sum + (item.price || 0), 0)
        .toString(),
      listingPrice: '0.00025',
      platformFee: '2.5%',
      storage: pinata.isAvailable() ? 'ipfs' : 'local',
    };

    res.json({ success: true, ...stats });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get single item
app.get('/api/marketplace/:id', (req, res) => {
  // Match by tokenId (string or number)
  const paramTokenId = req.params.id;
  const item = marketplaceItems.find(
    item => String(item.tokenId) === String(paramTokenId)
  );
  if (item) {
    res.json({ success: true, data: item });
  } else {
    res.status(404).json({ success: false, error: 'Item not found' });
  }
});

// Start the server
async function startServer() {
  await initializeServices();

  app.listen(PORT, () => {
    console.log('🚀 ChainTorque Backend started!');
    console.log('📍 Environment:', process.env.NODE_ENV || 'development');
    console.log(`🌐 Server running on port ${PORT}`);

    // Display status
    if (web3.isReady()) {
      console.log('⛓️ Web3 Status: Connected ✅');
      console.log('📄 Contract:', web3.contractAddress);
    } else {
      console.log('⛓️ Web3 Status: Disconnected ❌');
    }

    const storageInfo = pinata.getStorageInfo();
    console.log(
      '📦 Storage:',
      storageInfo.type.toUpperCase(),
      storageInfo.permanent ? '✅' : '❌'
    );

    console.log('\n📋 Available endpoints:');
    console.log('   GET  /health');
    console.log('   GET  /api/web3/status');
    console.log('   GET  /api/marketplace');
    console.log('   POST /api/marketplace/create');
    console.log('   GET  /api/marketplace/stats');

    if (pinata.isAvailable()) {
      console.log('\n🌐 REAL NFT MARKETPLACE MODE');
      console.log('✅ IPFS permanent storage');
      console.log('🌍 Global accessibility');
      console.log('💎 True NFT standard');
    } else {
      console.log('\n📁 Development mode (local storage)');
      console.log('⚠️  Add Pinata credentials for real NFT functionality');
    }
  });
}

startServer().catch(console.error);
