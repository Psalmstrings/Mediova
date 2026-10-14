import React from 'react';
import { Link } from 'react-router-dom';

export default function VerifyEmailPage() {
  return (
    <div className="auth-page">
      <div className="auth-side">
        <div className="auth-side-logo">MEDIOVA</div>
        <h2>Direct Account Access</h2>
        <p>Connecting businesses with trusted, local WhatsApp Status audiences across Nigeria.</p>
      </div>

      <div className="auth-form-side">
        <div className="auth-form-container" style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '64px', marginBottom: '16px' }}>🎉</div>
          <h2 style={{ color: '#059669', marginBottom: '12px' }}>Email Verification Not Required</h2>
          <p style={{ color: '#334155', marginBottom: '24px', lineHeight: '1.6' }}>
            Email verification has been removed on MEDIOVA. All registered accounts can log in directly without verifying their email address.
          </p>
          <Link to="/login" className="btn btn-primary btn-block btn-lg">
            Proceed to Sign In →
          </Link>
        </div>
      </div>
    </div>
  );
}
