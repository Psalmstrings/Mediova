import React from 'react';
import { Link } from 'react-router-dom';
import { PublicNav, Footer } from './LandingPage';

export default function ComplaintsPolicyPage() {
  return (
    <div>
      <PublicNav />
      <div style={{ background: '#0f172a', color: 'white', padding: '60px 24px', textAlign: 'center' }}>
        <h1 style={{ color: 'white', fontSize: '2.5rem', marginBottom: '8px' }}>Complaints & Appeals Policy</h1>
        <p style={{ color: '#94a3b8' }}>
          Fair, structured, and auditable dispute resolution for advertisers and creators
        </p>
        <div style={{ marginTop: '12px', fontSize: '13px', color: '#cbd5e1' }}>
          Effective Date: 21 October 2026 &bull; Version 2.0
        </div>
      </div>

      <div style={{ maxWidth: '850px', margin: '60px auto', padding: '0 24px', lineHeight: '1.8', color: '#334155' }}>
        
        <div className="alert alert-info" style={{ marginBottom: '32px', fontSize: '13px' }}>
          ℹ️ <strong>Resolution Commitment:</strong> MEDIOVA is committed to transparent operational mediation. All formal complaints generate a tracked reference number and are investigated according to strict timelines.
        </div>

        <h2 style={{ marginBottom: '16px', color: '#0f172a' }}>1. Scope & Eligible Complainants</h2>
        <p style={{ marginBottom: '24px' }}>
          This Complaints and Appeals Policy applies to all registered Vendors (Advertisers) and Influencers (Creators) utilizing MEDIOVA. Any user who has experienced a service failure, financial discrepancy, proof verification dispute, or misconduct is entitled to submit a formal grievance without fear of retaliatory action.
        </p>

        <h2 style={{ marginBottom: '16px', color: '#0f172a' }}>2. Accepted Dispute Categories</h2>
        <p style={{ marginBottom: '12px' }}>
          Formal complaints may be lodged regarding any of the following operational matters:
        </p>
        <ul style={{ paddingLeft: '24px', marginBottom: '24px' }}>
          <li><strong>Advertising Request & Submission Issues:</strong> Technical failures preventing campaign order creation or delays in initial brokerage review.</li>
          <li><strong>Campaign Delivery & Reach Shortfalls:</strong> Disputes where verified views delivered by assigned creators fail to meet the guaranteed minimum reach package.</li>
          <li><strong>Gig Completion & Proof Rejection:</strong> Influencer appeals against administrative rejection of legitimate WhatsApp Status screenshots.</li>
          <li><strong>Delayed or Failed Payouts:</strong> Inquiries regarding approved gig earnings that have not landed in the creator's bank account within the 24-48 business hour SLA.</li>
          <li><strong>Refund Review Disagreements:</strong> Escalations where an advertiser's cancellation or refund request was declined.</li>
          <li><strong>Account Verification & Restrictions:</strong> Appeals regarding metric downgrades, view requirement disputes, or account status suspensions.</li>
          <li><strong>Misconduct & Campaign Misuse:</strong> Premature status deletion, unauthorized modifications of promotional copy, or breach of confidentiality covenants.</li>
          <li><strong>Data Protection & Privacy Grievances:</strong> Inquiries regarding personal data handling under the Nigeria Data Protection Act 2023.</li>
        </ul>

        <h2 style={{ marginBottom: '16px', color: '#0f172a' }}>3. How to Submit a Formal Complaint</h2>
        <p style={{ marginBottom: '12px' }}>
          To ensure timely resolution and auditable recordkeeping, users should lodge complaints through the following verified channels:
        </p>
        <ul style={{ paddingLeft: '24px', marginBottom: '24px' }}>
          <li>
            <strong>In-Dashboard Complaints Portal:</strong> Navigate to your Account Dashboard and select <strong>"File Complaint / Appeal"</strong>. Enter your category, reference order or gig number, detailed description, and preferred contact method.
          </li>
          <li>
            <strong>Official Support Desk:</strong> Submit a structured inquiry via our <Link to="/contact" style={{ color: '#059669', fontWeight: '700' }}>Contact & Support Page</Link>.
          </li>
          <li>
            <strong>Disputes Email:</strong> Send an email detailing the incident and relevant references to <a href="mailto:support@mediova.ng" style={{ color: '#059669', fontWeight: '700' }}>support@mediova.ng</a>.
          </li>
        </ul>

        <h2 style={{ marginBottom: '16px', color: '#0f172a' }}>4. Expected Timelines & Response SLAs</h2>
        <p style={{ marginBottom: '12px' }}>
          We hold our mediation team to realistic, reliable response benchmarks:
        </p>
        <ul style={{ paddingLeft: '24px', marginBottom: '24px' }}>
          <li><strong>Electronic Acknowledgment:</strong> Immediate issuance of a unique reference number (e.g. <code>CMP-XXXX</code>) upon ticket creation.</li>
          <li><strong>Initial Review & Evidence Gathering:</strong> Within <strong>24 to 48 business hours</strong>, a dispute officer will review server logs, screenshots, and transaction history.</li>
          <li><strong>Formal Investigation Determination:</strong> A conclusive written resolution will be communicated within <strong>3 to 5 business days</strong> of submission.</li>
        </ul>

        <h2 style={{ marginBottom: '16px', color: '#0f172a' }}>5. Investigation Protocol & Confidentiality</h2>
        <p style={{ marginBottom: '24px' }}>
          Investigations are conducted objectively. Dispute officers examine cryptographic timestamps, uploaded proof images, WhatsApp broadcast logs, and bank statement records. Internal investigative notes are kept confidential to protect the integrity of the mediation process and prevent retaliatory disputes.
        </p>

        <h2 style={{ marginBottom: '16px', color: '#0f172a' }}>6. Administrative Appeals Process</h2>
        <p style={{ marginBottom: '24px' }}>
          If you disagree with the resolution determination, you have the right to request a secondary appeal within <strong>seven (7) days</strong> of receiving the decision. Appeals must introduce new relevant evidence (such as supplemental bank statements, uncut screen recordings, or WhatsApp message exports) and are escalated to the Senior Marketplace Ombudsman. Ombudsman determinations represent the final internal resolution of MEDIOVA.
        </p>

        <h2 style={{ marginBottom: '16px', color: '#0f172a' }}>7. External Regulatory Recourse</h2>
        <p style={{ marginBottom: '32px' }}>
          Nothing in this policy prevents users from seeking legitimate external regulatory remedies under Nigerian law, including lodging consumer protection inquiries with the Federal Competition and Consumer Protection Commission (FCCPC) or data privacy complaints with the Nigeria Data Protection Commission (NDPC).
        </p>

        <div style={{ borderTop: '1px solid #e2e8f0', paddingTop: '24px', display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
          <Link to="/contact" style={{ color: '#059669', fontWeight: '700' }}>
            Contact Customer Support →
          </Link>
          <Link to="/refund-policy" style={{ color: '#059669', fontWeight: '700' }}>
            Refund Policy →
          </Link>
          <Link to="/terms" style={{ color: '#059669', fontWeight: '700' }}>
            Terms of Service & Confidentiality →
          </Link>
        </div>
      </div>
      <Footer />
    </div>
  );
}
