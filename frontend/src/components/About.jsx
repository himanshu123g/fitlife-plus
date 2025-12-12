import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';

export default function About() {
  const [isVisible, setIsVisible] = useState(false);
  const [showBMI, setShowBMI] = useState(false);
  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');
  const [bmi, setBmi] = useState(null);
  const [heightUnit, setHeightUnit] = useState('cm'); // 'cm' or 'in'
  const [weightUnit, setWeightUnit] = useState('kg'); // 'kg' or 'lbs'
  const sectionRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.2 }
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

  const calculateBMI = (e) => {
    e.preventDefault();
    if (height && weight) {
      // Convert to metric units
      let heightM;
      if (heightUnit === 'cm') {
        heightM = parseFloat(height) / 100;
      } else {
        // Convert inches to meters (1 inch = 0.0254 meters)
        heightM = parseFloat(height) * 0.0254;
      }

      let weightKg;
      if (weightUnit === 'kg') {
        weightKg = parseFloat(weight);
      } else {
        // Convert lbs to kg (1 lb = 0.453592 kg)
        weightKg = parseFloat(weight) * 0.453592;
      }

      const bmiValue = (weightKg / (heightM * heightM)).toFixed(1);
      setBmi(bmiValue);
    }
  };

  const getBMICategory = (bmiValue) => {
    if (bmiValue < 18.5) return { text: 'Underweight', color: 'text-blue-600', bg: 'bg-blue-50' };
    if (bmiValue < 25) return { text: 'Normal', color: 'text-green-600', bg: 'bg-green-50' };
    if (bmiValue < 30) return { text: 'Overweight', color: 'text-amber-600', bg: 'bg-amber-50' };
    return { text: 'Obese', color: 'text-red-600', bg: 'bg-red-50' };
  };

  const features = [
    { 
      icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>, 
      text: 'Personalized Workouts', 
      bgColor: 'bg-slate-100',
      textColor: 'text-slate-700',
      hoverBg: 'hover:bg-slate-200'
    },
    { 
      icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>, 
      text: 'Smart Diet Plans', 
      bgColor: 'bg-emerald-100',
      textColor: 'text-emerald-700',
      hoverBg: 'hover:bg-emerald-200'
    },
    { 
      icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg>, 
      text: 'Natural Remedies', 
      bgColor: 'bg-teal-100',
      textColor: 'text-teal-700',
      hoverBg: 'hover:bg-teal-200'
    },
    { 
      icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>, 
      text: 'Progress Tracking', 
      bgColor: 'bg-blue-100',
      textColor: 'text-blue-700',
      hoverBg: 'hover:bg-blue-200'
    }
  ];

  return (
    <section ref={sectionRef} className="py-16 md:py-20 bg-gradient-to-b from-white to-gray-50">
      <div className="container mx-auto px-4 md:px-6 lg:px-8">
        <div 
          className={`text-center max-w-3xl mx-auto mb-12 transform transition-all duration-700 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          <h2 className="text-3xl md:text-4xl font-semibold text-gray-900 mb-4">
            Why Choose FitLife+?
          </h2>
          <p className="text-lg text-gray-600 leading-relaxed">
            FitLife+ helps you stay on track with your fitness goals through smart diet tracking, natural wellness tips, and expert-guided workouts — all in one platform.
          </p>
        </div>

        {/* Feature Pills */}
        <div 
          className={`flex flex-wrap justify-center gap-4 mb-12 transform transition-all duration-700 delay-300 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          {features.map((feature, index) => (
            <div
              key={index}
              className={`group px-6 py-3 rounded-full ${feature.bgColor} ${feature.textColor} font-medium shadow-md ${feature.hoverBg} hover:shadow-lg hover:scale-105 transition-all duration-300 cursor-default border border-gray-200`}
              style={{ transitionDelay: `${index * 100}ms` }}
            >
              <span className="inline-block group-hover:scale-110 transition-all duration-300 mr-2">
                {feature.icon}
              </span>
              {feature.text}
            </div>
          ))}
        </div>

        {/* Quick BMI Calculator Card */}
        <div 
          className={`max-w-2xl mx-auto transform transition-all duration-700 delay-500 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
            <div className="bg-gradient-to-r from-blue-600 to-cyan-600 px-6 py-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
                <h3 className="text-xl font-semibold text-white">Quick BMI Calculator</h3>
              </div>
              <button
                onClick={() => setShowBMI(!showBMI)}
                className="text-white hover:scale-110 transition-transform duration-300"
              >
                <svg className={`w-6 h-6 transform transition-transform duration-300 ${showBMI ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
            </div>

            <div className={`transition-all duration-500 overflow-hidden ${showBMI ? 'max-h-[500px]' : 'max-h-0'}`}>
              <div className="p-6">
                {!bmi ? (
                  <form onSubmit={calculateBMI} className="space-y-4">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <label className="block text-sm font-medium text-gray-700">
                            Height
                          </label>
                          <div className="flex gap-1 bg-gray-100 rounded-lg p-1">
                            <button
                              type="button"
                              onClick={() => setHeightUnit('cm')}
                              className={`px-3 py-1 text-xs font-medium rounded transition-all ${heightUnit === 'cm' ? 'bg-blue-600 text-white' : 'text-gray-600 hover:bg-gray-200'}`}
                            >
                              cm
                            </button>
                            <button
                              type="button"
                              onClick={() => setHeightUnit('in')}
                              className={`px-3 py-1 text-xs font-medium rounded transition-all ${heightUnit === 'in' ? 'bg-blue-600 text-white' : 'text-gray-600 hover:bg-gray-200'}`}
                            >
                              in
                            </button>
                          </div>
                        </div>
                        <input
                          type="number"
                          step="0.1"
                          value={height}
                          onChange={(e) => setHeight(e.target.value)}
                          placeholder={heightUnit === 'cm' ? 'e.g., 170' : 'e.g., 67'}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-transparent transition-all duration-300"
                          required
                        />
                      </div>
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <label className="block text-sm font-medium text-gray-700">
                            Weight
                          </label>
                          <div className="flex gap-1 bg-gray-100 rounded-lg p-1">
                            <button
                              type="button"
                              onClick={() => setWeightUnit('kg')}
                              className={`px-3 py-1 text-xs font-medium rounded transition-all ${weightUnit === 'kg' ? 'bg-blue-600 text-white' : 'text-gray-600 hover:bg-gray-200'}`}
                            >
                              kg
                            </button>
                            <button
                              type="button"
                              onClick={() => setWeightUnit('lbs')}
                              className={`px-3 py-1 text-xs font-medium rounded transition-all ${weightUnit === 'lbs' ? 'bg-blue-600 text-white' : 'text-gray-600 hover:bg-gray-200'}`}
                            >
                              lbs
                            </button>
                          </div>
                        </div>
                        <input
                          type="number"
                          step="0.1"
                          value={weight}
                          onChange={(e) => setWeight(e.target.value)}
                          placeholder={weightUnit === 'kg' ? 'e.g., 70' : 'e.g., 154'}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-transparent transition-all duration-300"
                          required
                        />
                      </div>
                    </div>
                    <button
                      type="submit"
                      className="w-full py-3 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-lg font-semibold hover:from-blue-700 hover:to-cyan-700 hover:scale-105 transition-all duration-300 shadow-md hover:shadow-lg"
                    >
                      Calculate BMI
                    </button>
                  </form>
                ) : (
                  <div className="space-y-4 animate-fade-in">
                    <div className={`text-center p-6 rounded-xl ${getBMICategory(parseFloat(bmi)).bg}`}>
                      <div className="text-5xl font-bold text-gray-900 mb-2">{bmi}</div>
                      <div className={`text-xl font-semibold ${getBMICategory(parseFloat(bmi)).color}`}>
                        {getBMICategory(parseFloat(bmi)).text}
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <button
                        onClick={() => {
                          setBmi(null);
                          setHeight('');
                          setWeight('');
                        }}
                        className="flex-1 py-3 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 hover:scale-105 transition-all duration-300"
                      >
                        Calculate Again
                      </button>
                      <Link
                        to="/dashboard"
                        className="flex-1 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-lg font-medium hover:from-blue-700 hover:to-cyan-700 hover:scale-105 transition-all duration-300 text-center"
                      >
                        View Dashboard
                      </Link>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {!showBMI && (
              <div className="px-6 pb-4 pt-2">
                <p className="text-center text-gray-600 text-sm">
                  Click the arrow above to calculate your BMI instantly
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
