import React from 'react';

const FloatingContactButton: React.FC = () => {
  return (
    <div className="fixed bottom-8 right-8 z-50 flex flex-col gap-4">
      <a 
        href="mailto:sales@stdmaterial.com" 
        className="w-14 h-14 rounded-full bg-primary text-white flex items-center justify-center shadow-lg hover:bg-accent transition-all hover:scale-110"
        aria-label="Email us"
      >
        <span className="material-symbols-outlined text-2xl">alternate_email</span>
      </a>
      <a 
        href="https://wa.me/8612345678900" 
        target="_blank" 
        rel="noopener noreferrer"
        className="w-14 h-14 rounded-full bg-green-500 text-white flex items-center justify-center shadow-lg hover:bg-green-600 transition-all hover:scale-110"
        aria-label="Chat on WhatsApp"
      >
        <span className="material-symbols-outlined text-2xl">chat</span>
      </a>
      <a 
        href="#" 
        className="w-14 h-14 rounded-full bg-green-600 text-white flex items-center justify-center shadow-lg hover:bg-green-700 transition-all hover:scale-110"
        aria-label="Chat on WeChat"
      >
        <span className="material-symbols-outlined text-2xl">chat</span>
      </a>
    </div>
  );
};

export default FloatingContactButton;