import React, { useState } from 'react';
import { PublicNav, Footer } from './LandingPage';
import { toast } from '../../components/ui/Toast';

export default function ContactPage() {
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
  const [sent, setSent] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSent(true);
    toast.success('Your message has been sent to the MEDIOVA support team!');
  };

  return (
    <div>
      <PublicNav />
      <div style={{ background: '#0f172a', color: 'white', padding: '60px 24px', textAlign: 'center' }}>
        <h1 style={{ color: 'white', fontSize: '2.5rem', marginBottom: '8px' }}>Contact MEDIOVA</h1>
        <p style={{ color: '#94a3b8' }}>Get in touch with our advertising brokerage support team</p>
      </div>

      <div style={{ maxWidth: '900px', margin: '60px auto', padding: '0 24px' }}>
        <div className="grid-2" style={{ gap: '40px' }}>
          <div>
            <h2 style={{ marginBottom: '16px' }}>Let's Talk Business</h2>
            <p style={{ color: '#64748b', lineHeight: '1.7', marginBottom: '24px' }}>
              Whether you need custom enterprise reach packages, have questions about influencer verification, or require assistance with an existing campaign, our Lagos team is ready to help.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span style={{ fontSize: '24px' }}></span>
                <div>
                  <strong>Headquarters</strong>
                  <div style={{ color: '#64748b', fontSize: '14px' }}>Victoria Island, Lagos State, Nigeria</div>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span style={{ fontSize: '24px' }}>✉️</span>
                <div>
                  <strong>Official Support Email</strong>
                  <div style={{ color: '#64748b', fontSize: '14px' }}>support@mediova.ng</div>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span style={{ fontSize: '24px' }}></span>
                <div>
                  <strong>WhatsApp Broker Line</strong>
                  <div style={{ color: '#64748b', fontSize: '14px' }}>+234 801 234 5678</div>
                </div>
              </div>
            </div>
          </div>

          <div className="card" style={{ padding: '32px' }}>
            {sent ? (
              <div style={{ textAlign: 'center', padding: '40px 0' }}>
                <div style={{ fontSize: '48px', marginBottom: '16px' }}></div>
                <h3>Message Received</h3>
                <p style={{ color: '#64748b', marginTop: '8px' }}>Our brokerage team will respond within 24 business hours.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label className="form-label">Full Name</label>
                  <input
                    type="text"
                    required
                    className="form-control"
                    placeholder="e.g. Tunde Adebayo"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Email Address</label>
                  <input
                    type="email"
                    required
                    className="form-control"
                    placeholder="tunde@example.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Subject</label>
                  <input
                    type="text"
                    required
                    className="form-control"
                    placeholder="Campaign Inquiry / Question"
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Message</label>
                  <textarea
                    required
                    className="form-control"
                    rows={4}
                    placeholder="How can we assist your business or account?"
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  />
                </div>
                <button type="submit" className="btn btn-primary btn-block">
                  Send Message
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
