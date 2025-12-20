import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Wallet, ExternalLink, Shield, Zap } from 'lucide-react';
import { useUser } from '@clerk/clerk-react';
import { MetaMaskInpageProvider } from '@metamask/providers';

declare global {
  interface Window {
    ethereum?: MetaMaskInpageProvider;
  }
}

interface WalletConnectionDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConnect?: () => void;
}

export function WalletConnectionDialog({ isOpen, onClose, onConnect }: WalletConnectionDialogProps) {
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<string>('');
  const { user } = useUser();

  const connectWallet = async () => {
    if (!window.ethereum) {
      setStatus('MetaMask not found. Please install MetaMask to continue.');
      return;
    }

    try {
      setLoading(true);
      setStatus('Connecting to MetaMask...');

      const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts',
      }) as string[];

      if (!accounts || accounts.length === 0) {
        setStatus('No accounts found. Please check your MetaMask wallet.');
        return;
      }

      const address = accounts[0];
      setStatus('Saving wallet address...');

      if (user) {
        // Save to localStorage for immediate access
        localStorage.setItem('walletAddress', address);

        await user.update({
          unsafeMetadata: {
            walletAddress: address,
          },
        });
        setStatus('Wallet connected successfully!');

        // Call the onConnect callback if provided
        if (onConnect) {
          onConnect();
        }

        // Close dialog after a brief delay
        setTimeout(() => {
          onClose();
          setStatus('');
        }, 1500);
      }
    } catch (err) {
      console.error('Wallet connection failed:', err);
      setStatus('Failed to connect wallet. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleInstallMetaMask = () => {
    window.open('https://metamask.io/download/', '_blank');
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Wallet className="h-5 w-5 text-primary" />
            Connect Your Wallet
          </DialogTitle>
          <DialogDescription>
            Connect your MetaMask wallet to purchase and trade CAD models on the blockchain.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Benefits */}
          <div className="space-y-3">
            <div className="flex items-center gap-3 text-sm">
              <Shield className="h-4 w-4 text-green-500" />
              <span>Secure blockchain transactions</span>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <Zap className="h-4 w-4 text-blue-500" />
              <span>Instant NFT ownership</span>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <Wallet className="h-4 w-4 text-purple-500" />
              <span>Full control of your assets</span>
            </div>
          </div>

          {/* Connection Status */}
          {status && (
            <div className="p-3 bg-muted rounded-lg">
              <p className="text-sm text-muted-foreground">{status}</p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="space-y-2">
            {window.ethereum ? (
              <Button
                onClick={connectWallet}
                className="w-full bg-gradient-primary hover:bg-primary-hover"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                    Connecting...
                  </>
                ) : (
                  <>
                    <Wallet className="h-4 w-4 mr-2" />
                    Connect MetaMask
                  </>
                )}
              </Button>
            ) : (
              <Button
                onClick={handleInstallMetaMask}
                variant="outline"
                className="w-full"
              >
                <ExternalLink className="h-4 w-4 mr-2" />
                Install MetaMask
              </Button>
            )}

            <Button
              onClick={onClose}
              variant="outline"
              className="w-full"
              disabled={loading}
            >
              Cancel
            </Button>
          </div>

          {/* Info Text */}
          <p className="text-xs text-muted-foreground text-center">
            By connecting your wallet, you agree to our{' '}
            <a href="#" className="text-primary hover:underline">Terms of Service</a>
            {' '}and{' '}
            <a href="#" className="text-primary hover:underline">Privacy Policy</a>
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
