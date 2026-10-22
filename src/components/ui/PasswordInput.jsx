import React, { useState } from 'react';

export const checkPasswordCriteria = (pwd = '') => {
  return {
    minLength: pwd.length >= 8,
    hasUpper: /[A-Z]/.test(pwd),
    hasLower: /[a-z]/.test(pwd),
    hasNumber: /[0-9]/.test(pwd),
    hasSpecial: /[!@#$%^&*(),.?":{}|<>]/.test(pwd),
  };
};

export const getPasswordStrength = (pwd = '') => {
  const criteria = checkPasswordCriteria(pwd);
  const metCount = Object.values(criteria).filter(Boolean).length;
  if (metCount <= 2) return { score: 1, label: 'Weak', color: '#ef4444' };
  if (metCount <= 4) return { score: 2, label: 'Moderate', color: '#f59e0b' };
  return { score: 3, label: 'Strong', color: '#10b981' };
};

export default function PasswordInput({
  label = 'Password',
  required = false,
  value = '',
  onChange,
  name = 'password',
  placeholder = 'Min. 8 characters',
  showCriteria = false,
  autoComplete = 'current-password',
}) {
  const [showPassword, setShowPassword] = useState(false);

  const criteria = checkPasswordCriteria(value);
  const strength = getPasswordStrength(value);

  return (
    <div className="form-group password-input-component">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <label className="form-label" htmlFor={`pwd-input-${name}`}>
          {label} {required && <span className="required">*</span>}
        </label>
      </div>

      <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
        <input
          id={`pwd-input-${name}`}
          type={showPassword ? 'text' : 'password'}
          name={name}
          required={required}
          className="form-control"
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          autoComplete={autoComplete}
          style={{ paddingRight: '75px' }}
        />
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          aria-label={showPassword ? 'Hide password' : 'Show password'}
          style={{
            position: 'absolute',
            right: '8px',
            background: 'transparent',
            border: 'none',
            color: '#64748b',
            fontSize: '12px',
            fontWeight: '600',
            cursor: 'pointer',
            padding: '4px 8px',
            borderRadius: '4px',
            userSelect: 'none',
          }}
        >
          {showPassword ? 'Hide 👁️' : 'Show 👁️‍🗨️'}
        </button>
      </div>

      {showCriteria && value.length > 0 && (
        <div style={{ marginTop: '8px', background: '#f8fafc', padding: '10px 12px', borderRadius: '6px', border: '1px solid #e2e8f0' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
            <span style={{ fontSize: '11px', color: '#64748b', fontWeight: '600' }}>Strength:</span>
            <span style={{ fontSize: '11px', fontWeight: '700', color: strength.color }}>{strength.label}</span>
          </div>

          {/* Strength Bar */}
          <div style={{ height: '4px', width: '100%', background: '#e2e8f0', borderRadius: '2px', overflow: 'hidden', marginBottom: '8px' }}>
            <div
              style={{
                height: '100%',
                width: strength.score === 1 ? '33%' : strength.score === 2 ? '66%' : '100%',
                background: strength.color,
                transition: 'width 0.3s ease, background-color 0.3s ease',
              }}
            />
          </div>

          {/* Criteria Checklist */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4px', fontSize: '11px' }}>
            <div style={{ color: criteria.minLength ? '#059669' : '#94a3b8' }}>
              {criteria.minLength ? '✓' : '○'} 8+ characters
            </div>
            <div style={{ color: criteria.hasUpper ? '#059669' : '#94a3b8' }}>
              {criteria.hasUpper ? '✓' : '○'} Uppercase letter
            </div>
            <div style={{ color: criteria.hasLower ? '#059669' : '#94a3b8' }}>
              {criteria.hasLower ? '✓' : '○'} Lowercase letter
            </div>
            <div style={{ color: criteria.hasNumber ? '#059669' : '#94a3b8' }}>
              {criteria.hasNumber ? '✓' : '○'} Number (0-9)
            </div>
            <div style={{ color: criteria.hasSpecial ? '#059669' : '#94a3b8', gridColumn: 'span 2' }}>
              {criteria.hasSpecial ? '✓' : '○'} Special character (!@#$%^&*...)
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
