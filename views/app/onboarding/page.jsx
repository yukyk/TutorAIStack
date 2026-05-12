'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

const STEPS = [
    {
        step: 1,
        eyebrow: 'THE PROBLEM',
        headline: 'You\'ve seen the solution.\nYou still can\'t solve it.',
        sub: 'Memorizing LeetCode answers is not the same as understanding them. You know this.',
        stat: '73% of developers fail interviews on problems they\'ve seen before.',
        cta: null,
    },
    {
        step: 2,
        eyebrow: 'THE DIFFERENCE',
        headline: 'TutorAI never gives\nyou the answer.',
        sub: 'Instead it asks you the right question at the right time — until you find it yourself.',
        modes: [
            { icon: '💡', name: 'Hint', desc: 'One nudge. That\'s it.' },
            { icon: '🧠', name: 'Logic', desc: 'Where your thinking breaks.' },
            { icon: '👶', name: 'Humanize', desc: 'Explained like you\'re 5.' },
            { icon: '🐛', name: 'Debug', desc: 'You find your own bug.' },
            { icon: '⚡', name: 'Optimize', desc: 'Think in complexity.' },
        ],
        cta: null,
    },
    {
        step: 3,
        eyebrow: 'HOW IT WORKS',
        headline: 'Pick a problem.\nAsk. Think. Understand.',
        steps: [
            { n: '01', text: 'Pick a DSA problem from the list' },
            { n: '02', text: 'Paste your code or just describe where you\'re stuck' },
            { n: '03', text: 'Choose a mode based on what kind of help you need' },
            { n: '04', text: 'The AI guides you — never solves for you' },
        ],
        cta: 'Start Thinking →',
    },
];

export default function OnboardingPage() {
    const [current, setCurrent] = useState(0);
    const [exiting, setExiting] = useState(false);
    const router = useRouter();

    function next() {
        if (current < STEPS.length - 1) {
            setExiting(true);
            setTimeout(() => {
                setCurrent(c => c + 1);
                setExiting(false);
            }, 200);
        } else {
            router.push('/compiler');
        }
    }

    function skip() {
        router.push('/compiler');
    }

    const step = STEPS[current];

    return (
        <div style={{
            minHeight: '100vh',
            background: '#0a0a0a',
            color: '#fff',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            fontFamily: 'system-ui, sans-serif',
            padding: '24px',
            position: 'relative',
        }}>

            {/* Skip */}
            <button
                onClick={skip}
                style={{
                    position: 'absolute', top: '24px', right: '24px',
                    background: 'transparent', border: 'none',
                    color: '#444', fontSize: '13px', cursor: 'pointer',
                    letterSpacing: '0.05em'
                }}
            >
                skip →
            </button>

            {/* Progress dots */}
            <div style={{ display: 'flex', gap: '8px', marginBottom: '48px' }}>
                {STEPS.map((_, i) => (
                    <div key={i} style={{
                        width: i === current ? '24px' : '8px',
                        height: '8px',
                        borderRadius: '4px',
                        background: i === current ? '#4F46E5' : '#2a2a2a',
                        transition: 'all 0.3s ease',
                    }} />
                ))}
            </div>

            {/* Content */}
            <div style={{
                maxWidth: '520px',
                width: '100%',
                opacity: exiting ? 0 : 1,
                transform: exiting ? 'translateY(8px)' : 'translateY(0)',
                transition: 'all 0.2s ease',
            }}>

                {/* Eyebrow */}
                <p style={{
                    fontSize: '11px', fontWeight: '700',
                    letterSpacing: '0.12em', color: '#4F46E5',
                    marginBottom: '16px', textTransform: 'uppercase'
                }}>
                    {step.eyebrow}
                </p>

                {/* Headline */}
                <h1 style={{
                    fontSize: '36px', fontWeight: '800',
                    lineHeight: '1.15', marginBottom: '16px',
                    whiteSpace: 'pre-line', color: '#fff',
                    letterSpacing: '-0.02em'
                }}>
                    {step.headline}
                </h1>

                {/* Subtext */}
                {step.sub && (
                    <p style={{
                        fontSize: '16px', color: '#888',
                        lineHeight: '1.65', marginBottom: '32px'
                    }}>
                        {step.sub}
                    </p>
                )}

                {/* Step 1 — Stat */}
                {step.stat && (
                    <div style={{
                        background: '#111', border: '1px solid #1e1e1e',
                        borderRadius: '12px', padding: '20px 24px',
                        marginBottom: '32px'
                    }}>
                        <p style={{
                            fontSize: '14px', color: '#666',
                            margin: '0 0 6px', fontStyle: 'italic'
                        }}>
                            {step.stat}
                        </p>
                        <p style={{ fontSize: '13px', color: '#333', margin: 0 }}>
                            The problem isn't you. It's how you were taught to prepare.
                        </p>
                    </div>
                )}

                {/* Step 2 — Modes */}
                {step.modes && (
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: '1fr 1fr',
                        gap: '10px',
                        marginBottom: '32px'
                    }}>
                        {step.modes.map((mode, i) => (
                            <div key={i} style={{
                                background: '#111',
                                border: '1px solid #1e1e1e',
                                borderRadius: '10px',
                                padding: '14px 16px',
                                gridColumn: i === 4 ? 'span 2' : 'span 1',
                            }}>
                                <div style={{ fontSize: '20px', marginBottom: '6px' }}>
                                    {mode.icon}
                                </div>
                                <div style={{
                                    fontSize: '13px', fontWeight: '600',
                                    color: '#fff', marginBottom: '3px'
                                }}>
                                    {mode.name} Mode
                                </div>
                                <div style={{ fontSize: '12px', color: '#555' }}>
                                    {mode.desc}
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Step 3 — How it works */}
                {step.steps && (
                    <div style={{ marginBottom: '32px' }}>
                        {step.steps.map((s, i) => (
                            <div key={i} style={{
                                display: 'flex', gap: '16px',
                                alignItems: 'flex-start',
                                marginBottom: '16px'
                            }}>
                                <span style={{
                                    fontSize: '11px', fontWeight: '700',
                                    color: '#4F46E5', minWidth: '24px',
                                    marginTop: '2px', letterSpacing: '0.05em'
                                }}>
                                    {s.n}
                                </span>
                                <p style={{
                                    fontSize: '15px', color: '#ccc',
                                    margin: 0, lineHeight: '1.5'
                                }}>
                                    {s.text}
                                </p>
                            </div>
                        ))}
                    </div>
                )}

                {/* CTA Button */}
                <button
                    onClick={next}
                    style={{
                        width: '100%',
                        padding: '16px',
                        background: '#4F46E5',
                        color: '#fff',
                        border: 'none',
                        borderRadius: '12px',
                        fontSize: '15px',
                        fontWeight: '700',
                        cursor: 'pointer',
                        letterSpacing: '0.02em',
                        transition: 'opacity 0.15s',
                    }}
                    onMouseEnter={e => e.target.style.opacity = '0.85'}
                    onMouseLeave={e => e.target.style.opacity = '1'}
                >
                    {current < STEPS.length - 1 ? 'Continue →' : step.cta}
                </button>

                {/* Step counter */}
                <p style={{
                    textAlign: 'center', fontSize: '12px',
                    color: '#333', marginTop: '16px'
                }}>
                    {current + 1} of {STEPS.length}
                </p>
            </div>
        </div>
    );
}