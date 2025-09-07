# ChainTorque

### _The Web3 Engineering Marketplace Reinvented_

![ChainTorque Banner](https://via.placeholder.com/800x200/1a1a2e/16a085?text=ChainTorque+-+Web3+Engineering+Marketplace)

> **ChainTorque** revolutionizes 3D model marketplaces by combining blockchain technology, AI-driven optimization, and real-time 3D interaction to create a secure, transparent, and intelligent platform for engineering assets.

## 🏗️ **Current Development Status**


**Phase 1: Foundation** _(Mostly Completed)_

- ✅ **Project Structure**: Clean frontend and backend architecture
- ✅ **Landing Page**: Express.js + EJS templating engine
- ✅ **Marketplace Frontend**: React + TypeScript + Vite setup
- ✅ **CAD Frontend**: Browser-based CAD editor UI with professional tools
- ✅ **Backend API**: Node.js + Express server, NFT minting, IPFS integration
- ✅ **Smart Contract**: Solidity ERC721 contract, deployed and integrated
- ✅ **Wallet-based onboarding**: Clerk + MetaMask integration
- ✅ **Model upload, ownership, and display**
- ✅ **Dashboard and user NFT tracking**
- ✅ **Admin endpoints for model cleanup**
- ✅ **Frontend/Backend integration**
- 🔄 **AI/ML features**: Planned, not yet implemented

**Next Steps**: Implement advanced AI features, mobile app, and multi-chain support

---

## 🧑‍💻 CAD Copilot & AI Assistant Implementation

ChainTorque is building a next-generation CAD Copilot: an LLM-driven assistant that understands engineering prompts, generates safe CAD operations, and previews/executed edits in-browser or server-side. The architecture is modular and phased for rapid, beginner-friendly development.

### CAD Copilot Architecture
- Copilot Orchestrator (Node/TS microservice): Handles prompts, LLM calls, tool plan validation, and execution routing.
- VectorDB / RAG: Stores examples, tool definitions, and domain docs for context retrieval.
- LLM Provider: OpenAI GPT-4o/Gemini API for structured function-calling; self-hosted models later.
- Tool API (JSON Schema): Strict schema for all CAD operations; validated with AJV.
- Validator / Dry-Run: Simulates tool plans for safety and geometry checks.
- Executor: WASM client for instant ops; server worker for heavy jobs (BullMQ + Redis).
- UI: Chat panel, ghost preview overlay, accept/modify/cancel controls.

### Phased Implementation (Beginner-Friendly)
- Phase 0: Orchestrator skeleton, Tool API schema, VectorDB seeding, LLM adapter (1–2 weeks)
- Phase 1: Prompt → Structured Plan, RAG-enhanced prompting, schema enforcement (2–3 weeks)
- Phase 2: Validation & Ghost Preview, dry-run execution, risk scoring, UI preview (2–4 weeks)
- Phase 3: Execution & Job System, WASM ops, server jobs, WebSocket progress (3–5 weeks)
- Phase 4: Domain Intelligence, parametric gear/material modules, microservices (3–6 weeks)
- Phase 5: Analysis & Simulation Hooks, CAE job creation, solver integration (optional, 4–8 weeks)
- Phase 6: Fine-tuning, on-prem inference, privacy controls (ongoing)

### CAD Editing Tool Phases
- Phase 0: Ownership guard for model editing (1–2 days)
- Phase 1: ModelViewer (react-three-fiber), region selection, highlighting (3–5 days)
- Phase 2: Local edits, WASM preview, undo stack (5–8 days)
- Phase 3: Mesh CSG (drill/cut), voxel-based ops, server fallback (4–6 days)
- Phase 4: Server job system, worker, WebSocket notifications (4–7 days)
- Phase 5: Save derivative, mint NFT, licensing checks (3–5 days)
- Phase 6: Polish, performance tuning, autoscaling (ongoing)

### Tech Stack
- Frontend: React + TypeScript, react-three-fiber, three-mesh-bvh, drei
- WASM: Rust + wasm-pack for mesh ops
- Backend: Express + TypeScript, BullMQ + Redis
- Storage: IPFS / Pinata, S3 fallback
- DB: MongoDB/Postgres
- Realtime: ws or socket.io

---

## 🗺️ CAD Copilot & AI Assistant Roadmap (Q3–Q4 2025)
- [ ] Copilot Orchestrator service + LLM adapter + seeded VectorDB
- [ ] Tool API schema + validator
- [ ] Prompt → structured plan (function calling)
- [ ] Dry-run + ghost preview generation (client-friendly mesh diff)
- [ ] Execute small ops in WASM; enqueue heavy ops to worker
- [ ] UI: Chat panel + preview + accept/cancel
- [ ] Derivative metadata + provenance store
- [ ] ModelViewer, region selection, local edits, undo stack
- [ ] Mesh CSG, server job system, WebSocket notifications
- [ ] Save derivative, mint NFT, licensing checks

**Outcome:** Fast, incremental system for secure, responsive 3D model editing and AI-powered engineering assistance.

---

## 🎯 Key Features (Additional)
- AI Copilot: Chat-driven CAD editing, ghost previews, risk scoring, and safe execution
- Beginner-friendly phased development plan

---

## 🚀 Getting Started (Contributor Roles)
- 🤖 AI/CAD Copilot Developer: Help build the Orchestrator, Tool API, and chat-driven CAD features

---

## 🚀 **The Problem We're Solving**

Traditional 3D model marketplaces suffer from critical flaws:

- 🎯 **Blind Purchases**: No way to inspect models before buying
- 🔒 **Lack of Customization**: Buyers forced to settle for fixed designs
- 🏴‍☠️ **No Ownership Security**: Rampant piracy and unauthorized reselling
- 💸 **Creator Exploitation**: Unfair revenue sharing and IP theft

## 💡 **Our Solution**

ChainTorque transforms the marketplace experience through cutting-edge Web3 and AI technologies:

### 🛡️ **NFT-Based Licensing**

- **True Digital Ownership**: Blockchain-verified licenses prevent unauthorized sharing
- **Creator Protection**: Smart contracts ensure fair compensation
- **Transfer Security**: Traceable ownership history on-chain

### 🎮 **Real-Time 3D Interaction**

- **Pre-Purchase Inspection**: Rotate, zoom, and analyze models before buying
- **Interactive Previews**: Test functionality and quality in real-time
- **WebGL Performance**: Smooth 3D rendering in any modern browser

### 🤖 **AI-Assisted Optimization**

- **Structural Analysis**: AI identifies weaknesses and optimization opportunities
- **Quality Scoring**: Automated assessment of model integrity
- **Performance Recommendations**: Suggestions for efficiency improvements

### 🎨 **Dynamic Customization**

- **Parameter Adjustment**: Modify designs before minting NFTs
- **Real-Time Rendering**: See changes instantly in 3D space
- **Custom Licensing**: Flexible terms for different use cases

### 🌐 **Decentralized Infrastructure**

- **IPFS Storage**: Censorship-resistant, distributed file storage
- **Blockchain Payments**: Secure, trustless transactions
- **Smart Contract Automation**: Automated licensing and royalties

---

## 🏗️ **Technology Stack**

### **Frontend**

- **Next.js 14+**: React framework with App Router
- **Three.js**: High-performance 3D visualization
- **TypeScript**: Type-safe development
- **Tailwind CSS**: Modern, responsive UI design
- **Web3.js/Ethers**: Blockchain interaction

### **Backend**

- **Node.js + Express**: RESTful API server
- **MongoDB**: User profiles and metadata storage
- **IPFS**: Decentralized file storage
- **AI/ML APIs**: Model analysis and optimization

### **Blockchain**

- **Solidity**: Smart contract development
- **Ethereum/Polygon**: Primary blockchain networks
- **OpenZeppelin**: Security-audited contract libraries
- **Hardhat**: Development and deployment framework

### **DevOps & Tools**

- **Docker**: Containerized deployments
- **AWS/Vercel**: Scalable cloud hosting
- **GitHub Actions**: CI/CD automation
- **Pinata**: IPFS pinning service

---

## 📁 **Project Structure**

```
ChainTorque/
├── Landing Page (Frontend)/     # Express.js + EJS landing page
├── Marketplace (Frontend)/      # React + Vite marketplace interface
├── Marketplace (Backend)/       # Node.js + Express API & smart contracts
├── CAD (Frontend)/              # Browser-based CAD editor interface
├── AI Implementaion.md          # AI Copilot architecture & implementation plan
├── Cad Implementaion.md         # CAD editor phased development plan
└── README.md                    # This file
```

### **Quick Start Commands**

```bash
# Run all services
npm run dev:all

# Run individual services
npm run dev:landing          # Landing page (Express)
npm run dev:marketplace      # Marketplace frontend (Vite)
npm run dev:backend         # Backend API (Node.js)
npm run dev:cad             # CAD editor (React)

# Smart contract operations
npm run node:hardhat        # Start local blockchain
npm run deploy:local        # Deploy contracts locally
npm run deploy:sepolia      # Deploy to Sepolia testnet
```

---

## 🎯 **Key Features**

### For **Creators**

- ✅ Upload and mint 3D models as NFTs
- ✅ Set custom licensing terms and pricing
- ✅ Receive automatic royalties on resales
- ✅ AI-powered optimization suggestions
- ✅ Protected intellectual property rights

### For **Buyers**

- ✅ Interactive 3D model previews
- ✅ AI quality assessments before purchase
- ✅ Customizable design parameters
- ✅ Verified ownership certificates
- ✅ Secure blockchain transactions

### For **The Ecosystem**

- ✅ Transparent transaction history
- ✅ Community-driven quality standards
- ✅ Decentralized governance (future)
- ✅ Cross-platform compatibility
- ✅ Environmental sustainability focus

---

## 🗺️ **Roadmap**


### **Phase 1: Foundation** (Q2 2025)

- [x] Core smart contract development
- [x] Basic 3D viewer implementation
- [x] User authentication system (wallet-based)
- [x] IPFS integration
- [x] MVP marketplace launch

### **Phase 2: Intelligence** (Q3 2025)

### **Phase 2: Intelligence** (Q3 2025)

- [ ] AI model analysis engine (planned)
- [ ] Advanced customization tools (planned)
- [ ] Quality scoring system (planned)
- [ ] Mobile app development (planned)
- [ ] Creator analytics dashboard (planned)

### **Phase 3: Expansion** (Q4 2025)

### **Phase 3: Expansion** (Q4 2025)

- [ ] Multi-chain support (Polygon, BSC) (planned)
- [ ] Advanced licensing options (planned)
- [ ] Collaborative design tools (planned)
- [ ] Enterprise partnerships (planned)
- [ ] Token governance launch (planned)

### **Phase 4: Revolution** (Q1 2026)

### **Phase 4: Revolution** (Q1 2026)

- [ ] AR/VR integration (future)
- [ ] Cross-metaverse compatibility (future)
- [ ] AI-generated model variations (future)
- [ ] Global developer ecosystem (future)
- [ ] Industry standard adoption (future)

---

## 🚀 **Getting Started**

### **Prerequisites**

- Node.js 18+ and npm/yarn
- MetaMask or compatible Web3 wallet
- Git for version control

### **Prerequisites**

- Node.js 18+ and npm/yarn
- MetaMask or compatible Web3 wallet
- Git for version control

### **Quick Setup**

```powershell
# Clone the repository

cd ChainTorque

# Install dependencies for frontend and backend
cd "Marketplace (Frontend)"
- 🔧 **Blockchain Developer**: Help improve our smart contracts
cd "../Marketplace (Backend)"
- 🎨 **Frontend Developer**: Enhance the user experience

# Start development servers
cd "../Marketplace (Frontend)"
- 🤖 **AI/ML Engineer**: Advance our optimization algorithms
cd "../Marketplace (Backend)"
- 🎯 **3D Artist**: Create demo content and test models
```

### **Smart Contract Deployment**

```powershell
# Compile contracts
npx hardhat compile

# Deploy to local network
npx hardhat run scripts/deploy.js --network localhost

# Deploy to testnet
npx hardhat run scripts/deploy.js --network sepolia
```
- 📝 **Technical Writer**: Improve documentation

### **How to Contribute**

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

---

## 📄 **License**

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🌟 **Showcase at Apertre 2.0**

ChainTorque is proud to be featured at the **Apertre 2.0 Web3 Ideathon**, demonstrating how blockchain and AI can transform real-world engineering applications beyond collectibles.

### **Demo Highlights**

- Live 3D model interaction
- Real-time NFT minting
- AI optimization in action
- Seamless blockchain integration

---

## 📞 **Connect With Us**

- 🌐 **Website**: [chaintorque.io](https://chaintorque.io)
- 🐦 **Twitter**: [@ChainTorque](https://twitter.com/ChainTorque)
- 💬 **Discord**: [Join our community](https://discord.gg/chaintorque)
- 📧 **Email**: hello@chaintorque.io
- 📱 **LinkedIn**: [ChainTorque](https://linkedin.com/company/chaintorque)

---

## 🎖️ **Acknowledgments**

- **OpenZeppelin** for secure smart contract libraries
- **Three.js** community for 3D rendering excellence
- **IPFS** for decentralized storage innovation
- **Ethereum Foundation** for blockchain infrastructure
- **All contributors** who believe in the future of Web3 engineering

---

<div align="center">

### 🔗⚙️ **Building the Future of Engineering, One Block at a Time**

_Ready to revolutionize how the world shares and owns 3D engineering assets?_

[![Get Started](https://img.shields.io/badge/Get%20Started-0066cc?style=for-the-badge&logo=rocket)](https://github.com/your-username/ChainTorque)
[![Join Discord](https://img.shields.io/badge/Join%20Discord-7289da?style=for-the-badge&logo=discord)](https://discord.gg/chaintorque)
[![Follow Twitter](https://img.shields.io/badge/Follow-1da1f2?style=for-the-badge&logo=twitter)](https://twitter.com/ChainTorque)

</div>
