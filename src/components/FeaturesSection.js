import React from 'react';
import { 
  FunnelIcon, 
  ChartBarIcon, 
  EnvelopeIcon, 
  ShieldCheckIcon, 
  BuildingOfficeIcon, 
  PhoneIcon 
} from '@heroicons/react/24/outline';

const features = [
  {
    name: 'Daily Deed Updates',
    description: 'Get fresh new homeowner data every day as deeds are recorded in your subscribed counties.',
    icon: FunnelIcon,
  },
  {
    name: 'Comprehensive Analytics',
    description: 'Track market trends with detailed analytics on home sales, prices, and locations.',
    icon: ChartBarIcon,
  },
  {
    name: 'Complete Contact Details',
    description: 'Access verified contact information for new homeowners to connect with your potential customers.',
    icon: EnvelopeIcon,
  },
  {
    name: 'Verified Property Data',
    description: 'Every lead includes verified sale price, property details, and transaction information.',
    icon: ShieldCheckIcon,
  },
  {
    name: 'CRM Integration',
    description: 'Seamlessly connect with your existing CRM systems for streamlined workflow.',
    icon: BuildingOfficeIcon,
  },
  {
    name: 'County-Based Subscriptions',
    description: 'Subscribe only to the counties you serve, with 500-1000 new homeowners per month per county.',
    icon: PhoneIcon,
  },
];

const FeaturesSection = () => {
  return (
    <section className="py-24 bg-gray-50" id="features">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h2 className="text-base font-semibold text-teal-600 mb-3">Powerful Features</h2>
          <h3 className="text-3xl font-bold text-gray-900 sm:text-4xl mb-6">
            Everything you need to connect with new homeowners
          </h3>
          <p className="text-lg text-gray-600">
            Our platform provides daily-updated new homeowner data to help service providers identify and connect with potential customers right when they need your services most.
          </p>
        </div>
        
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature) => (
              <div key={feature.name} className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center mb-4">
                  <div className="flex-shrink-0 h-12 w-12 bg-teal-500 rounded-lg flex items-center justify-center mr-4">
                    <feature.icon className="h-6 w-6 text-white" aria-hidden="true" />
                  </div>
                  <h4 className="text-lg font-semibold text-gray-900">{feature.name}</h4>
                </div>
                <p className="text-gray-600 ml-16">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection; 