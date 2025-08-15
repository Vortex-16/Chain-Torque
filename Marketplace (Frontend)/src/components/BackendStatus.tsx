import React, { useState, useEffect } from 'react';

const BackendStatus = () => {
  const [status, setStatus] = useState({
    backend: 'checking...',
    web3: 'checking...',
    contract: 'checking...',
    lastCheck: new Date().toLocaleTimeString(),
    marketplaceItems: 0
  });

  const checkBackend = async () => {
    try {
      // Check basic health
      const healthResponse = await fetch('http://localhost:5000/health');
      const backendStatus = healthResponse.ok ? 'connected' : 'error';
      
      // Check web3 status
      let web3Status = 'disconnected';
      let contractStatus = 'not deployed';
      try {
        const web3Response = await fetch('http://localhost:5000/api/web3/status');
        if (web3Response.ok) {
          const web3Data = await web3Response.json();
          web3Status = web3Data.data?.connected ? 'connected' : 'disconnected';
          contractStatus = web3Data.data?.contractDeployed ? 'deployed' : 'not deployed';
        }
      } catch (error) {
        web3Status = 'error';
      }

      // Check marketplace API
      let itemCount = 0;
      try {
        const marketplaceResponse = await fetch('http://localhost:5000/api/marketplace');
        if (marketplaceResponse.ok) {
          const marketplaceData = await marketplaceResponse.json();
          itemCount = marketplaceData.total || 0;
        }
      } catch (error) {
        console.log('Marketplace API error:', error);
      }

      setStatus({
        backend: backendStatus,
        web3: web3Status,
        contract: contractStatus,
        lastCheck: new Date().toLocaleTimeString(),
        marketplaceItems: itemCount
      });
    } catch (error) {
      setStatus({
        backend: 'disconnected',
        web3: 'disconnected',
        contract: 'unknown',
        lastCheck: new Date().toLocaleTimeString(),
        marketplaceItems: 0
      });
    }
  };

  useEffect(() => {
    checkBackend();
    const interval = setInterval(checkBackend, 10000); // Check every 10 seconds
    return () => clearInterval(interval);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'connected':
      case 'deployed': 
        return 'text-green-500';
      case 'disconnected':
      case 'not deployed': 
        return 'text-red-500';
      case 'error':
      case 'unknown': 
        return 'text-orange-500';
      default: 
        return 'text-gray-500';
    }
  };

  return (
    <div className="fixed top-4 right-4 bg-gray-900 text-white p-4 rounded-lg shadow-lg z-50 min-w-[250px]">
      <h3 className="text-lg font-semibold mb-2">System Status</h3>
      <div className="space-y-1 text-sm">
        <div className="flex justify-between">
          <span>Backend:</span>
          <span className={getStatusColor(status.backend)}>
            {status.backend}
          </span>
        </div>
        <div className="flex justify-between">
          <span>Web3:</span>
          <span className={getStatusColor(status.web3)}>
            {status.web3}
          </span>
        </div>
        <div className="flex justify-between">
          <span>Contract:</span>
          <span className={getStatusColor(status.contract)}>
            {status.contract}
          </span>
        </div>
        <div className="flex justify-between">
          <span>Items:</span>
          <span className="text-blue-400">
            {status.marketplaceItems}
          </span>
        </div>
        <div className="text-xs text-gray-400 mt-2">
          Last check: {status.lastCheck}
        </div>
      </div>
      <button 
        onClick={checkBackend}
        className="mt-2 px-3 py-1 bg-blue-600 text-white rounded text-xs hover:bg-blue-700 w-full"
      >
        Refresh Status
      </button>
      
      {status.contract === 'not deployed' && (
        <div className="mt-2 p-2 bg-yellow-900 border border-yellow-600 rounded text-xs">
          ⚠️ Run <code>npm run deploy:contracts</code> to enable Web3 features
        </div>
      )}
    </div>
  );
};

export default BackendStatus;
