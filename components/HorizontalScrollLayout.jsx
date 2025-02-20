'use client'
import React, { useState, useEffect, useRef } from 'react';

const HorizontalScrollLayout = () => {
  const [currentSection, setCurrentSection] = useState(0);
  const [isScrolling, setIsScrolling] = useState(false);
  const [isAtEnd, setIsAtEnd] = useState(false);
  const containerRef = useRef(null);
  const scrollTimeoutRef = useRef(null);

  const sections = [
    { id: 'home', title: 'Home', color: 'from-purple-600 to-blue-500' },
    { id: 'work', title: 'Work', color: 'from-emerald-500 to-teal-400' },
    { id: 'about', title: 'About', color: 'from-orange-500 to-amber-400' },
    { id: 'connect', title: 'Connect', color: 'from-pink-500 to-rose-400' }
  ];

  useEffect(() => {
    let accumulatedDelta = 0;
    const deltaThreshold = 50;
    
    const handleWheel = (e) => {
      e.preventDefault();
      
      if (isScrolling) return;

      accumulatedDelta += Math.abs(e.deltaY);

      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }

      scrollTimeoutRef.current = setTimeout(() => {
        accumulatedDelta = 0;
      }, 150);

      if (accumulatedDelta >= deltaThreshold) {
        const direction = e.deltaY > 0 ? 1 : -1;
        
        // Check if we're at the last section and trying to scroll forward
        if (currentSection === sections.length - 1 && direction > 0) {
          setIsAtEnd(true);
          accumulatedDelta = 0;
          return;
        }

        // Allow backward scrolling from any position
        if (direction < 0 && currentSection > 0) {
          setIsAtEnd(false);
          setIsScrolling(true);
          setCurrentSection(prev => prev - 1);
          accumulatedDelta = 0;

          setTimeout(() => {
            setIsScrolling(false);
          }, 500);
        }
        // Allow forward scrolling only if not at the end
        else if (direction > 0 && currentSection < sections.length - 1) {
          setIsScrolling(true);
          setCurrentSection(prev => prev + 1);
          accumulatedDelta = 0;

          setTimeout(() => {
            setIsScrolling(false);
          }, 500);
        }
      }
    };

    const container = containerRef.current;
    container.addEventListener('wheel', handleWheel, { passive: false });

    return () => {
      container.removeEventListener('wheel', handleWheel);
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
    };
  }, [currentSection, isScrolling, sections.length]);

  // Optional: Add a visual indicator when trying to scroll past the last section
  const [showEndIndicator, setShowEndIndicator] = useState(false);
  
  useEffect(() => {
    if (isAtEnd) {
      setShowEndIndicator(true);
      const timer = setTimeout(() => setShowEndIndicator(false), 500);
      return () => clearTimeout(timer);
    }
  }, [isAtEnd]);

  return (
    <div className="h-screen w-screen overflow-hidden" ref={containerRef}>
      <div 
        className="flex h-full transition-transform duration-500 ease-in-out relative"
        style={{ transform: `translateX(-${currentSection * 100}%)` }}
      >
        {sections.map(({ id, title, color }) => (
          <div 
            key={id}
            className={`flex-none w-screen h-screen bg-gradient-to-br ${color} 
              flex items-center justify-center`}
          >
            <div className="text-center text-white">
              <h2 className="text-6xl font-bold mb-4">{title}</h2>
              <p className="text-xl opacity-90">
                {id === 'home' ? 'Welcome to Staap' :
                 id === 'work' ? 'Check out our projects' :
                 id === 'about' ? 'Learn more about us' :
                 'Let\'s get in touch'}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Navigation Dots */}
      {/* <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 flex gap-4">
        {sections.map((_, index) => (
          <button
            key={index}
            onClick={() => {
              if (!isScrolling) {
                setIsScrolling(true);
                setCurrentSection(index);
                setTimeout(() => setIsScrolling(false), 500);
              }
            }}
            className={`w-3 h-3 rounded-full transition-all duration-300 
              ${currentSection === index 
                ? 'bg-white scale-125' 
                : 'bg-white/50 hover:bg-white/75'}`}
            aria-label={`Go to section ${index + 1}`}
          />
        ))}
      </div> */}
    </div>
  );
};

export default HorizontalScrollLayout;