import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';

export default function Footer() {
  const [isVisible, setIsVisible] = useState(false);
  const footerRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (footerRef.current) {
      observer.observe(footerRef.current);
    }

    return () => {
      if (footerRef.current) {
        observer.unobserve(footerRef.current);
      }
    };
  }, []);

  return (
    <footer ref={footerRef} className="bg-gradient-to-br from-gray-900 via-slate-900 to-gray-900 text-gray-300 border-t border-gray-800">
      <div className="container mx-auto px-4 md:px-6 lg:px-8">
        {/* Main Footer Content */}
        <div className="py-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-12">
          
          {/* Brand Section */}
          <div 
            className={`space-y-5 transform transition-all duration-700 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
          >
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-cyan-500 rounded-lg flex items-center justify-center shadow-lg">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-white tracking-tight">
                FitLife<span className="text-cyan-400">+</span>
              </h3>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed pr-4">
              Your smart fitness companion for personalized workout plans, nutrition guidance, expert coaching, and premium supplements. Transform your health journey with data-driven insights.
            </p>
            
            {/* Social Icons - Placeholders Only */}
            <div className="flex gap-3 pt-2">
              <a href="#" className="w-10 h-10 rounded-lg bg-gray-800/50 hover:bg-gradient-to-br hover:from-pink-600 hover:to-purple-600 flex items-center justify-center transition-all duration-300 cursor-pointer group border border-gray-700/50 hover:border-transparent hover:scale-110 hover:shadow-lg">
                <svg className="w-5 h-5 text-gray-400 group-hover:text-white transition-colors" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
              </a>
              <a href="#" className="w-10 h-10 rounded-lg bg-gray-800/50 hover:bg-gradient-to-br hover:from-red-600 hover:to-red-500 flex items-center justify-center transition-all duration-300 cursor-pointer group border border-gray-700/50 hover:border-transparent hover:scale-110 hover:shadow-lg">
                <svg className="w-5 h-5 text-gray-400 group-hover:text-white transition-colors" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                </svg>
              </a>
              <a href="#" className="w-10 h-10 rounded-lg bg-gray-800/50 hover:bg-gradient-to-br hover:from-gray-700 hover:to-gray-600 flex items-center justify-center transition-all duration-300 cursor-pointer group border border-gray-700/50 hover:border-transparent hover:scale-110 hover:shadow-lg">
                <svg className="w-5 h-5 text-gray-400 group-hover:text-white transition-colors" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div 
            className={`transform transition-all duration-700 delay-100 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
          >
            <h4 className="text-white font-semibold mb-5 text-sm uppercase tracking-wider flex items-center gap-2">
              <div className="w-1 h-5 bg-gradient-to-b from-cyan-400 to-blue-600 rounded-full"></div>
              Quick Links
            </h4>
            <ul className="space-y-3">
              <li>
                <Link to="/" className="text-gray-400 hover:text-cyan-400 hover:translate-x-2 inline-flex items-center gap-2 transition-all duration-300 text-sm group">
                  <span className="w-1.5 h-1.5 rounded-full bg-gray-600 group-hover:bg-cyan-400 transition-colors"></span>
                  Home
                </Link>
              </li>
              <li>
                <Link to="/remedies" className="text-gray-400 hover:text-cyan-400 hover:translate-x-2 inline-flex items-center gap-2 transition-all duration-300 text-sm group">
                  <span className="w-1.5 h-1.5 rounded-full bg-gray-600 group-hover:bg-cyan-400 transition-colors"></span>
                  Remedies
                </Link>
              </li>
              <li>
                <Link to="/shop" className="text-gray-400 hover:text-cyan-400 hover:translate-x-2 inline-flex items-center gap-2 transition-all duration-300 text-sm group">
                  <span className="w-1.5 h-1.5 rounded-full bg-gray-600 group-hover:bg-cyan-400 transition-colors"></span>
                  Shop
                </Link>
              </li>
              <li>
                <Link to="/membership" className="text-gray-400 hover:text-cyan-400 hover:translate-x-2 inline-flex items-center gap-2 transition-all duration-300 text-sm group">
                  <span className="w-1.5 h-1.5 rounded-full bg-gray-600 group-hover:bg-cyan-400 transition-colors"></span>
                  Membership
                </Link>
              </li>
              <li>
                <Link to="/exercise-diet-plans" className="text-gray-400 hover:text-cyan-400 hover:translate-x-2 inline-flex items-center gap-2 transition-all duration-300 text-sm group">
                  <span className="w-1.5 h-1.5 rounded-full bg-gray-600 group-hover:bg-cyan-400 transition-colors"></span>
                  Plans
                </Link>
              </li>
              <li>
                <Link to="/video-call" className="text-gray-400 hover:text-cyan-400 hover:translate-x-2 inline-flex items-center gap-2 transition-all duration-300 text-sm group">
                  <span className="w-1.5 h-1.5 rounded-full bg-gray-600 group-hover:bg-cyan-400 transition-colors"></span>
                  Video Call <span className="text-xs bg-purple-600/20 text-purple-400 px-1.5 py-0.5 rounded">Elite</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Explore Features */}
          <div 
            className={`transform transition-all duration-700 delay-200 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
          >
            <h4 className="text-white font-semibold mb-5 text-sm uppercase tracking-wider flex items-center gap-2">
              <div className="w-1 h-5 bg-gradient-to-b from-cyan-400 to-blue-600 rounded-full"></div>
              Explore
            </h4>
            <ul className="space-y-3">
              <li>
                <Link to="/features" className="text-gray-400 hover:text-cyan-400 hover:translate-x-2 inline-flex items-center gap-2 transition-all duration-300 text-sm group">
                  <span className="w-1.5 h-1.5 rounded-full bg-gray-600 group-hover:bg-cyan-400 transition-colors"></span>
                  BMI Calculator
                </Link>
              </li>
              <li>
                <Link to="/features" className="text-gray-400 hover:text-cyan-400 hover:translate-x-2 inline-flex items-center gap-2 transition-all duration-300 text-sm group">
                  <span className="w-1.5 h-1.5 rounded-full bg-gray-600 group-hover:bg-cyan-400 transition-colors"></span>
                  AI FitBot
                </Link>
              </li>
              <li>
                <Link to="/features" className="text-gray-400 hover:text-cyan-400 hover:translate-x-2 inline-flex items-center gap-2 transition-all duration-300 text-sm group">
                  <span className="w-1.5 h-1.5 rounded-full bg-gray-600 group-hover:bg-cyan-400 transition-colors"></span>
                  7-Day Plans
                </Link>
              </li>
              <li>
                <Link to="/shop" className="text-gray-400 hover:text-cyan-400 hover:translate-x-2 inline-flex items-center gap-2 transition-all duration-300 text-sm group">
                  <span className="w-1.5 h-1.5 rounded-full bg-gray-600 group-hover:bg-cyan-400 transition-colors"></span>
                  Supplements
                </Link>
              </li>
              <li>
                <Link to="/video-call" className="text-gray-400 hover:text-cyan-400 hover:translate-x-2 inline-flex items-center gap-2 transition-all duration-300 text-sm group">
                  <span className="w-1.5 h-1.5 rounded-full bg-gray-600 group-hover:bg-cyan-400 transition-colors"></span>
                  Video Coaching
                </Link>
              </li>
            </ul>
          </div>

          {/* Membership Benefits & Contact */}
          <div 
            className={`transform transition-all duration-700 delay-300 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
          >
            <h4 className="text-white font-semibold mb-5 text-sm uppercase tracking-wider flex items-center gap-2">
              <div className="w-1 h-5 bg-gradient-to-b from-cyan-400 to-blue-600 rounded-full"></div>
              Membership
            </h4>
            <ul className="space-y-3 mb-8">
              <li className="text-gray-400 text-sm flex items-start gap-2.5 group">
                <div className="w-5 h-5 rounded bg-emerald-500/10 flex items-center justify-center flex-shrink-0 group-hover:bg-emerald-500/20 transition-colors">
                  <svg className="w-3 h-3 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <span className="group-hover:text-gray-300 transition-colors">Free: Basic Tools</span>
              </li>
              <li className="text-gray-400 text-sm flex items-start gap-2.5 group">
                <div className="w-5 h-5 rounded bg-blue-500/10 flex items-center justify-center flex-shrink-0 group-hover:bg-blue-500/20 transition-colors">
                  <svg className="w-3 h-3 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <span className="group-hover:text-gray-300 transition-colors">Pro: Expert Plans</span>
              </li>
              <li className="text-gray-400 text-sm flex items-start gap-2.5 group">
                <div className="w-5 h-5 rounded bg-purple-500/10 flex items-center justify-center flex-shrink-0 group-hover:bg-purple-500/20 transition-colors">
                  <svg className="w-3 h-3 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <span className="group-hover:text-gray-300 transition-colors">Elite: 1-on-1 Coaching</span>
              </li>
            </ul>

            <h4 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider flex items-center gap-2">
              <div className="w-1 h-5 bg-gradient-to-b from-cyan-400 to-blue-600 rounded-full"></div>
              Contact
            </h4>
            <ul className="space-y-2.5">
              <li className="text-gray-400 text-sm flex items-center gap-2.5 hover:text-cyan-400 transition-colors group">
                <div className="w-5 h-5 rounded bg-gray-800/50 flex items-center justify-center flex-shrink-0 group-hover:bg-cyan-500/10 transition-colors">
                  <svg className="w-3 h-3 group-hover:text-cyan-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <span className="text-xs">support@fitlife.com</span>
              </li>
              <li className="text-gray-400 text-sm flex items-center gap-2.5 hover:text-cyan-400 transition-colors group">
                <div className="w-5 h-5 rounded bg-gray-800/50 flex items-center justify-center flex-shrink-0 group-hover:bg-cyan-500/10 transition-colors">
                  <svg className="w-3 h-3 group-hover:text-cyan-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                </div>
                <span className="text-xs">+91 98765 43210</span>
              </li>
              <li className="text-gray-400 text-sm flex items-center gap-2.5 hover:text-cyan-400 transition-colors group">
                <div className="w-5 h-5 rounded bg-gray-800/50 flex items-center justify-center flex-shrink-0 group-hover:bg-cyan-500/10 transition-colors">
                  <svg className="w-3 h-3 group-hover:text-cyan-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <span className="text-xs">Chandigarh, India</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-800"></div>
          </div>
          <div className="relative flex justify-center">
            <div className="bg-gradient-to-r from-transparent via-cyan-500/20 to-transparent h-px w-1/3"></div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="py-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <p className="text-gray-500 text-sm text-center md:text-left flex items-center gap-2">
              <span>© 2025</span>
              <span className="text-cyan-400 font-semibold">FitLife+</span>
              <span>• All rights reserved</span>
            </p>
            
            {/* Developer Credits */}
            <div className="flex flex-wrap items-center justify-center gap-2 text-sm">
              <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-800/30 border border-gray-700/50 hover:border-cyan-500/30 transition-all duration-300 group">
                <svg className="w-4 h-4 text-gray-500 group-hover:text-cyan-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                </svg>
                <span className="text-gray-500 text-xs">Developed by:</span>
                <div className="flex items-center gap-2">
                  <span className="text-gray-300 font-medium text-xs">Himanshu Sodhi</span>
                  <span className="text-gray-700">•</span>
                  <span className="text-gray-300 font-medium text-xs">Akashdeep</span>
                  <span className="text-gray-700">•</span>
                  <span className="text-gray-300 font-medium text-xs">Harpreet Singh</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
