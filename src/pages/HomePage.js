import React from 'react';
import HeroSection from '../components/HeroSection';
import FeaturesSection from '../components/FeaturesSection';
import TestimonialsSection from '../components/TestimonialsSection';
import PricingSection from '../components/PricingSection';
import ContactSection from '../components/ContactSection';
// Remove HomePage.css import

const HomePage = () => {
  return (
    <div className="w-full">
      <HeroSection />
      <FeaturesSection />
      <TestimonialsSection />
      <PricingSection />
      <ContactSection />
      {/* Add other sections here */}
    </div>
  );
};

export default HomePage; 