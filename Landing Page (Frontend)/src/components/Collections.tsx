import { Cog, Building, Printer, ChevronRight } from 'lucide-react'

const collections = [
    {
        title: 'Mechanical Parts',
        description: 'Precision-engineered gears, joints, and industrial components.',
        icon: Cog,
        color: 'blue',
    },
    {
        title: 'Architectural',
        description: 'Stunning 3D building models, urban layouts, and interiors.',
        icon: Building,
        color: 'purple',
    },
    {
        title: '3D Printables',
        description: 'Optimized, manifold models ready for immediate 3D printing.',
        icon: Printer,
        color: 'pink',
    },
]

const colorClasses = {
    blue: { icon: 'bg-blue-500/20 text-blue-400', link: 'text-blue-400' },
    purple: { icon: 'bg-purple-500/20 text-purple-400', link: 'text-purple-400' },
    pink: { icon: 'bg-pink-500/20 text-pink-400', link: 'text-pink-400' },
}

export default function Collections() {
    const marketplaceUrl = import.meta.env.VITE_MARKETPLACE_URL || 'https://chaintorque-marketplace.vercel.app'

    return (
        <section className="py-32 px-6 relative" id="library">
            <div className="max-w-6xl mx-auto">
                <div className="text-center mb-16 reveal">
                    <h2 className="text-4xl md:text-5xl font-black mb-6">
                        Curated <span className="text-gradient">Collections</span>
                    </h2>
                    <p className="text-xl text-slate-500 dark:text-slate-400 max-w-2xl mx-auto">
                        Explore the finest 3D models hand-picked by our curators for quality and precision.
                    </p>
                </div>

                <div className="grid md:grid-cols-3 gap-8">
                    {collections.map((collection) => {
                        const colors = colorClasses[collection.color as keyof typeof colorClasses]
                        return (
                            <div key={collection.title} className="card-modern glass-card reveal hover-lift">
                                <div className={`card-icon ${colors.icon}`}>
                                    <collection.icon className="w-7 h-7" />
                                </div>
                                <h3 className="text-2xl font-bold mb-4">{collection.title}</h3>
                                <p className="text-slate-500 dark:text-slate-400 mb-6">{collection.description}</p>
                                <a
                                    href={marketplaceUrl}
                                    className={`${colors.link} font-bold flex items-center gap-2 hover:gap-3 transition-all`}
                                >
                                    View Collection <ChevronRight className="w-4 h-4" />
                                </a>
                            </div>
                        )
                    })}
                </div>
            </div>
        </section>
    )
}
