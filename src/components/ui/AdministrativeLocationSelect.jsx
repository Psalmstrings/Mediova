import React, { useMemo } from 'react';
import { getCountryMeta, getRegionsForCountry, getLgasForState } from '../../config/locations';

export default function AdministrativeLocationSelect({
  country = 'Nigeria',
  region = '',
  subDivision = '',
  area = '',
  onChange,
  required = false,
  disabled = false,
}) {
  const countryMeta = useMemo(() => getCountryMeta(country), [country]);
  const regions = useMemo(() => getRegionsForCountry(country), [country]);
  const subDivisions = useMemo(() => getLgasForState(region), [region]);

  const adminLevelLabel = countryMeta?.adminLevel || 'State / Region';
  const localLevelLabel = countryMeta?.localLevel || 'Local Division';

  const handleRegionChange = (e) => {
    const newRegion = e.target.value;
    onChange({
      country,
      region: newRegion,
      subDivision: '', // Clear child division on parent change
      area: '',
    });
  };

  const handleSubDivisionChange = (e) => {
    const newSub = e.target.value;
    onChange({
      country,
      region,
      subDivision: newSub,
      area: subDivision === 'Other' ? area : (newSub === 'Other' ? '' : area),
    });
  };

  const handleAreaChange = (e) => {
    onChange({
      country,
      region,
      subDivision,
      area: e.target.value,
    });
  };

  return (
    <div className="admin-location-select" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
      {/* Primary Administrative Level (e.g. State, Province, County, Region) */}
      <div className="form-group" style={{ marginBottom: 0 }}>
        <label className="form-label" style={{ fontWeight: '500', fontSize: '14px', marginBottom: '6px' }}>
          {adminLevelLabel} {required && <span className="required" style={{ color: '#dc2626' }}>*</span>}
        </label>
        {regions.length > 0 ? (
          <select
            className="form-control"
            value={region}
            onChange={handleRegionChange}
            required={required}
            disabled={disabled}
            style={{ width: '100%', height: '44px', borderRadius: '8px' }}
          >
            <option value="">-- Select {adminLevelLabel} --</option>
            {regions.map((r) => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
            <option value="Other">Other {adminLevelLabel}</option>
          </select>
        ) : (
          <input
            type="text"
            className="form-control"
            placeholder={`Enter your ${adminLevelLabel}`}
            value={region}
            onChange={handleRegionChange}
            required={required}
            disabled={disabled}
            style={{ width: '100%', height: '44px', borderRadius: '8px' }}
          />
        )}
      </div>

      {/* Child Division (e.g. LGA, County, District, Municipality) */}
      {region && (
        <div className="form-group" style={{ marginBottom: 0 }}>
          <label className="form-label" style={{ fontWeight: '500', fontSize: '14px', marginBottom: '6px' }}>
            {localLevelLabel} {required && <span className="required" style={{ color: '#dc2626' }}>*</span>}
          </label>
          {subDivisions.length > 0 ? (
            <select
              className="form-control"
              value={subDivision}
              onChange={handleSubDivisionChange}
              required={required}
              disabled={disabled}
              style={{ width: '100%', height: '44px', borderRadius: '8px' }}
            >
              <option value="">-- Select {localLevelLabel} --</option>
              {subDivisions.map((sub) => (
                <option key={sub} value={sub}>
                  {sub}
                </option>
              ))}
              <option value="Other">Other / Not Listed</option>
            </select>
          ) : (
            <input
              type="text"
              className="form-control"
              placeholder={`Enter your ${localLevelLabel} (optional)`}
              value={subDivision}
              onChange={handleSubDivisionChange}
              disabled={disabled}
              style={{ width: '100%', height: '44px', borderRadius: '8px' }}
            />
          )}
        </div>
      )}

      {/* Local Neighborhood / Area / Community field (optional or fallback) */}
      {region && (
        <div className="form-group" style={{ marginBottom: 0 }}>
          <label className="form-label" style={{ fontWeight: '500', fontSize: '14px', marginBottom: '6px' }}>
            Area / Neighborhood / City
          </label>
          <input
            type="text"
            className="form-control"
            placeholder="e.g. Downtown, Ikeja GRA, Brooklyn, Sandton, Westlands"
            value={area}
            onChange={handleAreaChange}
            disabled={disabled}
            style={{ width: '100%', height: '44px', borderRadius: '8px' }}
          />
          <span className="form-hint" style={{ fontSize: '12px', color: '#64748b', marginTop: '4px', display: 'block' }}>
            Specify your neighborhood, commercial district, or locality.
          </span>
        </div>
      )}
    </div>
  );
}
