const { ethers } = require('hardhat');
const fs = require('fs');

async function main() {
  console.log('🚀 Deploying ChainTorque Marketplace (Optimized Version)...\n');

  // Get the contract factory
  const ChainTorqueMarketplace = await ethers.getContractFactory(
    'ChainTorqueMarketplace'
  );

  // Deploy the contract
  console.log('📦 Deploying contract...');
  const marketplace = await ChainTorqueMarketplace.deploy();

  // Wait for deployment to complete (using v5 API for hardhat-ethers v2)
  await marketplace.deployed();
  const address = marketplace.address;

  console.log('✅ ChainTorque Marketplace deployed successfully!');
  console.log(`📍 Contract Address: ${address}`);

  // Get deployment info
  const deploymentTxHash = marketplace.deployTransaction.hash;
  console.log(`🔗 Deployment Transaction: ${deploymentTxHash}`);

  // Get contract constants for verification
  const listingPrice = await marketplace.getListingPrice();
  const currentTokenId = await marketplace.getCurrentTokenId();

  console.log('\n📊 Contract Configuration:');
  console.log(
    `💰 Listing Price: ${ethers.utils.formatEther(listingPrice)} ETH`
  );
  console.log(`🔢 Current Token ID: ${currentTokenId}`);
  console.log(`📏 Max Batch Size: 50`);
  console.log(`💳 Platform Fee: 2.5%`);

  // Save deployment info
  const deploymentInfo = {
    ChainTorqueMarketplace: address,
    deploymentTransaction: deploymentTxHash,
    network: 'hardhat',
    chainId: 31337,
    listingPrice: ethers.utils.formatEther(listingPrice),
    deployedAt: new Date().toISOString(),
  };

  fs.writeFileSync(
    'contract-address.json',
    JSON.stringify(deploymentInfo, null, 2)
  );
  console.log('\n💾 Contract address saved to contract-address.json');

  // Get the deployer account info
  const [deployer] = await ethers.getSigners();
  const deployerBalance = await ethers.provider.getBalance(deployer.address);

  console.log('\n👤 Deployer Info:');
  console.log(`📍 Address: ${deployer.address}`);
  console.log(`💰 Balance: ${ethers.utils.formatEther(deployerBalance)} ETH`);

  // Authorize the deployer as a creator (for testing)
  console.log('\n🔐 Setting up initial permissions...');
  const authTx = await marketplace.setCreatorAuthorization(
    deployer.address,
    true
  );
  await authTx.wait();
  console.log(`✅ Deployer authorized as creator`);

  // Verify the contract is working
  console.log('\n🧪 Running basic contract verification...');
  try {
    const isAuthorized = await marketplace.isAuthorizedCreator(
      deployer.address
    );
    const stats = await marketplace.getMarketplaceStats();

    console.log(`✅ Creator Authorization: ${isAuthorized}`);
    console.log(`✅ Total Items: ${stats.totalItems}`);
    console.log(`✅ Total Sold: ${stats.totalSold}`);
    console.log(`✅ Total Active: ${stats.totalActive}`);
    console.log(
      `✅ Total Value: ${ethers.utils.formatEther(stats.totalValue)} ETH`
    );

    console.log('\n🎉 Deployment completed successfully!');
    console.log('🔗 Ready for Web3 integration testing');
  } catch (error) {
    console.error('❌ Contract verification failed:', error.message);
    throw error;
  }
}

// Handle deployment errors
main()
  .then(() => {
    console.log('\n🏁 Deployment script completed successfully!');
    process.exit(0);
  })
  .catch(error => {
    console.error('\n❌ Deployment failed:', error);
    process.exit(1);
  });
