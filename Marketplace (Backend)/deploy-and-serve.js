const { ethers } = require("hardhat");
const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

async function deployContract() {
  console.log("🚀 Deploying ChainTorque Marketplace...");

  // Get the contract factory
  const ChainTorqueMarketplace = await ethers.getContractFactory("ChainTorqueMarketplace");
  
  // Deploy the contract
  const marketplace = await ChainTorqueMarketplace.deploy();
  
  // Wait for deployment
  await marketplace.deployed();
  
  console.log("✅ ChainTorque Marketplace deployed to:", marketplace.address);
  console.log("📝 Transaction hash:", marketplace.deployTransaction.hash);

  // Test the contract immediately
  try {
    const listingPrice = await marketplace.getListingPrice();
    console.log("🔍 Listing price:", ethers.utils.formatEther(listingPrice), "ETH");
    console.log("✅ Contract is working properly!");
  } catch (error) {
    console.error("❌ Contract test failed:", error.message);
    return null;
  }

  return marketplace.address;
}

async function startServer(contractAddress) {
  console.log("🚀 Starting backend server...");
  
  // Set the contract address in environment
  process.env.CONTRACT_ADDRESS = contractAddress;
  
  // Start the server
  const serverPath = path.join(__dirname, 'server-simple.js');
  const server = spawn('node', [serverPath], {
    stdio: 'inherit',
    env: { ...process.env, CONTRACT_ADDRESS: contractAddress }
  });

  return server;
}

async function main() {
  try {
    // Deploy contract
    const contractAddress = await deployContract();
    
    if (!contractAddress) {
      console.error("❌ Deployment failed, exiting...");
      process.exit(1);
    }

    console.log("\n🎉 Deployment completed successfully!");
    console.log(`📋 Contract Address: ${contractAddress}`);
    console.log("🚀 Starting server with deployed contract...\n");

    // Start server with the deployed contract
    await startServer(contractAddress);

  } catch (error) {
    console.error("❌ Error:", error);
    process.exit(1);
  }
}

// Handle process termination
process.on('SIGINT', () => {
  console.log('\n🛑 Shutting down...');
  process.exit(0);
});

main();
