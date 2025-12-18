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

// Use environment variable or fallback to localhost
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';

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
      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || data.message || `HTTP error! status: ${response.status}`);
      }

      return data;
    } catch (error: any) {
      console.error(`❌ API request failed for ${endpoint}:`, error);
      // Return a consistent error structure even if fetch fails
      return {
        success: false,
        data: null as any,
        message: 'Network or Server Error',
        error: error.message || 'Unknown error'
      };
    }
  }

  // Health check
  async healthCheck(): Promise<{ status: string; timestamp: string }> {
    const response = await fetch(this.baseUrl.replace('/api', '/health'));
    return response.json();
  }

  // Web3 endpoints
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

  // Marketplace endpoints
  async getMarketplaceItems(): Promise<ApiResponse<MarketplaceItem[]>> {
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
    // For FormData, we must NOT set Content-Type header; browser sets it with boundary
    const headers: any = { Authorization: `Bearer ${authToken}` };
    
    return this.request('/marketplace/create', {
      method: 'POST',
      headers,
      body: formData,
    });
  }

  /**
   * Syncs a client-side purchase with the backend database
   */
  async syncPurchase(tokenId: number | string, transactionHash: string, buyerAddress: string, price: string): Promise<ApiResponse<any>> {
    return this.request('/marketplace/sync-purchase', {
      method: 'POST',
      body: JSON.stringify({
        tokenId: Number(tokenId),
        transactionHash,
        buyerAddress,
        price
      }),
    });
  }

  // User NFT endpoints
  async getUserNFTs(userAddress: string): Promise<ApiResponse<any[]>> {
    return this.request(`/user/${userAddress}/nfts`, { method: 'GET' });
  }

  async getUserPurchases(userAddress: string): Promise<ApiResponse<any[]>> {
    return this.request(`/user/${userAddress}/purchases`, { method: 'GET' });
  }

  async getUserSales(userAddress: string): Promise<ApiResponse<any[]>> {
    return this.request(`/user/${userAddress}/sales`, { method: 'GET' });
  }

  async getUserProfileByAddress(userAddress: string): Promise<ApiResponse<any>> {
    return this.request(`/user/${userAddress}/profile`, { method: 'GET' });
  }

  /**
   * Legacy method: Server attempts to purchase (deprecated in favor of client-side purchase + sync)
   */
  async purchaseNFT(tokenId: number | string, buyerAddress: string, price: number): Promise<ApiResponse<any>> {
    return this.request('/marketplace/purchase', {
      method: 'POST',
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

  async uploadFile(file: File, authToken: string): Promise<ApiResponse<{ url: string; filename: string; size: number }>> {
    const formData = new FormData();
    formData.append('file', file);
    const headers: any = { Authorization: `Bearer ${authToken}` };

    return this.request('/upload', {
      method: 'POST',
      headers,
      body: formData,
    });
  }

  // Legacy aliases
  async getMyNFTs(_authToken: string): Promise<ApiResponse<any[]>> {
    return {
      success: true,
      data: [],
      message: 'Need user wallet address',
    };
  }

  async createNFT(formData: FormData, authToken: string): Promise<ApiResponse<{ tokenId: number }>> {
    return this.createMarketplaceItem(formData, authToken);
  }

  async isBackendConnected(): Promise<boolean> {
    try {
      const response = await fetch(this.baseUrl.replace('/api', '/health'));
      return response.ok;
    } catch (error) {
      return false;
    }
  }
}

const apiService = new ApiService();
export default apiService;

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
  syncPurchase,
  purchaseNFT,
  getUserProfile,
  uploadFile,
  isBackendConnected,
  getMyNFTs,
  createNFT,
} = apiService;
