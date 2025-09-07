// TypeScript declarations for apiService.js

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

export interface MarketplaceStats {
  totalItems: number;
  totalVolume: string;
  averagePrice: string;
  topSellers: Array<{
    address: string;
    name: string;
    volume: string;
  }>;
}

export interface UserNFT {
  tokenId: number;
  title: string;
  description: string;
  image: string;
  modelUrl?: string;
  owner: string;
  createdAt: string;
}

export interface UserProfile {
  address: string;
  name?: string;
  avatar?: string;
  verified: boolean;
  totalNFTs: number;
  totalSales: number;
  memberSince: string;
}

export interface UploadResponse {
  success: boolean;
  url: string;
  filename: string;
  size: number;
}

declare class ApiService {
  baseUrl: string;
  
  constructor();
  
  // Core request method
  request<T = any>(endpoint: string, options?: RequestInit): Promise<ApiResponse<T>>;
  
  // Health check
  healthCheck(): Promise<{ status: string; timestamp: string }>;
  isBackendConnected(): Promise<boolean>;
  
  // Web3 endpoints
  getWeb3Status(): Promise<ApiResponse<Web3Status>>;
  initializeWeb3(): Promise<ApiResponse<{ connected: boolean; account: string }>>;
  validateAddress(address: string): Promise<ApiResponse<{ valid: boolean }>>;
  getBalance(address: string): Promise<ApiResponse<{ balance: string }>>;
  
  // Marketplace endpoints
  getMarketplaceItems(): Promise<ApiResponse<MarketplaceItem[]>>;
  getMarketplaceItem(tokenId: number | string): Promise<ApiResponse<MarketplaceItem>>;
  getMarketplaceStats(): Promise<ApiResponse<MarketplaceStats>>;
  createMarketplaceItem(formData: FormData, authToken: string): Promise<ApiResponse<{ tokenId: number }>>;
  purchaseMarketplaceItem(tokenId: number | string, authToken: string): Promise<ApiResponse<{ transactionHash: string }>>;
  
  // User endpoints
  getUserNFTs(userAddress: string): Promise<ApiResponse<UserNFT[]>>;
  getUserProfile(authToken: string): Promise<ApiResponse<UserProfile>>;
  
  // File upload
  uploadFile(file: File, authToken: string): Promise<ApiResponse<UploadResponse>>;
  
  // Legacy method aliases
  getMyNFTs(authToken: string): Promise<ApiResponse<UserNFT[]>>;
  createNFT(formData: FormData, authToken: string): Promise<ApiResponse<{ tokenId: number }>>;
  purchaseNFT(tokenId: number | string, price: string, authToken: string): Promise<ApiResponse<{ transactionHash: string }>>;
}

declare const apiService: ApiService;

export default apiService;

// Named exports
export const healthCheck: () => Promise<{ status: string; timestamp: string }>;
export const getWeb3Status: () => Promise<ApiResponse<Web3Status>>;
export const initializeWeb3: () => Promise<ApiResponse<{ connected: boolean; account: string }>>;
export const validateAddress: (address: string) => Promise<ApiResponse<{ valid: boolean }>>;
export const getBalance: (address: string) => Promise<ApiResponse<{ balance: string }>>;
export const getMarketplaceItems: () => Promise<ApiResponse<MarketplaceItem[]>>;
export const getMarketplaceItem: (tokenId: number | string) => Promise<ApiResponse<MarketplaceItem>>;
export const getUserNFTs: (userAddress: string) => Promise<ApiResponse<UserNFT[]>>;
export const getMarketplaceStats: () => Promise<ApiResponse<MarketplaceStats>>;
export const createMarketplaceItem: (formData: FormData, authToken: string) => Promise<ApiResponse<{ tokenId: number }>>;
export const purchaseMarketplaceItem: (tokenId: number | string, authToken: string) => Promise<ApiResponse<{ transactionHash: string }>>;
export const getUserProfile: (authToken: string) => Promise<ApiResponse<UserProfile>>;
export const uploadFile: (file: File, authToken: string) => Promise<ApiResponse<UploadResponse>>;
export const isBackendConnected: () => Promise<boolean>;
export const getMyNFTs: (authToken: string) => Promise<ApiResponse<UserNFT[]>>;
export const createNFT: (formData: FormData, authToken: string) => Promise<ApiResponse<{ tokenId: number }>>;
export const purchaseNFT: (tokenId: number | string, price: string, authToken: string) => Promise<ApiResponse<{ transactionHash: string }>>;
