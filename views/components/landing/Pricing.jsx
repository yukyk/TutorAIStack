import { ArrowRight } from 'lucide-react';

export default function Pricing() {
    return (
        <section id="pricing" className="py-24 relative">
            <div className="max-w-4xl mx-auto px-6 text-center">

                <h2 className="text-3xl md:text-5xl font-bold mb-4">
                    Simple <span className="text-electric-blue">Pricing</span>
                </h2>
                <p className="text-white/50 text-lg mb-16">
                    Start free. Upgrade when you're ready.
                </p>

                <div className="grid md:grid-cols-2 gap-6">

                    {/* Free */}
                    <div className="glass-card rounded-2xl border border-white/10 p-8 text-left">
                        <p className="text-sm font-semibold text-white/40 uppercase tracking-wider mb-2">Free</p>
                        <p className="text-4xl font-bold text-white mb-1">₹0</p>
                        <p className="text-white/40 text-sm mb-8">No credit card required</p>
                        <ul className="flex flex-col gap-3 mb-8">
                            {[
                                '10 AI messages per session',
                                'All 5 teaching modes',
                                '5 DSA problems',
                                'Monaco code editor',
                            ].map((f, i) => (
                                <li key={i} className="flex items-center gap-3 text-sm text-white/70">
                                    <span className="w-4 h-4 rounded-full bg-green-500/20 text-green-400 flex items-center justify-center text-xs">✓</span>
                                    {f}
                                </li>
                            ))}
                        </ul>

                        <a href="/onboarding" className="w-full block text-center bg-white/5 hover:bg-white/10 border border-white/10 text-white py-3 rounded-xl font-semibold transition-all">
                            Get Started Free
                        </a>
                    </div>

                    {/* Pro */}
                    <div className="glass-card rounded-2xl border border-electric-blue/40 p-8 text-left relative overflow-hidden">
                        <div className="absolute top-4 right-4 text-xs px-3 py-1 rounded-full bg-electric-blue/20 text-electric-blue border border-electric-blue/30 font-semibold">
                            Coming Soon
                        </div>
                        <p className="text-sm font-semibold text-electric-blue uppercase tracking-wider mb-2">Pro</p>
                        <p className="text-4xl font-bold text-white mb-1">₹199<span className="text-lg text-white/40">/mo</span></p>
                        <p className="text-white/40 text-sm mb-8">Everything you need to ace placements</p>
                        <ul className="flex flex-col gap-3 mb-8">
                            {[
                                'Unlimited AI messages',
                                'All 5 teaching modes',
                                '50+ DSA problems',
                                'Session history & progress tracking',
                                'XP system & streaks',
                                'Concept coverage map',
                                'Priority support',
                            ].map((f, i) => (
                                <li key={i} className="flex items-center gap-3 text-sm text-white/70">
                                    <span className="w-4 h-4 rounded-full bg-electric-blue/20 text-electric-blue flex items-center justify-center text-xs">✓</span>
                                    {f}
                                </li>
                            ))}
                        </ul>
                        <button
                            disabled
                            className="w-full block text-center bg-electric-blue/30 text-white/50 py-3 rounded-xl font-semibold cursor-not-allowed"
                        >
                            Notify Me When Live
                        </button>
                    </div>
                </div>
            </div>
        </section >
    );
}