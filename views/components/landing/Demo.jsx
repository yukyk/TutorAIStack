'use client';

import { useState } from 'react';
import { Sparkles } from 'lucide-react';
import axios from 'axios';

const MODES = ['hint', 'logic', 'humanize', 'debug', 'optimize'];
const MODE_LABELS = {
    hint: '💡 Hint',
    logic: '🧠 Logic',
    humanize: '👶 Humanize',
    debug: '🐛 Debug',
    optimize: '⚡ Optimize',
};

const SAMPLE_QUESTIONS = [
    "I don't know where to start",
    "Why is my nested loop slow?",
    "Explain this like I'm 5",
    "What pattern should I use?",
];

export default function Demo() {
    const [mode, setMode] = useState('humanize');
    const [question, setQuestion] = useState('');
    const [response, setResponse] = useState('');
    const [loading, setLoading] = useState(false);
    const [asked, setAsked] = useState(false);

    async function handleAsk(q) {
        const msg = q || question;
        if (!msg.trim()) return;
        setLoading(true);
        setAsked(true);
        setResponse('');
        try {
            const res = await axios.post('/api/chat', {
                message: msg,
                mode,
                problemId: 'two_sum',
                history: [],
                userCode: '',
            });
            setResponse(res.data.reply);
        } catch {
            setResponse('Something went wrong. Try again.');
        } finally {
            setLoading(false);
        }
    }

    return (
        <section id="demo" className="py-24 relative">
            <div className="max-w-4xl mx-auto px-6">

                <div className="text-center mb-12">
                    <h2 className="text-3xl md:text-5xl font-bold mb-4">
                        Try It <span className="text-electric-blue">Right Now</span>
                    </h2>
                    <p className="text-white/50 text-lg">
                        No signup. Ask the AI tutor anything about Two Sum.
                    </p>
                </div>

                <div className="glass-card rounded-2xl border border-white/10 overflow-hidden">

                    <div className="bg-black/40 px-6 py-3 border-b border-white/10 flex items-center gap-3">
                        <span className="text-xs font-mono text-white/30">PROBLEM:</span>
                        <span className="text-sm font-mono text-white/70">Two Sum</span>
                        <span className="ml-auto text-xs px-2 py-1 rounded-full bg-green-500/10 text-green-400 border border-green-500/20">
                            Easy
                        </span>
                    </div>

                    <div className="px-6 py-4 border-b border-white/5 flex gap-2 flex-wrap">
                        {MODES.map(m => (
                            <button
                                key={m}
                                onClick={() => setMode(m)}
                                className={`px-4 py-2 rounded-full text-xs font-semibold transition-all duration-200 ${mode === m
                                        ? 'bg-electric-blue text-white shadow-[0_0_12px_rgba(59,130,246,0.4)]'
                                        : 'bg-white/5 text-white/50 hover:bg-white/10 hover:text-white/80'
                                    }`}
                            >
                                {MODE_LABELS[m]}
                            </button>
                        ))}
                    </div>

                    <div className="px-6 py-6 min-h-[140px]">
                        {!asked ? (
                            <p className="text-white/30 text-sm italic">
                                Pick a mode and ask a question below — the AI responds live.
                            </p>
                        ) : loading ? (
                            <div className="flex items-center gap-3">
                                <div className="w-6 h-6 rounded-full bg-gradient-to-br from-electric-blue to-primary-blue flex items-center justify-center shrink-0 animate-pulse">
                                    <Sparkles className="w-3 h-3 text-white" />
                                </div>
                                <div className="flex gap-1">
                                    <span className="w-2 h-2 bg-electric-blue/60 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                                    <span className="w-2 h-2 bg-electric-blue/60 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                                    <span className="w-2 h-2 bg-electric-blue/60 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                                </div>
                            </div>
                        ) : (
                            <div className="flex items-start gap-3">
                                <div className="w-7 h-7 rounded-full bg-gradient-to-br from-electric-blue to-primary-blue flex items-center justify-center shrink-0 mt-0.5">
                                    <Sparkles className="w-3.5 h-3.5 text-white" />
                                </div>
                                <div>
                                    <p className="text-xs text-white/40 mb-1 uppercase tracking-wider font-semibold">
                                        {MODE_LABELS[mode]} Mode
                                    </p>
                                    <p className="text-white/90 text-sm leading-relaxed whitespace-pre-line">
                                        {response}
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="px-6 pb-3 flex gap-2 flex-wrap">
                        {SAMPLE_QUESTIONS.map((q, i) => (
                            <button
                                key={i}
                                onClick={() => { setQuestion(q); handleAsk(q); }}
                                className="text-xs px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-white/50 hover:text-white/80 hover:bg-white/10 transition-all"
                            >
                                {q}
                            </button>
                        ))}
                    </div>

                    <div className="px-6 pb-6 flex gap-3">
                        <input
                            value={question}
                            onChange={e => setQuestion(e.target.value)}
                            onKeyDown={e => e.key === 'Enter' && handleAsk()}
                            placeholder="Ask anything about Two Sum..."
                            className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-white/30 outline-none focus:border-electric-blue/50 transition-colors"
                        />
                        <button
                            onClick={() => handleAsk()}
                            disabled={loading}
                            className="bg-electric-blue hover:bg-blue-400 disabled:opacity-50 text-white px-5 py-3 rounded-xl text-sm font-semibold transition-all"
                        >
                            Ask
                        </button>
                    </div>
                </div>

                <div className="text-center mt-8">
                    <a href="/onboarding" className="inline-flex items-center gap-2 bg-white/5 hover:bg-white/10 border border-white/10 text-white px-6 py-3 rounded-full text-sm font-medium transition-all">
                        Try the full experience →
                    </a>
                </div>

            </div>
        </section>
    );
}