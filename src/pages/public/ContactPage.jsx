import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { PublicNav, Footer } from './LandingPage';
import { submitSupportTicket } from '../../services/api';
import { toast } from '../../components/ui/Toast';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    category: 'General Inquiry',
    subject: '',
    referenceNumber: '',
    message: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [submittedTicket, setSubmittedTicket] = useState(null);

  const officialWhatsApp =
    'https://wa.me/2348012345678?text=Hello%20MEDIOVA%20Team,%20I%20need%20assistance%20regarding%20my%20advertising%20inquiry.';

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.email.trim() || !formData.subject.trim() || !formData.message.trim()) {
      toast.warning('Please fill in all required fields.');
      return;
    }

    setSubmitting(true);
    try {
      const { data } = await submitSupportTicket(formData);
      if (data.success) {
        setSubmittedTicket(data.ticket);
        toast.success(data.message || 'Support ticket created successfully!');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to submit support request. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

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
            Contact &amp; Support
          </h1>
          <p className="policy-banner-subtitle">
            Connect with our Lagos advertising brokerage desk, technical team, and client support officers
          </p>
          <div className="policy-banner-meta">
            Operating Hours: Monday – Saturday &bull; Dedicated Resolution Desk &bull; Rapid Ticketing
          </div>
        </div>
      </div>

      {/* Governance Quick Links Bar */}
      <div className="governance-nav-bar">
        <div className="governance-nav-inner">
          <span style={{ fontSize: '12px', fontWeight: '700', color: '#64748b', textTransform: 'uppercase', marginRight: '6px', whiteSpace: 'nowrap' }}>
            Governance:
          </span>
          <Link to="/contact" className="btn btn-sm btn-primary" style={{ fontSize: '12px', whiteSpace: 'nowrap', borderRadius: '20px' }}>
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
          <Link to="/refund-policy" className="btn btn-sm btn-ghost" style={{ fontSize: '12px', whiteSpace: 'nowrap', borderRadius: '20px' }}>
            Refund Policy
          </Link>
          <Link to="/complaints-policy" className="btn btn-sm btn-ghost" style={{ fontSize: '12px', whiteSpace: 'nowrap', borderRadius: '20px' }}>
            Complaints &amp; Appeals
          </Link>
        </div>
      </div>

      <div style={{ maxWidth: '1000px', margin: '50px auto', padding: '0 24px' }}>
        {/* Contact Grid: Details + Interactive Form */}
        <div className="grid-2" style={{ gap: '48px', alignItems: 'flex-start' }}>
          {/* Left Column: Official Contact Channels */}
          <div>
            <h2 style={{ marginBottom: '14px', fontSize: '1.6rem', color: '#0f172a' }}>We're Here to Help</h2>
            <p style={{ color: '#64748b', lineHeight: '1.7', marginBottom: '28px' }}>
              Whether you are an advertiser configuring high-reach campaigns, a WhatsApp creator verifying status views, or an enterprise seeking custom distribution, our team is ready to assist.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', marginBottom: '32px' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '14px' }}>
                <span style={{ fontSize: '24px' }}>🏢</span>
                <div>
                  <strong style={{ color: '#0f172a' }}>Headquarters &amp; Brokerage Office</strong>
                  <div style={{ color: '#64748b', fontSize: '14px', marginTop: '2px' }}>
                    Victoria Island, Lagos State, Nigeria
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '14px' }}>
                <span style={{ fontSize: '24px' }}>✉️</span>
                <div>
                  <strong style={{ color: '#0f172a' }}>Official Support Email</strong>
                  <div style={{ color: '#64748b', fontSize: '14px', marginTop: '2px' }}>
                    <a href="mailto:support@mediova.ng" style={{ color: '#059669', fontWeight: '700' }}>
                      support@mediova.ng
                    </a>
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '14px' }}>
                <span style={{ fontSize: '24px' }}>💬</span>
                <div>
                  <strong style={{ color: '#0f172a' }}>WhatsApp Broker Desk</strong>
                  <div style={{ color: '#64748b', fontSize: '14px', marginTop: '2px' }}>
                    +234 801 234 5678 (Direct Admin Broker Line)
                  </div>
                  <a
                    href={officialWhatsApp}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-sm btn-ghost"
                    style={{ color: '#25D366', fontWeight: '700', padding: '4px 0', marginTop: '4px', display: 'inline-block' }}
                  >
                    Open WhatsApp Chat →
                  </a>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '14px' }}>
                <span style={{ fontSize: '24px' }}>⏰</span>
                <div>
                  <strong style={{ color: '#0f172a' }}>Operating Hours &amp; Response SLA</strong>
                  <div style={{ color: '#64748b', fontSize: '14px', marginTop: '2px', lineHeight: '1.6' }}>
                    Monday &ndash; Friday: 8:00 AM &ndash; 6:00 PM (WAT)<br />
                    Saturdays: 9:00 AM &ndash; 2:00 PM (WAT)<br />
                    <em>Average Response Time: Under 24 Business Hours</em>
                  </div>
                </div>
              </div>
            </div>

            <div style={{ background: '#f8fafc', padding: '20px', borderRadius: '10px', border: '1px solid #e2e8f0', fontSize: '13px', lineHeight: '1.6' }}>
              <strong style={{ color: '#0f172a' }}>Looking for Platform Policies?</strong>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginTop: '8px' }}>
                <Link to="/complaints-policy" style={{ color: '#059669', fontWeight: '600' }}>
                  → File a Formal Grievance (Complaints &amp; Appeals)
                </Link>
                <Link to="/refund-policy" style={{ color: '#059669', fontWeight: '600' }}>
                  → View Campaign Refund &amp; Cancellation Terms
                </Link>
                <Link to="/privacy" style={{ color: '#059669', fontWeight: '600' }}>
                  → Review Privacy Policy (NDPA 2023)
                </Link>
              </div>
            </div>
          </div>

          {/* Right Column: Interactive Support Ticket Form */}
          <div className="card" style={{ padding: '32px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)' }}>
            {submittedTicket ? (
              <div style={{ textAlign: 'center', padding: '30px 10px' }}>
                <div style={{ fontSize: '56px', marginBottom: '16px' }}>✅</div>
                <h3 style={{ fontSize: '1.5rem', marginBottom: '8px', color: '#0f172a' }}>Support Request Received</h3>
                <span className="badge badge-success" style={{ fontSize: '13px', padding: '6px 14px', marginBottom: '16px' }}>
                  Ticket Ref: {submittedTicket.ticketNumber}
                </span>
                <p style={{ color: '#64748b', fontSize: '14px', lineHeight: '1.6', margin: '16px 0 24px' }}>
                  Your support inquiry regarding <strong>"{submittedTicket.subject}"</strong> has been assigned to our brokerage desk. You will receive a response within 24 business hours.
                </p>
                <button
                  type="button"
                  className="btn btn-secondary btn-block"
                  onClick={() => {
                    setSubmittedTicket(null);
                    setFormData({
                      name: '',
                      email: '',
                      category: 'General Inquiry',
                      subject: '',
                      referenceNumber: '',
                      message: '',
                    });
                  }}
                >
                  Submit Another Inquiry
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                <h3 style={{ marginBottom: '6px', fontSize: '1.3rem', color: '#0f172a' }}>Send Us a Message</h3>
                <p style={{ color: '#64748b', fontSize: '13px', marginBottom: '20px' }}>
                  Fill out the form below to generate a tracked support ticket.
                </p>

                <div className="form-group">
                  <label className="form-label" htmlFor="contact-name">
                    Full Name <span className="required">*</span>
                  </label>
                  <input
                    id="contact-name"
                    type="text"
                    required
                    className="form-control"
                    placeholder="e.g. Babatunde Alabi"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="contact-email">
                    Email Address <span className="required">*</span>
                  </label>
                  <input
                    id="contact-email"
                    type="email"
                    required
                    className="form-control"
                    placeholder="babatunde@example.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label" htmlFor="contact-category">Category</label>
                    <select
                      id="contact-category"
                      className="form-control"
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    >
                      <option value="General Inquiry">General Inquiry</option>
                      <option value="Vendor / Advertising">Vendor / Advertising Order</option>
                      <option value="Influencer Gigs">Influencer Gig / Status Proof</option>
                      <option value="Payments & Billing">Payments &amp; Payouts</option>
                      <option value="Technical Support">Technical Support</option>
                      <option value="Compliance">Privacy &amp; Compliance</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label" htmlFor="contact-ref">Order / Gig # (Optional)</label>
                    <input
                      id="contact-ref"
                      type="text"
                      className="form-control"
                      placeholder="e.g. AD-XYZ or GIG-123"
                      value={formData.referenceNumber}
                      onChange={(e) => setFormData({ ...formData, referenceNumber: e.target.value })}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="contact-subject">
                    Subject <span className="required">*</span>
                  </label>
                  <input
                    id="contact-subject"
                    type="text"
                    required
                    className="form-control"
                    placeholder="Brief description of your question"
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="contact-message">
                    Detailed Message <span className="required">*</span>
                  </label>
                  <textarea
                    id="contact-message"
                    required
                    rows={4}
                    className="form-control"
                    placeholder="Provide relevant details so our team can help you efficiently..."
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  />
                </div>

                <button
                  type="submit"
                  className="btn btn-primary btn-block btn-lg"
                  disabled={submitting}
                  style={{ marginTop: '16px' }}
                >
                  {submitting ? 'Generating Support Ticket...' : 'Submit Support Request →'}
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Itemized Policy & Support Standards Section */}
        <div className="policy-content" style={{ marginTop: '60px', borderTop: '2px solid #e2e8f0', paddingTop: '40px', lineHeight: '1.85', color: '#334155' }}>
          
          <h2 style={{ marginBottom: '14px', color: '#0f172a', fontSize: '1.5rem', borderBottom: '2px solid #e2e8f0', paddingBottom: '8px' }}>
            1. Official Communication Channels
          </h2>
          <p style={{ marginBottom: '16px' }}>
            To safeguard our users from impersonation and fraudulent actors, please engage exclusively through verified MEDIOVA communication channels:
          </p>
          <ul style={{ marginBottom: '28px' }}>
            <li>
              <strong>Automated Support Ticketing:</strong> The fastest and most auditable method to resolve inquiries. Submitting through the form above or in your dashboard assigns a tracking reference code.
            </li>
            <li>
              <strong>Official Support Mailbox:</strong> Reach out directly to <a href="mailto:support@mediova.ng" style={{ color: '#059669', fontWeight: '700' }}>support@mediova.ng</a> for business partnerships, enterprise advertising, and formal disputes.
            </li>
            <li>
              <strong>Verified WhatsApp Admin Desk:</strong> Reach our administrative team directly on <code>+234 801 234 5678</code> for rapid campaign payment receipt checks or quick influencer onboarding inquiries.
            </li>
            <li>
              <strong>Corporate Headquarters:</strong> Located in Victoria Island, Lagos State, Nigeria. In-person visits require a confirmed appointment scheduled via your assigned brokerage officer.
            </li>
          </ul>

          <h2 style={{ marginBottom: '14px', color: '#0f172a', fontSize: '1.5rem', borderBottom: '2px solid #e2e8f0', paddingBottom: '8px' }}>
            2. Support Response SLAs &amp; Resolution Timelines
          </h2>
          <p style={{ marginBottom: '16px' }}>
            Our brokerage operations and technical teams adhere to the following service level standards:
          </p>
          <ul style={{ marginBottom: '28px' }}>
            <li>
              <strong>Initial Acknowledgment:</strong> Immediate issuance of your support ticket reference code upon submission.
            </li>
            <li>
              <strong>General &amp; Technical Inquiries:</strong> First response provided within <strong>24 business hours</strong> of ticket generation.
            </li>
            <li>
              <strong>Payment &amp; Transfer Verification:</strong> Bank deposit receipts are manually audited and reconciled within <strong>2 to 4 business hours</strong> during operating periods.
            </li>
            <li>
              <strong>Influencer Status Proof Audits:</strong> Creator screen-recording proofs are reviewed and approved within <strong>24 hours</strong> following the completion of the 24-hour broadcast window.
            </li>
            <li>
              <strong>Creator Bank Payouts:</strong> Withdrawals to Nigerian commercial bank accounts are processed within <strong>24 to 48 business hours</strong> following audit approval.
            </li>
          </ul>

          <h2 style={{ marginBottom: '14px', color: '#0f172a', fontSize: '1.5rem', borderBottom: '2px solid #e2e8f0', paddingBottom: '8px' }}>
            3. Guidelines for Submitting Inquiries
          </h2>
          <p style={{ marginBottom: '16px' }}>
            To expedite resolution of your inquiry, please ensure your submission contains the following details:
          </p>
          <ul style={{ marginBottom: '28px' }}>
            <li>
              <strong>For Advertisers / Vendors:</strong> Include your unique Order Reference (e.g., <code>AD-XXXX</code>), payment date, sending bank name, and attach transaction receipts where applicable.
            </li>
            <li>
              <strong>For Influencers / Creators:</strong> Include your registered phone number, WhatsApp contact, Gig Reference (e.g., <code>GIG-XXXX</code>), and unedited screen-recording video link if appealing a proof decision.
            </li>
            <li>
              <strong>For Privacy &amp; Compliance Inquiries:</strong> Reference your statutory rights under NDPA 2023 and describe the specific data category or account action requested.
            </li>
            <li>
              <strong>Security Precaution:</strong> Never share your account password, ATM card PIN, or full debit card CVV. Platform staff will never solicit these credentials.
            </li>
          </ul>

          <h2 style={{ marginBottom: '14px', color: '#0f172a', fontSize: '1.5rem', borderBottom: '2px solid #e2e8f0', paddingBottom: '8px' }}>
            4. Governance &amp; Escalation Pathways
          </h2>
          <p style={{ marginBottom: '16px' }}>
            If your inquiry requires formal policy or contractual mediation, please refer to our established governance workflows:
          </p>
          <ul style={{ marginBottom: '32px' }}>
            <li>
              <strong>Formal Complaints:</strong> File an escalated grievance under our <Link to="/complaints-policy" style={{ color: '#059669', fontWeight: '700' }}>Complaints &amp; Appeals Policy</Link>.
            </li>
            <li>
              <strong>Refund Requests:</strong> Review our criteria and submission deadlines in the <Link to="/refund-policy" style={{ color: '#059669', fontWeight: '700' }}>Refund Policy</Link>.
            </li>
            <li>
              <strong>Marketplace Rules:</strong> Check our broker intermediation covenants in the <Link to="/terms" style={{ color: '#059669', fontWeight: '700' }}>Terms of Service &amp; Confidentiality</Link>.
            </li>
            <li>
              <strong>Data Protection Rights:</strong> Exercise your access, rectification, or erasure rights via our <Link to="/privacy" style={{ color: '#059669', fontWeight: '700' }}>Privacy Policy</Link>.
            </li>
          </ul>

          {/* Bottom Cross-Links */}
          <div style={{ borderTop: '1px solid #e2e8f0', paddingTop: '24px', display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
            <Link to="/faq" style={{ color: '#059669', fontWeight: '700' }}>
              Frequently Asked Questions (FAQ) →
            </Link>
            <Link to="/terms" style={{ color: '#059669', fontWeight: '700' }}>
              Terms of Service &amp; Confidentiality →
            </Link>
            <Link to="/privacy" style={{ color: '#059669', fontWeight: '700' }}>
              Privacy Policy (NDPA 2023) →
            </Link>
            <Link to="/refund-policy" style={{ color: '#059669', fontWeight: '700' }}>
              Refund Policy →
            </Link>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
