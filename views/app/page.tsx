import Hero from '@/components/landing/Hero';
import Features from '@/components/landing/Features';
import HowItWorks from '@/components/landing/HowItWorks';
import Demo from '@/components/landing/Demo';
import RoadmapTimeline from '@/components/landing/RoadmapTimeline';
import Pricing from '@/components/landing/Pricing';
import SocialProof from '@/components/landing/SocialProof';
import FinalCTA from '@/components/landing/FinalCTA';
import Footer from '@/components/shared/Footer';
import Navbar from '@/components/shared/Navbar';

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