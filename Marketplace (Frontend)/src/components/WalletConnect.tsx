import { useState, useEffect } from "react";
import { useUser } from "@clerk/clerk-react";
import { MetaMaskInpageProvider } from "@metamask/providers";

declare global {
  interface Window {
    ethereum?: MetaMaskInpageProvider;
  }
}

export default function WalletConnect() {
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [status, setStatus] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const { user } = useUser();

  async function connectWallet() {
    if (!window.ethereum) {
      setStatus("MetaMask not found.");
      return;
    }

    try {
      setLoading(true);
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });
      const address = accounts[0];
      setWalletAddress(address);
      setStatus("Wallet connected!");

      if (user) {
        await user.update({
          unsafeMetadata: {
            walletAddress: address,
          },
        });
        setStatus("Wallet address saved to your profile!");
      }
    } catch (err) {
      setStatus("Wallet connection failed.");
    } finally {
      setLoading(false);
    }
  }

  // Detect account changes
  useEffect(() => {
    if (window.ethereum) {
      window.ethereum.on("accountsChanged", (accounts: string[]) => {
        setWalletAddress(accounts[0] || null);
      });
    }
  }, []);

  return (
    <div className="my-4 p-4 border rounded-lg bg-background">
      {!walletAddress ? (
        <button
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
          onClick={connectWallet}
          disabled={loading}
        >
          {loading ? "Connecting..." : "Connect Wallet"}
        </button>
      ) : (
        <div className="mt-2 text-green-600">Connected: {walletAddress}</div>
      )}
      {status && <div className="mt-2 text-gray-700">{status}</div>}
    </div>
  );
}
