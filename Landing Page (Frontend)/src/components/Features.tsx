import { Zap, ShieldCheck, Compass } from 'lucide-react'

const features = [
    {
        title: 'Instant Access',
        icon: Zap,
        color: 'yellow',
        desc: 'Upload and visualize your CAD models in seconds with our optimized pipeline.',
    },
    {
        title: 'On-Chain Security',
        icon: ShieldCheck,
        color: 'indigo',
        desc: 'Your intellectual property is protected by blockchain-backed ownership verification.',
    },
    {
        title: 'Intuitive UX',
        icon: Compass,
        color: 'emerald',
        desc: 'A seamless interface designed specifically for engineers and 3D artists.',
    },
]

const colorClasses = {
    yellow: 'bg-yellow-400/10 text-yellow-400',
    indigo: 'bg-indigo-400/10 text-indigo-400',
    emerald: 'bg-emerald-400/10 text-emerald-400',
}

export default function Features() {
    return (
        <section className="px-6 py-32 relative overflow-hidden">
            <div className="max-w-6xl mx-auto">
                <div className="text-center mb-16 reveal">
                    <h2 className="text-4xl md:text-5xl font-black mb-6">
                        Engineered for <span className="text-gradient">Innovators</span>
                    </h2>
                    <p className="text-xl text-slate-500 dark:text-slate-400 max-w-2xl mx-auto">
                        Our platform combines cutting-edge Web3 technology with an intuitive design experience.
                    </p>
                </div>

                <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
                    {features.map((feature, index) => (
                        <div
                            key={feature.title}
                            className="card-modern glass-card reveal hover-lift group"
                            style={{ animationDelay: `${index * 100}ms` }}
                        >
                            <div
                                className={`w-14 h-14 rounded-2xl ${colorClasses[feature.color as keyof typeof colorClasses]} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}
                            >
                                <feature.icon className="w-7 h-7" />
                            </div>
                            <h3 className="text-xl font-bold mb-4">{feature.title}</h3>
                            <p className="text-slate-500 dark:text-slate-400 leading-relaxed">{feature.desc}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}
