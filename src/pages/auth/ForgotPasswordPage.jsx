import React from 'react';
import { Link } from 'react-router-dom';

export default function ForgotPasswordPage() {
  const supportWhatsApp = 'https://wa.me/2348012345678?text=Hello%20MEDIOVA%20Support,%20I%20need%20assistance%20resetting%20my%20account%20password.';

  return (
    <div className="auth-page">
      <div className="auth-side">
        <div className="auth-side-logo">MEDIOVA</div>
        <h2>Account Recovery</h2>
        <p>Recover access to your MEDIOVA influencer or vendor account.</p>
      </div>

      <div className="auth-form-side">
        <div className="auth-form-container" style={{ textAlign: 'center' }}>
          <div className="auth-form-header" style={{ textAlign: 'center' }}>
            <Link to="/login" style={{ color: '#059669', fontWeight: '800', fontSize: '18px', display: 'inline-block', marginBottom: '16px' }}>
              ← Back to Login
            </Link>
            <div style={{ fontSize: '56px', marginBottom: '16px' }}>🔑</div>
            <h1>Password Recovery Notice</h1>
            <p style={{ marginTop: '8px', lineHeight: '1.6', color: '#475569' }}>
              Automated email password recovery is currently unavailable as platform email delivery is strictly reserved for influencer gig notifications.
            </p>
          </div>

          <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '20px', marginBottom: '24px', textAlign: 'left' }}>
            <p style={{ margin: '0 0 12px', fontSize: '14px', color: '#334155', lineHeight: '1.6' }}>
              To recover your account or reset your password, please message our administrative broker support team on WhatsApp with your registered email address:
            </p>
            <a
              href={supportWhatsApp}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-primary btn-block btn-lg"
              style={{ background: '#25D366', borderColor: '#25D366', color: 'white' }}
            >
              Contact Support on WhatsApp →
            </a>
          </div>

          <Link to="/login" className="btn btn-secondary btn-block">
            Back to Sign In
          </Link>
        </div>
      </div>
    </div>
  );
}
