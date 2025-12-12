import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import API from '../api';

export default function CheckResetStatus() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState(null);
  const [requestId, setRequestId] = useState(null);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleCheck = async (e) => {
    e.preventDefault();
    setError('');
    setStatus(null);
    setLoading(true);

    try {
      const res = await API.get(`/password-reset/check-status/${email}`);
      setStatus(res.data.status);
      setRequestId(res.data.requestId);
      setLoading(false);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to check status');
      setLoading(false);
    }
  };

  const handleResetPassword = () => {
    navigate(`/reset-password?email=${encodeURIComponent(email)}&requestId=${requestId}`);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-lg p-8">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Check Reset Status</h2>
          <p className="text-gray-600">
            Check if your password reset request has been approved
          </p>
        </div>

        {/* Detailed Info Box */}
        <div className="mb-6 space-y-4">
          {/* How it Works */}
          <div className="p-4 bg-blue-50 border-l-4 border-blue-500 rounded-r-lg">
            <div className="flex items-start gap-3">
              <svg className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div className="text-sm text-blue-900">
                <p className="font-semibold mb-2">How to Reset Your Password:</p>
                <ol className="space-y-1 list-decimal list-inside">
                  <li>Enter your email below to check your request status</li>
                  <li>If status is <span className="font-semibold text-green-700">Approved</span>, a "Reset Password Now" button will appear</li>
                  <li>Click the button to set your new password</li>
                  <li>Login with your new password</li>
                </ol>
              </div>
            </div>
          </div>

          {/* Status Meanings */}
          <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
            <p className="font-semibold text-gray-900 mb-3 text-sm">What Each Status Means:</p>
            <div className="space-y-2 text-sm">
              <div className="flex items-start gap-2">
                <span className="px-2 py-0.5 bg-yellow-100 text-yellow-800 rounded text-xs font-medium">Pending</span>
                <span className="text-gray-700">→ Admin is reviewing your request. Please check back later.</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="px-2 py-0.5 bg-green-100 text-green-800 rounded text-xs font-medium">Approved</span>
                <span className="text-gray-700">→ You can now reset your password! Click the button that appears.</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="px-2 py-0.5 bg-red-100 text-red-800 rounded text-xs font-medium">Rejected</span>
                <span className="text-gray-700">→ Request was denied. Contact admin or submit a new request.</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="px-2 py-0.5 bg-blue-100 text-blue-800 rounded text-xs font-medium">Completed</span>
                <span className="text-gray-700">→ Password already reset. You can login with your new password.</span>
              </div>
            </div>
          </div>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 rounded-r-lg">
            <div className="flex items-start gap-3">
              <svg className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="text-sm text-red-800">{error}</span>
            </div>
          </div>
        )}

        {status && (
          <div className={`mb-6 p-4 rounded-lg border-l-4 ${
            status === 'approved' ? 'bg-green-50 border-green-500' :
            status === 'pending' ? 'bg-yellow-50 border-yellow-500' :
            status === 'rejected' ? 'bg-red-50 border-red-500' :
            status === 'completed' ? 'bg-blue-50 border-blue-500' :
            'bg-gray-50 border-gray-500'
          }`}>
            <div className="flex items-start gap-3">
              <svg className={`w-5 h-5 flex-shrink-0 mt-0.5 ${
                status === 'approved' ? 'text-green-600' :
                status === 'pending' ? 'text-yellow-600' :
                status === 'rejected' ? 'text-red-600' :
                status === 'completed' ? 'text-blue-600' :
                'text-gray-600'
              }`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div>
                <p className={`text-sm font-medium ${
                  status === 'approved' ? 'text-green-800' :
                  status === 'pending' ? 'text-yellow-800' :
                  status === 'rejected' ? 'text-red-800' :
                  status === 'completed' ? 'text-blue-800' :
                  'text-gray-800'
                }`}>
                  {status === 'approved' && 'Your request has been approved! You can now reset your password.'}
                  {status === 'pending' && 'Your request is pending admin approval. Please check back later.'}
                  {status === 'rejected' && 'Your request was rejected by the admin. Please contact support.'}
                  {status === 'completed' && 'Your password has already been reset. You can login with your new password.'}
                  {status === 'none' && 'No password reset request found for this email.'}
                </p>
              </div>
            </div>
          </div>
        )}

        <form onSubmit={handleCheck} className="space-y-6">
          <div className="space-y-2">
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email Address
            </label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <svg className="w-5 h-5 text-gray-400 group-focus-within:text-gray-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full pl-12 pr-4 py-3.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all hover:border-gray-400"
                disabled={loading}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gray-900 text-white py-4 px-6 rounded-lg font-medium hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 hover:shadow-lg hover:scale-[1.02] active:scale-[0.98]"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Checking...
              </span>
            ) : (
              'Check Status'
            )}
          </button>
        </form>

        {status === 'approved' && requestId && (
          <button
            onClick={handleResetPassword}
            className="w-full mt-4 bg-green-600 text-white py-4 px-6 rounded-lg font-medium hover:bg-green-700 transition-all duration-200 hover:shadow-lg hover:scale-[1.02] active:scale-[0.98]"
          >
            Reset Password Now
          </button>
        )}

        <div className="mt-6 text-center space-y-2">
          <Link to="/forgot-password" className="block text-gray-600 hover:text-gray-900 transition-colors text-sm">
            Submit New Request
          </Link>
          <Link to="/login" className="block text-gray-600 hover:text-gray-900 transition-colors text-sm">
            Back to Login
          </Link>
        </div>
      </div>
    </div>
  );
}
