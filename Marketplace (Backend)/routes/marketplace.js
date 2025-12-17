const express = require('express');
const router = express.Router();
const path = require('path');
const MarketItem = require('../models/MarketItem');
const Transaction = require('../models/Transaction');
const User = require('../models/User');
const upload = require('../middleware/upload');
const { web3Manager: web3 } = require('../web3'); // Using singleton
const { uploadFile, uploadMetadata } = require('../services/lighthouseStorage');

// Marketplace items endpoint
router.get('/', async (req, res) => {
    try {
        // Fetch from MongoDB
        const items = await MarketItem.find({ status: 'active' }).sort({ createdAt: -1 });

        res.json({
            success: true,
            data: items,
            total: items.length,
            source: 'database',
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

// Create marketplace item
router.post(
    '/create',
    upload.fields([
        { name: 'image', maxCount: 10 },
        { name: 'model', maxCount: 1 },
    ]),
    async (req, res) => {
        try {
            const { title, description, price, category, username, walletAddress } = req.body;
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

            const newItem = new MarketItem({
                tokenId,
                title,
                description,
                price: parseFloat(price),
                category,
                imageUrl: ipfsResult.imageUrl,
                images: ipfsResult.images,
                modelUrl: ipfsResult.modelUrl,
                tokenURI: ipfsResult.tokenURI,
                seller: walletAddress ? walletAddress.toLowerCase() : (blockchainResult.seller ? blockchainResult.seller.toLowerCase() : 'unknown'),
                username: username || 'Unknown Creator',
                createdAt: new Date(),
                isPermanent: true,
                storage: 'ipfs',
                transactionHash: blockchainResult.transactionHash,
                blockNumber: blockchainResult.blockNumber,
                status: 'active'
            });

            await newItem.save();

            res.json({
                success: true,
                ...ipfsResult,
                ...blockchainResult,
                message: 'NFT Created & Saved to DB',
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
router.get('/stats', async (req, res) => {
    try {
        const totalItems = await MarketItem.countDocuments({ status: 'active' });
        const totalSold = await MarketItem.countDocuments({ status: 'sold' });

        const valueAgg = await MarketItem.aggregate([
            { $match: { status: 'active' } },
            { $group: { _id: null, total: { $sum: '$price' } } }
        ]);
        const totalValue = valueAgg.length > 0 ? valueAgg[0].total : 0;

        const stats = {
            totalItems,
            totalSold,
            totalActive: totalItems,
            totalValue: totalValue.toString(),
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

// Single Item
router.get('/:id', async (req, res) => {
    const paramTokenId = req.params.id;
    try {
        const item = await MarketItem.findOne({ tokenId: paramTokenId });
        if (item) {
            res.json({ success: true, data: item });
        } else {
            res.status(404).json({ success: false, error: 'Item not found' });
        }
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// Sync Purchase
router.post('/sync-purchase', async (req, res) => {
    try {
        const { tokenId, transactionHash, buyerAddress, price } = req.body;

        if (!tokenId || !transactionHash || !buyerAddress) {
            return res.status(400).json({ success: false, message: 'Missing required fields' });
        }

        console.log(`Syncing purchase for Token ID ${tokenId} (Tx: ${transactionHash})`);

        const receipt = await web3.provider.getTransactionReceipt(transactionHash);
        if (!receipt) {
            console.warn('Transaction receipt not found immediately.');
        }

        const item = await MarketItem.findOne({ tokenId: tokenId });

        if (!item) {
            return res.status(404).json({ success: false, message: 'Item not found in DB' });
        }

        item.owner = buyerAddress.toLowerCase();
        item.seller = null;
        item.status = 'sold';
        item.soldAt = new Date();
        await item.save();

        const transaction = new Transaction({
            transactionHash: transactionHash,
            blockNumber: receipt ? receipt.blockNumber : 0,
            tokenId: parseInt(tokenId),
            contractAddress: web3.contractAddress,
            type: 'purchase',
            price: parseFloat(price || item.price),
            currency: 'ETH',
            buyer: buyerAddress.toLowerCase(),
            seller: item.seller ? item.seller.toLowerCase() : 'unknown',
            status: 'confirmed',
            metadata: {
                tokenURI: item.tokenURI,
                title: item.title,
                category: item.category,
                imageUrl: item.imageUrl
            },
            confirmedAt: new Date()
        });

        await transaction.save();

        let buyer = await User.findByWallet(buyerAddress);
        if (!buyer) {
            buyer = new User({ walletAddress: buyerAddress.toLowerCase() });
            await buyer.save();
        }
        await buyer.incrementStat('totalPurchased', 1);
        await buyer.incrementStat('totalSpent', parseFloat(price || item.price));

        if (item.seller) {
            let seller = await User.findByWallet(item.seller);
            if (seller) {
                await seller.incrementStat('totalSold', 1);
                await seller.incrementStat('totalEarned', parseFloat(price || item.price) * 0.975);
            }
        }

        res.json({ success: true, message: 'Purchase synced successfully' });

    } catch (error) {
        console.error('Sync error:', error.message);
        res.status(500).json({ success: false, error: error.message });
    }
});

// Legacy Purchase
router.post('/purchase', async (req, res) => {
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

        const item = await MarketItem.findOne({ tokenId });
        if (!item) {
            return res.status(404).json({ success: false, message: 'Item not found' });
        }

        if (item.seller.toLowerCase() === buyerAddress.toLowerCase()) {
            return res.status(400).json({ success: false, message: 'Cannot buy your own item' });
        }

        let buyer = await User.findByWallet(buyerAddress);
        if (!buyer) {
            buyer = new User({
                walletAddress: buyerAddress.toLowerCase(),
                lastActive: new Date()
            });
            await buyer.save();
        }

        let seller = await User.findByWallet(item.seller);
        if (!seller) {
            seller = new User({
                walletAddress: item.seller.toLowerCase(),
                isCreator: true,
                lastActive: new Date()
            });
            await seller.save();
        }

        const blockchainResult = await web3.purchaseToken(tokenId, price);

        if (!blockchainResult.success) {
            throw new Error(blockchainResult.error || 'Blockchain purchase failed');
        }

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
            status: 'confirmed',
            metadata: {
                tokenURI: item.tokenURI,
                title: item.title,
                category: item.category,
                imageUrl: item.imageUrl
            },
            confirmedAt: new Date()
        });

        await transaction.save();

        item.owner = buyerAddress.toLowerCase();
        item.seller = null;
        item.status = 'sold';
        await item.save();

        await buyer.incrementStat('totalPurchased', 1);
        await buyer.incrementStat('totalSpent', parseFloat(price));
        await seller.incrementStat('totalSold', 1);
        await seller.incrementStat('totalEarned', parseFloat(price) * 0.975);

        res.json({
            success: true,
            ...blockchainResult,
            message: 'Purchase successful (Legacy Mode)',
        });
    } catch (error) {
        console.error('Purchase error:', error.message);
        res.status(500).json({ success: false, message: 'Purchase failed', error: error.message });
    }
});

module.exports = router;
