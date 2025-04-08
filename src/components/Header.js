import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { currentUser } = useAuth();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (sectionId) => {
    setMobileMenuOpen(false);
    
    // If we're not on the homepage, navigate to homepage first
    if (location.pathname !== '/') {
      window.location.href = `/#${sectionId}`;
      return;
    }
    
    // If we're already on the homepage, just scroll to the section
    const section = document.getElementById(sectionId);
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${isScrolled ? 'bg-white shadow-md' : 'bg-white'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo section */}
          <div className="flex-shrink-0">
            <Link to="/" className="flex items-center text-decoration-none">
              <img src="/logo.png" alt="HomeLeads Pro" className="h-10 w-auto" />
              <span className="ml-2 text-xl font-bold text-gray-900">HomeLeads Pro</span>
            </Link>
          </div>
          
          {/* Main navigation - desktop */}
          <div className="hidden lg:flex lg:items-center lg:justify-center flex-1">
            <div className="flex items-center justify-center space-x-10">
              <a 
                href="#features" 
                onClick={(e) => { e.preventDefault(); scrollToSection('features'); }}
                className="text-base font-medium text-gray-700 hover:text-brand-500 transition-colors"
              >
                Features
              </a>
              <a 
                href="#pricing" 
                onClick={(e) => { e.preventDefault(); scrollToSection('pricing'); }}
                className="text-base font-medium text-gray-700 hover:text-brand-500 transition-colors"
              >
                Pricing
              </a>
              <a 
                href="#testimonials" 
                onClick={(e) => { e.preventDefault(); scrollToSection('testimonials'); }}
                className="text-base font-medium text-gray-700 hover:text-brand-500 transition-colors"
              >
                Testimonials
              </a>
              <a 
                href="#contact" 
                onClick={(e) => { e.preventDefault(); scrollToSection('contact'); }}
                className="text-base font-medium text-gray-700 hover:text-brand-500 transition-colors"
              >
                Contact
              </a>
            </div>
          </div>
          
          {/* Sign in/Get started buttons - desktop */}
          <div className="hidden lg:flex lg:items-center">
            {currentUser ? (
              <Link 
                to="/dashboard" 
                className="ml-8 inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-brand-500 hover:bg-brand-600"
              >
                Dashboard
              </Link>
            ) : (
              <>
                <Link 
                  to="/login" 
                  className="text-base font-medium text-gray-700 hover:text-brand-500"
                >
                  Sign in
                </Link>
                <Link 
                  to="/signup" 
                  className="ml-8 inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-brand-500 hover:bg-brand-600"
                >
                  Get Started
                </Link>
              </>
            )}
          </div>
          
          {/* Mobile menu button */}
          <div className="flex lg:hidden">
            <button 
              type="button"
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <span className="sr-only">Open main menu</span>
              {mobileMenuOpen ? (
                <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>
      
      {/* Mobile menu, show/hide based on menu state */}
      <div className={`lg:hidden ${mobileMenuOpen ? 'block' : 'hidden'}`}>
        <div className="px-2 pt-2 pb-3 space-y-1 bg-white shadow-lg">
          <a 
            href="#features" 
            onClick={(e) => { e.preventDefault(); scrollToSection('features'); setMobileMenuOpen(false); }}
            className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-brand-500 hover:bg-gray-50"
          >
            Features
          </a>
          <a 
            href="#pricing" 
            onClick={(e) => { e.preventDefault(); scrollToSection('pricing'); setMobileMenuOpen(false); }}
            className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-brand-500 hover:bg-gray-50"
          >
            Pricing
          </a>
          <a 
            href="#testimonials" 
            onClick={(e) => { e.preventDefault(); scrollToSection('testimonials'); setMobileMenuOpen(false); }}
            className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-brand-500 hover:bg-gray-50"
          >
            Testimonials
          </a>
          <a 
            href="#contact" 
            onClick={(e) => { e.preventDefault(); scrollToSection('contact'); setMobileMenuOpen(false); }}
            className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-brand-500 hover:bg-gray-50"
          >
            Contact
          </a>
        </div>
        <div className="pt-4 pb-3 border-t border-gray-200">
          <div className="px-5 space-y-3">
            {currentUser ? (
              <Link 
                to="/dashboard" 
                className="block w-full px-4 py-2 text-center font-medium text-white bg-brand-500 hover:bg-brand-600 rounded-md shadow-sm"
                onClick={() => setMobileMenuOpen(false)}
              >
                Dashboard
              </Link>
            ) : (
              <>
                <Link 
                  to="/login" 
                  className="block w-full px-4 py-2 text-center font-medium text-gray-700 hover:text-brand-500 bg-gray-50 hover:bg-gray-100 rounded-md"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Sign in
                </Link>
                <Link 
                  to="/signup" 
                  className="block w-full px-4 py-2 text-center font-medium text-white bg-brand-500 hover:bg-brand-600 rounded-md shadow-sm"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Get Started
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header; 