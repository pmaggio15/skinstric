import React, { useState } from 'react';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <div className="bg-white border-b border-gray-200 relative z-50">
      <nav className="flex items-center justify-between px-4 sm:px-6 py-3 sm:py-4 bg-white">
        <div className="flex items-center">
          <span className="text-black font-medium text-xs sm:text-sm cursor-pointer">SKINSTRIC</span>
          <span className="ml-2 text-gray-400 text-xs font-light hidden sm:inline">[ INTRO ]</span>
        </div>
        
        <div className="hidden sm:flex items-center">
          <button className="bg-black text-white px-3 py-1.5 sm:px-4 sm:py-2 text-2xs sm:text-3xs font-medium hover:bg-gray-800 transition-colors">
            ENTER CODE
          </button>
        </div>

        <div className="sm:hidden">
          <button 
            onClick={toggleMenu}
            className="w-8 h-8 flex flex-col items-center justify-center space-y-1 focus:outline-none"
            aria-label="Toggle menu"
          >
            <div className={`w-5 h-0.5 bg-black transition-transform duration-200 ${isMenuOpen ? 'rotate-45 translate-y-1.5' : ''}`}></div>
            <div className={`w-5 h-0.5 bg-black transition-opacity duration-200 ${isMenuOpen ? 'opacity-0' : ''}`}></div>
            <div className={`w-5 h-0.5 bg-black transition-transform duration-200 ${isMenuOpen ? '-rotate-45 -translate-y-1.5' : ''}`}></div>
          </button>
        </div>
      </nav>

      {isMenuOpen && (
        <div className="sm:hidden absolute top-full left-0 right-0 bg-white border-b border-gray-200 shadow-lg">
          <div className="px-4 py-4 space-y-4">
            <div className="text-gray-400 text-xs font-light">[ INTRO ]</div>
            <button 
              className="w-full bg-black text-white px-4 py-3 text-xs font-medium hover:bg-gray-800 transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              ENTER CODE
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Navbar;