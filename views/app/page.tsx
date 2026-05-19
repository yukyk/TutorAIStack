import Hero from '@/components/landing/Hero';
import Features from '@/components/landing/Features';
import HowItWorks from '@/components/landing/HowItWorks';
import Pricing from '@/components/landing/Pricing';
import FinalCTA from '@/components/landing/FinalCTA';
import Footer from '@/components/shared/Footer';
import Navbar from '@/components/shared/Navbar';
import dynamic from 'next/dynamic';

const Demo = dynamic(() => import('@/components/landing/Demo'), {
  loading: () => <div style={{ height: '400px' }} />,
});
const RoadmapTimeline = dynamic(() => import('@/components/landing/RoadmapTimeline'), {
  loading: () => <div style={{ height: '400px' }} />,
});
const SocialProof = dynamic(() => import('@/components/landing/SocialProof'), {
  loading: () => <div style={{ height: '300px' }} />,
});

export default function HomePage() {
  return (
    <main className="bg-[#0B0F19] min-h-screen text-white">
      <Navbar />
      <Hero />
      <Features />
      <HowItWorks />
      <Demo />
      <RoadmapTimeline />
      <SocialProof />
      <Pricing />
      <FinalCTA />
      <Footer />
    </main>
  );
}