import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from './Navbar';

const Summary = () => {
  const navigate = useNavigate();
  
  const [selectedCategory, setSelectedCategory] = useState('race');
  const [selectedItem, setSelectedItem] = useState('east asian');
  const [animatedPercentage, setAnimatedPercentage] = useState(0);
  const [selectedRace, setSelectedRace] = useState('east asian');
  const [selectedAge, setSelectedAge] = useState('40-49');
  const [selectedGender, setSelectedGender] = useState('male');
  
  const animationRef = useRef(null);
  const startTimeRef = useRef(null);
  const startValueRef = useRef(0);

  const data = {
    race: {
      "black": 11.96,
      "white": 12.80,
      "southeast asian": 6.30,
      "south asian": 14.26,
      "latino hispanic": 6.20,
      "east asian": 25.26,
      "middle eastern": 23.23
    },
    age: {
      "20-29": 3.17,
      "30-39": 14.95,
      "40-49": 21.42,
      "10-19": 6.09,
      "50-59": 14.19,
      "3-9": 11.75,
      "60-69": 6.40,
      "70+": 10.01,
      "0-2": 12.01
    },
    gender: {
      "male": 52.05,
      "female": 47.95
    }
  };

  const easeOutCubic = (t) => {
    return 1 - Math.pow(1 - t, 3);
  };

  useEffect(() => {
    const targetPercentage = getSelectedItemData().percentage;
    const animationDuration = 1500;
    
    startValueRef.current = animatedPercentage;
    startTimeRef.current = null;

    const animate = (timestamp) => {
      if (!startTimeRef.current) {
        startTimeRef.current = timestamp;
      }

      const elapsed = timestamp - startTimeRef.current;
      const progress = Math.min(elapsed / animationDuration, 1);
      
      const easedProgress = easeOutCubic(progress);
      
      const currentValue = startValueRef.current + (targetPercentage - startValueRef.current) * easedProgress;
      setAnimatedPercentage(currentValue);

      if (progress < 1) {
        animationRef.current = requestAnimationFrame(animate);
      } else {
        setAnimatedPercentage(targetPercentage);
      }
    };

    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [selectedItem, selectedCategory]);

  const getCurrentData = () => data[selectedCategory];

  const getCurrentItems = () => {
    const currentData = getCurrentData();
    
    if (selectedCategory === 'age') {
      const ageOrder = ["0-2", "3-9", "10-19", "20-29", "30-39", "40-49", "50-59", "60-69", "70+"];
      return ageOrder.map(age => ({
        name: age,
        percentage: Math.round(currentData[age])
      }));
    }
    
    return Object.entries(currentData)
      .sort(([,a], [,b]) => b - a)
      .map(([name, percentage]) => ({ name, percentage: Math.round(percentage) }));
  };

  const getSelectedItemData = () => {
    const currentData = getCurrentData();
    return {
      name: selectedItem,
      percentage: Math.round(currentData[selectedItem])
    };
  };

  const getSidebarData = () => {
    const commonData = [
      { label: selectedRace, value: 'RACE', bgColor: selectedCategory === 'race' ? 'bg-black text-white' : 'bg-gray-100' },
      { label: selectedAge, value: 'AGE', bgColor: selectedCategory === 'age' ? 'bg-black text-white' : 'bg-gray-100' },
      { label: selectedGender.toUpperCase(), value: 'SEX', bgColor: selectedCategory === 'gender' ? 'bg-black text-white' : 'bg-gray-100' }
    ];
    return commonData;
  };

  const getStrokeDashArray = () => {
    const circumference = 2 * Math.PI * 90;
    const filledLength = (animatedPercentage / 100) * circumference;
    return `${filledLength} ${circumference}`;
  };

  const handleCategoryClick = (category) => {
    setSelectedCategory(category);
    
    const categorySelections = {
      race: selectedRace,
      age: selectedAge,
      gender: selectedGender
    };
    
    setSelectedItem(categorySelections[category]);
  };

  const handleItemClick = (itemName) => {
    setSelectedItem(itemName);
    
    const setters = {
      race: setSelectedRace,
      age: setSelectedAge,
      gender: setSelectedGender
    };
    
    setters[selectedCategory](itemName);
  };

  const handleBackClick = () => navigate('/select');
  const handleHomeClick = () => navigate('/');

  const renderTitle = () => {
    const { name } = getSelectedItemData();
    
    if (selectedCategory === 'age') {
      return (
        <>
          <span className="capitalize">{name}</span>
          <span className="lowercase"> y.o.</span>
        </>
      );
    }
    
    return <span className="capitalize">{name}</span>;
  };

  const renderSidebarItem = (item, index) => (
    <div 
      key={index}
      className={`p-3 sm:p-4 md:p-6 w-full sm:w-36 md:w-44 border-b border-t-2 border-t-black cursor-pointer transition-all duration-300 hover:opacity-80 ${item.bgColor}`}
      onClick={() => {
        const categoryMap = { RACE: 'race', AGE: 'age', SEX: 'gender' };
        handleCategoryClick(categoryMap[item.value]);
      }}
    >
      <div className="text-sm sm:text-base md:text-lg font-medium mb-1 sm:mb-2 capitalize">{item.label}</div>
      <div className="text-xs font-bold uppercase tracking-wide">{item.value}</div>
    </div>
  );

  const renderTableItem = (item) => (
    <div 
      key={item.name}
      className={`flex justify-between items-center py-2 sm:py-3 px-3 sm:px-4 cursor-pointer transition-all duration-300 ${
        selectedItem === item.name ? 'bg-black text-white' : 'hover:bg-gray-200'
      }`}
      onClick={() => handleItemClick(item.name)}
    >
      <div className="flex items-center">
        <div className={`relative w-3 h-3 mr-3 sm:mr-4 rotate-45 ${
          selectedItem === item.name 
            ? 'border border-black bg-white' 
            : 'border border-gray-400'
        }`}>
          {selectedItem === item.name && (
            <span className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-1.5 h-1.5 border border-black"></span>
          )}
        </div>
        <span className="text-xs sm:text-sm capitalize">{item.name}</span>
      </div>
      <span className={`text-xs sm:text-sm ${selectedItem === item.name ? 'font-medium' : ''}`}>
        {item.percentage}%
      </span>
    </div>
  );

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <div className="relative min-h-[calc(100vh-64px)] bg-white overflow-hidden">

        <div className="px-4 sm:px-6 py-4 sm:py-6 md:py-8">
          <h2 className="text-xs font-bold text-black uppercase tracking-wide mb-4 sm:mb-6 md:mb-8">
            A.I. ANALYSIS
          </h2>
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-light text-black uppercase tracking-tight leading-none mb-2 sm:mb-3 md:mb-4">
            DEMOGRAPHICS
          </h1>
          <p className="text-xs sm:text-sm font-normal text-black uppercase tracking-wide">
            PREDICTED RACE & AGE
          </p>
        </div>

        <div className="px-4 sm:px-6 pb-20">

          <div className="lg:hidden space-y-6">
            
            <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3 w-full sm:w-fit">
              {getSidebarData().map(renderSidebarItem)}
            </div>

            <div className="border-t-2 border-black p-4 bg-gray-100 min-h-[300px] sm:min-h-[350px]">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-light text-black mb-6 sm:mb-8">
                {renderTitle()}
              </h2>
              
              <div className="flex justify-center">
                <div className="relative w-48 h-48 sm:w-64 sm:h-64 md:w-80 md:h-80">
                  <svg className="w-full h-full" viewBox="0 0 200 200" style={{ transform: 'rotate(-90deg)' }}>
                    <circle 
                      cx="100" 
                      cy="100" 
                      r="90" 
                      fill="none" 
                      stroke="#e5e7eb" 
                      strokeWidth="4" 
                    />

                    <circle
                      cx="100" 
                      cy="100" 
                      r="90" 
                      fill="none" 
                      stroke="#000000" 
                      strokeWidth="4"
                      strokeDasharray={getStrokeDashArray()} 
                      strokeLinecap="round"
                      style={{ 
                        transition: 'none', 
                        transformOrigin: '100px 100px' 
                      }}
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-xl sm:text-2xl md:text-3xl font-light">
                      {getSelectedItemData().percentage}%
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gray-100 min-h-[300px]">
              <div className="flex justify-between items-center mb-2 border-t-2 border-t-black"></div>
              <div className='flex justify-between items-center mb-4 sm:mb-6 mt-4 px-3 sm:px-4'>
                <span className="text-xs sm:text-sm font-bold uppercase tracking-wide">
                  {selectedCategory === 'gender' ? 'GENDER' : selectedCategory.toUpperCase()}
                </span>
                <span className="text-xs sm:text-sm font-bold uppercase tracking-wide">A.I. CONFIDENCE</span>
              </div>
              
              <div className="space-y-0">
                {getCurrentItems().map(renderTableItem)}
              </div>
            </div>
          </div>

          <div className="hidden lg:flex items-start justify-center py-6">
            <div className="flex items-start justify-between w-full max-w-7xl gap-6">
              
              <div className="flex flex-col space-y-3 flex-shrink-0 border-t-2 border-t-black">
                {getSidebarData().map(renderSidebarItem)}
              </div>

              <div className="flex flex-col items-center border-t-2 border-black p-4 bg-gray-100 h-[500px] w-[60rem]">
                <h2 className="text-4xl font-light text-black mb-8 self-start">
                  {renderTitle()}
                </h2>
                
                <div className="relative w-96 h-96 self-end">
                  <svg className="w-full h-full" viewBox="0 0 200 200" style={{ transform: 'rotate(-90deg)' }}>
                    <circle 
                      cx="100" 
                      cy="100" 
                      r="90" 
                      fill="none" 
                      stroke="#e5e7eb" 
                      strokeWidth="4" 
                    />

                    <circle
                      cx="100" 
                      cy="100" 
                      r="90" 
                      fill="none" 
                      stroke="#000000" 
                      strokeWidth="4"
                      strokeDasharray={getStrokeDashArray()} 
                      strokeLinecap="round"
                      style={{ 
                        transition: 'none', 
                        transformOrigin: '100px 100px' 
                      }}
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-3xl font-light">
                      {getSelectedItemData().percentage}%
                    </span>
                  </div>
                </div>
              </div>

              <div className="w-80 flex-shrink-0 bg-gray-100 h-[500px]">
                <div className="flex justify-between items-center mb-2 border-t-2 border-t-black"></div>
                <div className='flex justify-between items-center mb-6 mt-4 px-4'>
                  <span className="text-sm font-bold uppercase tracking-wide">
                    {selectedCategory === 'gender' ? 'GENDER' : selectedCategory.toUpperCase()}
                  </span>
                  <span className="text-sm font-bold uppercase tracking-wide">A.I. CONFIDENCE</span>
                </div>
                
                <div className="space-y-0">
                  {getCurrentItems().map(renderTableItem)}
                </div>
              </div>

            </div>
          </div>
        </div>

        <div className="absolute bottom-12 sm:bottom-14 md:bottom-16 left-1/2 transform -translate-x-1/2 px-4">
          <p className="text-xs sm:text-sm text-gray-600 tracking-wide text-center">
            If A.I. estimate is wrong, select the correct one.
          </p>
        </div>

        <div 
          onClick={handleBackClick}
          className="absolute bottom-3 sm:bottom-4 md:bottom-3 left-4 sm:left-6 md:left-10 flex items-center space-x-3 sm:space-x-5 md:space-x-7 cursor-pointer z-30"
        >
          <div className="w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 border border-solid border-gray-800 rotate-45 flex items-center justify-center hover:scale-110 transition-transform duration-300">
            <span className="text-xs sm:text-sm rotate-[-95deg] transform translate-x-px">▶</span>
          </div>
          <span className="text-xs sm:text-sm font-bold text-black uppercase tracking-wide">BACK</span>
        </div>

        <div 
          onClick={handleHomeClick}
          className="absolute bottom-3 sm:bottom-4 md:bottom-3 right-4 sm:right-6 md:right-10 flex items-center space-x-3 sm:space-x-5 md:space-x-7 cursor-pointer z-30"
        >
          <span className="text-xs sm:text-sm font-bold text-black uppercase tracking-wide">HOME</span>
          <div className="w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 border border-solid border-gray-800 rotate-45 flex items-center justify-center hover:scale-110 transition-transform duration-300">
            <span className="text-xs sm:text-sm rotate-[70deg] transform translate-x-px">▶</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Summary;