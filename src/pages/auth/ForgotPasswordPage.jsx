import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { forgotPassword } from '../../services/api';
import { toast } from '../../components/ui/Toast';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const supportWhatsApp =
    'https://wa.me/2348012345678?text=Hello%20MEDIOVA%20Support,%20I%20need%20assistance%20resetting%20my%20account%20password.';

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim()) {
      toast.warning('Please enter your account email address.');
      return;
    }

    setLoading(true);
    try {
      const { data } = await forgotPassword({ email: email.trim().toLowerCase() });
      setSubmitted(true);
      toast.success(data.message || 'Password reset instructions sent.');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to process request. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-side">
        <div className="auth-side-logo">MEDIOVA</div>
        <h2>Account Recovery</h2>
        <p>Recover access to your MEDIOVA influencer or vendor account securely.</p>
      </div>

      <div className="auth-form-side">
        <div className="auth-form-container">
          <div className="auth-form-header">
            <Link
              to="/login"
              style={{
                color: '#059669',
                fontWeight: '800',
                fontSize: '15px',
                display: 'inline-block',
                marginBottom: '16px',
              }}
            >
              ← Back to Login
            </Link>
            <h1>Reset Your Password</h1>
            <p>Enter the email address associated with your MEDIOVA account</p>
          </div>

          {submitted ? (
            <div style={{ textAlign: 'center', padding: '20px 0' }}>
              <div style={{ fontSize: '56px', marginBottom: '16px' }}>📬</div>
              <h3 style={{ fontSize: '1.4rem', marginBottom: '12px' }}>Check Your Email</h3>
              <p style={{ color: '#475569', lineHeight: '1.6', marginBottom: '24px', fontSize: '14px' }}>
                If an account with <strong>{email}</strong> exists in our system, you will receive single-use password reset instructions shortly. The link expires in 1 hour.
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <Link to="/login" className="btn btn-primary btn-block">
                  Return to Sign In
                </Link>
                <button
                  type="button"
                  className="btn btn-ghost btn-block"
                  onClick={() => {
                    setSubmitted(false);
                    setEmail('');
                  }}
                >
                  Request Another Link
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label" htmlFor="reset-email">
                  Registered Email Address <span className="required">*</span>
                </label>
                <input
                  id="reset-email"
                  type="email"
                  required
                  className="form-control"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <button
                type="submit"
                className="btn btn-primary btn-block btn-lg"
                disabled={loading}
                style={{ marginTop: '20px' }}
              >
                {loading ? 'Sending Reset Instructions...' : 'Send Password Reset Link →'}
              </button>

              <div
                style={{
                  marginTop: '32px',
                  paddingTop: '20px',
                  borderTop: '1px solid #e2e8f0',
                  textAlign: 'center',
                }}
              >
                <p style={{ fontSize: '13px', color: '#64748b', marginBottom: '12px' }}>
                  Need immediate administrative verification assistance?
                </p>
                <a
                  href={supportWhatsApp}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-sm btn-ghost"
                  style={{ color: '#25D366', fontWeight: '700' }}
                >
                  💬 Contact Admin Broker on WhatsApp
                </a>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
