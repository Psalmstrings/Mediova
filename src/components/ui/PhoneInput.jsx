import React, { useState, useEffect } from 'react';
import { COUNTRIES, normalizePhoneNumber, isValidPhoneNumber } from '../../config/locations';

export default function PhoneInput({
  label = 'WhatsApp Phone Number',
  required = false,
  value = '',
  onChange,
  name = 'whatsappNumber',
  placeholder = '8012345678',
  hint = 'Enter your active WhatsApp number including international calling code.',
  defaultCountryCode = 'NG',
}) {
  const initialCountry = COUNTRIES.find((c) => c.code === defaultCountryCode) || COUNTRIES.find((c) => c.code === 'NG');
  const [callingCode, setCallingCode] = useState(initialCountry?.callingCode || '+234');
  const [localNumber, setLocalNumber] = useState('');

  // Sync internal state when defaultCountryCode changes externally
  useEffect(() => {
    if (defaultCountryCode) {
      const match = COUNTRIES.find((c) => c.code === defaultCountryCode);
      if (match && !value) {
        setCallingCode(match.callingCode);
      }
    }
  }, [defaultCountryCode]);

  // Sync internal state when external value changes
  useEffect(() => {
    if (!value) {
      setLocalNumber('');
      return;
    }
    // Check if value already starts with one of our calling codes
    const matched = COUNTRIES.find((c) => value.startsWith(c.callingCode));
    if (matched) {
      setCallingCode(matched.callingCode);
      setLocalNumber(value.slice(matched.callingCode.length).replace(/^[0]/, ''));
    } else if (value.startsWith('+')) {
      // Find longest matching prefix
      let longest = '';
      for (const c of COUNTRIES) {
        if (value.startsWith(c.callingCode) && c.callingCode.length > longest.length) {
          longest = c.callingCode;
        }
      }
      if (longest) {
        setCallingCode(longest);
        setLocalNumber(value.slice(longest.length).replace(/^[0]/, ''));
      } else {
        setLocalNumber(value);
      }
    } else {
      setLocalNumber(value.replace(/^[0]/, ''));
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
    const raw = e.target.value.replace(/[^0-9]/g, '');
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
        {label} {required && <span className="required" style={{ color: '#dc2626' }}>*</span>}
      </label>
      <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
        <select
          value={callingCode}
          onChange={handleCodeChange}
          className="form-control"
          style={{
            width: '140px',
            flexShrink: 0,
            background: '#f8fafc',
            fontWeight: '600',
            fontSize: '13px',
            cursor: 'pointer',
            height: '44px',
            borderRadius: '8px',
          }}
          aria-label="Country Calling Code"
        >
          {COUNTRIES.map((c) => (
            <option key={`${c.code}-${c.callingCode}`} value={c.callingCode}>
              {c.flag} {c.name} ({c.callingCode})
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
          style={{ flex: 1, height: '44px', borderRadius: '8px' }}
        />
      </div>
      {localNumber && (
        <div style={{ fontSize: '11px', color: '#64748b', marginTop: '4px' }}>
          Standard E.164: <strong style={{ color: isValid ? '#059669' : '#dc2626' }}>{normalizedVal}</strong>
        </div>
      )}
      {!isValid && localNumber && (
        <span className="form-error" style={{ color: '#dc2626', fontSize: '12px', display: 'block', marginTop: '4px' }}>
          Please enter a valid phone number (8-14 digits)
        </span>
      )}
      {hint && <span className="form-hint" style={{ fontSize: '12px', color: '#64748b', marginTop: '4px', display: 'block' }}>{hint}</span>}
    </div>
  );
}
