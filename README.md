# ChainTorque

### _Web3 Engineering Platform with AI-Powered CAD Editor_

> **ChainTorque** revolutionizes 3D model platforms by combining blockchain technology, AI-driven optimization, and real-time 3D interaction to create a secure, transparent, and intelligent platform for engineering assets.

## 🚀 **What is ChainTorque?**

ChainTorque is a comprehensive Web3 platform that solves critical problems in the 3D engineering space:

- **🛡️ NFT-Based Licensing**: Blockchain-verified ownership and licensing
- **🎮 Interactive 3D Previews**: Inspect models before purchasing
- **🤖 AI Assistant "Torquy"**: Intelligent CAD editing and optimization
- **🎨 Browser-Based CAD Editor**: Professional 3D modeling tools
- **🌐 Decentralized Storage**: IPFS integration for censorship resistance

## 🏗️ **Project Structure**

```
ChainTorque/
├── Landing Page (Frontend)/     # Vite + React marketing site (Port 5000)
├── Marketplace (Frontend)/      # Vite + React NFT marketplace (Port 8080)
├── backend/                     # Express API + Smart contracts (Port 5001)
└── CAD (Frontend)/              # React CAD editor with Torquy AI (Port 3001)
```

## 🛠️ **Technologies Used**

- **Runtime**: Bun (3x faster than Node.js)
- **Frontend**: Next.js, React, Three.js, Tailwind CSS, Vite
- **Backend**: Express, WASM + Rust, Socket.IO, MongoDB, IPFS
- **Blockchain**: Solidity (ERC-721), Hardhat, Ethereum/Polygon, Web3.js, OpenZeppelin
- **AI/ML**: Python (Scikit-learn, Pandas, PyTorch/TensorFlow, HuggingFaceTransformers), VectorDB
- **DevOps**: Github Actions, Docker, AWS EC2/Azure

## 🏗️ **Hybrid Storage Architecture**

ChainTorque uses a dual-storage approach for optimal performance and decentralization:

- **IPFS**: Stores 3D model files and images for permanent, censorship-resistant access
- **MongoDB**: Handles user profiles, transaction history, and search for fast queries
- **Blockchain**: Records ownership and ensures immutable transaction history

This architecture provides instant user experiences while maintaining true Web3 decentralization for engineering assets.


## 🚀 **Quick Start**

### Prerequisites
Install [Bun](https://bun.sh) - a fast all-in-one JavaScript runtime:
```sh
# Windows (PowerShell)
powershell -c "irm bun.sh/install.ps1|iex"

# macOS/Linux
curl -fsSL https://bun.sh/install | bash
```

### Installation & Running
```sh
# Clone and install
git clone https://github.com/Dealer-09/ChainTorque.git
cd ChainTorque
bun install

# Start all services (⚡ 3x faster than npm/pnpm)
bun run dev

# Or run individual services
bun run dev:landing      # Landing page (Port 5000)
bun run dev:marketplace  # Marketplace frontend (Port 8080)
bun run dev:backend      # Backend API (Port 5001)
bun run dev:cad          # CAD editor with Torquy (Port 3001)
```

> **Why Bun?** This project uses [Bun](https://bun.sh) for lightning-fast performance, smaller footprint, and native TypeScript support. No more slow installs! 🚀

## 🎯 **Key Features**

### **For Creators**
- Upload and mint 3D models as NFTs
- Set custom licensing and pricing
- AI-powered model optimization
- Automatic royalty distribution

### **For Engineers**
- Interactive 3D model previews
- Professional browser-based CAD tools
- "Torquy" AI assistant for design help
- Blockchain-verified ownership

### **For Developers**
- Open-source modular architecture
- Web3 integration examples
- AI/ML implementation patterns
- Comprehensive API documentation

## 🗺️ **Development Status**

**✅ Completed**
- Project architecture (Bun monorepo)
- 3D marketplace with NFT minting & purchasing
- Decentralized purchase flow (MetaMask → Smart Contract → IPFS)
- ETH payments: 97.5% to seller, 2.5% platform fee
- CAD editor with Three.js visualization
- "Torquy" AI assistant interface
- Smart contract on Sepolia testnet
- IPFS storage via Lighthouse
- Search & category filtering
- Purchased items display with download
- Wallet address consistency across pages
- Dashboard with user stats

**🔄 In Progress**
- Render.com deployment
- Relist/resale functionality
- Wishlist & cart persistence

**📋 Planned**
- User profile pages
- Sales history view
- Multi-chain support (Polygon)
- AR/VR model preview
- Mobile app

## 🤝 **Contributing**

We welcome contributions! Areas of focus:

- **🤖 AI/ML**: Enhance Torquy's capabilities
- **🎨 Frontend**: Improve user experience
- **🔧 Blockchain**: Smart contract optimization
- **📝 Documentation**: Help others understand the codebase

## 📄 **License**

MIT License - see [LICENSE](LICENSE) for details.

---

<div align="center">

**🔗⚙️ Building the Future of Engineering, One Block at a Time**

[![Get Started](https://img.shields.io/badge/Get%20Started-0066cc?style=for-the-badge&logo=rocket)](#quick-start)
[![Contribute](https://img.shields.io/badge/Contribute-28a745?style=for-the-badge&logo=github)](#contributing)

</div>
