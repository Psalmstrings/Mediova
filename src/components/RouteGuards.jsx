import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// Shows a centered loader while auth is initializing
export const LoadingScreen = () => (
  <div className="loading-screen">
    <div className="loading-logo">
      <span className="logo-icon"></span>
      <span className="logo-text">DOPtv</span>
    </div>
    <div className="spinner" />
  </div>
);

// Requires authentication + optional role
export const ProtectedRoute = ({ children, role }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) return <LoadingScreen />;

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (role && user.role !== role) {
    const dashMap = { admin: '/admin', influencer: '/influencer', vendor: '/vendor' };
    return <Navigate to={dashMap[user.role] || '/'} replace />;
  }

  return children;
};

// Redirect already-logged-in users away from auth pages
export const GuestRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) return <LoadingScreen />;

  if (user) {
    const dashMap = { admin: '/admin', influencer: '/influencer', vendor: '/vendor' };
    return <Navigate to={dashMap[user.role] || '/'} replace />;
  }

  return children;
};
