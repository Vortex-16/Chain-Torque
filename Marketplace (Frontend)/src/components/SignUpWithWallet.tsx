import { useState } from "react";
import { useSignUp } from "@clerk/clerk-react";
import { MetaMaskInpageProvider } from "@metamask/providers";

declare global {
  interface Window {
    ethereum?: MetaMaskInpageProvider;
  }
}

export default function SignUpWithWallet() {
  // ...existing code...
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);
  const { signUp, setActive } = useSignUp();

  async function connectWallet() {
    if (!window.ethereum) {
      setStatus("MetaMask not found.");
      return;
    }
    try {
      setLoading(true);
      const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
      setWalletAddress(accounts[0]);
      setStatus("Wallet connected!");
    } catch {
      setStatus("Wallet connection failed.");
    } finally {
      setLoading(false);
    }
  }

  async function handleSignUp(e: React.FormEvent) {
    e.preventDefault();
    if (!walletAddress) {
      setStatus("Please connect your wallet first.");
      return;
    }
    setLoading(true);
    try {
      // Use wallet address as dummy email and password for Clerk
      const result = await signUp.create({
        emailAddress: `${walletAddress}@walletuser.com`,
        password: walletAddress,
        unsafeMetadata: { walletAddress },
      });
      await setActive({ session: result.createdSessionId });
      setStatus("Sign up successful! Redirecting...");
      window.location.href = "/";
    } catch {
      setStatus("Sign up failed.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form className="max-w-md mx-auto mt-10 p-6 border rounded-lg bg-background" onSubmit={handleSignUp}>
      <h2 className="text-xl font-bold mb-4">Connect Wallet to Sign Up</h2>
      <button
        type="button"
        className="w-full mb-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
        onClick={connectWallet}
        disabled={loading || !!walletAddress}
      >
        {walletAddress ? "Wallet Connected" : loading ? "Connecting..." : "Connect Wallet"}
      </button>
      <button
        type="submit"
        className="w-full px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50"
        disabled={loading || !walletAddress}
      >
        {loading ? "Signing Up..." : "Sign Up"}
      </button>
      {status && <div className="mt-2 text-gray-700">{status}</div>}
    </form>
  );
}
