import { Check } from 'lucide-react'

const plans = [
    {
        name: 'Starter',
        price: 'Free',
        priceNote: '',
        features: ['Basic CAD uploads', '1GB Cloud Storage', 'Public Collections'],
        highlighted: false,
        buttonText: 'Get Started',
        checkColor: 'text-emerald-400',
    },
    {
        name: 'Professional',
        price: '$29',
        priceNote: '/mo',
        features: ['Everything in Starter', '50GB Cloud Storage', 'Private Collections', 'Priority Rendering'],
        highlighted: true,
        buttonText: 'Start Free Trial',
        checkColor: 'text-indigo-400',
    },
    {
        name: 'Enterprise',
        price: 'Custom',
        priceNote: '',
        features: ['Everything in Pro', 'Unlimited Storage', 'Dedicated Support', 'API Access'],
        highlighted: false,
        buttonText: 'Contact Sales',
        checkColor: 'text-emerald-400',
    },
]

export default function Pricing() {
    const marketplaceUrl = import.meta.env.VITE_MARKETPLACE_URL || 'https://chaintorque-marketplace.vercel.app'

    return (
        <section className="py-32 px-6 relative" id="pricing">
            <div className="max-w-6xl mx-auto">
                <div className="text-center mb-16 reveal">
                    <h2 className="text-4xl md:text-5xl font-black mb-6">
                        Scalable <span className="text-gradient">Pricing</span>
                    </h2>
                    <p className="text-xl text-slate-500 dark:text-slate-400">
                        Simple, transparent plans for everyone from hobbyists to enterprises.
                    </p>
                </div>

                <div className="grid md:grid-cols-3 gap-8 items-stretch">
                    {plans.map((plan) => (
                        <div
                            key={plan.name}
                            className={`card-modern glass-card reveal hover-lift flex flex-col relative overflow-hidden ${plan.highlighted
                                    ? 'border-indigo-500/50 shadow-2xl shadow-indigo-500/20 scale-105 z-10'
                                    : ''
                                }`}
                        >
                            {plan.highlighted && (
                                <div className="absolute top-0 right-0 px-3 py-1 bg-indigo-500 text-[10px] font-black uppercase tracking-widest text-white rounded-bl-xl">
                                    Popular
                                </div>
                            )}
                            <h4 className="text-xl font-bold mb-2">{plan.name}</h4>
                            <div className="text-4xl font-black mb-6">
                                {plan.price}
                                {plan.priceNote && <span className="text-lg font-medium text-slate-500">{plan.priceNote}</span>}
                            </div>
                            <ul className="space-y-4 mb-8 flex-grow">
                                {plan.features.map((feature) => (
                                    <li key={feature} className="flex items-center gap-3 text-slate-500 dark:text-slate-400 text-sm">
                                        <Check className={`w-4 h-4 ${plan.checkColor}`} />
                                        {feature}
                                    </li>
                                ))}
                            </ul>
                            {plan.highlighted ? (
                                <a href={marketplaceUrl} className="w-full glass-button text-center hover-lift">
                                    {plan.buttonText}
                                </a>
                            ) : (
                                <a
                                    href={marketplaceUrl}
                                    className="w-full py-3 rounded-xl border border-slate-200 dark:border-white/10 hover:bg-slate-100 dark:hover:bg-white/5 transition-colors font-bold text-center block"
                                >
                                    {plan.buttonText}
                                </a>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}
