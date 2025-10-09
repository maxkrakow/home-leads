import React from 'react';
import { 
  FunnelIcon, 
  ChartBarIcon, 
  EnvelopeIcon, 
  ShieldCheckIcon, 
  BuildingOfficeIcon, 
  PhoneIcon,
  UserGroupIcon,
  ChatBubbleLeftRightIcon,
  HeartIcon,
  StarIcon
} from '@heroicons/react/24/outline';

const homeLeadsFeatures = [
  {
    name: 'Daily Deed Updates',
    description: 'Get fresh new homeowner data every day as deeds are recorded in your subscribed counties.',
    icon: FunnelIcon,
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
    name: 'Direct Mail Campaigns',
    description: 'We handle the entire direct mail process from design to delivery for maximum impact.',
    icon: EnvelopeIcon,
  },
  {
    name: 'County-Based Subscriptions',
    description: 'Subscribe only to the counties you serve, with 500-1000 new homeowners per month per county.',
    icon: PhoneIcon,
  },
  {
    name: 'Low Customer Acquisition Cost',
    description: 'Average customer acquisition cost of just $240 - unheard of in the home services industry.',
    icon: ChartBarIcon,
  },
];

const facebookGroupsFeatures = [
  {
    name: 'Strategic Group Selection',
    description: 'We identify and engage with the right Facebook groups where your target audience is most active.',
    icon: UserGroupIcon,
  },
  {
    name: 'Expert Content Creation',
    description: 'Our copywriters craft engaging, value-driven posts that showcase your expertise and resonate with local audiences.',
    icon: ChatBubbleLeftRightIcon,
  },
  {
    name: 'Community Engagement',
    description: 'We build natural, authentic connections within your target community, increasing brand awareness.',
    icon: HeartIcon,
  },
  {
    name: 'Organic Lead Generation',
    description: 'Generate 4+ qualified leads weekly through genuine community trust and engagement.',
    icon: StarIcon,
  },
  {
    name: 'Brand Reputation Building',
    description: 'Establish your business as a trusted, visible presence in your local community.',
    icon: BuildingOfficeIcon,
  },
  {
    name: 'Proven Results',
    description: '30,000+ monthly organic impressions and $10M+ in revenue generated for our clients.',
    icon: ChartBarIcon,
  },
];

const FeaturesSection = () => {
  return (
    <section className="py-24 bg-white" id="features">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center mb-16">
          <h2 className="text-base font-semibold text-brand-500 mb-3">How It Works</h2>
          <h3 className="text-3xl font-bold text-gray-900 sm:text-4xl mb-6">
            Our Integrated Lead Generation System
          </h3>
          <p className="text-lg text-gray-600">
            Our comprehensive approach combines two complementary strategies that work together to maximize your lead generation. 
            Use one or both methods based on your business needs and market preferences.
          </p>
        </div>
        
        {/* Home Leads Section */}
        <div className="mb-20">
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
              <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5a2 2 0 012-2h4a2 2 0 012 2v2H8V5z" />
              </svg>
            </div>
            <h4 className="text-2xl font-bold text-gray-900 mb-2">Strategy 1: Direct Targeting</h4>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Target new homeowners the moment they buy with verified deed data and strategic direct mail campaigns.
            </p>
          </div>
          
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {homeLeadsFeatures.map((feature) => (
                <div key={feature.name} className="bg-gray-50 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex items-center mb-4">
                    <div className="flex-shrink-0 h-12 w-12 bg-blue-500 rounded-lg flex items-center justify-center mr-4">
                      <feature.icon className="h-6 w-6 text-white" aria-hidden="true" />
                    </div>
                    <h5 className="text-lg font-semibold text-gray-900">{feature.name}</h5>
                  </div>
                  <p className="text-gray-600 ml-16">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Facebook Groups Section */}
        <div>
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-purple-100 rounded-full mb-4">
              <svg className="w-8 h-8 text-purple-600" fill="currentColor" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
              </svg>
            </div>
            <h4 className="text-2xl font-bold text-gray-900 mb-2">Strategy 2: Community Building</h4>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Build genuine community trust and generate organic leads through strategic Facebook group engagement.
            </p>
          </div>
          
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {facebookGroupsFeatures.map((feature) => (
                <div key={feature.name} className="bg-gray-50 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex items-center mb-4">
                    <div className="flex-shrink-0 h-12 w-12 bg-purple-500 rounded-lg flex items-center justify-center mr-4">
                      <feature.icon className="h-6 w-6 text-white" aria-hidden="true" />
                    </div>
                    <h5 className="text-lg font-semibold text-gray-900">{feature.name}</h5>
                  </div>
                  <p className="text-gray-600 ml-16">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection; 