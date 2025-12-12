import React, { useEffect, useState } from 'react';
import API from '../api';

export default function Profile() {
  const [user, setUser] = useState(() => {
    try { return JSON.parse(localStorage.getItem('user') || '{}'); } catch { return {}; }
  });
  const [bmiCategory, setBmiCategory] = useState('—');
  const [bmiHistory, setBmiHistory] = useState([]);
  const [editOpen, setEditOpen] = useState(false);
  const [removePhotoOpen, setRemovePhotoOpen] = useState(false);
  const [form, setForm] = useState({ name: '', age: '', gender: '', dietPreference: '' });
  const [avatar, setAvatar] = useState(() => localStorage.getItem('avatarUrl') || '');

  useEffect(() => { 
    fetchLatestBmi();
    
    // Reload user data from localStorage on mount
    const reloadUser = () => {
      try {
        const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
        setUser(currentUser);
      } catch (err) {
        console.error('Error reloading user:', err);
      }
    };
    
    reloadUser();
    
    // Listen for user updates
    window.addEventListener('user-updated', reloadUser);
    
    return () => {
      window.removeEventListener('user-updated', reloadUser);
    };
  }, []);

  async function fetchLatestBmi() {
    try {
      const res = await API.get('/bmi/history');
      const history = res.data?.history || [];
      setBmiHistory(history);
      if (history.length) setBmiCategory(history[history.length - 1].category || '—');
    } catch {
      // ignore — profile remains functional without BMI
    }
  }

  // Calculate workout level based on BMI history activity
  function getWorkoutLevel() {
    if (bmiHistory.length === 0) return null;
    if (bmiHistory.length >= 10) return 'Advanced';
    if (bmiHistory.length >= 5) return 'Intermediate';
    return 'Beginner';
  }

  // Get last activity date
  function getLastActivity() {
    if (bmiHistory.length === 0) return null;
    const lastEntry = bmiHistory[bmiHistory.length - 1];
    const lastDate = new Date(lastEntry.date);
    const now = new Date();
    const diffTime = Math.abs(now - lastDate);
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    return `${Math.floor(diffDays / 30)} months ago`;
  }

  // Determine goal based on BMI category
  function getGoal() {
    if (!bmiCategory || bmiCategory === '—') return null;
    if (bmiCategory.toLowerCase().includes('underweight')) return 'Gain Weight';
    if (bmiCategory.toLowerCase().includes('overweight') || bmiCategory.toLowerCase().includes('obese')) return 'Lose Weight';
    return 'Maintain Fitness';
  }

  // Get diet type from user preferences
  function getDietType() {
    const pref = user?.dietPreference || 'non-vegetarian';
    if (pref === 'vegetarian') return 'Vegetarian';
    if (pref === 'non-vegetarian') return 'Non-Vegetarian';
    return null;
  }

  async function saveProfile() {
    try {
      const payload = { 
        name: form.name, 
        age: form.age ? Number(form.age) : undefined, 
        gender: form.gender,
        dietPreference: form.dietPreference
      };
      const res = await API.put('/user/me', payload);
      const updated = res.data.user || {};
      setUser(updated);
      localStorage.setItem('user', JSON.stringify(updated));
      
      // Dispatch event to notify other components
      window.dispatchEvent(new Event('user-updated'));
      
      setEditOpen(false);
    } catch (e) {
      alert(e.response?.data?.message || 'Failed to update profile');
    }
  }



  function handleAvatarChange(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const url = reader.result;
      setAvatar(url);
      try { localStorage.setItem('avatarUrl', url); } catch {}
    };
    reader.readAsDataURL(file);
  }

  function handleRemovePhoto() {
    setAvatar('');
    try { localStorage.removeItem('avatarUrl'); } catch {}
    setRemovePhotoOpen(false);
  }

  const profileCompletion = calculateProfileCompletion(user, avatar);

  return (
    <div className="min-h-[70vh] py-8 bg-gray-50">
      <div className="w-full max-w-4xl mx-auto">
        {/* Profile Header Card */}
        <div className="rounded-2xl shadow-lg bg-white overflow-hidden mb-6">
          {/* Banner Background */}
          <div className="h-32 bg-gradient-to-r from-slate-800 via-slate-700 to-slate-800 relative">
            <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23ffffff\' fill-opacity=\'1\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")' }}></div>
          </div>

          {/* Profile Photo Section */}
          <div className="px-6 pb-6 -mt-16 flex flex-col items-center text-center">
            <div className="relative">
              {avatar ? (
                <img src={avatar} alt="Profile" className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-lg" />
              ) : (
                <div className="w-32 h-32 rounded-full bg-gradient-to-br from-slate-700 to-slate-900 text-white flex items-center justify-center text-4xl font-bold border-4 border-white shadow-lg">
                  {getInitials(user?.name)}
                </div>
              )}
            </div>

            {/* Photo Actions */}
            <div className="mt-4 flex items-center gap-3">
              <label className="flex items-center gap-2 px-4 py-2 text-sm text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg cursor-pointer transition-all duration-300 hover:scale-105">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                Change Photo
                <input type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} />
              </label>
              {avatar && (
                <button
                  onClick={() => setRemovePhotoOpen(true)}
                  className="flex items-center gap-2 px-4 py-2 text-sm text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-all duration-300 hover:scale-105"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                  Remove Photo
                </button>
              )}
            </div>

            {/* User Info */}
            <h2 className="mt-6 text-3xl font-bold text-gray-900">{user?.name || 'Your Name'}</h2>
            <p className="text-gray-600 mt-1">{user?.email || 'email@example.com'}</p>

            {/* Profile Completion Bar */}
            <div className="mt-4 w-full max-w-md">
              <div className="flex justify-between items-center mb-2">
                <span className="text-xs font-medium text-gray-600">Profile Completion</span>
                <span className="text-xs font-semibold text-slate-700">{profileCompletion}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-slate-700 to-slate-900 transition-all duration-500 rounded-full"
                  style={{ width: `${profileCompletion}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>

        {/* User Information Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <InfoCard 
            icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>}
            label="Age"
            value={coalesce(user?.age, '—')}
          />
          <InfoCard 
            icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>}
            label="Gender"
            value={coalesce(cap(user?.gender), '—')}
          />
          <InfoCard 
            icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" /></svg>}
            label="BMI Category"
            value={bmiCategory}
          />
          <InfoCard 
            icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" /></svg>}
            label="Membership"
            value={user?.membership?.plan ? cap(user.membership.plan) : 'Free'}
          />
        </div>

        {/* Fitness Overview Section - Only show if there's real data */}
        {(getWorkoutLevel() || getLastActivity() || getGoal() || getDietType()) && (
          <div className="rounded-2xl shadow-lg bg-white p-6 mb-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <svg className="w-6 h-6 text-slate-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              Fitness Overview
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {getWorkoutLevel() && (
                <FitnessCard 
                  icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>}
                  label="Workout Level"
                  value={getWorkoutLevel()}
                />
              )}
              {getLastActivity() && (
                <FitnessCard 
                  icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
                  label="Last Activity"
                  value={getLastActivity()}
                />
              )}
              {getGoal() && (
                <FitnessCard 
                  icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" /></svg>}
                  label="Goal"
                  value={getGoal()}
                />
              )}
              {getDietType() && (
                <FitnessCard 
                  icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" /></svg>}
                  label="Diet Type"
                  value={getDietType()}
                />
              )}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-wrap justify-center gap-4 mb-6">
          <button
            className="flex items-center gap-2 px-6 py-3 rounded-lg bg-slate-800 text-white font-medium shadow-md hover:bg-slate-900 hover:scale-105 transition-all duration-300"
            onClick={() => { 
              setForm({ 
                name: user?.name || '', 
                age: user?.age || '', 
                gender: user?.gender || 'male',
                dietPreference: user?.dietPreference || 'non-vegetarian'
              }); 
              setEditOpen(true); 
            }}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
            Edit Profile
          </button>
          <button
            onClick={() => {
              if (window.confirm('Are you sure you want to logout?')) {
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                localStorage.removeItem('avatarUrl');
                localStorage.removeItem('isAdmin');
                window.dispatchEvent(new Event('token-changed'));
                window.location.href = '/login';
              }
            }}
            className="flex items-center gap-2 px-6 py-3 rounded-lg bg-red-600 text-white font-medium shadow-md hover:bg-red-700 hover:scale-105 transition-all duration-300"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            Logout
          </button>
        </div>

        {/* Motivational Quote */}
        <div className="text-center">
          <p className="text-slate-600 italic text-sm max-w-2xl mx-auto">
            "Consistency is stronger than motivation — keep training hard."
          </p>
        </div>

        {/* Edit Profile Modal */}
        {editOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-6 animate-scale-in">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-gray-900">Update Profile</h3>
                <button onClick={() => setEditOpen(false)} className="text-gray-400 hover:text-gray-600 transition-colors">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                  <input 
                    value={form.name} 
                    onChange={e => setForm({...form, name: e.target.value})} 
                    placeholder="Enter your name" 
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-transparent transition-all"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Age</label>
                    <input 
                      type="number"
                      value={form.age} 
                      onChange={e => setForm({...form, age: e.target.value})} 
                      placeholder="Age" 
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-transparent transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Gender</label>
                    <select 
                      value={form.gender} 
                      onChange={e => setForm({...form, gender: e.target.value})} 
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-transparent transition-all"
                    >
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Diet Preference</label>
                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={() => {
                        console.log('Clicking Vegetarian');
                        setForm(prev => ({...prev, dietPreference: 'vegetarian'}));
                      }}
                      className={`flex-1 px-4 py-3 rounded-lg border-2 font-medium transition-all duration-200 ${
                        form.dietPreference === 'vegetarian'
                          ? 'border-green-600 bg-green-50 text-green-700 shadow-md'
                          : 'border-gray-300 bg-white text-gray-700 hover:border-green-400'
                      }`}
                    >
                      <div className="flex items-center justify-center gap-2">
                        {form.dietPreference === 'vegetarian' && (
                          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                        )}
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                        </svg>
                        Vegetarian
                      </div>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        console.log('Clicking Non-Vegetarian');
                        setForm(prev => ({...prev, dietPreference: 'non-vegetarian'}));
                      }}
                      className={`flex-1 px-4 py-3 rounded-lg border-2 font-medium transition-all duration-200 ${
                        form.dietPreference === 'non-vegetarian'
                          ? 'border-orange-600 bg-orange-50 text-orange-700 shadow-md'
                          : 'border-gray-300 bg-white text-gray-700 hover:border-orange-400'
                      }`}
                    >
                      <div className="flex items-center justify-center gap-2">
                        {form.dietPreference === 'non-vegetarian' && (
                          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                        )}
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                        Non-Vegetarian
                      </div>
                    </button>
                  </div>
                  <p className="mt-2 text-xs text-gray-500">
                    Current selection: <span className="font-semibold">{form.dietPreference === 'vegetarian' ? 'Vegetarian' : 'Non-Vegetarian'}</span>
                  </p>
                </div>
              </div>
              <div className="mt-6 flex justify-end gap-3">
                <button 
                  className="px-5 py-2.5 rounded-lg border border-gray-300 text-gray-700 font-medium hover:bg-gray-50 transition-all duration-300"
                  onClick={() => setEditOpen(false)}
                >
                  Cancel
                </button>
                <button 
                  className="px-5 py-2.5 rounded-lg bg-slate-800 text-white font-medium hover:bg-slate-900 transition-all duration-300"
                  onClick={saveProfile}
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Remove Photo Confirmation Modal */}
        {removePhotoOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="w-full max-w-sm bg-white rounded-2xl shadow-2xl p-6 animate-scale-in">
              <div className="text-center">
                <div className="mx-auto w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mb-4">
                  <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">Remove Profile Photo?</h3>
                <p className="text-sm text-gray-600 mb-6">Are you sure you want to remove your profile photo? This action cannot be undone.</p>
                <div className="flex gap-3">
                  <button 
                    className="flex-1 px-4 py-2.5 rounded-lg border border-gray-300 text-gray-700 font-medium hover:bg-gray-50 transition-all duration-300"
                    onClick={() => setRemovePhotoOpen(false)}
                  >
                    Cancel
                  </button>
                  <button 
                    className="flex-1 px-4 py-2.5 rounded-lg bg-red-600 text-white font-medium hover:bg-red-700 transition-all duration-300"
                    onClick={handleRemovePhoto}
                  >
                    Remove
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}


      </div>
    </div>
  );
}

function InfoCard({ icon, label, value }) {
  return (
    <div className="rounded-xl bg-white p-5 shadow-md border border-gray-100 hover:shadow-lg hover:scale-105 transition-all duration-300">
      <div className="flex items-center gap-3 mb-3">
        <div className="text-slate-700">
          {icon}
        </div>
        <div className="text-xs uppercase tracking-wide text-gray-500 font-medium">{label}</div>
      </div>
      <div className="text-2xl font-bold text-gray-900">{value}</div>
    </div>
  );
}

function FitnessCard({ icon, label, value }) {
  return (
    <div className="rounded-lg bg-gray-50 p-4 border border-gray-200 hover:bg-gray-100 transition-all duration-300">
      <div className="flex items-center gap-2 mb-2 text-slate-700">
        {icon}
        <div className="text-xs font-medium text-gray-600">{label}</div>
      </div>
      <div className="text-lg font-semibold text-gray-900">{value}</div>
    </div>
  );
}

function calculateProfileCompletion(user, avatar) {
  let completion = 0;
  if (user?.name) completion += 25;
  if (user?.email) completion += 25;
  if (user?.age) completion += 20;
  if (user?.gender) completion += 15;
  if (avatar) completion += 15;
  return completion;
}

function cap(s) { return typeof s === 'string' ? s.charAt(0).toUpperCase() + s.slice(1) : s; }
function coalesce(a, b) { return a === undefined || a === null || a === '' ? b : a; }
function getInitials(name) {
  if (!name || typeof name !== 'string') return 'U';
  const parts = name.trim().split(/\s+/).slice(0, 2);
  return parts.map(p => p[0]?.toUpperCase()).join('');
}

