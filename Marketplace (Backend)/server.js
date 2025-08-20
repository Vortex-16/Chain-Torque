const express = require('express');
const cors = require('cors');
const multer = require('multer');
const fs = require('fs');
const Web3Manager = require('./web3');
const path = require('path');
const dotenv = require('dotenv');
// Always load .env from monorepo root
dotenv.config({ path: path.resolve(__dirname, '../.env') });

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
const { uploadFile, uploadMetadata } = require('./services/lighthouseStorage');
let marketplaceItems = [];
let itemCounter = 1;

// Initialize Web3 only
async function initializeServices() {
  console.log('🔗 Initializing services...');
  try {
    await web3.initialize();
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
    const { uploadFile, uploadMetadata } = require('./services/lighthouseStorage');
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
    source: 'blockchain',
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
    { name: 'image', maxCount: 10 }, // Allow up to 10 images
    { name: 'model', maxCount: 1 },
  ]),
  async (req, res) => {
    try {
      const { title, description, price, category } = req.body;
  const imageFiles = req.files['image'] || [];
  const modelFile = req.files['model'] ? req.files['model'][0] : null;

      console.log('[DEBUG] Creating Real NFT:', {
        title,
        description,
        price,
        category,
      });

      if (!imageFiles.length) {
        return res
          .status(400)
          .json({ success: false, message: 'At least one image file is required' });
      }

      let result = { success: true };


      // Enforce IPFS + blockchain minting for every upload
      // IPFS upload will be handled by another service
      if (!web3.isReady()) {
        throw new Error('Web3 not ready. Cannot mint NFT.');
      }
      // No need for nftData or imageFile references anymore

      // Upload all images to Lighthouse
      console.log('🌐 Uploading images to Lighthouse...');
      const imageUploads = [];
      for (const img of imageFiles) {
        const uploaded = await uploadFile(img.path);
        imageUploads.push(uploaded.url);
      }
      let modelUpload = { cid: '', url: '' };
      if (modelFile) {
        console.log('🌐 Uploading model to Lighthouse...');
        modelUpload = await uploadFile(modelFile.path);
      }

      // Create NFT metadata (OpenSea standard)
      const metadata = {
        name: title,
        description,
        image: imageUploads[0], // OpenSea expects a single image field
        images: imageUploads, // Custom field for all images
        animation_url: modelUpload.url,
        external_url: `${req.protocol}://${req.get('host')}`,
        attributes: [
          { trait_type: 'Category', value: category },
          { trait_type: 'File Type', value: modelFile ? path.extname(modelFile.filename).toUpperCase() : '' },
          { trait_type: 'Created', value: new Date().toISOString().split('T')[0] },
          { trait_type: 'Marketplace', value: 'ChainTorque' },
        ],
        properties: {
          category,
          files: [
            ...imageUploads.map(url => ({ uri: url, type: 'image' })),
            ...(modelFile ? [{ uri: modelUpload.url, type: 'model' }] : []),
          ],
        },
      };
      console.log('📋 Uploading metadata to Lighthouse...');
      const metadataUpload = await uploadMetadata(metadata);

      const ipfsResult = {
        success: true,
        tokenURI: metadataUpload.url,
        imageUrl: imageUploads[0],
        images: imageUploads,
        modelUrl: modelUpload.url,
        metadataUrl: metadataUpload.url,
      };
      // Mint NFT on blockchain
      console.log('⛓️ Minting NFT on blockchain...');
      const blockchainResult = await web3.createMarketItem({
        tokenURI: ipfsResult.tokenURI,
        price: parseFloat(price),
        category,
        royalty: 0,
      });
      // Store in marketplace (permanent, shows immediately)
      let tokenId = blockchainResult.tokenId;
      // Fallback: try to get tokenId from last item if not set
      if (!tokenId && marketplaceItems.length > 0) {
        tokenId = marketplaceItems[marketplaceItems.length - 1].tokenId + 1;
      }
      // Fallback: use itemCounter if still not set
      if (!tokenId) {
        tokenId = itemCounter;
      }
      const nftItem = {
        id: itemCounter++,
        tokenId,
        title,
        description,
        price: parseFloat(price),
        category,
        imageUrl: ipfsResult.imageUrl,
        images: ipfsResult.images,
        modelUrl: ipfsResult.modelUrl,
        tokenURI: ipfsResult.tokenURI,
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
        message: '🎉 Real NFT created! Permanent IPFS storage + Blockchain',
        storage: 'ipfs',
        isPermanent: true,
        tokenId,
      };
      console.log('✅ Real NFT marketplace item created successfully!');

      console.log('[DEBUG] NFT created:', result);
      console.log('[DEBUG] marketplaceItems after upload:', JSON.stringify(marketplaceItems, null, 2));
      res.json(result);
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
  storage: 'ipfs',
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

  console.log('📦 Storage: IPFS (Lighthouse) ✅');

    console.log('\n📋 Available endpoints:');
    console.log('   GET  /health');
    console.log('   GET  /api/web3/status');
    console.log('   GET  /api/marketplace');
    console.log('   POST /api/marketplace/create');
    console.log('   GET  /api/marketplace/stats');

  console.log('\n📁 Development mode (local storage)');
  });
}

startServer().catch(console.error);
