import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import './Header.css';

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
    <header className={`header ${isScrolled ? 'scrolled' : ''}`}>
      <div className="container">
        <div className="header-inner">
          <div className="logo">
            <Link to="/">
              <img src="/logo.png" alt="HomeLeads Pro" />
              <span>HomeLeads Pro</span>
            </Link>
          </div>
          
          <nav className={`main-nav ${mobileMenuOpen ? 'active' : ''}`}>
            <ul>
              <li><a href="#features" onClick={(e) => { e.preventDefault(); scrollToSection('features'); }}>Features</a></li>
              <li><a href="#pricing" onClick={(e) => { e.preventDefault(); scrollToSection('pricing'); }}>Pricing</a></li>
              <li><a href="#testimonials" onClick={(e) => { e.preventDefault(); scrollToSection('testimonials'); }}>Testimonials</a></li>
              <li><a href="#contact" onClick={(e) => { e.preventDefault(); scrollToSection('contact'); }}>Contact</a></li>
            </ul>
          </nav>
          
          <div className="header-buttons">
            {currentUser ? (
              <Link to="/dashboard" className="btn btn-primary">Dashboard</Link>
            ) : (
              <>
                <Link to="/login" className="btn btn-text">Sign in</Link>
                <Link to="/signup" className="btn btn-primary">Get Started</Link>
              </>
            )}
          </div>
          
          <button 
            className="mobile-menu-toggle" 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            <span></span>
            <span></span>
            <span></span>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header; 