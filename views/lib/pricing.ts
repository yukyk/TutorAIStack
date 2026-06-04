export interface Pack {
  id: string;
  label: string;
  credits: number;
  priceINR: number;
  perCredit: string;
  savings: string | null;
  sublabel?: string | null;
  popular: boolean;
}

export interface Tier {
  id: string;
  label: string;
  priceINR: number;
  period: string;
  subtitle: string;
  dailyCredits: number;
  highlight: boolean;
  badge?: string;
  features: string[];
  excluded?: string[];
  cta: { label: string; href?: string; disabled: boolean };
}

export const PACKS: Pack[] = [
  { id: 'starter',  label: 'Starter',  credits: 8,   priceINR: 49,  perCredit: '₹6.1', savings: null,      sublabel: 'Standard rate', popular: false },
  { id: 'basic',    label: 'Basic',    credits: 20,  priceINR: 109, perCredit: '₹5.4', savings: '11% off', sublabel: null,            popular: false },
  { id: 'popular',  label: 'Popular',  credits: 50,  priceINR: 229, perCredit: '₹4.5', savings: '26% off', sublabel: null,            popular: true  },
  { id: 'power',    label: 'Power',    credits: 100, priceINR: 399, perCredit: '₹3.9', savings: '36% off', sublabel: null,            popular: false },
  { id: 'pro',      label: 'Pro',      credits: 150, priceINR: 549, perCredit: '₹3.6', savings: '41% off', sublabel: null,            popular: false },
  { id: 'ultimate', label: 'Ultimate', credits: 200, priceINR: 699, perCredit: '₹3.4', savings: '44% off', sublabel: null,            popular: false },
];

export const TIERS: Tier[] = [
  {
    id: 'free',
    label: 'Free',
    priceINR: 0,
    period: '/month',
    subtitle: 'No credit card required',
    dailyCredits: 5,
    highlight: false,
    features: ['5 AI interactions / day', 'All 35 problems', 'All 5 tutor modes'],
    excluded: ['Analytics'],
    cta: { label: 'Get Started Free', href: '/onboarding', disabled: false },
  },
  {
    id: 'starter',
    label: 'Starter',
    priceINR: 399,
    period: '/month',
    subtitle: 'For consistent learners',
    dailyCredits: 15,
    highlight: false,
    features: ['15 AI interactions / day', 'All 35 problems', 'All 5 tutor modes', 'Analytics report'],
    excluded: [],
    cta: { label: 'Subscribe', disabled: false },
  },
  {
    id: 'pro',
    label: 'Pro',
    priceINR: 999,
    period: '/month',
    subtitle: 'Serious placement prep',
    dailyCredits: 30,
    highlight: true,
    badge: 'Most Popular',
    features: [
      '30 AI interactions / day',
      'All 35 problems',
      'All 5 tutor modes',
      'Analytics + Progress tracking',
      'Priority AI + longer memory',
    ],
    excluded: [],
    cta: { label: 'Subscribe', disabled: false },
  },
];

export const findPack = (id: string): Pack | null => PACKS.find(p => p.id === id) ?? null;
export const findTier = (id: string): Tier | null => TIERS.find(t => t.id === id) ?? null;
