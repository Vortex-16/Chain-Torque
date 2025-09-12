const lighthouse = require('@lighthouse-web3/sdk');
const path = require('path');
const fs = require('fs');

const apiKey = process.env.LIGHTHOUSE_API_KEY;
console.log('[Lighthouse] Using API Key:', apiKey, '| Type:', typeof apiKey, '| Length:', apiKey ? apiKey.length : 'undefined');

/**
 * Upload a file to Lighthouse IPFS
 * @param {string} filePath - Path to the file to upload
 * @returns {Promise<{cid: string, url: string}>}
 */
async function uploadFile(filePath) {
  // Lighthouse SDK expects a file path and API key
  if (!apiKey || typeof apiKey !== 'string' || apiKey.length < 10) {
    throw new Error('Lighthouse API key is missing or malformed! Value: ' + JSON.stringify(apiKey));
  }
  
  try {
    console.log('[Lighthouse] Attempting to upload file:', filePath);
    const response = await lighthouse.upload(filePath, apiKey);
    console.log('[Lighthouse] Upload successful:', response);
    // Response contains data.Hash (CID)
    return {
      cid: response.data.Hash,
      url: `https://gateway.lighthouse.storage/ipfs/${response.data.Hash}`,
    };
  } catch (error) {
    console.error('[Lighthouse] Upload failed:', error);
    console.error('[Lighthouse] Error details:', {
      message: error.message,
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data
    });
    throw new Error(`Lighthouse upload failed: ${error.message}`);
  }
}

/**
 * Upload NFT metadata (OpenSea standard) to Lighthouse
 * @param {object} metadata - NFT metadata object
 * @returns {Promise<{cid: string, url: string}>}
 */
async function uploadMetadata(metadata) {
  // Write metadata to a temp file
  const tempPath = path.join(__dirname, 'metadata.json');
  await fs.promises.writeFile(tempPath, JSON.stringify(metadata));
  if (!apiKey || typeof apiKey !== 'string' || apiKey.length < 10) {
    throw new Error('Lighthouse API key is missing or malformed! Value: ' + JSON.stringify(apiKey));
  }
  
  try {
    console.log('[Lighthouse] Attempting to upload metadata:', tempPath);
    const response = await lighthouse.upload(tempPath, apiKey);
    console.log('[Lighthouse] Metadata upload successful:', response);
    // Clean up temp file
    await fs.promises.unlink(tempPath);
    return {
      cid: response.data.Hash,
      url: `https://gateway.lighthouse.storage/ipfs/${response.data.Hash}`,
    };
  } catch (error) {
    // Clean up temp file even on error
    try {
      await fs.promises.unlink(tempPath);
    } catch (unlinkError) {
      console.error('[Lighthouse] Failed to clean up temp file:', unlinkError);
    }
    
    console.error('[Lighthouse] Metadata upload failed:', error);
    console.error('[Lighthouse] Error details:', {
      message: error.message,
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data
    });
    throw new Error(`Lighthouse metadata upload failed: ${error.message}`);
  }
}

module.exports = { uploadFile, uploadMetadata };
