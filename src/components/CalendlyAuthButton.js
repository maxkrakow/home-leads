import React, { useState, useEffect } from 'react';
import calendlyService from '../services/calendlyService';

const CalendlyAuthButton = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userInfo, setUserInfo] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const tokens = calendlyService.getTokens();
        if (tokens) {
          setIsAuthenticated(true);
          try {
            const user = await calendlyService.getUserInfo();
            setUserInfo(user.resource);
          } catch (error) {
            console.error('Error fetching user info:', error);
            // If we can't get user info, token might be invalid
            setIsAuthenticated(false);
            calendlyService.logout();
          }
        }
      } catch (error) {
        console.error('Auth check error:', error);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const handleLogin = () => {
    window.location.href = calendlyService.getAuthorizationUrl();
  };

  const handleLogout = () => {
    calendlyService.logout();
    setIsAuthenticated(false);
    setUserInfo(null);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      {isAuthenticated ? (
        <div className="flex flex-col items-center">
          <p className="mb-2">
            Connected as: {userInfo?.name || 'Calendly User'}
          </p>
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
          >
            Disconnect Calendly
          </button>
        </div>
      ) : (
        <button
          onClick={handleLogin}
          className="px-4 py-2 bg-brand-500 text-white rounded hover:bg-brand-600"
        >
          Connect with Calendly
        </button>
      )}
    </div>
  );
};

export default CalendlyAuthButton; 