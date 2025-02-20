'use client'
import React, { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';

const HorizontalScrollLayout = () => {
  const [currentSection, setCurrentSection] = useState(0);
  const [isScrolling, setIsScrolling] = useState(false);
  const [isAtEnd, setIsAtEnd] = useState(false);
  const containerRef = useRef(null);
  const scrollTimeoutRef = useRef(null);
  const slideContainerRef = useRef(null);
  const sectionsRef = useRef([]);

  const sections = [
    { id: 'home', title: 'Home', color: 'from-purple-600 to-blue-500' },
    { id: 'work', title: 'Work', color: 'from-emerald-500 to-teal-400' },
    { id: 'about', title: 'About', color: 'from-orange-500 to-amber-400' },
    { id: 'connect', title: 'Connect', color: 'from-pink-500 to-rose-400' }
  ];

  // Initialize GSAP animations
//   useEffect(() => {
//     // Set initial states for sections
//     gsap.set(sectionsRef.current, {
//       opacity: 0,
//       scale: 0.8
//     });

//     // Animate in the first section
//     gsap.to(sectionsRef.current[0], {
//       opacity: 1,
//       scale: 1,
//       duration: 1,
//       ease: "power3.out"
//     });
//   }, []);

  const animateSection = (index, direction) => {
    // Animate container movement
    gsap.to(slideContainerRef.current, {
      x: `-${index * 100}%`,
      duration: 1,
      ease: "power2.inOut"
    });
  
    // Animate in the new section without fading out the previous one
    gsap.fromTo(sectionsRef.current[index],
      {
        opacity: 1, // Keep it fully visible
        scale: 1.1, // Slightly enlarged for entry effect
      },
      {
        opacity: 1,
        scale: 1,
        duration: 1,
        delay: 0.3,
        ease: "power3.out"
      }
    );
  };
  

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
        
        if (currentSection === sections.length - 1 && direction > 0) {
          // Bounce effect when trying to scroll past the last section
          gsap.to(slideContainerRef.current, {
            x: `${(-currentSection * 100) - 2}%`,
            duration: 0.3,
            ease: "power2.out",
            yoyo: true,
            repeat: 1
          });
          setIsAtEnd(true);
          accumulatedDelta = 0;
          return;
        }

        if (direction < 0 && currentSection > 0) {
          setIsAtEnd(false);
          setIsScrolling(true);
          const nextSection = currentSection - 1;
          animateSection(nextSection, direction);
          setCurrentSection(nextSection);
          accumulatedDelta = 0;

          setTimeout(() => {
            setIsScrolling(false);
          }, 1500);
        }
        else if (direction > 0 && currentSection < sections.length - 1) {
          setIsScrolling(true);
          const nextSection = currentSection + 1;
          animateSection(nextSection, direction);
          setCurrentSection(nextSection);
          accumulatedDelta = 0;

          setTimeout(() => {
            setIsScrolling(false);
          }, 1500);
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

  // Handle dot navigation with GSAP
  const handleDotClick = (index) => {
    if (!isScrolling) {
      setIsScrolling(true);
      const direction = index > currentSection ? 1 : -1;
      animateSection(index, direction);
      setCurrentSection(index);
      
      setTimeout(() => {
        setIsScrolling(false);
      }, 1500);
    }
  };

  return (
    <div className="h-screen w-screen overflow-hidden" ref={containerRef}>
      <div 
        ref={slideContainerRef}
        className="flex h-full"
      >
        {sections.map(({ id, title, color }, index) => (
          <div 
            key={id}
            ref={el => sectionsRef.current[index] = el}
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
            onClick={() => handleDotClick(index)}
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