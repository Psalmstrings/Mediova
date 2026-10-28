import React from 'react';
import { Link } from 'react-router-dom';
import { PublicNav, Footer } from './LandingPage';

export default function RefundPolicyPage() {
  return (
    <div>
      <PublicNav />
      {/* Header Banner */}
      <div className="policy-banner">
        <div className="policy-banner-container">
          <span className="policy-banner-badge">
            Financial Governance &amp; Cancellation Framework
          </span>
          <h1 className="policy-banner-title">
            Refund &amp; Cancellation Policy
          </h1>
          <p className="policy-banner-subtitle">
            Transparent rules and auditable banking workflows governing advertising cancellations and reversals
          </p>
          <div className="policy-banner-meta">
            Effective Date: 21 October 2026 &bull; Version 2.0 &bull; Pre-Commitment Financial Disclosure
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
          <Link to="/privacy" className="btn btn-sm btn-ghost" style={{ fontSize: '12px', whiteSpace: 'nowrap', borderRadius: '20px' }}>
            Privacy Policy
          </Link>
          <Link to="/refund-policy" className="btn btn-sm btn-primary" style={{ fontSize: '12px', whiteSpace: 'nowrap', borderRadius: '20px' }}>
            Refund Policy
          </Link>
          <Link to="/complaints-policy" className="btn btn-sm btn-ghost" style={{ fontSize: '12px', whiteSpace: 'nowrap', borderRadius: '20px' }}>
            Complaints &amp; Appeals
          </Link>
        </div>
      </div>

      {/* Document Body */}
      <div className="policy-content" style={{ maxWidth: '850px', margin: '50px auto', padding: '0 24px', lineHeight: '1.85', color: '#334155' }}>
        
        <div style={{ background: '#ecfdf5', border: '1px solid #a7f3d0', borderRadius: '8px', padding: '16px 20px', marginBottom: '36px', fontSize: '13px', lineHeight: '1.6' }}>
          <strong style={{ color: '#065f46' }}>🛡️ Financial Integrity &amp; Protection:</strong> Advertisers are provided transparent access to this policy prior to confirming payment. Approved refunds are executed exclusively through electronic bank transfers with verified bank transaction reference numbers recorded in platform audit logs.
        </div>

        {/* Section 1 */}
        <section style={{ marginBottom: '36px' }}>
          <h2 style={{ fontSize: '1.4rem', fontWeight: '800', color: '#0f172a', marginBottom: '14px', borderBottom: '2px solid #e2e8f0', paddingBottom: '8px' }}>
            1. Scope &amp; Foundational Principles
          </h2>
          <p style={{ marginBottom: '14px' }}>
            MEDIOVA operates as a managed advertising broker coordinating reach fulfillment between advertisers and independent WhatsApp creators. Because advertising campaigns involve reserving creator broadcast slots, refund eligibility is evaluated based on the operational milestone of the campaign at the exact time the cancellation request is lodged:
          </p>
          <ul>
            <li>
              <strong>Pre-Assignment Status:</strong> Prior to influencer assignment, campaign funds remain fully intact and eligible for complete reversal.
            </li>
            <li>
              <strong>Creator Protection:</strong> Once creators have broadcast status ads and verified viewers, their earned remuneration is protected and cannot be retroactively cancelled.
            </li>
            <li>
              <strong>Auditable Execution:</strong> No refund is marked complete on the platform without a verifiable banking transfer reference number.
            </li>
          </ul>
        </section>

        {/* Section 2 */}
        <section style={{ marginBottom: '36px' }}>
          <h2 style={{ fontSize: '1.4rem', fontWeight: '800', color: '#0f172a', marginBottom: '14px', borderBottom: '2px solid #e2e8f0', paddingBottom: '8px' }}>
            2. Eligible Circumstances for a Refund
          </h2>
          <p style={{ marginBottom: '14px' }}>
            Advertisers are entitled to submit a formal refund request under the following verified conditions:
          </p>
          <ul>
            <li>
              <strong>Cancellation Prior to Influencer Assignment (100% Full Refund):</strong>
              <div style={{ marginTop: '4px' }}>
                If an advertiser has confirmed payment but requests cancellation before MEDIOVA administrators have assigned the campaign to influencers, a full 100% refund of the campaign budget will be processed immediately.
              </div>
            </li>
            <li>
              <strong>Service Level Agreement (SLA) Expiration &amp; Non-Delivery:</strong>
              <div style={{ marginTop: '4px' }}>
                If MEDIOVA is unable to recruit and deploy verified influencers to fulfill the guaranteed view threshold within seven (7) business days of confirmed payment, the advertiser may elect to receive a full 100% refund or a pro-rata refund for the unfulfilled reach balance.
              </div>
            </li>
            <li>
              <strong>Rejected or Prohibited Campaign Content:</strong>
              <div style={{ marginTop: '4px' }}>
                If an advertising order is declined during administrative compliance review (e.g. promoting prohibited items, adult material, or non-compliant schemes) and the vendor chooses not to provide compliant alternative creative assets, the payment will be refunded in full.
              </div>
            </li>
            <li>
              <strong>Accidental Duplicate Payments:</strong>
              <div style={{ marginTop: '4px' }}>
                If an advertiser inadvertently executes multiple transfers for the same advertising order, the excess payment amount will be refunded in full immediately upon banking reconciliation.
              </div>
            </li>
          </ul>
        </section>

        {/* Section 3 */}
        <section style={{ marginBottom: '36px' }}>
          <h2 style={{ fontSize: '1.4rem', fontWeight: '800', color: '#0f172a', marginBottom: '14px', borderBottom: '2px solid #e2e8f0', paddingBottom: '8px' }}>
            3. Non-Refundable Circumstances &amp; Exclusions
          </h2>
          <p style={{ marginBottom: '14px' }}>
            Refunds cannot be issued under any of the following operational circumstances:
          </p>
          <ul>
            <li>
              <strong>Active or Completed Campaigns:</strong>
              <div style={{ marginTop: '4px' }}>
                Once assigned creators have published the promotional assets to their WhatsApp Statuses and accumulated verified viewers, the advertising fee is non-refundable. Creator time, broadcast inventory, and audience exposure cannot be retrieved.
              </div>
            </li>
            <li>
              <strong>Advertiser Commercial Conversion &amp; Sales ROI:</strong>
              <div style={{ marginTop: '4px' }}>
                MEDIOVA guarantees verified WhatsApp viewer counts, authentic screen recordings, and 24-hour broadcast duration. We do not guarantee external sales, customer purchases, or conversion rates, as these depend on the advertiser's product appeal, pricing, and sales funnels.
              </div>
            </li>
            <li>
              <strong>Advertiser Dead Links or Disconnected Numbers:</strong>
              <div style={{ marginTop: '4px' }}>
                Campaign performance issues caused by advertiser error—such as supplying broken website URLs, inactive WhatsApp contact numbers, or expired discount codes—do not qualify for a refund.
              </div>
            </li>
            <li>
              <strong>Change of Mind Post-Launch:</strong>
              <div style={{ marginTop: '4px' }}>
                Requests to halt a campaign after influencers have already begun broadcasting do not entitle the advertiser to a fee reversal.
              </div>
            </li>
          </ul>
        </section>

        {/* Section 4 */}
        <section style={{ marginBottom: '36px' }}>
          <h2 style={{ fontSize: '1.4rem', fontWeight: '800', color: '#0f172a', marginBottom: '14px', borderBottom: '2px solid #e2e8f0', paddingBottom: '8px' }}>
            4. Step-by-Step Refund Request Workflow
          </h2>
          <p style={{ marginBottom: '14px' }}>
            To ensure complete auditability, all refund requests must be lodged through the authenticated Vendor Dashboard:
          </p>
          <ol>
            <li>
              <strong>Navigate to Your Order:</strong> Log in to your Vendor Portal, go to <strong>My Orders</strong>, and select the relevant Order record.
            </li>
            <li>
              <strong>Initiate Request:</strong> Click the <strong>"Request Refund"</strong> button available on any order with confirmed payment that has not yet reached completion.
            </li>
            <li>
              <strong>Provide Details &amp; Banking Information:</strong> Select the applicable cancellation reason, provide a detailed explanation, and enter your commercial bank account name, bank name, and account number (NUBAN for Nigeria, or international IBAN).
            </li>
            <li>
              <strong>Submit for Audit:</strong> Submit the request to trigger formal review by our financial control desk.
            </li>
          </ol>
        </section>

        {/* Section 5 */}
        <section style={{ marginBottom: '36px' }}>
          <h2 style={{ fontSize: '1.4rem', fontWeight: '800', color: '#0f172a', marginBottom: '14px', borderBottom: '2px solid #e2e8f0', paddingBottom: '8px' }}>
            5. Processing Timelines &amp; Response SLAs
          </h2>
          <p style={{ marginBottom: '14px' }}>
            We adhere to strict operational service levels for all financial reversals:
          </p>
          <ul>
            <li>
              <strong>Administrative Review:</strong> Refund requests are examined against campaign logs within <strong>3 to 5 business days</strong> of submission.
            </li>
            <li>
              <strong>Disbursement Execution:</strong> Upon approval, electronic bank transfers are dispatched within <strong>24 to 48 business hours</strong>.
            </li>
            <li>
              <strong>Proof of Reversal:</strong> The official banking transaction reference number is attached directly to the order timeline for transparent recordkeeping.
            </li>
          </ul>
        </section>

        {/* Section 6 */}
        <section style={{ marginBottom: '36px' }}>
          <h2 style={{ fontSize: '1.4rem', fontWeight: '800', color: '#0f172a', marginBottom: '14px', borderBottom: '2px solid #e2e8f0', paddingBottom: '8px' }}>
            6. Permitted Status Transitions
          </h2>
          <p style={{ marginBottom: '14px' }}>
            To safeguard marketplace funds, refund records transition strictly through auditable milestones:
          </p>
          <ul>
            <li>
              <code>Requested</code> &rarr; Order is flagged and campaign matching is paused immediately.
            </li>
            <li>
              <code>Under Review</code> &rarr; Finance team verifies proof of payment and current influencer status.
            </li>
            <li>
              <code>Approved</code> / <code>Rejected</code> &rarr; Formal decision recorded with explicit notes to the vendor.
            </li>
            <li>
              <code>Processing</code> &rarr; Bank transfer batch generated by authorized controllers.
            </li>
            <li>
              <code>Refunded</code> &rarr; Bank transaction reference entered; funds cleared back to advertiser.
            </li>
          </ul>
        </section>

        {/* Section 7 */}
        <section style={{ marginBottom: '36px' }}>
          <h2 style={{ fontSize: '1.4rem', fontWeight: '800', color: '#0f172a', marginBottom: '14px', borderBottom: '2px solid #e2e8f0', paddingBottom: '8px' }}>
            7. Appeals &amp; Escalations
          </h2>
          <p style={{ marginBottom: '14px' }}>
            If your refund request is declined and you possess additional evidence (such as proof of non-performance or technical errors), you may:
          </p>
          <ul>
            <li>
              File a formal grievance via our <Link to="/complaints-policy" style={{ color: '#059669', fontWeight: '700' }}>Complaints &amp; Appeals Procedure</Link>.
            </li>
            <li>
              Contact the Senior Ombudsman desk directly at <a href="mailto:support@mediova.ng" style={{ color: '#059669', fontWeight: '700' }}>support@mediova.ng</a> with your Order Reference Number.
            </li>
          </ul>
        </section>

        {/* Bottom Navigation */}
        <div style={{ borderTop: '2px solid #e2e8f0', paddingTop: '28px', marginTop: '40px', display: 'flex', gap: '24px', flexWrap: 'wrap' }}>
          <Link to="/terms" style={{ color: '#059669', fontWeight: '700', fontSize: '14px' }}>
            Terms &amp; Confidentiality Provisions →
          </Link>
          <Link to="/privacy" style={{ color: '#059669', fontWeight: '700', fontSize: '14px' }}>
            Privacy Policy (NDPA 2023) →
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
