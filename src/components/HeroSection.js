import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { PopupModal } from 'react-calendly';

const HeroSection = () => {
  // Use the correct Calendly URL
  const calendlyUrl = "https://calendly.com/lended/home-leads-demo-call";
  const [isCalendlyOpen, setIsCalendlyOpen] = useState(false);

  const openCalendly = () => {
    setIsCalendlyOpen(true);
  };

  return (
    <section className="relative pt-24 pb-16 md:pt-32 md:pb-24 overflow-hidden bg-gray-50">
      <svg
        className="absolute w-full h-full top-0 left-0 z-0 stroke-brand-500/10 stroke-2"
        aria-hidden="true"
      >
        <defs>
          <pattern
            id="hero-pattern"
            width={200}
            height={200}
            patternUnits="userSpaceOnUse"
            x="50%"
            y={-1}
          >
            <path d="M.5 200V.5H200" fill="none" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" strokeWidth={0} fill="url(#hero-pattern)" />
      </svg>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="max-w-xl mx-auto lg:mx-0 text-center lg:text-left">
            <h1 className="text-4xl sm:text-5xl font-bold leading-tight mb-6 text-gray-900">
              Connect with New Homeowners the Moment They Buy
            </h1>
            <p className="text-lg leading-relaxed text-gray-600 mb-8">
              Get exclusive access to 500-1000 fresh homeowner leads monthly per county, with verified contact details, property information, and purchase prices - all updated daily from deed records.
            </p>
            <div className="flex flex-col sm:flex-row justify-center lg:justify-start gap-4 mb-8">
              <Link to="/signup" className="px-6 py-3 bg-brand-500 hover:bg-brand-600 text-white font-semibold rounded-md shadow-md transition-colors">
                Start Your Free Trial
              </Link>
              <button 
                onClick={openCalendly} 
                className="px-6 py-3 bg-white hover:bg-gray-100 text-brand-500 font-semibold rounded-md border border-brand-500 shadow-sm transition-colors"
              >
                Schedule a Demo
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-y-3 gap-x-4 mt-8">
              <div className="flex items-center justify-center lg:justify-start">
                <svg className="w-5 h-5 text-brand-500 mr-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                </svg>
                <span className="text-sm text-gray-600">Pay only for counties you serve</span>
              </div>
              <div className="flex items-center justify-center lg:justify-start">
                <svg className="w-5 h-5 text-brand-500 mr-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                </svg>
                <span className="text-sm text-gray-600">Daily updates from deed records</span>
              </div>
              <div className="flex items-center justify-center lg:justify-start">
                <svg className="w-5 h-5 text-brand-500 mr-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                </svg>
                <span className="text-sm text-gray-600">Complete contact information</span>
              </div>
            </div>
          </div>
          <div className="flex justify-center">
            <div className="relative w-full max-w-md lg:max-w-full">
              <div className="rounded-xl bg-gray-900/5 p-4 shadow-inner ring-1 ring-gray-900/10 w-full">
                <div className="w-full rounded-lg overflow-hidden shadow-xl transform transition-all">
                  <img 
                    src="/demo.png" 
                    alt="HomeLeads Dashboard" 
                    className="w-full h-auto block rounded-md shadow-lg border border-gray-900/10" 
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <PopupModal
        url={calendlyUrl}
        onModalClose={() => setIsCalendlyOpen(false)}
        open={isCalendlyOpen}
        rootElement={document.getElementById("root")}
      />
    </section>
  );
};

export default HeroSection; 