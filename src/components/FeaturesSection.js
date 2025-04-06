import React from 'react';
import { 
  FunnelIcon, 
  ChartBarIcon, 
  EnvelopeIcon, 
  ShieldCheckIcon, 
  BuildingOfficeIcon, 
  PhoneIcon 
} from '@heroicons/react/24/outline';
import './FeaturesSection.css';

const features = [
  {
    name: 'Advanced Filtering',
    description: 'Target leads by location, property value, equity position, and dozens of other criteria.',
    icon: FunnelIcon,
  },
  {
    name: 'Real-Time Analytics',
    description: 'Track your campaign performance with detailed analytics and conversion metrics.',
    icon: ChartBarIcon,
  },
  {
    name: 'Automated Outreach',
    description: 'Set up email and SMS campaigns that nurture leads through your sales funnel.',
    icon: EnvelopeIcon,
  },
  {
    name: 'Verified Data',
    description: 'Our leads are triple-verified to ensure you\'re only contacting qualified prospects.',
    icon: ShieldCheckIcon,
  },
  {
    name: 'CRM Integration',
    description: 'Seamlessly connect with your existing CRM systems for streamlined workflow.',
    icon: BuildingOfficeIcon,
  },
  {
    name: 'Dedicated Support',
    description: 'Get personalized assistance from our team of lead generation experts.',
    icon: PhoneIcon,
  },
];

const FeaturesSection = () => {
  return (
    <section className="py-24 bg-white" id="features">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h2 className="text-base font-semibold text-teal-600 mb-3">Powerful Features</h2>
          <h3 className="text-3xl font-bold text-gray-900 sm:text-4xl mb-6">
            Everything you need to find and convert homeowner leads
          </h3>
          <p className="text-lg text-gray-600">
            Our platform provides comprehensive tools to help you identify, contact, and convert high-quality leads.
          </p>
        </div>
        
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature) => (
              <div key={feature.name} className="bg-gray-50 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
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