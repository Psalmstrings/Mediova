import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { acceptTerms as apiAcceptTerms } from '../../services/api';
import { toast } from '../../components/ui/Toast';

export default function AcceptTermsPage() {
  const { user, logout, markTermsAccepted } = useAuth();
  const navigate = useNavigate();

  const [accepted, setAccepted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleAccept = async (e) => {
    e.preventDefault();
    if (!accepted) {
      toast.warning('Please select the checkbox to confirm your agreement before continuing.');
      return;
    }

    setSubmitting(true);
    try {
      const { data } = await apiAcceptTerms({
        termsAccepted: true,
        source: user?.termsAccepted ? 'renewed_acceptance' : 'login',
        declarationType: 'general',
      });

      if (data.success) {
        toast.success('Terms and Conditions accepted successfully.');
        markTermsAccepted(data.user);

        const dashMap = { admin: '/admin', influencer: '/influencer', vendor: '/vendor' };
        navigate(dashMap[data.user.role] || '/', { replace: true });
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to record acceptance. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDecline = () => {
    toast.info('You have declined the Terms. Access to protected features remains restricted.');
    logout();
    navigate('/login', { replace: true });
  };

  const roleTitle = user?.role === 'vendor' ? 'Advertiser / Vendor' : user?.role === 'influencer' ? 'WhatsApp Influencer' : 'Platform User';

  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc', padding: '32px 16px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ maxWidth: '680px', width: '100%', background: '#ffffff', borderRadius: '16px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)', padding: 'clamp(20px, 4vw, 36px)', boxSizing: 'border-box' }}>
        
        {/* Brand Header */}
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <span style={{ fontSize: '11px', fontWeight: '800', color: '#059669', textTransform: 'uppercase', letterSpacing: '0.05em', background: '#ecfdf5', padding: '4px 12px', borderRadius: '12px', display: 'inline-block', marginBottom: '8px' }}>
            Action Required &bull; {roleTitle}
          </span>
          <h1 style={{ fontSize: 'clamp(1.3rem, 4vw, 1.7rem)', fontWeight: '800', color: '#0f172a', margin: '4px 0 8px' }}>
            Review and Accept the Terms and Conditions
          </h1>
          <p style={{ color: '#64748b', fontSize: '14px', lineHeight: '1.6', margin: 0 }}>
            To continue accessing your {roleTitle} dashboard and participating on MEDIOVA, you must explicitly review and accept our contractual Terms of Service.
          </p>
        </div>

        {/* Scrollable Summary / Access Box */}
        <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '16px 20px', marginBottom: '24px', maxHeight: '240px', overflowY: 'auto' }}>
          <h3 style={{ fontSize: '13.5px', color: '#0f172a', fontWeight: '700', margin: '0 0 10px' }}>
            Key Platform &amp; Role-Specific Principles:
          </h3>
          <ul style={{ fontSize: '13px', lineHeight: '1.65', color: '#475569', paddingLeft: '20px', margin: 0 }}>
            <li><strong>Fair Marketplace Brokerage:</strong> MEDIOVA matches verified Advertisers with authentic WhatsApp creators and facilitates secure compensation upon verified task completion.</li>
            <li><strong>Truthful Advertising:</strong> All campaign creatives must be legal, substantiated, and comply with advertising standards (including ARCON where applicable).</li>
            <li><strong>Authentic Performance:</strong> Promoters must publish approved materials for the full duration (24 Hours) and submit genuine, unmanipulated screen evidence.</li>
            <li><strong>Data Protection &amp; Confidentiality:</strong> Compliant with the Nigeria Data Protection Act 2023. Private contact lists and personal conversations are never sold.</li>
            <li><strong>Transparent Fees &amp; Refunds:</strong> Disclosed platform charges and refund rights apply as set out in the platform policies.</li>
          </ul>
          <div style={{ marginTop: '12px', paddingTop: '10px', borderTop: '1px solid #e2e8f0', fontSize: '12.5px' }}>
            You can read the complete agreement anytime on our{' '}
            <a href="/terms" target="_blank" rel="noopener noreferrer" style={{ color: '#059669', fontWeight: '600', textDecoration: 'underline' }}>
              Terms and Conditions page
            </a>
            .
          </div>
        </div>

        {/* Acceptance Form */}
        <form onSubmit={handleAccept}>
          <div style={{ marginBottom: '24px', padding: '14px 16px', background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '10px' }}>
            <label style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', cursor: 'pointer', margin: 0 }}>
              <input
                type="checkbox"
                checked={accepted}
                onChange={(e) => setAccepted(e.target.checked)}
                style={{ width: '18px', height: '18px', marginTop: '3px', accentColor: '#059669', flexShrink: 0, cursor: 'pointer' }}
              />
              <span style={{ fontSize: '13.5px', color: '#166534', lineHeight: '1.6', fontWeight: '500' }}>
                I confirm that I have read, understood, and explicitly agree to the{' '}
                <a href="/terms" target="_blank" rel="noopener noreferrer" style={{ color: '#047857', fontWeight: '700', textDecoration: 'underline' }}>
                  MEDIOVA Terms and Conditions
                </a>
                , including all general platform rules and my role-specific obligations.
              </span>
            </label>
          </div>

          {/* Action Buttons */}
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            <button
              type="button"
              onClick={handleDecline}
              className="btn btn-ghost"
              style={{ flex: '1 1 140px', color: '#64748b', borderColor: '#cbd5e1' }}
            >
              Decline &amp; Sign Out
            </button>
            <button
              type="submit"
              disabled={submitting || !accepted}
              className="btn btn-primary"
              style={{
                flex: '2 1 200px',
                background: accepted ? '#059669' : '#94a3b8',
                borderColor: accepted ? '#059669' : '#94a3b8',
                cursor: accepted ? 'pointer' : 'not-allowed',
                fontWeight: '700',
              }}
            >
              {submitting ? 'Recording Acceptance...' : 'Accept and Continue →'}
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}
