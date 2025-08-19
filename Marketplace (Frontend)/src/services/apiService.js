// API configuration and service for ChainTorque Web3 backend
const API_BASE_URL = 'http://localhost:5000/api';

class ApiService {
  constructor() {
    this.baseUrl = API_BASE_URL;
  }

  // Helper method for making requests
  async request(endpoint, options = {}) {
    const url = `${this.baseUrl}${endpoint}`;
    console.log('🌐 API Request:', {
      url,
      method: options.method || 'GET',
      endpoint,
      baseUrl: this.baseUrl,
    });

    const config = {
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        Pragma: 'no-cache',
        Expires: '0',
        ...options.headers,
      },
      ...options,
    };

    try {
      console.log('📤 Making fetch request to:', url);
      console.log('📤 Request config:', {
        method: config.method,
        headers: config.headers,
      });

      const response = await fetch(url, config);

      console.log('📥 Response received:', {
        status: response.status,
        statusText: response.statusText,
        ok: response.ok,
        url: response.url,
      });

      const data = await response.json();

      console.log('📦 Response data:', data);

      if (!response.ok) {
        throw new Error(data.error || `HTTP error! status: ${response.status}`);
      }

      return data;
    } catch (error) {
      console.error(`❌ API request failed for ${endpoint}:`, error);
      throw error;
    }
  }

  // Health check
  async healthCheck() {
    const response = await fetch('http://localhost:5000/health');
    return response.json();
  }

  // Web3 endpoints (FIXED to match backend)
  async getWeb3Status() {
    return this.request('/web3/status', { method: 'GET' });
  }

  async initializeWeb3() {
    return this.request('/web3/connect', { method: 'POST' });
  }

  async validateAddress(address) {
    return this.request('/web3/validate-address', {
      method: 'POST',
      body: JSON.stringify({ address }),
    });
  }

  async getBalance(address) {
    return this.request(`/web3/balance/${address}`, { method: 'GET' });
  }

  // Marketplace endpoints (FIXED to match backend)
  async getMarketplaceItems() {
    // Add cache-busting parameter to force fresh data
    const timestamp = Date.now();
    return this.request(`/marketplace?_t=${timestamp}`, {
      method: 'GET',
      headers: {
        'Cache-Control': 'no-cache',
        Pragma: 'no-cache',
      },
    });
  }

  async getMarketplaceItem(tokenId) {
    return this.request(`/marketplace/${tokenId}`, { method: 'GET' });
  }

  async getMarketplaceStats() {
    return this.request('/marketplace/stats', { method: 'GET' });
  }

  async createMarketplaceItem(formData, authToken) {
    return this.request('/marketplace/create', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${authToken}`,
        // Remove Content-Type for FormData
      },
      body: formData,
    });
  }

  async purchaseMarketplaceItem(tokenId, authToken) {
    return this.request(`/marketplace/purchase/${tokenId}`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    });
  }

  // User NFT endpoints (FIXED to match backend)
  async getUserNFTs(userAddress) {
    return this.request(`/user/${userAddress}/nfts`, { method: 'GET' });
  }

  async getUserProfile(authToken) {
    return this.request('/user/profile', {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    });
  }

  // File upload (FIXED to match backend)
  async uploadFile(file, authToken) {
    const formData = new FormData();
    formData.append('file', file);

    return this.request('/upload', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${authToken}`,
        // Remove Content-Type for FormData
      },
      body: formData,
    });
  }

  // Legacy method aliases for backward compatibility
  async getMyNFTs(authToken) {
    // This would need a user address - for now return empty
    return {
      success: true,
      data: [],
      total: 0,
      message: 'Need user wallet address',
    };
  }

  async createNFT(formData, authToken) {
    return this.createMarketplaceItem(formData, authToken);
  }

  async purchaseNFT(tokenId, price, authToken) {
    return this.purchaseMarketplaceItem(tokenId, authToken);
  }

  // Direct fetch for health check
  async isBackendConnected() {
    try {
      const response = await fetch('http://localhost:5000/health');
      return response.ok;
    } catch (error) {
      return false;
    }
  }
}

// Create singleton instance
const apiService = new ApiService();

export default apiService;

// Export individual methods for convenience (UPDATED)
export const {
  healthCheck,
  getWeb3Status,
  initializeWeb3,
  validateAddress,
  getBalance,
  getMarketplaceItems,
  getMarketplaceItem,
  getUserNFTs,
  getMarketplaceStats,
  createMarketplaceItem,
  purchaseMarketplaceItem,
  getUserProfile,
  uploadFile,
  isBackendConnected,
  // Legacy aliases
  getMyNFTs,
  createNFT,
  purchaseNFT,
} = apiService;
