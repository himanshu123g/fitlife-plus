import React, { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, Link, Navigate, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { CartProvider } from './context/CartContext';
import ScrollToTop from './components/ScrollToTop';
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import CheckResetStatus from './pages/CheckResetStatus';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import Features from './pages/Features';
import Membership from './pages/Membership';
import AdminDashboard from './pages/admin/AdminDashboard';
import ManageSupplements from './pages/admin/ManageSupplements';
import ManageUsers from './pages/admin/ManageUsers';
import MembershipOverview from './pages/admin/MembershipOverview';
import PasswordResetRequests from './pages/admin/PasswordResetRequests';
import ManageOrders from './pages/admin/ManageOrders';
import Shop from './pages/Shop';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import OrderConfirmation from './pages/OrderConfirmation';
import VideoCall from './components/VideoCall';
import Remedies from './pages/Remedies';
import ExerciseDietPlans from './pages/ExerciseDietPlans';
import VideoCallUser from './pages/VideoCallUser';
import ManageTrainers from './pages/admin/ManageTrainers';
import ManageSessions from './pages/admin/ManageSessions';
import ManageReviews from './pages/admin/ManageReviews';
import TrainerLogin from './pages/trainer/TrainerLogin';
import TrainerDashboard from './pages/trainer/TrainerDashboard';
import WriteReview from './pages/WriteReview';
import OrderHistory from './pages/OrderHistory';
import OrderDetails from './pages/OrderDetails';

function AppContent() {
  const [token, setToken] = useState(() => localStorage.getItem('token'));
  const [isAdmin, setIsAdmin] = useState(() => localStorage.getItem('isAdmin') === 'true');
  const [user, setUser] = useState(() => {
    try { return JSON.parse(localStorage.getItem('user') || '{}'); } catch { return {}; }
  });
  const location = useLocation();
  const isLoginOrSignup = location.pathname === '/login' || location.pathname === '/signup';
  const isAdminPage = location.pathname.startsWith('/admin');
  const isTrainerPage = location.pathname.startsWith('/trainer');
  const shouldHideNavbar = isTrainerPage || isAdminPage || isLoginOrSignup;

  useEffect(() => {
    const handleTokenChange = () => {
      setToken(localStorage.getItem('token'));
      setIsAdmin(localStorage.getItem('isAdmin') === 'true');
      try {
        setUser(JSON.parse(localStorage.getItem('user') || '{}'));
      } catch {
        setUser({});
      }
    };
    window.addEventListener('storage', handleTokenChange);
    window.addEventListener('token-changed', handleTokenChange);
    return () => {
      window.removeEventListener('storage', handleTokenChange);
      window.removeEventListener('token-changed', handleTokenChange);
    };
  }, []);

  return (
    <div className={`min-h-screen flex flex-col ${isLoginOrSignup ? 'overflow-hidden' : ''}`}>
      {/* Scroll to top on route change */}
      <ScrollToTop />
      
      {/* Minimal navbar with blurred bottom divider - Hide for trainer and admin pages */}
      {!shouldHideNavbar && (
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-lg supports-[backdrop-filter]:bg-white/60 text-slate-800 shadow-sm">
        <div className="container mx-auto flex justify-between items-center px-4 py-3">
          <Link to="/" className="font-bold text-xl text-deep hover:scale-105 transition-transform duration-300">
            FitLife<span className="text-blue-600">+</span>
          </Link>
          <div className="flex items-center gap-2">
            {!token ? (
              <>
                <Link to="/" className={`px-3 py-1 rounded hover:bg-blue-50 hover:scale-105 transition-all duration-300 ${location.pathname === '/' ? 'bg-blue-600 text-white' : ''}`}>Home</Link>
                <Link to="/features" className={`px-3 py-1 rounded hover:bg-blue-50 hover:scale-105 transition-all duration-300 ${location.pathname === '/features' ? 'bg-blue-600 text-white' : ''}`}>Features</Link>
                <Link to="/shop" className={`px-3 py-1 rounded hover:bg-blue-50 hover:scale-105 transition-all duration-300 ${location.pathname === '/shop' ? 'bg-blue-600 text-white' : ''}`}>Shop</Link>
                <Link to="/membership" className={`px-3 py-1 rounded hover:bg-blue-50 hover:scale-105 transition-all duration-300 ${location.pathname === '/membership' ? 'bg-blue-600 text-white' : ''}`}>Membership</Link>
                <Link to="/login" className={`px-3 py-1 rounded hover:bg-blue-50 hover:scale-105 transition-all duration-300 ${location.pathname === '/login' ? 'bg-blue-600 text-white' : ''}`}>Login</Link>
                <Link to="/signup" className="px-3 py-1 rounded bg-blue-600 text-white hover:bg-blue-700 hover:scale-105 hover:shadow-md transition-all duration-300">Signup</Link>
              </>
            ) : isAdminPage ? (
              // Admin navbar - only essential links
              <>
                <Link to="/admin" className="px-3 py-1 rounded hover:bg-slate-100 hover:scale-105 transition-all duration-300">Admin Dashboard</Link>
                <button
                  onClick={() => {
                    localStorage.removeItem('token');
                    localStorage.removeItem('user');
                    localStorage.removeItem('isAdmin');
                    window.dispatchEvent(new Event('token-changed'));
                    window.location.href = '/login';
                  }}
                  className="px-3 py-1 rounded bg-red-600 text-white hover:bg-red-700 hover:scale-105 transition-all duration-300"
                >
                  Logout
                </button>
              </>
            ) : (
              // User navbar - all links
              <>
                <Link to="/" className={`px-3 py-1 rounded hover:bg-blue-50 hover:scale-105 transition-all duration-300 ${location.pathname === '/' ? 'bg-blue-600 text-white' : ''}`}>Home</Link>
                <Link to="/features" className={`px-3 py-1 rounded hover:bg-blue-50 hover:scale-105 transition-all duration-300 ${location.pathname === '/features' ? 'bg-blue-600 text-white' : ''}`}>Features</Link>
                <Link to="/remedies" className={`px-3 py-1 rounded hover:bg-blue-50 hover:scale-105 transition-all duration-300 ${location.pathname === '/remedies' ? 'bg-blue-600 text-white' : ''}`}>Remedies</Link>
                {(user?.membership?.plan === 'pro' || user?.membership?.plan === 'elite') && (
                  <Link to="/exercise-diet-plans" className={`px-3 py-1 rounded hover:bg-blue-50 hover:scale-105 transition-all duration-300 ${location.pathname === '/exercise-diet-plans' ? 'bg-blue-600 text-white' : ''}`}>Plans</Link>
                )}
                <Link to="/shop" className={`px-3 py-1 rounded hover:bg-blue-50 hover:scale-105 transition-all duration-300 ${location.pathname === '/shop' ? 'bg-blue-600 text-white' : ''}`}>Shop</Link>
                {user?.membership?.plan === 'elite' && (
                  <Link to="/video-call" className={`px-3 py-1 rounded hover:bg-blue-50 hover:scale-105 transition-all duration-300 ${location.pathname === '/video-call' ? 'bg-blue-600 text-white' : ''}`}>Video Call</Link>
                )}
                <Link to="/membership" className={`px-3 py-1 rounded hover:bg-blue-50 hover:scale-105 transition-all duration-300 ${location.pathname === '/membership' ? 'bg-blue-600 text-white' : ''}`}>Membership</Link>
                {isAdmin ? (
                  <Link to="/admin" className={`px-3 py-1 rounded hover:bg-blue-50 hover:scale-105 transition-all duration-300 ${location.pathname.startsWith('/admin') ? 'bg-blue-600 text-white' : ''}`}>Admin</Link>
                ) : (
                  <Link to="/dashboard" className={`px-3 py-1 rounded hover:bg-blue-50 hover:scale-105 transition-all duration-300 ${location.pathname === '/dashboard' ? 'bg-blue-600 text-white' : ''}`}>Dashboard</Link>
                )}
                {/* Profile Icon with Membership Ring */}
                <Link
                  to="/profile"
                  className="relative group"
                  title={user?.membership?.plan === 'elite' ? 'Elite Member' : user?.membership?.plan === 'pro' ? 'Pro Member' : 'Profile'}
                >
                  {/* Colored Ring for Pro/Elite Members */}
                  {(user?.membership?.plan === 'pro' || user?.membership?.plan === 'elite') && (
                    <div className={`absolute inset-0 rounded-full ${
                      user?.membership?.plan === 'elite' 
                        ? 'ring-2 ring-purple-600' 
                        : 'ring-2 ring-blue-600'
                    } animate-pulse`}></div>
                  )}
                  {/* Profile Icon */}
                  <div className={`p-2 rounded-full hover:bg-blue-700 hover:scale-110 transition-all duration-300 shadow-sm relative ${
                    location.pathname === '/profile' ? 'bg-blue-700 text-white' : 'bg-blue-600 text-white'
                  }`}>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>
      )}

      {/* Trainer Navbar - Only show on trainer pages */}
      {isTrainerPage && location.pathname !== '/trainer/login' && (
        <nav className="sticky top-0 z-50 bg-white shadow-md">
          <div className="container mx-auto flex justify-between items-center px-6 py-4">
            <div className="flex items-center gap-3">
              <div className="font-bold text-2xl text-gray-900">
                FitLife<span className="text-purple-600">+</span>
              </div>
              <span className="text-gray-400">|</span>
              <span className="text-gray-600 font-medium">Trainer Portal</span>
            </div>
            <button
              onClick={() => {
                localStorage.removeItem('trainerToken');
                localStorage.removeItem('trainer');
                window.location.href = '/login';
              }}
              className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 transition-all duration-300 font-medium"
            >
              Logout
            </button>
          </div>
        </nav>
      )}

      <main className={`flex-grow ${isLoginOrSignup ? 'p-0' : location.pathname === '/' ? 'p-0' : isAdminPage ? 'p-0' : isTrainerPage ? 'p-0' : location.pathname.startsWith('/call/') ? 'p-0' : 'container mx-auto p-4'}`}>
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            <Route path="/" element={<Home />} />
            <Route 
              path="/login" 
              element={!token ? <Login /> : <Navigate to={isAdmin ? "/admin" : "/dashboard"} replace />} 
            />
            <Route 
              path="/signup" 
              element={!token ? <Signup /> : <Navigate to={isAdmin ? "/admin" : "/dashboard"} replace />} 
            />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/check-reset-status" element={<CheckResetStatus />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route 
            path="/dashboard" 
            element={token && !isAdmin ? <Dashboard /> : !token ? <Navigate to="/login" replace /> : <Navigate to="/admin" replace />} 
          />
          <Route 
            path="/admin" 
            element={token && isAdmin ? <AdminDashboard /> : <Navigate to="/login" replace />} 
          />
          <Route 
            path="/admin/supplements" 
            element={token && isAdmin ? <ManageSupplements /> : <Navigate to="/login" replace />} 
          />
          <Route 
            path="/admin/users" 
            element={token && isAdmin ? <ManageUsers /> : <Navigate to="/login" replace />} 
          />
          <Route 
            path="/admin/membership" 
            element={token && isAdmin ? <MembershipOverview /> : <Navigate to="/login" replace />} 
          />
          <Route 
            path="/admin/orders" 
            element={token && isAdmin ? <ManageOrders /> : <Navigate to="/login" replace />} 
          />
          <Route 
            path="/admin/trainers" 
            element={token && isAdmin ? <ManageTrainers /> : <Navigate to="/login" replace />} 
          />
          <Route 
            path="/admin/sessions" 
            element={token && isAdmin ? <ManageSessions /> : <Navigate to="/login" replace />} 
          />
          <Route 
            path="/admin/reviews" 
            element={token && isAdmin ? <ManageReviews /> : <Navigate to="/login" replace />} 
          />
          <Route 
            path="/admin/password-resets" 
            element={token && isAdmin ? <PasswordResetRequests /> : <Navigate to="/login" replace />} 
          />
          <Route path="/profile" element={token ? <Profile /> : <Navigate to="/login" replace />} />
          <Route path="/video-call" element={token ? <VideoCallUser /> : <Navigate to="/login" replace />} />
          <Route path="/features" element={<Features />} />
          <Route path="/write-review" element={token ? <WriteReview /> : <Navigate to="/login" replace />} />
          <Route path="/membership" element={<Membership />} />
          <Route path="/remedies" element={token ? <Remedies /> : <Navigate to="/login" replace />} />
          <Route path="/exercise-diet-plans" element={token ? <ExerciseDietPlans /> : <Navigate to="/login" replace />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={token ? <Checkout /> : <Navigate to="/login" replace />} />
          <Route path="/order-confirmation" element={token ? <OrderConfirmation /> : <Navigate to="/login" replace />} />
          <Route path="/order-history" element={token ? <OrderHistory /> : <Navigate to="/login" replace />} />
          <Route path="/order-details/:id" element={token ? <OrderDetails /> : <Navigate to="/login" replace />} />
          <Route path="/call/:roomId" element={<VideoCall />} />
          <Route path="/trainer/login" element={<TrainerLogin />} />
          <Route path="/trainer/dashboard" element={<TrainerDashboard />} />
        </Routes>
        </AnimatePresence>
      </main>

      {/* Footer - Hidden on login/signup, home page, admin pages, and video call pages */}
      {!isLoginOrSignup && location.pathname !== '/' && !isAdminPage && !location.pathname.startsWith('/call/') && (
        <footer className="bg-white border-t py-4 text-center text-sm">
          © FitLife+ — Smart Fitness Companion
        </footer>
      )}
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <CartProvider>
        <AppContent />
      </CartProvider>
    </BrowserRouter>
  );
}

export default App;
