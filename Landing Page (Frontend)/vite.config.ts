import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

export default defineConfig({
    server: {
        host: '::',
        port: 5000,
        allowedHosts: true, // Allow all hosts (Render, etc.)
    },
    plugins: [react()],
    // Load .env from monorepo root (parent directory)
    envDir: path.resolve(__dirname, '..'),
    resolve: {
        alias: {
            '@': path.resolve(__dirname, './src'),
        },
    },
    // Configure for monorepo - look for dependencies in root node_modules
    optimizeDeps: {
        include: ['react', 'react-dom', 'lucide-react', 'react-router-dom', '@clerk/clerk-react'],
    },
})
