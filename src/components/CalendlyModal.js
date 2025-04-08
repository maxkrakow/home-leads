import React from 'react';
import { InlineWidget, PopupWidget } from 'react-calendly';

const CalendlyModal = ({ isOpen, onClose, url }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-11/12 max-w-4xl max-h-[90vh] overflow-hidden relative shadow-lg">
        <button 
          className="absolute top-2 right-2 bg-white bg-opacity-80 hover:bg-gray-200 z-10 w-8 h-8 rounded-full flex items-center justify-center text-gray-600 text-2xl border-none cursor-pointer"
          onClick={onClose}
        >
          &times;
        </button>
        <div className="p-0 h-full">
          <InlineWidget 
            url={url} 
            styles={{
              height: '650px'
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default CalendlyModal; 