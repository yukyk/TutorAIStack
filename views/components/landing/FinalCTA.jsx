"use client";

import { ArrowRight } from "lucide-react";

export default function FinalCTA() {
  return (
    <section className="py-24 relative">
      <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
        <div className="glass-card rounded-3xl p-12 md:p-20 border border-electric-blue/20 relative overflow-hidden">
          {/* Glow effect behind */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full max-w-[500px] max-h-[500px] bg-electric-blue/20 rounded-full blur-[100px] -z-10" />
          
          <h2 className="text-4xl md:text-5xl font-bold mb-6 tracking-tight">
            Your Personal DSA Coach <br className="hidden md:block" />
            <span className="text-electric-blue">Starts Here</span>
          </h2>
          <p className="text-lg text-white/60 mb-10 max-w-xl mx-auto">
            Stop wasting hours stuck on the same problem. Learn faster, understand deeper, and ace your next technical interview.
          </p>
          
          <a href="/signup" className="bg-electric-blue hover:bg-blue-400 text-white px-10 py-4 rounded-full font-bold text-lg transition-all duration-300 glow inline-flex items-center gap-2 group">
            Get Started Free
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </a>
          
          <p className="mt-6 text-sm text-white/40">No credit card required. 7-day free trial.</p>
        </div>
      </div>
    </section>
  );
}
