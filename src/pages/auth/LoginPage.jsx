import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { login } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { toast } from '../../components/ui/Toast';
import PasswordInput from '../../components/ui/PasswordInput';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const { saveSession } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data } = await login({ email: email.trim(), password });
      if (data.success) {
        saveSession(data.user, data.token);
        toast.success(`Welcome back, ${data.user.name}!`);

        const from = location.state?.from?.pathname;
        if (from) {
          navigate(from, { replace: true });
        } else {
          const dashMap = { admin: '/admin', influencer: '/influencer', vendor: '/vendor' };
          navigate(dashMap[data.user.role] || '/', { replace: true });
        }
      }
    } catch (err) {
      const message =
        err.response?.data?.message ||
        (err.code === 'ECONNABORTED'
          ? 'Server took too long to respond. Please try again.'
          : err.message === 'Network Error'
          ? 'Unable to connect to the server. Please check your internet connection.'
          : 'Invalid email or password. Please try again.');
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-side">
        <div className="auth-side-logo">
          MEDIOVA
        </div>
        <h2>Turn WhatsApp Views Into Income</h2>
        <p>Connecting businesses with trusted, local WhatsApp Status audiences across Nigeria.</p>

        <div className="auth-side-features">
          <div className="auth-side-feature">
            <div className="auth-check">✓</div>
            <span>Verified Nigerian WhatsApp micro-influencers</span>
          </div>
          <div className="auth-side-feature">
            <div className="auth-check">✓</div>
            <span>Hyper-local location and audience targeting</span>
          </div>
          <div className="auth-side-feature">
            <div className="auth-check">✓</div>
            <span>Guaranteed payouts upon proof approval</span>
          </div>
        </div>
      </div>

      <div className="auth-form-side">
        <div className="auth-form-container">
          <div className="auth-form-header">
            <Link to="/" style={{ color: 'var(--brand-green)', fontWeight: '800', fontSize: '18px', display: 'inline-block', marginBottom: '16px' }}>
              &larr; Back to MEDIOVA
            </Link>
            <h1>Welcome Back</h1>
            <p>Log in to access your advertising or earnings dashboard</p>
          </div>

          <form onSubmit={handleLogin}>
            <div className="form-group">
              <label className="form-label">Email Address <span className="required">*</span></label>
              <input
                type="email"
                required
                className="form-control"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="form-group">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                <span style={{ fontSize: '12px' }}></span>
                <Link to="/forgot-password" style={{ fontSize: '13px', color: '#059669', fontWeight: '600' }}>
                  Forgot Password?
                </Link>
              </div>
              <PasswordInput
                label="Password"
                required
                name="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
              />
            </div>

            <button type="submit" className="btn btn-primary btn-block btn-lg" disabled={loading} style={{ marginTop: '24px' }}>
              {loading ? 'Logging In...' : 'Sign In to Account'}
            </button>
          </form>

          <div className="auth-link">
            Don't have an account yet? <Link to="/register">Create an account</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
