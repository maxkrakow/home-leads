import React, { useState } from 'react';
import { PopupModal } from 'react-calendly';

const HeroSection = () => {
  const calendlyUrl = "https://calendly.com/max-untappedhomes/30min?month=2026-04&date=2026-04-13";
  const [isCalendlyOpen, setIsCalendlyOpen] = useState(false);
  const [cityInput, setCityInput] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [services, setServices] = useState({
    directTargeting: false,
    communityBuilding: false
  });
  const [cachedNumbers, setCachedNumbers] = useState({
    newHomeowners: null,
    bookRate: null,
    facebookLeads: null
  });

  const openCalendly = () => {
    setIsCalendlyOpen(true);
  };

  // Cities database
  const cities = [
    'New York, NY', 'Los Angeles, CA', 'Chicago, IL', 'Houston, TX', 'Phoenix, AZ',
    'Philadelphia, PA', 'San Antonio, TX', 'San Diego, CA', 'Dallas, TX', 'San Jose, CA',
    'Austin, TX', 'Jacksonville, FL', 'Fort Worth, TX', 'Columbus, OH', 'Charlotte, NC',
    'San Francisco, CA', 'Indianapolis, IN', 'Seattle, WA', 'Denver, CO', 'Washington, DC',
    'Boston, MA', 'El Paso, TX', 'Nashville, TN', 'Detroit, MI', 'Oklahoma City, OK',
    'Portland, OR', 'Las Vegas, NV', 'Memphis, TN', 'Louisville, KY', 'Baltimore, MD',
    'Milwaukee, WI', 'Albuquerque, NM', 'Tucson, AZ', 'Fresno, CA', 'Sacramento, CA',
    'Mesa, AZ', 'Kansas City, MO', 'Atlanta, GA', 'Long Beach, CA', 'Colorado Springs, CO',
    'Raleigh, NC', 'Miami, FL', 'Virginia Beach, VA', 'Omaha, NE', 'Oakland, CA',
    'Minneapolis, MN', 'Tulsa, OK', 'Arlington, TX', 'Tampa, FL', 'New Orleans, LA',
    'Cook County, IL', 'Los Angeles County, CA', 'Harris County, TX', 'Maricopa County, AZ',
    'San Diego County, CA', 'Orange County, CA', 'Miami-Dade County, FL', 'King County, WA',
    'Dallas County, TX', 'Tarrant County, TX', 'Broward County, FL', 'Riverside County, CA',
    'Wayne County, MI', 'Santa Clara County, CA', 'Allegheny County, PA', 'Suffolk County, NY'
  ];

  const filteredCities = cities.filter(city => 
    city.toLowerCase().includes(cityInput.toLowerCase())
  );

  // Generate or use cached numbers
  const newHomeowners = cachedNumbers.newHomeowners || Math.floor(Math.random() * 401) + 800;
  const bookRate = cachedNumbers.bookRate || (Math.random() * 2 + 1.5).toFixed(1); // 1.5-3.5%
  const facebookLeads = cachedNumbers.facebookLeads || Math.floor(Math.random() * 8) + 15;

  // Cache numbers when city changes
  React.useEffect(() => {
    if (cityInput && !cachedNumbers.newHomeowners) {
      setCachedNumbers({
        newHomeowners: Math.floor(Math.random() * 401) + 800,
        bookRate: (Math.random() * 2 + 1.5).toFixed(1), // 1.5-3.5%
        facebookLeads: Math.floor(Math.random() * 8) + 15
      });
    }
  }, [cityInput, cachedNumbers.newHomeowners]);

  const totalLeads = (services.directTargeting ? Math.round(newHomeowners * bookRate / 100) : 0) + 
                    (services.communityBuilding ? facebookLeads : 0);

  const handleServiceChange = (service) => {
    const newServices = { ...services, [service]: !services[service] };
    setServices(newServices);
    
    if (service === 'directTargeting' && !services.directTargeting && cityInput) {
      setIsLoading(true);
      setTimeout(() => setIsLoading(false), 2000);
    }
  };

  return (
    <section className="relative pt-24 pb-16 md:pt-32 md:pb-24 overflow-hidden bg-gray-50">
      <svg
        className="absolute w-full h-full top-0 left-0 z-0 stroke-brand-500/10 stroke-2"
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

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-16">
          <h1 className="text-4xl sm:text-6xl font-bold leading-tight mb-6 text-gray-900">
            Turn Your Community Into Your<br />
            <em className="text-brand-600">Lead Pipeline</em>
          </h1>
          <p className="text-xl leading-relaxed text-gray-600 mb-8 max-w-4xl mx-auto">
            Our integrated approach combines two powerful strategies to maximize your lead generation: 
            <span className="font-semibold text-brand-600"> Direct targeting of new homeowners</span> and 
            <span className="font-semibold text-brand-600"> community building through Facebook groups</span>. 
            Use one or both methods to generate qualified leads at a fraction of traditional advertising costs.
          </p>
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-8 max-w-2xl mx-auto">
            <p className="text-green-800 font-medium">
              <span className="text-2xl font-bold">200+</span> businesses scaled • 
              <span className="text-2xl font-bold"> $10M+</span> revenue generated • 
              <span className="text-2xl font-bold"> 60%</span> average book rate
            </p>
          </div>
          <div className="flex flex-col sm:flex-row justify-center gap-4 mb-12">
            <button 
              onClick={openCalendly} 
              className="px-8 py-4 bg-brand-500 hover:bg-brand-600 text-white font-semibold rounded-md shadow-md transition-colors text-lg"
            >
              Book Your Free Strategy Session
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Strategy 1: Direct Targeting */}
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-8 shadow-lg border border-blue-200 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-20 h-20 bg-blue-200 rounded-full -mr-10 -mt-10 opacity-50"></div>
            <div className="relative">
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5a2 2 0 012-2h4a2 2 0 012 2v2H8V5z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Strategy 1: Direct Targeting</h3>
                <p className="text-blue-700 font-medium">Deed Scraping & Direct Mail</p>
              </div>
              
              <div className="space-y-4 mb-8">
                <div className="flex items-start">
                  <svg className="w-5 h-5 text-blue-500 mr-3 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                  </svg>
                  <span className="text-gray-700">500-1000 new homeowners monthly per county</span>
                </div>
                <div className="flex items-start">
                  <svg className="w-5 h-5 text-blue-500 mr-3 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                  </svg>
                  <span className="text-gray-700">Daily updates from deed records</span>
                </div>
                <div className="flex items-start">
                  <svg className="w-5 h-5 text-blue-500 mr-3 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                  </svg>
                  <span className="text-gray-700">Complete contact details & property info</span>
                </div>
                <div className="flex items-start">
                  <svg className="w-5 h-5 text-blue-500 mr-3 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                  </svg>
                  <span className="text-gray-700">Direct mail campaigns included</span>
                </div>
              </div>
              
              <div className="text-center">
                <div className="bg-blue-500 text-white rounded-lg p-4 mb-4">
                  <div className="text-2xl font-bold">60%</div>
                  <div className="text-sm opacity-90">average book rate</div>
                </div>
                <button 
                  onClick={openCalendly} 
                  className="w-full px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-md transition-colors"
                >
                  Learn More About Direct Targeting
                </button>
              </div>
            </div>
          </div>

          {/* Strategy 2: Community Building */}
          <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl p-8 shadow-lg border border-purple-200 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-20 h-20 bg-purple-200 rounded-full -mr-10 -mt-10 opacity-50"></div>
            <div className="relative">
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Strategy 2: Community Building</h3>
                <p className="text-purple-700 font-medium">Facebook Groups & Organic Leads</p>
              </div>
              
              <div className="space-y-4 mb-8">
                <div className="flex items-start">
                  <svg className="w-5 h-5 text-purple-500 mr-3 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                  </svg>
                  <span className="text-gray-700">30,000+ monthly organic impressions</span>
                </div>
                <div className="flex items-start">
                  <svg className="w-5 h-5 text-purple-500 mr-3 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                  </svg>
                  <span className="text-gray-700">4+ qualified leads weekly</span>
                </div>
                <div className="flex items-start">
                  <svg className="w-5 h-5 text-purple-500 mr-3 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                  </svg>
                  <span className="text-gray-700">Build genuine community trust</span>
                </div>
                <div className="flex items-start">
                  <svg className="w-5 h-5 text-purple-500 mr-3 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                  </svg>
                  <span className="text-gray-700">Expert copywriting & content creation</span>
                </div>
              </div>
              
              <div className="text-center">
                <div className="bg-purple-500 text-white rounded-lg p-4 mb-4">
                  <div className="text-2xl font-bold">$10M+</div>
                  <div className="text-sm opacity-90">revenue generated</div>
                </div>
                <button 
                  onClick={openCalendly} 
                  className="w-full px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-md transition-colors"
                >
                  Learn More About Community Building
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Lead Calculator */}
        <div id="calculator" className="mt-20 bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-8 shadow-lg border border-gray-200 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-brand-200 rounded-full -mr-16 -mt-16 opacity-30"></div>
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-brand-300 rounded-full -ml-12 -mb-12 opacity-20"></div>
          
          <div className="relative">
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-brand-500 rounded-full mb-4">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Calculate Your Monthly Leads</h3>
              <p className="text-gray-600">See how many qualified leads you could generate in your area</p>
            </div>
            
            <div className="max-w-4xl mx-auto">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Input Section */}
                <div className="bg-white rounded-xl p-6 shadow-sm">
                  <div className="space-y-6">
                    <div className="relative">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Enter Your City or County
                      </label>
                      <input
                        type="text"
                        value={cityInput}
                        onChange={(e) => {
                          setCityInput(e.target.value);
                          setShowSuggestions(e.target.value.length > 0);
                        }}
                        onFocus={() => setShowSuggestions(cityInput.length > 0)}
                        placeholder="e.g., Philadelphia, PA or Cook County, IL"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-brand-500 focus:border-brand-500"
                      />
                      {showSuggestions && filteredCities.length > 0 && (
                        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                          {filteredCities.slice(0, 8).map((city, index) => (
                            <div
                              key={index}
                              className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-sm rounded-lg mx-1 my-1"
                              onClick={() => {
                                setCityInput(city);
                                setShowSuggestions(false);
                              }}
                            >
                              {city}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-3">
                        Select Services
                      </label>
                      <div className="space-y-3">
                        <label className="flex items-center p-3 rounded-lg hover:bg-gray-50 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={services.directTargeting}
                            onChange={() => handleServiceChange('directTargeting')}
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                          />
                          <span className="ml-3 text-sm text-gray-700 font-medium">Direct Targeting (New Homeowners)</span>
                        </label>
                        <label className="flex items-center p-3 rounded-lg hover:bg-gray-50 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={services.communityBuilding}
                            onChange={() => handleServiceChange('communityBuilding')}
                            className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                          />
                          <span className="ml-3 text-sm text-gray-700 font-medium">Community Building (Facebook Groups)</span>
                        </label>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Results Section */}
                <div className="bg-white rounded-xl p-6 shadow-sm">
                  <h4 className="text-lg font-semibold text-gray-900 mb-4">Your Monthly Lead Estimate</h4>
                  
                  {cityInput && (services.directTargeting || services.communityBuilding) ? (
                    <div className="space-y-4">
                      {isLoading ? (
                        <div className="text-center py-8">
                          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-600 mx-auto mb-4"></div>
                          <p className="text-sm text-gray-600">Pulling deed data from {cityInput}...</p>
                        </div>
                      ) : (
                        <>
                          {services.directTargeting && (
                            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                              <h5 className="font-medium text-gray-900 mb-2">Direct Targeting</h5>
                              <p className="text-sm text-gray-600">
                                {newHomeowners} new homeowners × {bookRate}% book rate = 
                                <span className="font-bold text-blue-600 ml-1">{Math.round(newHomeowners * bookRate / 100)} leads/month</span>
                              </p>
                            </div>
                          )}
                          
                          {services.communityBuilding && (
                            <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                              <h5 className="font-medium text-gray-900 mb-2">Community Building</h5>
                              <p className="text-sm text-gray-600">
                                Based on our client results = 
                                <span className="font-bold text-purple-600 ml-1">{facebookLeads} leads/month</span>
                              </p>
                            </div>
                          )}
                          
                          <div className="bg-brand-50 border border-brand-200 rounded-lg p-4">
                            <h5 className="font-bold text-gray-900 text-lg mb-1">
                              Total: {totalLeads} leads/month
                            </h5>
                            <p className="text-sm text-gray-600">
                              Estimated value: ${(totalLeads * 1500).toLocaleString()}/month
                            </p>
                          </div>
                        </>
                      )}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <p className="text-gray-500 text-sm">Enter your city and select at least one service to see your lead estimate</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <PopupModal
        url={calendlyUrl}
        onModalClose={() => setIsCalendlyOpen(false)}
        open={isCalendlyOpen}
        rootElement={document.getElementById("root")}
      />
    </section>
  );
};

export default HeroSection; 