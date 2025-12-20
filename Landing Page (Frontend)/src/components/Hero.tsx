import { Rocket, ChevronDown } from 'lucide-react'

export default function Hero() {
    const scrollToLibrary = () => {
        document.getElementById('library')?.scrollIntoView({ behavior: 'smooth' })
    }

    const marketplaceUrl = import.meta.env.VITE_MARKETPLACE_URL || 'https://chaintorque-marketplace.vercel.app'

    return (
        <section className="min-h-screen flex flex-col items-center justify-center text-center relative overflow-hidden px-4 pt-24 pb-20">
            {/* Animated Mesh Background */}
            <div className="absolute inset-0 z-0">
                <div className="hero-mesh" />
            </div>

            {/* Geometric Shapes */}
            <div className="geo-shape hexagon" style={{ top: '15%', left: '10%' }} />
            <div className="geo-shape circle-outline" style={{ top: '25%', right: '15%' }} />
            <div className="geo-shape hexagon" style={{ bottom: '20%', right: '10%' }} />
            <div className="geo-shape circle-outline" style={{ bottom: '30%', left: '15%' }} />

            {/* Content */}
            <div className="relative z-10 max-w-5xl mx-auto">
                <div className="inline-block px-4 py-1.5 mb-6 rounded-full glass-card animate-fade-in-down">
                    <span className="text-xs font-bold uppercase tracking-widest text-slate-700 dark:text-white/80">
                        Next Gen CAD Marketplace
                    </span>
                </div>

                <h1 className="text-6xl md:text-8xl font-black mb-8 animate-fade-in-up tracking-tighter leading-none">
                    Build. Share. <br />
                    <span className="text-gradient">Explore.</span>
                </h1>

                <p className="text-xl md:text-2xl text-slate-500 dark:text-slate-400 max-w-2xl mx-auto mb-12 animate-fade-in-up font-medium">
                    Experience the future of CAD modeling on Web3. A community-driven marketplace where creativity meets
                    decentralized collaboration.
                </p>

                {/* CTA Buttons */}
                <div className="flex flex-wrap gap-6 justify-center animate-fade-in-up">
                    <a href={marketplaceUrl} className="glass-button flex items-center gap-2">
                        Get Started Free
                        <Rocket className="w-4 h-4" />
                    </a>
                    <button
                        onClick={scrollToLibrary}
                        className="px-8 py-3.5 rounded-full text-slate-700 dark:text-white font-semibold border border-slate-200 dark:border-white/10 backdrop-blur-md bg-white/50 dark:bg-white/5 hover:bg-white dark:hover:bg-white/10 transition-all duration-300 hover-lift"
                    >
                        Explore Models
                    </button>
                </div>
            </div>

            {/* Scroll Indicator */}
            <div
                className="absolute bottom-10 left-1/2 -translate-x-1/2 cursor-pointer scroll-indicator"
                onClick={scrollToLibrary}
            >
                <div className="w-8 h-12 rounded-full border-2 border-slate-300 dark:border-white/20 flex justify-center p-2">
                    <ChevronDown className="w-4 h-4 text-slate-400 dark:text-white/60 animate-bounce" />
                </div>
            </div>
        </section>
    )
}
