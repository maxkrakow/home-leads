import React, { useState } from 'react';
import { PopupModal } from 'react-calendly';

const ContactSection = () => {
  const calendlyUrl = "https://calendly.com/untappedleads/untapped-homes-demo";
  const [isCalendlyOpen, setIsCalendlyOpen] = useState(false);

  const openCalendly = () => {
    setIsCalendlyOpen(true);
  };

  return (
    <section className="bg-gray-50 py-16 sm:py-24" id="contact">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Ready to Transform Your Lead Generation?
          </h2>
          <p className="mt-6 text-lg leading-8 text-gray-600">
            Book your free strategy session today and discover how we can help you:
          </p>
          
          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto">
            <div className="flex items-center justify-center">
              <svg className="w-5 h-5 text-green-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
              </svg>
              <span className="text-gray-700">Access thousands of potential customers in your local market</span>
            </div>
            <div className="flex items-center justify-center">
              <svg className="w-5 h-5 text-green-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
              </svg>
              <span className="text-gray-700">Build genuine community trust and recognition</span>
            </div>
            <div className="flex items-center justify-center">
              <svg className="w-5 h-5 text-green-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
              </svg>
              <span className="text-gray-700">Generate qualified leads without expensive ad spend</span>
            </div>
            <div className="flex items-center justify-center">
              <svg className="w-5 h-5 text-green-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
              </svg>
              <span className="text-gray-700">Create a sustainable, organic growth engine</span>
            </div>
          </div>
          
          <div className="mt-12">
            <button 
              onClick={openCalendly} 
              className="inline-flex items-center justify-center px-8 py-4 border border-transparent text-lg font-medium rounded-md text-white bg-brand-500 hover:bg-brand-600 shadow-lg transition-colors"
            >
              Schedule Your Free Strategy Session
            </button>
            <p className="mt-4 text-sm text-gray-500">
              No commitment required • 30-minute consultation • Custom strategy for your business
            </p>
          </div>
        </div>

        {/* Contact Information */}
        <div className="mt-20 border-t border-gray-200 pt-16">
          <div className="mx-auto max-w-2xl grid grid-cols-1 gap-8 text-base leading-7 sm:grid-cols-2 sm:gap-y-16 lg:mx-0 lg:max-w-none lg:grid-cols-3">
            <div>
              <h3 className="border-l border-brand-500 pl-6 font-semibold text-gray-900">Our Office</h3>
              <address className="border-l border-gray-200 pl-6 pt-2 not-italic text-gray-600">
                <p>123 Main Street</p>
                <p>Suite 456</p>
                <p>San Francisco, CA 94105</p>
              </address>
            </div>
            <div>
              <h3 className="border-l border-brand-500 pl-6 font-semibold text-gray-900">Contact</h3>
              <dl className="border-l border-gray-200 pl-6 pt-2 space-y-4 text-gray-600">
                <div>
                  <dt className="sr-only">Email</dt>
                  <dd>
                    <a className="hover:text-brand-500" href="mailto:info@untappedhomes.com">
                      info@untappedhomes.com
                    </a>
                  </dd>
                </div>
                <div>
                  <dt className="sr-only">Phone</dt>
                  <dd>
                    <a className="hover:text-brand-500" href="tel:+1 (914) 319-7160">
                      +1 (914) 319-7160
                    </a>
                  </dd>
                </div>
              </dl>
            </div>
            <div>
              <h3 className="border-l border-brand-500 pl-6 font-semibold text-gray-900">Support</h3>
              <dl className="border-l border-gray-200 pl-6 pt-2 space-y-4 text-gray-600">
                <div>
                  <dt className="sr-only">Email</dt>
                  <dd>
                    <a className="hover:text-brand-500" href="mailto:support@untappedhomes.com">
                      support@untappedhomes.com
                    </a>
                  </dd>
                </div>
                <div>
                  <dt className="sr-only">Phone</dt>
                  <dd>
                    <a className="hover:text-brand-500" href="tel:+1 (914) 319-7160">
                      +1 (914) 319-7160
                    </a>
                  </dd>
                </div>
              </dl>
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

export default ContactSection; 