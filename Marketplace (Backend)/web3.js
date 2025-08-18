const { ethers } = require('ethers');

// Contract configuration - UPDATE AFTER DEPLOYMENT
const CONTRACT_ADDRESS = '0x5FbDB2315678afecb367f032d93F642f64180aa3'; // Will be updated after deployment
const CONTRACT_ABI = [
  // Marketplace functions
  "function createToken(string memory tokenURI, uint256 price, string memory category, string memory title, string memory description) public payable returns (uint)",
  "function createMarketSale(uint256 tokenId) public payable",
  "function resellToken(uint256 tokenId, uint256 price) public payable",
  "function fetchMarketItems() public view returns (tuple(uint256 tokenId, address seller, address owner, uint256 price, bool sold, string category, string title, string description)[])",
  "function fetchMyNFTs() public view returns (tuple(uint256 tokenId, address seller, address owner, uint256 price, bool sold, string category, string title, string description)[])",
  "function fetchItemsListed() public view returns (tuple(uint256 tokenId, address seller, address owner, uint256 price, bool sold, string category, string title, string description)[])",
  "function getMarketplaceStats() public view returns (uint256, uint256, uint256)",
  "function getMarketItem(uint256 tokenId) public view returns (tuple(uint256 tokenId, address seller, address owner, uint256 price, bool sold, string category, string title, string description))",
  "function getListingPrice() public view returns (uint256)",
  "function updateListingPrice(uint256 _listingPrice) public payable",
  
  // ERC721 functions
  "function tokenURI(uint256 tokenId) public view returns (string)",
  "function ownerOf(uint256 tokenId) public view returns (address)",
  "function balanceOf(address owner) public view returns (uint256)",
  
  // Events
  "event MarketItemCreated(uint256 indexed tokenId, address seller, address owner, uint256 price, bool sold, string category, string title)",
  "event MarketItemSold(uint256 indexed tokenId, address buyer, uint256 price)"
];

class Web3Manager {
  constructor() {
    this.provider = null;
    this.contract = null;
    this.connected = false;
    this.network = null;
  }

  async initialize() {
    try {
      console.log('🔗 Initializing Web3 connection...');
      
      // For demo purposes, use the hardhat network we successfully deployed to
      console.log('🎯 Using local Hardhat network for demo...');
      
      // Configure network explicitly for Hardhat
      const networkConfig = {
        name: 'hardhat',
        chainId: 1337,
        url: 'http://127.0.0.1:8545'
      };
      
      // Initialize provider with explicit network configuration
      this.provider = new ethers.providers.JsonRpcProvider({
        url: networkConfig.url,
        timeout: 30000
      }, networkConfig);
      
      // Verify network connection
      const network = await this.provider.getNetwork();
      this.network = { name: 'hardhat', chainId: network.chainId };
      
      console.log(`✅ Connected to ${this.network.name} (chainId: ${this.network.chainId})`);
      
      // Initialize contract (we know it's deployed)
      if (CONTRACT_ADDRESS !== '0x0000000000000000000000000000000000000000') {
        this.contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, this.provider);
        
        // Test contract connection
        try {
          await this.contract.getListingPrice();
          console.log(`📄 Real Web3 Contract verified at ${CONTRACT_ADDRESS}`);
        } catch (contractError) {
          console.warn(`⚠️  Contract deployed but connection test failed: ${contractError.message}`);
          // Still set the contract as it might work for other operations
        }
      } else {
        console.log('⚠️  Contract not deployed yet. Run "npm run deploy" to deploy the contract.');
      }
      
      this.connected = true;
      console.log('🎉 Real Web3 connection established!');
      return true;
      
    } catch (error) {
      console.error('❌ Web3 connection failed:', error.message);
      this.connected = false;
      return false;
    }
  }

  getNetworkInfo() {
    if (!this.network) return null;
    
    return {
      name: this.network.name,
      chainId: this.network.chainId,
      connected: this.connected,
      contractAddress: CONTRACT_ADDRESS,
      contractDeployed: CONTRACT_ADDRESS !== '0x0000000000000000000000000000000000000000'
    };
  }

  // TRUE WEB3: Get marketplace items from smart contract
  async getMarketplaceItems() {
    if (!this.contract) {
      return {
        success: false,
        error: 'Contract not initialized. Please deploy the contract first.',
        items: [],
        isWeb3: false
      };
    }

    try {
      const items = await this.contract.fetchMarketItems();
      
      const formattedItems = await Promise.all(items.map(async (item, index) => {
        let imageUrl = '/placeholder.jpg';
        let modelUrl = null;
        
        try {
          // Get tokenURI to extract metadata
          const tokenURI = await this.contract.tokenURI(item.tokenId);
          
          if (tokenURI && tokenURI.startsWith('data:application/json;base64,')) {
            // Decode base64 metadata
            const base64Data = tokenURI.replace('data:application/json;base64,', '');
            const metadata = JSON.parse(Buffer.from(base64Data, 'base64').toString());
            
            // Extract image and model URLs from metadata
            if (metadata.image) {
              imageUrl = metadata.image;
            }
            if (metadata.model_url) {
              modelUrl = metadata.model_url;
            }
          }
        } catch (error) {
          console.log(`⚠️ Could not parse metadata for token ${item.tokenId}:`, error.message);
        }
        
        return {
          id: item.tokenId.toString(),
          title: item.title,
          description: item.description,
          price: ethers.utils.formatEther(item.price),
          category: item.category,
          seller: item.seller,
          owner: item.owner,
          sold: item.sold,
          tokenId: item.tokenId.toString(),
          imageUrl: imageUrl,
          modelUrl: modelUrl,
          isNFT: true // This is a real NFT
        };
      }));

      return {
        success: true,
        items: formattedItems,
        count: formattedItems.length,
        isWeb3: true
      };
    } catch (error) {
      console.error('Error fetching marketplace items:', error);
      return {
        success: false,
        error: error.message,
        items: [],
        isWeb3: false
      };
    }
  }

  //Create NFT and list on marketplace
  async createMarketItem(itemData, privateKey) {
    if (!this.contract) {
      throw new Error('Contract not initialized. Deploy contract first.');
    }

    if (!this.provider) {
      throw new Error('Provider not initialized. Check network connection.');
    }

    try {
      // Verify network connection before proceeding
      try {
        await this.provider.getNetwork();
      } catch (networkError) {
        console.log('🔄 Network connection lost, attempting to reconnect...');
        await this.initialize();
        if (!this.contract || !this.provider) {
          throw new Error('Failed to reconnect to network');
        }
      }

      const wallet = new ethers.Wallet(privateKey, this.provider);
      const contractWithSigner = this.contract.connect(wallet);
      
      // Test contract connection first
      const listingPrice = await this.contract.getListingPrice();
      const price = ethers.utils.parseEther(itemData.price.toString());
      
      console.log(`📝 Creating NFT: ${itemData.title} for ${itemData.price} ETH`);
      console.log(`💰 Listing price: ${ethers.utils.formatEther(listingPrice)} ETH`);
      
      // Create token URI (in production, this would be IPFS)
      const tokenURI = `data:application/json;base64,${Buffer.from(JSON.stringify({
        name: itemData.title,
        description: itemData.description,
        image: itemData.imageUrl,
        model_url: itemData.modelUrl,
        attributes: [
          { trait_type: "Category", value: itemData.category },
          { trait_type: "Creator", value: wallet.address }
        ]
      })).toString('base64')}`;
      
      const transaction = await contractWithSigner.createToken(
        tokenURI,
        price,
        itemData.category,
        itemData.title,
        itemData.description,
        { value: listingPrice, gasLimit: 3000000 } // Increased gas limit for NFT creation
      );
      
      console.log(`⏳ Transaction submitted: ${transaction.hash}`);
      const receipt = await transaction.wait();
      console.log(`✅ NFT created successfully!`);
      
      return {
        success: true,
        transactionHash: receipt.transactionHash,
        tokenId: receipt.events?.find(e => e.event === 'MarketItemCreated')?.args?.tokenId?.toString(),
        isWeb3: true
      };
    } catch (error) {
      console.error('❌ Error creating market item:', error);
      throw error;
    }
  }

  //Purchase NFT from marketplace
  async purchaseMarketItem(tokenId, privateKey) {
    if (!this.contract) {
      throw new Error('Contract not initialized');
    }

    try {
      const wallet = new ethers.Wallet(privateKey, this.provider);
      const contractWithSigner = this.contract.connect(wallet);
      
      const item = await this.contract.getMarketItem(tokenId);
      const price = item.price;
      
      const transaction = await contractWithSigner.createMarketSale(tokenId, {
        value: price
      });
      
      const receipt = await transaction.wait();
      
      return {
        success: true,
        transactionHash: receipt.transactionHash,
        buyer: wallet.address,
        isWeb3: true
      };
    } catch (error) {
      console.error('Error purchasing item:', error);
      throw error;
    }
  }

  //Get user's NFTs
  async getUserNFTs(userAddress) {
    if (!this.contract) {
      throw new Error('Contract not initialized');
    }

    try {
      const wallet = new ethers.Wallet(process.env.PRIVATE_KEY || '0x0', this.provider);
      wallet.address = userAddress; // Override for view function
      
      const contractWithSigner = this.contract.connect(wallet);
      const nfts = await contractWithSigner.fetchMyNFTs();
      
      const formattedNFTs = nfts.map(nft => ({
        tokenId: nft.tokenId.toString(),
        title: nft.title,
        description: nft.description,
        price: ethers.utils.formatEther(nft.price),
        category: nft.category,
        owned: true,
        isNFT: true
      }));

      return {
        success: true,
        nfts: formattedNFTs,
        count: formattedNFTs.length,
        isWeb3: true
      };
    } catch (error) {
      console.error('Error fetching user NFTs:', error);
      throw error;
    }
  }

  async getMarketplaceStats() {
    if (!this.contract) {
      return {
        totalItems: 0,
        itemsSold: 0,
        listingPrice: '0',
        isWeb3: false
      };
    }

    try {
      const [totalItems, itemsSold, listingPrice] = await this.contract.getMarketplaceStats();
      
      return {
        totalItems: totalItems.toString(),
        itemsSold: itemsSold.toString(),
        listingPrice: ethers.utils.formatEther(listingPrice),
        isWeb3: true
      };
    } catch (error) {
      console.error('Error fetching marketplace stats:', error);
      return {
        totalItems: 0,
        itemsSold: 0,
        listingPrice: '0',
        isWeb3: false,
        error: error.message
      };
    }
  }

  async getBalance(address) {
    if (!this.provider) {
      throw new Error('Provider not initialized');
    }

    try {
      const balance = await this.provider.getBalance(address);
      return {
        balance: ethers.utils.formatEther(balance),
        balanceWei: balance.toString(),
        address: address,
        isWeb3: true
      };
    } catch (error) {
      console.error('Error getting balance:', error);
      throw error;
    }
  }

  isValidAddress(address) {
    return ethers.utils.isAddress(address);
  }

  async getBlockNumber() {
    try {
      if (!this.provider) {
        await this.initializeProvider();
      }
      return await this.provider.getBlockNumber();
    } catch (error) {
      console.error('Error getting block number:', error);
      return 'N/A';
    }
  }

  // Contract deployment status
  isContractDeployed() {
    return CONTRACT_ADDRESS !== '0x0000000000000000000000000000000000000000';
  }

  get contractAddress() {
    return CONTRACT_ADDRESS;
  }
}

// Create singleton instance
const web3Manager = new Web3Manager();

module.exports = web3Manager;
