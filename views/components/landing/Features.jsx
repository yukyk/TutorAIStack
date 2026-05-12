import { BrainCircuit, Lightbulb, Bug, Focus } from "lucide-react";

export default function Features() {
  const features = [
    {
      icon: <Lightbulb className="w-6 h-6 text-yellow-400" />,
      title: "Hint-First Learning",
      description: "Get nudges in the right direction, not copy-paste solutions. Build real problem-solving muscles."
    },
    {
      icon: <BrainCircuit className="w-6 h-6 text-electric-blue" />,
      title: "Logic Breakdown",
      description: "Understand the 'why' behind the code. Step-by-step conceptual explanations for any algorithm."
    },
    {
      icon: <Bug className="w-6 h-6 text-red-400" />,
      title: "Code Debugging AI",
      description: "Stuck on an edge case? The AI spots your logical errors and guides you to the fix."
    },
    {
      icon: <Focus className="w-6 h-6 text-purple-400" />,
      title: "Pattern Recognition",
      description: "Learn to map problems to core DSA patterns (Sliding Window, Two Pointers, etc.) instantly."
    }
  ];

  return (
    <section id="features" className="py-24 relative">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold mb-6">
            Master the <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-electric-blue">Concepts</span>, <br />
            Not the Syntax
          </h2>
          <p className="text-white/60 text-lg max-w-2xl mx-auto">
            Traditional platforms give you the answer. We teach you how to find it yourself.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, idx) => (
            <div 
              key={idx} 
              className="glass-card p-8 rounded-2xl border border-white/5 hover:border-electric-blue/30 transition-all duration-300 group hover:-translate-y-2 hover:shadow-[0_8px_32px_rgba(59,130,246,0.15)]"
            >
              <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-electric-blue/10 transition-all duration-300">
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold mb-3 text-white/90 group-hover:text-white transition-colors">{feature.title}</h3>
              <p className="text-white/50 text-sm leading-relaxed group-hover:text-white/70 transition-colors">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
