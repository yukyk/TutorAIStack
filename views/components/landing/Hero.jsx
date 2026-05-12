"use client";

import { ArrowRight, Sparkles, Terminal } from "lucide-react";
import { useSession } from 'next-auth/react';

export default function Hero() {
  const { data: session } = useSession();

  function scrollToDemo(e) {
    e.preventDefault();
    document.getElementById('demo')?.scrollIntoView({ behavior: 'smooth' });
  }

  return (
    <section className="relative min-h-screen flex items-center justify-center pt-24 pb-16 overflow-hidden">
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-electric-blue/20 rounded-full blur-[120px] -z-10 mix-blend-screen animate-pulse-glow" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-primary-blue/30 rounded-full blur-[120px] -z-10 mix-blend-screen animate-pulse-glow" style={{ animationDelay: "2s" }} />

      <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-16 items-center">

        {/* Left Column */}
        <div className="flex flex-col gap-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-electric-blue/30 bg-electric-blue/10 text-electric-blue text-sm font-medium w-fit">
            <Sparkles className="w-4 h-4" />
            <span>AI-Powered Learning 2.0</span>
          </div>

          <h1 className="text-5xl md:text-7xl font-bold tracking-tight leading-[1.1]">
            Stop Memorizing LeetCode. <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-electric-blue to-white">
              Start Understanding It.
            </span>
          </h1>

          <p className="text-lg md:text-xl text-white/60 leading-relaxed max-w-xl">
            An AI tutor that teaches you how to think — not just what to code. Master algorithms through guided logic breakdowns, not brute-force memorization.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 mt-4">
            {session ? (
              <a href="/compiler" className="bg-electric-blue hover:bg-blue-400 text-white px-8 py-4 rounded-full font-semibold transition-all duration-300 glow flex items-center justify-center gap-2">
                Continue Learning
                <ArrowRight className="w-5 h-5" />
              </a>
            ) : (
              <a
                href="/signup"
                className="bg-electric-blue hover:bg-blue-400 text-white px-8 py-4 rounded-full font-semibold transition-all duration-300 glow flex items-center justify-center gap-2"
              >
                Get Started Free
                <ArrowRight className="w-5 h-5" />
              </a>
            )}
            <button onClick={scrollToDemo} className="bg-white/5 hover:bg-white/10 text-white px-8 py-4 rounded-full font-semibold transition-all duration-300 border border-white/10 flex items-center justify-center gap-2">
              See How It Works
            </button>
          </div>
        </div>

        {/* Right Column */}
        <div className="relative animate-float">
          <div className="glass-card rounded-2xl overflow-hidden border border-white/10 shadow-2xl relative z-10">
            <div className="bg-black/40 px-4 py-3 border-b border-white/10 flex items-center gap-2">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-red-500/80" />
                <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                <div className="w-3 h-3 rounded-full bg-green-500/80" />
              </div>
              <div className="mx-auto flex items-center gap-2 text-xs text-white/40 font-mono bg-white/5 px-3 py-1 rounded-md">
                <Terminal className="w-3 h-3" />
                twoSum.js
              </div>
            </div>
            <div className="p-6 font-mono text-sm leading-relaxed overflow-hidden">
              <div className="flex">
                <div className="text-white/20 select-none pr-4 text-right">
                  1<br />2<br />3<br />4<br />5<br />6
                </div>
                <div className="text-white/80">
                  <span className="text-pink-400">function</span> <span className="text-blue-400">twoSum</span>(nums, target) {'{'}<br />
                  &nbsp;&nbsp;<span className="text-white/40">// Your logic here</span><br />
                  &nbsp;&nbsp;<span className="text-pink-400">const</span> map = <span className="text-pink-400">new</span> <span className="text-blue-400">Map</span>();<br />
                  &nbsp;&nbsp;<span className="text-pink-400">for</span> (<span className="text-pink-400">let</span> i = <span className="text-orange-400">0</span>; i {'<'} nums.length; i++) {'{'}<br />
                  &nbsp;&nbsp;&nbsp;&nbsp;<span className="text-pink-400">const</span> complement = target - nums[i];<br />
                  <span className="w-[2px] h-[1.2em] bg-electric-blue inline-block animate-pulse align-middle ml-1" />
                </div>
              </div>
            </div>
          </div>

          <div className="absolute -bottom-8 -right-8 w-72 glass-card rounded-xl p-5 border border-electric-blue/30 shadow-[0_8px_32px_rgba(59,130,246,0.2)] z-20">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-electric-blue to-primary-blue flex items-center justify-center shrink-0">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <div>
                <p className="text-xs text-white/60 mb-1">AI Tutor</p>
                <p className="text-sm text-white/90 leading-relaxed">
                  You're on the right track! Instead of nesting another loop, think about how the{' '}
                  <span className="text-electric-blue font-mono">Map</span> can help you check for the{' '}
                  <span className="text-electric-blue font-mono">complement</span> in{' '}
                  <span className="font-mono text-pink-400 text-xs bg-white/10 px-1 rounded">O(1)</span> time.
                </p>
              </div>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}