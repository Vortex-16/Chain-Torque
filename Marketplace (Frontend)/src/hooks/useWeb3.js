import { useState, useEffect } from 'react';
import apiService from '../services/apiService';

export const useWeb3Status = () => {
  const [status, setStatus] = useState({
    initialized: false,
    network: null,
    contract: null,
    loading: true,
    error: null,
  });

  useEffect(() => {
    const checkWeb3Status = async () => {
      try {
        setStatus(prev => ({ ...prev, loading: true, error: null }));
        
        const response = await apiService.getWeb3Status();
        
        setStatus({
          initialized: response.data.initialized,
          network: response.data.network,
          contract: response.data.contract,
          loading: false,
          error: null,
        });
      } catch (error) {
        console.error('Failed to check Web3 status:', error);
        setStatus(prev => ({
          ...prev,
          loading: false,
          error: error.message,
        }));
      }
    };

    checkWeb3Status();
    
    // Check status every 30 seconds
    const interval = setInterval(checkWeb3Status, 30000);
    
    return () => clearInterval(interval);
  }, []);

  const initializeWeb3 = async () => {
    try {
      setStatus(prev => ({ ...prev, loading: true, error: null }));
      
      await apiService.initializeWeb3();
      
      // Refresh status after initialization
      const response = await apiService.getWeb3Status();
      setStatus({
        initialized: response.data.initialized,
        network: response.data.network,
        contract: response.data.contract,
        loading: false,
        error: null,
      });
      
      return true;
    } catch (error) {
      console.error('Failed to initialize Web3:', error);
      setStatus(prev => ({
        ...prev,
        loading: false,
        error: error.message,
      }));
      return false;
    }
  };

  return {
    ...status,
    initializeWeb3,
  };
};

export const useMarketplace = () => {
  const [marketplace, setMarketplace] = useState({
    items: [],
    stats: null,
    loading: true,
    error: null,
  });

  const fetchMarketplaceData = async () => {
    try {
      setMarketplace(prev => ({ ...prev, loading: true, error: null }));
      
      const [itemsResponse, statsResponse] = await Promise.all([
        apiService.getMarketplaceItems(),
        apiService.getMarketplaceStats(),
      ]);
      
      setMarketplace({
        items: itemsResponse.data || [],
        stats: statsResponse.data || null,
        loading: false,
        error: null,
      });
    } catch (error) {
      console.error('Failed to fetch marketplace data:', error);
      setMarketplace(prev => ({
        ...prev,
        loading: false,
        error: error.message,
      }));
    }
  };

  useEffect(() => {
    fetchMarketplaceData();
  }, []);

  const refreshMarketplace = () => {
    fetchMarketplaceData();
  };

  return {
    ...marketplace,
    refreshMarketplace,
  };
};

export const useBackendHealth = () => {
  const [health, setHealth] = useState({
    status: 'unknown',
    services: {},
    loading: true,
    error: null,
  });

  useEffect(() => {
    const checkHealth = async () => {
      try {
        setHealth(prev => ({ ...prev, loading: true, error: null }));
        
        const response = await apiService.healthCheck();
        
        setHealth({
          status: response.status,
          services: response.services || {},
          loading: false,
          error: null,
        });
      } catch (error) {
        console.error('Backend health check failed:', error);
        setHealth({
          status: 'error',
          services: {},
          loading: false,
          error: error.message,
        });
      }
    };

    checkHealth();
    
    // Check health every 60 seconds
    const interval = setInterval(checkHealth, 60000);
    
    return () => clearInterval(interval);
  }, []);

  return health;
};
