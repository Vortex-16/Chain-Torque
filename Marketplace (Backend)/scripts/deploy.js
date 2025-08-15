const { ethers } = require("hardhat");
const fs = require('fs');
const path = require('path');

async function main() {
  console.log("🚀 Deploying ChainTorque Marketplace...");

  // Get the contract factory
  const ChainTorqueMarketplace = await ethers.getContractFactory("ChainTorqueMarketplace");
  
  // Deploy the contract
  const marketplace = await ChainTorqueMarketplace.deploy();
  
  // Wait for deployment
  await marketplace.deployed();
  
  console.log("✅ ChainTorque Marketplace deployed to:", marketplace.address);
  console.log("📝 Transaction hash:", marketplace.deployTransaction.hash);

  // Save deployment info
  const deploymentInfo = {
    address: marketplace.address,
    network: hre.network.name,
    deployer: (await ethers.getSigners())[0].address,
    deployedAt: new Date().toISOString(),
    transactionHash: marketplace.deployTransaction.hash,
    contractName: "ChainTorqueMarketplace"
  };

  // Create deployments directory if it doesn't exist
  const deploymentsDir = path.join(__dirname, '..', 'deployments');
  if (!fs.existsSync(deploymentsDir)) {
    fs.mkdirSync(deploymentsDir);
  }

  // Save deployment info to file
  const deploymentFile = path.join(deploymentsDir, `${hre.network.name}.json`);
  fs.writeFileSync(deploymentFile, JSON.stringify(deploymentInfo, null, 2));
  
  console.log("💾 Deployment info saved to:", deploymentFile);

  // Verify contract if on testnet/mainnet
  if (hre.network.name !== "hardhat" && hre.network.name !== "localhost") {
    console.log("⏳ Waiting for block confirmations...");
    await marketplace.deployTransaction.wait(6);
    
    try {
      console.log("🔍 Verifying contract...");
      await hre.run("verify:verify", {
        address: marketplace.address,
        constructorArguments: [],
      });
      console.log("✅ Contract verified on Etherscan");
    } catch (error) {
      console.log("❌ Verification failed:", error.message);
    }
  }

  // Update web3.js with deployed contract address
  try {
    const web3FilePath = path.join(__dirname, '..', 'web3.js');
    if (fs.existsSync(web3FilePath)) {
      let web3Content = fs.readFileSync(web3FilePath, 'utf8');
      
      // Replace contract address placeholder
      const contractAddressRegex = /CONTRACT_ADDRESS\s*=\s*['"][^'"]*['"]/;
      const newContractAddress = `CONTRACT_ADDRESS = '${marketplace.address}'`;
      
      if (contractAddressRegex.test(web3Content)) {
        web3Content = web3Content.replace(contractAddressRegex, newContractAddress);
        fs.writeFileSync(web3FilePath, web3Content);
        console.log("📝 Updated contract address in web3.js");
      }
    }
  } catch (error) {
    console.log("⚠️  Could not update web3.js:", error.message);
  }

  console.log("\n🎉 Deployment completed successfully!");
  console.log(`\n📋 Summary:`);
  console.log(`   Contract: ChainTorqueMarketplace`);
  console.log(`   Address: ${marketplace.address}`);
  console.log(`   Network: ${hre.network.name}`);
  console.log(`   Gas Used: ${marketplace.deployTransaction.gasLimit?.toString() || 'Unknown'}`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Deployment failed:", error);
    process.exit(1);
  });
