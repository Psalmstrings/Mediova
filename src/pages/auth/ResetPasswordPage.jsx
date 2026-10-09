import React, { useState } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { resetPassword } from '../../services/api';
import { toast } from '../../components/ui/Toast';

export default function ResetPasswordPage() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast.error('Passwords do not match.');
      return;
    }
    if (password.length < 6) {
      toast.error('Password must be at least 6 characters.');
      return;
    }

    setLoading(true);
    try {
      const { data } = await resetPassword({ token, password });
      toast.success(data.message || 'Password reset successfully!');
      navigate('/login');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Invalid or expired reset token.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-side">
        <div className="auth-side-logo">DOP<span>tv</span></div>
        <h2>Set New Password</h2>
        <p>Choose a secure password for your account.</p>
      </div>

      <div className="auth-form-side">
        <div className="auth-form-container">
          <div className="auth-form-header">
            <h1>Create New Password</h1>
            <p>Please enter your new password below</p>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">New Password <span className="required">*</span></label>
              <input
                type="password"
                required
                className="form-control"
                placeholder="Min. 6 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Confirm New Password <span className="required">*</span></label>
              <input
                type="password"
                required
                className="form-control"
                placeholder="Repeat password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>

            <button type="submit" className="btn btn-primary btn-block btn-lg" disabled={loading} style={{ marginTop: '20px' }}>
              {loading ? 'Updating Password...' : 'Reset Password'}
            </button>
          </form>

          <div className="auth-link">
            Remember your credentials? <Link to="/login">Sign in</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
