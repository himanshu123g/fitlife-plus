import React, { useEffect, useRef, useState } from 'react';

export default function HowItWorks() {
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

  const steps = [
    {
      number: "01",
      title: "Sign Up & Create Profile",
      description: "Create your free account in seconds. Add your health goals, dietary preferences, and fitness level.",
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
        </svg>
      ),
      color: "bg-blue-600"
    },
    {
      number: "02",
      title: "Check BMI & Get Instant Plans",
      description: "Calculate your BMI and receive personalized workout and meal plans tailored to your body type and goals.",
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
        </svg>
      ),
      color: "bg-indigo-600"
    },
    {
      number: "03",
      title: "Explore Remedies, Plans & Shop",
      description: "Access natural home remedies, browse premium supplements, and follow your personalized 7-day plans.",
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
        </svg>
      ),
      color: "bg-emerald-600"
    },
    {
      number: "04",
      title: "Book 1-on-1 Coaching",
      description: "Upgrade to Elite for live HD video sessions with certified trainers for personalized guidance and form correction.",
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
        </svg>
      ),
      color: "bg-orange-600"
    }
  ];

  return (
    <section ref={sectionRef} className="py-12 md:py-16 bg-gray-50 relative overflow-hidden">
      <div className="container mx-auto px-4 md:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-10 overflow-hidden">
          <h2 
            className={`text-4xl md:text-5xl font-bold text-gray-900 mb-6 transform transition-all duration-700 ${
              isVisible ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0'
            }`}
          >
            How FitLife+ Works
          </h2>
          <div className="flex justify-center mb-6">
            <div className={`h-1 bg-blue-600 transition-all duration-1000 delay-300 ${isVisible ? 'w-32' : 'w-0'}`}></div>
          </div>
          <p 
            className={`text-lg text-gray-600 transform transition-all duration-700 delay-500 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
          >
            Your journey to better health in 4 simple steps
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 relative">
          {steps.map((step, index) => (
            <div
              key={index}
              className={`relative transform transition-all duration-700 ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}
              style={{ transitionDelay: `${index * 200}ms` }}
            >
              {/* Step Card */}
              <div className="bg-white rounded-xl p-6 border-2 border-gray-100 hover:border-transparent hover:shadow-2xl transition-all duration-500 relative z-10">
                {/* Number Badge */}
                <div className={`absolute -top-4 -right-4 w-12 h-12 rounded-full ${step.color} flex items-center justify-center shadow-md`}>
                  <span className="text-white font-bold text-sm">{step.number}</span>
                </div>

                {/* Icon */}
                <div className={`w-16 h-16 rounded-lg ${step.color} flex items-center justify-center mb-6 text-white shadow-md transform hover:scale-110 hover:rotate-3 transition-all duration-300`}>
                  {step.icon}
                </div>

                {/* Content */}
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  {step.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {step.description}
                </p>
              </div>

            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div 
          className={`text-center mt-12 transform transition-all duration-700 delay-900 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          <p className="text-gray-600 mb-6">Ready to start your transformation?</p>
          <a
            href="/signup"
            className="inline-flex items-center gap-2 px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-md hover:shadow-xl transform hover:scale-105 transition-all duration-300"
          >
            <span>Get Started Free</span>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </a>
        </div>
      </div>
    </section>
  );
}
