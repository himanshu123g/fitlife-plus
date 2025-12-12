import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';

export default function TrainerHighlights() {
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

  const trainers = [
    {
      name: "Harpreet Singh",
      image: "/trainers/Harpreet Singh.jpeg",
      specialization: "Strength & Conditioning",
      experience: "8+ years",
      expertise: ["Weight Training", "Muscle Building", "Form Correction"]
    },
    {
      name: "Ahsaas Sharma",
      image: "/trainers/ahsaas Sharma.jpeg",
      specialization: "Yoga & Flexibility",
      experience: "10+ years",
      expertise: ["Hatha Yoga", "Meditation", "Stress Relief"]
    },
    {
      name: "Prem Sahni",
      image: "/trainers/Prem Sahni.jpeg",
      specialization: "Fitness & Nutrition",
      experience: "7+ years",
      expertise: ["Diet Planning", "Weight Management", "Lifestyle Coaching"]
    }
  ];

  return (
    <section ref={sectionRef} className="py-12 md:py-16 bg-gray-50 relative overflow-hidden">


      <div className="container mx-auto px-4 md:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-10 overflow-hidden">
          <div 
            className={`inline-block px-5 py-2 bg-indigo-600 text-white text-sm font-semibold mb-6 shadow-sm transform transition-all duration-700 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-full'
            }`}
          >
            Elite Feature
          </div>
          <h2 
            className={`text-4xl md:text-5xl font-bold text-gray-900 mb-6 transform transition-all duration-700 delay-200 ${
              isVisible ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0'
            }`}
          >
            Meet Your Personal Trainers
          </h2>
          <div className="flex justify-center mb-6">
            <div className={`h-1 bg-indigo-600 transition-all duration-1000 delay-500 ${isVisible ? 'w-32' : 'w-0'}`}></div>
          </div>
          <p 
            className={`text-lg text-gray-600 transform transition-all duration-700 delay-700 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
          >
            Get 1-on-1 HD video coaching from certified fitness experts
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {trainers.map((trainer, index) => (
            <div
              key={index}
              className={`relative bg-white rounded-xl p-6 border-2 border-gray-100 hover:border-purple-300 hover:shadow-2xl transition-all duration-500 transform ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}
              style={{ transitionDelay: `${index * 150}ms` }}
            >
              {/* Trainer Image */}
              <div className="relative mb-6">
                <div className="w-32 h-32 mx-auto rounded-full overflow-hidden border-4 border-indigo-100 shadow-lg">
                  <img 
                    src={trainer.image} 
                    alt={trainer.name}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>

              {/* Trainer Info */}
              <h3 className="text-xl font-bold text-gray-900 text-center mb-2">
                {trainer.name}
              </h3>
              <p className="text-purple-600 font-semibold text-center mb-2">
                {trainer.specialization}
              </p>
              <p className="text-sm text-gray-600 text-center mb-4">
                {trainer.experience} Experience
              </p>

              {/* Expertise Tags */}
              <div className="flex flex-wrap gap-2 justify-center mb-4">
                {trainer.expertise.map((skill, i) => (
                  <span key={i} className="px-2 py-1 bg-purple-50 text-purple-700 text-xs font-medium border border-purple-200">
                    {skill}
                  </span>
                ))}
              </div>

              {/* Unlock Badge */}
              <div className="bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 p-3 text-center">
                <p className="text-sm font-semibold text-purple-700">
                  Elite Members Only
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div 
          className={`text-center mt-12 transform transition-all duration-700 delay-700 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          <div className="bg-gradient-to-r from-purple-50 to-pink-50 border-2 border-purple-200 rounded-xl p-8 max-w-2xl mx-auto">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Unlock Personal Coaching
            </h3>
            <p className="text-gray-600 mb-6">
              Upgrade to Elite membership for live HD video sessions with certified trainers
            </p>
            <Link
              to="/membership"
              className="inline-flex items-center gap-2 px-8 py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold shadow-md hover:shadow-xl transform hover:scale-105 transition-all duration-300"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
              </svg>
              <span>Upgrade to Elite</span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
