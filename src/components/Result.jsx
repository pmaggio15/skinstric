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
  const [showCameraModal, setShowCameraModal] = useState(false);
  const [showCamera, setShowCamera] = useState(false);
  const [showCameraLoading, setShowCameraLoading] = useState(false);
  const [stream, setStream] = useState(null);

  const cameraLoadingSquare1Ref = useRef(null);
  const cameraLoadingSquare2Ref = useRef(null);
  const cameraLoadingSquare3Ref = useRef(null);

  const square1Ref = useRef(null);
  const square2Ref = useRef(null);
  const square3Ref = useRef(null);
  const leftSquare1Ref = useRef(null);
  const leftSquare2Ref = useRef(null);
  const leftSquare3Ref = useRef(null);
  const galleryIconRef = useRef(null);
  const cameraIconRef = useRef(null);
  const fileInputRef = useRef(null);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
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
        !loading && !isProcessingImage && !showCamera && !showCameraModal && !showCameraLoading) {
      
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
  }, [loading, isProcessingImage, showCamera, showCameraModal]);

  useEffect(() => {
    if (cameraLoadingSquare1Ref.current && cameraLoadingSquare2Ref.current && cameraLoadingSquare3Ref.current && showCameraLoading) {
      gsap.to(cameraLoadingSquare1Ref.current, {
        rotation: 360,
        duration: 65,
        ease: "none",
        repeat: -1,
        delay: 0
      });

      gsap.to(cameraLoadingSquare2Ref.current, {
        rotation: 360,
        duration: 70,
        ease: "none",
        repeat: -1,
        delay: 1
      });

      gsap.to(cameraLoadingSquare3Ref.current, {
        rotation: 360,
        duration: 75,
        ease: "none",
        repeat: -1,
        delay: 3
      });
    }
  }, [showCameraLoading]);

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

  useEffect(() => {
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [stream]);

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

  const handleCameraHover = () => {
    if (cameraIconRef.current) {
      gsap.to(cameraIconRef.current, {
        scale: 1.1,
        duration: 0.3,
        ease: "power2.out"
      });
    }
  };

  const handleCameraLeave = () => {
    if (cameraIconRef.current) {
      gsap.to(cameraIconRef.current, {
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

  const handleCameraClick = () => {
    setShowCameraModal(true);
  };

  const handleCameraAllow = async () => {
    setShowCameraModal(false);
    setShowCameraLoading(true);
    
    try {
      console.log('Requesting camera access...');
      
      const mediaStream = await navigator.mediaDevices.getUserMedia({ 
        video: {
          facingMode: 'user'
        },
        audio: false
      });
      
      console.log('Camera access granted, stream:', mediaStream);
      setStream(mediaStream);

      setTimeout(() => {
        setShowCameraLoading(false);
        setShowCamera(true);
        
        if (videoRef.current && mediaStream) {
          console.log('Setting is playing');
          videoRef.current.srcObject = mediaStream;
          videoRef.current.play().catch(e => console.error('Error playing video:', e));
        }
      }, 4000);
      
    } catch (error) {
      console.error('Error accessing camera:', error);
      setShowCameraLoading(false);
      
      if (error.name === 'NotAllowedError') {
        alert('Camera access denied. Please allow camera permissions in your browser and try again.');
      } else if (error.name === 'NotFoundError') {
        alert('No camera found. Please connect a camera and try again.');
      } else if (error.name === 'NotSupportedError') {
        alert('Camera access is not supported in this browser.');
      } else {
        alert(`Error accessing camera: ${error.message}. Please try again.`);
      }
    }
  };

  const handleCameraDeny = () => {
    setShowCameraModal(false);
  };

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const canvas = canvasRef.current;
      const video = videoRef.current;
      const context = canvas.getContext('2d');
      
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      
      context.drawImage(video, 0, 0, canvas.width, canvas.height);
      
      const imageData = canvas.toDataURL('image/jpeg', 0.8);
      
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
        setStream(null);
      }
      
      setShowCamera(false);
      setSelectedImage(imageData);
      processImage(imageData);
    }
  };

  const closeCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
    setShowCamera(false);
  };

  const processImage = async (imageData) => {
    setIsProcessingImage(true);
    
    try {
      const apiResult = await submitImageToAPI(imageData);
      
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

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (file) {
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (e) => {
          setSelectedImage(e.target.result);
          console.log('Image selected:', file.name);
          processImage(e.target.result);
        };
        reader.readAsDataURL(file);
      } else {
        alert('Please select an image file (JPG, PNG, GIF, etc.)');
      }
    }
  };

  const handleBackClick = () => {
    if (showCamera) {
      closeCamera();
    } else if (showCameraModal) {
      setShowCameraModal(false);
    } else if (showCameraLoading) {
      setShowCameraLoading(false);
    } else {
      navigate('/testing');
    }
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

          <div className="flex items-center justify-center h-full">
            <div className="relative">
              <div 
                ref={processingSquare1Ref}
                className="absolute w-[25rem] h-[25rem] border-4 border-dotted border-gray-300 left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2"
              ></div>
              <div 
                ref={processingSquare2Ref}
                className="absolute w-[25rem] h-[25rem] border-4 border-dotted border-gray-200 left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2"
              ></div>
              <div 
                ref={processingSquare3Ref}
                className="absolute w-[25rem] h-[25rem] border-4 border-dotted border-gray-100 left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2"
              ></div>
              
              <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50">
                <div className="text-center">
                  <div className="text-l font-light text-gray-600 text-center whitespace-nowrap">
                    PREPARING YOUR ANALYSIS
                  </div>
                  <div className="mt-4">
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

  if (showCameraLoading) {
    return (
      <div>
        <Navbar />
        <div className="relative h-[calc(100vh-64px)] bg-white overflow-hidden">
          <div className="absolute top-0 left-0 px-6 py-2 z-30">
            <h2 className="text-2xs font-bold text-black uppercase tracking-wide">
              ANALYSIS RESULTS
            </h2>
          </div>

          <div className="flex items-center justify-center h-full">
            <div className="relative">
              <div 
                ref={cameraLoadingSquare1Ref}
                className="absolute w-72 h-72 border-4 border-dotted border-gray-300 left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2"
              ></div>
              <div 
                ref={cameraLoadingSquare2Ref}
                className="absolute w-72 h-72 border-4 border-dotted border-gray-200 left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2"
              ></div>
              <div 
                ref={cameraLoadingSquare3Ref}
                className="absolute w-72 h-72 border-4 border-dotted border-gray-100 left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2"
              ></div>

              <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 z-20">
                <div className="w-32 h-32 overflow-hidden rounded-full">
                  <img 
                    src={cameraIcon} 
                    alt="camera-Icon" 
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>

              <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 translate-y-32 z-20">
                <div className="text-lg font-bold text-black uppercase tracking-wide text-center whitespace-nowrap">
                  SETTING UP CAMERA...
                </div>
              </div>

              <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 translate-y-56 z-20 w-screen px-4">
                <div className="text-sm text-black font-medium uppercase tracking-wide text-center">
                  <div className="mb-8 whitespace-nowrap">TO GET BETTER RESULTS MAKE SURE TO HAVE</div>
                  
                  <div className="flex justify-center space-x-4">
                    <div className="flex items-center">
                      <span className="mr-1">◇</span>
                      <span className='text-xs'>NEUTRAL EXPRESSION</span>
                    </div>
                    <div className="flex items-center">
                      <span className="mr-1">◇</span>
                      <span className='text-xs'>FRONTAL POSE</span>
                    </div>
                    <div className="flex items-center">
                      <span className="mr-1">◇</span>
                      <span className='text-xs'>ADEQUATE LIGHTING</span>
                    </div>
                  </div>
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
  }
  if (showCamera) {
    return (
      <div>
        <Navbar />
        <div className="relative h-[calc(100vh-64px)] bg-black overflow-hidden">
          <div className="absolute top-0 left-0 px-6 py-2 z-30">
            <h2 className="text-2xs font-bold text-white uppercase tracking-wide">
              TAKE A SELFIE
            </h2>
          </div>

          <div className="flex items-center justify-center h-full">
            <div className="relative">
              <video 
                ref={videoRef} 
                autoPlay 
                playsInline
                muted
                onLoadedMetadata={() => console.log('Video metadata loaded')}
                onCanPlay={() => console.log('Video can play')}
                className="w-96 h-96 object-cover rounded-full border-4 border-white transform scale-x-[-1]"
                style={{ background: '#333' }}
              />
              
              <div className="absolute bottom-[-80px] left-1/2 transform -translate-x-1/2 flex space-x-4">
                <button
                  onClick={capturePhoto}
                  className="w-16 h-16 bg-white rounded-full border-4 border-gray-300 hover:border-gray-400 transition-colors duration-200 flex items-center justify-center"
                >
                  <div className="w-12 h-12 bg-white rounded-full border-2 border-gray-400"></div>
                </button>
              </div>
            </div>
          </div>

          <canvas ref={canvasRef} className="hidden" />

          <div 
            onClick={handleBackClick}
            className="absolute bottom-8 left-10 flex items-center space-x-7 cursor-pointer z-30"
          >
            <div className="w-10 h-10 border border-solid border-white rotate-45 flex items-center justify-center hover:scale-110 transition-transform duration-300">
              <span className="text-sm rotate-[-95deg] transform translate-x-px text-white">▶</span>
            </div>
            <span className="text-sm font-bold text-white uppercase tracking-wide">BACK</span>
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

        {showCameraModal && (
          <div className="fixed inset-0 flex items-center justify-start z-50 pointer-events-none pl-96 mt-14">
            <div className="bg-black text-white shadow-2xl pointer-events-auto" style={{ width: '300px' }}>

              <div className="bg-black px-4 py-3 border-b border-gray-600">
                <h3 className="text-xs font-bold uppercase tracking-wide text-white">
                  ALLOW A.I. TO ACCESS YOUR CAMERA
                </h3>
              </div>

              <div className="flex bg-black justify-end">
                <button
                  onClick={handleCameraDeny}
                  className="bg-black text-white hover:text-gray-400 px-4 py-4 font-bold text-sm uppercase tracking-wide transition-colors duration-200"
                >
                  DENY
                </button>
                <button
                  onClick={handleCameraAllow}
                  className="bg-black text-white hover:text-gray-400 px-4 py-4 font-bold text-sm uppercase tracking-wide transition-colors duration-200 ml-4"
                >
                  ALLOW
                </button>
              </div>
            </div>
          </div>
        )}

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
            
            <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 z-20 pointer-events-auto">
              <div 
                ref={cameraIconRef}
                className="w-40 h-40 overflow-hidden rounded-full cursor-pointer"
                onMouseEnter={handleCameraHover}
                onMouseLeave={handleCameraLeave}
                onClick={handleCameraClick}
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



