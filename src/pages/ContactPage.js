import React, { useState } from 'react';
import './ContactPage.css';

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
    <div className="contact-page">
      <div className="contact-container">
        <div className="contact-info">
          <h1>Contact Us</h1>
          <p>Have questions about Landing Leads? We're here to help!</p>
          
          <div className="contact-methods">
            <div className="contact-method">
              <h3>Email</h3>
              <p>support@landingleads.com</p>
            </div>
            
            <div className="contact-method">
              <h3>Phone</h3>
              <p>(555) 123-4567</p>
            </div>
            
            <div className="contact-method">
              <h3>Address</h3>
              <p>123 Business Ave, Suite 100<br />San Francisco, CA 94107</p>
            </div>
          </div>
        </div>
        
        <div className="contact-form-container">
          {formStatus.submitted ? (
            <div className="form-success">
              <h2>Thank You!</h2>
              <p>Your message has been sent. We'll get back to you soon.</p>
              <button onClick={() => setFormStatus({ submitted: false, error: false })}>
                Send Another Message
              </button>
            </div>
          ) : (
            <form className="contact-form" onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="name">Name</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="email">Email</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="subject">Subject</label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="message">Message</label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  rows="5"
                  required
                ></textarea>
              </div>
              
              <button type="submit" className="submit-btn">Send Message</button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default ContactPage; 