import React from 'react';
import { Link } from 'react-router-dom';

export default function NotFoundPage() {
  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'var(--bg)',
      padding: '24px',
      textAlign: 'center',
    }}>
      <div style={{ fontSize: '72px', marginBottom: '16px', opacity: 0.4 }}>404</div>
      <h1 style={{ fontSize: '2rem', fontWeight: '800', color: 'var(--text-primary)', marginBottom: '12px' }}>
        Page Not Found
      </h1>
      <p style={{ color: 'var(--text-secondary)', maxWidth: '400px', marginBottom: '32px' }}>
        The page you're looking for doesn't exist or has been moved.
      </p>
      <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', justifyContent: 'center' }}>
        <Link to="/" className="btn btn-primary">
          Go to Homepage
        </Link>
        <button className="btn btn-outline" onClick={() => window.history.back()}>
          Go Back
        </button>
      </div>
    </div>
  );
}
