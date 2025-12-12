import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import heroImage from '../assets/images/heromain.jpeg';

export default function Hero() {
  const [isVisible, setIsVisible] = useState(false);
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 100);
    
    // Throttled scroll handler for better performance
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          setScrollY(window.scrollY);
          ticking = false;
        });
        ticking = true;
      }
    };
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      clearTimeout(timer);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const scrollToFeatures = () => {
    document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="relative overflow-hidden h-[600px] md:h-[700px] lg:h-[800px]">
      {/* Full-width Background Image with Parallax */}
      <div 
        className="absolute inset-0 w-full h-full"
        style={{ 
          transform: `translateY(${scrollY * 0.4}px)`,
          willChange: 'transform'
        }}
      >
        <div 
          className={`w-full h-full transition-all duration-[2000ms] ease-out ${
            isVisible ? 'translate-x-0 scale-100' : 'translate-x-full scale-110'
          }`}
        >
          <img 
            src={heroImage} 
            alt="FitLife+ Fitness" 
            className="w-full h-full object-cover"
            loading="eager"
            style={{ willChange: 'transform' }}
            onError={(e) => {
              e.target.style.display = 'none';
              console.error('Hero image failed to load');
            }}
          />
        </div>
        {/* Lighter Gradient Overlay */}
        <div className={`absolute inset-0 bg-gradient-to-r from-black/50 via-black/30 to-transparent transition-opacity duration-[1500ms] ${
          isVisible ? 'opacity-100' : 'opacity-0'
        }`}></div>
      </div>

      {/* Content Overlay */}
      <div className="relative h-full flex items-center">
        <div className="container mx-auto px-4 md:px-6 lg:px-8">
          <div className="max-w-3xl">
            {/* Badge */}
            <div 
              className={`inline-block px-4 py-2 bg-white/10 backdrop-blur-md border border-white/20 text-white rounded-full text-sm font-medium mb-6 transform transition-all duration-700 ease-out ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'
              }`}
            >
              Your Health, Your Way
            </div>
            
            {/* Main Title */}
            <h1 
              className={`text-5xl md:text-6xl lg:text-7xl font-bold text-white leading-tight mb-6 transform transition-all duration-700 delay-100 ease-out ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'
              }`}
            >
              FitLife<span className="text-blue-400">+</span>
            </h1>
            
            {/* Subtitle */}
            <p 
              className={`text-2xl md:text-3xl text-white/90 font-medium mb-4 transform transition-all duration-700 delay-200 ease-out ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'
              }`}
            >
              Smart Fitness and Wellness Companion
            </p>
            
            {/* Description */}
            <p 
              className={`text-lg md:text-xl text-white/80 leading-relaxed mb-8 transform transition-all duration-700 delay-300 ease-out ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'
              }`}
            >
              Track your health, manage your diet, and achieve your fitness goals — all in one app.
            </p>
            
            {/* Buttons */}
            <div 
              className={`flex flex-col sm:flex-row gap-4 mb-12 transform transition-all duration-700 delay-400 ease-out ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'
              }`}
            >
              <Link 
                to="/signup" 
                className="group px-8 py-4 bg-blue-600 text-white rounded-lg font-semibold shadow-lg hover:shadow-xl hover:bg-blue-700 hover:scale-105 transition-all duration-300 text-center flex items-center justify-center gap-2"
              >
                Get Started Free
                <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Link>
              <button 
                onClick={scrollToFeatures}
                className="px-8 py-4 bg-white/10 backdrop-blur-md border-2 border-white/30 text-white rounded-lg font-semibold hover:bg-white/20 hover:scale-105 transition-all duration-300"
              >
                Learn More
              </button>
            </div>
            
            {/* Stats */}
            <div 
              className={`grid grid-cols-3 gap-6 transform transition-all duration-700 delay-500 ease-out ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
              }`}
            >
              <div className="text-center transform hover:scale-110 transition-transform duration-300">
                <div className="text-3xl md:text-4xl font-bold text-white">15+</div>
                <div className="text-sm text-white/70 mt-1">Home Remedies</div>
              </div>
              <div className="text-center transform hover:scale-110 transition-transform duration-300">
                <div className="text-3xl md:text-4xl font-bold text-white">7-Day</div>
                <div className="text-sm text-white/70 mt-1">Meal Plans</div>
              </div>
              <div className="text-center transform hover:scale-110 transition-transform duration-300">
                <div className="text-3xl md:text-4xl font-bold text-white">24/7</div>
                <div className="text-sm text-white/70 mt-1">AI FitBot</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div 
        className={`absolute bottom-8 left-1/2 transform -translate-x-1/2 transition-all duration-700 delay-700 ease-out ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
        }`}
      >
        <button 
          onClick={scrollToFeatures}
          className="flex flex-col items-center gap-2 text-white/70 hover:text-white transition-colors duration-300 animate-bounce"
          style={{ animationDuration: '2s' }}
        >
          <span className="text-sm font-medium">Scroll to explore</span>
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </button>
      </div>
    </section>
  );
}
