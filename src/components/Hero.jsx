import React from 'react';

const Hero = () => {
  return (
    <div className="relative min-h-screen bg-white overflow-hidden">
        {/* dotted lines */}
        <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-0 w-[39%] h-px border-t border-dotted border-gray-300 transform origin-top-left rotate-45"></div>

        <div className="absolute top-0 right-0 w-[39%] h-px border-t border-dotted border-gray-300 transform origin-top-right -rotate-45"></div>
        </div>


      <div className="relative z-10 flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h1 className="text-8xl font-light text-black leading-tight tracking-tight">
            Sophisticated
            <br />
            skincare
          </h1>
        </div>
      </div>
      
      <div className="absolute left-8 top-1/2 transform  -translate-y-1/2">
        <div className="flex items-center space-x-4">
          <div class="w-[30px] h-[30px] border border-solid border-black rotate-45 cursor-pointer group-hover:scale-110 duration-300"></div>
          <span class="absolute left-[-10px] top-[3px] scale-[0.9] rotate-180 group-hover:scale-105 duration-300">▶</span>
          <span className="text-sm font-light">DISCOVER A.I.</span>
        </div>
      </div>
      
      <div className="absolute right-8 top-1/2 transform -translate-y-1/2">
        <div className="flex items-center space-x-4">
          <span className="text-sm font-light">TAKE TEST</span>
          <div class="w-[30px] h-[30px] border border-solid border-black rotate-45 group-hover:scale-110 duration-300"></div>
          <span class="absolute left-[80px] top-[4px] scale-[0.9] cursor-pointer group-hover:scale-105 duration-300">▶</span>
        </div>
      </div>
    </div>
  );
};

export default Hero;

