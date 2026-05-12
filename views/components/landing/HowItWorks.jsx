export default function HowItWorks() {
  const steps = [
    { num: "01", title: "Pick a problem", desc: "Select any LeetCode or custom DSA challenge." },
    { num: "02", title: "Ask your question", desc: "Share your code or ask for a conceptual starting point." },
    { num: "03", title: "Choose learning mode", desc: "Get a hint, logic breakdown, or debugging help." },
    { num: "04", title: "Understand deeply", desc: "Solve the problem with full comprehension." },
  ];

  return (
    <section id="how-it-works" className="py-24 bg-black/40 border-y border-white/5 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-16">
          How It <span className="text-electric-blue">Works</span>
        </h2>

        <div className="relative">
          {/* Connecting line for desktop */}
          <div className="hidden lg:block absolute top-1/2 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-electric-blue/30 to-transparent -translate-y-1/2 z-0" />

          <div className="grid lg:grid-cols-4 gap-12 lg:gap-6 relative z-10">
            {steps.map((step, idx) => (
              <div key={idx} className="flex flex-col items-center text-center group">
                <div className="w-16 h-16 rounded-full glass-card border border-white/10 flex items-center justify-center text-xl font-bold mb-6 text-white/50 group-hover:text-electric-blue group-hover:border-electric-blue/50 group-hover:shadow-[0_0_20px_rgba(59,130,246,0.3)] transition-all duration-300 relative bg-[#0B0F19]">
                  {step.num}
                  {/* Subtle pulse ring */}
                  <div className="absolute inset-0 rounded-full border border-electric-blue/0 group-hover:border-electric-blue/30 group-hover:scale-125 transition-all duration-500" />
                </div>
                <h3 className="text-lg font-semibold mb-2 text-white/90">{step.title}</h3>
                <p className="text-sm text-white/50 leading-relaxed max-w-[200px]">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
