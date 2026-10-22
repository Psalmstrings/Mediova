import React from 'react';
import { Link } from 'react-router-dom';
import { PublicNav, Footer } from './LandingPage';

export default function PrivacyPage() {
  return (
    <div>
      <PublicNav />
      <div style={{ background: '#0f172a', color: 'white', padding: '60px 24px', textAlign: 'center' }}>
        <h1 style={{ color: 'white', fontSize: '2.5rem', marginBottom: '8px' }}>Privacy Policy</h1>
        <p style={{ color: '#94a3b8' }}>
          Aligned with the Nigeria Data Protection Act 2023 (NDPA 2023)
        </p>
        <div style={{ marginTop: '12px', fontSize: '13px', color: '#cbd5e1' }}>
          Effective Date: 21 October 2026 &bull; Version 2.0
        </div>
      </div>

      <div style={{ maxWidth: '850px', margin: '60px auto', padding: '0 24px', lineHeight: '1.8', color: '#334155' }}>
        
        <div className="alert alert-info" style={{ marginBottom: '32px', fontSize: '13px' }}>
          ℹ️ <strong>Legal Notice:</strong> This Privacy Policy outlines the operational data processing practices of MEDIOVA Technology Marketplace. Specific statutory interpretations, retention schedules, and governance commitments are scheduled for periodic review by qualified privacy counsel under NDPC guidance.
        </div>

        <h2 style={{ marginBottom: '16px', color: '#0f172a' }}>1. Introduction & Overview</h2>
        <p style={{ marginBottom: '24px' }}>
          MEDIOVA ("we", "our", or "the Platform") operates a managed advertising brokerage connecting commercial advertisers ("Vendors") with verified WhatsApp content creators ("Influencers") across Nigeria. We are committed to safeguarding the privacy and fundamental rights of all platform users in full compliance with the <strong>Nigeria Data Protection Act 2023 (NDPA 2023)</strong> and applicable directives of the <strong>Nigeria Data Protection Commission (NDPC)</strong>.
        </p>

        <h2 style={{ marginBottom: '16px', color: '#0f172a' }}>2. Personal Data We Collect</h2>
        <p style={{ marginBottom: '12px' }}>
          We collect and process only the minimal personal data necessary to facilitate commercial campaigns, verify audience reach, and disburse creator rewards:
        </p>
        <ul style={{ paddingLeft: '24px', marginBottom: '24px' }}>
          <li><strong>Identity & Account Details:</strong> Full name, verified email address, and encrypted password credentials.</li>
          <li><strong>Telecommunications Data:</strong> Standardized contact telephone numbers and WhatsApp numbers stored in international E.164 format.</li>
          <li><strong>Geographic Location Data:</strong> Country (Nigeria primary), State, Local Government Area (LGA), and designated neighborhood/market areas to enable accurate hyper-local campaign audience targeting.</li>
          <li><strong>Campaign & Creative Assets:</strong> Promotional flyers, videos, ad copies, destination links, and advertiser business profiles.</li>
          <li><strong>Audience Verification Proofs:</strong> WhatsApp Status screenshots showing viewer timestamps and view metrics submitted by creators to claim gig rewards.</li>
          <li><strong>Disbursement & Payment Data:</strong> Nigerian NUBAN bank account numbers, bank names, and account holder names. <em>Note: MEDIOVA does not process or store credit/debit card numbers or card security codes (CVV).</em></li>
          <li><strong>Technical & Usage Data:</strong> IP addresses, browser types, session timestamps, and administrative audit trails.</li>
        </ul>

        <h2 style={{ marginBottom: '16px', color: '#0f172a' }}>3. Lawful Bases for Data Processing</h2>
        <p style={{ marginBottom: '12px' }}>
          Under Section 25 of the NDPA 2023, MEDIOVA processes personal data under the following recognized lawful grounds:
        </p>
        <ul style={{ paddingLeft: '24px', marginBottom: '24px' }}>
          <li><strong>Contractual Performance:</strong> Processing is required to create your account, match advertising campaigns, verify status gigs, and disburse agreed creator remuneration.</li>
          <li><strong>Legal Obligation:</strong> Maintaining transaction records and financial audit trails to satisfy statutory Nigerian commercial accounting requirements.</li>
          <li><strong>Legitimate Interests:</strong> Preventing fraud, detecting fabricated proof screenshots, protecting platform cybersecurity, and mediating service disputes.</li>
          <li><strong>Consent:</strong> Sending voluntary platform marketing updates, which you may opt out of at any time.</li>
        </ul>

        <h2 style={{ marginBottom: '16px', color: '#0f172a' }}>4. The MEDIOVA Privacy Firewall</h2>
        <div style={{ background: '#f8fafc', borderLeft: '4px solid #059669', padding: '16px 20px', borderRadius: '4px', marginBottom: '24px' }}>
          <strong style={{ color: '#065f46', fontSize: '15px' }}>Strict Protection of Creator Identities:</strong>
          <p style={{ margin: '8px 0 0', color: '#334155' }}>
            In accordance with our core architecture, <strong>an influencer's telephone number, WhatsApp number, home address, and bank account details are NEVER disclosed to advertisers or vendors</strong>. Advertisers only view aggregated reach analytics and verified completion statuses. Sensitive creator payout information is strictly restricted to authorized platform finance controllers.
          </p>
        </div>

        <h2 style={{ marginBottom: '16px', color: '#0f172a' }}>5. Third-Party Service Providers & Data Transfers</h2>
        <p style={{ marginBottom: '12px' }}>
          We partner with reputable cloud and communication infrastructure providers to deliver our services. All third-party processors are bound by confidentiality and security covenants:
        </p>
        <ul style={{ paddingLeft: '24px', marginBottom: '24px' }}>
          <li><strong>Database & Cloud Hosting:</strong> MongoDB Atlas and Vercel/Render for secure data persistence and API delivery.</li>
          <li><strong>Media Storage:</strong> Cloudinary for encrypted storage of advertising flyers and verification screenshots.</li>
          <li><strong>Communications:</strong> Google Workspace (Gmail SMTP) for automated transactional email alerts (gig notifications and password recovery).</li>
          <li><strong>Cross-Border Transfers:</strong> When service providers process data on servers situated outside Nigeria, transfers are conducted under NDPA-compliant standard contractual clauses ensuring equivalent safeguards.</li>
        </ul>

        <h2 style={{ marginBottom: '16px', color: '#0f172a' }}>6. Data Security & Storage Safeguards</h2>
        <p style={{ marginBottom: '24px' }}>
          We deploy industry-standard technical and operational safeguards: salted password hashing using bcrypt, cryptographic JSON Web Tokens (JWT) with strict expiration, Transport Layer Security (HTTPS/TLS) across all client-server communications, and masked display of financial account numbers (`•••• •••• 1234`).
        </p>

        <h2 style={{ marginBottom: '16px', color: '#0f172a' }}>7. Data Retention & Erasure</h2>
        <p style={{ marginBottom: '24px' }}>
          Personal account information is retained for the duration of your active account registration. Completed campaign logs, verified gig proof records, and financial transaction histories are retained for six (6) years following transaction completion to satisfy Nigerian statutory tax and financial reporting obligations.
        </p>

        <h2 style={{ marginBottom: '16px', color: '#0f172a' }}>8. Your Rights Under the NDPA 2023</h2>
        <p style={{ marginBottom: '12px' }}>
          As a data subject under Nigerian law, you possess enforceable rights regarding your personal data:
        </p>
        <ul style={{ paddingLeft: '24px', marginBottom: '24px' }}>
          <li><strong>Right of Access:</strong> Request a copy of the personal information MEDIOVA holds concerning your profile.</li>
          <li><strong>Right to Rectification:</strong> Update or correct inaccurate or incomplete profile and bank account details via your dashboard.</li>
          <li><strong>Right to Erasure ("Right to Be Forgotten"):</strong> Request deletion of your personal account where retention is no longer justified.</li>
          <li><strong>Right to Restrict or Object:</strong> Object to processing for direct marketing or request temporary restriction of processing during an ongoing dispute.</li>
          <li><strong>Right to Complain to the Regulator:</strong> If you believe your data protection rights have been infringed, you have the right to lodge a complaint directly with the <strong>Nigeria Data Protection Commission (NDPC)</strong> at <a href="https://ndpc.gov.ng" target="_blank" rel="noopener noreferrer" style={{ color: '#059669', textDecoration: 'underline' }}>ndpc.gov.ng</a>.</li>
        </ul>

        <h2 style={{ marginBottom: '16px', color: '#0f172a' }}>9. Privacy Enquiries & Data Protection Contact</h2>
        <p style={{ marginBottom: '24px' }}>
          To exercise any of your data subject rights or raise a privacy question, please contact our Data Protection desk:
          <br /><br />
          <strong>Data Protection Officer:</strong> MEDIOVA Technology Marketplace<br />
          <strong>Official Privacy Email:</strong> <a href="mailto:privacy@mediova.ng" style={{ color: '#059669', fontWeight: '700' }}>privacy@mediova.ng</a><br />
          <strong>Support Desk:</strong> <Link to="/contact" style={{ color: '#059669', fontWeight: '700' }}>Contact & Support Page</Link><br />
          <strong>Headquarters:</strong> Victoria Island, Lagos State, Nigeria
        </p>

        <h2 style={{ marginBottom: '16px', color: '#0f172a' }}>10. Policy Updates</h2>
        <p style={{ marginBottom: '32px' }}>
          We may update this Privacy Policy from time to time to reflect operational or regulatory developments. When material updates are made, we will notify registered users via in-app dashboard alerts or registered email.
        </p>

        <div style={{ borderTop: '1px solid #e2e8f0', paddingTop: '24px', display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
          <Link to="/terms" style={{ color: '#059669', fontWeight: '700' }}>
            Terms of Service & Confidentiality →
          </Link>
          <Link to="/refund-policy" style={{ color: '#059669', fontWeight: '700' }}>
            Refund Policy →
          </Link>
          <Link to="/complaints-policy" style={{ color: '#059669', fontWeight: '700' }}>
            Complaints & Appeals Policy →
          </Link>
        </div>
      </div>
      <Footer />
    </div>
  );
}
