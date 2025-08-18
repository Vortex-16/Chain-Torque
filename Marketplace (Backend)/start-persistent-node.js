const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

// Create persistent data directory
const dataDir = path.join(__dirname, 'blockchain-data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
  console.log('📁 Created blockchain data directory:', dataDir);
}

console.log('🚀 Starting persistent Hardhat node...');
console.log('💾 Blockchain state will be saved to:', dataDir);

// Start Hardhat node with persistence
const hardhatNode = spawn('npx', [
  'hardhat', 'node',
  '--hostname', '127.0.0.1',
  '--port', '8545'
], {
  cwd: __dirname,
  stdio: 'inherit',
  shell: true
});

// Handle process termination
process.on('SIGINT', () => {
  console.log('\n🛑 Shutting down Hardhat node...');
  hardhatNode.kill('SIGINT');
  process.exit(0);
});

process.on('SIGTERM', () => {
  console.log('\n🛑 Terminating Hardhat node...');
  hardhatNode.kill('SIGTERM');
  process.exit(0);
});

hardhatNode.on('close', (code) => {
  console.log(`\n✅ Hardhat node exited with code ${code}`);
  process.exit(code);
});

hardhatNode.on('error', (error) => {
  console.error('❌ Error starting Hardhat node:', error);
  process.exit(1);
});
