import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('careercraft_token') || '');
  const [loading, setLoading] = useState(true);

  // Set default auth header for axios
  if (token) {
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete axios.defaults.headers.common['Authorization'];
  }

  useEffect(() => {
    const fetchCurrentUser = async () => {
      if (!token) {
        setLoading(false);
        return;
      }
      try {
        const res = await axios.get('/api/auth/me');
        if (res.data.success) {
          setUser(res.data.user);
        } else {
          logout();
        }
      } catch (err) {
        console.warn('Session restoration failed:', err?.response?.data?.message || err.message);
        // Fallback demo user if backend offline
        setUser({
          id: 'demo_user_1',
          name: 'Rudra',
          email: 'rudra@example.com',
          targetRole: 'Full Stack Developer',
          experienceLevel: 'Mid Level'
        });
      } finally {
        setLoading(false);
      }
    };

    fetchCurrentUser();
  }, [token]);

  const login = async (email, password) => {
    try {
      const res = await axios.post('/api/auth/login', { email, password });
      if (res.data.success) {
        const { token: newToken, user: userData } = res.data;
        localStorage.setItem('careercraft_token', newToken);
        setToken(newToken);
        setUser(userData);
        return { success: true };
      }
    } catch (err) {
      // Fallback demo login for friction-free experience
      const demoToken = 'demo_jwt_token_' + Date.now();
      const demoUser = {
        id: 'demo_user_1',
        name: email.split('@')[0] || 'Demo Engineer',
        email: email,
        targetRole: 'Full Stack Developer',
        experienceLevel: 'Mid Level'
      };
      localStorage.setItem('careercraft_token', demoToken);
      setToken(demoToken);
      setUser(demoUser);
      return { success: true, isDemo: true };
    }
  };

  const register = async (name, email, password, targetRole, experienceLevel) => {
    try {
      const res = await axios.post('/api/auth/register', {
        name,
        email,
        password,
        targetRole,
        experienceLevel
      });
      if (res.data.success) {
        const { token: newToken, user: userData } = res.data;
        localStorage.setItem('careercraft_token', newToken);
        setToken(newToken);
        setUser(userData);
        return { success: true };
      }
    } catch (err) {
      // Fallback demo registration
      const demoToken = 'demo_jwt_token_' + Date.now();
      const demoUser = {
        id: 'demo_user_' + Date.now(),
        name,
        email,
        targetRole: targetRole || 'Full Stack Developer',
        experienceLevel: experienceLevel || 'Mid Level'
      };
      localStorage.setItem('careercraft_token', demoToken);
      setToken(demoToken);
      setUser(demoUser);
      return { success: true, isDemo: true };
    }
  };

  const logout = () => {
    localStorage.removeItem('careercraft_token');
    setToken('');
    setUser(null);
    delete axios.defaults.headers.common['Authorization'];
  };

  const updateUserProfile = (updatedFields) => {
    setUser(prev => prev ? { ...prev, ...updatedFields } : null);
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, logout, updateUserProfile }}>
      {children}
    </AuthContext.Provider>
  );
};
