// API configuration and service for ChainTorque Web3 backend

export interface ApiResponse<T = any> {
  success: boolean;
  data: T;
  message?: string;
  error?: string;
}

export interface Web3Status {
  connected: boolean;
  account?: string;
  network?: string;
  balance?: string;
}

export interface MarketplaceItem {
  tokenId: number;
  title: string;
  description: string;
  price: string;
  priceETH?: number;
  seller: {
    name: string;
    avatar: string;
    verified: boolean;
    rating: number;
    totalSales: number;
  };
  images: string[];
  modelUrl: string;
  category: string;
  tags: string[];
  views: number;
  likes: number;
  createdAt: string;
  blockchain?: string;
  format?: string;
}

const API_BASE_URL = 'http://localhost:5000/api';

class ApiService {
  public baseUrl: string;

  constructor() {
    this.baseUrl = API_BASE_URL;
  }

  // Helper method for making requests
  async request<T = any>(endpoint: string, options: RequestInit = {}): Promise<ApiResponse<T>> {
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
  async healthCheck(): Promise<{ status: string; timestamp: string }> {
    const response = await fetch('http://localhost:5000/health');
    return response.json();
  }

  // Web3 endpoints (FIXED to match backend)
  async getWeb3Status(): Promise<ApiResponse<Web3Status>> {
    return this.request('/web3/status', { method: 'GET' });
  }

  async initializeWeb3(): Promise<ApiResponse<{ connected: boolean; account: string }>> {
    return this.request('/web3/connect', { method: 'POST' });
  }

  async validateAddress(address: string): Promise<ApiResponse<{ valid: boolean }>> {
    return this.request('/web3/validate-address', {
      method: 'POST',
      body: JSON.stringify({ address }),
    });
  }

  async getBalance(address: string): Promise<ApiResponse<{ balance: string }>> {
    return this.request(`/web3/balance/${address}`, { method: 'GET' });
  }

  // Marketplace endpoints (FIXED to match backend)
  async getMarketplaceItems(): Promise<ApiResponse<MarketplaceItem[]>> {
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

  async getMarketplaceItem(tokenId: number | string): Promise<ApiResponse<MarketplaceItem>> {
    return this.request(`/marketplace/${tokenId}`, { method: 'GET' });
  }

  async getMarketplaceStats(): Promise<ApiResponse<any>> {
    return this.request('/marketplace/stats', { method: 'GET' });
  }

  async createMarketplaceItem(formData: FormData, authToken: string): Promise<ApiResponse<{ tokenId: number }>> {
    return this.request('/marketplace/create', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${authToken}`,
        // Remove Content-Type for FormData
      },
      body: formData,
    });
  }

  async purchaseMarketplaceItem(tokenId: number | string, authToken: string): Promise<ApiResponse<{ transactionHash: string }>> {
    return this.request(`/marketplace/purchase/${tokenId}`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    });
  }

  // User NFT endpoints (FIXED to match backend)
  async getUserNFTs(userAddress: string): Promise<ApiResponse<any[]>> {
    return this.request(`/user/${userAddress}/nfts`, { method: 'GET' });
  }

  // Get user's purchase history
  async getUserPurchases(userAddress: string): Promise<ApiResponse<any[]>> {
    return this.request(`/user/${userAddress}/purchases`, { method: 'GET' });
  }

  // Get user's sales history
  async getUserSales(userAddress: string): Promise<ApiResponse<any[]>> {
    return this.request(`/user/${userAddress}/sales`, { method: 'GET' });
  }

  // Get user profile with stats
  async getUserProfileByAddress(userAddress: string): Promise<ApiResponse<any>> {
    return this.request(`/user/${userAddress}/profile`, { method: 'GET' });
  }

  // Purchase an NFT (updated method)
  async purchaseNFT(tokenId: number | string, buyerAddress: string, price: number): Promise<ApiResponse<any>> {
    return this.request('/marketplace/purchase', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        tokenId: Number(tokenId),
        buyerAddress,
        price
      }),
    });
  }

  async getUserProfile(authToken: string): Promise<ApiResponse<any>> {
    return this.request('/user/profile', {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    });
  }

  // File upload (FIXED to match backend)
  async uploadFile(file: File, authToken: string): Promise<ApiResponse<{ url: string; filename: string; size: number }>> {
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
  async getMyNFTs(_authToken: string): Promise<ApiResponse<any[]>> {
    // This would need a user address - for now return empty
    return {
      success: true,
      data: [],
      message: 'Need user wallet address',
    };
  }

  async createNFT(formData: FormData, authToken: string): Promise<ApiResponse<{ tokenId: number }>> {
    return this.createMarketplaceItem(formData, authToken);
  }

  // Direct fetch for health check
  async isBackendConnected(): Promise<boolean> {
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
  getUserPurchases,
  getUserSales,
  getUserProfileByAddress,
  getMarketplaceStats,
  createMarketplaceItem,
  purchaseMarketplaceItem,
  purchaseNFT,
  getUserProfile,
  uploadFile,
  isBackendConnected,
  // Legacy aliases
  getMyNFTs,
  createNFT,
} = apiService;
