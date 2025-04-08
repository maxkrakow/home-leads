import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import calendlyService from '../services/calendlyService';

const CalendlyAuthCallback = () => {
  const navigate = useNavigate();
  const [status, setStatus] = useState('Processing...');
  const [error, setError] = useState(null);
  
  useEffect(() => {
    const handleCallback = async () => {
      try {
        // Get the authorization code from the URL
        const urlParams = new URLSearchParams(window.location.search);
        const code = urlParams.get('code');
        
        if (!code) {
          setError('No authorization code received');
          return;
        }
        
        setStatus('Exchanging code for access token...');
        
        // Exchange the code for an access token
        await calendlyService.getAccessToken(code);
        
        setStatus('Successfully authenticated with Calendly!');
        
        // Redirect to homepage or dashboard after successful auth
        setTimeout(() => {
          navigate('/');
        }, 2000);
      } catch (err) {
        console.error('Authentication error:', err);
        
        // Check for specific error messages
        if (err.message.includes('invalid')) {
          setError('Authentication failed: Invalid credentials or permissions. Please try again and ensure you grant all requested permissions.');
        } else {
          setError(`Authentication failed: ${err.message}`);
        }
      }
    };
    
    handleCallback();
  }, [navigate]);
  
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      {error ? (
        <div className="text-red-600 mb-4">{error}</div>
      ) : (
        <div className="mb-4">{status}</div>
      )}
      <button 
        onClick={() => navigate('/')}
        className="px-4 py-2 bg-brand-500 text-white rounded hover:bg-brand-600"
      >
        Return to Home
      </button>
    </div>
  );
};

export default CalendlyAuthCallback; 