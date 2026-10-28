import React from 'react';
import { Link } from 'react-router-dom';
import { PublicNav, Footer } from './LandingPage';

export default function TermsPage() {
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
            Terms of Service &amp; Confidentiality
          </h1>
          <p className="policy-banner-subtitle">
            Marketplace Operational Rules, Brokerage Framework, Non-Circumvention &amp; Confidentiality Provisions
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
          <Link to="/terms" className="btn btn-sm btn-primary" style={{ fontSize: '12px', whiteSpace: 'nowrap', borderRadius: '20px' }}>
            Terms &amp; Confidentiality
          </Link>
          <Link to="/privacy" className="btn btn-sm btn-ghost" style={{ fontSize: '12px', whiteSpace: 'nowrap', borderRadius: '20px' }}>
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
          <strong style={{ color: '#1e40af' }}>ℹ️ Legal Agreement &amp; Operational Notice:</strong> By accessing, registering, or executing commercial transactions on MEDIOVA, Advertisers ("Vendors") and WhatsApp Creators ("Influencers") irrevocably consent to and agree to be bound by these Terms of Service. These terms govern platform intermediation, non-circumvention, proof audits, payout schedules, and mutual non-disclosure covenants.
        </div>

        {/* Section 1 */}
        <h2 style={{ marginBottom: '14px', color: '#0f172a', fontSize: '1.5rem', borderBottom: '2px solid #e2e8f0', paddingBottom: '8px' }}>
          1. Managed Brokerage Structure &amp; Non-Circumvention
        </h2>
        <p style={{ marginBottom: '16px' }}>
          MEDIOVA operates exclusively as an end-to-end managed advertising brokerage platform. The brokerage framework is governed by the following strict operational rules:
        </p>
        <ul style={{ marginBottom: '28px' }}>
          <li>
            <strong>Dual Intermediation:</strong> Advertisers contract directly with MEDIOVA to orchestrate verified audience reach, and participating WhatsApp creators contract directly with MEDIOVA to fulfill individual broadcasting assignments.
          </li>
          <li>
            <strong>Prohibition of Direct Contact:</strong> Neither advertisers nor creators are permitted to exchange direct personal contact details, negotiate separate payment terms, or solicit off-platform transactions using relationships originated through MEDIOVA.
          </li>
          <li>
            <strong>Strict Non-Circumvention Rule:</strong> Any attempt by an advertiser to bypass MEDIOVA fees, contact a creator directly, or solicit gig distribution outside the platform constitutes a material breach of this Agreement.
          </li>
          <li>
            <strong>Remedies for Breach:</strong> In the event of an established circumvention attempt, MEDIOVA reserves the right to immediately freeze delinquent accounts, forfeit pending creator balances, reject active campaigns without refund, and seek damages equal to the gross commercial value of the bypassed campaign.
          </li>
        </ul>

        {/* Section 2 */}
        <h2 style={{ marginBottom: '14px', color: '#0f172a', fontSize: '1.5rem', borderBottom: '2px solid #e2e8f0', paddingBottom: '8px' }}>
          2. Influencer Obligations &amp; Status Broadcast Verification
        </h2>
        <p style={{ marginBottom: '16px' }}>
          WhatsApp creators participating in MEDIOVA gig assignments are held to exacting standards of authenticity and broadcast fidelity:
        </p>
        <ul style={{ marginBottom: '28px' }}>
          <li>
            <strong>Continuous 24-Hour Broadcast:</strong> Advertisements must remain published on the creator's WhatsApp Status for a continuous minimum duration of twenty-four (24) hours without premature deletion, muting, privacy restriction, or archiving.
          </li>
          <li>
            <strong>Authentic Screen-Recording Proof:</strong> Creators must upload clear, unedited screen-recording video proof demonstrating the live status post, viewer count, and timestamp before the 24-hour window lapses. Static cropped screenshots are strictly invalid.
          </li>
          <li>
            <strong>Zero Fraud &amp; Manipulation Tolerance:</strong> Submission of fabricated, duplicated, third-party, or digitally edited video proofs constitutes immediate fraudulent misconduct. Offending accounts are permanently banned and forfeited earnings are allocated to the advertiser compensation pool.
          </li>
          <li>
            <strong>Remuneration Entitlement:</strong> Creator earnings are credited to the creator wallet strictly upon administrative audit and validation of video proof submissions. No advance disbursements are permitted.
          </li>
          <li>
            <strong>Availability Management:</strong> Creators must keep their dashboard availability toggle up-to-date. Repeated failure to accept assigned gigs while marked "Available" may result in temporary allocation pauses.
          </li>
        </ul>

        {/* Section 3 */}
        <h2 style={{ marginBottom: '14px', color: '#0f172a', fontSize: '1.5rem', borderBottom: '2px solid #e2e8f0', paddingBottom: '8px' }}>
          3. Advertiser &amp; Vendor Content Warranties
        </h2>
        <p style={{ marginBottom: '16px' }}>
          Commercial advertisers retain exclusive legal responsibility for all creative assets, text copy, graphic flyers, and multimedia uploaded to the platform:
        </p>
        <ul style={{ marginBottom: '28px' }}>
          <li>
            <strong>Intellectual Property Warranties:</strong> Advertisers represent and warrant that they possess all legal ownership rights, trademark licenses, and creative copyrights for submitted campaign materials.
          </li>
          <li>
            <strong>Prohibited Verticals &amp; Content:</strong> Advertisers shall not submit campaigns promoting:
            <ul style={{ marginTop: '8px', marginBottom: '8px' }}>
              <li>Illegal lotteries, unregulated gambling, or ponzi/pyramid investment schemes.</li>
              <li>Counterfeit merchandise, pirated software, or stolen credential lists.</li>
              <li>Defamatory, hateful, harassing, or sexually explicit/adult materials.</li>
              <li>Unregistered pharmaceutical products, illicit substances, or unapproved wellness claims.</li>
            </ul>
          </li>
          <li>
            <strong>Regulatory Compliance (ARCON / APCON):</strong> For campaigns targeted within Nigeria, advertisers warrant compliance with Advertising Regulatory Council of Nigeria (ARCON) guidelines and all applicable consumer protection statutes.
          </li>
          <li>
            <strong>Administrative Rejection Right:</strong> MEDIOVA reserves unconditional authority to decline, suspend, or terminate any campaign that violates platform safety guidelines or ethical standards.
          </li>
        </ul>

        {/* Section 4 */}
        <h2 style={{ marginBottom: '14px', color: '#0f172a', fontSize: '1.5rem', borderBottom: '2px solid #e2e8f0', paddingBottom: '8px' }}>
          4. Payments, Escrow Confirmations &amp; Financial Integrity
        </h2>
        <p style={{ marginBottom: '16px' }}>
          Financial settlement on MEDIOVA operates with rigorous auditing and verifiable escrow protection:
        </p>
        <ul style={{ marginBottom: '28px' }}>
          <li>
            <strong>Pre-Payment Requirement:</strong> Advertising campaigns are activated exclusively upon receipt and electronic confirmation of the campaign fee in MEDIOVA’s designated escrow account. Orders in "Awaiting Payment" status do not reserve creator inventory.
          </li>
          <li>
            <strong>Bank Transfer Verification:</strong> Advertisers paying via manual bank wire must upload clear electronic transaction receipts displaying bank session IDs or reference codes. Payment confirmations are reviewed within 2 to 4 business hours.
          </li>
          <li>
            <strong>Escrow Protection:</strong> Campaign funds remain held securely in platform escrow until creators complete verified 24-hour broadcasts and submitted video proof is audited by our administrative team.
          </li>
          <li>
            <strong>Creator Disbursement SLA:</strong> Audited and approved creator balances are disbursed to verified Nigerian commercial bank accounts within twenty-four to forty-eight (24–48) business hours following audit sign-off.
          </li>
        </ul>

        {/* Section 5 */}
        <h2 style={{ marginBottom: '14px', color: '#0f172a', fontSize: '1.5rem', borderBottom: '2px solid #e2e8f0', paddingBottom: '8px' }}>
          5. Confidentiality &amp; Non-Disclosure Provisions
        </h2>
        <p style={{ marginBottom: '16px' }}>
          Both commercial advertisers and participating influencers are entrusted with proprietary information essential for campaign distribution. All parties covenant to uphold strict mutual non-disclosure:
        </p>
        <ul style={{ marginBottom: '28px' }}>
          <li>
            <strong>Non-Public Campaign Materials:</strong> Unreleased creative concepts, product launch dates, special promotional discount codes, strategy briefs, and ad copy provided by advertisers are strictly confidential until the scheduled campaign broadcast time. Influencers shall not leak or disclose such materials to competitors or third parties.
          </li>
          <li>
            <strong>Creator Personal Data Protection:</strong> Creator phone numbers, WhatsApp numbers, bank account numbers, and residential locations are protected under the MEDIOVA Privacy Firewall. Advertisers are strictly prohibited from attempting to uncover, extract, or harvest private creator identities.
          </li>
          <li>
            <strong>Commercial Brokerage Data:</strong> Platform pricing tiers, matching algorithms, commission structures, and broker investigation notes are proprietary to MEDIOVA.
          </li>
          <li>
            <strong>Permitted Disclosures:</strong> Information may be disclosed solely where required by valid court order, statutory regulatory request (such as NDPC or law enforcement), or to professional banking partners strictly necessary for executing wire transfers.
          </li>
          <li>
            <strong>Exceptions:</strong> Confidentiality obligations do not apply to information that is already in the public domain without breach of these Terms or was independently developed without reference to confidential materials.
          </li>
          <li>
            <strong>Duration of Confidentiality:</strong> Confidentiality covenants survive the termination of any campaign or user account for a period of two (2) years.
          </li>
        </ul>

        {/* Section 6 */}
        <h2 style={{ marginBottom: '14px', color: '#0f172a', fontSize: '1.5rem', borderBottom: '2px solid #e2e8f0', paddingBottom: '8px' }}>
          6. Role-Based Access Controls &amp; System Security
        </h2>
        <p style={{ marginBottom: '16px' }}>
          Platform infrastructure is safeguarded to maintain operational and cryptographic integrity:
        </p>
        <ul style={{ marginBottom: '28px' }}>
          <li>
            <strong>Account Security:</strong> Users are solely responsible for maintaining the confidentiality of their login credentials, passwords, and two-factor authentication tokens. MEDIOVA will never solicit your password via email, phone, or messaging.
          </li>
          <li>
            <strong>Prohibition of Scraping &amp; Probing:</strong> Automated scraping, bot crawling, API endpoint probing, injection attacks, or reverse-engineering of platform source code is strictly prohibited and subject to immediate IP blacklisting and criminal reporting.
          </li>
          <li>
            <strong>Audit Logging:</strong> All campaign modifications, payment uploads, admin approvals, and balance disbursements are immutably logged with IP addresses and timestamps for regulatory verification.
          </li>
        </ul>

        {/* Section 7 */}
        <h2 style={{ marginBottom: '14px', color: '#0f172a', fontSize: '1.5rem', borderBottom: '2px solid #e2e8f0', paddingBottom: '8px' }}>
          7. Refunds, Cancellations &amp; Dispute Escalation
        </h2>
        <p style={{ marginBottom: '16px' }}>
          Structured procedures apply to cancellations, refunds, and operational disagreements:
        </p>
        <ul style={{ marginBottom: '28px' }}>
          <li>
            <strong>Refund Eligibility:</strong> Campaign refunds are administered strictly pursuant to the <Link to="/refund-policy" style={{ color: '#059669', fontWeight: '700' }}>MEDIOVA Refund Policy</Link>. Orders canceled prior to creator assignment qualify for 100% platform credit or bank reimbursement.
          </li>
          <li>
            <strong>Dispute Channel:</strong> Operational grievances, proof rejections, and payment discrepancies must be submitted via the <Link to="/complaints-policy" style={{ color: '#059669', fontWeight: '700' }}>Complaints &amp; Appeals Process</Link> using our official ticketing system.
          </li>
          <li>
            <strong>Ombudsman Finality:</strong> Determinations rendered by the Senior Marketplace Ombudsman represent the final internal administrative resolution of MEDIOVA.
          </li>
        </ul>

        {/* Section 8 */}
        <h2 style={{ marginBottom: '14px', color: '#0f172a', fontSize: '1.5rem', borderBottom: '2px solid #e2e8f0', paddingBottom: '8px' }}>
          8. Legal Governance, Severability &amp; Jurisdiction
        </h2>
        <p style={{ marginBottom: '16px' }}>
          The contractual framework is governed by the laws and judicial standards of Nigeria:
        </p>
        <ul style={{ marginBottom: '28px' }}>
          <li>
            <strong>Governing Law:</strong> These Terms shall be interpreted and enforced in accordance with the substantive laws of the Federal Republic of Nigeria.
          </li>
          <li>
            <strong>Pre-Litigation Mediation:</strong> In the event of an unresolved dispute, the parties agree to participate in at least thirty (30) days of good-faith mediation facilitated by the Lagos Multi-Door Courthouse (LMDC) prior to initiating formal litigation.
          </li>
          <li>
            <strong>Severability:</strong> If any provision of these Terms is deemed invalid or unenforceable by a court of competent jurisdiction, the remaining provisions shall remain in full force and effect.
          </li>
          <li>
            <strong>Policy Modifications:</strong> MEDIOVA reserves the right to amend these Terms. Significant updates are communicated through email notifications and in-app dashboard announcements thirty (30) days prior to taking effect.
          </li>
        </ul>

        {/* Section 9 */}
        <h2 style={{ marginBottom: '14px', color: '#0f172a', fontSize: '1.5rem', borderBottom: '2px solid #e2e8f0', paddingBottom: '8px' }}>
          9. Legal Desk &amp; Compliance Inquiries
        </h2>
        <p style={{ marginBottom: '16px' }}>
          For inquiries regarding these Terms of Service or commercial brokerage contracts:
        </p>
        <ul style={{ marginBottom: '32px' }}>
          <li><strong>Organization:</strong> MEDIOVA Technology Marketplace (Legal &amp; Compliance Directorate)</li>
          <li><strong>Headquarters:</strong> Victoria Island, Lagos State, Nigeria</li>
          <li><strong>Compliance Desk:</strong> <a href="mailto:support@mediova.ng" style={{ color: '#059669', fontWeight: '700' }}>support@mediova.ng</a></li>
          <li><strong>Interactive Support:</strong> <Link to="/contact" style={{ color: '#059669', fontWeight: '700' }}>Contact &amp; Support Portal</Link></li>
        </ul>

        {/* Bottom Cross-Links */}
        <div style={{ borderTop: '1px solid #e2e8f0', paddingTop: '24px', display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
          <Link to="/privacy" style={{ color: '#059669', fontWeight: '700' }}>
            Privacy Policy (NDPA 2023) →
          </Link>
          <Link to="/refund-policy" style={{ color: '#059669', fontWeight: '700' }}>
            Refund Policy →
          </Link>
          <Link to="/complaints-policy" style={{ color: '#059669', fontWeight: '700' }}>
            Complaints &amp; Appeals Policy →
          </Link>
          <Link to="/faq" style={{ color: '#059669', fontWeight: '700' }}>
            Help &amp; FAQs →
          </Link>
        </div>
      </div>
      <Footer />
    </div>
  );
}
