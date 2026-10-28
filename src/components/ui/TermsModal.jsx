import React, { useState } from 'react';

export default function TermsModal({ isOpen, onClose }) {
  if (!isOpen) return null;

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
        zIndex: 2000,
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
          maxWidth: '720px',
          width: '100%',
          maxHeight: '85vh',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
          overflow: 'hidden',
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
            <h3 style={{ margin: 0, fontSize: '1.25rem', color: '#0f172a', fontWeight: '700' }}>
              MEDIOVA Terms and Conditions
            </h3>
            <span style={{ fontSize: '12px', color: '#64748b' }}>Version 2.0 &bull; Effective Worldwide</span>
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
            }}
            aria-label="Close Terms"
          >
            &times;
          </button>
        </div>

        {/* Scrollable Body */}
        <div
          style={{
            padding: '24px',
            overflowY: 'auto',
            fontSize: '14px',
            lineHeight: '1.7',
            color: '#334155',
          }}
        >
          <div style={{ marginBottom: '20px' }}>
            <h4 style={{ color: '#0f172a', fontSize: '1rem', marginBottom: '8px' }}>1. Platform Agreement</h4>
            <p>
              Welcome to MEDIOVA. By registering an account as an Influencer or Vendor, or otherwise accessing our digital advertising and WhatsApp gig marketplace, you agree to be bound by these Terms and Conditions. These terms govern all campaigns, gig assignments, account verifications, and financial transactions carried out on MEDIOVA globally.
            </p>
          </div>

          <div style={{ marginBottom: '20px' }}>
            <h4 style={{ color: '#0f172a', fontSize: '1rem', marginBottom: '8px' }}>2. Role Integrity and Onboarding</h4>
            <p>
              Users register either as a <strong>Vendor</strong> (promoting campaigns, submitting advertising media, and paying for verified audience reach) or as an <strong>Influencer</strong> (receiving assigned gigs, publishing approved advertising status posts, and submitting video evidence of WhatsApp audience reach). Accounts may not engage in unauthorized role switching. All registered profile information, including contact WhatsApp numbers and administrative locations, must be accurate and up to date.
            </p>
          </div>

          <div style={{ marginBottom: '20px' }}>
            <h4 style={{ color: '#0f172a', fontSize: '1rem', marginBottom: '8px' }}>3. Influencer Verification and Gig Eligibility</h4>
            <p>
              Registration as an influencer does not automatically grant eligibility to receive paid gig assignments. All influencers must complete the mandatory <strong>Account Verification</strong> workflow by submitting an authentic, unedited verification video demonstrating genuine WhatsApp audience engagement. Administrators review each submission before granting verified, gig-eligible status. The platform strictly enforces backend gig assignment protections.
            </p>
          </div>

          <div style={{ marginBottom: '20px' }}>
            <h4 style={{ color: '#0f172a', fontSize: '1rem', marginBottom: '8px' }}>4. Video-Only Gig Completion Evidence</h4>
            <p>
              Assigned influencers must carry out their WhatsApp view tasks in accordance with campaign instructions and submit <strong>video evidence</strong> of their posted status and viewer metrics. Static screenshots or fabricated evidence are strictly prohibited and will result in immediate gig rejection, forfeiture of rewards, and potential account suspension.
            </p>
          </div>

          <div style={{ marginBottom: '20px' }}>
            <h4 style={{ color: '#0f172a', fontSize: '1rem', marginBottom: '8px' }}>5. Vendor Campaigns, Payments, and Completed-Work Review</h4>
            <p>
              Vendors submit campaigns with designated target geographic locations and agreed reach tiers. Payments must be remitted strictly in accordance with verified administrator instructions. Submitting payment proof does not automatically approve an order; an administrator must verify the transaction. Upon campaign completion, the administrator submits a completion summary and proof for vendor review. Vendors maintain the right to inspect work and raise legitimate revision issues.
            </p>
          </div>

          <div style={{ marginBottom: '20px' }}>
            <h4 style={{ color: '#0f172a', fontSize: '1rem', marginBottom: '8px' }}>6. Data Privacy and Confidentiality</h4>
            <p>
              MEDIOVA respects your privacy and processes personal data strictly in compliance with applicable international standards and data protection legislation, including the Nigeria Data Protection Act (NDPA) 2023 where applicable. Contact WhatsApp numbers are utilized solely for campaign coordination, gig alerts, and verified platform administration.
            </p>
          </div>

          <div>
            <h4 style={{ color: '#0f172a', fontSize: '1rem', marginBottom: '8px' }}>7. Dispute Resolution and Contact</h4>
            <p>
              Any disputes regarding campaign delivery, gig verification, or payment reconciliation may be lodged through MEDIOVA's dedicated Support Tickets or Complaints and Appeals system. Platform administrators investigate and resolve disputes equitably based on verified backend records.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div
          style={{
            padding: '16px 24px',
            borderTop: '1px solid #e2e8f0',
            display: 'flex',
            justifyContent: 'flex-end',
            background: '#f8fafc',
          }}
        >
          <button
            type="button"
            className="btn btn-primary"
            onClick={onClose}
            style={{
              padding: '10px 24px',
              borderRadius: '8px',
              fontWeight: '600',
              cursor: 'pointer',
            }}
          >
            I Understand &amp; Close
          </button>
        </div>
      </div>
    </div>
  );
}
