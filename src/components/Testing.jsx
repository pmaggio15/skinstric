import React, { useRef, useEffect } from 'react'
import { gsap } from 'gsap';
import { useNavigate } from 'react-router-dom';
import Navbar from './Navbar'

const Testing = () => {
  const navigate = useNavigate();
  const square1Ref = useRef(null);
  const square2Ref = useRef(null);
  const square3Ref = useRef(null);
  const backBoxRef = useRef(null);

  useEffect(() => {
    gsap.to(square1Ref.current, {
      rotation: 360,
      duration: 65,
      ease: "none",
      repeat: -1
    });

    gsap.to(square2Ref.current, {
      rotation: 360,
      duration: 70,
      ease: "none",
      repeat: -1
    });

    gsap.to(square3Ref.current, {
      rotation: 360,
      duration: 75,
      ease: "none",
      repeat: -1
    });
  }, []);

  const handleBackClick = () => {
    navigate('/');
  };

  const handleBoxHoverEnter = () => {
    gsap.to(backBoxRef.current, {
      scale: 1.1,
      duration: 0.4,
      ease: "power2.out"
    });
  };

  const handleBoxHoverLeave = () => {
    gsap.to(backBoxRef.current, {
      scale: 1,
      duration: 0.3,
      ease: "power2.out"
    });
  };

  return (
    <div>
      <Navbar />
      <div className="relative h-[calc(100vh-64px)] bg-white overflow-hidden">
      
        <div className="absolute top-0 left-0 px-6 py-2 z-30">
          <h2 className="text-2xs font-bold text-black uppercase tracking-wide">
            TO START ANALYSIS
          </h2>
        </div>

        <div 
          onClick={handleBackClick}
          className="absolute bottom-8 left-10 flex items-center space-x-7 cursor-pointer z-30"
        >
          <div 
            ref={backBoxRef}
            onMouseEnter={handleBoxHoverEnter}
            onMouseLeave={handleBoxHoverLeave}
            className="w-10 h-10 border border-solid border-gray-800 rotate-45 flex items-center justify-center"
          >
            <span className="text-sm rotate-[-95deg] transform translate-x-px">▶</span>
          </div>
          <span className="text-sm font-bold text-black uppercase tracking-wide">BACK</span>
        </div>

        
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div 
            ref={square1Ref}
            className="absolute w-[25rem] h-[25rem] border-4 border-dotted border-gray-300 -translate-x-10 -translate-y-5"
          ></div>

          <div 
            ref={square2Ref}
            className="absolute w-[25rem] h-[25rem] border-4 border-dotted border-gray-200 translate-x-10 translate-y-5"
          ></div>
          
          <div 
            ref={square3Ref}
            className="absolute w-[25rem] h-[25rem] border-4 border-dotted border-gray-100 translate-x-10 -translate-y-5"
          ></div>
        </div>

        
        <div className="relative z-10 flex items-center justify-center h-full">
            <div className="text-center">
                <p className="text-sm font-light text-gray-400 mb-4 uppercase tracking-wide">
                CLICK TO TYPE
                </p>
                <div className="relative">
                <input 
                    type="text"
                    placeholder="Introduce Yourself"
                    className="text-4xl font-light text-gray-600 bg-transparent border-none outline-none text-center placeholder-gray-400"
                    style={{ width: '320px' }}
                />
                <div 
                    className="absolute bottom-0 h-px bg-black mt-2"
                    style={{ 
                    left: '50%', 
                    transform: 'translateX(-50%)', 
                    width: '320px' 
                    }}
                ></div>
                </div>
            </div>
        </div>
      </div>
    </div>
  )
}

export default Testing