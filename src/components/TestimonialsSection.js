import React from 'react';

const testimonials = [
  {
    content: "This service has transformed our business. With daily updates on new homeowners, we can reach out to potential customers right when they move in. Our conversion rates have doubled.",
    author: "Sarah Johnson",
    role: "Marketing Director",
    company: "Home Services Pro",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
  },
  {
    content: "The quality of the new homeowner data is exceptional. Having access to verified contact details, sale prices, and property information helps us tailor our offers perfectly.",
    author: "Michael Rodriguez",
    role: "Sales Director",
    company: "Elite Home Security",
    image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
  },
  {
    content: "What sets this service apart is the county-based subscription model. We only pay for the areas we serve, and with 500-1000 new homeowners per month, we have plenty of leads to work with.",
    author: "Jennifer Chen",
    role: "Owner",
    company: "Pacific Home Services",
    image: "https://images.unsplash.com/photo-1517841905240-472988babdf9?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
  }
];

const TestimonialsSection = () => {
  return (
    <section className="py-20 bg-gray-50" id="testimonials">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Trusted by Service Providers Nationwide</h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">Don't just take our word for it — hear what our customers have to say about our new homeowner data service.</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-12">
          {testimonials.map((testimonial, index) => (
            <div className="bg-white rounded-lg p-8 shadow-md relative" key={index}>
              <div className="absolute -top-4 -left-4 w-10 h-10 bg-brand-500 rounded-full flex items-center justify-center text-white">
                <i className="fas fa-quote-left"></i>
              </div>
              <p className="mb-6 text-gray-600 italic leading-relaxed">{testimonial.content}</p>
              <div className="flex items-center">
                <img 
                  src={testimonial.image} 
                  alt={testimonial.author} 
                  className="w-12 h-12 rounded-full mr-4 object-cover" 
                />
                <div>
                  <h4 className="font-semibold text-gray-900">{testimonial.author}</h4>
                  <p className="text-sm text-gray-600">{testimonial.role}, {testimonial.company}</p>
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