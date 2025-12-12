import React, { useEffect, useRef, useState } from 'react';

export default function AppWorkflow() {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
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

  const screens = [
    {
      title: "Profile Management",
      description: "Customize your profile with age, gender, and diet preferences",
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      ),
      color: "bg-slate-600"
    },
    {
      title: "Progress Tracking",
      description: "View BMI history with charts for 1 week to 1 year",
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      ),
      color: "bg-blue-600"
    },
    {
      title: "Daily Check-ins",
      description: "Track exercise, diet, and hydration with streak counter",
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      color: "bg-green-600"
    },
    {
      title: "Membership Plans",
      description: "Free, Pro (₹199/mo), and Elite (₹499/mo) options",
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
        </svg>
      ),
      color: "bg-yellow-600"
    },
    {
      title: "Order History",
      description: "Track supplement orders with Razorpay payment integration",
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
        </svg>
      ),
      color: "bg-indigo-600"
    },
    {
      title: "User Reviews",
      description: "Write and edit reviews with admin approval system",
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
        </svg>
      ),
      color: "bg-pink-600"
    }
  ];

  return (
    <section ref={sectionRef} className="py-12 md:py-16 bg-gray-50">
      <div className="container mx-auto px-4 md:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-10 overflow-hidden">
          <h2 
            className={`text-4xl md:text-5xl font-bold text-gray-900 mb-6 transform transition-all duration-700 ${
              isVisible ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0'
            }`}
          >
            Powerful Features at Your Fingertips
          </h2>
          <div className="flex justify-center mb-6">
            <div className={`h-1 bg-slate-600 transition-all duration-1000 delay-300 ${isVisible ? 'w-32' : 'w-0'}`}></div>
          </div>
          <p 
            className={`text-lg text-gray-600 transform transition-all duration-700 delay-500 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
          >
            Explore the comprehensive tools designed to support your wellness journey
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {screens.map((screen, index) => (
            <div
              key={index}
              className={`group relative bg-white rounded-xl p-8 border-2 border-gray-100 hover:border-gray-300 hover:shadow-2xl transition-all duration-500 transform ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}
              style={{ transitionDelay: `${index * 100}ms` }}
            >
              {/* Blurred Background Effect */}
              <div className="absolute inset-0 bg-gradient-to-br opacity-5 group-hover:opacity-10 transition-opacity duration-500" style={{ backgroundImage: `linear-gradient(to bottom right, var(--tw-gradient-stops))` }}></div>

              {/* Icon */}
              <div className={`relative w-16 h-16 rounded-lg ${screen.color} flex items-center justify-center mb-6 text-white shadow-md transform group-hover:scale-110 group-hover:rotate-3 transition-all duration-300`}>
                {screen.icon}
              </div>

              {/* Content */}
              <h3 className="relative text-xl font-bold text-gray-900 mb-3">
                {screen.title}
              </h3>
              <p className="relative text-gray-600 leading-relaxed">
                {screen.description}
              </p>

              {/* Mock UI Preview - Animated */}
              <div className="relative mt-6 h-32 bg-gradient-to-br from-gray-50 to-gray-100 overflow-hidden border border-gray-200 rounded-lg">
                {/* Decorative UI elements based on feature */}
                {index === 0 && (
                  // Profile Management - user avatar and fields
                  <div className="p-4 flex flex-col items-center justify-center space-y-2">
                    <div className="w-16 h-16 bg-slate-300 rounded-full animate-pulse"></div>
                    <div className="flex gap-2 w-full">
                      <div className="flex-1 h-3 bg-gray-300 rounded animate-pulse" style={{animationDelay: '0.2s'}}></div>
                      <div className="flex-1 h-3 bg-gray-300 rounded animate-pulse" style={{animationDelay: '0.4s'}}></div>
                    </div>
                  </div>
                )}
                {index === 1 && (
                  // Progress Tracking - line chart
                  <div className="p-3 flex items-end gap-1 h-full">
                    {[40, 55, 45, 60, 50, 65, 70].map((height, i) => (
                      <div key={i} className="flex-1 bg-blue-300 rounded-t animate-pulse" style={{height: `${height}%`, animationDelay: `${i * 0.1}s`}}></div>
                    ))}
                  </div>
                )}
                {index === 2 && (
                  // Daily Check-ins - checkboxes
                  <div className="p-4 space-y-3">
                    {[0, 1, 2].map((i) => (
                      <div key={i} className="flex items-center gap-3">
                        <div className="w-5 h-5 bg-green-400 rounded border-2 border-green-600 animate-pulse" style={{animationDelay: `${i * 0.2}s`}}></div>
                        <div className="flex-1 h-3 bg-gray-300 rounded animate-pulse" style={{animationDelay: `${i * 0.2}s`}}></div>
                      </div>
                    ))}
                  </div>
                )}
                {index === 3 && (
                  // Membership Plans - pricing cards
                  <div className="p-3 flex gap-2">
                    {['Free', 'Pro', 'Elite'].map((plan, i) => (
                      <div key={i} className="flex-1 bg-yellow-200 rounded p-2 animate-pulse" style={{animationDelay: `${i * 0.15}s`}}>
                        <div className="h-2 bg-yellow-400 rounded mb-1"></div>
                        <div className="h-4 bg-yellow-500 rounded"></div>
                      </div>
                    ))}
                  </div>
                )}
                {index === 4 && (
                  // Order History - list items
                  <div className="p-3 space-y-2">
                    {[0, 1, 2, 3].map((i) => (
                      <div key={i} className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-indigo-300 rounded animate-pulse" style={{animationDelay: `${i * 0.15}s`}}></div>
                        <div className="flex-1 space-y-1">
                          <div className="h-2 bg-gray-300 rounded animate-pulse" style={{animationDelay: `${i * 0.15}s`}}></div>
                          <div className="h-2 w-2/3 bg-gray-200 rounded animate-pulse" style={{animationDelay: `${i * 0.15 + 0.1}s`}}></div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                {index === 5 && (
                  // User Reviews - star ratings and text
                  <div className="p-4 space-y-2">
                    <div className="flex gap-1 justify-center">
                      {[...Array(5)].map((_, i) => (
                        <div key={i} className="w-4 h-4 bg-pink-400 rounded-sm animate-pulse" style={{animationDelay: `${i * 0.1}s`}}></div>
                      ))}
                    </div>
                    <div className="space-y-1">
                      <div className="h-2 bg-gray-300 rounded animate-pulse"></div>
                      <div className="h-2 bg-gray-300 rounded animate-pulse" style={{animationDelay: '0.2s'}}></div>
                      <div className="h-2 w-3/4 bg-gray-300 rounded animate-pulse" style={{animationDelay: '0.4s'}}></div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* CSS Animations */}
      <style>{`
        @keyframes shimmer {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(100%);
          }
        }

        .animate-shimmer {
          animation: shimmer 2s infinite;
        }
      `}</style>
    </section>
  );
}
