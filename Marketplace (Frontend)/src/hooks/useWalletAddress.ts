import { useUser } from '@clerk/clerk-react';
import { useState, useEffect } from 'react';

/**
 * Centralized hook for getting the user's wallet address with consistent priority:
 * 1. localStorage (explicitly connected wallet)
 * 2. Clerk Web3 Wallet
 * 3. Clerk unsafeMetadata.walletAddress
 * 
 * This ensures all pages use the same wallet address.
 */
export function useWalletAddress() {
    const { user, isLoaded } = useUser();
    const [walletAddress, setWalletAddress] = useState<string | null>(null);

    useEffect(() => {
        if (!isLoaded) return;

        // Priority 1: localStorage (user explicitly connected this wallet)
        const connectedWallet = localStorage.getItem('walletAddress');

        // Priority 2: Clerk's Web3 wallet
        const clerkWeb3Wallet = user?.primaryWeb3Wallet?.web3Wallet;

        // Priority 3: Saved in Clerk metadata during signup
        const metadataWallet = user?.unsafeMetadata?.walletAddress as string | undefined;

        // Use first available in priority order
        const resolvedAddress = connectedWallet || clerkWeb3Wallet || metadataWallet || null;

        setWalletAddress(resolvedAddress?.toLowerCase() || null);
    }, [user, isLoaded]);

    return {
        walletAddress,
        isLoaded,
        hasWallet: !!walletAddress
    };
}
