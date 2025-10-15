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

  const login = async (email, password) => {
    const res = await api.post('/login', { email, password });
    localStorage.setItem('token', res.data.token);
    setUser(res.data.user);
    // redirect by role
    const roleToRoute = {
      guard: '/dashboard',
      program_head: '/scheduling',
      dean: '/dashboard',
      prof: '/prof_report',
      super_admin: '/dashboard'
    };
    navigate(roleToRoute[res.data.user.role] || '/dashboard');
  };

  
// Add this function to refresh user data
  const refreshUser = async () => {
    try {
      const res = await api.get('/user');
      setUser(res.data);
      localStorage.setItem('user', JSON.stringify(res.data));
      console.log('User refreshed:', res.data); // Debug log
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
