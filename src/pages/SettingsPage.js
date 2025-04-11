import React from 'react';
import CalendlyAuthButton from '../components/CalendlyAuthButton';

const SettingsPage = () => {
  return (
    <div className="container mx-auto px-4 py-8 bg-white">
      <h1 className="text-2xl font-bold mb-6">Account Settings</h1>
      
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Integrations</h2>
        
        <div className="border-t border-gray-200 pt-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium">Calendly</h3>
              <p className="text-sm text-gray-700">
                Connect your Calendly account to allow customers to schedule demos directly.
              </p>
            </div>
            <CalendlyAuthButton />
          </div>
        </div>
      </div>
      
      {/* Other settings sections can go here */}
    </div>
  );
};

export default SettingsPage; 