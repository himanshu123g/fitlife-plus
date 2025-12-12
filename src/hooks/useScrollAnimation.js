import { useEffect, useState, useRef } from 'react';

/**
 * Custom hook for scroll-triggered animations
 * Returns visibility state and ref setter for animated elements
 */
export function useScrollAnimation() {
  const [isVisible, setIsVisible] = useState(false);
  const [visibleSections, setVisibleSections] = useState({});
  const sectionRefs = useRef({});

  useEffect(() => {
    // Initial fade-in
    setTimeout(() => setIsVisible(true), 100);

    // Intersection Observer for scroll animations
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisibleSections((prev) => ({
              ...prev,
              [entry.target.dataset.section]: true,
            }));
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
    );

    // Observe all registered sections
    Object.values(sectionRefs.current).forEach((ref) => {
      if (ref) observer.observe(ref);
    });

    return () => observer.disconnect();
  }, []);

  // Helper function to set refs
  const setRef = (sectionName) => (el) => {
    if (el) {
      sectionRefs.current[sectionName] = el;
    }
  };

  // Helper function to get animation classes
  const getAnimationClass = (sectionName, delay = 0) => {
    const baseClass = 'transform transition-all duration-700';
    const visibleClass = 'opacity-100 translate-y-0';
    const hiddenClass = 'opacity-0 translate-y-8';
    const delayClass = delay > 0 ? `delay-${delay}` : '';
    
    return `${baseClass} ${delayClass} ${
      visibleSections[sectionName] ? visibleClass : hiddenClass
    }`;
  };

  return {
    isVisible,
    visibleSections,
    setRef,
    getAnimationClass,
  };
}

/**
 * Animation class generator for simple fade-in effects
 */
export function getFadeInClass(isVisible, delay = 0) {
  const delayMs = delay * 100;
  return `transform transition-all duration-700 ${
    isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
  } ${delay > 0 ? `delay-[${delayMs}ms]` : ''}`;
}

/**
 * Animation class generator for slide-in from left
 */
export function getSlideInLeftClass(isVisible, delay = 0) {
  const delayMs = delay * 100;
  return `transform transition-all duration-700 ${
    isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-8'
  } ${delay > 0 ? `delay-[${delayMs}ms]` : ''}`;
}

/**
 * Animation class generator for slide-in from right
 */
export function getSlideInRightClass(isVisible, delay = 0) {
  const delayMs = delay * 100;
  return `transform transition-all duration-700 ${
    isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-8'
  } ${delay > 0 ? `delay-[${delayMs}ms]` : ''}`;
}

/**
 * Animation class generator for scale-in effect
 */
export function getScaleInClass(isVisible, delay = 0) {
  const delayMs = delay * 100;
  return `transform transition-all duration-700 ${
    isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
  } ${delay > 0 ? `delay-[${delayMs}ms]` : ''}`;
}
