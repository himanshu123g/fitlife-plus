import React from 'react';

class VideoCallErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    // Check if it's the ZegoCloud cleanup error
    if (error?.message?.includes('createSpan') || 
        error?.message?.includes('Cannot read properties of null')) {
      // Ignore this error - it's just ZegoCloud cleanup
      return { hasError: false };
    }
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // Log errors but suppress ZegoCloud cleanup errors
    if (!error?.message?.includes('createSpan') && 
        !error?.message?.includes('Cannot read properties of null')) {
      console.error('Video call error:', error, errorInfo);
    }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-900">
          <div className="text-center bg-white rounded-lg p-8 max-w-md">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Something went wrong</h2>
            <button
              onClick={() => window.location.href = '/dashboard'}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700"
            >
              Go to Dashboard
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default VideoCallErrorBoundary;
