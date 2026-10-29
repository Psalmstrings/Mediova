import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

export default function TermsModal({
  isOpen,
  onClose,
  onAccept,
  isAccepted = false,
  role = 'influencer',
}) {
  const [agreed, setAgreed] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setAgreed(isAccepted);
    }
  }, [isOpen, isAccepted]);

  if (!isOpen) return null;

  const handleConfirm = () => {
    if (onAccept) {
      onAccept();
    }
    onClose();
  };

  return (
    <div
      className="modal-overlay"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(15, 23, 42, 0.75)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 2500,
        padding: '16px',
        backdropFilter: 'blur(4px)',
      }}
      onClick={onClose}
    >
      <div
        className="modal-card"
        style={{
          background: '#ffffff',
          borderRadius: '16px',
          maxWidth: '780px',
          width: '100%',
          maxHeight: '90vh',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
          overflow: 'hidden',
          animation: 'fadeIn 0.2s ease-out',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          style={{
            padding: '20px 24px',
            borderBottom: '1px solid #e2e8f0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            background: '#f8fafc',
          }}
        >
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
              <span style={{ fontSize: '20px' }}>📜</span>
              <h3 style={{ margin: 0, fontSize: '1.25rem', color: '#0f172a', fontWeight: '700' }}>
                MEDIOVA Terms and Conditions of Service
              </h3>
            </div>
            <div style={{ fontSize: '12px', color: '#64748b' }}>
              Summary of Platform Terms &bull; Effective Worldwide &bull; Governing Nigerian Law
            </div>
          </div>
          <button
            onClick={onClose}
            style={{
              background: 'transparent',
              border: 'none',
              fontSize: '24px',
              cursor: 'pointer',
              color: '#64748b',
              padding: '4px 8px',
              borderRadius: '6px',
              lineHeight: 1,
            }}
            aria-label="Close Terms"
          >
            &times;
          </button>
        </div>

        {/* Scrollable Summary Body */}
        <div
          style={{
            padding: '24px',
            overflowY: 'auto',
            fontSize: '13.5px',
            lineHeight: '1.65',
            color: '#334155',
          }}
        >
          <div
            style={{
              background: '#f0fdf4',
              border: '1px solid #bbf7d0',
              borderRadius: '8px',
              padding: '12px 16px',
              marginBottom: '20px',
              fontSize: '13px',
              color: '#166534',
            }}
          >
            <strong>Mandatory Review:</strong> You must read and accept these terms to register and participate on MEDIOVA. For the complete, unabridged legal agreement, you can open the{' '}
            <a
              href="/terms"
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: '#059669', fontWeight: '700', textDecoration: 'underline' }}
            >
              Full Terms &amp; Conditions Page &rarr;
            </a>
          </div>

          {/* Section 1 */}
          <div style={{ marginBottom: '18px' }}>
            <h4 style={{ color: '#0f172a', fontSize: '0.95rem', margin: '0 0 6px', fontWeight: '700' }}>
              1. Platform Nature and Marketplace Scope
            </h4>
            <p style={{ margin: 0 }}>
              MEDIOVA operates as a managed digital advertising and WhatsApp audience marketplace. We serve as an independent broker connecting <strong>Vendors/Advertisers</strong> (seeking verified audience reach) with <strong>Influencers/Promoters</strong> (broadcasting approved advertising materials on WhatsApp Status). We provide escrow services, campaign routing, performance auditing, and settlement infrastructure.
            </p>
          </div>

          {/* Section 2 */}
          <div style={{ marginBottom: '18px' }}>
            <h4 style={{ color: '#0f172a', fontSize: '0.95rem', margin: '0 0 6px', fontWeight: '700' }}>
              2. Strict Mutually Exclusive Account Roles
            </h4>
            <p style={{ margin: 0 }}>
              Accounts are strictly separated into two distinct roles: <strong>Vendor</strong> or <strong>Influencer</strong>. No user may hold or operate both roles simultaneously, and cross-portal role switching is technically restricted and prohibited. Profile and contact information (including international phone and active WhatsApp numbers) must be genuine, accurate, and current.
            </p>
          </div>

          {/* Section 3 */}
          <div style={{ marginBottom: '18px' }}>
            <h4 style={{ color: '#0f172a', fontSize: '0.95rem', margin: '0 0 6px', fontWeight: '700' }}>
              3. Age Requirement and Account Security
            </h4>
            <p style={{ margin: 0 }}>
              You must be at least <strong>18 years old</strong> to register. You are solely responsible for maintaining the confidentiality of your login credentials and for all activities carried out under your account. Creating duplicate, deceptive, or automated accounts is grounds for immediate termination.
            </p>
          </div>

          {/* Section 4 */}
          <div style={{ marginBottom: '18px' }}>
            <h4 style={{ color: '#0f172a', fontSize: '0.95rem', margin: '0 0 6px', fontWeight: '700' }}>
              4. Influencer Onboarding and Mandatory Video Verification
            </h4>
            <p style={{ margin: 0 }}>
              Registration as an Influencer does not confer automatic gig eligibility. Every Influencer must complete mandatory <strong>Account Verification</strong> by recording and submitting an unedited video showing their active WhatsApp status audience metrics. Platform administrators audit and verify submissions before unlocking paid gig assignments.
            </p>
          </div>

          {/* Section 5 */}
          <div style={{ marginBottom: '18px' }}>
            <h4 style={{ color: '#0f172a', fontSize: '0.95rem', margin: '0 0 6px', fontWeight: '700' }}>
              5. Influencer Gig Performance and Video-Only Evidence
            </h4>
            <ul style={{ margin: '6px 0 0', paddingLeft: '20px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <li><strong>Minimum 24-Hour Duration:</strong> Approved advert creative and copy must remain posted continuously on your WhatsApp Status for at least 24 hours without premature deletion.</li>
              <li><strong>Exact Approved Assets:</strong> Influencers must publish the exact media and copy provided by the Vendor without misleading alterations.</li>
              <li><strong>Screen-Recording Video Proof Only:</strong> Completed gig evidence must be submitted as a screen-recording video capturing the status views list. Static screenshots, cropped images, or manipulated evidence are strictly rejected and will result in forfeiture of rewards.</li>
            </ul>
          </div>

          {/* Section 6 */}
          <div style={{ marginBottom: '18px' }}>
            <h4 style={{ color: '#0f172a', fontSize: '0.95rem', margin: '0 0 6px', fontWeight: '700' }}>
              6. Vendor Campaigns, Advance Escrow, and Work Review
            </h4>
            <ul style={{ margin: '6px 0 0', paddingLeft: '20px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <li><strong>Advance Escrow Funding:</strong> Vendors deposit the campaign budget in advance. Funds are safely held in escrow until influencer performance is audited and confirmed.</li>
              <li><strong>Targeting Specifications:</strong> Vendors specify geographic reach (nationwide or multi-state coverage) and category requirements.</li>
              <li><strong>Completed-Work Inspection:</strong> Upon campaign completion, Vendors receive a full delivery summary and evidence report. Legitimate non-performance issues may be raised within the designated inspection window.</li>
            </ul>
          </div>

          {/* Section 7 */}
          <div style={{ marginBottom: '18px' }}>
            <h4 style={{ color: '#0f172a', fontSize: '0.95rem', margin: '0 0 6px', fontWeight: '700' }}>
              7. Payments, Wallet Settlements, and Transparent Fees
            </h4>
            <p style={{ margin: 0 }}>
              All payments are processed via licensed Payment Service Providers (PSPs). Upon Admin verification of gig completion, funds are released from escrow to the Influencer's platform wallet, less applicable platform commissions. Influencers may request withdrawals to their verified local bank accounts subject to standard processing windows.
            </p>
          </div>

          {/* Section 8 */}
          <div style={{ marginBottom: '18px' }}>
            <h4 style={{ color: '#0f172a', fontSize: '0.95rem', margin: '0 0 6px', fontWeight: '700' }}>
              8. Zero Tolerance for Prohibited Content and Malpractice
            </h4>
            <p style={{ margin: 0 }}>
              The platform strictly prohibits: fraudulent schemes, Ponzi/MLM operations, adult/sexually explicit content, hate speech, counterfeit goods, defamatory material, artificial view bots, view-farming rings, and non-circumvention (attempting to solicit off-platform deals with platform contacts). Violations lead to immediate account suspension and earnings forfeiture.
            </p>
          </div>

          {/* Section 9 */}
          <div style={{ marginBottom: '18px' }}>
            <h4 style={{ color: '#0f172a', fontSize: '0.95rem', margin: '0 0 6px', fontWeight: '700' }}>
              9. Independent Contractor Status
            </h4>
            <p style={{ margin: 0 }}>
              Users operate as independent contractors. Nothing in these Terms establishes an employment, partnership, joint venture, or agency relationship between you and MEDIOVA. Users are solely responsible for their own tax obligations.
            </p>
          </div>

          {/* Section 10 */}
          <div style={{ marginBottom: '18px' }}>
            <h4 style={{ color: '#0f172a', fontSize: '0.95rem', margin: '0 0 6px', fontWeight: '700' }}>
              10. Data Protection and Confidentiality
            </h4>
            <p style={{ margin: 0 }}>
              We process personal data in compliance with the Nigeria Data Protection Act (NDPA) 2023 and applicable privacy standards. WhatsApp numbers and account data are utilized solely for campaign matching, gig dispatch, and verification. Non-public campaign details, pricing metrics, and backend data remain confidential.
            </p>
          </div>

          {/* Section 11 */}
          <div style={{ marginBottom: '18px' }}>
            <h4 style={{ color: '#0f172a', fontSize: '0.95rem', margin: '0 0 6px', fontWeight: '700' }}>
              11. Dispute Resolution and Complaints Escalation
            </h4>
            <p style={{ margin: 0 }}>
              All disputes must first be submitted to our dedicated Support Desk or Complaints and Appeals procedure. If an amicable settlement is not reached within 30 business days, disputes shall be resolved through final and binding arbitration in accordance with Nigerian law.
            </p>
          </div>

          {/* Section 12 */}
          <div>
            <h4 style={{ color: '#0f172a', fontSize: '0.95rem', margin: '0 0 6px', fontWeight: '700' }}>
              12. Binding Schedules A &amp; B Declarations
            </h4>
            <p style={{ margin: 0 }}>
              By accepting these Terms, Vendors specifically warrant and confirm the <strong>Schedule A Declaration</strong> (confirming ownership, advertising authorization, and truthfulness of all claims), and Influencers specifically warrant and confirm the <strong>Schedule B Declaration</strong> (confirming delivery compliance, genuine views, and unaltered evidence).
            </p>
          </div>
        </div>

        {/* Footer with Acceptance Checkbox and Action Buttons */}
        <div
          style={{
            padding: '16px 24px',
            borderTop: '1px solid #e2e8f0',
            background: '#f8fafc',
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',
          }}
        >
          {/* Checkbox inside modal */}
          <label
            style={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: '10px',
              cursor: 'pointer',
              fontSize: '13px',
              color: '#1e293b',
              margin: 0,
              userSelect: 'none',
            }}
          >
            <input
              type="checkbox"
              checked={agreed}
              onChange={(e) => setAgreed(e.target.checked)}
              style={{
                width: '18px',
                height: '18px',
                marginTop: '1px',
                accentColor: '#059669',
                cursor: 'pointer',
                flexShrink: 0,
              }}
            />
            <span style={{ lineHeight: '1.4' }}>
              I have read, understood, and accept the <strong>MEDIOVA Terms and Conditions of Service</strong>, including all operational policies, dispute procedures, and declarations.
            </span>
          </label>

          {/* Action Buttons */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'flex-end',
              gap: '12px',
              flexWrap: 'wrap',
            }}
          >
            <button
              type="button"
              className="btn btn-ghost"
              onClick={onClose}
              style={{
                padding: '10px 18px',
                fontSize: '14px',
                borderRadius: '8px',
              }}
            >
              Cancel / Read Later
            </button>
            <button
              type="button"
              className="btn btn-primary"
              disabled={!agreed}
              onClick={handleConfirm}
              style={{
                padding: '10px 24px',
                fontSize: '14px',
                fontWeight: '600',
                borderRadius: '8px',
                background: agreed ? '#059669' : '#94a3b8',
                border: 'none',
                color: '#ffffff',
                cursor: agreed ? 'pointer' : 'not-allowed',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                opacity: agreed ? 1 : 0.65,
              }}
            >
              Accept Terms &amp; Proceed
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
