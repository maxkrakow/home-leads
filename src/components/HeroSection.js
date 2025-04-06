import React from 'react';
import { Link } from 'react-router-dom';
import './HeroSection.css';

const HeroSection = () => {
  return (
    <section className="hero">
      <svg
        className="hero-pattern"
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

      <div className="container">
        <div className="hero-content">
          <h1>Premium Home Owner Leads for Real Estate Professionals</h1>
          <p>Access verified, high-intent homeowner leads to grow your business and close more deals.</p>
          <div className="hero-cta">
            <Link to="/signup" className="btn btn-primary btn-large">Start Your Free Trial</Link>
            <Link to="/demo" className="btn btn-secondary btn-large">Schedule a Demo</Link>
          </div>
          <div className="trust-badges">
            <span>
              <i className="fas fa-check-circle check-icon"></i>
              No credit card required
            </span>
            <span>
              <i className="fas fa-check-circle check-icon"></i>
              14-day free trial
            </span>
          </div>
        </div>
        <div className="hero-image-container">
          <div className="image-background">
            <div className="image-wrapper">
              <img 
                src="https://tailwindcss.com/plus-assets/img/component-images/dark-project-app-screenshot.png" 
                alt="HomeLeads Pro Dashboard" 
                className="dashboard-image" 
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection; 