import React from 'react';
import { Link } from 'react-router-dom';
import { PublicNav, Footer } from './LandingPage';

export default function PrivacyPage() {
  return (
    <div>
      <PublicNav />
      {/* Header Banner */}
      <div className="policy-banner">
        <div className="policy-banner-container">
          <span className="policy-banner-badge">
            Platform Governance &amp; Compliance
          </span>
          <h1 className="policy-banner-title">
            Privacy Policy
          </h1>
          <p className="policy-banner-subtitle">
            Structured under the Nigeria Data Protection Act 2023 (NDPA 2023) and global privacy benchmarks
          </p>
          <div className="policy-banner-meta">
            Effective Date: 21 October 2026 &bull; Version 2.0 &bull; Mandatory Electronic Disclosure
          </div>
        </div>
      </div>

      {/* Governance Quick Links Bar */}
      <div className="governance-nav-bar">
        <div className="governance-nav-inner">
          <span style={{ fontSize: '12px', fontWeight: '700', color: '#64748b', textTransform: 'uppercase', marginRight: '6px', whiteSpace: 'nowrap' }}>
            Governance:
          </span>
          <Link to="/contact" className="btn btn-sm btn-ghost" style={{ fontSize: '12px', whiteSpace: 'nowrap', borderRadius: '20px' }}>
            Contact &amp; Support
          </Link>
          <Link to="/faq" className="btn btn-sm btn-ghost" style={{ fontSize: '12px', whiteSpace: 'nowrap', borderRadius: '20px' }}>
            Help &amp; FAQs
          </Link>
          <Link to="/terms" className="btn btn-sm btn-ghost" style={{ fontSize: '12px', whiteSpace: 'nowrap', borderRadius: '20px' }}>
            Terms &amp; Confidentiality
          </Link>
          <Link to="/privacy" className="btn btn-sm btn-primary" style={{ fontSize: '12px', whiteSpace: 'nowrap', borderRadius: '20px' }}>
            Privacy Policy
          </Link>
          <Link to="/refund-policy" className="btn btn-sm btn-ghost" style={{ fontSize: '12px', whiteSpace: 'nowrap', borderRadius: '20px' }}>
            Refund Policy
          </Link>
          <Link to="/complaints-policy" className="btn btn-sm btn-ghost" style={{ fontSize: '12px', whiteSpace: 'nowrap', borderRadius: '20px' }}>
            Complaints &amp; Appeals
          </Link>
        </div>
      </div>

      {/* Document Body */}
      <div className="policy-content" style={{ maxWidth: '850px', margin: '50px auto', padding: '0 24px', lineHeight: '1.85', color: '#334155' }}>
        
        <div style={{ background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: '8px', padding: '16px 20px', marginBottom: '36px', fontSize: '13px', lineHeight: '1.6' }}>
          <strong style={{ color: '#1e40af' }}>ℹ️ Operational Transparency Commitment:</strong> This policy governs all personal data collected and processed through the MEDIOVA digital advertising and creator gig marketplace. All data processing activities are continuously monitored for strict compliance with the Nigeria Data Protection Act 2023 and NDPC regulations.
        </div>

        {/* Section 1 */}
        <section style={{ marginBottom: '36px' }}>
          <h2 style={{ fontSize: '1.4rem', fontWeight: '800', color: '#0f172a', marginBottom: '14px', borderBottom: '2px solid #e2e8f0', paddingBottom: '8px' }}>
            1. Introduction &amp; Core Principles
          </h2>
          <p style={{ marginBottom: '14px' }}>
            MEDIOVA ("we", "us", or "the Platform") operates a managed advertising brokerage connecting commercial advertisers ("Vendors") with verified WhatsApp content creators ("Influencers") across domestic and international markets. We are committed to safeguarding personal data and maintaining user trust through the following foundational pillars:
          </p>
          <ul>
            <li>
              <strong>Data Minimization:</strong> We only collect, record, and process the precise data points strictly required to execute advertising campaigns, audit reach metrics, and disburse creator earnings.
            </li>
            <li>
              <strong>Purpose Limitation:</strong> Personal information is never sold, leased, or repurposed for unauthorized secondary commercial marketing without explicit consent.
            </li>
            <li>
              <strong>Creator Privacy Firewall:</strong> Influencers' personal phone numbers, WhatsApp numbers, physical addresses, and banking accounts are strictly sealed behind our brokerage firewall and never disclosed to commercial advertisers.
            </li>
            <li>
              <strong>Legal Accountability:</strong> We adhere to the provisions of the <strong>Nigeria Data Protection Act 2023 (NDPA 2023)</strong>, statutory guidelines issued by the <strong>Nigeria Data Protection Commission (NDPC)</strong>, and international data transfer safeguards.
            </li>
          </ul>
        </section>

        {/* Section 2 */}
        <section style={{ marginBottom: '36px' }}>
          <h2 style={{ fontSize: '1.4rem', fontWeight: '800', color: '#0f172a', marginBottom: '14px', borderBottom: '2px solid #e2e8f0', paddingBottom: '8px' }}>
            2. Personal Data We Collect
          </h2>
          <p style={{ marginBottom: '14px' }}>
            Depending on your role as an Advertiser, Content Creator, or Platform Visitor, we collect and process the following structured categories of personal information:
          </p>
          <ul>
            <li>
              <strong>Identity &amp; Account Details:</strong> Full name, contact person name, registered business name, verified email address, encrypted authentication credentials, and Google OAuth unique identifier tokens where Google Sign-In is chosen.
            </li>
            <li>
              <strong>Telecommunications Data:</strong> Standardized WhatsApp contact telephone numbers validated and stored in international E.164 telecommunications format (e.g., <code>+234...</code>, <code>+1...</code>, <code>+44...</code>) with country calling code synchronization.
            </li>
            <li>
              <strong>Geographic Location Data:</strong> Country, administrative divisions (such as Nigerian States, US States, UK Counties, or provincial equivalents), and designated Local Government Areas (LGAs) or municipalities to enable geographic advert distribution.
            </li>
            <li>
              <strong>Campaign &amp; Creative Assets:</strong> Promotional flyers, graphic banners, campaign videos, target destination URLs, WhatsApp ad copy scripts, and special advertiser campaign instructions.
            </li>
            <li>
              <strong>Audience Verification Proofs:</strong> Unedited screen-recording video files submitted by influencers displaying active WhatsApp Status viewer analytics, viewer counts, and post timestamps required to verify gig performance.
            </li>
            <li>
              <strong>Disbursement &amp; Banking Data:</strong> Creator commercial bank account numbers (NUBAN or international IBAN), bank names, and account holder names. <em>Note: MEDIOVA does not store credit/debit card numbers or security CVV codes; all card processing is handled by licensed PCI-DSS payment gateways.</em>
            </li>
            <li>
              <strong>Technical Audit Data:</strong> Internet Protocol (IP) addresses, browser user-agent signatures, login session timestamps, and administrative audit history logs.
            </li>
          </ul>
        </section>

        {/* Section 3 */}
        <section style={{ marginBottom: '36px' }}>
          <h2 style={{ fontSize: '1.4rem', fontWeight: '800', color: '#0f172a', marginBottom: '14px', borderBottom: '2px solid #e2e8f0', paddingBottom: '8px' }}>
            3. Lawful Bases for Data Processing
          </h2>
          <p style={{ marginBottom: '14px' }}>
            Under Section 25 of the NDPA 2023, MEDIOVA processes personal data exclusively under recognized statutory grounds:
          </p>
          <ul>
            <li>
              <strong>Contractual Necessity:</strong> Processing is required to create your account, configure advertising orders, match creator profiles with active campaigns, audit delivery proof, and disburse agreed creator remuneration.
            </li>
            <li>
              <strong>Legal &amp; Regulatory Compliance:</strong> Maintaining transaction archives, financial payout ledgers, and taxation records to satisfy statutory Nigerian commercial accounting requirements.
            </li>
            <li>
              <strong>Legitimate Business Interests:</strong> Operating anti-fraud detection systems to prevent manipulated or fabricated video proofs, securing platform infrastructure against cyber threats, and mediating transactional disputes.
            </li>
            <li>
              <strong>Explicit Consent:</strong> Sending voluntary platform educational updates, new package announcements, or promotional newsletters, which users can opt out of at any time.
            </li>
          </ul>
        </section>

        {/* Section 4 */}
        <section style={{ marginBottom: '36px' }}>
          <h2 style={{ fontSize: '1.4rem', fontWeight: '800', color: '#0f172a', marginBottom: '14px', borderBottom: '2px solid #e2e8f0', paddingBottom: '8px' }}>
            4. The MEDIOVA Privacy Firewall
          </h2>
          <div style={{ background: '#f8fafc', borderLeft: '4px solid #059669', padding: '18px 22px', borderRadius: '6px', marginBottom: '18px' }}>
            <strong style={{ color: '#065f46', fontSize: '15px', display: 'block', marginBottom: '6px' }}>
              Strict Shielding of Influencer Identities:
            </strong>
            <p style={{ margin: 0, color: '#334155', fontSize: '14px' }}>
              Unlike unmanaged freelance directories, MEDIOVA operates as a managed brokerage. Influencers' telephone numbers, WhatsApp contact numbers, physical residential locations, and banking records are <strong>NEVER disclosed to advertisers or third parties</strong>.
            </p>
          </div>
          <ul>
            <li>
              <strong>Advertiser Visibility:</strong> Advertisers only receive aggregated performance metrics (e.g. "Bronze Reach Package - 10,000 Views Verified") and compiled video delivery proofs.
            </li>
            <li>
              <strong>Finance Controls:</strong> Banking information submitted for payouts is accessible exclusively to authorized platform financial controllers for executing bank transfers.
            </li>
            <li>
              <strong>Non-Circumvention:</strong> Direct off-platform contact between vendors and creators is strictly prohibited, protecting both creators from harassment and advertisers from fraudulent representation.
            </li>
          </ul>
        </section>

        {/* Section 5 */}
        <section style={{ marginBottom: '36px' }}>
          <h2 style={{ fontSize: '1.4rem', fontWeight: '800', color: '#0f172a', marginBottom: '14px', borderBottom: '2px solid #e2e8f0', paddingBottom: '8px' }}>
            5. Third-Party Service Providers &amp; Cross-Border Transfers
          </h2>
          <p style={{ marginBottom: '14px' }}>
            We collaborate with enterprise-grade technology providers to deliver reliable global services. All external processors are bound by strict data processing and confidentiality agreements:
          </p>
          <ul>
            <li>
              <strong>Database &amp; Cloud Infrastructure:</strong> MongoDB Atlas (encrypted persistence clusters) and Vercel/Render for distributed application delivery.
            </li>
            <li>
              <strong>Media &amp; Proof Storage:</strong> Cloudinary for encrypted, high-availability storage of advertising flyers, creatives, and verification screen recordings.
            </li>
            <li>
              <strong>Transactional Messaging:</strong> Google Workspace SMTP for automated delivery of verification confirmations, order updates, and security recovery codes.
            </li>
            <li>
              <strong>Cross-Border Safeguards:</strong> Where cloud servers are located outside Nigeria, data transfers comply with NDPA Section 41 through standard contractual clauses ensuring equivalent levels of data protection.
            </li>
          </ul>
        </section>

        {/* Section 6 */}
        <section style={{ marginBottom: '36px' }}>
          <h2 style={{ fontSize: '1.4rem', fontWeight: '800', color: '#0f172a', marginBottom: '14px', borderBottom: '2px solid #e2e8f0', paddingBottom: '8px' }}>
            6. Technical &amp; Organizational Security Safeguards
          </h2>
          <p style={{ marginBottom: '14px' }}>
            We implement comprehensive technical and administrative defenses to prevent unauthorized access, alteration, or disclosure of user data:
          </p>
          <ul>
            <li>
              <strong>Cryptographic Hashing:</strong> Passwords are cryptographically salted and hashed using bcrypt (10 rounds) and can never be retrieved or viewed in plaintext.
            </li>
            <li>
              <strong>Token Security:</strong> User sessions are authenticated using stateless, signed JSON Web Tokens (JWT) with strict expiration limits and secure storage.
            </li>
            <li>
              <strong>Transport Encryption:</strong> All data in transit across browser, mobile, and server endpoints is encrypted using Transport Layer Security (TLS 1.3 / HTTPS).
            </li>
            <li>
              <strong>Financial Data Masking:</strong> Sensitive payout bank account numbers are displayed in masked form (e.g. <code>•••• •••• 1234</code>) in platform dashboards.
            </li>
            <li>
              <strong>Strict Cross-Origin Security:</strong> Assets and media files are served with calibrated Cross-Origin Resource Policy (CORP) and Content Security Policy (CSP) headers.
            </li>
          </ul>
        </section>

        {/* Section 7 */}
        <section style={{ marginBottom: '36px' }}>
          <h2 style={{ fontSize: '1.4rem', fontWeight: '800', color: '#0f172a', marginBottom: '14px', borderBottom: '2px solid #e2e8f0', paddingBottom: '8px' }}>
            7. Data Retention &amp; Erasure Schedules
          </h2>
          <p style={{ marginBottom: '14px' }}>
            Personal records are retained only for the duration necessary to satisfy commercial operational and statutory obligations:
          </p>
          <ul>
            <li>
              <strong>Active Account Profiles:</strong> Profile details, contact numbers, and location settings are preserved for the lifespan of your active platform registration.
            </li>
            <li>
              <strong>Financial Transaction Records:</strong> In accordance with statutory Nigerian commercial and financial regulations, transaction ledgers, receipts, and payout histories are retained for six (6) years following transaction completion.
            </li>
            <li>
              <strong>Verification Videos &amp; Proofs:</strong> Screen recordings submitted for gig completion are retained for 180 days to support advertiser audit reviews and dispute mediation, after which they are purged from primary storage.
            </li>
          </ul>
        </section>

        {/* Section 8 */}
        <section style={{ marginBottom: '36px' }}>
          <h2 style={{ fontSize: '1.4rem', fontWeight: '800', color: '#0f172a', marginBottom: '14px', borderBottom: '2px solid #e2e8f0', paddingBottom: '8px' }}>
            8. Your Statutory Rights Under the NDPA 2023
          </h2>
          <p style={{ marginBottom: '14px' }}>
            Under Part VI of the Nigeria Data Protection Act 2023, data subjects possess enforceable rights regarding their personal information:
          </p>
          <ul>
            <li>
              <strong>Right of Access:</strong> You may request a comprehensive electronic copy of the personal data MEDIOVA maintains regarding your account.
            </li>
            <li>
              <strong>Right to Rectification:</strong> You have the right to update or correct inaccurate profile details, bank accounts, or contact telephone numbers through your dashboard.
            </li>
            <li>
              <strong>Right to Erasure ("Right to Be Forgotten"):</strong> You may request the permanent deletion of your account and personal identifiers where continued retention is not required by financial statutes.
            </li>
            <li>
              <strong>Right to Restriction &amp; Objection:</strong> You may object to data processing for voluntary direct marketing or request a freeze on processing during an active dispute investigation.
            </li>
            <li>
              <strong>Right to Lodge a Regulatory Complaint:</strong> If you believe your data protection rights have been violated, you have the right to submit a formal complaint directly to the <strong>Nigeria Data Protection Commission (NDPC)</strong> at <a href="https://ndpc.gov.ng" target="_blank" rel="noopener noreferrer" style={{ color: '#059669', fontWeight: '700' }}>ndpc.gov.ng</a>.
            </li>
          </ul>
        </section>

        {/* Section 9 */}
        <section style={{ marginBottom: '36px' }}>
          <h2 style={{ fontSize: '1.4rem', fontWeight: '800', color: '#0f172a', marginBottom: '14px', borderBottom: '2px solid #e2e8f0', paddingBottom: '8px' }}>
            9. Privacy Inquiries &amp; Data Protection Officer Contact
          </h2>
          <p style={{ marginBottom: '14px' }}>
            To exercise any of your data protection rights or report a privacy concern, please contact our dedicated Data Protection desk:
          </p>
          <ul>
            <li>
              <strong>Designated Desk:</strong> Data Protection Officer, MEDIOVA Technology Marketplace
            </li>
            <li>
              <strong>Official Privacy Email:</strong> <a href="mailto:privacy@mediova.ng" style={{ color: '#059669', fontWeight: '700' }}>privacy@mediova.ng</a>
            </li>
            <li>
              <strong>Support Portal:</strong> <Link to="/contact" style={{ color: '#059669', fontWeight: '700' }}>Customer Support Desk &amp; Ticket Portal</Link>
            </li>
            <li>
              <strong>Headquarters:</strong> Victoria Island, Lagos State, Nigeria
            </li>
          </ul>
        </section>

        {/* Section 10 */}
        <section style={{ marginBottom: '36px' }}>
          <h2 style={{ fontSize: '1.4rem', fontWeight: '800', color: '#0f172a', marginBottom: '14px', borderBottom: '2px solid #e2e8f0', paddingBottom: '8px' }}>
            10. Policy Modifications &amp; Notifications
          </h2>
          <p style={{ marginBottom: '14px' }}>
            We review this Privacy Policy periodically to reflect technological enhancements and evolving statutory directives. When revisions occur:
          </p>
          <ul>
            <li>The "Effective Date" at the top of this document will be updated accordingly.</li>
            <li>Registered users will receive an electronic notification via dashboard alerts or registered email for material policy adjustments.</li>
            <li>Continued use of the platform following notification constitutes acknowledgment of the revised Privacy Policy.</li>
          </ul>
        </section>

        {/* Bottom Navigation */}
        <div style={{ borderTop: '2px solid #e2e8f0', paddingTop: '28px', marginTop: '40px', display: 'flex', gap: '24px', flexWrap: 'wrap' }}>
          <Link to="/terms" style={{ color: '#059669', fontWeight: '700', fontSize: '14px' }}>
            Terms &amp; Confidentiality Provisions →
          </Link>
          <Link to="/refund-policy" style={{ color: '#059669', fontWeight: '700', fontSize: '14px' }}>
            Refund &amp; Cancellation Policy →
          </Link>
          <Link to="/complaints-policy" style={{ color: '#059669', fontWeight: '700', fontSize: '14px' }}>
            Complaints &amp; Appeals Policy →
          </Link>
        </div>
      </div>
      <Footer />
    </div>
  );
}
