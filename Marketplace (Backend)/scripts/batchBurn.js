// Batch burn script for ChainTorqueMarketplace NFTs
// Usage: node batchBurn.js

const { ethers } = require("ethers");
require("dotenv").config();

// --- CONFIG ---
const CONTRACT_ADDRESS = process.env.CONTRACT_ADDRESS;
const ABI = require("../artifacts/contracts/ChainTorqueMarketplace.sol/ChainTorqueMarketplace.json").abi;
const PROVIDER_URL = process.env.RPC_URL;
const PRIVATE_KEY = process.env.PRIVATE_KEY;
const START_TOKEN_ID = Number(process.env.START_TOKEN_ID) || 1;
const END_TOKEN_ID = Number(process.env.END_TOKEN_ID);

async function main() {
    const provider = new ethers.JsonRpcProvider(PROVIDER_URL);
    const wallet = new ethers.Wallet(PRIVATE_KEY, provider);
    const contract = new ethers.Contract(CONTRACT_ADDRESS, ABI, wallet);

    for (let tokenId = START_TOKEN_ID; tokenId <= END_TOKEN_ID; tokenId++) {
        try {
            const owner = await contract.ownerOf(tokenId);
            const approved = await contract.getApproved(tokenId);
            if (owner.toLowerCase() === wallet.address.toLowerCase() || approved.toLowerCase() === wallet.address.toLowerCase()) {
                const tx = await contract.burn(tokenId);
                console.log(`Burned tokenId ${tokenId}: tx ${tx.hash}`);
                await tx.wait();
            } else {
                console.log(`Skipping tokenId ${tokenId}: not owned/approved`);
            }
        } catch (err) {
            console.log(`Error with tokenId ${tokenId}: ${err.message}`);
        }
    }
}

main().catch(console.error);
