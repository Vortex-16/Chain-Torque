interface HeaderProps {
    darkMode: boolean
    toggleDarkMode: () => void
}

export default function Header({ darkMode, toggleDarkMode }: HeaderProps) {
    return (
        <>
            {/* Unique Floating Pill Navigation */}
            <nav className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 transition-all duration-500">
                <div className="navbar-pill flex items-center gap-2 px-3 py-2 rounded-full">
                    {/* Logo */}
                    <a href="/" className="flex items-center gap-2 px-3 py-1.5 rounded-full hover:bg-white/10 transition-all duration-300">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                            <span className="text-white font-bold text-sm">CT</span>
                        </div>
                        <span className="text-lg font-bold text-gradient hidden sm:inline">ChainTorque</span>
                    </a>

                    {/* Divider */}
                    <div className="w-px h-6 bg-slate-200 dark:bg-white/20 hidden sm:block" />

                    {/* Nav Links */}
                    <div className="hidden md:flex items-center">
                        <a href="#library" className="nav-pill-link px-4 py-1.5 rounded-full text-sm font-medium section-subtitle hover:bg-white/10 hover:text-white transition-all duration-300">
                            Library
                        </a>
                        <a href="#features" className="nav-pill-link px-4 py-1.5 rounded-full text-sm font-medium section-subtitle hover:bg-white/10 hover:text-white transition-all duration-300">
                            Features
                        </a>
                        <a href="#testimonials" className="nav-pill-link px-4 py-1.5 rounded-full text-sm font-medium section-subtitle hover:bg-white/10 hover:text-white transition-all duration-300">
                            Reviews
                        </a>
                    </div>

                    {/* Divider */}
                    <div className="w-px h-6 bg-slate-200 dark:bg-white/20 hidden md:block" />

                    {/* Right Actions */}
                    <div className="flex items-center gap-2">
                        {/* Theme Toggle */}
                        <button
                            onClick={toggleDarkMode}
                            className="w-9 h-9 rounded-full flex items-center justify-center bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 transition-all duration-300 group"
                        >
                            <i className={`fas ${darkMode ? 'fa-sun' : 'fa-moon'} text-slate-600 dark:text-slate-400 group-hover:text-amber-500 transition-colors`} />
                        </button>

                        {/* Login Button */}
                        <a href="#" className="nav-login-btn flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-semibold text-white transition-all duration-300">
                            <span>Login</span>
                            <i className="fas fa-arrow-right text-xs" />
                        </a>
                    </div>
                </div>
            </nav>
        </>
    )
}
