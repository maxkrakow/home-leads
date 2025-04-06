import React, { useState } from 'react';
import './ContactSection.css';

const ContactSection = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError('');
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Reset form and show success message
      setFormData({ name: '', email: '', phone: '', message: '' });
      setSubmitSuccess(true);
      setTimeout(() => setSubmitSuccess(false), 5000);
    } catch (error) {
      setSubmitError('There was an error submitting your message. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="bg-gray-50 py-16 sm:py-24" id="contact">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl lg:mx-0">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">Contact us</h2>
          <p className="mt-6 text-lg leading-8 text-gray-600">
            Have questions about our platform? Want to learn more about how we can help you generate and convert more leads?
            Fill out the form below and our team will get back to you shortly.
          </p>
        </div>
        <div className="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-8 text-base leading-7 sm:grid-cols-2 sm:gap-y-16 lg:mx-0 lg:max-w-none lg:grid-cols-3">
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
                  <a className="hover:text-brand-500" href="mailto:info@homeleadspro.com">
                    info@homeleadspro.com
                  </a>
                </dd>
              </div>
              <div>
                <dt className="sr-only">Phone</dt>
                <dd>
                  <a className="hover:text-brand-500" href="tel:+1 (555) 234-5678">
                    +1 (555) 234-5678
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
                  <a className="hover:text-brand-500" href="mailto:support@homeleadspro.com">
                    support@homeleadspro.com
                  </a>
                </dd>
              </div>
              <div>
                <dt className="sr-only">Phone</dt>
                <dd>
                  <a className="hover:text-brand-500" href="tel:+1 (555) 987-6543">
                    +1 (555) 987-6543
                  </a>
                </dd>
              </div>
            </dl>
          </div>
        </div>
        <div className="mx-auto mt-16 max-w-2xl rounded-lg bg-white p-8 shadow-lg lg:mx-0 lg:max-w-none">
          <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-y-6 sm:grid-cols-2 sm:gap-x-8">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                Name
              </label>
              <div className="mt-1">
                <input
                  type="text"
                  name="name"
                  id="name"
                  autoComplete="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  className="block w-full rounded-md border-gray-300 py-3 px-4 shadow-sm focus:border-brand-500 focus:ring-brand-500"
                />
              </div>
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <div className="mt-1">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="block w-full rounded-md border-gray-300 py-3 px-4 shadow-sm focus:border-brand-500 focus:ring-brand-500"
                />
              </div>
            </div>
            <div className="sm:col-span-2">
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                Phone
              </label>
              <div className="mt-1">
                <input
                  type="text"
                  name="phone"
                  id="phone"
                  autoComplete="tel"
                  value={formData.phone}
                  onChange={handleChange}
                  className="block w-full rounded-md border-gray-300 py-3 px-4 shadow-sm focus:border-brand-500 focus:ring-brand-500"
                />
              </div>
            </div>
            <div className="sm:col-span-2">
              <label htmlFor="message" className="block text-sm font-medium text-gray-700">
                Message
              </label>
              <div className="mt-1">
                <textarea
                  id="message"
                  name="message"
                  rows={4}
                  required
                  value={formData.message}
                  onChange={handleChange}
                  className="block w-full rounded-md border-gray-300 py-3 px-4 shadow-sm focus:border-brand-500 focus:ring-brand-500"
                />
              </div>
            </div>
            <div className="sm:col-span-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="inline-flex w-full items-center justify-center rounded-md border border-transparent bg-brand-500 px-6 py-3 text-base font-medium text-white shadow-sm hover:bg-brand-600 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2 disabled:opacity-75"
              >
                {isSubmitting ? 'Sending...' : 'Send Message'}
              </button>
              {submitSuccess && (
                <p className="mt-3 text-sm text-green-600">
                  Thank you! Your message has been sent successfully.
                </p>
              )}
              {submitError && (
                <p className="mt-3 text-sm text-red-600">{submitError}</p>
              )}
            </div>
          </form>
        </div>
      </div>
    </section>
  );
};

export default ContactSection; 