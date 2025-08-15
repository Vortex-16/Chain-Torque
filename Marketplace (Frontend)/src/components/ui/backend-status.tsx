import { useBackendHealth, useWeb3Status } from "@/hooks/useWeb3";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, XCircle, AlertCircle, Loader2, Wifi, WifiOff } from "lucide-react";

export function BackendStatus() {
  const health = useBackendHealth();
  const { initialized, network, contract, loading, error, initializeWeb3 } = useWeb3Status();

  const getStatusIcon = (status) => {
    switch (status) {
      case 'OK':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'error':
        return <XCircle className="h-4 w-4 text-red-500" />;
      default:
        return <AlertCircle className="h-4 w-4 text-yellow-500" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'OK':
      case true:
        return 'bg-green-100 text-green-800 border-green-200';
      case 'error':
      case false:
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    }
  };

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {health.loading ? (
            <Loader2 className="h-5 w-5 animate-spin" />
          ) : health.status === 'OK' ? (
            <Wifi className="h-5 w-5 text-green-500" />
          ) : (
            <WifiOff className="h-5 w-5 text-red-500" />
          )}
          Backend Status
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Backend Health */}
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">Backend Server:</span>
          <div className="flex items-center gap-2">
            {getStatusIcon(health.status)}
            <Badge className={getStatusColor(health.status)}>
              {health.loading ? 'Checking...' : health.status}
            </Badge>
          </div>
        </div>

        {/* Web3 Status */}
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">Web3 Service:</span>
          <div className="flex items-center gap-2">
            {loading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : initialized ? (
              <CheckCircle className="h-4 w-4 text-green-500" />
            ) : (
              <XCircle className="h-4 w-4 text-red-500" />
            )}
            <Badge className={getStatusColor(initialized)}>
              {loading ? 'Loading...' : initialized ? 'Connected' : 'Disconnected'}
            </Badge>
          </div>
        </div>

        {/* IPFS Status */}
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">IPFS Storage:</span>
          <div className="flex items-center gap-2">
            {getStatusIcon(health.services?.ipfs ? 'OK' : 'error')}
            <Badge className={getStatusColor(health.services?.ipfs)}>
              {health.services?.ipfs ? 'Connected' : 'Disconnected'}
            </Badge>
          </div>
        </div>

        {/* Network Info */}
        {network && (
          <div className="pt-2 border-t">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Network:</span>
              <span className="text-sm text-muted-foreground">
                {network.networkName} (Chain ID: {network.chainId})
              </span>
            </div>
            <div className="flex items-center justify-between mt-1">
              <span className="text-sm font-medium">Block:</span>
              <span className="text-sm text-muted-foreground">
                #{network.blockNumber}
              </span>
            </div>
          </div>
        )}

        {/* Contract Info */}
        {contract && (
          <div className="pt-2 border-t">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Smart Contract:</span>
              <Badge className={getStatusColor(contract.deployed)}>
                {contract.deployed ? 'Deployed' : 'Not Deployed'}
              </Badge>
            </div>
            {contract.address && (
              <div className="text-xs text-muted-foreground mt-1 break-all">
                {contract.address}
              </div>
            )}
            {contract.stats && (
              <div className="grid grid-cols-3 gap-4 mt-2 text-sm">
                <div className="text-center">
                  <div className="font-medium">{contract.stats.totalTokens || 0}</div>
                  <div className="text-xs text-muted-foreground">Total NFTs</div>
                </div>
                <div className="text-center">
                  <div className="font-medium">{contract.stats.totalSold || 0}</div>
                  <div className="text-xs text-muted-foreground">Sold</div>
                </div>
                <div className="text-center">
                  <div className="font-medium">{contract.stats.activeListings || 0}</div>
                  <div className="text-xs text-muted-foreground">Active</div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Error Display */}
        {(health.error || error) && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
            <div className="text-sm text-red-800">
              <strong>Error:</strong> {health.error || error}
            </div>
          </div>
        )}

        {/* Initialize Web3 Button */}
        {!initialized && health.status === 'OK' && (
          <Button 
            onClick={initializeWeb3} 
            disabled={loading}
            className="w-full"
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Initializing...
              </>
            ) : (
              'Initialize Web3 Service'
            )}
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
