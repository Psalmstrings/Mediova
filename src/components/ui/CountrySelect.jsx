import React, { useState, useMemo } from 'react';
import { COUNTRIES } from '../../config/locations';

export default function CountrySelect({
  label = 'Country',
  value = 'Nigeria',
  onChange,
  required = false,
  name = 'country',
  hint = '',
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  // Find currently selected country
  const selectedCountry = useMemo(() => {
    return (
      COUNTRIES.find(
        (c) =>
          c.name.toLowerCase() === (value || '').toLowerCase() ||
          c.code.toLowerCase() === (value || '').toLowerCase()
      ) || COUNTRIES.find((c) => c.code === 'NG')
    );
  }, [value]);

  // Filter countries alphabetically by search
  const filteredCountries = useMemo(() => {
    if (!searchTerm.trim()) return COUNTRIES;
    const term = searchTerm.toLowerCase();
    return COUNTRIES.filter(
      (c) =>
        c.name.toLowerCase().includes(term) ||
        c.callingCode.includes(term) ||
        c.code.toLowerCase().includes(term)
    );
  }, [searchTerm]);

  const handleSelect = (country) => {
    onChange({
      target: {
        name,
        value: country.name,
        countryCode: country.code,
        callingCode: country.callingCode,
        currency: country.currency,
        adminLevel: country.adminLevel,
        localLevel: country.localLevel,
      },
    });
    setIsOpen(false);
    setSearchTerm('');
  };

  return (
    <div className="form-group country-select-component" style={{ position: 'relative' }}>
      <label className="form-label" htmlFor={`country-select-${name}`}>
        {label} {required && <span className="required" style={{ color: '#dc2626' }}>*</span>}
      </label>

      {/* Button to toggle searchable selector */}
      <div
        id={`country-select-${name}`}
        tabIndex={0}
        onClick={() => setIsOpen(!isOpen)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            setIsOpen(!isOpen);
          }
        }}
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '10px 14px',
          border: '1px solid #cbd5e1',
          borderRadius: '8px',
          background: '#ffffff',
          cursor: 'pointer',
          userSelect: 'none',
          minHeight: '44px',
        }}
      >
        <span style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', fontWeight: '500' }}>
          <span style={{ fontSize: '18px' }}>{selectedCountry?.flag || '🌐'}</span>
          <span>{selectedCountry?.name || 'Select Country'}</span>
          <span style={{ color: '#64748b', fontSize: '12px' }}>({selectedCountry?.callingCode})</span>
        </span>
        <span style={{ color: '#64748b', fontSize: '12px' }}>{isOpen ? '▲' : '▼'}</span>
      </div>

      {isOpen && (
        <div
          style={{
            position: 'absolute',
            top: '100%',
            left: 0,
            right: 0,
            zIndex: 1000,
            background: '#ffffff',
            border: '1px solid #e2e8f0',
            borderRadius: '8px',
            boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1), 0 8px 10px -6px rgba(0,0,0,0.1)',
            marginTop: '4px',
            maxHeight: '280px',
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <div style={{ padding: '8px', borderBottom: '1px solid #f1f5f9' }}>
            <input
              type="text"
              autoFocus
              placeholder="Search country name or code..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="form-control"
              style={{
                fontSize: '13px',
                padding: '8px 12px',
                width: '100%',
                borderRadius: '6px',
              }}
              onClick={(e) => e.stopPropagation()}
            />
          </div>

          <div style={{ overflowY: 'auto', flex: 1, maxHeight: '220px' }}>
            {filteredCountries.length === 0 ? (
              <div style={{ padding: '12px', textAlign: 'center', color: '#94a3b8', fontSize: '13px' }}>
                No countries match "{searchTerm}"
              </div>
            ) : (
              filteredCountries.map((c) => {
                const isSelected = selectedCountry?.code === c.code;
                return (
                  <div
                    key={c.code}
                    onClick={() => handleSelect(c)}
                    style={{
                      padding: '10px 14px',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      fontSize: '13px',
                      background: isSelected ? '#ecfdf5' : 'transparent',
                      color: isSelected ? '#047857' : '#1e293b',
                      borderBottom: '1px solid #f8fafc',
                    }}
                    onMouseEnter={(e) => {
                      if (!isSelected) e.currentTarget.style.background = '#f8fafc';
                    }}
                    onMouseLeave={(e) => {
                      if (!isSelected) e.currentTarget.style.background = 'transparent';
                    }}
                  >
                    <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ fontSize: '16px' }}>{c.flag}</span>
                      <span style={{ fontWeight: isSelected ? '600' : '400' }}>{c.name}</span>
                    </span>
                    <span style={{ color: '#64748b', fontSize: '12px' }}>{c.callingCode}</span>
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}

      {hint && <span className="form-hint" style={{ fontSize: '12px', color: '#64748b', marginTop: '4px', display: 'block' }}>{hint}</span>}
    </div>
  );
}
