import React, { useEffect, useRef, useState } from 'react';

export default function WhyItWorks() {
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

  const sciences = [
    {
      title: "BMI-Based Nutrition",
      description: "Our diet plans are calculated based on your Body Mass Index, ensuring optimal calorie intake for your body type and goals.",
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
        </svg>
      ),
      stats: ["Personalized Macros", "Calorie Precision", "Body Type Specific"],
      color: "bg-blue-50 border-blue-200 text-blue-700"
    },
    {
      title: "Progressive Overload",
      description: "Workouts gradually increase in intensity, allowing your muscles to adapt and grow stronger while preventing injury and plateaus.",
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
        </svg>
      ),
      stats: ["Gradual Intensity", "Muscle Adaptation", "Injury Prevention"],
      color: "bg-purple-50 border-purple-200 text-purple-700"
    },
    {
      title: "Evidence-Based Remedies",
      description: "Natural home remedies backed by traditional wisdom and modern research, providing safe and effective solutions for common health issues.",
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      ),
      stats: ["Traditional Wisdom", "Research-Backed", "Safe & Natural"],
      color: "bg-emerald-50 border-emerald-200 text-emerald-700"
    },
    {
      title: "Smart Supplementation",
      description: "Supplements complement your diet with essential nutrients, filling nutritional gaps and supporting your fitness goals effectively.",
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
        </svg>
      ),
      stats: ["Nutritional Gaps", "Goal Support", "Quality Assured"],
      color: "bg-amber-50 border-amber-200 text-amber-700"
    }
  ];

  return (
    <section ref={sectionRef} className="py-12 md:py-16 bg-white relative overflow-hidden">
      <div className="container mx-auto px-4 md:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-10 overflow-hidden">
          <div 
            className={`inline-block px-5 py-2 bg-blue-600 text-white text-sm font-semibold mb-6 shadow-sm transform transition-all duration-700 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-full'
            }`}
          >
            Science-Backed Approach
          </div>
          <h2 
            className={`text-4xl md:text-5xl font-bold text-gray-900 mb-6 transform transition-all duration-700 delay-200 ${
              isVisible ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0'
            }`}
          >
            Why Our Plans Work
          </h2>
          <div className="flex justify-center mb-6">
            <div className={`h-1 bg-blue-600 transition-all duration-1000 delay-500 ${isVisible ? 'w-32' : 'w-0'}`}></div>
          </div>
          <p 
            className={`text-lg text-gray-600 transform transition-all duration-700 delay-700 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
          >
            Every feature is designed with scientific principles and proven methodologies
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {sciences.map((science, index) => (
            <div
              key={index}
              className={`bg-white rounded-xl p-8 border-2 ${science.color.split(' ')[1]} hover:shadow-2xl transition-all duration-500 transform ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}
              style={{ transitionDelay: `${index * 150}ms` }}
            >
              {/* Icon */}
              <div className={`w-16 h-16 rounded-lg ${science.color.split(' ')[0]} flex items-center justify-center mb-6 ${science.color.split(' ')[2]} shadow-md`}>
                {science.icon}
              </div>

              {/* Title */}
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                {science.title}
              </h3>

              {/* Description */}
              <p className="text-gray-600 leading-relaxed mb-6">
                {science.description}
              </p>

              {/* Stats Pills */}
              <div className="flex flex-wrap gap-2">
                {science.stats.map((stat, i) => (
                  <span key={i} className={`px-3 py-1 ${science.color.split(' ')[0]} ${science.color.split(' ')[2]} text-sm font-medium border ${science.color.split(' ')[1]}`}>
                    {stat}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
