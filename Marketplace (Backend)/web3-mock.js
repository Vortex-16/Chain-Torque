const { ethers } = require('ethers');

// Mock contract data
const mockMarketItems = [
  {
    tokenId: 1,
    seller: '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266',
    owner: '0x0000000000000000000000000000000000000000',
    price: ethers.utils.parseEther('0.1'),
    sold: false,
    category: 'CAD Models',
    title: 'Industrial Robot Arm',
    description: 'High-precision 6-axis robot arm for manufacturing'
  },
  {
    tokenId: 2,
    seller: '0x70997970C51812dc3A010C7d01b50e0d17dc79C8',
    owner: '0x0000000000000000000000000000000000000000',
    price: ethers.utils.parseEther('0.05'),
    sold: false,
    category: 'Engineering Tools',
    title: 'Gear Assembly Model',
    description: 'Complete gear train assembly for mechanical systems'
  },
  {
    tokenId: 3,
    seller: '0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC',
    owner: '0x90F79bf6EB2c4f870365E785982E1f101E93b906',
    price: ethers.utils.parseEther('0.15'),
    sold: true,
    category: 'CAD Models',
    title: 'Drone Frame Design',
    description: 'Lightweight carbon fiber drone frame optimized for stability'
  }
];

let nextTokenId = 4;

class MockWeb3Manager {
  constructor() {
    this.connected = true;
    this.network = { name: 'mock-hardhat', chainId: 1337 };
    this.contractAddress = '0x5FbDB2315678afecb367f032d93F642f64180aa3';
  }

  async initialize() {
    try {
      console.log('🔗 Initializing Mock Web3 connection...');
      console.log(`✅ Connected to ${this.network.name} (chainId: ${this.network.chainId})`);
      console.log(`📄 Mock Contract initialized at ${this.contractAddress}`);
      
      this.connected = true;
      return true;
      
    } catch (error) {
      console.error('❌ Mock Web3 connection failed:', error.message);
      this.connected = false;
      return false;
    }
  }

  getNetworkInfo() {
    return {
      name: this.network.name,
      chainId: this.network.chainId,
      connected: this.connected,
      contractAddress: this.contractAddress,
      contractDeployed: true
    };
  }

  // Mock marketplace functions
  async getMarketplaceItems() {
    try {
      console.log('📋 Fetching marketplace items (mock)...');
      
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 100));
      
      const availableItems = mockMarketItems.filter(item => !item.sold);
      
      return {
        success: true,
        data: availableItems.map(item => ({
          ...item,
          price: ethers.utils.formatEther(item.price),
          priceWei: item.price.toString()
        }))
      };
    } catch (error) {
      console.error('Error fetching mock marketplace items:', error);
      return { success: false, error: error.message };
    }
  }

  async getMyNFTs(userAddress) {
    try {
      console.log(`📋 Fetching NFTs for ${userAddress} (mock)...`);
      
      await new Promise(resolve => setTimeout(resolve, 100));
      
      const userNFTs = mockMarketItems.filter(item => 
        item.owner.toLowerCase() === userAddress.toLowerCase()
      );
      
      return {
        success: true,
        data: userNFTs.map(item => ({
          ...item,
          price: ethers.utils.formatEther(item.price),
          priceWei: item.price.toString()
        }))
      };
    } catch (error) {
      console.error('Error fetching mock user NFTs:', error);
      return { success: false, error: error.message };
    }
  }

  async getItemsListed(userAddress) {
    try {
      console.log(`📋 Fetching listed items for ${userAddress} (mock)...`);
      
      await new Promise(resolve => setTimeout(resolve, 100));
      
      const listedItems = mockMarketItems.filter(item => 
        item.seller.toLowerCase() === userAddress.toLowerCase() && !item.sold
      );
      
      return {
        success: true,
        data: listedItems.map(item => ({
          ...item,
          price: ethers.utils.formatEther(item.price),
          priceWei: item.price.toString()
        }))
      };
    } catch (error) {
      console.error('Error fetching mock listed items:', error);
      return { success: false, error: error.message };
    }
  }

  async createToken(tokenURI, price, category, title, description, userAddress) {
    try {
      console.log('🎨 Creating new token (mock)...');
      
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const newItem = {
        tokenId: nextTokenId++,
        seller: userAddress || '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266',
        owner: '0x0000000000000000000000000000000000000000',
        price: ethers.utils.parseEther(price.toString()),
        sold: false,
        category,
        title,
        description,
        tokenURI
      };
      
      mockMarketItems.push(newItem);
      
      return {
        success: true,
        data: {
          tokenId: newItem.tokenId,
          transactionHash: '0x' + Math.random().toString(16).substr(2, 64),
          blockNumber: Math.floor(Math.random() * 1000000),
          gasUsed: '250000'
        }
      };
    } catch (error) {
      console.error('Error creating mock token:', error);
      return { success: false, error: error.message };
    }
  }

  async purchaseToken(tokenId, userAddress) {
    try {
      console.log(`💰 Purchasing token ${tokenId} (mock)...`);
      
      await new Promise(resolve => setTimeout(resolve, 700));
      
      const itemIndex = mockMarketItems.findIndex(item => item.tokenId === parseInt(tokenId));
      
      if (itemIndex === -1) {
        throw new Error('Item not found');
      }
      
      if (mockMarketItems[itemIndex].sold) {
        throw new Error('Item already sold');
      }
      
      // Update item status
      mockMarketItems[itemIndex].sold = true;
      mockMarketItems[itemIndex].owner = userAddress || '0x70997970C51812dc3A010C7d01b50e0d17dc79C8';
      
      return {
        success: true,
        data: {
          tokenId: parseInt(tokenId),
          transactionHash: '0x' + Math.random().toString(16).substr(2, 64),
          blockNumber: Math.floor(Math.random() * 1000000),
          gasUsed: '180000',
          price: ethers.utils.formatEther(mockMarketItems[itemIndex].price)
        }
      };
    } catch (error) {
      console.error('Error purchasing mock token:', error);
      return { success: false, error: error.message };
    }
  }

  async getMarketplaceStats() {
    try {
      console.log('📊 Fetching marketplace stats (mock)...');
      
      await new Promise(resolve => setTimeout(resolve, 100));
      
      const totalItems = mockMarketItems.length;
      const soldItems = mockMarketItems.filter(item => item.sold).length;
      const totalVolume = mockMarketItems
        .filter(item => item.sold)
        .reduce((sum, item) => sum + parseFloat(ethers.utils.formatEther(item.price)), 0);
      
      return {
        success: true,
        data: {
          totalItems,
          totalSales: soldItems,
          totalVolume: totalVolume.toFixed(4),
          activeUsers: 25,
          listingPrice: '0.025'
        }
      };
    } catch (error) {
      console.error('Error fetching mock marketplace stats:', error);
      return { success: false, error: error.message };
    }
  }

  getConnectionStatus() {
    return {
      connected: this.connected,
      network: this.network,
      contractAddress: this.contractAddress,
      mode: 'mock'
    };
  }

  // Missing validation methods
  validateAddress(address) {
    const isValid = ethers.utils.isAddress(address);
    return {
      valid: isValid,
      address: address,
      isWeb3: false
    };
  }

  isValidAddress(address) {
    return ethers.utils.isAddress(address);
  }

  // Contract deployment status
  isContractDeployed() {
    return true; // Mock always has "deployed" contract
  }

  // Get wallet balance (compatible with routes)
  async getBalance(address) {
    try {
      console.log(`💰 Getting balance for ${address} (mock)...`);
      
      await new Promise(resolve => setTimeout(resolve, 100));
      
      // Mock balance between 1-10 ETH
      const mockBalance = (Math.random() * 9 + 1).toFixed(4);
      
      return {
        balance: mockBalance,
        balanceWei: ethers.utils.parseEther(mockBalance).toString(),
        address: address,
        isWeb3: false
      };
    } catch (error) {
      console.error('Error getting mock balance:', error);
      throw error;
    }
  }
}

module.exports = MockWeb3Manager;
