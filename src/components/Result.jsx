import React, { useRef, useEffect, useState } from 'react';
import { gsap } from 'gsap';
import { useNavigate } from 'react-router-dom';
import Navbar from './Navbar';
import galleryIcon from '../assets/imgs/gallery-icon.jpeg';

const Result = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  const square1Ref = useRef(null);
  const square2Ref = useRef(null);
  const square3Ref = useRef(null);

  useEffect(() => {
    const storedData = localStorage.getItem('skinstricUserData');
    if (storedData) {
      try {
        const parsedData = JSON.parse(storedData);
        setUserData(parsedData);
      } catch (error) {
        console.error('Error parsing stored data:', error);
        navigate('/testing');
      }
    } else {
      navigate('/testing');
    }
    setLoading(false);
  }, [navigate]);

  useEffect(() => {
    if (square1Ref.current && square2Ref.current && square3Ref.current && !loading) {
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
    }
  }, [loading]);

  const handleBackClick = () => {
    navigate('/testing');
  };

  const handleStartOver = () => {
    localStorage.removeItem('skinstricUserData');
    navigate('/');
  };

  if (loading) {
    return (
      <div>
        <Navbar />
        <div className="relative h-[calc(100vh-64px)] bg-white overflow-hidden">
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <div className="text-xl font-light text-gray-600">Loading results...</div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!userData) {
    return (
      <div>
        <Navbar />
        <div className="relative h-[calc(100vh-64px)] bg-white overflow-hidden">
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <div className="text-xl font-light text-gray-600 mb-4">No results found</div>
              <button 
                onClick={() => navigate('/testing')}
                className="bg-black text-white px-6 py-2 text-sm font-medium"
              >
                TO START ANALYSIS
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <Navbar />
      <div className="relative h-[calc(100vh-64px)] bg-white overflow-hidden">
        <div className="absolute top-0 left-0 px-6 py-2 z-30">
          <h2 className="text-2xs font-bold text-black uppercase tracking-wide">
            ANALYSIS RESULTS
          </h2>
        </div>

        <div className="absolute right-1/3 top-1/3 transform -translate-y-1/2 pointer-events-none">
          <div className="relative">
            
            <div 
              ref={square1Ref}
              className="absolute w-72 h-72 border-4 border-dotted border-gray-300 -translate-x-5 -translate-y-3"
            ></div>
            <div 
              ref={square2Ref}
              className="absolute w-72 h-72 border-4 border-dotted border-gray-200 translate-x-5 translate-y-3"
            ></div>
            <div 
              ref={square3Ref}
              className="absolute w-72 h-72 border-4 border-dotted border-gray-100 translate-x-5 -translate-y-3"
            ></div>
            
            
            <div className="relative z-20 left-1/3 w-35 h-35 overflow-hidden transform translate-y-14 translate-x-9">
              <img 
                src={galleryIcon} 
                alt="Analysis result" 
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>

        
        <div 
          onClick={handleBackClick}
          className="absolute bottom-8 left-10 flex items-center space-x-7 cursor-pointer z-30"
        >
          <div className="w-10 h-10 border border-solid border-gray-800 rotate-45 flex items-center justify-center hover:scale-110 transition-transform duration-300">
            <span className="text-sm rotate-[-95deg] transform translate-x-px">▶</span>
          </div>
          <span className="text-sm font-bold text-black uppercase tracking-wide">BACK</span>
        </div>
      </div>
    </div>
  );
};

export default Result;
