import axios from 'axios';

// Detect if accessing from network (not localhost)
const getBaseURL = () => {
  // If REACT_APP_API_URL is set, use it
  if (process.env.REACT_APP_API_URL) {
    return process.env.REACT_APP_API_URL;
  }
  
  // For production deployment (Vercel, Netlify, etc.)
  if (process.env.NODE_ENV === 'production') {
    // Replace with your Railway backend URL
    return 'https://your-railway-app.railway.app/api';
  }
  
  // If accessing from network (e.g., 192.168.x.x), use the same host for API
  const hostname = window.location.hostname;
  if (hostname !== 'localhost' && hostname !== '127.0.0.1') {
    return `http://${hostname}:5000/api`;
  }
  
  // Default to localhost
  return 'http://localhost:5000/api';
};

const API = axios.create({ baseURL: getBaseURL() });

API.interceptors.request.use((config) => {
  // Check for trainer token first, then regular token
  const trainerToken = localStorage.getItem('trainerToken');
  const token = localStorage.getItem('token');
  
  if (trainerToken) {
    config.headers.Authorization = `Bearer ${trainerToken}`;
  } else if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle 401 errors (unauthorized) - redirect to login
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Clear both user and trainer tokens
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      localStorage.removeItem('trainerToken');
      localStorage.removeItem('trainer');
      window.dispatchEvent(new Event('token-changed'));
      // Only redirect if not already on login/signup page
      if (!window.location.pathname.includes('/login') && !window.location.pathname.includes('/signup')) {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default API;
