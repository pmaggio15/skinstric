import React, { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { useNavigate } from 'react-router-dom';

const Hero = () => {
  const navigate = useNavigate();
  const titleRef = useRef(null);
  const discoverRef = useRef(null);
  const takeTestRef = useRef(null);
  const leftBoxRef = useRef(null);
  const rightBoxRef = useRef(null);
  const bottomTextRef = useRef(null);

  useEffect(() => {
  if (titleRef.current) {
    gsap.set(titleRef.current, { 
      x: 0, 
      opacity: 0
    });
    
    gsap.set([leftBoxRef.current, rightBoxRef.current, bottomTextRef.current], { opacity: 1 });
    
    gsap.to(titleRef.current, {
      opacity: 1,
      duration: 3.0,
      ease: "sine.out",
      delay: 0.3
    });
  }
}, []);

  const handleDiscoverEnter = () => {
    gsap.to(titleRef.current, {
      x: 300,
      duration: 0.8,
      ease: "power2.out"
    });
    gsap.to([rightBoxRef.current, takeTestRef.current], {
      opacity: 0,
      duration: 0.6,
      ease: "power2.out"
    });
  };

  const handleDiscoverLeave = () => {
    gsap.to(titleRef.current, {
      x: 0,
      duration: 0.8,
      ease: "power2.out"
    });
    gsap.to([rightBoxRef.current, takeTestRef.current], {
      opacity: 1,
      duration: 0.6,
      ease: "power2.out"
    });
  };

  const handleTakeTestEnter = () => {
    gsap.to(titleRef.current, {
      x: -300,
      duration: 0.8,
      ease: "power2.out"
    });
    gsap.to([leftBoxRef.current, discoverRef.current], {
      opacity: 0,
      duration: 0.6,
      ease: "power2.out"
    });
  };

  const handleTakeTestLeave = () => {
    gsap.to(titleRef.current, {
      x: 0,
      duration: 0.8,
      ease: "power2.out"
    });
    gsap.to([leftBoxRef.current, discoverRef.current], {
      opacity: 1,
      duration: 0.6,
      ease: "power2.out"
    });
  };

  const handleTakeTestClick = () => {
    navigate('/testing');
  };

  return (
    <div className="relative h-[calc(100vh-64px)] bg-white overflow-hidden">
        <div 
          ref={leftBoxRef}
          className="absolute -left-60 top-1/2 transform -translate-y-1/2 rotate-45 pointer-events-none"
        >
            <div className="w-[28rem] h-[28rem] border-2 border-dotted border-gray-300"></div>
        </div>

      <div className="relative z-10 flex items-center justify-center h-full">
        <div className="text-center">
          <h1 
            ref={titleRef}
            className="text-8xl font-light text-black leading-tight tracking-tight"
          >
            Sophisticated
            <br />
            skincare
          </h1>
        </div>
      </div>
      
      <div 
        ref={discoverRef}
        onMouseEnter={handleDiscoverEnter}
        onMouseLeave={handleDiscoverLeave}
        className="absolute left-8 top-1/2 transform -translate-y-1/2 cursor-pointer p-4 z-30"
      >
        <div className="flex items-center space-x-4">
          <div className="w-[30px] h-[30px] border border-solid border-black rotate-45 hover:scale-110 duration-300"></div>
          <span className="absolute left-[7px] top-[18px] scale-[0.9] rotate-180 hover:scale-105 duration-300">▶</span>
          <span className="text-sm font-light">DISCOVER A.I.</span>
        </div>
      </div>
      
      <div 
        ref={rightBoxRef}
        className="absolute -right-60 top-1/2 transform -translate-y-1/2 rotate-45 pointer-events-none"
      >
            <div className="w-[28rem] h-[28rem] border-2 border-dotted border-gray-300"></div>
        </div>
        
      <div 
        ref={takeTestRef}
        onMouseEnter={handleTakeTestEnter}
        onMouseLeave={handleTakeTestLeave}
        onClick={handleTakeTestClick}
        className="absolute right-8 top-1/2 transform -translate-y-1/2 cursor-pointer p-4 z-30"
      >
        <div className="flex items-center space-x-4">
          <span className="text-sm font-light">TAKE TEST</span>
          <div className="w-[30px] h-[30px] border border-solid border-black rotate-45 hover:scale-110 duration-300"></div>
          <span className="absolute left-[95px] top-[20px] scale-[0.9] hover:scale-105 duration-300">▶</span>
        </div>
      </div>
      
      <div 
        ref={bottomTextRef}
        className="absolute bottom-8 left-10 max-w-xs z-20"
      >
            <p className="text-sm font-light text-black leading-relaxed uppercase">
                SKINSTRIC DEVELOPED AN A.I. THAT CREATES A HIGHLY-PERSONALIZED ROUTINE TAILORED TO WHAT YOUR SKIN NEEDS.
            </p>
        </div>
    </div>
  );
};

export default Hero;