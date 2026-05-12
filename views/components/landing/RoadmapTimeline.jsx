export default function RoadmapTimeline() {
    const items = [
        {
            status: 'done',
            quarter: 'Now',
            title: 'Core AI Tutor',
            points: [
                '5 teaching modes (Hint, Logic, Humanize, Debug, Optimize)',
                'Monaco code editor with multi-language support',
                'Off-topic guard — AI stays focused on the problem',
                'Rate limiting and free tier',
            ],
        },
        {
            status: 'next',
            quarter: 'Coming Soon',
            title: 'Problem Library',
            points: [
                '50+ curated DSA problems across all patterns',
                'Filter by difficulty, pattern, and topic',
                'Starter code in Python, JS, Java, C++',
                'Session history — pick up where you left off',
            ],
        },
        {
            status: 'upcoming',
            quarter: 'Next',
            title: 'Progress & Profile',
            points: [
                'Personal profile with problem history',
                'XP and streak system',
                'Concept coverage map — see what you know',
                'Leaderboard (optional)',
            ],
        },
        {
            status: 'upcoming',
            quarter: 'Future',
            title: 'Code Execution',
            points: [
                'Run your code directly in the browser',
                'See test case results instantly',
                'AI analyses your output and guides next steps',
                'Multi-language execution support',
            ],
        },
    ];

    const statusStyles = {
        done: {
            dot: 'bg-green-500',
            badge: 'bg-green-500/10 text-green-400 border-green-500/20',
            border: 'border-electric-blue/30',
        },
        next: {
            dot: 'bg-electric-blue animate-pulse',
            badge: 'bg-electric-blue/10 text-electric-blue border-electric-blue/20',
            border: 'border-electric-blue/20',
        },
        upcoming: {
            dot: 'bg-white/20',
            badge: 'bg-white/5 text-white/40 border-white/10',
            border: 'border-white/5',
        },
    };

    return (
        <section id="roadmap" className="py-24 relative">
            <div className="max-w-3xl mx-auto px-6">

                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-5xl font-bold mb-4">
                        What's <span className="text-electric-blue">Coming</span>
                    </h2>
                    <p className="text-white/50 text-lg">
                        TutorAI is actively being built. Here's exactly what's next.
                    </p>
                </div>

                <div className="relative">
                    {/* Vertical line */}
                    <div className="absolute left-[11px] top-2 bottom-2 w-[2px] bg-gradient-to-b from-electric-blue/60 via-electric-blue/20 to-transparent" />

                    <div className="flex flex-col gap-10">
                        {items.map((item, i) => {
                            const s = statusStyles[item.status];
                            return (
                                <div key={i} className="flex gap-6">
                                    {/* Dot */}
                                    <div className="flex flex-col items-center shrink-0">
                                        <div className={`w-6 h-6 rounded-full border-2 border-[#0a0a0a] ${s.dot} mt-1`} />
                                    </div>

                                    {/* Card */}
                                    <div className={`flex-1 glass-card rounded-2xl border ${s.border} p-6 mb-2`}>
                                        <div className="flex items-center gap-3 mb-4">
                                            <span className={`text-xs font-semibold px-3 py-1 rounded-full border ${s.badge}`}>
                                                {item.quarter}
                                            </span>
                                            <h3 className="text-lg font-semibold text-white/90">
                                                {item.title}
                                            </h3>
                                        </div>
                                        <ul className="flex flex-col gap-2">
                                            {item.points.map((p, j) => (
                                                <li key={j} className="flex items-start gap-2 text-sm text-white/50">
                                                    <span className={`mt-1.5 w-1.5 h-1.5 rounded-full shrink-0 ${item.status === 'done' ? 'bg-green-400' :
                                                            item.status === 'next' ? 'bg-electric-blue' : 'bg-white/20'
                                                        }`} />
                                                    {p}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </section>
    );
}