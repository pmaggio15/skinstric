import React from 'react';

const Navbar = () => {
  return (
    <div className="bg-white">
      <nav className="flex items-center justify-between px-6 py-4 bg-white">
        <div className="flex items-center">
          <span className="text-black font-medium text-xs cursor-pointer">SKINSTRIC</span>
          <span className="ml-2 text-gray-400 text-xs font-light">[ INTRO ]</span>
        </div>
        
        <div className="flex items-center">
          <button className="bg-black text-white px-4 py-2 text-3xs font-medium">
            ENTER CODE
          </button>
        </div>
      </nav>
    </div>
  );
};

export default Navbar;
