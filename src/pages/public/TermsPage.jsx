import React from 'react';
import { Link } from 'react-router-dom';
import { PublicNav, Footer } from './LandingPage';

export default function TermsPage() {
  return (
    <div>
      <PublicNav />
      <div style={{ background: '#0f172a', color: 'white', padding: '60px 24px', textAlign: 'center' }}>
        <h1 style={{ color: 'white', fontSize: '2.5rem', marginBottom: '8px' }}>Terms of Service & Confidentiality</h1>
        <p style={{ color: '#94a3b8' }}>
          Marketplace Operational Rules, Brokerage Framework & Confidentiality Provisions
        </p>
        <div style={{ marginTop: '12px', fontSize: '13px', color: '#cbd5e1' }}>
          Effective Date: 21 October 2026 &bull; Version 2.0
        </div>
      </div>

      <div style={{ maxWidth: '850px', margin: '60px auto', padding: '0 24px', lineHeight: '1.8', color: '#334155' }}>
        
        <div className="alert alert-info" style={{ marginBottom: '32px', fontSize: '13px' }}>
          ℹ️ <strong>Legal Notice:</strong> These Terms of Service govern participation on MEDIOVA. Operational standards, confidentiality terms, and dispute workflows are subject to periodic review by commercial legal counsel.
        </div>

        <h2 style={{ marginBottom: '16px', color: '#0f172a' }}>1. Managed Brokerage Structure & Non-Circumvention</h2>
        <p style={{ marginBottom: '24px' }}>
          MEDIOVA operates as a managed advertising brokerage marketplace. Advertisers ("Vendors") contract with MEDIOVA to orchestrate verified audience reach, and creators ("Influencers") contract with MEDIOVA to broadcast verified Status advertisements. Both Advertisers and Influencers agree not to circumvent the platform, solicit direct off-platform arrangements, or solicit private gig transactions using contacts or materials obtained through MEDIOVA. Breach of non-circumvention results in permanent account termination and forfeiture of unpaid balances.
        </p>

        <h2 style={{ marginBottom: '16px', color: '#0f172a' }}>2. Influencer Obligations & Status Verification</h2>
        <p style={{ marginBottom: '12px' }}>
          WhatsApp creators participating in MEDIOVA gig assignments agree to strictly adhere to the following standards:
        </p>
        <ul style={{ paddingLeft: '24px', marginBottom: '24px' }}>
          <li><strong>Continuous Broadcast:</strong> Advertisements must remain published on the creator's WhatsApp Status for a continuous minimum duration of 24 hours without premature deletion, muting, or obstruction.</li>
          <li><strong>Authentic Proof Submission:</strong> Creators must upload clear, unedited screenshots displaying legitimate view counts before the 24-hour mark expires.</li>
          <li><strong>Zero Fraud Tolerance:</strong> Submission of fabricated, manipulated, duplicate, or third-party screenshots constitutes immediate fraudulent misconduct. Offending accounts are permanently banned and referred for administrative recovery.</li>
          <li><strong>Remuneration Entitlement:</strong> Remuneration is earned only upon administrative review and approval of authentic proof submissions.</li>
        </ul>

        <h2 style={{ marginBottom: '16px', color: '#0f172a' }}>3. Advertiser & Vendor Content Warranties</h2>
        <p style={{ marginBottom: '24px' }}>
          Advertisers represent and warrant that they possess all required legal rights, trademarks, and copyright licenses for all uploaded creative assets, images, promotional copies, and video flyers. Advertisers agree not to submit campaigns promoting illegal lotteries, fraudulent investment schemes, counterfeit goods, defamatory material, or prohibited pharmaceuticals. MEDIOVA reserves the right to decline or reject any advertising order that contravenes Nigerian advertising standards (APCON/ARCON regulations).
        </p>

        <h2 style={{ marginBottom: '16px', color: '#0f172a' }}>4. Payments, Confirmations & Financial Integrity</h2>
        <p style={{ marginBottom: '24px' }}>
          Advertising campaigns are activated exclusively upon confirmed manual payment verification via official platform channels. A campaign record in "Awaiting Payment" status does not constitute a live order. Advertisers are connected to our verified WhatsApp brokerage desk to complete bank transfers. Creator payouts are disbursed strictly according to approved gig verification metrics within 24 to 48 business hours.
        </p>

        <h2 style={{ marginBottom: '16px', color: '#0f172a' }}>5. Confidentiality & Non-Disclosure Provisions</h2>
        <p style={{ marginBottom: '12px' }}>
          Both commercial advertisers and participating influencers are entrusted with proprietary information essential for campaign execution. All parties agree to uphold strict mutual confidentiality:
        </p>
        <ul style={{ paddingLeft: '24px', marginBottom: '24px' }}>
          <li><strong>Non-Public Campaign Materials:</strong> Unreleased creative concepts, product launch dates, special promotional discount codes, strategy briefs, and ad copy provided by advertisers are strictly confidential until the scheduled campaign broadcast time. Influencers shall not leak or disclose such materials to competitors or third parties.</li>
          <li><strong>Creator Personal Data Protection:</strong> Creator phone numbers, WhatsApp numbers, bank account numbers, and residential locations are protected under the MEDIOVA Privacy Firewall. Advertisers are strictly prohibited from attempting to uncover, extract, or harvest private creator identities.</li>
          <li><strong>Commercial Brokerage Data:</strong> Platform pricing tiers, matching algorithms, commission structures, and broker investigation notes are proprietary to MEDIOVA.</li>
          <li><strong>Permitted Disclosures:</strong> Information may be disclosed solely where required by valid court order, statutory regulatory request (such as NDPC or law enforcement), or to professional banking partners strictly necessary for executing wire transfers.</li>
          <li><strong>Exceptions:</strong> Confidentiality obligations do not apply to information that is already in the public domain without breach of these Terms or was independently developed without reference to confidential materials.</li>
          <li><strong>Duration of Confidentiality:</strong> Confidentiality covenants survive the termination of any campaign or user account for a period of two (2) years.</li>
        </ul>

        <h2 style={{ marginBottom: '16px', color: '#0f172a' }}>6. Role-Based Access Controls & System Security</h2>
        <p style={{ marginBottom: '24px' }}>
          Access to sensitive administrative controllers, user payment data, payout audit logs, and internal investigation records is restricted based on operational duties. Users are prohibited from attempting to bypass access controls, probe endpoints, scrape platform data, or tamper with API tokens. Any unauthorized intrusion attempts will trigger immediate account suspension and IP blocking.
        </p>

        <h2 style={{ marginBottom: '16px', color: '#0f172a' }}>7. Refunds & Dispute Escalation</h2>
        <p style={{ marginBottom: '24px' }}>
          Campaign refunds and cancellations are governed strictly by the dedicated <Link to="/refund-policy" style={{ color: '#059669', fontWeight: '700' }}>MEDIOVA Refund Policy</Link>. All platform grievances, service disputes, or appeals regarding account verification or payout suspensions must be submitted formally in accordance with our <Link to="/complaints-policy" style={{ color: '#059669', fontWeight: '700' }}>Complaints and Appeals Policy</Link>.
        </p>

        <h2 style={{ marginBottom: '16px', color: '#0f172a' }}>8. Contact & Governance</h2>
        <p style={{ marginBottom: '32px' }}>
          For inquiries regarding these Terms or contractual arrangements, please contact:<br />
          <strong>Legal & Compliance Desk:</strong> MEDIOVA Technology Marketplace<br />
          <strong>Official Email:</strong> <a href="mailto:support@mediova.ng" style={{ color: '#059669', fontWeight: '700' }}>support@mediova.ng</a><br />
          <strong>Support Portal:</strong> <Link to="/contact" style={{ color: '#059669', fontWeight: '700' }}>Contact & Support Page</Link>
        </p>

        <div style={{ borderTop: '1px solid #e2e8f0', paddingTop: '24px', display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
          <Link to="/privacy" style={{ color: '#059669', fontWeight: '700' }}>
            Privacy Policy (NDPA 2023) →
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
