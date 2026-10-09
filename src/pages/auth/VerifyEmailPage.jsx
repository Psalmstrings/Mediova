import React, { useEffect, useState } from 'react';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import { verifyEmail } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { toast } from '../../components/ui/Toast';

export default function VerifyEmailPage() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const [status, setStatus] = useState('verifying'); // 'verifying', 'success', 'error'
  const [message, setMessage] = useState('');
  const { saveSession } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) {
      setStatus('error');
      setMessage('Missing verification token. Please check your verification link.');
      return;
    }

    const verify = async () => {
      try {
        const { data } = await verifyEmail({ token });
        if (data.success) {
          setStatus('success');
          setMessage(data.message || 'Your email has been verified successfully.');
          if (data.token && data.user) {
            saveSession(data.user, data.token);
          }
          toast.success('Email verified successfully!');
        }
      } catch (err) {
        setStatus('error');
        setMessage(err.response?.data?.message || 'Verification link is invalid or has expired.');
      }
    };

    verify();
  }, [token, saveSession]);

  return (
    <div className="auth-page">
      <div className="auth-side">
        <div className="auth-side-logo">DOP<span>tv</span></div>
        <h2>Account Activation</h2>
        <p>Confirming your credentials so you can start placing ads or earning rewards.</p>
      </div>

      <div className="auth-form-side">
        <div className="auth-form-container" style={{ textAlign: 'center' }}>
          {status === 'verifying' && (
            <>
              <div className="spinner" style={{ margin: '0 auto 20px' }} />
              <h2>Verifying Your Email...</h2>
              <p style={{ color: '#64748b' }}>Please wait while we confirm your activation token.</p>
            </>
          )}

          {status === 'success' && (
            <>
              <div style={{ fontSize: '64px', marginBottom: '16px' }}></div>
              <h2 style={{ color: '#059669', marginBottom: '12px' }}>Verified Successfully!</h2>
              <p style={{ color: '#334155', marginBottom: '24px', lineHeight: '1.6' }}>{message}</p>
              <Link to="/login" className="btn btn-primary btn-block btn-lg">
                Continue to Dashboard →
              </Link>
            </>
          )}

          {status === 'error' && (
            <>
              <div style={{ fontSize: '64px', marginBottom: '16px' }}>⚠️</div>
              <h2 style={{ color: '#dc2626', marginBottom: '12px' }}>Verification Failed</h2>
              <p style={{ color: '#64748b', marginBottom: '24px', lineHeight: '1.6' }}>{message}</p>
              <Link to="/login" className="btn btn-secondary btn-block">
                Back to Login
              </Link>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
