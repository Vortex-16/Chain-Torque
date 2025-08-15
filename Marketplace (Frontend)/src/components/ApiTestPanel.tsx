import React, { useState, useEffect } from 'react';
import apiService from '../services/apiService';

interface TestResult {
  success: boolean;
  data?: any;
  error?: string;
}

interface TestResults {
  health?: TestResult;
  web3Status?: TestResult;
  marketplace?: TestResult;
  stats?: TestResult;
}

const ApiTestPanel = () => {
  const [testResults, setTestResults] = useState<TestResults>({});
  const [loading, setLoading] = useState(false);

  const runApiTests = async () => {
    setLoading(true);
    const results: TestResults = {};

    // Test 1: Health Check
    try {
      const health = await apiService.healthCheck();
      results.health = { success: true, data: health };
    } catch (error: any) {
      results.health = { success: false, error: error.message };
    }

    // Test 2: Web3 Status
    try {
      const web3Status = await apiService.getWeb3Status();
      results.web3Status = { success: true, data: web3Status };
    } catch (error: any) {
      results.web3Status = { success: false, error: error.message };
    }

    // Test 3: Marketplace Items
    try {
      const marketplace = await apiService.getMarketplaceItems();
      results.marketplace = { success: true, data: marketplace };
    } catch (error: any) {
      results.marketplace = { success: false, error: error.message };
    }

    // Test 4: Marketplace Stats
    try {
      const stats = await apiService.getMarketplaceStats();
      results.stats = { success: true, data: stats };
    } catch (error: any) {
      results.stats = { success: false, error: error.message };
    }

    setTestResults(results);
    setLoading(false);
  };

  useEffect(() => {
    runApiTests();
  }, []);

  const renderTestResult = (testName: string, result?: TestResult) => {
    if (!result) return null;

    return (
      <div key={testName} className="border rounded p-3 mb-2">
        <div className="flex items-center justify-between mb-2">
          <h4 className="font-medium">{testName}</h4>
          <span className={`px-2 py-1 rounded text-xs ${
            result.success ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
          }`}>
            {result.success ? 'PASS' : 'FAIL'}
          </span>
        </div>
        
        {result.success ? (
          <div className="text-sm">
            <strong>Response:</strong>
            <pre className="mt-1 bg-gray-100 p-2 rounded text-xs overflow-auto max-h-32">
              {JSON.stringify(result.data, null, 2)}
            </pre>
          </div>
        ) : (
          <div className="text-sm text-red-600">
            <strong>Error:</strong> {result.error}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="fixed bottom-4 left-4 bg-white border shadow-lg rounded-lg p-4 max-w-md max-h-96 overflow-auto z-50">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-lg font-semibold">API Tests</h3>
        <button
          onClick={runApiTests}
          disabled={loading}
          className="px-3 py-1 bg-blue-600 text-white rounded text-xs hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? 'Testing...' : 'Retest'}
        </button>
      </div>

      <div className="space-y-2">
        {renderTestResult('Health Check', testResults.health)}
        {renderTestResult('Web3 Status', testResults.web3Status)}
        {renderTestResult('Marketplace Items', testResults.marketplace)}
        {renderTestResult('Marketplace Stats', testResults.stats)}
      </div>

      {Object.keys(testResults).length > 0 && (
        <div className="mt-3 pt-3 border-t text-xs text-gray-600">
          Tests completed: {Object.keys(testResults).length}/4
        </div>
      )}
    </div>
  );
};

export default ApiTestPanel;
