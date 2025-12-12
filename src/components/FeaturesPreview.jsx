import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';

export default function FeaturesPreview() {
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

  const features = [
    {
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
        </svg>
      ),
      title: 'BMI Calculator',
      description: 'Calculate your BMI instantly with visual charts and personalized health insights',
      iconBg: 'bg-emerald-100',
      iconColor: 'text-emerald-600',
      link: '/features',
      tag: 'Free',
      mockup: 'bmi'
    },
    {
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      ),
      title: '7-Day Plans',
      description: 'Complete weekly exercise routines and meal plans with calorie tracking',
      iconBg: 'bg-blue-100',
      iconColor: 'text-blue-600',
      link: '/features',
      badge: 'Pro & Elite',
      tag: 'Pro & Elite',
      mockup: 'plans'
    },
    {
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
        </svg>
      ),
      title: 'Video Coaching',
      description: 'Live HD sessions with certified trainers for personalized coaching',
      iconBg: 'bg-purple-100',
      iconColor: 'text-purple-600',
      link: '/features',
      badge: 'Elite',
      tag: 'Elite Only',
      mockup: 'video'
    },
    {
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
        </svg>
      ),
      title: 'Natural Remedies',
      description: '15+ proven home remedies for common health issues with step-by-step instructions',
      iconBg: 'bg-teal-100',
      iconColor: 'text-teal-600',
      link: '/features',
      tag: 'Free',
      mockup: 'remedies'
    },
    {
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
        </svg>
      ),
      title: 'Supplement Shop',
      description: 'Premium supplements with 4-10% member discounts and expert guidance',
      iconBg: 'bg-orange-100',
      iconColor: 'text-orange-600',
      link: '/features',
      tag: 'Free Browsing',
      mockup: 'shop'
    },
    {
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
        </svg>
      ),
      title: 'AI FitBot',
      description: 'Chat 24/7 with our intelligent assistant for instant fitness and diet guidance',
      iconBg: 'bg-indigo-100',
      iconColor: 'text-indigo-600',
      link: '/features',
      badge: 'Pro & Elite',
      tag: 'Pro & Elite',
      mockup: 'chatbot'
    }
  ];

  // Animated mockup components - More dynamic and unique
  const renderMockup = (type) => {
    switch(type) {
      case 'bmi':
        return (
          <div className="mt-4 space-y-2">
            <div className="flex gap-2 items-end">
              <div className="flex-1 bg-gradient-to-t from-blue-400 to-blue-200 rounded animate-growHeight" style={{height: '48px', animationDelay: '0s'}}></div>
              <div className="flex-1 bg-gradient-to-t from-purple-400 to-purple-200 rounded animate-growHeight" style={{height: '36px', animationDelay: '0.2s'}}></div>
              <div className="flex-1 bg-gradient-to-t from-pink-400 to-pink-200 rounded animate-growHeight" style={{height: '42px', animationDelay: '0.4s'}}></div>
            </div>
            <div className="flex gap-2">
              <div className="w-1/2 h-6 bg-gradient-to-r from-gray-200 to-gray-300 rounded animate-slideInLeft"></div>
              <div className="w-1/2 h-6 bg-gradient-to-r from-gray-200 to-gray-300 rounded animate-slideInRight"></div>
            </div>
          </div>
        );
      case 'plans':
        return (
          <div className="mt-4 space-y-2">
            {[0, 1, 2, 3].map((i) => (
              <div key={i} className="flex items-center gap-2 animate-fadeInUp" style={{animationDelay: `${i * 0.15}s`}}>
                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse-scale" style={{animationDelay: `${i * 0.2}s`}}></div>
                <div className="flex-1 h-3 bg-gradient-to-r from-green-200 to-green-300 rounded animate-expandWidth" style={{animationDelay: `${i * 0.2}s`}}></div>
              </div>
            ))}
          </div>
        );
      case 'video':
        return (
          <div className="mt-4 relative">
            <div className="w-full h-24 bg-gradient-to-br from-purple-200 to-purple-300 rounded-lg flex items-center justify-center relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-30 animate-shimmer"></div>
              <div className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
              <div className="w-14 h-14 bg-purple-500 rounded-full flex items-center justify-center animate-pulse-scale shadow-lg">
                <div className="w-0 h-0 border-l-8 border-l-white border-y-6 border-y-transparent ml-1"></div>
              </div>
            </div>
          </div>
        );
      case 'remedies':
        return (
          <div className="mt-4 grid grid-cols-3 gap-2">
            {[0, 1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="h-12 bg-gradient-to-br from-green-200 to-green-300 rounded-lg flex items-center justify-center animate-fadeInUp" style={{animationDelay: `${i * 0.1}s`}}>
                <div className="w-6 h-6 bg-green-500 rounded-full animate-spin-slow"></div>
              </div>
            ))}
          </div>
        );
      case 'shop':
        return (
          <div className="mt-4 flex gap-2">
            {[0, 1, 2].map((i) => (
              <div key={i} className="flex-1 space-y-2 animate-fadeInUp" style={{animationDelay: `${i * 0.15}s`}}>
                <div className="h-16 bg-gradient-to-br from-orange-300 to-orange-400 rounded relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent"></div>
                  <div className="absolute top-1 right-1 w-6 h-6 bg-orange-500 rounded-full animate-pulse"></div>
                </div>
                <div className="h-2 bg-gradient-to-r from-gray-200 to-gray-300 rounded animate-expandWidth" style={{animationDelay: `${i * 0.2}s`}}></div>
              </div>
            ))}
          </div>
        );
      case 'chatbot':
        return (
          <div className="mt-4 space-y-2">
            <div className="flex justify-end">
              <div className="w-3/4 h-8 bg-blue-200 rounded-lg animate-slideInRight"></div>
            </div>
            <div className="flex justify-start">
              <div className="w-3/4 h-8 bg-gray-200 rounded-lg animate-slideInLeft"></div>
            </div>
            <div className="flex justify-end">
              <div className="w-2/3 h-8 bg-blue-200 rounded-lg animate-slideInRight" style={{animationDelay: '0.5s'}}></div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <section ref={sectionRef} id="features" className="py-20 md:py-28 bg-gradient-to-b from-gray-50 to-white relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-500 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-500 rounded-full blur-3xl"></div>
      </div>

      <div className="container mx-auto px-4 md:px-6 lg:px-8 relative z-10">
        <div 
          className={`text-center max-w-3xl mx-auto mb-16 transform transition-all duration-700 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          <div className="inline-block px-5 py-2 bg-blue-600 text-white rounded-full text-sm font-semibold mb-6 shadow-md">
            Comprehensive Wellness Platform
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Everything You Need to Stay Healthy
          </h2>
          <div className="flex justify-center mb-6">
            <div className={`h-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full transition-all duration-1000 delay-300 ${isVisible ? 'w-32' : 'w-0'}`}></div>
          </div>
          <p className="text-lg text-gray-600">
            Powerful tools and expert guidance to help you achieve your wellness goals
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 mt-12">
          {features.map((feature, index) => (
            <Link
              key={index}
              to={feature.link}
              className={`group relative p-8 rounded-2xl bg-white border-2 border-gray-100 hover:border-blue-200 hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 transform ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}
              style={{ 
                transitionDelay: `${index * 100}ms`,
                animation: isVisible ? `float ${3 + (index % 3)}s ease-in-out infinite` : 'none',
                animationDelay: `${index * 0.2}s`
              }}
            >
              {/* Gradient border on hover */}
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-blue-400 to-purple-400 opacity-0 group-hover:opacity-10 transition-opacity duration-500"></div>
              
              {/* Content */}
              <div className="relative z-10">
                {feature.badge && (
                  <div className={`absolute -top-3 -right-3 text-xs font-semibold px-3 py-1 rounded-full shadow-md animate-pulse ${
                    feature.badge === 'Elite' 
                      ? 'bg-purple-600 text-white' 
                      : 'bg-blue-600 text-white'
                  }`}>
                    {feature.badge}
                  </div>
                )}
                <div className={`w-16 h-16 rounded-xl ${feature.iconBg} flex items-center justify-center mb-5 group-hover:scale-125 group-hover:rotate-6 transition-all duration-500 shadow-md group-hover:shadow-xl`}>
                  <div className={`${feature.iconColor} group-hover:scale-110 transition-transform duration-300`}>
                    {feature.icon}
                  </div>
                </div>
                
                <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-blue-600 group-hover:to-purple-600 transition-all duration-300">
                  {feature.title}
                </h3>
                
                <p className="text-gray-600 leading-relaxed mb-4">
                  {feature.description}
                </p>

                {/* Animated Mockup */}
                {feature.mockup && renderMockup(feature.mockup)}

                <div className="flex items-center text-blue-600 font-semibold text-sm group-hover:translate-x-2 transition-transform duration-300 mt-4">
                  <span>Learn more</span>
                  <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </Link>
          ))}
        </div>
        
        <div 
          className={`text-center mt-16 transform transition-all duration-700 delay-700 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          <Link 
            to="/features" 
            className="group inline-flex items-center gap-3 px-8 py-4 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl"
          >
            <span>Explore All Features</span>
            <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </Link>
        </div>
      </div>

      {/* CSS Animations */}
      <style>{`
        @keyframes float {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-10px);
          }
        }

        @keyframes shimmer {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(100%);
          }
        }

        @keyframes slideInRight {
          0% {
            opacity: 0;
            transform: translateX(20px);
          }
          100% {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes slideInLeft {
          0% {
            opacity: 0;
            transform: translateX(-20px);
          }
          100% {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes growHeight {
          0% {
            transform: scaleY(0);
            transform-origin: bottom;
          }
          100% {
            transform: scaleY(1);
            transform-origin: bottom;
          }
        }

        @keyframes expandWidth {
          0% {
            transform: scaleX(0);
            transform-origin: left;
          }
          100% {
            transform: scaleX(1);
            transform-origin: left;
          }
        }

        @keyframes fadeInUp {
          0% {
            opacity: 0;
            transform: translateY(10px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes pulseScale {
          0%, 100% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.1);
          }
        }

        @keyframes spinSlow {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }

        .animate-shimmer {
          animation: shimmer 2s infinite;
        }

        .animate-slideInRight {
          animation: slideInRight 0.8s ease-out forwards;
        }

        .animate-slideInLeft {
          animation: slideInLeft 0.8s ease-out forwards;
        }

        .animate-growHeight {
          animation: growHeight 1s ease-out forwards;
        }

        .animate-expandWidth {
          animation: expandWidth 1s ease-out forwards;
        }

        .animate-fadeInUp {
          animation: fadeInUp 0.6s ease-out forwards;
        }

        .animate-pulse-scale {
          animation: pulseScale 2s ease-in-out infinite;
        }

        .animate-spin-slow {
          animation: spinSlow 3s linear infinite;
        }
      `}</style>
    </section>
  );
}
