const { ethers } = require("ethers");

console.log("🔑 Generating new wallet for deployment...\n");

// Generate a new random wallet
const wallet = ethers.Wallet.createRandom();

console.log("📋 New Wallet Generated:");
console.log("Address:", wallet.address);
console.log("Private Key:", wallet.privateKey);
console.log("\n⚠️  IMPORTANT:");
console.log("1. Save the private key securely!");
console.log("2. Get Mumbai testnet MATIC from: https://mumbaifaucet.com/");
console.log("3. Add this address to the faucet and request test MATIC");
console.log("4. Update your .env file with the new PRIVATE_KEY");
console.log("\n🎯 Mumbai Faucet Instructions:");
console.log("- Go to https://mumbaifaucet.com/");
console.log("- Enter your address:", wallet.address);
console.log("- Request 0.5 MATIC (enough for deployment)");
console.log("- Wait for confirmation (~1-2 minutes)");
