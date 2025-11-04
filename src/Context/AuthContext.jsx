import { createContext, useContext, useState, useEffect } from 'react';
import api from '../api/axios';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const navigate = useNavigate();
  const [user, setUser] = useState(() => JSON.parse(localStorage.getItem('user')));

  useEffect(() => {
    if (user) localStorage.setItem('user', JSON.stringify(user));
    else localStorage.removeItem('user');
  }, [user]);

  // Refresh user data on mount if token exists
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token && !user) {
      refreshUser();
    }
  }, []);

  const login = async (email, password) => {
    try {
      console.log('🔐 Attempting login with:', { email, password: '***' });
      const res = await api.post('/login', { email, password });
      console.log('✅ Login successful:', res.data);
      
      localStorage.setItem('token', res.data.token);
      
      // Validate user data before setting
      const userData = res.data.user;
      console.log('Login response user data:', userData);
      
      if (!userData.fullname || userData.fullname.trim() === '') {
        console.warn('User fullname is empty or missing in login response');
      }
      
      setUser(userData);
      // redirect by role
      const roleToRoute = {
        guard: '/dashboard',
        program_head: '/faculty-load',
        dean: '/dean-dashboard',
        prof: '/prof_report',
        super_admin: '/super-admin-dashboard',
        registrar: '/registrar-student-registration'
      };
      navigate(roleToRoute[res.data.user.role] || '/dashboard');
    } catch (error) {
      console.error('❌ Login error:', error);
      console.error('Error response:', error.response?.data);
      throw error; // Re-throw to let Login component handle it
    }
  };

  
// Add this function to refresh user data
  const refreshUser = async () => {
    try {
      const res = await api.get('/user');
      const userData = res.data;
      
      // Ensure user data has required fields
      if (!userData.fullname || userData.fullname === 'Unknown User') {
        console.warn('User fullname is missing or invalid:', userData);
        // Try to get user data from login response if available
        const storedUser = JSON.parse(localStorage.getItem('user') || '{}');
        if (storedUser.fullname && storedUser.fullname !== 'Unknown User') {
          userData.fullname = storedUser.fullname;
        }
      }
      
      setUser(userData);
      localStorage.setItem('user', JSON.stringify(userData));
      console.log('User refreshed:', userData); // Debug log
    } catch (err) {
      console.error('Failed to refresh user:', err);
    }
  };


  const logout = async () => {
    try { await api.post('/logout'); } catch(e) { /* ignore */ }
    localStorage.removeItem('token');
    setUser(null);
    navigate('/login');
  };

  return (
    <AuthContext.Provider value={{ user, setUser, login, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
}
export const useAuth = () => useContext(AuthContext);
