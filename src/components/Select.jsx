import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { gsap } from 'gsap';
import Navbar from './Navbar';

const Select = () => {
  const navigate = useNavigate();
  const [hoveredBox, setHoveredBox] = useState(null);
  const borderRef = useRef(null);
  const timelineRef = useRef(null);

  const handleBackClick = () => {
    navigate('/result');
  };

  const handleGetSummaryClick = () => {
    navigate('/summary');
  };

  const handleDemographicsClick = () => {
    navigate('/summary');
  };

  const handleMouseEnter = (boxName) => {
    setHoveredBox(boxName);
  };

  const handleMouseLeave = () => {
    setHoveredBox(null);
  };

  useEffect(() => {
    if (hoveredBox && borderRef.current) {
   
      if (timelineRef.current) {
        timelineRef.current.kill();
      }

      const tl = gsap.timeline({ repeat: -1 });
      
      tl.fromTo(borderRef.current, 
        { 
          opacity: 0, 
          scale: 0.9,
          rotation: 45 
        },
        { 
          opacity: 1, 
          scale: 1, 
          rotation: 45,
          duration: 0.4, 
          ease: "power2.out" 
        }
      )
      .to(borderRef.current, 
        { 
          opacity: 0, 
          scale: 1.05, 
          rotation: 45,
          duration: 0.4, 
          ease: "power2.in" 
        }
      )
      .to(borderRef.current, 
        { 
          opacity: 1, 
          scale: 1, 
          rotation: 45,
          duration: 0.4, 
          ease: "power2.out" 
        }
      )
      .to(borderRef.current, 
        { 
          opacity: 0, 
          scale: 0.9, 
          rotation: 45,
          duration: 0.4, 
          ease: "power2.in" 
        }
      );

      timelineRef.current = tl;

      return () => {
        if (timelineRef.current) {
          timelineRef.current.kill();
        }
      };
    } else {
      if (timelineRef.current) {
        timelineRef.current.kill();
        timelineRef.current = null;
      }
    }
  }, [hoveredBox]);

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <div className="relative min-h-[calc(100vh-64px)] bg-white overflow-hidden">

        <div className="absolute top-0 left-0 px-4 sm:px-6 py-2 z-30">
          <h2 className="text-xs sm:text-sm font-bold text-black uppercase tracking-wide">
            A.I. ANALYSIS
          </h2>
          <p className="text-xs sm:text-sm font-light text-black uppercase tracking-wide mt-1">
            A.I. HAS ESTIMATED THE FOLLOWING.
          </p>
          <p className="text-xs sm:text-sm font-light text-black uppercase tracking-wide">
            FIX ESTIMATED INFORMATION IF NEEDED.
          </p>
        </div>

        <div className="hidden md:block">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="relative w-80 h-80">
              <div 
                className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/4"
                onMouseEnter={() => handleMouseEnter('demographics')}
                onMouseLeave={handleMouseLeave}
                onClick={handleDemographicsClick}
              >
                <div className="w-40 h-40 bg-gray-300 rotate-45 flex items-center justify-center cursor-pointer hover:bg-gray-400 hover:scale-110 transition-all duration-300">
                  <span className="text-black font-bold text-sm uppercase tracking-wide -rotate-45">
                    DEMOGRAPHICS
                  </span>
                </div>
              </div>

              <div 
                className="absolute top-1/2 left-0 transform -translate-x-1/4 -translate-y-1/2"
                onMouseEnter={() => handleMouseEnter('cosmetic')}
                onMouseLeave={handleMouseLeave}
              >
                <div className="w-40 h-40 bg-gray-200 rotate-45 flex items-center justify-center cursor-not-allowed hover:scale-110 hover:bg-gray-300 transition-all duration-300">
                  <span className="text-black font-bold text-sm uppercase tracking-wide -rotate-45 text-center">
                    COSMETIC<br/>CONCERNS
                  </span>
                </div>
              </div>

              <div 
                className="absolute top-1/2 right-0 transform translate-x-1/4 -translate-y-1/2"
                onMouseEnter={() => handleMouseEnter('skintype')}
                onMouseLeave={handleMouseLeave}
              >
                <div className="w-40 h-40 bg-gray-200 rotate-45 flex items-center justify-center cursor-not-allowed hover:scale-110 hover:bg-gray-300 transition-all duration-300">
                  <span className="text-black font-bold text-sm uppercase tracking-wide -rotate-45 text-center">
                    SKIN TYPE<br/>DETAILS
                  </span>
                </div>
              </div>

              <div 
                className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/4"
                onMouseEnter={() => handleMouseEnter('weather')}
                onMouseLeave={handleMouseLeave}
              >
                <div className="w-40 h-40 bg-gray-200 rotate-45 flex items-center justify-center cursor-not-allowed hover:scale-110 hover:bg-gray-300 transition-all duration-300">
                  <span className="text-black font-bold text-sm uppercase tracking-wide -rotate-45">
                    WEATHER
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="md:hidden">
          <div className="flex items-center justify-center min-h-[calc(100vh-64px)] px-4 pt-20 pb-24">
            <div className="relative w-64 h-64 sm:w-72 sm:h-72">

              <div 
                className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/6"
                onMouseEnter={() => handleMouseEnter('demographics')}
                onMouseLeave={handleMouseLeave}
                onClick={handleDemographicsClick}
              >
                <div className="w-24 h-24 sm:w-28 sm:h-28 bg-gray-300 rotate-45 flex items-center justify-center cursor-pointer hover:bg-gray-400 hover:scale-110 transition-all duration-300">
                  <span className="text-black font-bold text-xs sm:text-sm uppercase tracking-wide -rotate-45 text-center">
                    DEMOGRAPHICS
                  </span>
                </div>
              </div>


              <div 
                className="absolute top-1/2 left-0 transform -translate-x-1/6 -translate-y-1/2"
                onMouseEnter={() => handleMouseEnter('cosmetic')}
                onMouseLeave={handleMouseLeave}
              >
                <div className="w-24 h-24 sm:w-28 sm:h-28 bg-gray-200 rotate-45 flex items-center justify-center cursor-not-allowed hover:scale-110 hover:bg-gray-300 transition-all duration-300">
                  <span className="text-black font-bold text-xs sm:text-sm uppercase tracking-wide -rotate-45 text-center leading-tight">
                    COSMETIC<br/>CONCERNS
                  </span>
                </div>
              </div>

              <div 
                className="absolute top-1/2 right-0 transform translate-x-1/6 -translate-y-1/2"
                onMouseEnter={() => handleMouseEnter('skintype')}
                onMouseLeave={handleMouseLeave}
              >
                <div className="w-24 h-24 sm:w-28 sm:h-28 bg-gray-200 rotate-45 flex items-center justify-center cursor-not-allowed hover:scale-110 hover:bg-gray-300 transition-all duration-300">
                  <span className="text-black font-bold text-xs sm:text-sm uppercase tracking-wide -rotate-45 text-center leading-tight">
                    SKIN TYPE<br/>DETAILS
                  </span>
                </div>
              </div>


              <div 
                className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/6"
                onMouseEnter={() => handleMouseEnter('weather')}
                onMouseLeave={handleMouseLeave}
              >
                <div className="w-24 h-24 sm:w-28 sm:h-28 bg-gray-200 rotate-45 flex items-center justify-center cursor-not-allowed hover:scale-110 hover:bg-gray-300 transition-all duration-300">
                  <span className="text-black font-bold text-xs sm:text-sm uppercase tracking-wide -rotate-45">
                    WEATHER
                  </span>
                </div>
              </div>

            </div>
          </div>
        </div>

        {hoveredBox && (
          <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none">
            <div 
              ref={borderRef}
              className="w-80 h-80 sm:w-96 sm:h-96 md:w-[500px] md:h-[500px] border-2 sm:border-3 md:border-4 border-dotted border-gray-400"
              style={{ opacity: 0 }}
            ></div>
          </div>
        )}

        <div 
          onClick={handleBackClick}
          className="absolute bottom-4 sm:bottom-6 md:bottom-8 left-4 sm:left-6 md:left-10 flex items-center space-x-3 sm:space-x-5 md:space-x-7 cursor-pointer z-30"
        >
          <div className="w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 border border-solid border-gray-800 rotate-45 flex items-center justify-center hover:scale-110 transition-transform duration-300">
            <span className="text-xs sm:text-sm rotate-[-95deg] transform translate-x-px">▶</span>
          </div>
          <span className="text-xs sm:text-sm font-bold text-black uppercase tracking-wide">BACK</span>
        </div>

        <div 
          onClick={handleGetSummaryClick}
          className="absolute bottom-4 sm:bottom-6 md:bottom-8 right-4 sm:right-6 md:right-10 flex items-center space-x-3 sm:space-x-5 md:space-x-7 cursor-pointer z-30"
        >
          <span className="text-xs sm:text-sm font-bold text-black uppercase tracking-wide">GET SUMMARY</span>
          <div className="w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 border border-solid border-gray-800 rotate-45 flex items-center justify-center hover:scale-110 transition-transform duration-300">
            <span className="text-xs sm:text-sm rotate-[70deg] transform translate-x-px">▶</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Select;