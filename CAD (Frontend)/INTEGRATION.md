# CAD Frontend Integration Guide

## Overview
This CAD Frontend is integrated into the ChainTorque monorepo as a workspace. It provides a professional CAD interface that will eventually connect to:

- **AI Copilot Backend**: For natural language CAD commands
- **Blockchain**: For model ownership verification  
- **IPFS**: For loading and saving 3D models
- **WASM Geometry Engine**: For client-side CAD operations

## Current Features
- ✅ Professional CAD-style interface
- ✅ Tool palette with drawing, editing, and annotation tools
- ✅ Grid and crosshair guidelines
- ✅ ChainTorque branding and styling
- ✅ AI Copilot panel (UI only, not connected)
- ✅ Status bar with real-time info

## Integration Points for Future Development

### 1. Three.js 3D Viewer Integration
```javascript
// Replace the placeholder in App.js with:
import { Canvas } from '@react-three/fiber'
import { OrbitControls, Environment } from '@react-three/drei'

// In the canvas-area div:
<Canvas camera={{ position: [0, 0, 5], fov: 45 }}>
  <ambientLight intensity={0.4} />
  <directionalLight position={[10, 10, 5]} intensity={1} />
  <OrbitControls enablePan={true} enableZoom={true} enableRotate={true} />
  {/* 3D model components will go here */}
  <Environment preset="studio" />
</Canvas>
```

### 2. AI Copilot Backend Connection
```javascript
// Add WebSocket or REST API connection:
const sendAICommand = async (prompt) => {
  const response = await fetch('/api/ai/copilot', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ 
      prompt, 
      modelContext: getCurrentModelContext(),
      selection: getCurrentSelection() 
    })
  });
  return response.json();
};
```

### 3. Blockchain Integration
```javascript
// Connect to ChainTorque marketplace for model loading:
import { ethers } from 'ethers';

const loadModelFromNFT = async (tokenId) => {
  // Verify ownership
  // Load model from IPFS
  // Display in 3D viewer
};
```

### 4. WASM Geometry Operations
```javascript
// Import WASM modules for client-side geometry operations:
import init, { 
  create_extrusion, 
  apply_fillet, 
  boolean_union 
} from '../wasm/geometry_engine.js';

const executeCADOperation = async (operation) => {
  await init(); // Initialize WASM
  return create_extrusion(operation.params);
};
```

## Development Workflow

1. **UI Development**: Continue refining the interface in this directory
2. **3D Integration**: Add Three.js components gradually
3. **Backend Connection**: Connect to AI and blockchain services
4. **WASM Integration**: Add geometry operations for real-time editing

## File Structure
```
src/
├── App.js              # Main application component
├── App.css             # ChainTorque styling
├── components/         # Future: individual UI components
├── hooks/              # Future: custom React hooks
├── utils/              # Future: utility functions
└── wasm/               # Future: WASM geometry modules
```

## Dependencies to Add Later
- `@react-three/fiber` and `@react-three/drei` (already in package.json)
- `three` (already in package.json)
- `ethers` (available from main project)
- Custom WASM modules for geometry operations

## Testing
```bash
# From main ChainTorque directory:
npm run dev:cad

# Or from this directory:
npm start
```

The interface will be available at http://localhost:3000
