import React from 'react';
import { Link } from 'react-router-dom';

export default function Features() {
  const features = [
    {
      icon: '🧮',
      title: 'BMI Calculator',
      description: 'Calculate BMI instantly and get personalized diet plans.',
      isPremium: false,
      color: 'from-green-400 to-emerald-500'
    },
    {
      icon: '💪',
      title: 'Exercise & Diet Plans',
      description: 'Access expert-created workouts and meal plans.',
      isPremium: false,
      color: 'from-blue-400 to-cyan-500'
    },
    {
      icon: '🌿',
      title: 'Home Remedies',
      description: 'Learn natural solutions for common illnesses.',
      isPremium: false,
      color: 'from-green-500 to-teal-500'
    },
    {
      icon: '💬',
      title: 'FitBot Assistant',
      description: 'Chat with AI for quick fitness advice.',
      isPremium: true,
      color: 'from-purple-400 to-pink-500'
    },
    {
      icon: '💊',
      title: 'Supplements Guidance',
      description: 'Discover the best pre & post-workout supplements.',
      isPremium: true,
      color: 'from-orange-400 to-red-500'
    },
    {
      icon: '💎',
      title: 'Membership Plans',
      description: 'Unlock 1-to-1 coaching and premium benefits.',
      isPremium: false,
      color: 'from-yellow-400 to-amber-500'
    }
  ];

  return (
    <section id="features" className="py-16 md:py-24 bg-gradient-to-b from-gray-50 to-white">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-12 animate-fade-in">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Powerful Features for Your Fitness Journey
          </h2>
          <p className="text-lg text-gray-600">
            Everything you need to achieve your health and wellness goals
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mt-12">
          {features.map((feature, index) => (
            <div 
              key={index}
              className={`group relative p-6 rounded-2xl bg-white border-2 ${
                feature.isPremium ? 'border-purple-300 shadow-lg shadow-purple-100' : 'border-gray-200'
              } hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-300 animate-slide-in-field-1 overflow-hidden`}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {/* Premium Badge */}
              {feature.isPremium && (
                <div className="absolute top-3 right-3 px-3 py-1 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs font-bold rounded-full shadow-md">
                  ⭐ Premium
                </div>
              )}
              
              {/* Gradient Bar */}
              <div className={`h-1.5 w-full bg-gradient-to-r ${feature.color} rounded-full mb-4`}></div>
              
              <div className="text-5xl mb-4 transform group-hover:scale-110 transition-transform duration-300">
                {feature.icon}
              </div>
              
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                {feature.title}
              </h3>
              
              <p className="text-gray-600 leading-relaxed mb-4">
                {feature.description}
              </p>
              
              {feature.isPremium && (
                <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-pink-500/5 pointer-events-none"></div>
              )}
            </div>
          ))}
        </div>
        
        <div className="text-center mt-12 animate-fade-in">
          <Link 
            to="/features" 
            className="inline-block px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-full font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
          >
            Explore All Features
          </Link>
        </div>
      </div>
    </section>
  );
}
