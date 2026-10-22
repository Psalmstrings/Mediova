import React, { useState } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { resetPassword } from '../../services/api';
import { toast } from '../../components/ui/Toast';
import PasswordInput, { checkPasswordCriteria } from '../../components/ui/PasswordInput';

export default function ResetPasswordPage() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!token) {
      toast.error('Missing reset token. Please check your reset link or request a new one.');
      return;
    }

    const criteria = checkPasswordCriteria(password);
    const metCount = Object.values(criteria).filter(Boolean).length;
    if (metCount < 5) {
      toast.error('Password must meet all 5 security criteria (8+ characters, uppercase, lowercase, number, special character).');
      return;
    }

    if (password !== confirmPassword) {
      toast.error('Passwords do not match. Please re-enter.');
      return;
    }

    setLoading(true);
    try {
      const { data } = await resetPassword({ token, password });
      toast.success(data.message || 'Password reset successfully! You can now log in.');
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
        <div className="auth-side-logo">MEDIOVA</div>
        <h2>Set New Password</h2>
        <p>Choose a secure, strong password for your MEDIOVA account.</p>
      </div>

      <div className="auth-form-side">
        <div className="auth-form-container">
          <div className="auth-form-header">
            <h1>Create New Password</h1>
            <p>Please enter your new password meeting all security requirements</p>
          </div>

          <form onSubmit={handleSubmit}>
            <PasswordInput
              label="New Password"
              required
              name="password"
              placeholder="Min. 8 characters"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              showCriteria={true}
              autoComplete="new-password"
            />

            <PasswordInput
              label="Confirm New Password"
              required
              name="confirmPassword"
              placeholder="Repeat new password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              autoComplete="new-password"
            />

            <button
              type="submit"
              className="btn btn-primary btn-block btn-lg"
              disabled={loading}
              style={{ marginTop: '20px' }}
            >
              {loading ? 'Updating Password...' : 'Reset Password →'}
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
