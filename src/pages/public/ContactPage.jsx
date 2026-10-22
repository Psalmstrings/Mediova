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
      <div style={{ background: '#0f172a', color: 'white', padding: '60px 24px', textAlign: 'center' }}>
        <h1 style={{ color: 'white', fontSize: '2.5rem', marginBottom: '8px' }}>Contact & Support</h1>
        <p style={{ color: '#94a3b8' }}>
          Connect with our Lagos advertising brokerage desk and customer support team
        </p>
      </div>

      <div style={{ maxWidth: '1000px', margin: '60px auto', padding: '0 24px' }}>
        <div className="grid-2" style={{ gap: '48px', alignItems: 'flex-start' }}>
          {/* Left Column: Official Contact Channels */}
          <div>
            <h2 style={{ marginBottom: '16px', fontSize: '1.75rem' }}>We're Here to Help</h2>
            <p style={{ color: '#64748b', lineHeight: '1.7', marginBottom: '28px' }}>
              Whether you are an advertiser configuring high-reach campaigns, a WhatsApp creator verifying status views, or an enterprise seeking custom distribution, our team is ready to assist.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', marginBottom: '32px' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '14px' }}>
                <span style={{ fontSize: '24px' }}>🏢</span>
                <div>
                  <strong>Headquarters</strong>
                  <div style={{ color: '#64748b', fontSize: '14px', marginTop: '2px' }}>
                    Victoria Island, Lagos State, Nigeria
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '14px' }}>
                <span style={{ fontSize: '24px' }}>✉️</span>
                <div>
                  <strong>Official Support Email</strong>
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
                  <strong>WhatsApp Broker Desk</strong>
                  <div style={{ color: '#64748b', fontSize: '14px', marginTop: '2px' }}>
                    +234 801 234 5678 (Direct Admin Broker Line)
                  </div>
                  <a
                    href={officialWhatsApp}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-sm btn-ghost"
                    style={{ color: '#25D366', fontWeight: '700', padding: '4px 0', marginTop: '4px' }}
                  >
                    Open WhatsApp Chat →
                  </a>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '14px' }}>
                <span style={{ fontSize: '24px' }}>⏰</span>
                <div>
                  <strong>Operating Hours & Response SLA</strong>
                  <div style={{ color: '#64748b', fontSize: '14px', marginTop: '2px' }}>
                    Monday &ndash; Friday: 8:00 AM &ndash; 6:00 PM (WAT)<br />
                    Saturdays: 9:00 AM &ndash; 2:00 PM (WAT)<br />
                    <em>Average Response Time: Under 24 Business Hours</em>
                  </div>
                </div>
              </div>
            </div>

            <div style={{ background: '#f8fafc', padding: '20px', borderRadius: '10px', border: '1px solid #e2e8f0', fontSize: '13px', lineHeight: '1.6' }}>
              <strong>Looking for Policy Documents?</strong>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginTop: '8px' }}>
                <Link to="/complaints-policy" style={{ color: '#059669', fontWeight: '600' }}>
                  → File a Formal Grievance (Complaints & Appeals Policy)
                </Link>
                <Link to="/refund-policy" style={{ color: '#059669', fontWeight: '600' }}>
                  → View Campaign Refund & Cancellation Terms
                </Link>
                <Link to="/privacy" style={{ color: '#059669', fontWeight: '600' }}>
                  → Review Privacy Policy (NDPA 2023)
                </Link>
              </div>
            </div>
          </div>

          {/* Right Column: Interactive Support Ticket Form */}
          <div className="card" style={{ padding: '32px' }}>
            {submittedTicket ? (
              <div style={{ textAlign: 'center', padding: '30px 10px' }}>
                <div style={{ fontSize: '56px', marginBottom: '16px' }}>✅</div>
                <h3 style={{ fontSize: '1.5rem', marginBottom: '8px' }}>Support Request Received</h3>
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
                <h3 style={{ marginBottom: '6px', fontSize: '1.25rem' }}>Send Us a Message</h3>
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
                      <option value="Payments & Billing">Payments & Payouts</option>
                      <option value="Technical Support">Technical Support</option>
                      <option value="Compliance">Privacy & Compliance</option>
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
      </div>
      <Footer />
    </div>
  );
}
