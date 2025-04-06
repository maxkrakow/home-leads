import React from 'react';
import './TestimonialsSection.css';

const testimonials = [
  {
    content: "HomeLeads Pro has completely transformed our real estate business. We've seen a 40% increase in qualified leads and our conversion rates have doubled.",
    author: "Sarah Johnson",
    role: "Real Estate Broker",
    company: "Johnson Properties",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
  },
  {
    content: "The quality of leads we get from HomeLeads Pro is exceptional. The triple verification process ensures we're only talking to serious homeowners.",
    author: "Michael Rodriguez",
    role: "Sales Director",
    company: "Elite Realty Group",
    image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
  },
  {
    content: "What sets HomeLeads Pro apart is their customer support. They're always available to help optimize our campaigns and improve our results.",
    author: "Jennifer Chen",
    role: "Marketing Manager",
    company: "Pacific Coast Realty",
    image: "https://images.unsplash.com/photo-1517841905240-472988babdf9?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
  }
];

const TestimonialsSection = () => {
  return (
    <section className="testimonials-section" id="testimonials">
      <div className="container">
        <div className="section-header">
          <h2>Trusted by Real Estate Professionals</h2>
          <p>Don't just take our word for it — hear what our customers have to say about HomeLeads Pro.</p>
        </div>
        
        <div className="testimonials-grid">
          {testimonials.map((testimonial, index) => (
            <div className="testimonial-card" key={index}>
              <div className="testimonial-quote">
                <i className="fas fa-quote-left brand-color-icon"></i>
              </div>
              <p className="testimonial-content">{testimonial.content}</p>
              <div className="testimonial-author">
                <img 
                  src={testimonial.image} 
                  alt={testimonial.author} 
                  className="testimonial-author-image" 
                />
                <div className="testimonial-author-info">
                  <h4>{testimonial.author}</h4>
                  <p>{testimonial.role}, {testimonial.company}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection; 