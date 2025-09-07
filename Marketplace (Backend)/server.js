// server.js (fixed)

const express = require('express');
const cors = require('cors');
const multer = require('multer');
const fs = require('fs');
const mongoose = require('mongoose');
const Web3Manager = require('./web3');
const path = require('path');
const dotenv = require('dotenv');

// Import models
const User = require('./models/User');
const Transaction = require('./models/Transaction');

// Load environment variables
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
  fileFilter: function (req, file, cb) {
    // Allow all image types for preview images
    if (file.fieldname === 'image') {
      if (file.mimetype.startsWith('image/')) {
        cb(null, true);
      } else {
        cb(new Error('Only image files are allowed for preview images'), false);
      }
    }
    // Restrict model files to browser-editable formats only
    else if (file.fieldname === 'model') {
      const allowedExtensions = ['.glb', '.gltf', '.obj', '.stl'];
      const fileExtension = path.extname(file.originalname).toLowerCase();
      
      if (allowedExtensions.includes(fileExtension)) {
        cb(null, true);
      } else {
        cb(new Error(`File type ${fileExtension} not supported. Only GLB, GLTF, OBJ, and STL files are allowed for browser-based CAD editing.`), false);
      }
    }
    // Allow other fields
    else {
      cb(null, true);
    }
  },
});

// Initialize services
const web3 = new Web3Manager();
const { uploadFile, uploadMetadata } = require('./services/lighthouseStorage');

// MongoDB connection
async function connectDatabase() {
  try {
    const mongoUri = process.env.MONGODB_URI;
    if (!mongoUri) {
      throw new Error('MONGODB_URI not found in environment variables');
    }
    
    console.log('🔗 Connecting to MongoDB Atlas...');
    await mongoose.connect(mongoUri);
    console.log('MongoDB Atlas connected successfully');
  } catch (error) {
    console.error('MongoDB connection failed:', error.message);
    console.log('Continuing without database - some features will be disabled');
    // Don't throw error - continue without database for now
  }
}

// In-memory marketplace (will be replaced by database queries)
let marketplaceItems = [];
let itemCounter = 1;
// Initialize only Web3 and load existing NFTs from chain if available
async function initializeServices() {
  try {
    await connectDatabase();
    await web3.initialize();
    await loadExistingNFTs();
  } catch (error) {
    console.error('Service initialization failed:', error.message);
  }
}

// Load NFTs from blockchain (adds them to in-memory marketplaceItems)
async function loadExistingNFTs() {
  try {
    if (!web3.isReady()) {
      return;
    }

    const result = await web3.getMarketItems();
    if (result.success && Array.isArray(result.items) && result.items.length > 0) {
      for (const blockchainItem of result.items) {
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
          blockNumber: blockchainItem.blockNumber,
        };
        marketplaceItems.push(marketItem);
      }
    }
  } catch (error) {
    console.error('Failed to load existing NFTs:', error.message);
  }
}

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
  try {
    if (web3.isReady()) {
      const response = {
        success: true,
        connected: true,
        chainId: 31337,
        contractAddress: web3.contractAddress,
        contractDeployed: true,
        signerAddress: web3.signer?.address || null,
        balance: null,
        listingPrice: web3.getContractConstants().LISTING_PRICE,
        message: 'Web3 connected',
      };
      res.json(response);
    } else {
      res.json({
        success: false,
        connected: false,
        contractDeployed: false,
        message: 'Web3 not initialized',
      });
    }
  } catch (error) {
    console.error('Web3 status error:', error.message);
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
  try {
    res.json({
      success: true,
      data: marketplaceItems,
      total: marketplaceItems.length,
      source: 'blockchain',
    });
  } catch (error) {
    console.error('Marketplace fetch error:', error.message);
    res.status(500).json({
      success: false,
      message: 'Server error fetching marketplace items',
      error: error.message,
    });
  }
});

// Create marketplace item - upload to IPFS and mint on-chain
app.post(
  '/api/marketplace/create',
  upload.fields([
    { name: 'image', maxCount: 10 },
    { name: 'model', maxCount: 1 },
  ]),
  async (req, res) => {
    try {
  const { title, description, price, category, username, walletAddress } = req.body;
      console.log('DEBUG: Received username from req.body:', username);
      const imageFiles = req.files?.image || [];
      const modelFile = req.files?.model ? req.files.model[0] : null;

      if (!imageFiles.length) {
        return res.status(400).json({ success: false, message: 'At least one image file is required' });
      }

      if (!web3.isReady()) {
        throw new Error('Web3 not ready. Cannot mint NFT.');
      }

      // Upload images
      const imageUploads = [];
      for (const img of imageFiles) {
        const uploaded = await uploadFile(img.path);
        imageUploads.push(uploaded.url);
      }

      // Upload model if present
      let modelUpload = { cid: '', url: '' };
      if (modelFile) {
        modelUpload = await uploadFile(modelFile.path);
      }

      // Create metadata and upload
      const metadata = {
        name: title,
        description,
        image: imageUploads[0],
        images: imageUploads,
        animation_url: modelUpload.url,
        external_url: `${req.protocol}://${req.get('host')}`,
        attributes: [
          { trait_type: 'Category', value: category },
          { trait_type: 'File Type', value: modelFile ? path.extname(modelFile.originalname).toUpperCase() : '' },
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

      const metadataUpload = await uploadMetadata(metadata);

      const ipfsResult = {
        tokenURI: metadataUpload.url,
        imageUrl: imageUploads[0],
        images: imageUploads,
        modelUrl: modelUpload.url,
        metadataUrl: metadataUpload.url,
      };

      // Mint NFT on blockchain
      const blockchainResult = await web3.createMarketItem({
        tokenURI: ipfsResult.tokenURI,
        price: parseFloat(price),
        category,
        royalty: 0,
      });

      let tokenId = blockchainResult.tokenId;
      if (!tokenId && marketplaceItems.length > 0) {
        tokenId = marketplaceItems[marketplaceItems.length - 1].tokenId + 1;
      }
      if (!tokenId) tokenId = itemCounter;

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
        seller: walletAddress || blockchainResult.seller || 'blockchain-user',
        username: username || 'Unknown Creator',
        createdAt: new Date().toISOString(),
        isBlockchain: true,
        isPermanent: true,
        storage: 'ipfs',
        transactionHash: blockchainResult.transactionHash,
        blockNumber: blockchainResult.blockNumber,
        gasUsed: blockchainResult.gasUsed,
      };

      marketplaceItems.push(nftItem);

      res.json({
        success: true,
        ...ipfsResult,
        ...blockchainResult,
        message: 'Real NFT created: IPFS + Blockchain',
        storage: 'ipfs',
        isPermanent: true,
        tokenId,
      });
    } catch (error) {
      console.error('NFT creation error:', error.message || error);
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
      totalValue: marketplaceItems.reduce((sum, item) => sum + (item.price || 0), 0).toString(),
      listingPrice: web3.getContractConstants().LISTING_PRICE,
      platformFee: `${web3.getContractConstants().PLATFORM_FEE_PERCENTAGE}%`,
      storage: 'ipfs',
    };

    res.json({ success: true, ...stats });
  } catch (error) {
    console.error('Marketplace stats error:', error.message);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get NFTs owned by a user
app.get('/api/user/:address/nfts', async (req, res) => {
  const userAddress = req.params.address;
  try {
    if (!web3.isReady()) throw new Error('Web3 not initialized');
    // Fetch token IDs for user
    const result = await web3.getUserTokens(userAddress);
    if (!result.success) throw new Error(result.error || 'Could not fetch user tokens');
    // Find items in marketplaceItems matching user's tokenIds, seller, or owner
    const userNFTs = marketplaceItems.filter(item => {
      return result.tokenIds.includes(item.tokenId) ||
        (item.seller && item.seller.toLowerCase() === userAddress.toLowerCase()) ||
        (item.owner && item.owner.toLowerCase() === userAddress.toLowerCase());
    });
    res.json({ success: true, nfts: userNFTs });
  } catch (error) {
    console.error('Error fetching user NFTs:', error.message);
    res.status(404).json({ success: false, error: error.message });
  }
});

// Get wallet balance for a user
app.get('/api/web3/balance/:address', async (req, res) => {
  const userAddress = req.params.address;
  try {
    if (!web3.isReady()) throw new Error('Web3 not initialized');
    // Use ethers to get balance
    const balance = await web3.provider.getBalance(userAddress);
    res.json({ success: true, address: userAddress, balance: require('ethers').utils.formatEther(balance) });
  } catch (error) {
    console.error('Error fetching balance:', error.message);
    res.status(404).json({ success: false, error: error.message });
  }
});

// Get single item by tokenId
app.get('/api/marketplace/:id', (req, res) => {
  const paramTokenId = req.params.id;
  const item = marketplaceItems.find(item => String(item.tokenId) === String(paramTokenId));
  if (item) {
    res.json({ success: true, data: item });
  } else {
    res.status(404).json({ success: false, error: 'Item not found' });
  }
});

// User registration/login endpoint
app.post('/api/user/register', async (req, res) => {
  try {
    const { walletAddress, username, email } = req.body;

    if (!walletAddress) {
      return res.status(400).json({ success: false, message: 'Wallet address is required' });
    }

    // Check if user already exists
    let user = await User.findByWallet(walletAddress);
    
    if (!user) {
      // Create new user
      user = new User({
        walletAddress: walletAddress.toLowerCase(),
        username,
        email,
        lastActive: new Date()
      });
      await user.save();
    } else {
      // Update last active
      await user.updateLastActive();
    }

    res.json({
      success: true,
      user: {
        walletAddress: user.walletAddress,
        username: user.username,
        displayName: user.displayName,
        avatar: user.avatar,
        stats: user.stats,
        isVerified: user.isVerified
      }
    });
  } catch (error) {
    console.error('User registration error:', error.message);
    res.status(500).json({ success: false, message: 'User registration failed', error: error.message });
  }
});

// Purchase NFT endpoint
app.post('/api/marketplace/purchase', async (req, res) => {
  try {
    const { tokenId, buyerAddress, price } = req.body;

    if (!tokenId || !buyerAddress || !price) {
      return res.status(400).json({ 
        success: false, 
        message: 'Missing required fields: tokenId, buyerAddress, price' 
      });
    }

    if (!web3.isReady()) {
      throw new Error('Web3 not ready. Cannot process purchase.');
    }

    // Find the marketplace item
    const item = marketplaceItems.find(item => String(item.tokenId) === String(tokenId));
    if (!item) {
      return res.status(404).json({ success: false, message: 'Item not found' });
    }

    if (item.seller.toLowerCase() === buyerAddress.toLowerCase()) {
      return res.status(400).json({ success: false, message: 'Cannot buy your own item' });
    }

    // Get or create buyer user
    let buyer = await User.findByWallet(buyerAddress);
    if (!buyer) {
      buyer = new User({
        walletAddress: buyerAddress.toLowerCase(),
        lastActive: new Date()
      });
      await buyer.save();
    }

    // Get or create seller user
    let seller = await User.findByWallet(item.seller);
    if (!seller) {
      seller = new User({
        walletAddress: item.seller.toLowerCase(),
        isCreator: true,
        lastActive: new Date()
      });
      await seller.save();
    }

    // Execute blockchain purchase
    const blockchainResult = await web3.purchaseToken(tokenId, price);

    if (!blockchainResult.success) {
      throw new Error(blockchainResult.error || 'Blockchain purchase failed');
    }

    // Create transaction record
    const transaction = new Transaction({
      transactionHash: blockchainResult.transactionHash,
      blockNumber: blockchainResult.blockNumber,
      tokenId: parseInt(tokenId),
      contractAddress: web3.contractAddress,
      type: 'purchase',
      price: parseFloat(price),
      currency: 'ETH',
      buyer: buyerAddress.toLowerCase(),
      seller: item.seller.toLowerCase(),
      gasUsed: blockchainResult.gasUsed,
      gasPrice: blockchainResult.gasPrice,
      platformFee: parseFloat(price) * 0.025, // 2.5% platform fee
      royaltyFee: parseFloat(price) * 0.075,  // 7.5% creator royalty
      metadata: {
        tokenURI: item.tokenURI,
        title: item.title,
        description: item.description,
        category: item.category,
        imageUrl: item.imageUrl,
        modelUrl: item.modelUrl
      },
      status: 'confirmed',
      confirmations: 1,
      confirmedAt: new Date()
    });

    await transaction.save();

    // Update user statistics
    await buyer.incrementStat('totalPurchased', 1);
    await buyer.incrementStat('totalSpent', parseFloat(price));
    
    await seller.incrementStat('totalSold', 1);
    await seller.incrementStat('totalEarned', parseFloat(price) * 0.925); // After platform fee

    // Update marketplace item
    const itemIndex = marketplaceItems.findIndex(item => String(item.tokenId) === String(tokenId));
    if (itemIndex !== -1) {
      marketplaceItems[itemIndex].owner = buyerAddress.toLowerCase();
      marketplaceItems[itemIndex].seller = null;
      marketplaceItems[itemIndex].status = 'sold';
      marketplaceItems[itemIndex].soldAt = new Date().toISOString();
    }

    res.json({
      success: true,
      transactionHash: blockchainResult.transactionHash,
      blockNumber: blockchainResult.blockNumber,
      tokenId: parseInt(tokenId),
      buyer: buyerAddress.toLowerCase(),
      seller: item.seller.toLowerCase(),
      price: parseFloat(price),
      platformFee: parseFloat(price) * 0.025,
      royaltyFee: parseFloat(price) * 0.075,
      gasUsed: blockchainResult.gasUsed,
      message: 'Purchase completed successfully',
      transaction: {
        id: transaction._id,
        status: transaction.status,
        createdAt: transaction.createdAt
      }
    });

  } catch (error) {
    console.error('Purchase error:', error.message);
    res.status(500).json({
      success: false,
      message: 'Purchase failed',
      error: error.message
    });
  }
});

// Get user's purchase history
app.get('/api/user/:address/purchases', async (req, res) => {
  try {
    const userAddress = req.params.address.toLowerCase();
    
    const purchases = await Transaction.find({
      buyer: userAddress,
      type: 'purchase',
      status: 'confirmed'
    }).sort({ createdAt: -1 }).limit(50);

    res.json({
      success: true,
      purchases: purchases.map(tx => ({
        transactionHash: tx.transactionHash,
        tokenId: tx.tokenId,
        price: tx.price,
        currency: tx.currency,
        seller: tx.seller,
        platformFee: tx.platformFee,
        royaltyFee: tx.royaltyFee,
        metadata: tx.metadata,
        createdAt: tx.createdAt,
        confirmedAt: tx.confirmedAt
      }))
    });

  } catch (error) {
    console.error('Error fetching purchase history:', error.message);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get user's sales history
app.get('/api/user/:address/sales', async (req, res) => {
  try {
    const userAddress = req.params.address.toLowerCase();
    
    const sales = await Transaction.find({
      seller: userAddress,
      type: 'purchase',
      status: 'confirmed'
    }).sort({ createdAt: -1 }).limit(50);

    res.json({
      success: true,
      sales: sales.map(tx => ({
        transactionHash: tx.transactionHash,
        tokenId: tx.tokenId,
        price: tx.price,
        currency: tx.currency,
        buyer: tx.buyer,
        platformFee: tx.platformFee,
        royaltyFee: tx.royaltyFee,
        netEarnings: tx.price - tx.platformFee - tx.royaltyFee,
        metadata: tx.metadata,
        createdAt: tx.createdAt,
        confirmedAt: tx.confirmedAt
      }))
    });

  } catch (error) {
    console.error('Error fetching sales history:', error.message);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get user profile with stats
app.get('/api/user/:address/profile', async (req, res) => {
  try {
    const userAddress = req.params.address.toLowerCase();
    
    const user = await User.findByWallet(userAddress);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    res.json({
      success: true,
      user: {
        walletAddress: user.walletAddress,
        username: user.username,
        displayName: user.displayName,
        bio: user.bio,
        avatar: user.avatar,
        website: user.website,
        social: user.social,
        stats: user.stats,
        isVerified: user.isVerified,
        isCreator: user.isCreator,
        firstTransactionDate: user.firstTransactionDate,
        lastActive: user.lastActive,
        followerCount: user.followerCount,
        followingCount: user.followingCount
      }
    });

  } catch (error) {
    console.error('Error fetching user profile:', error.message);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Update user profile
app.put('/api/user/:address/profile', async (req, res) => {
  try {
    const userAddress = req.params.address.toLowerCase();
    const { username, displayName, bio, website, social } = req.body;
    
    const user = await User.findByWallet(userAddress);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // Update fields if provided
    if (username !== undefined) user.username = username;
    if (displayName !== undefined) user.displayName = displayName;
    if (bio !== undefined) user.bio = bio;
    if (website !== undefined) user.website = website;
    if (social !== undefined) user.social = { ...user.social, ...social };

    await user.save();

    res.json({
      success: true,
      message: 'Profile updated successfully',
      user: {
        walletAddress: user.walletAddress,
        username: user.username,
        displayName: user.displayName,
        bio: user.bio,
        avatar: user.avatar,
        website: user.website,
        social: user.social
      }
    });

  } catch (error) {
    console.error('Error updating user profile:', error.message);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get marketplace analytics
app.get('/api/marketplace/analytics', async (req, res) => {
  try {
    const stats = await Transaction.getMarketplaceStats();
    const topCreators = await User.getTopCreators(10);
    const activeUsers = await User.getActiveUsers(30, 20);

    res.json({
      success: true,
      analytics: {
        marketplace: stats[0] || {
          totalSales: 0,
          totalVolume: 0,
          averagePrice: 0,
          totalFees: 0
        },
        topCreators,
        activeUsers,
        totalItems: marketplaceItems.length,
        totalUsers: await User.countDocuments(),
        totalTransactions: await Transaction.countDocuments()
      }
    });

  } catch (error) {
    console.error('Error fetching analytics:', error.message);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Start server
async function startServer() {
  await initializeServices();

  app.listen(PORT, () => {
    console.log(`ChainTorque Backend started on port ${PORT} (${process.env.NODE_ENV || 'development'})`);
  });
}

startServer().catch(err => {
  console.error('Failed to start server:', err.message || err);
  process.exit(1);
});
