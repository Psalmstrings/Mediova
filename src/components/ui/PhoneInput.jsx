import React, { useState, useEffect } from 'react';
import { COUNTRY_CALLING_CODES, normalizePhoneNumber, isValidPhoneNumber } from '../../config/locations';

export default function PhoneInput({
  label = 'Phone Number',
  required = false,
  value = '',
  onChange,
  name = 'phone',
  placeholder = '08012345678',
  hint = '',
}) {
  const [callingCode, setCallingCode] = useState('+234');
  const [localNumber, setLocalNumber] = useState('');

  // Sync internal state when external value changes
  useEffect(() => {
    if (!value) {
      setLocalNumber('');
      return;
    }
    // Check if value already starts with one of our calling codes
    const matched = COUNTRY_CALLING_CODES.find((c) => value.startsWith(c.code));
    if (matched) {
      setCallingCode(matched.code);
      setLocalNumber(value.slice(matched.code.length));
    } else if (value.startsWith('+')) {
      setLocalNumber(value);
    } else {
      setLocalNumber(value);
    }
  }, [value]);

  const handleCodeChange = (e) => {
    const newCode = e.target.value;
    setCallingCode(newCode);
    const normalized = normalizePhoneNumber(localNumber, newCode);
    onChange({
      target: {
        name,
        value: normalized,
        rawNumber: localNumber,
        callingCode: newCode,
      },
    });
  };

  const handleNumberChange = (e) => {
    const raw = e.target.value;
    setLocalNumber(raw);
    const normalized = normalizePhoneNumber(raw, callingCode);
    onChange({
      target: {
        name,
        value: normalized,
        rawNumber: raw,
        callingCode,
      },
    });
  };

  const normalizedVal = normalizePhoneNumber(localNumber, callingCode);
  const isValid = !localNumber || isValidPhoneNumber(normalizedVal);

  return (
    <div className="form-group phone-input-component">
      <label className="form-label" htmlFor={`phone-input-${name}`}>
        {label} {required && <span className="required">*</span>}
      </label>
      <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
        <select
          value={callingCode}
          onChange={handleCodeChange}
          className="form-control"
          style={{
            width: '130px',
            flexShrink: 0,
            background: '#f8fafc',
            fontWeight: '600',
            fontSize: '13px',
            cursor: 'pointer',
          }}
          aria-label="Country Calling Code"
        >
          {COUNTRY_CALLING_CODES.map((c) => (
            <option key={c.code} value={c.code}>
              {c.flag} {c.code}
            </option>
          ))}
        </select>
        <input
          id={`phone-input-${name}`}
          type="tel"
          name={name}
          required={required}
          className={`form-control ${!isValid && localNumber ? 'is-invalid' : ''}`}
          placeholder={placeholder}
          value={localNumber}
          onChange={handleNumberChange}
          style={{ flex: 1 }}
        />
      </div>
      {localNumber && (
        <div style={{ fontSize: '11px', color: '#64748b', marginTop: '4px' }}>
          Standard E.164 format: <strong style={{ color: isValid ? '#059669' : '#dc2626' }}>{normalizedVal}</strong>
        </div>
      )}
      {!isValid && localNumber && (
        <span className="form-error" style={{ color: '#dc2626', fontSize: '12px', display: 'block', marginTop: '4px' }}>
          Please enter a valid phone number (8-14 digits)
        </span>
      )}
      {hint && <span className="form-hint">{hint}</span>}
    </div>
  );
}
