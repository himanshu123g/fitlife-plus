import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api';

export default function VideoCallUser() {
  const navigate = useNavigate();
  const [user, setUser] = useState(() => {
    try { return JSON.parse(localStorage.getItem('user') || '{}'); } catch { return {}; }
  });
  const [trainers, setTrainers] = useState([]);
  const [mySessions, setMySessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isVisible, setIsVisible] = useState(false);
  const [selectedTrainer, setSelectedTrainer] = useState(null);
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [requestForm, setRequestForm] = useState({
    scheduledDate: '',
    scheduledTime: '',
    userMessage: ''
  });

  useEffect(() => {
    // Check if user is Elite
    if (user?.membership?.plan !== 'elite') {
      navigate('/membership');
      return;
    }
    
    loadData();
    
    // Poll for updates every 10 seconds
    const interval = setInterval(loadData, 10000);
    return () => clearInterval(interval);
  }, []);

  const loadData = async () => {
    try {
      const [trainersRes, sessionsRes] = await Promise.all([
        API.get('/sessions/trainers'),
        API.get('/sessions/my-sessions')
      ]);
      
      setTrainers(trainersRes.data.trainers || []);
      setMySessions(sessionsRes.data.sessions || []);
      setLoading(false);
      
      // Trigger animations after data loads
      setTimeout(() => setIsVisible(true), 100);
    } catch (err) {
      console.error('Load data error:', err);
      setLoading(false);
      setTimeout(() => setIsVisible(true), 100);
    }
  };

  const openRequestModal = (trainer) => {
    setSelectedTrainer(trainer);
    setShowRequestModal(true);
    setRequestForm({
      scheduledDate: '',
      scheduledTime: '',
      userMessage: ''
    });
  };

  const closeRequestModal = () => {
    setShowRequestModal(false);
    setSelectedTrainer(null);
  };

  const handleRequestSubmit = async (e) => {
    e.preventDefault();
    
    try {
      await API.post('/sessions/request', {
        trainerId: selectedTrainer._id,
        ...requestForm
      });
      
      alert('Session request sent successfully!');
      closeRequestModal();
      loadData();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to send request');
    }
  };

  const joinCall = (roomId) => {
    navigate(`/call/${roomId}`);
  };

  const cancelSession = async (sessionId) => {
    if (!window.confirm('Are you sure you want to cancel this session?')) return;
    
    try {
      await API.put(`/sessions/${sessionId}/cancel`);
      alert('Session cancelled');
      loadData();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to cancel session');
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'approved': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      case 'completed': return 'bg-blue-100 text-blue-800';
      case 'cancelled': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8 overflow-hidden">
          <h1 
            className={`text-4xl md:text-5xl font-bold mb-6 transform transition-all duration-700 ${
              isVisible ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0'
            }`}
          >
            <span className="bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
              Video Call Sessions
            </span>
          </h1>
          <div className="flex justify-center mb-6">
            <div className={`h-1 bg-gradient-to-r from-blue-600 to-blue-800 rounded-full transition-all duration-[1500ms] ease-out delay-300 ${isVisible ? 'w-64' : 'w-0'}`}></div>
          </div>
          <p 
            className={`text-lg text-gray-600 max-w-2xl mx-auto transform transition-all duration-700 delay-500 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
          >
            Book and manage your personal training sessions
          </p>
        </div>

        {/* My Sessions */}
        <div className={`mb-8 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`} style={{ transitionDelay: '600ms' }}>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">My Sessions</h2>
          
          {mySessions.length === 0 ? (
            <div className="bg-white rounded-xl p-8 text-center border-t-4 border-blue-600 shadow-md">
              <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
              <p className="text-gray-600">No sessions yet. Book a session with a trainer below!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {mySessions.map((session, index) => (
                <div 
                  key={session._id} 
                  className={`bg-white rounded-xl p-6 border-t-4 border-blue-600 shadow-md hover:shadow-xl transition-all duration-700 ${
                    isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                  }`}
                  style={{ transitionDelay: `${700 + index * 100}ms` }}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      {session.trainer?.profilePhoto ? (
                        <img src={session.trainer.profilePhoto} alt={session.trainer.name} className="w-12 h-12 rounded-full object-cover" />
                      ) : (
                        <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                          <span className="text-blue-600 font-semibold">{session.trainer?.name?.charAt(0)}</span>
                        </div>
                      )}
                      <div>
                        <h3 className="font-semibold text-gray-900">{session.trainer?.name}</h3>
                        <p className="text-sm text-gray-600">{session.trainer?.specialization}</p>
                      </div>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(session.status)}`}>
                      {session.status.charAt(0).toUpperCase() + session.status.slice(1)}
                    </span>
                  </div>
                  
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      {new Date(session.scheduledDate).toLocaleDateString()}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      {session.scheduledTime}
                    </div>
                  </div>

                  {session.status === 'approved' && session.roomId && (
                    <button
                      onClick={() => joinCall(session.roomId)}
                      className="w-full py-2.5 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-all flex items-center justify-center gap-2"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                      Join Video Call
                    </button>
                  )}

                  {session.status === 'pending' && (
                    <button
                      onClick={() => cancelSession(session._id)}
                      className="w-full py-2.5 bg-red-100 text-red-700 rounded-lg font-medium hover:bg-red-200 transition-all"
                    >
                      Cancel Request
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Available Trainers */}
        <div className={`transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`} style={{ transitionDelay: '700ms' }}>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Available Trainers</h2>
          
          {trainers.length === 0 ? (
            <div className="bg-white rounded-xl p-8 text-center border-t-4 border-green-600 shadow-md">
              <p className="text-gray-600">No trainers available at the moment</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {trainers.map((trainer, index) => (
                <div 
                  key={trainer._id} 
                  className={`bg-white rounded-xl p-6 border-t-4 border-green-600 shadow-md hover:shadow-xl transition-all duration-700 ${
                    isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                  }`}
                  style={{ transitionDelay: `${800 + index * 100}ms` }}
                >
                  <div className="flex items-center gap-4 mb-4">
                    {trainer.profilePhoto ? (
                      <img src={trainer.profilePhoto} alt={trainer.name} className="w-16 h-16 rounded-full object-cover" />
                    ) : (
                      <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center">
                        <span className="text-blue-600 font-bold text-xl">{trainer.name.charAt(0)}</span>
                      </div>
                    )}
                    <div>
                      <h3 className="font-bold text-gray-900 text-lg">{trainer.name}</h3>
                      <p className="text-sm text-gray-600">{trainer.specialization}</p>
                    </div>
                  </div>

                  <button
                    onClick={() => openRequestModal(trainer)}
                    className="w-full py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-all flex items-center justify-center gap-2 shadow-md hover:shadow-lg"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    Request Session
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Request Modal */}
      {showRequestModal && selectedTrainer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4" onClick={closeRequestModal}>
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-900">Request Session</h3>
              <button onClick={closeRequestModal} className="text-gray-400 hover:text-gray-600">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="flex items-center gap-3 mb-6 p-4 bg-gray-50 rounded-lg">
              {selectedTrainer.profilePhoto ? (
                <img src={selectedTrainer.profilePhoto} alt={selectedTrainer.name} className="w-12 h-12 rounded-full object-cover" />
              ) : (
                <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                  <span className="text-blue-600 font-semibold">{selectedTrainer.name.charAt(0)}</span>
                </div>
              )}
              <div>
                <h4 className="font-semibold text-gray-900">{selectedTrainer.name}</h4>
                <p className="text-sm text-gray-600">{selectedTrainer.specialization}</p>
              </div>
            </div>

            <form onSubmit={handleRequestSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Preferred Date</label>
                <input
                  type="date"
                  value={requestForm.scheduledDate}
                  onChange={(e) => setRequestForm({...requestForm, scheduledDate: e.target.value})}
                  min={new Date().toISOString().split('T')[0]}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Preferred Time</label>
                <input
                  type="time"
                  value={requestForm.scheduledTime}
                  onChange={(e) => setRequestForm({...requestForm, scheduledTime: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Message (Optional)</label>
                <textarea
                  value={requestForm.userMessage}
                  onChange={(e) => setRequestForm({...requestForm, userMessage: e.target.value})}
                  placeholder="Any specific requirements or goals..."
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={closeRequestModal}
                  className="flex-1 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-all"
                >
                  Send Request
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
