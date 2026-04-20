import React, { useState } from 'react';
import { PopupWidget } from 'react-calendly';

const FloatingDemoButton = () => {
  const [isOpen, setIsOpen] = useState(false);
  const calendlyUrl = "https://calendly.com/max-untappedhomes/30min?month=2026-04&date=2026-04-13";

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