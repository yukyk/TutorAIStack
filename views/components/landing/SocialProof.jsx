import { Star } from "lucide-react";

export default function SocialProof() {
  const testimonials = [
    {
      quote: "I used to just memorize solutions. TutorAI forced me to understand the underlying patterns. Passed my Meta interview last week.",
      author: "Alex C.",
      role: "Frontend Engineer"
    },
    {
      quote: "The hint system is incredible. It gives you just enough to keep going without spoiling the 'aha!' moment of solving it yourself.",
      author: "Sarah J.",
      role: "CS Student"
    },
    {
      quote: "It's like having a senior engineer pair programming with you 24/7. The logic breakdowns are incredibly clear.",
      author: "David M.",
      role: "Fullstack Developer"
    }
  ];

  return (
    <section className="py-24 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 bg-white/5 text-sm font-medium mb-6">
            <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
            <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
            <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
            <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
            <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
            <span className="ml-2 text-white/80">Loved by 10,000+ developers</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold">Built for the modern interview</h2>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {testimonials.map((t, i) => (
            <div key={i} className="glass p-8 rounded-2xl hover:border-white/20 transition-colors">
              <p className="text-white/70 leading-relaxed mb-6">"{t.quote}"</p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-blue to-electric-blue flex items-center justify-center font-bold text-sm">
                  {t.author.charAt(0)}
                </div>
                <div>
                  <p className="font-medium text-white/90 text-sm">{t.author}</p>
                  <p className="text-white/40 text-xs">{t.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
