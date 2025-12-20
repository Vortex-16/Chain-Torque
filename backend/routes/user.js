const express = require('express');
const router = express.Router();
const User = require('../models/User');
const MarketItem = require('../models/MarketItem');
const { web3Manager } = require('../web3'); // Ensure this export exists or update web3.js
// Note: We might need to adjust the import of web3 depending on how it's exported.
// In server.js it was `const web3 = new Web3Manager()`. Ideally we should have a singleton export.

// User registration/login endpoint
router.post('/register', async (req, res) => {
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

// Get NFTs owned by a user - Auto-sync
router.get('/:address/nfts', async (req, res) => {
    const userAddress = req.params.address.toLowerCase();

    try {
        // Auto-Sync: Check chain for actual ownership
        if (web3Manager.isReady()) {
            try {
                // Get list of Token IDs owned by user from Smart Contract
                const result = await web3Manager.getUserTokens(userAddress);

                if (result.success && result.tokenIds.length > 0) {
                    console.log(`[Auto-Sync] checking ${result.tokenIds.length} tokens for user ${userAddress}`);

                    for (const tokenId of result.tokenIds) {
                        const item = await MarketItem.findOne({ tokenId: tokenId });

                        // If item exists but DB says owner is someone else (or it's active)
                        if (item && (item.owner.toLowerCase() !== userAddress || item.status === 'active')) {
                            console.log(`[Auto-Sync] correcting ownership for item #${tokenId}`);
                            item.owner = userAddress;
                            item.status = 'sold';
                            if (!item.soldAt) item.soldAt = new Date();
                            await item.save();
                        }
                    }
                }
            } catch (syncError) {
                console.warn('[Auto-Sync] Warning: Failed to sync with blockchain:', syncError.message);
                // Continue to serve DB data even if sync fails
            }
        }

        // Query DB directly
        const userNFTs = await MarketItem.find({
            $or: [
                { owner: userAddress },
                { seller: userAddress }
            ]
        });
        res.json({ success: true, nfts: userNFTs });
    } catch (error) {
        console.error('Error fetching user NFTs:', error.message);
        res.status(404).json({ success: false, error: error.message });
    }
});

// Get user purchases (Transactions + Owned Items)
router.get('/:address/purchases', async (req, res) => {
    const userAddress = req.params.address.toLowerCase();
    try {
        const Transaction = require('../models/Transaction');

        // 1. Get explicit transactions
        const transactions = await Transaction.find({
            buyer: userAddress,
            type: 'purchase',
            status: 'confirmed'
        }).sort({ confirmedAt: -1 }).lean();

        // 2. Get implicit purchases (Items owned but not created by user)
        // This covers cases where transaction sync failed but ownership is correct
        const ownedItems = await MarketItem.find({
            owner: userAddress,
            creator: { $ne: userAddress } // If I own it but didn't create it, I bought it
        }).lean();

        // 3. Merge and Deduplicate
        // Create a map of tokenId -> transaction to check existence
        const txTokenIds = new Set(transactions.map(t => t.tokenId));

        const syntheticTransactions = ownedItems
            .filter(item => !txTokenIds.has(item.tokenId))
            .map(item => ({
                _id: 'synth_' + item._id,
                transactionHash: item.transactionHash || '0x', // Fallback if missing
                tokenId: item.tokenId,
                buyer: userAddress,
                price: item.price,
                status: 'confirmed',
                confirmedAt: item.soldAt || item.updatedAt,
                metadata: {
                    title: item.title,
                    image: item.imageUrl
                },
                isSynthetic: true // Flag for frontend if needed
            }));

        const allPurchases = [...transactions, ...syntheticTransactions]
            .sort((a, b) => new Date(b.confirmedAt) - new Date(a.confirmedAt));

        res.json({ success: true, purchases: allPurchases });
    } catch (error) {
        console.error('Error fetching user purchases:', error.message);
        res.status(500).json({ success: false, error: error.message });
    }
});

module.exports = router;
