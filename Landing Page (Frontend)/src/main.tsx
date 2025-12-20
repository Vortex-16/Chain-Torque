import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'

// Clerk auth redirect - redirect logged-in users to marketplace
const CLERK_PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY
const MARKETPLACE_URL = import.meta.env.VITE_MARKETPLACE_URL || 'http://localhost:8080'

// Load Clerk and redirect authenticated users
if (CLERK_PUBLISHABLE_KEY) {
    const script = document.createElement('script')
    script.src = 'https://cdn.jsdelivr.net/npm/@clerk/clerk-js@latest/dist/clerk.browser.js'
    script.async = true
    script.crossOrigin = 'anonymous'
    script.setAttribute('data-clerk-publishable-key', CLERK_PUBLISHABLE_KEY)
    document.head.appendChild(script)

    script.onload = async () => {
        try {
            // @ts-ignore - Clerk is loaded from CDN
            await window.Clerk.load()
            // @ts-ignore
            if (window.Clerk.user) {
                // User is logged in, redirect to marketplace
                window.location.href = MARKETPLACE_URL
            }
        } catch (error) {
            console.log('Clerk not loaded yet')
        }
    }
}

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <App />
    </React.StrictMode>,
)
