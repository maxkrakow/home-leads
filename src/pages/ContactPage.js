import React, { useState } from 'react';

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const [formStatus, setFormStatus] = useState({
    submitted: false,
    error: false
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // In a real app, you would send this data to your backend
    console.log('Contact form submitted:', formData);
    
    // Simulate successful submission
    setFormStatus({
      submitted: true,
      error: false
    });
    
    // Reset form
    setFormData({
      name: '',
      email: '',
      subject: '',
      message: ''
    });
  };

  return (
    <div className="py-8">
      <div className="container mx-auto px-4 md:grid md:grid-cols-2 gap-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 mb-4">Contact Us</h1>
          <p className="text-lg text-gray-600 mb-8">Have questions about Landing Leads? We're here to help!</p>
          
          <div className="mt-8 space-y-6">
            <div className="mb-6">
              <h3 className="text-xl font-semibold text-brand-500 mb-2">Email</h3>
              <p className="text-gray-700">support@landingleads.com</p>
            </div>
            
            <div className="mb-6">
              <h3 className="text-xl font-semibold text-brand-500 mb-2">Phone</h3>
              <p className="text-gray-700">(555) 123-4567</p>
            </div>
            
            <div className="mb-6">
              <h3 className="text-xl font-semibold text-brand-500 mb-2">Address</h3>
              <p className="text-gray-700">123 Business Ave, Suite 100<br />San Francisco, CA 94107</p>
            </div>
          </div>
        </div>
        
        <div className="bg-gray-50 rounded-lg p-8 shadow-md">
          {formStatus.submitted ? (
            <div className="text-center py-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Thank You!</h2>
              <p className="text-gray-600 mb-8">Your message has been sent. We'll get back to you soon.</p>
              <button 
                onClick={() => setFormStatus({ submitted: false, error: false })}
                className="bg-brand-500 hover:bg-brand-600 text-white py-3 px-6 rounded-md font-medium transition-colors"
              >
                Send Another Message
              </button>
            </div>
          ) : (
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-brand-500 focus:border-brand-500"
                />
              </div>
              
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-brand-500 focus:border-brand-500"
                />
              </div>
              
              <div>
                <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-brand-500 focus:border-brand-500"
                />
              </div>
              
              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  rows="5"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-brand-500 focus:border-brand-500 resize-y"
                ></textarea>
              </div>
              
              <button 
                type="submit" 
                className="w-full bg-brand-500 hover:bg-brand-600 text-white py-3 px-6 rounded-md font-medium transition-colors"
              >
                Send Message
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default ContactPage; 