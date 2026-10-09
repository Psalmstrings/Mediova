import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { forgotPassword } from '../../services/api';
import { toast } from '../../components/ui/Toast';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [devResetUrl, setDevResetUrl] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data } = await forgotPassword({ email });
      setSent(true);
      if (data.resetUrl) setDevResetUrl(data.resetUrl);
      toast.success('Password reset instructions sent to your email.');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to request password reset.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-side">
        <div className="auth-side-logo">MEDIOVA</div>
        <h2>Account Recovery</h2>
        <p>Recover access to your MEDIOVA influencer or vendor account.</p>
      </div>

      <div className="auth-form-side">
        <div className="auth-form-container">
          <div className="auth-form-header">
            <Link to="/login" style={{ color: '#059669', fontWeight: '800', fontSize: '18px', display: 'inline-block', marginBottom: '12px' }}>
              ← Back to Login
            </Link>
            <h1>Reset Password</h1>
            <p>Enter your registered email address and we'll send you a recovery link</p>
          </div>

          {sent ? (
            <div style={{ textAlign: 'center', padding: '24px 0' }}>
              <div style={{ fontSize: '56px', marginBottom: '16px' }}></div>
              <h3>Check Your Email</h3>
              <p style={{ color: '#64748b', marginTop: '8px', marginBottom: '24px' }}>
                If an account exists with <strong>{email}</strong>, you will receive password reset instructions.
              </p>
              {devResetUrl && (
                <div style={{ background: '#ecfdf5', padding: '16px', borderRadius: '8px', border: '1px solid #a7f3d0', textAlign: 'left', marginBottom: '20px' }}>
                  <div style={{ fontSize: '12px', fontWeight: 'bold', color: '#065f46' }}> Quick Dev Reset Link:</div>
                  <a href={devResetUrl} className="btn btn-sm btn-primary" style={{ marginTop: '6px' }}>
                    Click Here to Reset Password →
                  </a>
                </div>
              )}
              <Link to="/login" className="btn btn-secondary btn-block">Back to Sign In</Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
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

              <button type="submit" className="btn btn-primary btn-block btn-lg" disabled={loading} style={{ marginTop: '20px' }}>
                {loading ? 'Sending Instructions...' : 'Send Reset Link'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
