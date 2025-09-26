import React, { useRef, useEffect, useState } from 'react';
import { gsap } from 'gsap';
import { useNavigate } from 'react-router-dom';
import Navbar from './Navbar';
import galleryIcon from '../assets/imgs/gallery-icon.png';
import galleryLine from '../assets/imgs/GalleryLine.png';
import cameraIcon from '../assets/imgs/camera-icon.jpeg';

const Result = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(null);
  const [isProcessingImage, setIsProcessingImage] = useState(false);

  const square1Ref = useRef(null);
  const square2Ref = useRef(null);
  const square3Ref = useRef(null);
  const leftSquare1Ref = useRef(null);
  const leftSquare2Ref = useRef(null);
  const leftSquare3Ref = useRef(null);
  const galleryIconRef = useRef(null);
  const fileInputRef = useRef(null);
  const processingSquare1Ref = useRef(null);
  const processingSquare2Ref = useRef(null);
  const processingSquare3Ref = useRef(null);

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
    if (square1Ref.current && square2Ref.current && square3Ref.current && 
        leftSquare1Ref.current && leftSquare2Ref.current && leftSquare3Ref.current && 
        !loading && !isProcessingImage) {
      
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

      gsap.to(leftSquare1Ref.current, {
        rotation: 360,
        duration: 65,
        ease: "none",
        repeat: -1
      });

      gsap.to(leftSquare2Ref.current, {
        rotation: 360,
        duration: 70,
        ease: "none",
        repeat: -1
      });

      gsap.to(leftSquare3Ref.current, {
        rotation: 360,
        duration: 75,
        ease: "none",
        repeat: -1
      });
    }
  }, [loading, isProcessingImage]);

  useEffect(() => {
    if (processingSquare1Ref.current && processingSquare2Ref.current && processingSquare3Ref.current && isProcessingImage) {
      gsap.to(processingSquare1Ref.current, {
        rotation: 360,
        duration: 65,
        ease: "none",
        repeat: -1
      });

      gsap.to(processingSquare2Ref.current, {
        rotation: 360,
        duration: 70,
        ease: "none",
        repeat: -1
      });

      gsap.to(processingSquare3Ref.current, {
        rotation: 360,
        duration: 75,
        ease: "none",
        repeat: -1
      });
    }
  }, [isProcessingImage]);

  const handleGalleryHover = () => {
    if (galleryIconRef.current) {
      gsap.to(galleryIconRef.current, {
        scale: 1.1,
        duration: 0.3,
        ease: "power2.out"
      });
    }
  };

  const handleGalleryLeave = () => {
    if (galleryIconRef.current) {
      gsap.to(galleryIconRef.current, {
        scale: 1,
        duration: 0.3,
        ease: "power2.out"
      });
    }
  };

  const handleGalleryClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (file) {
      if (file.type.startsWith('image/')) {
        setIsProcessingImage(true); 
        
        const reader = new FileReader();
        reader.onload = async (e) => {
          setSelectedImage(e.target.result);
          console.log('Image selected:', file.name);
          
          try {
            // Call the Phase Two API with the image data
            const apiResult = await submitImageToAPI(e.target.result);
            
            setTimeout(() => {
              setIsProcessingImage(false);
              navigate('/select');
            }, 3000);
          } catch (error) {
            console.error('Failed to process image:', error);
            setTimeout(() => {
              setIsProcessingImage(false);
              alert('Failed to process image. Please try again.');
            }, 3000);
          }
        };
        reader.readAsDataURL(file);
      } else {
        alert('Please select an image file (JPG, PNG, GIF, etc.)');
      }
    }
  };

  const handleBackClick = () => {
    navigate('/testing');
  };

  const handleStartOver = () => {
    localStorage.removeItem('skinstricUserData');
    navigate('/');
  };

  const submitImageToAPI = async (imageData) => {
    try {
      const response = await fetch('https://us-central1-api-skinstric-ai.cloudfunctions.net/skinstricPhaseTwo', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          image: imageData,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      console.log('Phase Two API Response:', result);
      return result;
    } catch (error) {
      console.error('Phase Two API Error:', error);
      throw error;
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

  if (isProcessingImage) {
    return (
      <div>
        <Navbar />
        <div className="relative h-[calc(100vh-64px)] bg-white overflow-hidden">
          <div className="absolute top-0 left-0 px-6 py-2 z-30">
            <h2 className="text-2xs font-bold text-black uppercase tracking-wide">
              ANALYSIS RESULTS
            </h2>
          </div>

          <div className="absolute inset-0 z-0 pointer-events-none">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
              <div 
                ref={processingSquare1Ref}
                className="absolute w-[25rem] h-[25rem] border-4 border-dotted border-gray-300"
                style={{ left: '-12.5rem', top: '-12.5rem', marginLeft: '-2.5rem', marginTop: '-1.25rem' }}
              ></div>
              <div 
                ref={processingSquare2Ref}
                className="absolute w-[25rem] h-[25rem] border-4 border-dotted border-gray-200"
                style={{ left: '-12.5rem', top: '-12.5rem', marginLeft: '2.5rem', marginTop: '1.25rem' }}
              ></div>
              <div 
                ref={processingSquare3Ref}
                className="absolute w-[25rem] h-[25rem] border-4 border-dotted border-gray-100"
                style={{ left: '-12.5rem', top: '-12.5rem', marginLeft: '2.5rem', marginTop: '-1.25rem' }}
              ></div>
              
              <div className="absolute top-0 left-0 z-50 pointer-events-none">
                <div className="text-center">
                  <div className="text-l font-light text-gray-600 text-center" style={{ width: '320px', marginLeft: '-160px', marginTop: '-30px' }}>
                    PREPARING YOUR ANALYSIS
                  </div>
                  <div style={{ marginLeft: '-160px', marginTop: '10px' }}>
                    <LoadingDots />
                  </div>
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

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileSelect}
          style={{ display: 'none' }}
        />

        <div className="absolute left-72 top-1/2 transform -translate-y-1/2 pointer-events-none">
          <div className="relative">
            <div 
              ref={leftSquare1Ref}
              className="absolute w-72 h-72 border-4 border-dotted border-gray-300 left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2"
            ></div>
            <div 
              ref={leftSquare2Ref}
              className="absolute w-72 h-72 border-4 border-dotted border-gray-200 left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2"
            ></div>
            <div 
              ref={leftSquare3Ref}
              className="absolute w-72 h-72 border-4 border-dotted border-gray-100 left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2"
            ></div>
            
            <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 z-20">
              <div 
                className="w-40 h-40 overflow-hidden rounded-full"
              >
                <img 
                  src={cameraIcon} 
                  alt="camera-Icon" 
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            <div className="absolute right-1/2 bottom-1/2 transform translate-x-80 translate-y-56 scale-y-[-1] scale-x-[-1] z-30">
              <img 
                src={galleryLine} 
                alt="Allow AI Access Gallery" 
                className="w-auto h-auto"
                style={{ maxWidth: '600px', maxHeight: '630px' }}
              />
            </div>
          
            <div className="absolute right-1/2 bottom-1/2 transform translate-x-64 -translate-y-20 z-30">
              <div className="text-black text-xs font-bold uppercase tracking-wide leading-tight whitespace-nowrap">
                <div className='text-left'>ALLOW A.I.
                  <br/>
                  SCAN YOUR FACE</div>
              </div>
            </div>
          </div>
        </div>

        <div className="absolute right-60 top-1/2 transform -translate-y-1/2 pointer-events-none">
          <div className="relative">
            <div 
              ref={square1Ref}
              className="absolute w-72 h-72 border-4 border-dotted border-gray-300 left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2"
            ></div>
            <div 
              ref={square2Ref}
              className="absolute w-72 h-72 border-4 border-dotted border-gray-200 left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2"
            ></div>
            <div 
              ref={square3Ref}
              className="absolute w-72 h-72 border-4 border-dotted border-gray-100 left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2"
            ></div>
            
            <div className="absolute left-1/2 top-1/2 transform -translate-x-48 -translate-y-1/2 z-20 pointer-events-auto">
              <div 
                ref={galleryIconRef}
                className="w-96 h-96 overflow-hidden rounded-full cursor-pointer"
                onMouseEnter={handleGalleryHover}
                onMouseLeave={handleGalleryLeave}
                onClick={handleGalleryClick}
              >
                <img 
                  src={selectedImage || galleryIcon} 
                  alt="Analysis result" 
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            <div className="absolute left-1/2 top-1/2 transform -translate-x-80 -translate-y-60 rotate-12 z-30">
              <img 
                src={galleryLine} 
                alt="Allow AI Access Gallery" 
                className="w-auto h-auto"
                style={{ maxWidth: '600px', maxHeight: '630px' }}
              />
            </div>
          
            <div className="absolute left-1/2 top-1/2 transform -translate-x-60 translate-y-20 z-30">
              <div className="text-black text-xs font-bold uppercase tracking-wide leading-tight whitespace-nowrap">
                <div className='text-right'>ALLOW A.I.
                  <br/>
                  ACCESS GALLERY</div>
              </div>
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