import { useUser } from '@clerk/clerk-react';
import { useState, useEffect } from 'react';

/**
 * Centralized hook for getting the user's wallet address with consistent priority:
 * 1. MetaMask signer (currently connected wallet)
 * 2. localStorage (explicitly connected wallet)
 * 3. Clerk Web3 Wallet
 * 4. Clerk unsafeMetadata.walletAddress
 * 
 * This ensures all pages use the same wallet address.
 */
export function useWalletAddress() {
    const { user, isLoaded } = useUser();
    const [walletAddress, setWalletAddress] = useState<string | null>(null);

    useEffect(() => {
        const resolveWallet = async () => {
            if (!isLoaded) return;

            // Priority 0: Get from MetaMask if connected (most reliable for recent transactions)
            let metamaskAddress: string | null = null;
            if (typeof window !== 'undefined' && window.ethereum) {
                try {
                    const accounts = await window.ethereum.request({ method: 'eth_accounts' }) as string[];
                    if (accounts && accounts.length > 0) {
                        metamaskAddress = accounts[0];
                    }
                } catch (e) {
                    // MetaMask not available or not connected
                }
            }

            // Priority 1: localStorage (user explicitly connected this wallet)
            const connectedWallet = localStorage.getItem('walletAddress');

            // Priority 2: Clerk's Web3 wallet
            const clerkWeb3Wallet = user?.primaryWeb3Wallet?.web3Wallet;

            // Priority 3: Saved in Clerk metadata during signup
            const metadataWallet = user?.unsafeMetadata?.walletAddress as string | undefined;

            // Use first available in priority order
            const resolvedAddress = metamaskAddress || connectedWallet || clerkWeb3Wallet || metadataWallet || null;

            setWalletAddress(resolvedAddress?.toLowerCase() || null);
        };

        resolveWallet();
    }, [user, isLoaded]);

    return {
        walletAddress,
        isLoaded,
        hasWallet: !!walletAddress
    };
}
