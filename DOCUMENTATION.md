# ChainTorque: Complete Documentation

## 📚 Comprehensive Guide to the Web3 Engineering Platform

---

# 📖 Page 1: Project Overview & Architecture

## 🎯 Vision and Mission

**ChainTorque** is a revolutionary Web3 engineering platform that transforms how 3D models and engineering assets are created, shared, and monetized. By combining blockchain technology, artificial intelligence, and professional-grade CAD tools, ChainTorque creates a decentralized ecosystem where creators retain full ownership and control of their engineering designs.

### The Problem We Solve

Traditional 3D model marketplaces face critical challenges:
- **Lack of Ownership Verification**: No immutable proof of who created a design
- **Licensing Ambiguity**: Unclear usage rights and distribution terms
- **Centralized Control**: Platform owners control content and can remove it arbitrarily
- **Limited Tooling**: Buyers must use external software to modify purchased models
- **No Fair Compensation**: Creators don't receive royalties on resales

### Our Solution

ChainTorque addresses these challenges through:
1. **NFT-Based Licensing**: Every 3D model is minted as an NFT with blockchain-verified ownership
2. **Decentralized Storage**: Models stored on IPFS for permanent, censorship-resistant access
3. **Browser-Based CAD Editor**: Professional 3D modeling tools accessible from any browser
4. **AI Assistant "Torquy"**: Intelligent copilot for CAD operations and design optimization
5. **Smart Contract Royalties**: Automatic royalty distribution to original creators on every resale
6. **Interactive Previews**: Full 3D model inspection before purchase

---

## 🏗️ System Architecture

### High-Level Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                        USER INTERFACE LAYER                      │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  ┌─────────────────┐  ┌──────────────────┐  ┌────────────────┐ │
│  │  Landing Page   │  │   Marketplace    │  │   CAD Editor   │ │
│  │   (Next.js)     │  │  (React+Vite)    │  │    (React)     │ │
│  │   Port: 5000    │  │   Port: 5173     │  │  Port: 3000    │ │
│  └────────┬────────┘  └────────┬─────────┘  └───────┬────────┘ │
│           │                    │                     │           │
└───────────┼────────────────────┼─────────────────────┼───────────┘
            │                    │                     │
            └────────────────────┼─────────────────────┘
                                 │
┌────────────────────────────────▼─────────────────────────────────┐
│                        BACKEND SERVICES                           │
├───────────────────────────────────────────────────────────────────┤
│                                                                   │
│  ┌─────────────────┐  ┌──────────────────┐  ┌────────────────┐ │
│  │   Express API   │  │  AI Copilot API  │  │ WASM Geometry  │ │
│  │   Port: 5001    │  │   (Python ML)    │  │    Engine      │ │
│  └────────┬────────┘  └────────┬─────────┘  └───────┬────────┘ │
│           │                    │                     │           │
└───────────┼────────────────────┼─────────────────────┼───────────┘
            │                    │                     │
            └────────────────────┼─────────────────────┘
                                 │
┌────────────────────────────────▼─────────────────────────────────┐
│                        DATA & BLOCKCHAIN LAYER                    │
├───────────────────────────────────────────────────────────────────┤
│                                                                   │
│  ┌─────────────────┐  ┌──────────────────┐  ┌────────────────┐ │
│  │    MongoDB      │  │      IPFS        │  │   Blockchain   │ │
│  │  (User Data)    │  │  (3D Models)     │  │   (Ethereum/   │ │
│  │  (Metadata)     │  │  (Images)        │  │    Polygon)    │ │
│  └─────────────────┘  └──────────────────┘  └────────────────┘ │
│                                                                   │
└───────────────────────────────────────────────────────────────────┘
```

### Component Breakdown

#### 1. **Frontend Components**

##### Landing Page (Next.js - Port 5000)
- **Purpose**: Marketing website and entry point
- **Features**: 
  - Project introduction and value proposition
  - Feature highlights and benefits
  - Call-to-action for marketplace and CAD editor
  - Responsive design with modern UI
- **Technology**: Next.js for SEO optimization and fast loading

##### Marketplace (React + Vite - Port 5173)
- **Purpose**: Browse, search, and purchase 3D models as NFTs
- **Key Features**:
  - 3D model catalog with filtering and search
  - Interactive 3D preview using Three.js
  - Wallet connection (MetaMask integration)
  - NFT minting and purchasing
  - Model upload and listing
  - User profiles and transaction history
- **Technology**: React with Vite for fast development, Three.js for 3D rendering

##### CAD Editor (React - Port 3000)
- **Purpose**: Professional browser-based CAD modeling tool
- **Key Features**:
  - Professional CAD interface (similar to AutoCAD/Fusion360)
  - Tool palette (line, circle, rectangle, polygon, text, etc.)
  - Transformation tools (move, rotate, scale)
  - Grid and crosshair guidelines
  - "Torquy" AI assistant panel for natural language commands
  - Status bar with real-time feedback (coordinates, FPS)
  - Model import from marketplace
- **Technology**: React, Three.js, React Three Fiber, React Three Drei

#### 2. **Backend Services**

##### Express API Server (Node.js/Bun - Port 5001)
- **Purpose**: Central API for all frontend services
- **Responsibilities**:
  - User authentication and authorization
  - Database operations (CRUD for users, models, transactions)
  - File upload handling (Multer middleware)
  - IPFS integration for model storage
  - Smart contract interaction
  - Transaction processing
- **Key Routes**:
  - `/api/marketplace/*` - Marketplace operations
  - `/api/user/*` - User management
  - `/api/upload` - File uploads to IPFS
- **Technology**: Express.js, Mongoose (MongoDB ODM), Bun runtime

##### AI Copilot Service (Python - Planned)
- **Purpose**: Natural language processing for CAD commands
- **Capabilities**:
  - Natural language to CAD operation conversion
  - Design optimization suggestions
  - Geometry analysis and recommendations
  - Model quality assessment
- **Technology**: Python, Scikit-learn, PyTorch/TensorFlow, HuggingFace Transformers

##### WASM Geometry Engine (Rust - Planned)
- **Purpose**: High-performance client-side geometry operations
- **Operations**:
  - Boolean operations (union, difference, intersection)
  - Extrusion and revolution
  - Filleting and chamfering
  - Mesh optimization
- **Technology**: Rust compiled to WebAssembly

#### 3. **Data & Blockchain Layer**

##### MongoDB Database
- **Purpose**: Fast querying and user-centric data storage
- **Collections**:
  - **Users**: User profiles, preferences, wallet addresses
  - **MarketItems**: Model metadata, prices, categories
  - **Transactions**: Purchase history, transfer records
- **Advantage**: Quick search, filtering, and user experience optimization

##### IPFS (InterPlanetary File System)
- **Purpose**: Decentralized storage for 3D models and images
- **Benefits**:
  - Censorship-resistant content storage
  - Permanent availability (content-addressed storage)
  - Reduced server costs
  - True decentralization
- **Integration**: Lighthouse SDK for file uploads

##### Blockchain (Ethereum/Polygon)
- **Purpose**: NFT ownership and transaction immutability
- **Smart Contract**: `ChainTorqueMarketplace.sol`
- **Key Functions**:
  - NFT minting (ERC-721 standard)
  - Marketplace listings and sales
  - Royalty management (2.5% platform fee)
  - Creator authorization
  - Batch operations for gas efficiency
- **Technology**: Solidity, Hardhat, OpenZeppelin contracts, Ethers.js

---

## 🔐 Hybrid Storage Strategy

ChainTorque uses a sophisticated three-tier storage architecture:

### Why Hybrid Storage?

**Challenge**: Pure blockchain storage is expensive and slow, while centralized storage lacks decentralization benefits.

**Solution**: Combine the strengths of all three storage types:

```
┌──────────────────────────────────────────────────────────────┐
│                    STORAGE DISTRIBUTION                       │
├──────────────────────────────────────────────────────────────┤
│                                                               │
│  BLOCKCHAIN                    IPFS              MongoDB     │
│  ═══════════                 ════════            ═════════    │
│  • NFT Ownership             • 3D Models        • User Data  │
│  • Transaction Hash          • STL Files        • Profiles   │
│  • Token Metadata            • Model Images     • Search     │
│  • Smart Contract State      • Thumbnails       • Cache      │
│  • Immutable Ledger          • Large Files      • Analytics  │
│                                                               │
│  HIGH COST, IMMUTABLE        LOW COST, PERMANENT  FAST QUERY │
└──────────────────────────────────────────────────────────────┘
```

### Storage Decision Matrix

| Data Type | Storage | Reason |
|-----------|---------|--------|
| NFT Ownership | Blockchain | Immutable, trustless verification |
| 3D Model Files | IPFS | Permanent, decentralized, low cost |
| Model Images | IPFS | Content delivery, permanence |
| User Profiles | MongoDB | Fast queries, mutable data |
| Search Index | MongoDB | Performance, complex queries |
| Transaction History | MongoDB | Fast access, duplicated from blockchain |

---

## 🔒 Security Architecture

### Smart Contract Security
- **OpenZeppelin**: Battle-tested contract libraries
- **ReentrancyGuard**: Protection against reentrancy attacks
- **Pausable**: Emergency stop mechanism
- **Access Control**: Role-based permissions
- **Gas Optimization**: Packed structs, batch operations

### API Security
- **CORS**: Restricted cross-origin requests
- **Rate Limiting**: Prevent abuse
- **Input Validation**: Sanitize all user inputs
- **File Upload Limits**: Maximum file sizes enforced
- **Authentication**: JWT/Clerk integration planned

### Storage Security
- **IPFS Content Addressing**: Tamper-proof file references
- **MongoDB Encryption**: Data encryption at rest
- **Environment Variables**: Sensitive data in .env files
- **Private Keys**: Never exposed to frontend

---

# 📖 Page 2: Workflow & System Design

## 🔄 Complete User Workflows

### Workflow 1: Creator Uploading a 3D Model

```
┌─────────────────────────────────────────────────────────────────┐
│                    MODEL UPLOAD WORKFLOW                         │
└─────────────────────────────────────────────────────────────────┘

1. Creator Opens Marketplace
   └─> Connects wallet (MetaMask)
   └─> Authenticates with blockchain address

2. Navigate to "Upload Model" Section
   └─> Fill in model details:
       • Name and description
       • Category (Mechanical, Architectural, etc.)
       • Price in ETH
       • Royalty percentage (default 2.5%)
   └─> Upload 3D model file (STL, OBJ, GLB)
   └─> Upload preview images

3. Backend Processing
   └─> File received by Express API (Multer middleware)
   └─> Model uploaded to IPFS via Lighthouse SDK
   └─> IPFS returns content hash (CID)
   └─> Metadata stored in MongoDB for quick access
   
4. NFT Minting
   └─> Frontend calls smart contract `createMarketItem()`
   └─> Smart contract:
       • Mints new ERC-721 NFT
       • Sets token URI pointing to IPFS
       • Creates marketplace listing
       • Emits `MarketItemCreated` event
   └─> Transaction confirmed on blockchain
   
5. Model Listed
   └─> Model appears in marketplace catalog
   └─> Searchable by category, price, creator
   └─> Preview available with 3D viewer
```

### Workflow 2: Engineer Purchasing a Model

```
┌─────────────────────────────────────────────────────────────────┐
│                    MODEL PURCHASE WORKFLOW                       │
└─────────────────────────────────────────────────────────────────┘

1. Engineer Browses Marketplace
   └─> Filters by category, price range
   └─> Searches by keywords
   └─> Views model catalog grid

2. Model Preview
   └─> Clicks on model card
   └─> Interactive 3D viewer loads
   └─> Rotates, zooms, inspects model
   └─> Reviews description, price, license

3. Purchase Decision
   └─> Clicks "Buy Now" button
   └─> Confirms wallet connection
   └─> Reviews transaction details:
       • Model price
       • Gas fees
       • Platform fee (0.00025 ETH)

4. Blockchain Transaction
   └─> Calls smart contract `createMarketSale()`
   └─> Smart contract:
       • Transfers NFT ownership
       • Sends payment to seller
       • Deducts platform fee
       • Updates item status to "sold"
       • Emits `MarketItemSold` event
   └─> Transaction confirmed

5. Post-Purchase
   └─> NFT appears in buyer's wallet
   └─> Model available in "My Models" section
   └─> Can download from IPFS
   └─> Can open in CAD Editor for modifications
   └─> Transaction recorded in MongoDB for history
```

### Workflow 3: Using the CAD Editor with AI Assistant

```
┌─────────────────────────────────────────────────────────────────┐
│                    CAD EDITING WORKFLOW                          │
└─────────────────────────────────────────────────────────────────┘

1. Launch CAD Editor
   └─> Opens at http://localhost:3000
   └─> Professional CAD interface loads
   └─> Grid and guidelines visible

2. Load Model (Two Options)
   
   Option A: From Marketplace
   └─> Click "Load from Marketplace"
   └─> Select owned NFT model
   └─> Model loaded from IPFS via CID
   └─> Rendered in 3D viewport
   
   Option B: Create New
   └─> Start with blank canvas
   └─> Use drawing tools to create shapes

3. Manual Editing
   └─> Select tool from sidebar:
       • Line, Circle, Rectangle, Polygon
       • Text annotation
       • Move, Rotate, Scale
   └─> Draw or transform geometry
   └─> Real-time visual feedback
   └─> Status bar shows coordinates, angles

4. AI-Assisted Editing (Future Feature)
   └─> Open "Torquy" AI assistant panel
   └─> Type natural language command:
       • "Create a 10mm fillet on all edges"
       • "Extrude this face by 5mm"
       • "Optimize this part for 3D printing"
   └─> AI processes command:
       • Parses natural language
       • Identifies target geometry
       • Generates CAD operations
       • Returns WASM function calls
   └─> WASM engine executes geometry operations
   └─> Model updates in real-time

5. Export and Save
   └─> Click "Export" in toolbar
   └─> Choose format: STL, OBJ, GLB, STEP
   └─> Option to save back to IPFS
   └─> Option to mint as new derivative NFT
```

---

## ⚙️ Technical System Design

### Frontend Architecture Pattern

**Pattern**: Component-Based Architecture with Monorepo Structure

```
ChainTorque/
├── Landing Page (Frontend)/     # Marketing Site
│   ├── views/                   # EJS templates
│   ├── public/                  # Static assets
│   └── app.js                   # Next.js/Express server
│
├── Marketplace (Frontend)/      # NFT Marketplace
│   ├── src/
│   │   ├── components/          # Reusable UI components
│   │   ├── pages/               # Route pages
│   │   ├── hooks/               # Custom React hooks
│   │   ├── context/             # State management
│   │   └── utils/               # Helper functions
│   └── vite.config.ts           # Vite configuration
│
└── CAD (Frontend)/              # CAD Editor
    ├── src/
    │   ├── App.js               # Main CAD interface
    │   ├── App.css              # CAD-specific styling
    │   └── components/          # CAD UI components
    └── package.json
```

### Backend Architecture Pattern

**Pattern**: Layered Architecture (MVC-inspired)

```
backend/
├── server.js                    # Application entry point
├── web3.js                      # Blockchain integration
│
├── routes/                      # API endpoints
│   ├── marketplace.js           # Marketplace API routes
│   └── user.js                  # User management routes
│
├── models/                      # Data models (Mongoose schemas)
│   ├── User.js                  # User schema
│   ├── MarketItem.js            # Market item schema
│   └── Transaction.js           # Transaction schema
│
├── middleware/                  # Express middleware
│   └── auth.js                  # Authentication middleware
│
├── services/                    # Business logic
│   └── lighthouseStorage.js    # IPFS integration
│
├── contracts/                   # Smart contracts
│   └── ChainTorqueMarketplace.sol
│
└── scripts/                     # Deployment scripts
    └── deploy.js                # Contract deployment
```

### Database Schema Design

#### MongoDB Collections

**Users Collection**
```javascript
{
  _id: ObjectId,
  walletAddress: String (unique),
  username: String,
  email: String,
  profileImage: String (IPFS CID),
  bio: String,
  createdAt: Date,
  updatedAt: Date,
  ownedTokens: [Number],      // Token IDs
  createdTokens: [Number],    // Token IDs
  transactionHistory: [ObjectId]
}
```

**MarketItems Collection**
```javascript
{
  _id: ObjectId,
  tokenId: Number (unique),
  name: String,
  description: String,
  price: Number,              // in Wei
  category: Number,
  royalty: Number,            // basis points
  modelFileIPFS: String,      // IPFS CID
  imageIPFS: String,          // IPFS CID
  seller: String,             // wallet address
  owner: String,              // wallet address
  creator: String,            // original creator address
  sold: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

**Transactions Collection**
```javascript
{
  _id: ObjectId,
  tokenId: Number,
  seller: String,
  buyer: String,
  price: Number,
  transactionHash: String,    // Blockchain tx hash
  blockNumber: Number,
  timestamp: Date,
  type: String                // "sale", "mint", "relist"
}
```

### Smart Contract Architecture

**ChainTorqueMarketplace.sol** - Key Functions

```solidity
// NFT Creation & Minting
function createMarketItem(
    string memory tokenURI,
    uint128 price,
    uint32 category,
    uint24 royaltyBPS
) public payable returns (uint256)

// Purchase
function createMarketSale(uint256 tokenId) 
    public payable nonReentrant

// Relisting
function relistItem(uint256 tokenId, uint128 newPrice) 
    public

// Batch Operations
function createBatchMarketItems(
    string[] memory tokenURIs,
    uint128[] memory prices,
    uint32[] memory categories,
    uint24[] memory royalties
) public payable returns (uint256[] memory)

// Query Functions
function fetchMarketItems() public view 
    returns (MarketItem[] memory)

function fetchMyNFTs() public view 
    returns (MarketItem[] memory)

function fetchItemsCreated() public view 
    returns (MarketItem[] memory)
```

**Gas Optimization Techniques**
- Packed structs to minimize storage slots
- Batch operations to reduce transaction count
- Events for off-chain indexing
- View functions for free data queries

---

## 🔗 Integration Points

### Frontend ↔ Backend Communication

**REST API Endpoints**

```
POST   /api/marketplace/items        # Create marketplace item
GET    /api/marketplace/items        # Get all items
GET    /api/marketplace/items/:id    # Get specific item
PUT    /api/marketplace/items/:id    # Update item
DELETE /api/marketplace/items/:id    # Delete item

POST   /api/marketplace/upload       # Upload to IPFS
POST   /api/marketplace/purchase     # Record purchase

GET    /api/user/profile             # Get user profile
PUT    /api/user/profile             # Update profile
GET    /api/user/owned               # Get owned NFTs
GET    /api/user/created             # Get created NFTs
```

### Frontend ↔ Blockchain Communication

**Web3 Integration (Ethers.js)**

```javascript
// Connect Wallet
const provider = new ethers.providers.Web3Provider(window.ethereum);
await provider.send("eth_requestAccounts", []);
const signer = provider.getSigner();

// Load Contract
const contract = new ethers.Contract(
    CONTRACT_ADDRESS,
    CONTRACT_ABI,
    signer
);

// Call Contract Functions
const tx = await contract.createMarketItem(
    tokenURI,
    price,
    category,
    royalty,
    { value: listingPrice }
);
await tx.wait();
```

### Backend ↔ IPFS Communication

**Lighthouse SDK Integration**

```javascript
const lighthouse = require('@lighthouse-web3/sdk');

// Upload to IPFS
const uploadResponse = await lighthouse.upload(
    filePath,
    process.env.LIGHTHOUSE_API_KEY
);
const ipfsCID = uploadResponse.data.Hash;

// Retrieve from IPFS
const fileURL = `https://gateway.lighthouse.storage/ipfs/${ipfsCID}`;
```

---

## 🚀 Deployment Architecture

### Development Environment
- **Runtime**: Bun (3x faster than Node.js)
- **Concurrency**: All services run simultaneously via concurrently
- **Hot Reload**: Vite HMR for frontend, Nodemon for backend
- **Local Blockchain**: Hardhat local network for testing

### Production Environment (Planned)
- **Frontend Hosting**: Vercel or Netlify
- **Backend Hosting**: AWS EC2 or Azure
- **Database**: MongoDB Atlas (cloud)
- **Blockchain**: Ethereum mainnet or Polygon
- **IPFS**: Pinned via Lighthouse or Pinata
- **CDN**: CloudFlare for static assets

---

# 📖 Page 3: Target Audience & Use Cases

## 👥 Who Is ChainTorque For?

### Primary Target Audiences

#### 1. **3D Model Creators & Engineers** 🎨

**Profile**: Professional CAD designers, mechanical engineers, architects, product designers

**Pain Points**:
- Current marketplaces (TurboSquid, CGTrader) take 40-60% commission
- No proof of original authorship
- No ongoing royalties from resales
- Platform can remove content arbitrarily
- Licensing terms are unclear and difficult to enforce

**How ChainTorque Helps**:
✅ **Low Platform Fee**: Only 2.5% (vs 40-60% on traditional platforms)
✅ **Blockchain Verification**: Immutable proof of creation and ownership
✅ **Automatic Royalties**: Earn on every resale automatically via smart contracts
✅ **Decentralized Storage**: Models can't be removed or censored
✅ **Clear Licensing**: NFT-based licensing makes usage rights transparent
✅ **Professional Tools**: Browser-based CAD editor for creating and editing

**Use Cases**:
- Upload mechanical parts library and earn passive income
- Mint architectural designs as NFTs with usage licenses
- Create derivative works from purchased models
- Build reputation with verified creation history

---

#### 2. **Engineering Teams & Manufacturers** 🏭

**Profile**: Product development teams, manufacturing companies, R&D departments

**Pain Points**:
- Expensive CAD software licenses (AutoCAD, SolidWorks: $1,000-$5,000/year)
- Time-consuming part design from scratch
- Difficulty verifying authenticity of purchased models
- No easy way to collaborate on designs
- Vendor lock-in with proprietary file formats

**How ChainTorque Helps**:
✅ **Free Browser-Based CAD**: No expensive software licenses needed
✅ **Ready-Made Parts**: Purchase verified, quality 3D models instead of designing from scratch
✅ **Ownership Verification**: Blockchain ensures authenticity and IP protection
✅ **AI Assistance**: "Torquy" speeds up design process with natural language commands
✅ **Universal Formats**: Support for STL, OBJ, STEP, GLB formats

**Use Cases**:
- Purchase standardized mechanical components for assemblies
- Verify authenticity of critical engineering designs
- Collaborate on designs with verifiable version history
- Quickly prototype with AI-assisted modifications

---

#### 3. **3D Printing Enthusiasts & Hobbyists** 🖨️

**Profile**: Makers, hobbyists, 3D printing community members

**Pain Points**:
- Limited free model availability on Thingiverse
- Poor quality or incomplete models
- No guarantee models are printable
- Can't easily customize purchased models
- Unclear licensing for commercial use

**How ChainTorque Helps**:
✅ **Quality Models**: Marketplace with ratings and reviews
✅ **Interactive Preview**: Inspect model before purchase
✅ **Easy Customization**: Built-in CAD editor to modify models
✅ **Clear Licensing**: Know exactly how you can use the model
✅ **Fair Pricing**: Creators set prices, not platform monopolies

**Use Cases**:
- Find and purchase printable models with verified quality
- Customize models for specific needs using CAD editor
- Share and monetize own 3D printing designs
- Build collections of NFT models

---

#### 4. **Web3 Developers & Blockchain Enthusiasts** 👨‍💻

**Profile**: Blockchain developers, NFT collectors, Web3 enthusiasts

**Pain Points**:
- Most NFT projects are just art or collectibles
- Few practical utility-focused NFT applications
- Lack of reference implementations for complex Web3 apps
- Difficulty integrating IPFS, smart contracts, and traditional backends

**How ChainTorque Helps**:
✅ **Open Source**: Complete codebase available to learn from
✅ **Practical NFT Utility**: Engineering assets with real-world value
✅ **Full Stack Example**: Integration of React, Express, Solidity, IPFS
✅ **Modern Tech Stack**: Bun, Vite, Hardhat, OpenZeppelin
✅ **Production-Ready Patterns**: Security best practices, gas optimization

**Use Cases**:
- Study and learn Web3 application architecture
- Fork and adapt for other NFT marketplace types
- Contribute to open-source Web3 ecosystem
- Build on top of ChainTorque platform

---

#### 5. **Educators & Students** 📚

**Profile**: Engineering professors, CAD instructors, university students

**Pain Points**:
- Expensive educational CAD licenses
- Limited access to quality practice models
- No platform to share and collaborate on student projects
- Difficulty teaching blockchain in practical context

**How ChainTorque Helps**:
✅ **Free Educational Access**: Browser-based tools, no license fees
✅ **Learning Resource**: Real-world Web3 engineering project
✅ **Model Library**: Practice with professional-grade designs
✅ **Portfolio Building**: Students can mint their designs as NFTs
✅ **Practical Blockchain Education**: Hands-on smart contract interaction

**Use Cases**:
- Teach CAD fundamentals with browser-based editor
- Demonstrate blockchain technology in engineering context
- Students build portfolios with NFT-verified projects
- Collaborate on group projects with ownership tracking

---

## 🎯 Specific Use Cases & User Stories

### Use Case 1: Freelance Mechanical Engineer

**Scenario**: Sarah is a freelance mechanical engineer who designs custom parts for clients.

**Problem**: She spends weeks designing similar components repeatedly. Traditional marketplaces take 50% commission on her uploads.

**ChainTorque Solution**:
1. Sarah uploads her part library to ChainTorque marketplace
2. Sets prices and 5% royalty on resales
3. Earns passive income while focusing on custom client work
4. Uses CAD editor to quickly modify existing designs for new clients
5. Builds verifiable reputation with blockchain creation history
6. Retains 97.5% of sales (only 2.5% platform fee)

**Benefit**: **Time savings + Fair compensation + Passive income**

---

### Use Case 2: Manufacturing Startup

**Scenario**: TechMech is a hardware startup developing a new product.

**Problem**: CAD software costs $15,000/year for 5 licenses. Designing all custom parts from scratch takes months.

**ChainTorque Solution**:
1. Team uses free ChainTorque CAD editor (saves $15,000/year)
2. Purchases verified standardized components from marketplace
3. Uses AI assistant to quickly adapt parts for their needs
4. Reduces design time from 3 months to 3 weeks
5. Verifies authenticity of critical safety components via blockchain

**Benefit**: **$15,000 saved + 10x faster development + Verified components**

---

### Use Case 3: 3D Printing Entrepreneur

**Scenario**: Mike runs a 3D printing service and wants to sell custom phone cases.

**Problem**: Designing each model from scratch takes 4 hours. Existing models have unclear licensing.

**ChainTorque Solution**:
1. Purchases base phone case model with commercial license
2. Uses CAD editor to customize with customer's design
3. Clear NFT licensing shows commercial use is allowed
4. Reduces design time from 4 hours to 30 minutes
5. Can resell successful designs in marketplace

**Benefit**: **8x faster production + Clear licensing + New revenue stream**

---

### Use Case 4: Open Source Hardware Project

**Scenario**: OpenMech is developing an open-source robotics platform.

**Problem**: Need to track component contributions, verify authenticity, and credit contributors fairly.

**ChainTorque Solution**:
1. All component designs minted as NFTs with creator attribution
2. Blockchain provides immutable contribution history
3. AI assistant helps community members modify and improve designs
4. Contributors earn royalties when derivatives are sold
5. Project maintains verifiable component provenance

**Benefit**: **Fair attribution + Incentivized contributions + Verified authenticity**

---

## 🚀 Getting Started with ChainTorque

### For Creators (Upload Your First Model)

**Step 1: Set Up Your Wallet**
```bash
# Install MetaMask browser extension
# Create wallet or import existing
# Switch to Polygon or Ethereum testnet
```

**Step 2: Clone and Run ChainTorque**
```bash
# Install Bun
curl -fsSL https://bun.sh/install | bash

# Clone repository
git clone https://github.com/Dealer-09/ChainTorque.git
cd ChainTorque

# Install dependencies
bun install

# Start all services
bun run dev

# Access marketplace at http://localhost:5173
```

**Step 3: Upload Your Model**
1. Navigate to marketplace (http://localhost:5173)
2. Connect your MetaMask wallet
3. Click "Upload Model" button
4. Fill in model details (name, description, category, price)
5. Upload your 3D model file (.STL, .OBJ, .GLB)
6. Upload preview images
7. Set royalty percentage
8. Click "Mint NFT" and confirm transaction
9. Wait for blockchain confirmation
10. Your model is now listed!

**Step 4: Start Earning**
- Share your model link on social media
- Model appears in search results
- Earn sales revenue automatically
- Receive royalties on resales

---

### For Engineers (Purchase and Edit Models)

**Step 1: Browse Marketplace**
```bash
# Start ChainTorque
bun run dev

# Open marketplace
# http://localhost:5173
```

**Step 2: Find Your Model**
1. Use search bar or filter by category
2. Click on model to preview
3. Inspect 3D model interactively (rotate, zoom)
4. Check price, description, license terms
5. Review creator's reputation

**Step 3: Purchase**
1. Click "Buy Now"
2. Connect MetaMask wallet
3. Review transaction details
4. Confirm purchase in wallet
5. Wait for blockchain confirmation
6. NFT ownership transferred to you

**Step 4: Edit in CAD Editor**
1. Navigate to CAD Editor (http://localhost:3000)
2. Click "Load from Marketplace"
3. Select your purchased model
4. Model loads in 3D viewport
5. Use tools to modify design
6. Export in your preferred format

---

### For Developers (Contribute to ChainTorque)

**Step 1: Development Setup**
```bash
# Fork and clone repository
git clone https://github.com/YOUR_USERNAME/ChainTorque.git
cd ChainTorque

# Install dependencies
bun install

# Set up environment variables
cp .env.example .env
# Edit .env with your credentials:
# - MongoDB connection string
# - Lighthouse API key
# - Blockchain RPC URL
# - Private key for deployment
```

**Step 2: Run Local Development**
```bash
# Start all services
bun run dev

# Or run individually:
bun run dev:landing      # Landing page (Port 5000)
bun run dev:marketplace  # Marketplace (Port 5173)
bun run dev:backend      # Backend API (Port 5001)
bun run dev:cad          # CAD editor (Port 3000)
```

**Step 3: Deploy Smart Contracts Locally**
```bash
# Start local Hardhat blockchain
cd backend
bun x hardhat node

# In another terminal, deploy contracts
bun x hardhat run scripts/deploy.js --network localhost

# Contract address saved to contract-address.json
```

**Step 4: Run Tests**
```bash
# Smart contract tests
bun run test:contracts

# Frontend linting
bun run lint

# Format code
bun run format
```

**Step 5: Contribute**
1. Create feature branch: `git checkout -b feature/your-feature`
2. Make changes following project conventions
3. Test thoroughly
4. Commit: `git commit -m "Add your feature"`
5. Push: `git push origin feature/your-feature`
6. Open Pull Request on GitHub

**Areas for Contribution**:
- 🤖 AI/ML - Enhance Torquy AI assistant capabilities
- 🎨 Frontend - Improve UI/UX of marketplace and CAD editor
- 🔧 Blockchain - Smart contract optimization and features
- 📚 Documentation - Improve guides and tutorials
- 🧪 Testing - Add test coverage
- 🌐 Internationalization - Add language support

---

## 📊 Project Roadmap

### ✅ Phase 1: Foundation (Completed)
- Project architecture and monorepo setup
- Landing page and branding
- Marketplace frontend with 3D previews
- CAD editor UI with professional interface
- Backend API with Express and MongoDB
- Smart contract development and deployment
- IPFS integration with Lighthouse
- Basic NFT minting and marketplace functionality

### 🔄 Phase 2: Intelligence (In Progress)
- AI Copilot backend development
  - Natural language processing for CAD commands
  - Design optimization algorithms
  - Model quality analysis
- WASM geometry engine
  - Boolean operations
  - Parametric modeling
  - Mesh optimization
- Enhanced CAD editor features
  - Advanced transformation tools
  - Constraint-based modeling
  - Assembly capabilities

### 📋 Phase 3: Scale (Planned - Q1 2024)
- Multi-chain support (Polygon, BSC, Arbitrum)
- Mobile app (React Native)
- Real-time collaboration features
- Advanced search and recommendation system
- Creator verification and badges
- Enterprise API for bulk operations
- Performance optimization

### 🚀 Phase 4: Innovation (Planned - Q2 2024)
- AR/VR integration for model visualization
- Generative AI for model creation
- Parametric model marketplace
- Model versioning and branches
- Advanced royalty distribution (contributors)
- Integration with major CAD software (plugins)
- Enterprise partnerships

---

## 🤝 Community & Support

### Join the ChainTorque Community

**GitHub**: [https://github.com/Dealer-09/ChainTorque](https://github.com/Dealer-09/ChainTorque)
- ⭐ Star the repository
- 🐛 Report bugs and issues
- 💡 Suggest features
- 🔧 Submit pull requests

### Getting Help

**Documentation**: You're reading it! Refer to:
- README.md - Quick start and overview
- CAD (Frontend)/README.md - CAD editor details
- CAD (Frontend)/INTEGRATION.md - Integration guide

**Code Examples**: Browse the codebase for implementation patterns:
- `/backend/routes/marketplace.js` - API endpoint examples
- `/backend/contracts/ChainTorqueMarketplace.sol` - Smart contract reference
- `/Marketplace (Frontend)/src/` - Frontend React patterns

### Project Statistics

- **Languages**: JavaScript, TypeScript, Solidity, Python
- **License**: MIT (Open Source)
- **Runtime**: Bun (3x faster than Node.js)
- **Smart Contract Standard**: ERC-721 (NFT)
- **Blockchain Networks**: Ethereum, Polygon (Sepolia testnet)

---

## 📄 License & Legal

### Open Source License
ChainTorque is released under the **MIT License**.

**You are free to**:
- ✅ Use commercially
- ✅ Modify and adapt
- ✅ Distribute copies
- ✅ Use privately
- ✅ Sublicense

**You must**:
- 📄 Include copyright notice
- 📄 Include license text

**Limitations**:
- ❌ No warranty provided
- ❌ No liability accepted

### NFT Licensing
Each NFT minted on ChainTorque includes metadata specifying:
- **Usage Rights**: Commercial, personal, educational
- **Attribution**: Required or not required
- **Derivatives**: Allowed or restricted
- **Redistribution**: Terms for sharing

**Important**: Purchasing an NFT grants you the license specified in the token metadata, not copyright ownership of the design itself (unless explicitly stated).

---

## 🎓 Educational Value

ChainTorque serves as a comprehensive learning resource for:

### Web3 Development
- **Smart Contract Development**: Solidity best practices, OpenZeppelin integration
- **Gas Optimization**: Packed structs, batch operations, event design
- **Security Patterns**: ReentrancyGuard, Pausable, access control

### Full-Stack Engineering
- **Monorepo Architecture**: Workspace management, shared dependencies
- **React Best Practices**: Hooks, context, component composition
- **API Design**: RESTful endpoints, error handling, validation
- **Database Modeling**: MongoDB schemas, indexing strategies

### Blockchain Integration
- **Web3 Libraries**: Ethers.js for contract interaction
- **Wallet Connection**: MetaMask integration patterns
- **Transaction Management**: Handling pending, success, and failure states
- **Event Listening**: Real-time blockchain event processing

### Decentralized Storage
- **IPFS Integration**: Content addressing, gateway usage
- **File Handling**: Upload, retrieval, pinning strategies
- **Hybrid Storage**: Combining blockchain, IPFS, and traditional databases

---

## 🌟 Why ChainTorque Matters

### The Future of Engineering Assets

ChainTorque represents a paradigm shift in how engineering designs are:
- **Created**: With AI assistance and professional browser tools
- **Owned**: Blockchain-verified, immutable ownership
- **Shared**: Decentralized, censorship-resistant distribution
- **Monetized**: Fair compensation with automatic royalties
- **Licensed**: Clear, enforceable usage rights

### Vision for 2025 and Beyond

We envision a world where:
- 🌍 **Every engineer** has access to professional CAD tools, regardless of location or income
- 🔗 **Blockchain verification** is standard for engineering designs and IP protection
- 🤖 **AI assistants** make complex CAD operations accessible to everyone
- 💰 **Creators earn fairly** with transparent, automatic royalty systems
- 🌐 **Decentralization** ensures permanent access to critical engineering knowledge

### Join Us in Building the Future

ChainTorque is more than a platform—it's a movement toward democratizing engineering design and establishing fair compensation for creators in the Web3 era.

**Start your journey today**: Clone the repository, explore the code, mint your first engineering NFT, and become part of the ChainTorque revolution.

---

<div align="center">

# 🔗⚙️ ChainTorque

**Building the Future of Engineering, One Block at a Time**

[![GitHub Stars](https://img.shields.io/github/stars/Dealer-09/ChainTorque?style=social)](https://github.com/Dealer-09/Chain-Torque)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Made with Bun](https://img.shields.io/badge/Made%20with-Bun-black)](https://bun.sh)
[![Web3](https://img.shields.io/badge/Web3-Enabled-blue)](https://ethereum.org/)

[Get Started](#-getting-started-with-chaintorque) • [Contribute](https://github.com/Dealer-09/ChainTorque) • [Documentation](#)

**Version 1.0.0** | Created by Archisman Pal | December 2024

</div>
