import React, { useEffect, useRef, useState } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { ZegoUIKitPrebuilt } from '@zegocloud/zego-uikit-prebuilt';
import API from '../api';
import CallTimer from './CallTimer';
import CallNotes from './CallNotes';
import PostCallFeedback from './PostCallFeedback';
import ConnectionQuality from './ConnectionQuality';
import SessionSummary from './SessionSummary';

export default function VideoCall() {
  const { roomId } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const containerRef = useRef(null);
  const zegoInstanceRef = useRef(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // New state for enhanced features
  const [callStarted, setCallStarted] = useState(false);
  const [callDuration, setCallDuration] = useState(0);
  const [notesOpen, setNotesOpen] = useState(false);
  const [sessionNotes, setSessionNotes] = useState('');
  const [showFeedback, setShowFeedback] = useState(false);
  const [showSummary, setShowSummary] = useState(false);
  const [trainerName, setTrainerName] = useState('Trainer');
  const [sessionRating, setSessionRating] = useState(0);
  
  // Suppress ZegoCloud cleanup errors
  useEffect(() => {
    const originalError = console.error;
    console.error = (...args) => {
      // Suppress the specific createSpan error from ZegoCloud
      if (args[0]?.toString().includes('createSpan') || 
          args[0]?.toString().includes('Cannot read properties of null')) {
        return; // Silently ignore this error
      }
      originalError.apply(console, args);
    };
    
    return () => {
      console.error = originalError;
    };
  }, []);
  
  // Check if this is a test call
  const isTestMode = searchParams.get('test') === 'true';
  const testRole = searchParams.get('role');
  const testUserName = searchParams.get('user');
  
  useEffect(() => {
    if (!roomId) {
      setError('Invalid room ID');
      return;
    }
    
    initializeCall();
    
    // Cleanup function to destroy Zego instance when component unmounts
    return () => {
      if (zegoInstanceRef.current) {
        console.log('🧹 Cleaning up Zego instance...');
        try {
          // Destroy the instance before the container is removed
          zegoInstanceRef.current.destroy();
          zegoInstanceRef.current = null;
          console.log('✅ Zego instance cleaned up successfully');
        } catch (err) {
          console.error('Error destroying Zego instance:', err);
          // Suppress the error to prevent it from showing to user
        }
      }
      
      // Clear the container to prevent any lingering references
      if (containerRef.current) {
        containerRef.current.innerHTML = '';
      }
    };
  }, [roomId]);
  
  const initializeCall = async () => {
    try {
      console.log('🎥 Initializing video call...');
      console.log('Room ID:', roomId);
      console.log('Test mode:', isTestMode);
      console.log('Query params:', {
        test: searchParams.get('test'),
        role: searchParams.get('role'),
        user: searchParams.get('user')
      });
      console.log('LocalStorage:', {
        hasUserToken: !!localStorage.getItem('token'),
        hasTrainerToken: !!localStorage.getItem('trainerToken')
      });
      
      // Check if browser supports media devices
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        console.error('❌ Browser does not support camera/microphone access');
        setError('❌ BROWSER NOT SUPPORTED\n\nYour browser does not support video calls.\n\nPlease use:\n• Chrome (recommended)\n• Firefox\n• Safari\n• Edge\n\nMake sure you are using HTTPS or localhost.');
        setLoading(false);
        return;
      }

      // Check media permissions with detailed error handling
      try {
        console.log('🎤 Requesting camera and microphone access...');
        const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        console.log('✅ Camera and microphone permissions granted');
        console.log('Video tracks:', stream.getVideoTracks().length);
        console.log('Audio tracks:', stream.getAudioTracks().length);
        stream.getTracks().forEach(track => {
          console.log(`Stopping ${track.kind} track`);
          track.stop();
        });
      } catch (permErr) {
        console.error('❌ Media permission error:', permErr.name, permErr.message);
        
        let errorMsg = '';
        
        if (permErr.name === 'NotReadableError' || permErr.message.includes('Could not start')) {
          errorMsg = '⚠️ CAMERA ALREADY IN USE!\n\n';
          errorMsg += 'Your camera is being used by another tab, window, or application.\n\n';
          errorMsg += '✅ Solutions:\n';
          errorMsg += '• Close other tabs/windows using the camera\n';
          errorMsg += '• Close video apps (Zoom, Teams, Skype, etc.)\n';
          errorMsg += '• Use TWO DIFFERENT DEVICES (one for user, one for trainer)\n';
          errorMsg += '• Connect an external USB webcam\n\n';
          errorMsg += '💡 TIP: You cannot use the same camera in two browsers simultaneously!';
        } else if (permErr.name === 'NotAllowedError') {
          errorMsg = '🔒 PERMISSION DENIED\n\n';
          errorMsg += 'Please allow camera and microphone access:\n\n';
          errorMsg += '1. Click the camera icon in your browser address bar\n';
          errorMsg += '2. Select "Always allow" for camera and microphone\n';
          errorMsg += '3. Refresh this page';
        } else {
          errorMsg = `❌ Camera Error: ${permErr.message}\n\n`;
          errorMsg += 'Please check your camera and microphone settings.';
        }
        
        setError(errorMsg);
        setLoading(false);
        return;
      }
      
      let backendToken, appId, userId, userName;
      
      // Test mode: use test endpoint without authentication
      if (isTestMode && testUserName && testRole) {
        console.log('📞 Test mode - fetching token...');
        const res = await API.post('/zego/token/test', { 
          roomId, 
          userName: testUserName,
          role: testRole
        });
        console.log('✅ Backend response:', res.data);
        ({ token: backendToken, appId, userId, userName } = res.data);
      } else {
        // Production mode: check if user is trainer or regular user
        const isTrainer = localStorage.getItem('trainerToken');
        const endpoint = isTrainer ? '/zego/token/trainer' : '/zego/token';
        
        console.log('📞 Production mode - endpoint:', endpoint);
        // Get token from backend
        const res = await API.post(endpoint, { roomId });
        console.log('✅ Backend response:', res.data);
        ({ token: backendToken, appId, userId, userName } = res.data);
      }
      
      console.log('🔑 Token received from backend');
      console.log('App ID:', appId);
      console.log('User ID:', userId);
      console.log('User Name:', userName);
      console.log('Room ID:', roomId);
      console.log('Server Secret (first 10 chars):', backendToken?.substring(0, 10) + '...');
      
      // Validate required parameters
      if (!appId || !backendToken || !userId || !userName) {
        throw new Error('Missing required parameters from backend');
      }
      
      console.log('🔧 Generating kit token...');
      console.log('Parameters for kit token:', {
        appId: Number(appId),
        roomId,
        userId,
        userName,
        serverSecretLength: backendToken?.length
      });
      
      // Use generateKitTokenForTest with server secret from backend
      // backendToken is actually the server secret, not a token
      const kitToken = ZegoUIKitPrebuilt.generateKitTokenForTest(
        Number(appId),
        backendToken,  // This is the server secret from backend
        roomId,
        userId,
        userName
      );
      
      console.log('✅ Kit token generated successfully');
      console.log('Kit Token (first 20 chars):', kitToken?.substring(0, 20) + '...');
      console.log('Kit Token length:', kitToken?.length);
      
      // Create Zego instance
      console.log('🎬 Creating Zego instance...');
      const zp = ZegoUIKitPrebuilt.create(kitToken);
      zegoInstanceRef.current = zp;
      
      console.log('🚪 Joining room...');
      console.log('Room configuration:', {
        roomId,
        userId,
        userName,
        maxUsers: 2
      });
      
      // Join room with proper configuration
      zp.joinRoom({
        container: containerRef.current,
        scenario: {
          mode: ZegoUIKitPrebuilt.OneONoneCall,
        },
        sharedLinks: [
          {
            name: 'Copy Room Link',
            url: window.location.href,
          },
        ],
        // Video quality settings
        videoResolutionDefault: ZegoUIKitPrebuilt.VideoResolution_360P,
        turnOnMicrophoneWhenJoining: true,
        turnOnCameraWhenJoining: true,
        showMyCameraToggleButton: true,
        showMyMicrophoneToggleButton: true,
        showAudioVideoSettingsButton: true,
        showScreenSharingButton: true,
        showTextChat: true,
        showUserList: true,
        maxUsers: 2,
        layout: "Auto",
        showLayoutButton: false,
        // Ensure proper video rendering
        showNonVideoUser: true,
        showOnlyAudioUser: true,
        onLeaveRoom: () => {
          console.log('👋 User left the room');
          setCallStarted(false);
          // Let ZegoCloud handle the leave screen with Rejoin/Return buttons
          // No automatic redirect - user clicks "Return to home screen" button
        },
        onReturnToHomeScreenClicked: () => {
          console.log('🏠 Returning to home screen');
          const trainerToken = localStorage.getItem('trainerToken');
          const userToken = localStorage.getItem('token');
          
          if (trainerToken) {
            window.location.href = '/trainer/dashboard';
          } else if (userToken) {
            window.location.href = '/dashboard';
          } else {
            window.location.href = '/';
          }
        },
        onJoinRoom: () => {
          console.log('✅ Successfully joined room!');
          console.log('Current user:', { userId, userName, roomId });
          console.log('Timestamp:', new Date().toISOString());
          setCallStarted(true);
          setTrainerName(userName);
        },
        onUserJoin: (users) => {
          console.log('👥 User joined the room!');
          console.log('Joined users:', users);
          console.log('Total users in room:', users.length + 1); // +1 for current user
          console.log('Timestamp:', new Date().toISOString());
        },
        onUserLeave: (users) => {
          console.log('👋 User left the room');
          console.log('Remaining users:', users);
          console.log('Timestamp:', new Date().toISOString());
        },
        onRoomStateUpdate: (state) => {
          console.log('🔄 Room state updated:', state);
        }
      });
      
      console.log('✅ Video call initialized');
      setLoading(false);
    } catch (err) {
      console.error('❌ Video call error:', err);
      console.error('Error details:', err.response?.data);
      setError(err.response?.data?.message || err.message || 'Failed to join call');
      setLoading(false);
    }
  };

  // Save session data to backend
  const saveSessionData = async () => {
    try {
      await API.post('/video-sessions/save', {
        roomId,
        duration: callDuration,
        notes: sessionNotes,
        trainerName
      });
    } catch (err) {
      console.error('Error saving session:', err);
    }
  };

  // Handle notes save
  const handleNotesSave = (notes) => {
    setSessionNotes(notes);
    setNotesOpen(false);
  };

  // Handle feedback submission
  const handleFeedbackSubmit = async (feedback) => {
    setSessionRating(feedback.rating);
    try {
      await API.post('/video-sessions/feedback', {
        roomId,
        rating: feedback.rating,
        feedback: feedback.feedback,
        trainerName
      });
      setShowFeedback(false);
      setShowSummary(true);
    } catch (err) {
      console.error('Error submitting feedback:', err);
      setShowFeedback(false);
      setShowSummary(true);
    }
  };

  // Handle summary close
  const handleSummaryClose = () => {
    setShowSummary(false);
    
    // Check if user is a trainer or regular user
    const trainerToken = localStorage.getItem('trainerToken');
    const userToken = localStorage.getItem('token');
    
    if (trainerToken) {
      // Redirect trainer to trainer dashboard
      navigate('/trainer/dashboard');
    } else if (userToken) {
      // Redirect regular user to dashboard
      navigate('/dashboard');
    } else {
      // Fallback to home if no token
      navigate('/');
    }
  };
  
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="text-center bg-white rounded-lg p-8 max-w-md">
          <svg className="w-16 h-16 text-red-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Unable to Join Call</h2>
          <p className="text-red-600 mb-6">{error}</p>
          <button
            onClick={() => navigate(-1)}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-all"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white text-lg">Connecting to call...</p>
          <p className="text-gray-400 text-sm mt-2">Check browser console (F12) for details...</p>
        </div>
      </div>
    );
  }
  
  return (
    <>
      <div className="relative w-full h-screen bg-gray-900">
        {/* ZegoCloud Container */}
        <div ref={containerRef} className="w-full h-full" />
        
        {/* Call Timer - Overlay on top */}
        {callStarted && (
          <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-[9999]">
            <CallTimer 
              isActive={callStarted} 
              onTimeUpdate={setCallDuration}
            />
          </div>
        )}

        {/* Connection Quality - Overlay on top */}
        {callStarted && (
          <div className="absolute top-4 right-4 z-[9999]">
            <ConnectionQuality />
          </div>
        )}

        {/* Notes Toggle Button - Overlay on top */}
        {callStarted && (
          <button
            onClick={() => {
              console.log('Notes button clicked, current state:', notesOpen);
              setNotesOpen(!notesOpen);
            }}
            className="absolute top-20 right-4 z-[9999] bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-full shadow-2xl transition-all transform hover:scale-110"
            title="Session Notes"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </button>
        )}
      </div>

      {/* Notes Panel */}
      <CallNotes
        isOpen={notesOpen}
        onClose={() => setNotesOpen(false)}
        onSave={handleNotesSave}
        initialNotes={sessionNotes}
      />

      {/* Post-Call Feedback */}
      <PostCallFeedback
        isOpen={showFeedback}
        onClose={() => {
          setShowFeedback(false);
          // Skip directly to redirect instead of showing summary
          const trainerToken = localStorage.getItem('trainerToken');
          const userToken = localStorage.getItem('token');
          
          if (trainerToken) {
            navigate('/trainer/dashboard');
          } else if (userToken) {
            navigate('/dashboard');
          } else {
            navigate('/');
          }
        }}
        onSubmit={handleFeedbackSubmit}
        trainerName={trainerName}
      />

      {/* Session Summary */}
      <SessionSummary
        isOpen={showSummary}
        onClose={handleSummaryClose}
        trainerName={trainerName}
        duration={callDuration}
        notes={sessionNotes}
        rating={sessionRating}
      />
    </>
  );
}
