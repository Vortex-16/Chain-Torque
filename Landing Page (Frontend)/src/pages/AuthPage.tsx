import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import './AuthPage.css'

const CLERK_PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY
const MARKETPLACE_URL = import.meta.env.VITE_MARKETPLACE_URL || 'http://localhost:8080'

declare global {
    interface Window {
        Clerk?: {
            load: () => Promise<void>
            user?: unknown
            mountSignIn: (element: HTMLElement | null, options: unknown) => void
            mountSignUp: (element: HTMLElement | null, options: unknown) => void
        }
    }
}

const clerkAppearance = {
    baseTheme: 'dark',
    variables: {
        colorPrimary: '#6366f1',
        colorBackground: 'transparent',
        colorInputBackground: 'rgba(255, 255, 255, 0.05)',
        colorInputText: '#f1f5f9',
        colorText: '#e5e7eb',
        colorTextSecondary: '#94a3b8',
        borderRadius: '12px',
    },
    elements: {
        rootBox: 'w-full',
        card: 'bg-transparent shadow-none border-none',
        formButtonPrimary:
            'bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700',
    },
}

interface AuthPageProps {
    type: 'sign-in' | 'sign-up'
}

export default function AuthPage({ type }: AuthPageProps) {
    const clerkMountRef = useRef<HTMLDivElement>(null)
    const [clerkLoaded, setClerkLoaded] = useState(false)
    const [error, setError] = useState<string | null>(null)

    // Load Clerk script dynamically
    useEffect(() => {
        if (!CLERK_PUBLISHABLE_KEY) {
            setError('VITE_CLERK_PUBLISHABLE_KEY is not configured')
            return
        }

        // Check if Clerk is already loaded
        if (window.Clerk) {
            setClerkLoaded(true)
            return
        }

        // Load Clerk script dynamically
        const script = document.createElement('script')
        script.src = 'https://cdn.jsdelivr.net/npm/@clerk/clerk-js@latest/dist/clerk.browser.js'
        script.async = true
        script.crossOrigin = 'anonymous'
        script.setAttribute('data-clerk-publishable-key', CLERK_PUBLISHABLE_KEY)

        script.onload = () => {
            setClerkLoaded(true)
        }

        script.onerror = () => {
            setError('Failed to load Clerk authentication')
        }

        document.head.appendChild(script)

        return () => {
            // Cleanup if needed
        }
    }, [])

    // Mount Clerk component when loaded
    useEffect(() => {
        if (!clerkLoaded || !window.Clerk) return

        const mountClerk = async () => {
            try {
                await window.Clerk!.load()

                // Redirect if already logged in
                if (window.Clerk!.user) {
                    window.location.href = MARKETPLACE_URL
                    return
                }

                // Mount the Clerk component
                if (clerkMountRef.current) {
                    if (type === 'sign-in') {
                        window.Clerk!.mountSignIn(clerkMountRef.current, { appearance: clerkAppearance })
                    } else {
                        window.Clerk!.mountSignUp(clerkMountRef.current, { appearance: clerkAppearance })
                    }
                }

                // Interval to check for login and redirect
                const intervalId = setInterval(() => {
                    if (window.Clerk?.user) {
                        window.location.href = MARKETPLACE_URL
                    }
                }, 1000)

                return () => clearInterval(intervalId)
            } catch (err) {
                console.error('Clerk mount error:', err)
                setError('Failed to initialize authentication')
            }
        }

        mountClerk()
    }, [clerkLoaded, type])

    return (
        <div className="auth-page">
            {/* 3D Grid Background */}
            <div className="grid-bg" />

            {/* Gradient Overlay */}
            <div className="gradient-overlay" />

            {/* Floating Shapes */}
            <div className="floating-shape shape-1" />
            <div className="floating-shape shape-2" />
            <div className="floating-shape shape-3" />
            <div className="floating-shape shape-4" />
            <div className="floating-shape shape-5" />

            {/* Glowing Orbs */}
            <div className="glow-orb orb-1" />
            <div className="glow-orb orb-2" />
            <div className="glow-orb orb-3" />

            {/* Auth Container */}
            <div className="auth-container">
                <div className="auth-card">
                    {/* Header */}
                    <div className="text-center mb-8">
                        <div className="w-20 h-20 mx-auto mb-4 flex items-center justify-center">
                            <img src="/favicon.png" alt="ChainTorque" className="w-20 h-20 object-contain" />
                        </div>
                        <h1 className="text-2xl font-bold text-white mb-2">
                            {type === 'sign-in' ? 'Welcome Back' : 'Join ChainTorque'}
                        </h1>
                        <p className="text-gray-400">
                            {type === 'sign-in' ? 'Sign in to ChainTorque' : 'Create your account'}
                        </p>
                    </div>

                    {/* Error State */}
                    {error && (
                        <div className="text-center mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-xl">
                            <p className="text-red-400 text-sm">{error}</p>
                            <p className="text-gray-400 text-xs mt-2">
                                Please add VITE_CLERK_PUBLISHABLE_KEY to your .env file
                            </p>
                        </div>
                    )}

                    {/* Loading State */}
                    {!clerkLoaded && !error && (
                        <div className="flex justify-center py-8">
                            <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
                        </div>
                    )}

                    {/* Clerk Component Mount Point */}
                    <div ref={clerkMountRef} className="flex justify-center" />

                    {/* Footer Link */}
                    <div className="text-center mt-6">
                        {type === 'sign-in' ? (
                            <Link to="/sign-up" className="text-indigo-400 hover:text-indigo-300 transition-colors">
                                Don't have an account? <span className="font-semibold">Sign up</span>
                            </Link>
                        ) : (
                            <Link to="/sign-in" className="text-indigo-400 hover:text-indigo-300 transition-colors">
                                Already have an account? <span className="font-semibold">Sign in</span>
                            </Link>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}
