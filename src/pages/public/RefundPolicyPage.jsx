import React from 'react';
import { Link } from 'react-router-dom';
import { PublicNav, Footer } from './LandingPage';

export default function RefundPolicyPage() {
  return (
    <div>
      <PublicNav />
      <div style={{ background: '#0f172a', color: 'white', padding: '60px 24px', textAlign: 'center' }}>
        <h1 style={{ color: 'white', fontSize: '2.5rem', marginBottom: '8px' }}>Refund & Cancellation Policy</h1>
        <p style={{ color: '#94a3b8' }}>
          Transparent financial rules governing advertising campaign cancellations and reversals
        </p>
        <div style={{ marginTop: '12px', fontSize: '13px', color: '#cbd5e1' }}>
          Effective Date: 21 October 2026 &bull; Version 2.0
        </div>
      </div>

      <div style={{ maxWidth: '850px', margin: '60px auto', padding: '0 24px', lineHeight: '1.8', color: '#334155' }}>
        
        <div className="alert alert-info" style={{ marginBottom: '32px', fontSize: '13px' }}>
          ℹ️ <strong>Financial Transparency:</strong> Advertisers have access to this Refund Policy before committing payment. When eligible refunds are approved, payments are reversed via direct bank transfer and logged with an auditable transaction reference.
        </div>

        <h2 style={{ marginBottom: '16px', color: '#0f172a' }}>1. Scope & Core Principle</h2>
        <p style={{ marginBottom: '24px' }}>
          MEDIOVA operates as a managed advertising broker. Because advertising reach involves booking creator inventory and distributing promotional creative assets, refunds are evaluated based on the specific operational state of the campaign at the time the refund request is lodged.
        </p>

        <h2 style={{ marginBottom: '16px', color: '#0f172a' }}>2. Eligible Circumstances for a Refund</h2>
        <p style={{ marginBottom: '12px' }}>
          Advertisers may submit a formal refund request under the following verified conditions:
        </p>
        <ul style={{ paddingLeft: '24px', marginBottom: '24px' }}>
          <li>
            <strong>Cancellation Prior to Influencer Assignment (100% Refund):</strong> If an advertiser confirms payment but requests cancellation before MEDIOVA administrators have assigned the campaign to influencers, a full 100% refund of the campaign fee will be approved.
          </li>
          <li>
            <strong>Non-Delivery or SLA Expiration:</strong> If MEDIOVA is unable to recruit and deploy sufficient verified influencers to meet the minimum guaranteed views within seven (7) business days of confirmed payment, the advertiser may request a full refund or a pro-rata refund for the unfulfilled reach balance.
          </li>
          <li>
            <strong>Rejected or Prohibited Campaign:</strong> If a campaign is paid for but subsequently rejected during compliance review because it violates advertising standards, and the advertiser chooses not to revise the creative copy, a full refund is processed.
          </li>
          <li>
            <strong>Duplicate Payment:</strong> If an advertiser accidentally executes duplicate bank transfers for a single advertising order, the excess payment will be refunded in full upon bank verification.
          </li>
        </ul>

        <h2 style={{ marginBottom: '16px', color: '#0f172a' }}>3. Non-Refundable Circumstances & Exclusions</h2>
        <p style={{ marginBottom: '12px' }}>
          Refunds cannot be granted under the following circumstances:
        </p>
        <ul style={{ paddingLeft: '24px', marginBottom: '24px' }}>
          <li>
            <strong>Active or Completed Campaigns:</strong> Once assigned creators have published the advertisement on their WhatsApp Statuses and accumulated verified views, the campaign fee is non-refundable. Creator time and audience reach cannot be retrieved.
          </li>
          <li>
            <strong>Advertiser Commercial Conversion:</strong> MEDIOVA guarantees authentic view metrics and verified 24-hour Status broadcast. We do not guarantee specific sales, inquiries, or third-party conversion rates, as these depend on the advertiser's product quality, pricing, and sales funnels.
          </li>
          <li>
            <strong>Delayed Performance Proof Due to Advertiser Issues:</strong> Inactive destination links, disconnected WhatsApp business numbers, or invalid phone numbers supplied by the advertiser do not constitute platform non-delivery.
          </li>
        </ul>

        <h2 style={{ marginBottom: '16px', color: '#0f172a' }}>4. Refund Request Workflow</h2>
        <p style={{ marginBottom: '12px' }}>
          Advertisers must lodge refund requests directly through their authenticated dashboard to maintain an auditable electronic paper trail:
        </p>
        <ol style={{ paddingLeft: '24px', marginBottom: '24px' }}>
          <li>Navigate to <strong>My Orders</strong> in your Vendor Dashboard and select the relevant order.</li>
          <li>Click <strong>"Request Refund"</strong> on any order with confirmed payment that has not yet completed delivery.</li>
          <li>Select the applicable refund reason, enter a detailed explanation, and provide your receiving 10-digit NUBAN Nigerian bank account details.</li>
          <li>Submit the request to initiate administrative review.</li>
        </ol>

        <h2 style={{ marginBottom: '16px', color: '#0f172a' }}>5. Review Timelines & Processing SLAs</h2>
        <p style={{ marginBottom: '24px' }}>
          Refund requests are reviewed by our financial controllers within <strong>3 to 5 business days</strong>. If approved, fund disbursements are executed via direct Nigerian electronic bank transfer (NIP) within <strong>24 to 48 business hours</strong> of approval. A valid banking transfer reference number is recorded against the order record.
        </p>

        <h2 style={{ marginBottom: '16px', color: '#0f172a' }}>6. Permitted Status Transitions</h2>
        <p style={{ marginBottom: '24px' }}>
          To protect financial integrity, refund requests transition strictly through verified milestones: <code>Requested</code> &rarr; <code>Under Review</code> &rarr; <code>Approved</code> or <code>Rejected</code> &rarr; <code>Processing</code> &rarr; <code>Refunded</code>. An approval in the database is never treated as completion until the authorized administrative bank transfer reference is entered.
        </p>

        <h2 style={{ marginBottom: '16px', color: '#0f172a' }}>7. Appeals & Contact</h2>
        <p style={{ marginBottom: '32px' }}>
          If your refund request is rejected and you have additional evidence, you may submit an appeal under our <Link to="/complaints-policy" style={{ color: '#059669', fontWeight: '700' }}>Complaints and Appeals Policy</Link> or contact our finance desk at <a href="mailto:support@mediova.ng" style={{ color: '#059669', fontWeight: '700' }}>support@mediova.ng</a>.
        </p>

        <div style={{ borderTop: '1px solid #e2e8f0', paddingTop: '24px', display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
          <Link to="/terms" style={{ color: '#059669', fontWeight: '700' }}>
            Terms of Service & Confidentiality →
          </Link>
          <Link to="/privacy" style={{ color: '#059669', fontWeight: '700' }}>
            Privacy Policy (NDPA 2023) →
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
