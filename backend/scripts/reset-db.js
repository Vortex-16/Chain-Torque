const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

// Load env vars from root directory
dotenv.config({ path: path.join(__dirname, '../../.env') });

const MarketItem = require('../models/MarketItem');
const Transaction = require('../models/Transaction');
// We generally keep Users so you don't have to re-auth, but you can uncomment to wipe users too
const User = require('../models/User');

async function resetDatabase() {
    try {
        const mongoUri = process.env.MONGODB_URI;
        if (!mongoUri) {
            throw new Error('MONGODB_URI is not defined in .env');
        }

        console.log('🔗 Connecting to MongoDB...');
        await mongoose.connect(mongoUri);
        console.log('✅ Connected.');

        // 1. Clear Market Items
        const deleteItems = await MarketItem.deleteMany({});
        console.log(`🗑️  Deleted ${deleteItems.deletedCount} Market Items.`);

        // 2. Clear Transactions
        const deleteTx = await Transaction.deleteMany({});
        console.log(`🗑️  Deleted ${deleteTx.deletedCount} Transactions.`);

        // Optional: Clear Users (Uncomment if "Everything" truly means EVERYTHING)
        // const deleteUsers = await User.deleteMany({});
        // console.log(`🗑️  Deleted ${deleteUsers.deletedCount} Users.`);

        console.log('✨ Database successfully cleaned.');
        process.exit(0);
    } catch (error) {
        console.error('❌ Error resetting database:', error);
        process.exit(1);
    }
}

resetDatabase();
