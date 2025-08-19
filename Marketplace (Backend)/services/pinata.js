const { PinataSDK } = require('pinata');
const fs = require('fs');
const path = require('path');

/**
 * Pinata IPFS Service - Real NFT Marketplace Implementation
 *
 * This service handles:
 * - Uploading files to IPFS via Pinata
 * - Creating NFT metadata (OpenSea standard)
 * - Pinning files for permanent storage
 * - Generating IPFS URLs for global access
 */
class PinataService {
  constructor() {
    this.pinata = null;
    this.isInitialized = false;
  }

  /**
   * Initialize Pinata connection
   */
  async initialize() {
    try {
      // Check if we have Pinata credentials
      const pinataJWT = process.env.PINATA_JWT;
      const pinataApiKey = process.env.PINATA_API_KEY;
      const pinataSecretKey = process.env.PINATA_SECRET_API_KEY;

      if (!pinataJWT && (!pinataApiKey || !pinataSecretKey)) {
        console.log(
          '⚠️ Pinata credentials not configured - using local storage fallback'
        );
        return false;
      }

      // Initialize Pinata SDK
      if (pinataJWT) {
        this.pinata = new PinataSDK({
          pinataJwt: pinataJWT,
        });
      } else {
        this.pinata = new PinataSDK({
          pinataApiKey: pinataApiKey,
          pinataSecretApiKey: pinataSecretKey,
        });
      }

      // Test connection
      const testResult = await this.pinata.testAuthentication();

      if (testResult && testResult.message) {
        console.log('✅ Pinata IPFS service initialized successfully');
        console.log('🌐 Connected to decentralized storage');
        this.isInitialized = true;
        return true;
      } else {
        throw new Error('Pinata authentication failed');
      }
    } catch (error) {
      console.log('❌ Pinata initialization failed:', error.message);
      console.log('📁 Falling back to local storage');
      this.isInitialized = false;
      return false;
    }
  }

  /**
   * Upload file to IPFS via Pinata
   */
  async uploadFile(filePath, fileName) {
    if (!this.isInitialized) {
      throw new Error('Pinata service not initialized');
    }

    try {
      console.log(`📤 Uploading ${fileName} to IPFS...`);

      const fileStream = fs.createReadStream(filePath);

      const options = {
        pinataMetadata: {
          name: fileName,
          keyvalues: {
            uploadedAt: new Date().toISOString(),
            fileType: path.extname(fileName),
            marketplace: 'ChainTorque',
          },
        },
        pinataOptions: {
          cidVersion: 1,
        },
      };

      const result = await this.pinata.pinFileToIPFS(fileStream, options);

      const ipfsUrl = `https://gateway.pinata.cloud/ipfs/${result.IpfsHash}`;
      const ipfsHash = result.IpfsHash;

      console.log(`✅ File uploaded to IPFS: ${ipfsHash}`);

      return {
        success: true,
        ipfsHash: ipfsHash,
        ipfsUrl: ipfsUrl,
        pinataUrl: `https://gateway.pinata.cloud/ipfs/${ipfsHash}`,
        size: result.PinSize,
        timestamp: result.Timestamp,
      };
    } catch (error) {
      console.error('❌ IPFS upload failed:', error.message);
      throw new Error(`IPFS upload failed: ${error.message}`);
    }
  }

  /**
   * Create and upload NFT metadata (OpenSea standard)
   */
  async uploadMetadata(nftData) {
    if (!this.isInitialized) {
      throw new Error('Pinata service not initialized');
    }

    try {
      console.log('📋 Creating NFT metadata...');

      // Create OpenSea-compatible metadata
      const metadata = {
        name: nftData.title,
        description: nftData.description,
        image: nftData.imageIpfsUrl, // IPFS URL of the image
        animation_url: nftData.modelIpfsUrl, // IPFS URL of the 3D model
        external_url: nftData.externalUrl || 'https://chaintorque.com',
        attributes: [
          {
            trait_type: 'Category',
            value: nftData.category,
          },
          {
            trait_type: 'File Type',
            value: path.extname(nftData.modelFileName).toUpperCase(),
          },
          {
            trait_type: 'Created',
            value: new Date().toISOString().split('T')[0],
          },
          {
            trait_type: 'Marketplace',
            value: 'ChainTorque',
          },
        ],
        properties: {
          category: nftData.category,
          files: [
            {
              uri: nftData.imageIpfsUrl,
              type: 'image',
            },
            {
              uri: nftData.modelIpfsUrl,
              type: 'model',
            },
          ],
        },
      };

      const options = {
        pinataMetadata: {
          name: `${nftData.title} - Metadata`,
          keyvalues: {
            type: 'metadata',
            nftTitle: nftData.title,
            category: nftData.category,
            marketplace: 'ChainTorque',
          },
        },
      };

      console.log('📤 Uploading metadata to IPFS...');
      const result = await this.pinata.pinJSONToIPFS(metadata, options);

      const metadataUrl = `https://gateway.pinata.cloud/ipfs/${result.IpfsHash}`;

      console.log(`✅ Metadata uploaded: ${result.IpfsHash}`);

      return {
        success: true,
        metadataHash: result.IpfsHash,
        metadataUrl: metadataUrl,
        metadata: metadata,
      };
    } catch (error) {
      console.error('❌ Metadata upload failed:', error.message);
      throw new Error(`Metadata upload failed: ${error.message}`);
    }
  }

  /**
   * Upload complete NFT (files + metadata) to IPFS
   */
  async uploadNFT(nftData) {
    if (!this.isInitialized) {
      throw new Error('Pinata service not initialized - using local storage');
    }

    try {
      console.log('🚀 Starting NFT upload to IPFS...');

      // 1. Upload image file
      console.log('📸 Uploading image...');
      const imageResult = await this.uploadFile(
        nftData.imagePath,
        nftData.imageFileName
      );

      // 2. Upload 3D model file
      console.log('🎯 Uploading 3D model...');
      const modelResult = await this.uploadFile(
        nftData.modelPath,
        nftData.modelFileName
      );

      // 3. Create and upload metadata
      const metadataInput = {
        title: nftData.title,
        description: nftData.description,
        category: nftData.category,
        imageIpfsUrl: imageResult.ipfsUrl,
        modelIpfsUrl: modelResult.ipfsUrl,
        modelFileName: nftData.modelFileName,
        externalUrl: nftData.externalUrl,
      };

      console.log('📋 Uploading metadata...');
      const metadataResult = await this.uploadMetadata(metadataInput);

      console.log('🎉 NFT successfully uploaded to IPFS!');

      return {
        success: true,
        tokenURI: metadataResult.metadataUrl, // This goes to the smart contract
        imageHash: imageResult.ipfsHash,
        imageUrl: imageResult.ipfsUrl,
        modelHash: modelResult.ipfsHash,
        modelUrl: modelResult.ipfsUrl,
        metadataHash: metadataResult.metadataHash,
        metadataUrl: metadataResult.metadataUrl,
        metadata: metadataResult.metadata,
        isPermanent: true,
        storage: 'ipfs',
      };
    } catch (error) {
      console.error('❌ Complete NFT upload failed:', error.message);
      throw error;
    }
  }

  /**
   * Check if Pinata service is available
   */
  isAvailable() {
    return this.isInitialized;
  }

  /**
   * Get storage info
   */
  getStorageInfo() {
    if (this.isInitialized) {
      return {
        type: 'ipfs',
        service: 'pinata',
        permanent: true,
        decentralized: true,
        global: true,
      };
    } else {
      return {
        type: 'local',
        service: 'filesystem',
        permanent: false,
        decentralized: false,
        global: false,
      };
    }
  }
}

module.exports = PinataService;
