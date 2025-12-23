const mongoose = require('mongoose');
require('dotenv').config();

async function cleanDatabase() {
    console.log('🧹 Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    console.log('\n🗑️  Dropping collections...');

    const collections = ['marketitems', 'transactions', 'users'];

    for (const name of collections) {
        try {
            await mongoose.connection.db.dropCollection(name);
            console.log(`   ✅ Dropped: ${name}`);
        } catch (e) {
            if (e.code === 26) {
                console.log(`   ⚠️  ${name} doesn't exist (skipping)`);
            } else {
                console.error(`   ❌ Error dropping ${name}:`, e.message);
            }
        }
    }

    console.log('\n✅ Database cleaned!');
    await mongoose.disconnect();
    process.exit(0);
}

cleanDatabase().catch(err => {
    console.error('Error:', err);
    process.exit(1);
});
