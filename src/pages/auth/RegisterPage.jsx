import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { register, googleAuth } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { toast } from '../../components/ui/Toast';
import PhoneInput from '../../components/ui/PhoneInput';
import PasswordInput, { checkPasswordCriteria } from '../../components/ui/PasswordInput';
import CountrySelect from '../../components/ui/CountrySelect';
import AdministrativeLocationSelect from '../../components/ui/AdministrativeLocationSelect';
import TermsModal from '../../components/ui/TermsModal';
import GoogleAuthButton from '../../components/ui/GoogleAuthButton';
import { isValidPhoneNumber, getCountryMeta } from '../../config/locations';

export default function RegisterPage() {
  const [searchParams] = useSearchParams();
  const initialRole = searchParams.get('role') === 'vendor' ? 'vendor' : 'influencer';

  const navigate = useNavigate();
  const { saveSession } = useAuth();
  const [role, setRole] = useState(initialRole);
  const [loading, setLoading] = useState(false);
  const [termsModalOpen, setTermsModalOpen] = useState(false);

  // Google Onboarding State (when user signs in with Google but needs to complete profile)
  const [googleOnboardingUser, setGoogleOnboardingUser] = useState(null);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    whatsappNumber: '',
    password: '',
    confirmPassword: '',
    // Country & Administrative Location
    country: 'Nigeria',
    countryCode: 'NG',
    region: 'Lagos',
    subDivision: 'Ikeja (Alausa/GRA)',
    area: '',
    // Vendor specific
    businessName: '',
    businessCategory: 'General Advertising',
    description: '',
    // Terms & Conditions
    termsAccepted: false,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleCountryChange = (e) => {
    const { value, countryCode } = e.target;
    setFormData((prev) => ({
      ...prev,
      country: value,
      countryCode: countryCode || 'NG',
      region: '', // Clear child on country change
      subDivision: '',
      area: '',
    }));
  };

  const handleLocationChange = (locationData) => {
    setFormData((prev) => ({
      ...prev,
      region: locationData.region,
      subDivision: locationData.subDivision,
      area: locationData.area,
    }));
  };

  // Google OAuth Success Handler
  const handleGoogleSuccess = async (credential) => {
    setLoading(true);
    try {
      const res = await googleAuth({
        credential,
        role,
        profileData: formData.termsAccepted
          ? {
              whatsappNumber: formData.whatsappNumber,
              country: formData.country,
              region: formData.region,
              subDivision: formData.subDivision,
              area: formData.area,
              businessName: formData.businessName,
              termsAccepted: formData.termsAccepted,
            }
          : null,
      });

      if (res.data.requiresOnboarding) {
        setGoogleOnboardingUser(res.data.googleUser);
        setFormData((prev) => ({
          ...prev,
          name: res.data.googleUser.name || prev.name,
          email: res.data.googleUser.email || prev.email,
        }));
        toast.info('Google account connected! Please complete your WhatsApp contact number and location to finish registration.');
      } else if (res.data.token && res.data.user) {
        saveSession(res.data.user, res.data.token);
        toast.success(`Welcome to MEDIOVA, ${res.data.user.name}!`);
        if (res.data.user.role === 'admin') {
          navigate('/admin/dashboard');
        } else if (res.data.user.role === 'vendor') {
          navigate('/vendor/dashboard');
        } else {
          navigate('/influencer/dashboard');
        }
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Google authentication failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Google Onboarding Form Submission
  const handleCompleteGoogleOnboarding = async (e) => {
    e.preventDefault();
    if (!formData.termsAccepted) {
      toast.warning('You must accept the Terms and Conditions to complete registration.');
      return;
    }

    if (!formData.whatsappNumber || !isValidPhoneNumber(formData.whatsappNumber)) {
      toast.error('Please enter a valid WhatsApp contact number in international format.');
      return;
    }

    setLoading(true);
    try {
      const res = await googleAuth({
        credential: googleOnboardingUser.googleId, // or pass googleId/email for completion
        role,
        profileData: {
          whatsappNumber: formData.whatsappNumber,
          country: formData.country,
          region: formData.region,
          subDivision: formData.subDivision,
          area: formData.area,
          businessName: formData.businessName,
          termsAccepted: true,
        },
      });

      if (res.data.token && res.data.user) {
        saveSession(res.data.user, res.data.token);
        toast.success('Registration completed successfully!');
        if (role === 'vendor') {
          navigate('/vendor/dashboard');
        } else {
          navigate('/influencer/dashboard');
        }
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to complete registration.');
    } finally {
      setLoading(false);
    }
  };

  // Standard Email/Password Form Submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name.trim() || !formData.email.trim() || !formData.whatsappNumber.trim() || !formData.password) {
      toast.warning('Please fill in all required fields marked with *.');
      return;
    }

    if (!formData.termsAccepted) {
      toast.warning('You must read and agree to the Terms and Conditions to register.');
      return;
    }

    if (!isValidPhoneNumber(formData.whatsappNumber)) {
      toast.error('Please provide a valid WhatsApp phone number with international calling code.');
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

    setLoading(true);
    try {
      const payload = {
        name: formData.name.trim(),
        email: formData.email.trim(),
        password: formData.password,
        role,
        whatsappNumber: formData.whatsappNumber,
        country: formData.country,
        countryCode: formData.countryCode,
        region: formData.region,
        subDivision: formData.subDivision,
        area: formData.area,
        termsAccepted: true,
        // Vendor fields
        businessName: role === 'vendor' ? (formData.businessName || formData.name) : undefined,
        businessCategory: role === 'vendor' ? formData.businessCategory : undefined,
        description: role === 'vendor' ? formData.description : undefined,
      };

      const res = await register(payload);

      if (res.data.success && res.data.token) {
        saveSession(res.data.user, res.data.token);
        toast.success(
          role === 'influencer'
            ? 'Account created! Please complete account verification to become eligible for gigs.'
            : 'Vendor account created successfully!'
        );
        if (role === 'vendor') {
          navigate('/vendor/dashboard');
        } else {
          navigate('/influencer/dashboard');
        }
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed. Please check your information and try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc', padding: '40px 16px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ width: '100%', maxWidth: '640px', background: '#ffffff', borderRadius: '16px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)', padding: '36px 32px' }}>
        
        {/* Brand Header */}
        <div style={{ textAlign: 'center', marginBottom: '28px' }}>
          <Link to="/" style={{ textDecoration: 'none' }}>
            <h1 style={{ fontSize: '1.75rem', fontWeight: '800', color: '#047857', margin: 0, letterSpacing: '-0.5px' }}>
              MEDIOVA
            </h1>
          </Link>
          <p style={{ color: '#64748b', fontSize: '14px', marginTop: '6px' }}>
            The Global WhatsApp Advertising &amp; Gig Marketplace
          </p>
        </div>

        {/* Role Toggle */}
        {!googleOnboardingUser && (
          <div style={{ marginBottom: '24px' }}>
            <label className="form-label" style={{ fontWeight: '600', marginBottom: '8px', display: 'block', textAlign: 'center' }}>
              I want to register as a:
            </label>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <button
                type="button"
                onClick={() => setRole('influencer')}
                style={{
                  padding: '12px 16px',
                  borderRadius: '10px',
                  border: role === 'influencer' ? '2px solid #059669' : '1px solid #cbd5e1',
                  background: role === 'influencer' ? '#ecfdf5' : '#ffffff',
                  color: role === 'influencer' ? '#065f46' : '#475569',
                  fontWeight: '600',
                  fontSize: '14px',
                  cursor: 'pointer',
                  textAlign: 'center',
                  transition: 'all 0.2s',
                }}
              >
                📱 WhatsApp Influencer
                <div style={{ fontSize: '11px', fontWeight: '400', color: '#64748b', marginTop: '2px' }}>
                  Earn from status views
                </div>
              </button>

              <button
                type="button"
                onClick={() => setRole('vendor')}
                style={{
                  padding: '12px 16px',
                  borderRadius: '10px',
                  border: role === 'vendor' ? '2px solid #059669' : '1px solid #cbd5e1',
                  background: role === 'vendor' ? '#ecfdf5' : '#ffffff',
                  color: role === 'vendor' ? '#065f46' : '#475569',
                  fontWeight: '600',
                  fontSize: '14px',
                  cursor: 'pointer',
                  textAlign: 'center',
                  transition: 'all 0.2s',
                }}
              >
                💼 Business / Vendor
                <div style={{ fontSize: '11px', fontWeight: '400', color: '#64748b', marginTop: '2px' }}>
                  Advertise to real audiences
                </div>
              </button>
            </div>
          </div>
        )}

        {/* Google Onboarding Notice */}
        {googleOnboardingUser ? (
          <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '10px', padding: '16px', marginBottom: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              {googleOnboardingUser.picture && (
                <img
                  src={googleOnboardingUser.picture}
                  alt={googleOnboardingUser.name}
                  style={{ width: '40px', height: '40px', borderRadius: '50%' }}
                />
              )}
              <div>
                <h4 style={{ margin: 0, fontSize: '14px', color: '#166534' }}>
                  Connected with Google as {googleOnboardingUser.name}
                </h4>
                <p style={{ margin: 0, fontSize: '12px', color: '#15803d' }}>
                  {googleOnboardingUser.email} &bull; Role: <strong>{role === 'vendor' ? 'Business / Vendor' : 'Influencer'}</strong>
                </p>
              </div>
            </div>
          </div>
        ) : (
          <>
            {/* Primary Option: Continue with Google */}
            <div style={{ marginBottom: '20px' }}>
              <GoogleAuthButton
                role={role}
                onCredentialSuccess={handleGoogleSuccess}
                onError={(msg) => toast.info(msg)}
              />
            </div>

            {/* Divider */}
            <div style={{ display: 'flex', alignItems: 'center', margin: '20px 0', color: '#94a3b8' }}>
              <div style={{ flex: 1, height: '1px', background: '#e2e8f0' }} />
              <span style={{ padding: '0 12px', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                or register with email
              </span>
              <div style={{ flex: 1, height: '1px', background: '#e2e8f0' }} />
            </div>
          </>
        )}

        {/* Registration Form */}
        <form onSubmit={googleOnboardingUser ? handleCompleteGoogleOnboarding : handleSubmit}>
          {/* Full Name / Contact Person */}
          <div className="form-group" style={{ marginBottom: '16px' }}>
            <label className="form-label" htmlFor="reg-name" style={{ fontWeight: '500', fontSize: '14px', marginBottom: '6px' }}>
              {role === 'vendor' ? 'Contact Person Name' : 'Full Name'} <span className="required" style={{ color: '#dc2626' }}>*</span>
            </label>
            <input
              id="reg-name"
              type="text"
              name="name"
              required
              className="form-control"
              placeholder="e.g. Samuel Okon"
              value={formData.name}
              onChange={handleChange}
              style={{ height: '44px', borderRadius: '8px' }}
            />
          </div>

          {/* Business Name (Vendor only) */}
          {role === 'vendor' && (
            <div className="form-group" style={{ marginBottom: '16px' }}>
              <label className="form-label" htmlFor="reg-businessName" style={{ fontWeight: '500', fontSize: '14px', marginBottom: '6px' }}>
                Business or Brand Name <span className="required" style={{ color: '#dc2626' }}>*</span>
              </label>
              <input
                id="reg-businessName"
                type="text"
                name="businessName"
                required
                className="form-control"
                placeholder="e.g. Apex Apparel Global"
                value={formData.businessName}
                onChange={handleChange}
                style={{ height: '44px', borderRadius: '8px' }}
              />
            </div>
          )}

          {/* Email Address */}
          {!googleOnboardingUser && (
            <div className="form-group" style={{ marginBottom: '16px' }}>
              <label className="form-label" htmlFor="reg-email" style={{ fontWeight: '500', fontSize: '14px', marginBottom: '6px' }}>
                Email Address <span className="required" style={{ color: '#dc2626' }}>*</span>
              </label>
              <input
                id="reg-email"
                type="email"
                name="email"
                required
                className="form-control"
                placeholder="you@example.com"
                value={formData.email}
                onChange={handleChange}
                style={{ height: '44px', borderRadius: '8px' }}
              />
            </div>
          )}

          {/* Single WhatsApp Contact Number */}
          <div style={{ marginBottom: '16px' }}>
            <PhoneInput
              label="Primary WhatsApp Contact Number"
              required
              name="whatsappNumber"
              value={formData.whatsappNumber}
              onChange={handleChange}
              defaultCountryCode={formData.countryCode}
              hint="Your single primary contact number for gig assignments, status verification, and alerts."
            />
          </div>

          {/* Global Country Selector */}
          <div style={{ marginBottom: '16px' }}>
            <CountrySelect
              label="Country of Residence / Operation"
              required
              name="country"
              value={formData.country}
              onChange={handleCountryChange}
            />
          </div>

          {/* Dynamic Administrative Location */}
          <div style={{ marginBottom: '16px' }}>
            <AdministrativeLocationSelect
              country={formData.country}
              region={formData.region}
              subDivision={formData.subDivision}
              area={formData.area}
              onChange={handleLocationChange}
              required
            />
          </div>

          {/* Password (if not Google onboarding) */}
          {!googleOnboardingUser && (
            <>
              <div style={{ marginBottom: '16px' }}>
                <PasswordInput
                  id="reg-password"
                  name="password"
                  label="Password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  showCriteria
                />
              </div>

              <div style={{ marginBottom: '20px' }}>
                <PasswordInput
                  id="reg-confirmPassword"
                  name="confirmPassword"
                  label="Confirm Password"
                  required
                  value={formData.confirmPassword}
                  onChange={handleChange}
                />
              </div>
            </>
          )}

          {/* Influencer Account Verification Advisory */}
          {role === 'influencer' && (
            <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '12px 16px', marginBottom: '20px', fontSize: '13px', color: '#475569' }}>
              <strong>Notice:</strong> Following registration, influencers enter a <em>Pending Verification</em> state. You must record and submit a short verification video to be approved for paid gig assignments.
            </div>
          )}

          {/* Mandatory Terms and Conditions Acceptance */}
          <div style={{ marginBottom: '24px', padding: '12px 14px', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px' }}>
            <label style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', cursor: 'pointer', fontSize: '13px', color: '#1e293b', margin: 0 }}>
              <input
                type="checkbox"
                name="termsAccepted"
                checked={formData.termsAccepted}
                onChange={handleChange}
                required
                style={{ width: '18px', height: '18px', marginTop: '2px', accentColor: '#059669', flexShrink: 0, cursor: 'pointer' }}
              />
              <span>
                I have read and agree to the{' '}
                <button
                  type="button"
                  onClick={() => setTermsModalOpen(true)}
                  style={{ background: 'none', border: 'none', padding: 0, color: '#059669', fontWeight: '600', textDecoration: 'underline', cursor: 'pointer', fontSize: '13px' }}
                >
                  Terms and Conditions
                </button>
                {' '}and acknowledge the global platform policies.
              </span>
            </label>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="btn btn-primary"
            disabled={loading || !formData.termsAccepted}
            style={{
              width: '100%',
              padding: '14px',
              fontSize: '15px',
              fontWeight: '600',
              borderRadius: '8px',
              background: formData.termsAccepted ? '#059669' : '#94a3b8',
              border: 'none',
              color: '#ffffff',
              cursor: formData.termsAccepted ? 'pointer' : 'not-allowed',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
            }}
          >
            {loading ? (
              <span className="spinner-sm" />
            ) : googleOnboardingUser ? (
              'Complete Registration & Proceed to Dashboard'
            ) : (
              `Create ${role === 'vendor' ? 'Vendor' : 'Influencer'} Account`
            )}
          </button>
        </form>

        {/* Login Link */}
        <div style={{ textAlign: 'center', marginTop: '24px', fontSize: '14px', color: '#64748b' }}>
          Already have an account?{' '}
          <Link to="/login" style={{ color: '#059669', fontWeight: '600', textDecoration: 'none' }}>
            Sign In
          </Link>
        </div>
      </div>

      {/* Terms and Conditions Modal */}
      <TermsModal isOpen={termsModalOpen} onClose={() => setTermsModalOpen(false)} />
    </div>
  );
}
