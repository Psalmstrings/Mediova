import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { register } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { toast } from '../../components/ui/Toast';
import PhoneInput from '../../components/ui/PhoneInput';
import PasswordInput, { checkPasswordCriteria } from '../../components/ui/PasswordInput';
import { NIGERIAN_STATES, STATE_LGAS, isValidPhoneNumber } from '../../config/locations';

const categoriesList = [
  'Fashion', 'Beauty', 'Electronics', 'Technology', 'Food', 'Restaurants',
  'Real Estate', 'Education', 'Finance', 'Business', 'Events', 'Entertainment',
  'Sports', 'Travel', 'Fitness', 'Automobile', 'E-commerce', 'Jobs & Career', 'Lifestyle',
];

export default function RegisterPage() {
  const [searchParams] = useSearchParams();
  const initialRole = searchParams.get('role') === 'vendor' ? 'vendor' : 'influencer';

  const { saveSession } = useAuth();
  const [role, setRole] = useState(initialRole);
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [registered, setRegistered] = useState(false);
  const [registeredEmail, setRegisteredEmail] = useState('');

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    // Country & Location
    country: 'Nigeria',
    state: 'Lagos',
    city: 'Lagos',
    lga: 'Eti-Osa (Ikoyi/Victoria Island/Lekki)',
    area: '',
    additionalAreas: '',
    // Influencer
    whatsappNumber: '',
    averageViews: '',
    selectedCategories: ['Fashion', 'Lifestyle'],
    // Vendor
    businessName: '',
    contactPerson: '',
    businessCategory: 'General Advertising',
    description: '',
    businessAddress: '',
    website: '',
    instagram: '',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleStateChange = (e) => {
    const newState = e.target.value;
    const lgas = STATE_LGAS[newState] || [];
    setFormData({
      ...formData,
      state: newState,
      lga: lgas.length > 0 ? lgas[0] : '',
      city: newState,
    });
  };

  const handleCategoryToggle = (cat) => {
    const exists = formData.selectedCategories.includes(cat);
    if (exists) {
      setFormData({
        ...formData,
        selectedCategories: formData.selectedCategories.filter((c) => c !== cat),
      });
    } else {
      setFormData({
        ...formData,
        selectedCategories: [...formData.selectedCategories, cat],
      });
    }
  };

  const handleStep1Next = () => {
    if (!formData.name.trim() || !formData.email.trim() || !formData.phone.trim() || !formData.password) {
      toast.warning('Please fill in all required fields marked with *.');
      return;
    }

    if (!isValidPhoneNumber(formData.phone)) {
      toast.error('Please provide a valid international telephone number.');
      return;
    }

    if (role === 'influencer' && formData.whatsappNumber && !isValidPhoneNumber(formData.whatsappNumber)) {
      toast.error('Please provide a valid WhatsApp number.');
      return;
    }

    const criteria = checkPasswordCriteria(formData.password);
    const metCount = Object.values(criteria).filter(Boolean).length;
    if (metCount < 5) {
      toast.error('Password does not satisfy all complexity requirements (8+ chars, upper, lower, number, special char).');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match. Please re-enter.');
      return;
    }

    setStep(2);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.area.trim()) {
      toast.warning('Please specify your Area / Neighborhood.');
      return;
    }

    setLoading(true);

    try {
      const payload = {
        name: formData.name.trim(),
        email: formData.email.trim().toLowerCase(),
        phone: formData.phone.trim(),
        password: formData.password,
        role,
        state: formData.state,
        city: formData.city.trim(),
        lga: formData.lga.trim(),
        area: formData.area.trim(),
      };

      if (role === 'influencer') {
        payload.whatsappNumber = formData.whatsappNumber || formData.phone;
        payload.averageViews = Number(formData.averageViews) || 0;
        payload.categories = formData.selectedCategories;
        payload.additionalAreas = formData.additionalAreas
          ? formData.additionalAreas.split(',').map((s) => s.trim()).filter(Boolean)
          : [];
      } else {
        payload.businessName = formData.businessName.trim() || formData.name.trim();
        payload.contactPerson = formData.contactPerson.trim() || formData.name.trim();
        payload.businessCategory = formData.businessCategory;
        payload.description = formData.description.trim();
        payload.businessAddress = formData.businessAddress.trim();
        payload.website = formData.website.trim();
        payload.socialLinks = { instagram: formData.instagram.trim() };
      }

      const { data } = await register(payload);

      if (data.success) {
        if (data.token && data.user) {
          saveSession(data.user, data.token);
        }
        setRegistered(true);
        setRegisteredEmail(formData.email);
        toast.success('Registration successful! Welcome to MEDIOVA.');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed. Please check the fields and try again.');
    } finally {
      setLoading(false);
    }
  };

  if (registered) {
    const dashPath = role === 'vendor' ? '/vendor' : '/influencer';
    return (
      <div className="auth-page">
        <div className="auth-side">
          <div className="auth-side-logo">MEDIOVA</div>
          <h2>Account Created Successfully!</h2>
          <p>Your {role === 'vendor' ? 'Vendor / Advertiser' : 'WhatsApp Influencer'} account is active and ready to use.</p>
        </div>
        <div className="auth-form-side">
          <div className="auth-form-container" style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '64px', marginBottom: '20px' }}>🎉</div>
            <h1 style={{ fontSize: '1.75rem', marginBottom: '12px' }}>Welcome to MEDIOVA!</h1>
            <p style={{ color: '#475569', lineHeight: '1.6', marginBottom: '28px' }}>
              Your account has been registered for <strong>{registeredEmail}</strong>. You can now access your dashboard immediately.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <Link to={dashPath} className="btn btn-primary btn-block btn-lg">
                Continue to Dashboard →
              </Link>
              <Link to="/login" className="btn btn-secondary btn-block">
                Go to Sign In
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const currentLgas = STATE_LGAS[formData.state] || [];

  return (
    <div className="auth-page">
      <div className="auth-side">
        <div className="auth-side-logo">MEDIOVA</div>
        <h2>Direct WhatsApp Reach Across Nigeria</h2>
        <p>
          Connect verified Nigerian WhatsApp creators with growing businesses for high-converting Status promotions.
        </p>
        <div style={{ marginTop: '24px', padding: '16px', background: 'rgba(255,255,255,0.08)', borderRadius: '8px', fontSize: '13px' }}>
          <strong>📍 Operating Coverage:</strong> Nigeria (All 36 States & FCT Abuja). International brand registrations supported with standard calling codes.
        </div>
      </div>

      <div className="auth-form-side">
        <div className="auth-form-container">
          <div className="auth-form-header">
            <Link to="/" style={{ color: '#059669', fontWeight: '800', fontSize: '18px', display: 'inline-block', marginBottom: '16px' }}>
              MEDIOVA
            </Link>
            <h1>Create an Account</h1>
            <p>Join Nigeria's premier WhatsApp Status advertising marketplace</p>
          </div>

          {/* Role Selector Tabs */}
          <div className="role-selector" style={{ marginBottom: '24px' }}>
            <div
              className={`role-option ${role === 'influencer' ? 'selected' : ''}`}
              onClick={() => { setRole('influencer'); setStep(1); }}
            >
              <div className="role-option-icon">📱</div>
              <div className="role-option-label">WhatsApp Influencer</div>
              <div className="role-option-desc">Monetize your Status views</div>
            </div>
            <div
              className={`role-option ${role === 'vendor' ? 'selected' : ''}`}
              onClick={() => { setRole('vendor'); setStep(1); }}
            >
              <div className="role-option-icon">💼</div>
              <div className="role-option-label">Business / Vendor</div>
              <div className="role-option-desc">Advertise your business</div>
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            {step === 1 && (
              <>
                <h4 style={{ marginBottom: '16px', color: '#0f172a' }}>Step 1: Account Information</h4>

                <div className="form-group">
                  <label className="form-label" htmlFor="reg-name">Full Name <span className="required">*</span></label>
                  <input
                    id="reg-name"
                    type="text"
                    required
                    name="name"
                    className="form-control"
                    placeholder="e.g. Amaka Okafor"
                    value={formData.name}
                    onChange={handleChange}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="reg-email">Email Address <span className="required">*</span></label>
                  <input
                    id="reg-email"
                    type="email"
                    required
                    name="email"
                    className="form-control"
                    placeholder="amaka@example.com"
                    value={formData.email}
                    onChange={handleChange}
                  />
                </div>

                <div className="form-row">
                  <PhoneInput
                    label="Phone Number"
                    required
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="08012345678"
                    hint="International format normalized automatically."
                  />
                  {role === 'influencer' && (
                    <PhoneInput
                      label="WhatsApp Number"
                      required
                      name="whatsappNumber"
                      value={formData.whatsappNumber}
                      onChange={handleChange}
                      placeholder="08012345678"
                      hint="Where gig updates are confirmed."
                    />
                  )}
                </div>

                <div className="form-row">
                  <PasswordInput
                    label="Password"
                    required
                    name="password"
                    placeholder="Min. 8 characters"
                    value={formData.password}
                    onChange={handleChange}
                    showCriteria={true}
                    autoComplete="new-password"
                  />
                  <PasswordInput
                    label="Confirm Password"
                    required
                    name="confirmPassword"
                    placeholder="Repeat password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    autoComplete="new-password"
                  />
                </div>

                <button
                  type="button"
                  className="btn btn-primary btn-block"
                  style={{ marginTop: '20px' }}
                  onClick={handleStep1Next}
                >
                  Continue to Step 2: Location & Reach →
                </button>
              </>
            )}

            {step === 2 && (
              <>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                  <h4 style={{ margin: 0, color: '#0f172a' }}>
                    {role === 'influencer' ? 'Step 2: Location & Reach Details' : 'Step 2: Business & Location Details'}
                  </h4>
                  <button type="button" className="btn btn-sm btn-ghost" onClick={() => setStep(1)}>
                    ← Back to Step 1
                  </button>
                </div>

                <div className="alert alert-info" style={{ fontSize: '13px', marginBottom: '16px' }}>
                  📍 <strong>Geographic Scope:</strong> Audience distribution and verified gigs currently operate across Nigeria. Select your state and local government area.
                </div>

                {/* Dependent Location Fields */}
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label" htmlFor="reg-country">Country</label>
                    <select
                      id="reg-country"
                      name="country"
                      className="form-control"
                      value={formData.country}
                      onChange={handleChange}
                    >
                      <option value="Nigeria">Nigeria 🇳🇬</option>
                      <option value="Ghana">Ghana 🇬🇭</option>
                      <option value="Kenya">Kenya 🇰🇪</option>
                      <option value="Other">Other / International</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label" htmlFor="reg-state">State / Region <span className="required">*</span></label>
                    <select
                      id="reg-state"
                      name="state"
                      className="form-control"
                      value={formData.state}
                      onChange={handleStateChange}
                    >
                      {NIGERIAN_STATES.map((s) => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label" htmlFor="reg-lga">LGA (Local Government Area)</label>
                    {currentLgas.length > 0 ? (
                      <select
                        id="reg-lga"
                        name="lga"
                        className="form-control"
                        value={formData.lga}
                        onChange={handleChange}
                      >
                        {currentLgas.map((l) => (
                          <option key={l} value={l}>{l}</option>
                        ))}
                      </select>
                    ) : (
                      <input
                        id="reg-lga"
                        type="text"
                        name="lga"
                        className="form-control"
                        placeholder="e.g. Local Area"
                        value={formData.lga}
                        onChange={handleChange}
                      />
                    )}
                  </div>
                  <div className="form-group">
                    <label className="form-label" htmlFor="reg-area">Area / Neighborhood <span className="required">*</span></label>
                    <input
                      id="reg-area"
                      type="text"
                      required
                      name="area"
                      className="form-control"
                      placeholder="e.g. Lekki Phase 1, Yaba, Ikeja"
                      value={formData.area}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                {role === 'influencer' ? (
                  <>
                    <div className="form-group">
                      <label className="form-label">Other Areas You Reach (Optional)</label>
                      <input
                        type="text"
                        name="additionalAreas"
                        className="form-control"
                        placeholder="e.g. Victoria Island, Ikoyi, Ajah (comma-separated)"
                        value={formData.additionalAreas}
                        onChange={handleChange}
                      />
                      <span className="form-hint">Enables advertisers to match with you when targeting neighboring districts.</span>
                    </div>

                    <div className="form-group">
                      <label className="form-label">Estimated WhatsApp Status Views</label>
                      <input
                        type="number"
                        name="averageViews"
                        min="100"
                        className="form-control"
                        placeholder="e.g. 1500"
                        value={formData.averageViews}
                        onChange={handleChange}
                      />
                      <span className="form-hint">You will submit status screenshots in your dashboard to verify this metric.</span>
                    </div>

                    <div className="form-group">
                      <label className="form-label">Promotion Categories</label>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '6px' }}>
                        {categoriesList.map((cat) => {
                          const selected = formData.selectedCategories.includes(cat);
                          return (
                            <button
                              type="button"
                              key={cat}
                              onClick={() => handleCategoryToggle(cat)}
                              style={{
                                padding: '6px 12px',
                                borderRadius: '16px',
                                border: selected ? '2px solid #059669' : '1px solid #cbd5e1',
                                background: selected ? '#ecfdf5' : 'white',
                                color: selected ? '#065f46' : '#475569',
                                fontWeight: selected ? '700' : '500',
                                fontSize: '12px',
                                cursor: 'pointer',
                              }}
                            >
                              {selected ? `✓ ${cat}` : `+ ${cat}`}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="form-group">
                      <label className="form-label" htmlFor="reg-bname">Business / Company Name <span className="required">*</span></label>
                      <input
                        id="reg-bname"
                        type="text"
                        required
                        name="businessName"
                        className="form-control"
                        placeholder="e.g. Lekki Luxe Boutique"
                        value={formData.businessName}
                        onChange={handleChange}
                      />
                    </div>

                    <div className="form-row">
                      <div className="form-group">
                        <label className="form-label" htmlFor="reg-bcat">Business Category</label>
                        <select
                          id="reg-bcat"
                          name="businessCategory"
                          className="form-control"
                          value={formData.businessCategory}
                          onChange={handleChange}
                        >
                          {categoriesList.map((c) => (
                            <option key={c} value={c}>{c}</option>
                          ))}
                        </select>
                      </div>
                      <div className="form-group">
                        <label className="form-label" htmlFor="reg-ig">Instagram Handle (Optional)</label>
                        <input
                          id="reg-ig"
                          type="text"
                          name="instagram"
                          className="form-control"
                          placeholder="@mybusiness"
                          value={formData.instagram}
                          onChange={handleChange}
                        />
                      </div>
                    </div>

                    <div className="form-group">
                      <label className="form-label" htmlFor="reg-baddr">Business Address (Optional)</label>
                      <input
                        id="reg-baddr"
                        type="text"
                        name="businessAddress"
                        className="form-control"
                        placeholder="e.g. Suite 4, Admiralty Way, Lekki"
                        value={formData.businessAddress}
                        onChange={handleChange}
                      />
                    </div>
                  </>
                )}

                <div style={{ margin: '20px 0 16px', fontSize: '12px', color: '#64748b', lineHeight: '1.6' }}>
                  By registering, you acknowledge and agree to MEDIOVA's{' '}
                  <Link to="/terms" target="_blank" style={{ color: '#059669', textDecoration: 'underline' }}>
                    Terms of Service & Confidentiality
                  </Link>
                  ,{' '}
                  <Link to="/privacy" target="_blank" style={{ color: '#059669', textDecoration: 'underline' }}>
                    Privacy Policy (NDPA 2023)
                  </Link>
                  , and{' '}
                  <Link to="/refund-policy" target="_blank" style={{ color: '#059669', textDecoration: 'underline' }}>
                    Refund Policy
                  </Link>
                  .
                </div>

                <button
                  type="submit"
                  className="btn btn-primary btn-block btn-lg"
                  disabled={loading}
                >
                  {loading ? 'Submitting Registration...' : 'Complete Registration →'}
                </button>
              </>
            )}
          </form>

          <div className="auth-link">
            Already have an account? <Link to="/login">Sign in here</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
