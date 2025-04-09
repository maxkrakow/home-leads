import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { PopupModal } from 'react-calendly';

const Footer = () => {
  const [isCalendlyOpen, setIsCalendlyOpen] = useState(false);
  const calendlyUrl = "https://calendly.com/lended/home-leads-demo-call";

  const openCalendly = (e) => {
    e.preventDefault();
    setIsCalendlyOpen(true);
  };

  return (
    <footer className="bg-gray-800 text-gray-200 py-16 px-4">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-2">
            <div className="mb-4">
              <img src="/logo.png" alt="Untapped Homes" className="h-10 mb-4" />
            </div>
            <p className="text-gray-400 mb-6 leading-relaxed">
              Daily-updated new homeowner data with verified contact details for service providers.
            </p>
            <div className="flex gap-4">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer"
                 className="flex items-center justify-center w-9 h-9 bg-opacity-10 bg-white rounded-full text-white hover:bg-blue-500 transition-colors">
                <i className="fab fa-facebook-f"></i>
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer"
                 className="flex items-center justify-center w-9 h-9 bg-opacity-10 bg-white rounded-full text-white hover:bg-blue-500 transition-colors">
                <i className="fab fa-twitter"></i>
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer"
                 className="flex items-center justify-center w-9 h-9 bg-opacity-10 bg-white rounded-full text-white hover:bg-blue-500 transition-colors">
                <i className="fab fa-linkedin-in"></i>
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer"
                 className="flex items-center justify-center w-9 h-9 bg-opacity-10 bg-white rounded-full text-white hover:bg-blue-500 transition-colors">
                <i className="fab fa-instagram"></i>
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold text-white mb-6">Product</h3>
            <ul className="space-y-3">
              <li><a href="#features" className="text-gray-400 hover:text-white transition-colors">Features</a></li>
              <li><a href="#pricing" className="text-gray-400 hover:text-white transition-colors">Pricing</a></li>
              <li><a href="#testimonials" className="text-gray-400 hover:text-white transition-colors">Testimonials</a></li>
              <li><a href="#demo" onClick={openCalendly} className="text-gray-400 hover:text-white transition-colors">Schedule a Demo</a></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold text-white mb-6">Legal</h3>
            <ul className="space-y-3">
              <li><Link to="/privacy" className="text-gray-400 hover:text-white transition-colors">Privacy Policy</Link></li>
              <li><Link to="/terms" className="text-gray-400 hover:text-white transition-colors">Terms of Service</Link></li>
              <li><Link to="/security" className="text-gray-400 hover:text-white transition-colors">Security</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="mt-12 pt-8 border-t border-gray-700 text-center text-gray-400 text-sm">
          <p>&copy; {new Date().getFullYear()} Untapped Homes. All rights reserved.</p>
        </div>
      </div>

      <PopupModal
        url={calendlyUrl}
        onModalClose={() => setIsCalendlyOpen(false)}
        open={isCalendlyOpen}
        rootElement={document.getElementById("root")}
      />
    </footer>
  );
};

export default Footer; 