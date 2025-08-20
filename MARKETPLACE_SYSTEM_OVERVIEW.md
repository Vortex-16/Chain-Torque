# ChainTorque Marketplace System Overview

## Introduction
ChainTorque Marketplace is a full-stack decentralized application for buying, selling, and managing NFTs (Non-Fungible Tokens) representing CAD models and other digital assets. It uses Ethereum Sepolia testnet for blockchain persistence and Lighthouse IPFS for decentralized file storage.

## Architecture
- **Frontend:** React + TypeScript (Vite)
- **Backend:** Node.js + Express
- **Smart Contract:** Solidity (ChainTorqueMarketplace.sol)
- **Blockchain Network:** Sepolia (via Ankr RPC)
- **Storage:** Lighthouse IPFS
- **Authentication:** Clerk (Frontend)

## Key Components
### 1. Smart Contract
- Handles NFT minting, marketplace listings, purchases, royalties, and batch operations.
- Deployed to Sepolia; contract address stored in `contract-address.json` and `.env`.

### 2. Backend (Marketplace)
- Loads secrets and config from `.env` (never hardcoded).
- Connects to Sepolia using `RPC_URL` and `PRIVATE_KEY`.
- Uses Lighthouse IPFS for file and metadata uploads (`LIGHTHOUSE_API_KEY`).
- Exposes REST API endpoints for:
  - Health check
  - Marketplace item listing
  - NFT creation (minting)
  - Stats and user queries
- All sensitive keys are loaded from environment variables.

### 3. Frontend (Marketplace)
- Loads config from `.env` (never hardcoded).
- Uses Clerk for user authentication.
- Interacts with backend via API service (`apiService.js`).
- Displays marketplace items, product details, dashboard, and upload forms.

## Security & Best Practices
- **No secrets or keys are hardcoded.** All are loaded from `.env`.
- **Sepolia RPC URL** uses a provider API key (Ankr/Infura/Alchemy) managed in `.env`.
- **Private keys** are only in `.env`, never in code.
- **Contract addresses** are loaded from `.env` and `contract-address.json`.
- **File uploads** are stored on IPFS via Lighthouse.

## How It Works
1. **User Authentication:**
   - Users sign in via Clerk (frontend).
2. **NFT Creation:**
   - User uploads CAD files/images via frontend.
   - Backend uploads files/metadata to Lighthouse IPFS.
   - Backend mints NFT on Sepolia using smart contract.
   - Marketplace item is listed and visible to all users.
3. **Marketplace Operations:**
   - Users can view, purchase, and manage NFTs.
   - All blockchain interactions use Sepolia and are signed by backend wallet.
4. **Persistence:**
   - Marketplace data is permanent (blockchain + IPFS).
   - No data is lost on server restart.

## Environment Variables
- All secrets, keys, and config are managed in `.env` files.
- Example keys:
  - `LIGHTHOUSE_API_KEY`
  - `RPC_URL`
  - `PRIVATE_KEY`
  - `CONTRACT_ADDRESS`
  - `VITE_CLERK_PUBLISHABLE_KEY` (frontend)

## Deployment & Production
- Use production `.env` files with secure keys.
- Never commit secrets to source control.
- Backend and frontend are decoupled and can be deployed independently.
- For mainnet, update `RPC_URL` and redeploy contract.

## Summary
ChainTorque Marketplace is a secure, persistent, and decentralized NFT platform for CAD models, leveraging Ethereum and IPFS. All sensitive data is managed via environment variables for maximum security.
