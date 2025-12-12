import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import API from '../api';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Legend } from 'recharts';
import { getDietPlan } from '../data/dietPlans';

export default function Dashboard() {
  const [user, setUser] = useState(() => {
    try { return JSON.parse(localStorage.getItem('user') || '{}'); } catch { return {}; }
  });
  const [isVisible, setIsVisible] = useState(false);
  const [animateCharts, setAnimateCharts] = useState(false);
  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');
  const [heightUnit, setHeightUnit] = useState('cm');
  const [weightUnit, setWeightUnit] = useState('kg');
  const [feet, setFeet] = useState('');
  const [inches, setInches] = useState('');
  const [age, setAge] = useState(user?.age || '');
  const [gender, setGender] = useState(user?.gender || 'male');
  const [result, setResult] = useState(null);
  const [heightError, setHeightError] = useState('');
  const [history, setHistory] = useState([]);
  const [remedies, setRemedies] = useState([]);
  const [supplements, setSupplements] = useState([]);
  const [showLoginSuccess, setShowLoginSuccess] = useState(false);
  const [isNewUser, setIsNewUser] = useState(false);
  const [localDietPreference, setLocalDietPreference] = useState(user?.dietPreference || 'non-vegetarian');
  const [timeRange, setTimeRange] = useState(() => {
    return localStorage.getItem('dashboardTimeRange') || '1week';
  });

  useEffect(() => {
    loadHistory(); loadRemedies(); loadSupplements();
    setTimeout(() => setIsVisible(true), 100);
    // Trigger chart animations after containers are visible
    setTimeout(() => setAnimateCharts(true), 800);
    
    // Reload user data from localStorage on mount to ensure latest data
    try {
      const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
      setUser(currentUser);
      setLocalDietPreference(currentUser?.dietPreference || 'non-vegetarian');
    } catch (err) {
      console.error('Error loading user:', err);
    }
    
    // Check if user just signed up
    if (localStorage.getItem('justSignedUp') === 'true') {
      setIsNewUser(true);
      localStorage.removeItem('justSignedUp');
    }
    
    // Check for successful login
    if (localStorage.getItem('loginSuccess') === 'true') {
      setShowLoginSuccess(true);
      localStorage.removeItem('loginSuccess');
      setTimeout(() => setShowLoginSuccess(false), 4000);
    }
    
    // Listen for user updates from other sources (e.g., Profile page)
    const handleUserUpdate = () => {
      try {
        const updatedUser = JSON.parse(localStorage.getItem('user') || '{}');
        setUser(prevUser => {
          // Only update if user data actually changed
          if (JSON.stringify(prevUser) !== JSON.stringify(updatedUser)) {
            return updatedUser;
          }
          return prevUser;
        });
        
        // Update diet preference from localStorage
        const newPref = updatedUser?.dietPreference || 'non-vegetarian';
        setLocalDietPreference(newPref);
      } catch (err) {
        console.error('Error updating user:', err);
      }
    };
    
    window.addEventListener('user-updated', handleUserUpdate);
    
    return () => {
      window.removeEventListener('user-updated', handleUserUpdate);
    };
  }, []);



  const chartData = useMemo(() => {
    // Filter history based on selected time range
    const now = new Date();
    const filtered = (history || []).filter(h => {
      const entryDate = new Date(h.date);
      const daysDiff = Math.floor((now - entryDate) / (1000 * 60 * 60 * 24));
      
      switch(timeRange) {
        case '1week': return daysDiff <= 7;
        case '1month': return daysDiff <= 30;
        case '3months': return daysDiff <= 90;
        case '6months': return daysDiff <= 180;
        case '1year': return daysDiff <= 365;
        case 'all': return true;
        default: return daysDiff <= 7;
      }
    });
    
    return filtered.map(h => ({
      date: new Date(h.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      bmi: Number(h.bmi),
      calories: Number(h.caloriesPerDay)
    }));
  }, [history, timeRange]);

  // BMI Category Distribution
  const bmiDistribution = useMemo(() => {
    const categories = { Underweight: 0, Normal: 0, Overweight: 0, Obese: 0 };
    history.forEach(h => {
      const cat = h.category || 'Normal';
      if (categories[cat] !== undefined) categories[cat]++;
    });
    return Object.entries(categories).map(([name, value]) => ({ name, value })).filter(d => d.value > 0);
  }, [history]);

  // Mock workout data
  const workoutData = [
    { day: 'Mon', minutes: 30 },
    { day: 'Tue', minutes: 45 },
    { day: 'Wed', minutes: 20 },
    { day: 'Thu', minutes: 60 },
    { day: 'Fri', minutes: 40 },
    { day: 'Sat', minutes: 55 },
    { day: 'Sun', minutes: 25 }
  ];

  // Mock nutrient data
  const nutrientData = [
    { nutrient: 'Protein', value: 25 },
    { nutrient: 'Carbs', value: 50 },
    { nutrient: 'Fats', value: 20 },
    { nutrient: 'Fiber', value: 15 }
  ];

  const loadHistory = async () => {
    try { const res = await API.get('/bmi/history'); setHistory(res.data.history || []); } catch (e) {}
  };
  const loadRemedies = async () => {
    try { const res = await API.get('/remedies'); setRemedies(res.data.remedies || []); } catch (e) {}
  };
  const loadSupplements = async () => {
    try { const res = await API.get('/supplements'); setSupplements(res.data || []); } catch (e) {}
  };

  const calc = async (e) => {
    e.preventDefault();
    setHeightError('');
    
    try {
      // Convert to metric units for API
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

      let weightKg;
      if (weightUnit === 'kg') {
        weightKg = parseFloat(weight);
      } else {
        // Convert lbs to kg (1 lb = 0.453592 kg)
        weightKg = parseFloat(weight) * 0.453592;
      }

      const res = await API.post('/bmi/calc', { heightCm, weightKg, age: +age, gender });
      setResult({ ...res.data, heightCm: heightCm.toFixed(1) });
      await loadHistory();
      setHeight('');
      setWeight('');
      setFeet('');
      setInches('');
    } catch (err) {
      alert(err.response?.data?.message || 'Error');
    }
  };

  const latestBMI = history.length > 0 ? history[history.length - 1] : null;
  const dailyCalorieNeed = latestBMI ? latestBMI.caloriesPerDay : 2000;
  const dietPlan = latestBMI ? getDietPlan(latestBMI.category, localDietPreference) : null;

  // Calculate days remaining for membership
  const calculateDaysRemaining = () => {
    if (!user?.membership?.validTill) return null;
    const validTill = new Date(user.membership.validTill);
    const now = new Date();
    const diffTime = validTill - now;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 0;
  };

  const daysRemaining = calculateDaysRemaining();
  const membershipPlan = user?.membership?.plan || 'free';
  const membershipDisplay = membershipPlan === 'free' 
    ? 'Free' 
    : `${membershipPlan.charAt(0).toUpperCase() + membershipPlan.slice(1)}${daysRemaining !== null ? ` (${daysRemaining}d left)` : ''}`;

  const handleDietPreferenceChange = async (newPreference) => {
    // Optimistically update UI immediately
    setLocalDietPreference(newPreference);
    
    try {
      const payload = { dietPreference: newPreference };
      const res = await API.put('/user/me', payload);
      const updated = res.data.user || {};
      
      // Update local state
      setUser(updated);
      
      // Update localStorage
      localStorage.setItem('user', JSON.stringify(updated));
      
      // Don't trigger global event here to avoid race condition
      // The local state is already updated
    } catch (e) {
      console.error('Failed to update dietary preference:', e);
      // Revert on error
      setLocalDietPreference(user?.dietPreference || 'non-vegetarian');
      alert('Failed to update diet preference. Please try again.');
    }
  };

  const COLORS = ['#93C5FD', '#4ADE80', '#FACC15', '#F87171'];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-6">

      {/* Login Success Notification */}
      {showLoginSuccess && (
        <div className="fixed top-4 right-4 z-50 animate-slide-in-field-1">
          <div className="bg-green-50 border-l-4 border-green-500 text-green-800 px-6 py-4 rounded-lg shadow-lg flex items-center gap-3">
            <svg className="w-6 h-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="font-medium">Welcome back! Login successful.</span>
          </div>
        </div>
      )}

      <div className="container mx-auto px-4">
        {/* Welcome Header */}
        <div className={`mb-8 transform transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-600 to-blue-700 text-white flex items-center justify-center font-bold text-lg shadow-md">
              {user?.name?.charAt(0)?.toUpperCase() || 'U'}
            </div>
            <div>
              {isNewUser ? (
                <>
                  <h1 className="text-3xl font-bold text-gray-900">
                    Welcome to FitLife+, {user?.name || 'User'}!
                  </h1>
                  <p className="text-gray-600">Let's get started with your fitness journey</p>
                </>
              ) : (
                <>
                  <h1 className="text-3xl font-bold text-gray-900">
                    Welcome back, {user?.name || 'User'}
                  </h1>
                  <p className="text-gray-600">Here's your health summary and progress overview</p>
                </>
              )}
            </div>
          </div>
        </div>

        {/* New User Welcome Card */}
        {isNewUser && (
          <div className={`bg-gradient-to-r from-blue-50 to-cyan-50 border-l-4 border-blue-500 rounded-xl p-6 mb-8 transform transition-all duration-700 delay-200 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">Get Started with Your Health Journey!</h3>
                <p className="text-gray-700 mb-3">
                  Start by calculating your BMI below to get personalized health recommendations and track your progress over time.
                </p>
                <div className="flex flex-wrap gap-2">
                  <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">Calculate BMI</span>
                  <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">Track Progress</span>
                  <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">Get Insights</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Health Insights Cards */}
        <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8 transform transition-all duration-700 delay-200 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <InsightCard
            icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" /></svg>}
            label="BMI Category"
            value={latestBMI?.category || 'Not calculated'}
            color="bg-blue-100 text-blue-700"
          />
          <InsightCard
            icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.879 16.121A3 3 0 1012.015 11L11 14H9c0 .768.293 1.536.879 2.121z" /></svg>}
            label="Daily Calorie Need"
            value={`${dailyCalorieNeed} kcal`}
            color="bg-orange-100 text-orange-700"
          />
          <InsightCard
            icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
            label="Last Update"
            value={latestBMI ? new Date(latestBMI.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : 'Never'}
            color="bg-purple-100 text-purple-700"
          />
          <InsightCard
            icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" /></svg>}
            label="Membership Level"
            value={membershipDisplay}
            color={daysRemaining !== null && daysRemaining <= 7 ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'}
          />
        </div>

        {/* Quick Actions */}
        <div className={`bg-white rounded-2xl shadow-lg p-6 mb-8 border border-gray-200 transform transition-all duration-700 delay-250 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            Quick Actions
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <Link
              to="/order-history"
              className="flex items-center gap-3 p-4 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl hover:from-blue-100 hover:to-cyan-100 transition-all duration-300 border-2 border-blue-200 hover:border-blue-400 group"
            >
              <div className="w-12 h-12 rounded-lg bg-blue-600 text-white flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Order History</h3>
                <p className="text-sm text-gray-600">View your orders</p>
              </div>
            </Link>
            <Link
              to="/shop"
              className="flex items-center gap-3 p-4 bg-gradient-to-r from-orange-50 to-amber-50 rounded-xl hover:from-orange-100 hover:to-amber-100 transition-all duration-300 border-2 border-orange-200 hover:border-orange-400 group"
            >
              <div className="w-12 h-12 rounded-lg bg-orange-600 text-white flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Shop Supplements</h3>
                <p className="text-sm text-gray-600">Browse products</p>
              </div>
            </Link>
            <Link
              to="/remedies"
              className="flex items-center gap-3 p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl hover:from-green-100 hover:to-emerald-100 transition-all duration-300 border-2 border-green-200 hover:border-green-400 group"
            >
              <div className="w-12 h-12 rounded-lg bg-green-600 text-white flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Home Remedies</h3>
                <p className="text-sm text-gray-600">Natural solutions</p>
              </div>
            </Link>
          </div>
        </div>

        {/* BMI Calculator */}
        <div className={`bg-white rounded-2xl shadow-lg p-6 mb-8 border border-gray-200 transform transition-all duration-700 delay-300 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <svg className="w-7 h-7 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
            </svg>
            BMI Calculator
          </h2>
          
          {!result ? (
            <form onSubmit={calc} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-sm font-medium text-gray-700">Height</label>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => setHeightUnit('cm')}
                        className={`px-3 py-1 text-xs font-medium rounded-md transition-all ${
                          heightUnit === 'cm'
                            ? 'bg-blue-600 text-white'
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
                            ? 'bg-blue-600 text-white'
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
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      required
                    />
                  ) : (
                    <div className="space-y-2">
                      <div className="grid grid-cols-2 gap-2">
                        <input
                          type="number"
                          value={feet}
                          onChange={(e) => setFeet(e.target.value)}
                          placeholder="Feet"
                          min="1"
                          max="8"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                          required
                        />
                        <input
                          type="number"
                          value={inches}
                          onChange={(e) => setInches(e.target.value)}
                          placeholder="Inches"
                          min="0"
                          max="11"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-xs text-gray-500">
                        <span>Feet (1-8)</span>
                        <span>Inches (0-11)</span>
                      </div>
                    </div>
                  )}
                  
                  {heightError && (
                    <p className="text-xs text-red-600 mt-1">{heightError}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Weight (kg)</label>
                  <input
                    type="number"
                    value={weight}
                    onChange={(e) => setWeight(e.target.value)}
                    placeholder="e.g., 70"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Age</label>
                  <input
                    type="number"
                    value={age}
                    onChange={(e) => setAge(e.target.value)}
                    placeholder="e.g., 25"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Gender</label>
                  <select
                    value={gender}
                    onChange={(e) => setGender(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  >
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                  </select>
                </div>
              </div>
              <button
                type="submit"
                className="w-full md:w-auto px-8 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg font-semibold hover:from-blue-700 hover:to-blue-800 hover:scale-105 transition-all duration-300 shadow-md hover:shadow-lg"
              >
                Calculate & Save
              </button>
            </form>
          ) : (
            <div className="space-y-4 animate-fade-in">
              <div className={`p-6 rounded-xl ${getBMIColor(result.bmi).bg} border-2 ${getBMIColor(result.bmi).border}`}>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm font-medium text-gray-600 mb-1">Your BMI</div>
                    <div className="text-4xl font-bold text-gray-900">{result.bmi}</div>
                  </div>
                  <div className={`px-4 py-2 rounded-full ${getBMIColor(result.bmi).badge} font-semibold`}>
                    {result.category}
                  </div>
                </div>
                <div className="mt-4 text-sm text-gray-700">
                  Daily Calorie Need: <span className="font-semibold">{result.caloriesPerDay} kcal</span>
                </div>
                {heightUnit === 'ft' && result.heightCm && (
                  <div className="mt-3 text-xs text-gray-600 bg-white/50 px-3 py-2 rounded-lg">
                    Your height: {feet} ft {inches || 0} in ({result.heightCm} cm)
                  </div>
                )}
              </div>
              <button
                onClick={() => {
                  setResult(null);
                  setHeightError('');
                }}
                className="px-6 py-2.5 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-all duration-300"
              >
                Calculate Again
              </button>
            </div>
          )}
        </div>


        {/* Charts Section */}
        {chartData.length > 0 && (
          <>
            {/* Time Range Selector */}
            <div className={`bg-white rounded-xl shadow-md p-4 mb-6 border border-gray-200 transform transition-all duration-700 delay-300 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
              <div className="flex items-center justify-between flex-wrap gap-4">
                <h3 className="text-lg font-semibold text-gray-900">Progress History</h3>
                <div className="flex gap-2 flex-wrap">
                  {[
                    { value: '1week', label: '1 Week' },
                    { value: '1month', label: '1 Month' },
                    { value: '3months', label: '3 Months' },
                    { value: '6months', label: '6 Months' },
                    { value: '1year', label: '1 Year' },
                    { value: 'all', label: 'All Time' }
                  ].map(range => (
                    <button
                      key={range.value}
                      onClick={() => {
                        setTimeRange(range.value);
                        localStorage.setItem('dashboardTimeRange', range.value);
                      }}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                        timeRange === range.value
                          ? 'bg-blue-600 text-white shadow-md'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {range.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* BMI Progress Chart */}
            <div className={`bg-white rounded-2xl shadow-lg p-6 border border-gray-200 transform transition-all duration-700 delay-400 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
              <h3 className="text-lg font-bold text-gray-900 mb-4">BMI Progress</h3>
              <ResponsiveContainer width="100%" height={250}>
                <AreaChart data={chartData} key={animateCharts ? 'animated-bmi' : 'static-bmi'}>
                  <defs>
                    <linearGradient id="colorBMI" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                  <XAxis dataKey="date" stroke="#6B7280" style={{ fontSize: '12px' }} />
                  <YAxis stroke="#6B7280" style={{ fontSize: '12px' }} />
                  <Tooltip contentStyle={{ backgroundColor: '#fff', border: '1px solid #E5E7EB', borderRadius: '8px' }} />
                  <Area 
                    type="monotone" 
                    dataKey="bmi" 
                    stroke="#3B82F6" 
                    strokeWidth={2} 
                    fillOpacity={1} 
                    fill="url(#colorBMI)"
                    isAnimationActive={animateCharts}
                    animationBegin={0}
                    animationDuration={1500}
                    animationEasing="ease-in-out"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            {/* Daily Calorie Chart */}
            <div className={`bg-white rounded-2xl shadow-lg p-6 border border-gray-200 transform transition-all duration-700 delay-500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
              <h3 className="text-lg font-bold text-gray-900 mb-4">Daily Calorie Need</h3>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={chartData} key={animateCharts ? 'animated-bar' : 'static-bar'}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                  <XAxis dataKey="date" stroke="#6B7280" style={{ fontSize: '12px' }} />
                  <YAxis stroke="#6B7280" style={{ fontSize: '12px' }} label={{ value: 'Calories/day', angle: -90, position: 'insideLeft', style: { fontSize: '12px', fill: '#6B7280' } }} />
                  <Tooltip contentStyle={{ backgroundColor: '#fff', border: '1px solid #E5E7EB', borderRadius: '8px' }} />
                  <Bar 
                    dataKey="calories" 
                    fill="#F59E0B" 
                    radius={[8, 8, 0, 0]}
                    isAnimationActive={animateCharts}
                    animationBegin={100}
                    animationDuration={1500}
                    animationEasing="ease-in-out"
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* BMI Distribution Pie Chart */}
            {bmiDistribution.length > 0 && (
              <div className={`bg-white rounded-2xl shadow-lg p-6 border border-gray-200 transform transition-all duration-700 delay-600 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
                <h3 className="text-lg font-bold text-gray-900 mb-4">Your BMI Distribution</h3>
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart key={animateCharts ? 'animated-pie' : 'static-pie'}>
                    <Pie
                      data={bmiDistribution}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      isAnimationActive={animateCharts}
                      animationBegin={200}
                      animationDuration={1500}
                      animationEasing="ease-in-out"
                    >
                      {bmiDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            )}

            {/* Weekly Workout Chart */}
            <div className={`bg-white rounded-2xl shadow-lg p-6 border border-gray-200 transform transition-all duration-700 delay-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
              <h3 className="text-lg font-bold text-gray-900 mb-4">Weekly Workout Duration</h3>
              <ResponsiveContainer width="100%" height={250}>
                <AreaChart data={workoutData} key={animateCharts ? 'animated-workout' : 'static-workout'}>
                  <defs>
                    <linearGradient id="colorWorkout" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10B981" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                  <XAxis dataKey="day" stroke="#6B7280" style={{ fontSize: '12px' }} />
                  <YAxis stroke="#6B7280" style={{ fontSize: '12px' }} label={{ value: 'Minutes', angle: -90, position: 'insideLeft', style: { fontSize: '12px', fill: '#6B7280' } }} />
                  <Tooltip contentStyle={{ backgroundColor: '#fff', border: '1px solid #E5E7EB', borderRadius: '8px' }} />
                  <Area 
                    type="monotone" 
                    dataKey="minutes" 
                    stroke="#10B981" 
                    strokeWidth={2} 
                    fillOpacity={1} 
                    fill="url(#colorWorkout)"
                    isAnimationActive={animateCharts}
                    animationBegin={300}
                    animationDuration={1500}
                    animationEasing="ease-in-out"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
          </>
        )}

        {/* Diet Plan Recommendations */}
        {dietPlan && (
          <div className={`bg-white rounded-2xl shadow-lg p-6 mb-8 border border-gray-200 transform transition-all duration-700 delay-800 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
              <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                <svg className="w-7 h-7 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                Personalized Diet Plan
              </h2>
              
              {/* Diet Type Toggle Buttons */}
              <div className="flex items-center gap-2 bg-gray-100 p-1 rounded-lg">
                <button
                  onClick={() => handleDietPreferenceChange('vegetarian')}
                  className={`flex items-center gap-2 px-4 py-2 rounded-md font-medium transition-all duration-300 ${
                    localDietPreference === 'vegetarian'
                      ? 'bg-emerald-600 text-white shadow-md'
                      : 'bg-transparent text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                  </svg>
                  <span className="text-sm">Veg</span>
                </button>
                <button
                  onClick={() => handleDietPreferenceChange('non-vegetarian')}
                  className={`flex items-center gap-2 px-4 py-2 rounded-md font-medium transition-all duration-300 ${
                    localDietPreference === 'non-vegetarian'
                      ? 'bg-orange-600 text-white shadow-md'
                      : 'bg-transparent text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                  <span className="text-sm">Non-Veg</span>
                </button>
              </div>
            </div>
            
            <p className="text-sm text-gray-600 mb-6">
              This plan is tailored for your <span className="font-semibold">{localDietPreference === 'vegetarian' ? 'Vegetarian' : 'Non-Vegetarian'}</span> preference and <span className="font-semibold">{latestBMI?.category}</span> BMI category.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {dietPlan.map((meal, index) => (
                <div key={index} className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-xl p-5 border border-emerald-200 hover:shadow-lg hover:scale-105 transition-all duration-300">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center">
                      <svg className="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <h3 className="font-bold text-gray-900">{meal.meal}</h3>
                  </div>
                  <ul className="space-y-2">
                    {meal.items.map((item, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-sm text-gray-700">
                        <svg className="w-4 h-4 text-emerald-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* BMI History */}
        {history.length > 0 && (
          <div className={`bg-white rounded-2xl shadow-lg p-6 mb-8 border border-gray-200 transform transition-all duration-700 delay-900 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Recent BMI History</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {history.slice(-6).reverse().map((h, i) => (
                <div key={i} className="p-4 bg-gray-50 rounded-xl border border-gray-200 hover:shadow-md hover:scale-105 transition-all duration-300">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      {new Date(h.date).toLocaleDateString()}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600 flex items-center gap-2">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
                        </svg>
                        BMI
                      </span>
                      <span className="font-bold text-gray-900">{h.bmi}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600 flex items-center gap-2">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" />
                        </svg>
                        Calories
                      </span>
                      <span className="font-bold text-gray-900">{h.caloriesPerDay}</span>
                    </div>
                    <div className={`mt-2 px-3 py-1 rounded-full text-xs font-semibold text-center ${getBMIColor(h.bmi).badge}`}>
                      {h.category}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}


        {/* Home Remedies Preview */}
        {remedies.length > 0 && (
          <div className={`bg-white rounded-2xl shadow-lg p-8 mb-8 border border-gray-200 transform transition-all duration-700 delay-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Natural Home Remedies</h2>
              <div className="relative">
                <div className={`h-1 bg-gradient-to-r from-teal-500 to-emerald-500 rounded-full transition-all duration-1000 delay-1200 ${isVisible ? 'w-24' : 'w-0'}`}></div>
              </div>
              <p className="text-gray-600 mt-3">Discover natural solutions for common health concerns</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mb-6">
              {remedies.slice(0, 6).map((r, i) => (
                <div key={i} className="group p-6 bg-gradient-to-br from-teal-50 via-emerald-50 to-cyan-50 rounded-xl border-2 border-teal-100 hover:border-teal-300 hover:shadow-xl transition-all duration-300 cursor-pointer">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-teal-500 to-emerald-500 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300 shadow-md">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-gray-900 mb-2 text-lg group-hover:text-teal-600 transition-colors">{r.title || r.issue}</h3>
                      <p className="text-sm text-gray-700 leading-relaxed line-clamp-3">
                        {r.remedies ? r.remedies.join(', ') : r.remedy}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="text-center pt-4 border-t border-gray-200">
              <Link 
                to="/remedies" 
                className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-teal-500 to-emerald-500 text-white font-semibold rounded-xl hover:from-teal-600 hover:to-emerald-600 transform hover:scale-105 transition-all duration-300 shadow-md hover:shadow-lg"
              >
                <span>View All Remedies</span>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Link>
            </div>
          </div>
        )}

        {/* Supplements */}
        {supplements.length > 0 && (
          <div className={`bg-white rounded-2xl shadow-lg p-6 border border-gray-200 transform transition-all duration-700 delay-1100 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Recommended Supplements</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {supplements.map((s, i) => (
                <div key={i} className="bg-white rounded-xl border-2 border-gray-200 overflow-hidden hover:shadow-xl hover:scale-105 transition-all duration-300">
                  {s.imageUrl && (
                    <div className="h-48 bg-gray-100 overflow-hidden">
                      <img src={s.imageUrl} alt={s.name} className="w-full h-full object-cover" />
                    </div>
                  )}
                  <div className="p-5">
                    <h3 className="font-bold text-gray-900 mb-2">{s.name}</h3>
                    <p className="text-sm text-gray-600 mb-1">Brand: {s.brand}</p>
                    <p className="text-sm text-gray-600 mb-4">Type: {s.type}</p>
                    {s.buyLink && (
                      <a
                        href={s.buyLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block w-full py-2.5 bg-blue-600 text-white text-center rounded-lg font-medium hover:bg-blue-700 transition-all duration-300"
                      >
                        Buy Now
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// Helper Components
function InsightCard({ icon, label, value, color }) {
  return (
    <div className="bg-white rounded-xl p-5 shadow-md border border-gray-200 hover:shadow-lg hover:scale-105 transition-all duration-300">
      <div className={`w-12 h-12 rounded-lg ${color} flex items-center justify-center mb-3`}>
        {icon}
      </div>
      <div className="text-sm font-medium text-gray-600 mb-1">{label}</div>
      <div className="text-xl font-bold text-gray-900">{value}</div>
    </div>
  );
}

function getBMIColor(bmi) {
  const bmiNum = parseFloat(bmi);
  if (bmiNum < 18.5) return { bg: 'bg-blue-50', border: 'border-blue-300', badge: 'bg-blue-100 text-blue-700' };
  if (bmiNum < 25) return { bg: 'bg-green-50', border: 'border-green-300', badge: 'bg-green-100 text-green-700' };
  if (bmiNum < 30) return { bg: 'bg-amber-50', border: 'border-amber-300', badge: 'bg-amber-100 text-amber-700' };
  return { bg: 'bg-red-50', border: 'border-red-300', badge: 'bg-red-100 text-red-700' };
}
