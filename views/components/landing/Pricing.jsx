import { TIERS, PACKS } from '@/lib/pricing';

export default function Pricing() {
  return (
    <section id="pricing" className="py-24 relative">
      <div className="max-w-5xl mx-auto px-6 text-center">

        <h2 className="text-3xl md:text-5xl font-bold mb-4">
          Simple <span className="text-electric-blue">Pricing</span>
        </h2>
        <p className="text-white/50 text-lg mb-16">
          Start free. Upgrade when you're ready.
        </p>

        {/* Subscription tiers */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-20">
          {TIERS.map(tier => (
            <div
              key={tier.id}
              className={`glass-card rounded-2xl border p-8 text-left relative overflow-hidden flex flex-col ${
                tier.highlight ? 'border-electric-blue/40' : 'border-white/10'
              }`}
            >
              {tier.badge && (
                <div className="absolute top-4 right-4 text-xs px-3 py-1 rounded-full bg-electric-blue/20 text-electric-blue border border-electric-blue/30 font-semibold">
                  {tier.badge}
                </div>
              )}

              <p className={`text-sm font-semibold uppercase tracking-wider mb-2 ${tier.highlight ? 'text-electric-blue' : 'text-white/40'}`}>
                {tier.label}
              </p>
              <p className="text-4xl font-bold text-white mb-1">
                ₹{tier.priceINR}<span className="text-lg text-white/40">{tier.period}</span>
              </p>
              <p className="text-white/40 text-sm mb-8">{tier.subtitle}</p>

              <ul className="flex flex-col gap-3 mb-8">
                {tier.features.map(f => (
                  <li key={f} className="flex items-center gap-3 text-sm text-white/70">
                    <span className={`w-4 h-4 rounded-full flex items-center justify-center text-xs flex-shrink-0 ${
                      tier.highlight ? 'bg-electric-blue/20 text-electric-blue' : 'bg-green-500/20 text-green-400'
                    }`}>✓</span>
                    {f}
                  </li>
                ))}
                {(tier.excluded ?? []).map(f => (
                  <li key={f} className="flex items-center gap-3 text-sm text-white/25">
                    <span className="w-4 h-4 rounded-full bg-white/5 flex items-center justify-center text-xs flex-shrink-0 text-white/20">✕</span>
                    {f}
                  </li>
                ))}
              </ul>

              <div className="mt-auto">
                {tier.id === 'free' ? (
                  <a
                    href={tier.cta.href}
                    className="w-full block text-center bg-white/5 hover:bg-white/10 border border-white/10 text-white py-3 rounded-xl font-semibold transition-all text-sm"
                  >
                    {tier.cta.label}
                  </a>
                ) : (
                  <button
                    disabled
                    className="w-full text-center bg-white/5 text-white/30 border border-white/10 py-3 rounded-xl font-semibold cursor-not-allowed text-sm"
                  >
                    Coming Soon
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Credit packs */}
        <div className="mb-10">
          <h3 className="text-2xl md:text-3xl font-bold text-white mb-3">
            Need more interactions?{' '}
            <span className="text-electric-blue">Top up anytime</span>
          </h3>
          <p className="text-white/40 text-sm">Pack credits never expire. Buy once, use anytime.</p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
          {PACKS.map(pack => (
            <div
              key={pack.id}
              className={`glass-card rounded-xl border p-5 text-left relative overflow-hidden flex flex-col ${
                pack.popular ? 'border-electric-blue/40' : 'border-white/10'
              }`}
            >
              {pack.popular && (
                <div className="absolute top-3 right-3 text-xs px-2 py-0.5 rounded-full bg-electric-blue/20 text-electric-blue border border-electric-blue/30 font-semibold">
                  Most Popular
                </div>
              )}

              <p className={`text-xs font-semibold uppercase tracking-wider mb-1 ${pack.popular ? 'text-electric-blue' : 'text-white/40'}`}>
                {pack.label}
              </p>
              <p className="text-2xl font-bold text-white mb-1">
                {pack.credits}{' '}
                <span className="text-sm font-normal text-white/40">credits</span>
              </p>
              <p className="text-3xl font-bold text-white mb-1">₹{pack.priceINR}</p>
              <p className="text-xs text-white/30 mb-3">{pack.perCredit} per interaction</p>

              <div className="mb-4">
                {pack.savings ? (
                  <span className="inline-block text-xs px-2 py-0.5 rounded-full bg-green-500/15 text-green-400 border border-green-500/20 font-semibold">
                    {pack.savings}
                  </span>
                ) : (
                  <span className="inline-block text-xs px-2 py-0.5 rounded-full bg-white/5 text-white/30 border border-white/10">
                    {pack.sublabel}
                  </span>
                )}
              </div>

              <div className="mt-auto">
                <button
                  disabled
                  className="w-full text-center bg-white/5 text-white/30 border border-white/10 py-2.5 rounded-lg text-sm font-semibold cursor-not-allowed"
                >
                  Coming Soon
                </button>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
