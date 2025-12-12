import React from 'react';
import Hero from '../components/Hero';
import About from '../components/About';
import FeaturesPreview from '../components/FeaturesPreview';
import HowItWorks from '../components/HowItWorks';
import WhyItWorks from '../components/WhyItWorks';
import TrainerHighlights from '../components/TrainerHighlights';
import SuccessStories from '../components/SuccessStories';
import AppWorkflow from '../components/AppWorkflow';
import MembershipPreview from '../components/MembershipPreview';
import CTA from '../components/CTA';
import Footer from '../components/Footer';
import FitBotWidget from '../components/FitBotWidget';

export default function Home() {
  return (
    <div className="overflow-x-hidden">
      <Hero />
      <About />
      <HowItWorks />
      <FeaturesPreview />
      <WhyItWorks />
      <TrainerHighlights />
      <SuccessStories />
      <AppWorkflow />
      <MembershipPreview />
      <CTA />
      <Footer />
      <FitBotWidget />
    </div>
  );
}
