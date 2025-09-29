import React, { useRef, useEffect, useState, useCallback } from 'react';
import { gsap } from 'gsap';
import { useNavigate } from 'react-router-dom';
import Navbar from './Navbar';
import galleryIcon from '../assets/imgs/gallery-icon.png';
import galleryLine from '../assets/imgs/GalleryLine.png';
import cameraIcon from '../assets/imgs/camera-icon.jpeg';


const ANIMATION_DURATIONS = {
  SQUARE1: 65,
  SQUARE2: 70,
  SQUARE3: 75,
  LOADING_DISPLAY: 3000,
  PROCESSING_DISPLAY: 3000
};

const CAMERA_CONSTRAINTS = {
  IDEAL: {
    video: {
      facingMode: 'user',
      width: { ideal: 1280, min: 640 },
      height: { ideal: 720, min: 480 }
    },
    audio: false
  },
  BASIC: {
    video: { facingMode: 'user' },
    audio: false
  }
};

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
  const [cameraError, setCameraError] = useState('');


  const refs = {

    cameraLoadingSquare1: useRef(null),
    cameraLoadingSquare2: useRef(null),
    cameraLoadingSquare3: useRef(null),

    square1: useRef(null),
    square2: useRef(null),
    square3: useRef(null),
    leftSquare1: useRef(null),
    leftSquare2: useRef(null),
    leftSquare3: useRef(null),

    processingSquare1: useRef(null),
    processingSquare2: useRef(null),
    processingSquare3: useRef(null),

    galleryIcon: useRef(null),
    cameraIcon: useRef(null),
    fileInput: useRef(null),
    video: useRef(null),
    canvas: useRef(null)
  };


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

  const animateSquares = useCallback((squareRefs, delays = [0, 0, 0]) => {
    squareRefs.forEach((ref, index) => {
      if (ref.current) {
        gsap.to(ref.current, {
          rotation: 360,
          duration: Object.values(ANIMATION_DURATIONS)[index] || 65,
          ease: "none",
          repeat: -1,
          delay: delays[index]
        });
      }
    });
  }, []);

  useEffect(() => {
    const shouldAnimate = [refs.square1, refs.square2, refs.square3, refs.leftSquare1, refs.leftSquare2, refs.leftSquare3]
      .every(ref => ref.current) && !loading && !isProcessingImage && !showCamera && !showCameraModal && !showCameraLoading;

    if (shouldAnimate) {
      animateSquares([refs.square1, refs.square2, refs.square3]);
      animateSquares([refs.leftSquare1, refs.leftSquare2, refs.leftSquare3]);
    }
  }, [loading, isProcessingImage, showCamera, showCameraModal, showCameraLoading, animateSquares, refs]);

  useEffect(() => {
    if (showCameraLoading && [refs.cameraLoadingSquare1, refs.cameraLoadingSquare2, refs.cameraLoadingSquare3].every(ref => ref.current)) {
      animateSquares([refs.cameraLoadingSquare1, refs.cameraLoadingSquare2, refs.cameraLoadingSquare3], [0, 1, 2]);
    }
  }, [showCameraLoading, animateSquares, refs]);

  useEffect(() => {
    if (isProcessingImage && [refs.processingSquare1, refs.processingSquare2, refs.processingSquare3].every(ref => ref.current)) {
      animateSquares([refs.processingSquare1, refs.processingSquare2, refs.processingSquare3]);
    }
  }, [isProcessingImage, animateSquares, refs]);

  useEffect(() => {
    if (showCamera && stream && refs.video.current) {
      console.log('Setting up video element with stream');
      refs.video.current.srcObject = stream;
      
      refs.video.current.play().then(() => {
        console.log('Video is playing successfully');
      }).catch(error => {
        console.error('Error starting video playback:', error);
        setCameraError('Failed to start camera preview');
      });
    }
  }, [showCamera, stream, refs.video]);

  useEffect(() => {
    return () => {
      if (stream) {
        console.log('Cleaning up camera stream');
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [stream]);

  const handleHover = useCallback((ref, scale) => {
    if (ref.current) {
      gsap.to(ref.current, { scale, duration: 0.3, ease: "power2.out" });
    }
  }, []);

  const handleGalleryClick = useCallback(() => {
    refs.fileInput.current?.click();
  }, [refs.fileInput]);

  const handleCameraClick = useCallback(() => {
    console.log('Camera button clicked');
    setShowCameraModal(true);
    setCameraError('');
  }, []);

  const handleCameraAllow = useCallback(async () => {
    console.log('User allowed camera access');
    setShowCameraModal(false);
    setShowCameraLoading(true);
    setCameraError('');
    
    try {
      if (!navigator.mediaDevices?.getUserMedia) {
        throw new Error('Camera access not supported in this browser');
      }

      console.log('Requesting camera access...');
      
      let mediaStream;
      try {
        mediaStream = await navigator.mediaDevices.getUserMedia(CAMERA_CONSTRAINTS.IDEAL);
      } catch (idealError) {
        console.log('Ideal constraints failed, trying basic constraints...');
        mediaStream = await navigator.mediaDevices.getUserMedia(CAMERA_CONSTRAINTS.BASIC);
      }
      
      console.log('Camera access granted successfully');
      setStream(mediaStream);

      setTimeout(() => {
        console.log('Switching to camera view');
        setShowCameraLoading(false);
        setShowCamera(true);
      }, ANIMATION_DURATIONS.LOADING_DISPLAY);
      
    } catch (error) {
      console.error('Camera access error:', error);
      setShowCameraLoading(false);
      
      const errorMessage = getErrorMessage(error);
      setCameraError(errorMessage);
      alert(errorMessage);
    }
  }, []);

  const getErrorMessage = (error) => {
    const baseMessage = 'Failed to access camera. ';
    const errorMessages = {
      NotAllowedError: 'Please allow camera permissions and try again.',
      NotFoundError: 'No camera found on this device.',
      NotSupportedError: 'Camera access is not supported in this browser.'
    };
    return baseMessage + (errorMessages[error.name] || error.message);
  };

  const handleCameraDeny = useCallback(() => {
    console.log('User denied camera access');
    setShowCameraModal(false);
  }, []);

  const capturePhoto = useCallback(() => {
    if (!refs.video.current || !refs.canvas.current) {
      console.error('Video or canvas element not available');
      alert('Cannot capture photo. Please try again.');
      return;
    }

    const canvas = refs.canvas.current;
    const video = refs.video.current;
    const context = canvas.getContext('2d');
    
    canvas.width = video.videoWidth || 640;
    canvas.height = video.videoHeight || 480;
    
    console.log('Capturing photo with dimensions:', canvas.width, 'x', canvas.height);
    
    context.save();
    context.scale(-1, 1);
    context.drawImage(video, -canvas.width, 0, canvas.width, canvas.height);
    context.restore();
    
    const imageData = canvas.toDataURL('image/jpeg', 0.8);
    console.log('Photo captured, size:', Math.round(imageData.length / 1024), 'KB');
    
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
    
    setShowCamera(false);
    setSelectedImage(imageData);
    processImage(imageData);
  }, [stream, refs.video, refs.canvas]);

  const closeCamera = useCallback(() => {
    console.log('Closing camera');
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
    setShowCamera(false);
    setCameraError('');
  }, [stream]);

  const processImage = useCallback(async (imageData) => {
    console.log('Processing image...');
    setIsProcessingImage(true);
    
    try {
      await submitImageToAPI(imageData);
      console.log('Image processing completed');
      
      setTimeout(() => {
        setIsProcessingImage(false);
        navigate('/select');
      }, ANIMATION_DURATIONS.PROCESSING_DISPLAY);
    } catch (error) {
      console.error('Failed to process image:', error);
      setTimeout(() => {
        setIsProcessingImage(false);
        alert('Failed to process image. Please try again.');
      }, ANIMATION_DURATIONS.PROCESSING_DISPLAY);
    }
  }, [navigate]);

  const handleFileSelect = useCallback((event) => {
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
  }, [processImage]);

  const handleBackClick = useCallback(() => {
    if (showCamera) {
      closeCamera();
    } else if (showCameraModal) {
      setShowCameraModal(false);
    } else if (showCameraLoading) {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
        setStream(null);
      }
      setShowCameraLoading(false);
    } else {
      navigate('/testing');
    }
  }, [showCamera, showCameraModal, showCameraLoading, stream, closeCamera, navigate]);

  const submitImageToAPI = async (imageData) => {
    const response = await fetch('https://us-central1-api-skinstric-ai.cloudfunctions.net/skinstricPhaseTwo', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ image: imageData }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    console.log('Phase Two API Response:', result);
    return result;
  };

  const LoadingDots = () => {
    const dot1Ref = useRef(null);
    const dot2Ref = useRef(null);
    const dot3Ref = useRef(null);

    useEffect(() => {
      if (dot1Ref.current && dot2Ref.current && dot3Ref.current) {
        const tl = gsap.timeline({ repeat: -1 });
        tl.to([dot1Ref.current, dot2Ref.current, dot3Ref.current], { opacity: 0.3, duration: 0.5 })
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

  const RotatingSquares = ({ squareRefs, size = "w-72 h-72" }) => (
    <>
      <div ref={squareRefs[0]} className={`absolute ${size} border-4 border-dotted border-gray-300 left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2`}></div>
      <div ref={squareRefs[1]} className={`absolute ${size} border-4 border-dotted border-gray-200 left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2`}></div>
      <div ref={squareRefs[2]} className={`absolute ${size} border-4 border-dotted border-gray-100 left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2`}></div>
    </>
  );

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
            <h2 className="text-2xs font-bold text-black uppercase tracking-wide">ANALYSIS RESULTS</h2>
          </div>
          <div className="flex items-center justify-center h-full">
            <div className="relative">
              <RotatingSquares squareRefs={[refs.processingSquare1, refs.processingSquare2, refs.processingSquare3]} size="w-[25rem] h-[25rem] md:w-[25rem] md:h-[25rem]" />
              <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50">
                <div className="text-center">
                  <div className="text-l font-light text-gray-600 text-center whitespace-nowrap">PREPARING YOUR ANALYSIS</div>
                  <div className="mt-4"><LoadingDots /></div>
                </div>
              </div>
            </div>
          </div>
          <div onClick={handleBackClick} className="absolute bottom-8 left-4 md:left-10 flex items-center space-x-4 md:space-x-7 cursor-pointer z-50">
            <div className="w-8 h-8 md:w-10 md:h-10 border border-solid border-gray-800 rotate-45 flex items-center justify-center hover:scale-110 transition-transform duration-300">
              <span className="text-xs md:text-sm rotate-[-95deg] transform translate-x-px">▶</span>
            </div>
            <span className="text-xs md:text-sm font-bold text-black uppercase tracking-wide">BACK</span>
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
            <h2 className="text-2xs font-bold text-black uppercase tracking-wide">ANALYSIS RESULTS</h2>
          </div>
          <div className="flex items-center justify-center h-full">
            <div className="relative">
              <RotatingSquares squareRefs={[refs.cameraLoadingSquare1, refs.cameraLoadingSquare2, refs.cameraLoadingSquare3]} size="w-64 h-64 md:w-96 md:h-96" />
              <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 z-20">
                <div className="w-24 h-24 md:w-32 md:h-32 overflow-hidden rounded-full">
                  <img src={cameraIcon} alt="camera-Icon" className="w-full h-full object-cover" />
                </div>
              </div>
              <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 translate-y-32 md:translate-y-40 z-20">
                <div className="text-sm md:text-lg font-bold text-black uppercase tracking-wide text-center whitespace-nowrap">SETTING UP CAMERA...</div>
              </div>
              <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 translate-y-48 md:translate-y-64 z-20 w-screen px-4">
                <div className="text-xs md:text-sm text-black font-medium uppercase tracking-wide text-center">
                  <div className="mb-4 md:mb-8 whitespace-nowrap">TO GET BETTER RESULTS MAKE SURE TO HAVE</div>
                  <div className="flex flex-col md:flex-row justify-center md:space-x-8 space-y-2 md:space-y-0 whitespace-nowrap">
                    <div className="flex items-center justify-center"><span className="mr-2">◇</span><span className='text-2xs md:text-xs'>NEUTRAL EXPRESSION</span></div>
                    <div className="flex items-center justify-center"><span className="mr-2">◇</span><span className='text-2xs md:text-xs'>FRONTAL POSE</span></div>
                    <div className="flex items-center justify-center"><span className="mr-2">◇</span><span className='text-2xs md:text-xs'>ADEQUATE LIGHTING</span></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div onClick={handleBackClick} className="absolute bottom-8 left-4 md:left-10 flex items-center space-x-4 md:space-x-7 cursor-pointer z-30">
            <div className="w-8 h-8 md:w-10 md:h-10 border border-solid border-gray-800 rotate-45 flex items-center justify-center hover:scale-110 transition-transform duration-300">
              <span className="text-xs md:text-sm rotate-[-95deg] transform translate-x-px">▶</span>
            </div>
            <span className="text-xs md:text-sm font-bold text-black uppercase tracking-wide">BACK</span>
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
            <h2 className="text-2xs font-bold text-white uppercase tracking-wide">TAKE A SELFIE</h2>
          </div>
          <div className="flex items-center justify-center h-full">
            <div className="relative">
              {cameraError ? (
                <div className="w-64 h-64 md:w-96 md:h-96 rounded-full border-4 border-red-500 bg-red-900 flex items-center justify-center">
                  <div className="text-red-200 text-center p-4">
                    <div className="text-base md:text-lg font-bold mb-2">Camera Error</div>
                    <div className="text-xs md:text-sm">{cameraError}</div>
                    <button onClick={() => window.location.reload()} className="mt-4 px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-xs rounded">RELOAD PAGE</button>
                  </div>
                </div>
              ) : (
                <video 
                  ref={refs.video} 
                  autoPlay 
                  playsInline
                  muted
                  onLoadedMetadata={() => console.log('Video metadata loaded')}
                  onCanPlay={() => console.log('Video can play')}
                  onPlay={() => console.log('Video started playing')}
                  onError={() => setCameraError('Video playback failed')}
                  className="w-64 h-64 md:w-96 md:h-96 object-cover rounded-full border-4 border-white transform scale-x-[-1]"
                  style={{ background: '#333' }}
                />
              )}
              <div className="absolute bottom-[-60px] md:bottom-[-80px] left-1/2 transform -translate-x-1/2 flex space-x-4">
                <button
                  onClick={capturePhoto}
                  disabled={!!cameraError}
                  className="w-12 h-12 md:w-16 md:h-16 bg-white rounded-full border-4 border-gray-300 hover:border-gray-400 transition-colors duration-200 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <div className="w-10 h-10 md:w-12 md:h-12 bg-white rounded-full border-2 border-gray-400"></div>
                </button>
              </div>
            </div>
          </div>
          <canvas ref={refs.canvas} className="hidden" />
          <div onClick={handleBackClick} className="absolute bottom-8 left-4 md:left-10 flex items-center space-x-4 md:space-x-7 cursor-pointer z-30">
            <div className="w-8 h-8 md:w-10 md:h-10 border border-solid border-white rotate-45 flex items-center justify-center hover:scale-110 transition-transform duration-300">
              <span className="text-xs md:text-sm rotate-[-95deg] transform translate-x-px text-white">▶</span>
            </div>
            <span className="text-xs md:text-sm font-bold text-white uppercase tracking-wide">BACK</span>
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
              <button onClick={() => navigate('/testing')} className="bg-black text-white px-6 py-2 text-sm font-medium">TO START ANALYSIS</button>
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
          <h2 className="text-2xs font-bold text-black uppercase tracking-wide">ANALYSIS RESULTS</h2>
        </div>

        <input ref={refs.fileInput} type="file" accept="image/*" onChange={handleFileSelect} style={{ display: 'none' }} />

        {showCameraModal && (
          <div className="fixed inset-0 flex items-center justify-center md:justify-start z-50 pointer-events-none md:pl-96 md:mt-14 px-4">
            <div className="bg-black text-white shadow-2xl pointer-events-auto w-full max-w-xs md:max-w-none md:w-[300px]">
              <div className="bg-black px-4 py-3 border-b border-gray-600">
                <h3 className="text-xs font-bold uppercase tracking-wide text-white">ALLOW A.I. TO ACCESS YOUR CAMERA</h3>
              </div>
              <div className="flex bg-black justify-end">
                <button onClick={handleCameraDeny} className="bg-black text-white hover:text-gray-400 px-4 py-4 font-bold text-sm uppercase tracking-wide transition-colors duration-200">DENY</button>
                <button onClick={handleCameraAllow} className="bg-black text-white hover:text-gray-400 px-4 py-4 font-bold text-sm uppercase tracking-wide transition-colors duration-200 ml-4">ALLOW</button>
              </div>
            </div>
          </div>
        )}

        <div className="md:hidden flex flex-col items-center justify-center h-full space-y-40 px-4">
          <div className="relative flex flex-col items-center">
            <div className="relative">
              <RotatingSquares squareRefs={[refs.leftSquare1, refs.leftSquare2, refs.leftSquare3]} size="w-48 h-48" />
              <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 z-20 pointer-events-auto">
                <div 
                  ref={refs.cameraIcon}
                  className="w-32 h-32 overflow-hidden rounded-full cursor-pointer"
                  onMouseEnter={() => handleHover(refs.cameraIcon, 1.1)}
                  onMouseLeave={() => handleHover(refs.cameraIcon, 1)}
                  onClick={handleCameraClick}
                >
                  <img src={cameraIcon} alt="camera-Icon" className="w-full h-full object-cover" />
                </div>
              </div>
            </div>
            <div className="mt-14 z-30">
              <div className="text-black text-xs font-bold uppercase tracking-wide leading-tight text-center">
                ALLOW A.I.<br/>TO SCAN YOUR FACE
              </div>
            </div>
          </div>
          
          <div className="relative flex flex-col items-center">
            <div className="relative">
              <RotatingSquares squareRefs={[refs.square1, refs.square2, refs.square3]} size="w-48 h-48" />
              <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 z-20 pointer-events-auto">
                <div 
                  ref={refs.galleryIcon}
                  className="w-72 h-72 overflow-hidden rounded-full cursor-pointer"
                  onMouseEnter={() => handleHover(refs.galleryIcon, 1.1)}
                  onMouseLeave={() => handleHover(refs.galleryIcon, 1)}
                  onClick={handleGalleryClick}
                >
                  <img src={selectedImage || galleryIcon} alt="Analysis result" className="w-full h-full object-cover" />
                </div>
              </div>
            </div>
            <div className="mt-14 z-30">
              <div className="text-black text-xs font-bold uppercase tracking-wide leading-tight text-center">
                ALLOW A.I.<br/>ACCESS GALLERY
              </div>
            </div>
          </div>
        </div>

        <div className="hidden md:block">
          <div className="absolute left-72 top-1/2 transform -translate-y-1/2 pointer-events-none">
            <div className="relative">
              <RotatingSquares squareRefs={[refs.leftSquare1, refs.leftSquare2, refs.leftSquare3]} />
              <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 z-20 pointer-events-auto">
                <div 
                  ref={refs.cameraIcon}
                  className="w-40 h-40 overflow-hidden rounded-full cursor-pointer"
                  onMouseEnter={() => handleHover(refs.cameraIcon, 1.1)}
                  onMouseLeave={() => handleHover(refs.cameraIcon, 1)}
                  onClick={handleCameraClick}
                >
                  <img src={cameraIcon} alt="camera-Icon" className="w-full h-full object-cover" />
                </div>
              </div>
              <div className="absolute right-1/2 bottom-1/2 transform translate-x-80 translate-y-56 scale-y-[-1] scale-x-[-1] z-30">
                <img src={galleryLine} alt="Allow AI Scan Face" className="w-auto h-auto" style={{ maxWidth: '600px', maxHeight: '630px' }} />
              </div>
              <div className="absolute right-1/2 bottom-1/2 transform translate-x-64 -translate-y-20 z-30">
                <div className="text-black text-xs font-bold uppercase tracking-wide leading-tight whitespace-nowrap">
                  <div className='text-left'>ALLOW A.I.<br/>SCAN YOUR FACE</div>
                </div>
              </div>
            </div>
          </div>

          <div className="absolute right-60 top-1/2 transform -translate-y-1/2 pointer-events-none">
            <div className="relative">
              <RotatingSquares squareRefs={[refs.square1, refs.square2, refs.square3]} />
              <div className="absolute left-1/2 top-1/2 transform -translate-x-48 -translate-y-1/2 z-20 pointer-events-auto">
                <div 
                  ref={refs.galleryIcon}
                  className="w-96 h-96 overflow-hidden rounded-full cursor-pointer"
                  onMouseEnter={() => handleHover(refs.galleryIcon, 1.1)}
                  onMouseLeave={() => handleHover(refs.galleryIcon, 1)}
                  onClick={handleGalleryClick}
                >
                  <img src={selectedImage || galleryIcon} alt="Analysis result" className="w-full h-full object-cover" />
                </div>
              </div>
              <div className="absolute left-1/2 top-1/2 transform -translate-x-80 -translate-y-60 rotate-12 z-30">
                <img src={galleryLine} alt="Allow AI Access Gallery" className="w-auto h-auto" style={{ maxWidth: '600px', maxHeight: '630px' }} />
              </div>
              <div className="absolute left-1/2 top-1/2 transform -translate-x-60 translate-y-20 z-30">
                <div className="text-black text-xs font-bold uppercase tracking-wide leading-tight whitespace-nowrap">
                  <div className='text-right'>ALLOW A.I.<br/>ACCESS GALLERY</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div onClick={handleBackClick} className="absolute bottom-8 left-4 md:left-10 flex items-center space-x-4 md:space-x-7 cursor-pointer z-30">
          <div className="w-8 h-8 md:w-10 md:h-10 border border-solid border-gray-800 rotate-45 flex items-center justify-center hover:scale-110 transition-transform duration-300">
            <span className="text-xs md:text-sm rotate-[-95deg] transform translate-x-px">▶</span>
          </div>
          <span className="text-xs md:text-sm font-bold text-black uppercase tracking-wide">BACK</span>
        </div>
      </div>
    </div>
  );
};

export default Result;