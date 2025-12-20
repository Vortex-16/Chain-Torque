import { Twitter, Instagram, Linkedin } from 'lucide-react'

export default function Footer() {
    return (
        <footer className="border-t border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-slate-950/50 py-8 mt-auto">
            <div className="max-w-6xl mx-auto px-6">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-6">
                    {/* Brand */}
                    <div>
                        <a href="/" className="text-lg font-semibold text-gradient">
                            ChainTorque
                        </a>
                        <p className="mt-1 text-xs text-slate-500 max-w-xs">
                            The Web3 marketplace for 3D CAD models.
                        </p>
                    </div>

                    {/* Links */}
                    <div className="flex flex-wrap gap-6">
                        <a href="/" className="text-sm text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors">
                            Home
                        </a>
                        <a href="#features" className="text-sm text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors">
                            Features
                        </a>
                        <a href="#" className="text-sm text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors">
                            Terms
                        </a>
                        <a href="#" className="text-sm text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors">
                            Privacy
                        </a>
                    </div>

                    {/* Social */}
                    <div className="flex items-center gap-3">
                        <a
                            href="https://x.com/Alpha4Coders"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
                            aria-label="X"
                        >
                            <Twitter className="w-4 h-4" />
                        </a>
                        <a
                            href="https://www.instagram.com/alpha_.coders"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
                            aria-label="Instagram"
                        >
                            <Instagram className="w-4 h-4" />
                        </a>
                        <a
                            href="https://www.linkedin.com/company/alpha4coders/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
                            aria-label="LinkedIn"
                        >
                            <Linkedin className="w-4 h-4" />
                        </a>
                    </div>
                </div>

                {/* Copyright */}
                <div className="text-center pt-4 border-t border-slate-200 dark:border-white/10">
                    <p className="text-xs text-slate-400">© 2025 ChainTorque. All rights reserved.</p>
                </div>
            </div>
        </footer>
    )
}
