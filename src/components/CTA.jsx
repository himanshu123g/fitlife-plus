import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';

export default function CTA() {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.3 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, []);

  return (
    <section ref={sectionRef} className="py-16 md:py-20 bg-gradient-to-br from-blue-600 to-blue-700 relative overflow-hidden">
      {/* Subtle Decorative Elements */}
      <div className="absolute top-10 left-10 w-32 h-32 bg-white/5 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-10 right-10 w-40 h-40 bg-white/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
      
      <div className="container mx-auto px-4 md:px-6 lg:px-8 relative z-10">
        <div className="max-w-3xl mx-auto text-center text-white">
          <h2 
            className={`text-3xl md:text-4xl font-semibold mb-6 leading-tight transform transition-all duration-700 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
          >
            Your Fitness Journey Starts Today
          </h2>
          <p 
            className={`text-lg mb-8 opacity-95 leading-relaxed transform transition-all duration-700 delay-200 ${
              isVisible ? 'opacity-95 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
          >
            Join FitLife+ and start building a healthier you
          </p>
          
          <div 
            className={`transform transition-all duration-700 delay-400 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
          >
            <Link 
              to="/signup" 
              className="inline-block px-10 py-3.5 bg-white text-blue-600 rounded-lg font-medium shadow-lg hover:shadow-xl hover:bg-gray-50 hover:scale-110 transition-all duration-300"
            >
              Get Started
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
