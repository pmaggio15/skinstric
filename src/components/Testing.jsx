import React, { useRef, useEffect, useState } from 'react'
import { gsap } from 'gsap';
import { useNavigate } from 'react-router-dom';
import Navbar from './Navbar'

const Testing = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [currentInput, setCurrentInput] = useState('');
  const [name, setName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showThankYou, setShowThankYou] = useState(false);
  const [validationError, setValidationError] = useState('');

  const square1Ref = useRef(null);
  const square2Ref = useRef(null);
  const square3Ref = useRef(null);
  const backBoxRef = useRef(null);
  const loadingSquare1Ref = useRef(null);
  const loadingSquare2Ref = useRef(null);
  const loadingSquare3Ref = useRef(null);

  const validateInput = (input, fieldName) => {
    if (!input || !input.trim()) {
      return `${fieldName} is required`;
    }

    if (/\d/.test(input)) {
      return `${fieldName} cannot contain numbers`;
    }

    if (!/^[a-zA-Z\s\-']+$/.test(input.trim())) {
      return `${fieldName} can only contain letters, spaces, hyphens, and apostrophes`;
    }

    if (input.trim().length < 2) {
      return `${fieldName} must be at least 2 characters long`;
    }

    return null;
  };

  const submitToAPI = async (userData) => {
    try {
      const response = await fetch('https://us-central1-api-skinstric-ai.cloudfunctions.net/skinstricPhaseOne', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: userData.name,
          location: userData.location
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      
      localStorage.setItem('skinstricUserData', JSON.stringify({
        name: userData.name,
        location: userData.location,
        apiResponse: result,
        timestamp: new Date().toISOString()
      }));

      return result;
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  };

  useEffect(() => {
    if (square1Ref.current && square2Ref.current && square3Ref.current && !isLoading) {
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
  }, [isLoading]);

  useEffect(() => {
    if (loadingSquare1Ref.current && loadingSquare2Ref.current && loadingSquare3Ref.current && isLoading) {
      gsap.to(loadingSquare1Ref.current, {
        rotation: 360,
        duration: 65,
        ease: "none",
        repeat: -1
      });

      gsap.to(loadingSquare2Ref.current, {
        rotation: 360,
        duration: 70,
        ease: "none",
        repeat: -1
      });

      gsap.to(loadingSquare3Ref.current, {
        rotation: 360,
        duration: 75,
        ease: "none",
        repeat: -1
      });
    }
  }, [isLoading]);

  const handleBackClick = () => {
    navigate('/');
  };

  const handleProceedClick = () => {
    console.log('Proceed clicked');
    navigate('/result');
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

  const handleInputChange = (e) => {
    setCurrentInput(e.target.value);
    if (validationError) {
      setValidationError('');
    }
  };

  const handleKeyPress = async (e) => {
    if (e.key === 'Enter' && currentInput.trim()) {
      if (step === 1) {
        const nameError = validateInput(currentInput, 'Name');
        if (nameError) {
          setValidationError(nameError);
          return;
        }

        setName(currentInput.trim());
        setStep(2);
        setCurrentInput('');
        setValidationError('');
      } else if (step === 2) {
        const locationError = validateInput(currentInput, 'City');
        if (locationError) {
          setValidationError(locationError);
          return;
        }

        console.log('Name:', name, 'City:', currentInput.trim());
        setIsLoading(true);
        setValidationError('');

        try {
          const result = await submitToAPI({
            name: name,
            location: currentInput.trim()
          });

          console.log('API Response:', result);

          setTimeout(() => {
            setIsLoading(false);
            setShowThankYou(true);
          }, 2000); 
        } catch (error) {
          setIsLoading(false);
          setValidationError('Failed to submit data. Please try again.');
        }
      }
    }
  };

  const getPlaceholder = () => {
    switch(step) {
      case 1: return "Introduce Yourself";
      case 2: return "Your City Name";
      default: return "Introduce Yourself";
    }
  };

  const LoadingDots = () => {
    const dot1Ref = useRef(null);
    const dot2Ref = useRef(null);
    const dot3Ref = useRef(null);

    useEffect(() => {
      if (dot1Ref.current && dot2Ref.current && dot3Ref.current) {
        const tl = gsap.timeline({ repeat: -1 });

        tl.to([dot1Ref.current, dot2Ref.current, dot3Ref.current], {
          opacity: 0.3,
          duration: 0.5,
        })
        .to(dot1Ref.current, { opacity: 1, duration: 0.3 })
        .to(dot2Ref.current, { opacity: 1, duration: 0.3 }, "-=0.1")
        .to(dot3Ref.current, { opacity: 1, duration: 0.3 }, "-=0.1");

        return () => tl.kill();
      }
    }, []);

    return (
      <div className="flex items-center space-x-2 justify-center mt-4">
        <div ref={dot1Ref} className="w-2 h-2 bg-gray-400 rounded-full"></div>
        <div ref={dot2Ref} className="w-2 h-2 bg-gray-400 rounded-full"></div>
        <div ref={dot3Ref} className="w-2 h-2 bg-gray-400 rounded-full"></div>
      </div>
    );
  };

  if (showThankYou) {
    return (
      <div>
        <Navbar />
        <div className="relative h-[calc(100vh-64px)] bg-white overflow-hidden">
          <div className="absolute top-0 left-0 px-6 py-2 z-30">
            <h2 className="text-2xs font-bold text-black uppercase tracking-wide">
              TO START ANALYSIS
            </h2>
          </div>

          <div className="absolute inset-0 z-0">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
              <div 
                ref={loadingSquare1Ref}
                className="absolute w-[25rem] h-[25rem] border-4 border-dotted border-gray-300"
                style={{ left: '-12.5rem', top: '-12.5rem', marginLeft: '-2.5rem', marginTop: '-1.25rem' }}
              ></div>
              <div 
                ref={loadingSquare2Ref}
                className="absolute w-[25rem] h-[25rem] border-4 border-dotted border-gray-200"
                style={{ left: '-12.5rem', top: '-12.5rem', marginLeft: '2.5rem', marginTop: '1.25rem' }}
              ></div>
              <div 
                ref={loadingSquare3Ref}
                className="absolute w-[25rem] h-[25rem] border-4 border-dotted border-gray-100"
                style={{ left: '-12.5rem', top: '-12.5rem', marginLeft: '2.5rem', marginTop: '-1.25rem' }}
              ></div>
            </div>
          </div>
        </div>

        <div className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none">
          <div className="text-center">
            <div className="relative">
              <div className="text-xl font-light text-gray-600 text-center" style={{ width: '320px' }}>
                Thank You!
                <br/>
                Proceed for the next step
              </div>
            </div>
          </div>
        </div>

        <div 
          onClick={handleBackClick}
          className="absolute bottom-8 left-10 flex items-center space-x-7 cursor-pointer z-50"
        >
          <div className="w-10 h-10 border border-solid border-gray-800 rotate-45 flex items-center justify-center hover:scale-110 transition-transform duration-300">
            <span className="text-sm rotate-[-95deg] transform translate-x-px">▶</span>
          </div>
          <span className="text-sm font-bold text-black uppercase tracking-wide">BACK</span>
        </div>

        <div 
          onClick={handleProceedClick}
          className="absolute bottom-8 right-10 flex items-center space-x-7 cursor-pointer z-50"
        >
          <span className="text-sm font-bold text-black uppercase tracking-wide">PROCEED</span>
          <div className="w-10 h-10 border border-solid border-gray-800 rotate-45 flex items-center justify-center hover:scale-110 transition-transform duration-300">
            <span className="text-sm rotate-[70deg] transform translate-x-px">▶</span>
          </div>
        </div>
      </div>
    );
  }
  
  if (isLoading) {
    return (
      <div>
        <Navbar />
        <div className="relative h-[calc(100vh-64px)] bg-white overflow-hidden">
          <div className="absolute top-0 left-0 px-6 py-2 z-30">
            <h2 className="text-2xs font-bold text-black uppercase tracking-wide">
              TO START ANALYSIS
            </h2>
          </div>

          <div className="absolute inset-0 z-0">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
              <div 
                ref={loadingSquare1Ref}
                className="absolute w-[25rem] h-[25rem] border-4 border-dotted border-gray-300"
                style={{ left: '-12.5rem', top: '-12.5rem', marginLeft: '-2.5rem', marginTop: '-1.25rem' }}
              ></div>
              <div 
                ref={loadingSquare2Ref}
                className="absolute w-[25rem] h-[25rem] border-4 border-dotted border-gray-200"
                style={{ left: '-12.5rem', top: '-12.5rem', marginLeft: '2.5rem', marginTop: '1.25rem' }}
              ></div>
              <div 
                ref={loadingSquare3Ref}
                className="absolute w-[25rem] h-[25rem] border-4 border-dotted border-gray-100"
                style={{ left: '-12.5rem', top: '-12.5rem', marginLeft: '2.5rem', marginTop: '-1.25rem' }}
              ></div>
            </div>
          </div>
        </div>

        <div className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none">
          <div className="text-center">
            <div className="relative">
              <div className="text-xl font-light text-gray-600 text-center" style={{ width: '320px' }}>
                Processing Submission
              </div>
            </div>
            <LoadingDots />
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
                placeholder={getPlaceholder()}
                value={currentInput}
                onChange={handleInputChange}
                onKeyPress={handleKeyPress}
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
              
              {validationError && (
                <div className="absolute top-full mt-2 left-1/2 transform -translate-x-1/2">
                  <p className="text-red-500 text-sm font-light text-center">
                    {validationError}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Testing