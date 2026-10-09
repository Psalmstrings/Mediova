import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { register } from '../../services/api';
import { toast } from '../../components/ui/Toast';

const nigerianStates = [
  'Lagos', 'Abuja (FCT)', 'Rivers', 'Oyo', 'Kano', 'Enugu', 'Delta', 'Anambra',
  'Ogun', 'Kaduna', 'Edo', 'Imo', 'Akwa Ibom', 'Plateau', 'Ondo', 'Kwara', 'Other',
];

const categoriesList = [
  'Fashion', 'Beauty', 'Electronics', 'Technology', 'Food', 'Restaurants',
  'Real Estate', 'Education', 'Finance', 'Business', 'Events', 'Entertainment',
  'Sports', 'Travel', 'Fitness', 'Automobile', 'E-commerce', 'Jobs & Career', 'Lifestyle',
];

export default function RegisterPage() {
  const [searchParams] = useSearchParams();
  const initialRole = searchParams.get('role') === 'vendor' ? 'vendor' : 'influencer';

  const [role, setRole] = useState(initialRole);
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [registered, setRegistered] = useState(false);
  const [registeredEmail, setRegisteredEmail] = useState('');
  const [devVerifyUrl, setDevVerifyUrl] = useState('');

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    // Location
    state: 'Lagos',
    city: 'Lagos',
    lga: '',
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

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match. Please check and re-enter.');
      return;
    }

    if (formData.password.length < 6) {
      toast.error('Password must be at least 6 characters long.');
      return;
    }

    setLoading(true);

    try {
      const payload = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        password: formData.password,
        role,
        state: formData.state,
        city: formData.city,
        lga: formData.lga,
        area: formData.area || 'General',
      };

      if (role === 'influencer') {
        payload.whatsappNumber = formData.whatsappNumber || formData.phone;
        payload.averageViews = Number(formData.averageViews) || 0;
        payload.categories = formData.selectedCategories;
        payload.additionalAreas = formData.additionalAreas
          ? formData.additionalAreas.split(',').map((s) => s.trim()).filter(Boolean)
          : [];
      } else {
        payload.businessName = formData.businessName || formData.name;
        payload.contactPerson = formData.contactPerson || formData.name;
        payload.businessCategory = formData.businessCategory;
        payload.description = formData.description;
        payload.businessAddress = formData.businessAddress;
        payload.website = formData.website;
        payload.socialLinks = { instagram: formData.instagram };
      }

      const { data } = await register(payload);

      if (data.success) {
        setRegistered(true);
        setRegisteredEmail(formData.email);
        setDevVerifyUrl(data.verificationUrl || '');
        toast.success('Registration successful! Please verify your email.');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed. Please check the fields and try again.');
    } finally {
      setLoading(false);
    }
  };

  if (registered) {
    return (
      <div className="auth-page">
        <div className="auth-side">
          <div className="auth-side-logo">MEDIOVA</div>
          <h2>Verification Email Sent!</h2>
          <p>We've sent an activation link to your email address to confirm your identity.</p>
        </div>
        <div className="auth-form-side">
          <div className="auth-form-container" style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '64px', marginBottom: '20px' }}>✉️</div>
            <h1 style={{ fontSize: '1.75rem', marginBottom: '12px' }}>Verify Your Email Address</h1>
            <p style={{ color: '#475569', lineHeight: '1.6', marginBottom: '24px' }}>
              We sent a verification link to <strong>{registeredEmail}</strong>. Please click the link inside that email to activate your account.
            </p>

            {devVerifyUrl && (
              <div style={{ background: '#ecfdf5', border: '1px solid #a7f3d0', padding: '16px', borderRadius: '8px', marginBottom: '24px', textAlign: 'left' }}>
                <span style={{ fontSize: '12px', fontWeight: 'bold', color: '#065f46' }}> Quick Development Link:</span>
                <div style={{ marginTop: '6px' }}>
                  <a href={devVerifyUrl} className="btn btn-sm btn-primary">
                    Verify Instantly Now →
                  </a>
                </div>
              </div>
            )}

            <div style={{ marginTop: '24px' }}>
              <Link to="/login" className="btn btn-secondary btn-block">
                Go to Sign In
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="auth-page">
      <div className="auth-side">
        <div className="auth-side-logo">
          MEDIOVA
        </div>
        <h2>{role === 'influencer' ? 'Get Paid for Status Views' : 'Reach Verified Audiences'}</h2>
        <p>
          {role === 'influencer'
            ? 'Monetize your daily WhatsApp status views through approved advertising campaigns.'
            : 'Grow your business with location-targeted micro-influencer campaigns across Nigeria.'}
        </p>
      </div>

      <div className="auth-form-side">
        <div className="auth-form-container" style={{ maxWidth: '520px' }}>
          <div className="auth-form-header">
            <Link to="/" style={{ color: 'var(--brand-green)', fontWeight: '800', fontSize: '18px', display: 'inline-block', marginBottom: '12px' }}>
              &larr; Back to MEDIOVA
            </Link>
            <h1>Create Account</h1>
            <p>Select your role and complete your profile</p>
          </div>

          {/* Role Selector */}
          <div className="role-selector">
            <div
              className={`role-option ${role === 'influencer' ? 'selected' : ''}`}
              onClick={() => { setRole('influencer'); setStep(1); }}
            >
              <div className="role-option-icon"></div>
              <div className="role-option-label">WhatsApp Influencer</div>
              <div className="role-option-desc">Earn from status views</div>
            </div>
            <div
              className={`role-option ${role === 'vendor' ? 'selected' : ''}`}
              onClick={() => { setRole('vendor'); setStep(1); }}
            >
              <div className="role-option-icon"></div>
              <div className="role-option-label">Business / Vendor</div>
              <div className="role-option-desc">Advertise your business</div>
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            {step === 1 && (
              <>
                <h4 style={{ marginBottom: '16px', color: '#0f172a' }}>Step 1: Account Information</h4>
                <div className="form-group">
                  <label className="form-label">Full Name <span className="required">*</span></label>
                  <input
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
                  <label className="form-label">Email Address <span className="required">*</span></label>
                  <input
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
                  <div className="form-group">
                    <label className="form-label">Phone Number <span className="required">*</span></label>
                    <input
                      type="tel"
                      required
                      name="phone"
                      className="form-control"
                      placeholder="08012345678"
                      value={formData.phone}
                      onChange={handleChange}
                    />
                  </div>
                  {role === 'influencer' && (
                    <div className="form-group">
                      <label className="form-label">WhatsApp Number <span className="required">*</span></label>
                      <input
                        type="tel"
                        required
                        name="whatsappNumber"
                        className="form-control"
                        placeholder="08012345678"
                        value={formData.whatsappNumber}
                        onChange={handleChange}
                      />
                    </div>
                  )}
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Password <span className="required">*</span></label>
                    <input
                      type="password"
                      required
                      name="password"
                      className="form-control"
                      placeholder="Min. 6 chars"
                      value={formData.password}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Confirm Password <span className="required">*</span></label>
                    <input
                      type="password"
                      required
                      name="confirmPassword"
                      className="form-control"
                      placeholder="Repeat password"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <button
                  type="button"
                  className="btn btn-primary btn-block"
                  style={{ marginTop: '16px' }}
                  onClick={() => {
                    if (!formData.name || !formData.email || !formData.phone || !formData.password) {
                      toast.warning('Please fill in all required fields to proceed.');
                      return;
                    }
                    if (formData.password !== formData.confirmPassword) {
                      toast.error('Passwords do not match.');
                      return;
                    }
                    setStep(2);
                  }}
                >
                  Continue to Next Step →
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
                    ← Back
                  </button>
                </div>

                {/* Common Location Fields */}
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">State <span className="required">*</span></label>
                    <select
                      name="state"
                      className="form-control"
                      value={formData.state}
                      onChange={handleChange}
                    >
                      {nigerianStates.map((s) => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">City / Town</label>
                    <input
                      type="text"
                      name="city"
                      className="form-control"
                      placeholder="e.g. Lagos, Ikeja"
                      value={formData.city}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">LGA (Local Govt Area)</label>
                    <input
                      type="text"
                      name="lga"
                      className="form-control"
                      placeholder="e.g. Eti-Osa"
                      value={formData.lga}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Area / Neighborhood <span className="required">*</span></label>
                    <input
                      type="text"
                      required
                      name="area"
                      className="form-control"
                      placeholder="e.g. Lekki Phase 1"
                      value={formData.area}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                {role === 'influencer' ? (
                  <>
                    <div className="form-group">
                      <label className="form-label">Other Areas You Can Reach</label>
                      <input
                        type="text"
                        name="additionalAreas"
                        className="form-control"
                        placeholder="e.g. Victoria Island, Ikoyi, Ajah (comma separated)"
                        value={formData.additionalAreas}
                        onChange={handleChange}
                      />
                      <span className="form-hint">Vendors search for influencers who reach neighboring districts.</span>
                    </div>

                    <div className="form-group">
                      <label className="form-label">Average WhatsApp Status Views</label>
                      <input
                        type="number"
                        name="averageViews"
                        min="100"
                        className="form-control"
                        placeholder="e.g. 1500"
                        value={formData.averageViews}
                        onChange={handleChange}
                      />
                      <span className="form-hint">You will be asked to upload screenshots to verify this figure.</span>
                    </div>

                    <div className="form-group">
                      <label className="form-label">Categories You're Comfortable Promoting</label>
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
                      <label className="form-label">Business / Company Name <span className="required">*</span></label>
                      <input
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
                        <label className="form-label">Business Category</label>
                        <select
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
                        <label className="form-label">Instagram Handle</label>
                        <input
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
                      <label className="form-label">Business Address</label>
                      <input
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

                <button
                  type="submit"
                  className="btn btn-primary btn-block btn-lg"
                  disabled={loading}
                  style={{ marginTop: '20px' }}
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
