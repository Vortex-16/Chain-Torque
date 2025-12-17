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

// Get NFTs owned by a user
router.get('/:address/nfts', async (req, res) => {
    const userAddress = req.params.address;
    try {
        // Query DB directly
        const userNFTs = await MarketItem.find({
            $or: [
                { owner: userAddress.toLowerCase() },
                { seller: userAddress.toLowerCase() }
            ]
        });
        res.json({ success: true, nfts: userNFTs });
    } catch (error) {
        console.error('Error fetching user NFTs:', error.message);
        res.status(404).json({ success: false, error: error.message });
    }
});

module.exports = router;
