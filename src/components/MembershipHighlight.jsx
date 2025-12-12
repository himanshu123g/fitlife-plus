import React from 'react';
import { Link } from 'react-router-dom';

export default function MembershipHighlight() {
  const plans = [
    {
      name: 'Free',
      price: '₹0',
      period: 'Forever',
      features: [
        'BMI Calculator',
        'General Diet Overview',
        'Home Remedies Library',
        'Basic Supplements Info'
      ],
      color: 'from-gray-400 to-gray-500',
      buttonStyle: 'bg-gray-600 hover:bg-gray-700',
      popular: false
    },
    {
      name: 'Pro',
      price: '₹199',
      period: 'per month',
      features: [
        'All Free Features',
        'FitBot Assistant',
        'Expert Diet Plans',
        'Priority Support',
        'Supplement Discounts'
      ],
      color: 'from-blue-500 to-cyan-500',
      buttonStyle: 'bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700',
      popular: true
    },
    {
      name: 'Elite',
      price: '₹499',
      period: 'per month',
      features: [
        'All Pro Features',
        '1-to-1 Trainer Calls',
        'Personalized Meal Plans',
        'Exclusive Discounts',
        'Premium Content Access'
      ],
      color: 'from-amber-400 to-yellow-500',
      buttonStyle: 'bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600',
      popular: false
    }
  ];

  return (
    <section className="py-16 md:py-24 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-12 animate-fade-in">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Choose Your Perfect Plan
          </h2>
          <p className="text-lg text-gray-600">
            Unlock premium features and take your fitness journey to the next level
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8 mt-12 max-w-6xl mx-auto">
          {plans.map((plan, index) => (
            <div 
              key={index}
              className={`relative p-8 rounded-3xl bg-white shadow-xl hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-300 animate-slide-in-field-1 ${
                plan.popular ? 'ring-4 ring-blue-500 scale-105' : ''
              }`}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {/* Popular Badge */}
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 px-6 py-2 bg-gradient-to-r from-blue-600 to-cyan-600 text-white text-sm font-bold rounded-full shadow-lg">
                  ⭐ Most Popular
                </div>
              )}
              
              {/* Gradient Header */}
              <div className={`h-2 w-full bg-gradient-to-r ${plan.color} rounded-full mb-6`}></div>
              
              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                <div className="flex items-baseline justify-center gap-2">
                  <span className="text-4xl font-bold text-gray-900">{plan.price}</span>
                  <span className="text-gray-600">/ {plan.period}</span>
                </div>
              </div>
              
              <ul className="space-y-4 mb-8">
                {plan.features.map((feature, idx) => (
                  <li key={idx} className="flex items-start gap-3">
                    <span className="text-green-500 text-xl flex-shrink-0">✓</span>
                    <span className="text-gray-700">{feature}</span>
                  </li>
                ))}
              </ul>
              
              <Link 
                to="/dashboard"
                className={`block w-full py-3 ${plan.buttonStyle} text-white text-center rounded-full font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300`}
              >
                {plan.name === 'Free' ? 'Get Started' : `Choose ${plan.name}`}
              </Link>
            </div>
          ))}
        </div>
        
        <div className="text-center mt-12 animate-fade-in">
          <Link 
            to="/membership" 
            className="inline-block px-8 py-4 bg-white text-blue-600 border-2 border-blue-600 rounded-full font-semibold hover:bg-blue-50 transform hover:scale-105 transition-all duration-300"
          >
            Compare All Plans
          </Link>
        </div>
      </div>
    </section>
  );
}
