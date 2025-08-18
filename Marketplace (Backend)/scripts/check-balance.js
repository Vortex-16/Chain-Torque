const { ethers } = require("ethers");
require("dotenv").config();

async function checkBalance() {
  try {
    console.log("🔍 Checking wallet balance before deployment...\n");
    
    // Connect to Mumbai testnet
    const provider = new ethers.providers.JsonRpcProvider(
      process.env.POLYGON_MUMBAI_RPC || "https://polygon-mumbai.g.alchemy.com/v2/demo"
    );
    
    // Create wallet instance
    if (!process.env.PRIVATE_KEY) {
      console.log("❌ No PRIVATE_KEY found in .env file");
      return false;
    }
    
    const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
    const address = wallet.address;
    
    console.log("📋 Wallet Information:");
    console.log("Address:", address);
    
    // Check balance
    const balance = await provider.getBalance(address);
    const balanceInMatic = ethers.utils.formatEther(balance);
    
    console.log("Balance:", balanceInMatic, "MATIC");
    
    // Check if we have enough for deployment (minimum 0.1 MATIC)
    const minBalance = ethers.utils.parseEther("0.1");
    
    if (balance.lt(minBalance)) {
      console.log("\n❌ Insufficient balance for deployment!");
      console.log("⚠️  You need at least 0.1 MATIC to deploy the contract");
      console.log("💰 Get test MATIC from: https://mumbaifaucet.com/");
      console.log("🎯 Enter your address:", address);
      return false;
    }
    
    console.log("\n✅ Balance sufficient for deployment!");
    
    // Check network
    const network = await provider.getNetwork();
    console.log("🌐 Network:", network.name, "(Chain ID:", network.chainId + ")");
    
    if (network.chainId !== 80001) {
      console.log("⚠️  Warning: Not connected to Mumbai testnet (expected chain ID: 80001)");
    }
    
    return true;
    
  } catch (error) {
    console.error("❌ Error checking balance:", error.message);
    return false;
  }
}

// Run the balance check
checkBalance()
  .then((success) => {
    if (success) {
      console.log("\n🚀 Ready for deployment! Run:");
      console.log("npm run deploy");
    } else {
      console.log("\n⏸️  Please get test MATIC first, then try again");
    }
    process.exit(success ? 0 : 1);
  })
  .catch((error) => {
    console.error("❌ Script failed:", error);
    process.exit(1);
  });
