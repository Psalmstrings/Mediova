import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { getMe, getNotifications } from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem('mediova_user') || localStorage.getItem('doptv_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });
  const [token, setToken] = useState(() => localStorage.getItem('mediova_token') || localStorage.getItem('doptv_token'));
  const [loading, setLoading] = useState(true);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  const saveSession = useCallback((userData, tokenData) => {
    setUser(userData);
    setToken(tokenData);
    localStorage.setItem('mediova_user', JSON.stringify(userData));
    localStorage.setItem('mediova_token', tokenData);
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    setToken(null);
    setNotifications([]);
    setUnreadCount(0);
    localStorage.removeItem('mediova_user');
    localStorage.removeItem('mediova_token');
    localStorage.removeItem('doptv_user');
    localStorage.removeItem('doptv_token');
  }, []);

  const fetchNotifications = useCallback(async () => {
    if (!token) return;
    try {
      const { data } = await getNotifications();
      setNotifications(data.notifications || []);
      setUnreadCount(data.unreadCount || 0);
    } catch {
      // silent fail
    }
  }, [token]);

  // Verify token on mount
  useEffect(() => {
    const verify = async () => {
      if (!token) {
        setLoading(false);
        return;
      }
      try {
        const { data } = await getMe();
        if (data.success) {
          setUser(data.user);
          localStorage.setItem('mediova_user', JSON.stringify(data.user));
        } else {
          logout();
        }
      } catch {
        logout();
      } finally {
        setLoading(false);
      }
    };
    verify();
  }, []); // eslint-disable-line

  // Fetch notifications periodically
  useEffect(() => {
    if (!token) return;
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 60000); // every 60s
    return () => clearInterval(interval);
  }, [token, fetchNotifications]);

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        notifications,
        unreadCount,
        saveSession,
        logout,
        fetchNotifications,
        setNotifications,
        setUnreadCount,
        isAdmin: user?.role === 'admin',
        isInfluencer: user?.role === 'influencer',
        isVendor: user?.role === 'vendor',
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
