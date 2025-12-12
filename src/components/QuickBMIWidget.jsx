import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function QuickBMIWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');
  const [heightUnit, setHeightUnit] = useState('cm');
  const [feet, setFeet] = useState('');
  const [inches, setInches] = useState('');
  const [bmi, setBmi] = useState(null);
  const [heightError, setHeightError] = useState('');
  const navigate = useNavigate();

  const calculateBMI = (e) => {
    e.preventDefault();
    setHeightError('');
    
    let heightCm;
    
    if (heightUnit === 'cm') {
      heightCm = parseFloat(height);
    } else {
      // Validate feet and inches
      const feetNum = parseFloat(feet);
      const inchesNum = parseFloat(inches);
      
      if (!feet || feetNum < 1 || feetNum > 8) {
        setHeightError('Feet must be between 1 and 8');
        return;
      }
      if (inches && (inchesNum < 0 || inchesNum > 11)) {
        setHeightError('Inches must be between 0 and 11');
        return;
      }
      
      // Convert feet and inches to cm
      heightCm = (feetNum * 30.48) + ((inchesNum || 0) * 2.54);
    }
    
    if (heightCm && weight) {
      const heightM = heightCm / 100;
      const weightKg = parseFloat(weight);
      const bmiValue = (weightKg / (heightM * heightM)).toFixed(1);
      setBmi({ value: bmiValue, heightCm: heightCm.toFixed(1) });
    }
  };

  const getBMICategory = (bmiValue) => {
    const bmi = typeof bmiValue === 'object' ? parseFloat(bmiValue.value) : parseFloat(bmiValue);
    if (bmi < 18.5) return { text: 'Underweight', color: 'text-blue-600' };
    if (bmi < 25) return { text: 'Normal', color: 'text-green-600' };
    if (bmi < 30) return { text: 'Overweight', color: 'text-amber-600' };
    return { text: 'Obese', color: 'text-red-600' };
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-24 right-4 z-40 px-4 py-3 bg-green-600 text-white rounded-lg shadow-lg hover:shadow-xl hover:bg-green-700 hover:scale-110 transition-all duration-300 flex items-center gap-2 font-medium animate-bounce"
        aria-label="Quick BMI Calculator"
        style={{ animationDuration: '2s' }}
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
        </svg>
        <span className="hidden sm:inline">Quick BMI</span>
      </button>
    );
  }

  return (
    <div className="fixed bottom-24 right-4 z-40 w-80 bg-white rounded-xl shadow-2xl border border-gray-200 animate-scale-in">
      <div className="bg-green-600 text-white px-4 py-3 rounded-t-xl flex justify-between items-center">
        <div className="flex items-center gap-2">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
          </svg>
          <span className="font-medium">Quick BMI Calculator</span>
        </div>
        <button
          onClick={() => {
            setIsOpen(false);
            setBmi(null);
            setHeight('');
            setWeight('');
            setFeet('');
            setInches('');
            setHeightError('');
          }}
          className="text-white hover:text-gray-200 transition-colors"
          aria-label="Close"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <div className="p-4">
        {!bmi ? (
          <form onSubmit={calculateBMI} className="space-y-3">
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-medium text-gray-700">
                  Height
                </label>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setHeightUnit('cm')}
                    className={`px-3 py-1 text-xs font-medium rounded-md transition-all ${
                      heightUnit === 'cm'
                        ? 'bg-green-600 text-white'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    cm
                  </button>
                  <button
                    type="button"
                    onClick={() => setHeightUnit('ft')}
                    className={`px-3 py-1 text-xs font-medium rounded-md transition-all ${
                      heightUnit === 'ft'
                        ? 'bg-green-600 text-white'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    ft/in
                  </button>
                </div>
              </div>
              
              {heightUnit === 'cm' ? (
                <input
                  type="number"
                  step="0.1"
                  value={height}
                  onChange={(e) => setHeight(e.target.value)}
                  placeholder="e.g., 170"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  required
                />
              ) : (
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <input
                      type="number"
                      value={feet}
                      onChange={(e) => setFeet(e.target.value)}
                      placeholder="Feet"
                      min="1"
                      max="8"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      required
                    />
                    <span className="text-xs text-gray-500 mt-1 block">Feet (1-8)</span>
                  </div>
                  <div>
                    <input
                      type="number"
                      value={inches}
                      onChange={(e) => setInches(e.target.value)}
                      placeholder="Inches"
                      min="0"
                      max="11"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                    <span className="text-xs text-gray-500 mt-1 block">Inches (0-11)</span>
                  </div>
                </div>
              )}
              
              {heightError && (
                <p className="text-xs text-red-600 mt-1">{heightError}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Weight (kg)
              </label>
              <input
                type="number"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                placeholder="e.g., 70"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full py-2.5 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 hover:scale-105 transition-all duration-300"
            >
              Calculate BMI
            </button>
          </form>
        ) : (
          <div className="space-y-4">
            <div className="text-center">
              <div className="text-4xl font-semibold text-gray-900 mb-2">{bmi.value}</div>
              <div className={`text-lg font-medium ${getBMICategory(bmi).color}`}>
                {getBMICategory(bmi).text}
              </div>
              {heightUnit === 'ft' && (
                <div className="mt-3 text-xs text-gray-600 bg-gray-50 px-3 py-2 rounded-lg">
                  Your height: {feet} ft {inches || 0} in ({bmi.heightCm} cm)
                </div>
              )}
            </div>
            <div className="space-y-2">
              <button
                onClick={() => {
                  setBmi(null);
                  setHeight('');
                  setWeight('');
                  setFeet('');
                  setInches('');
                  setHeightError('');
                }}
                className="w-full py-2.5 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 hover:scale-105 transition-all duration-300"
              >
                Calculate Again
              </button>
              <button
                onClick={() => navigate('/dashboard')}
                className="w-full py-2.5 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 hover:scale-105 transition-all duration-300"
              >
                View Full Dashboard
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
