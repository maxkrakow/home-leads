import React from 'react';
import { PopupWidget } from 'react-calendly';

const FloatingDemoButton = () => {
  // Use the correct Calendly URL
  const calendlyUrl = "https://calendly.com/lended/home-leads-demo-call";

  return (
    <div className="fixed bottom-5 right-5 z-50">
      <PopupWidget
        url={calendlyUrl}
        rootElement={document.getElementById("root")}
        text="Schedule a Demo"
        textColor="#ffffff"
        color="#22b0ad"
      />
    </div>
  );
};

export default FloatingDemoButton; 