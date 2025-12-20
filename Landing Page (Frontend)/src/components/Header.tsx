import { useState, useEffect } from 'react'
import { Moon, Sun, ArrowRight, Menu, X } from 'lucide-react'

interface HeaderProps {
    darkMode: boolean
    toggleDarkMode: () => void
}

export default function Header({ darkMode, toggleDarkMode }: HeaderProps) {
    const [scrolled, setScrolled] = useState(false)
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 50)
        window.addEventListener('scroll', handleScroll)
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    const navLinks = [
        { href: '#library', label: 'Library' },
        { href: '#features', label: 'Features' },
        { href: '#testimonials', label: 'Reviews' },
        { href: '#pricing', label: 'Pricing' },
    ]

    // Marketplace URL - use environment variable or default
    const marketplaceUrl = import.meta.env.VITE_MARKETPLACE_URL || 'https://chaintorque-marketplace.vercel.app'

    return (
        <nav className={`fixed top-4 left-1/2 transform -translate-x-1/2 z-50 transition-all duration-500 ${scrolled ? 'top-2' : ''}`}>
            <div className="navbar-pill flex items-center gap-2 px-3 py-2 rounded-full">
                {/* Logo */}
                <a href="/" className="flex items-center gap-2 px-3 py-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-white/10 transition-all duration-300">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                        <span className="text-white font-bold text-sm">CT</span>
                    </div>
                    <span className="text-lg font-bold text-gradient hidden sm:inline">ChainTorque</span>
                </a>

                {/* Divider */}
                <div className="w-px h-6 bg-slate-200 dark:bg-white/20 hidden sm:block" />

                {/* Nav Links - Desktop */}
                <div className="hidden md:flex items-center">
                    {navLinks.map((link) => (
                        <a
                            key={link.href}
                            href={link.href}
                            className="px-4 py-1.5 rounded-full text-sm font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-white/10 hover:text-slate-900 dark:hover:text-white transition-all duration-300"
                        >
                            {link.label}
                        </a>
                    ))}
                </div>

                {/* Divider */}
                <div className="w-px h-6 bg-slate-200 dark:bg-white/20 hidden md:block" />

                {/* Right Actions */}
                <div className="flex items-center gap-2">
                    {/* Theme Toggle */}
                    <button
                        onClick={toggleDarkMode}
                        className="w-9 h-9 rounded-full flex items-center justify-center bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 transition-all duration-300"
                    >
                        {darkMode ? (
                            <Sun className="w-4 h-4 text-amber-500" />
                        ) : (
                            <Moon className="w-4 h-4 text-slate-600" />
                        )}
                    </button>

                    {/* Login Button */}
                    <a
                        href={marketplaceUrl}
                        className="flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-semibold text-white bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 transition-all duration-300"
                    >
                        <span>Launch App</span>
                        <ArrowRight className="w-3 h-3" />
                    </a>

                    {/* Mobile Menu Toggle */}
                    <button
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        className="md:hidden w-9 h-9 rounded-full flex items-center justify-center bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 transition-all duration-300"
                    >
                        {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            {mobileMenuOpen && (
                <div className="md:hidden mt-2 navbar-pill rounded-2xl p-4">
                    {navLinks.map((link) => (
                        <a
                            key={link.href}
                            href={link.href}
                            onClick={() => setMobileMenuOpen(false)}
                            className="block px-4 py-2 rounded-lg text-sm font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-white/10 hover:text-slate-900 dark:hover:text-white transition-all duration-300"
                        >
                            {link.label}
                        </a>
                    ))}
                </div>
            )}
        </nav>
    )
}
