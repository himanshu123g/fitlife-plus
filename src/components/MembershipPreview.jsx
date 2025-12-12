import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';

export default function MembershipPreview() {
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

  const plans = [
    {
      name: 'Free',
      label: 'Basic tools',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      ),
      color: 'border-gray-300 bg-white'
    },
    {
      name: 'Pro',
      label: 'Advanced insights',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      ),
      color: 'border-blue-300 bg-blue-50'
    },
    {
      name: 'Elite',
      label: 'Personal coaching',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
        </svg>
      ),
      color: 'border-amber-300 bg-amber-50'
    }
  ];

  return (
    <section ref={sectionRef} className="py-16 md:py-20 bg-white">
      <div className="container mx-auto px-4 md:px-6 lg:px-8">
        <div 
          className={`text-center max-w-3xl mx-auto mb-12 transform transition-all duration-700 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          <h2 className="text-3xl md:text-4xl font-semibold text-gray-900 mb-4">
            Choose Your Fitness Journey
          </h2>
          <p className="text-lg text-gray-600">
            From free access to expert guidance — FitLife+ has a plan for everyone
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-6 mt-12 max-w-4xl mx-auto">
          {plans.map((plan, index) => (
            <div 
              key={index}
              className={`p-6 rounded-xl border-2 ${plan.color} hover:shadow-lg hover:scale-105 hover:-translate-y-2 transition-all duration-300 transform ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}
              style={{ transitionDelay: `${index * 150}ms` }}
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="text-gray-700 transform hover:scale-110 hover:rotate-12 transition-all duration-300">
                  {plan.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-900">{plan.name}</h3>
              </div>
              
              <p className="text-gray-600 mb-6">{plan.label}</p>
              
              <Link 
                to="/membership"
                className="block w-full py-2.5 text-center bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 hover:scale-105 transition-all duration-300"
              >
                View Details
              </Link>
            </div>
          ))}
        </div>
        
        <div 
          className={`text-center mt-12 transform transition-all duration-700 delay-500 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          <Link 
            to="/membership" 
            className="inline-block px-8 py-3 bg-white text-blue-600 border border-gray-300 rounded-lg font-medium hover:bg-gray-50 hover:border-blue-600 hover:scale-105 transition-all duration-300"
          >
            Compare All Plans
          </Link>
        </div>
      </div>
    </section>
  );
}
