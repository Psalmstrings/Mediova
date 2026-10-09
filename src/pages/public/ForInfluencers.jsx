import React from 'react';
import { Link } from 'react-router-dom';
import { PublicNav, Footer } from './LandingPage';

export default function ForInfluencers() {
  return (
    <div>
      <PublicNav />
      <div style={{ background: 'linear-gradient(135deg, #0B1320 0%, #166534 100%)', color: 'white', padding: '80px 24px', textAlign: 'center', borderBottom: '3px solid var(--brand-yellow)' }}>
        <span style={{ background: 'rgba(234, 179, 8, 0.15)', border: '1px solid rgba(234, 179, 8, 0.3)', color: 'var(--brand-yellow)', padding: '6px 16px', borderRadius: '20px', fontSize: '13px', fontWeight: '800', letterSpacing: '0.5px' }}>
          FOR WHATSAPP STATUS CREATORS
        </span>
        <h1 style={{ color: 'white', fontSize: '2.8rem', marginTop: '16px', marginBottom: '16px', fontWeight: '900' }}>
          Turn Your WhatsApp Status Views Into Steady Income
        </h1>
        <p style={{ color: 'rgba(255,255,255,0.8)', maxWidth: '650px', margin: '0 auto 32px', fontSize: '1.15rem', lineHeight: '1.7' }}>
          Do you average 200, 500, or 2,000+ views on your WhatsApp Status? Top Nigerian businesses are ready to pay you for 24-hour status placements.
        </p>
        <Link to="/register?role=influencer" className="btn btn-lg" style={{ background: 'var(--brand-yellow)', color: '#0F172A', fontWeight: '800' }}>
          Join As An Influencer Today &rarr;
        </Link>
      </div>

      <div style={{ maxWidth: '1100px', margin: '60px auto', padding: '0 24px' }}>
        <div className="grid-3" style={{ gap: '24px', marginBottom: '60px' }}>
          <div className="card" style={{ padding: '24px' }}>
            <div style={{ fontSize: '36px', marginBottom: '12px' }}></div>
            <h3 style={{ fontSize: '1.2rem', marginBottom: '8px' }}>Zero Haggling</h3>
            <p style={{ color: '#64748b', fontSize: '14px', lineHeight: '1.6' }}>
              No arguing with clients or waiting weeks for payment. DOPtv Admin handles all client agreements and guarantees fixed rewards.
            </p>
          </div>
          <div className="card" style={{ padding: '24px' }}>
            <div style={{ fontSize: '36px', marginBottom: '12px' }}></div>
            <h3 style={{ fontSize: '1.2rem', marginBottom: '8px' }}>Targeted Gigs</h3>
            <p style={{ color: '#64748b', fontSize: '14px', lineHeight: '1.6' }}>
              Only receive advertising gigs that match your interests, preferred categories, and geographical reach.
            </p>
          </div>
          <div className="card" style={{ padding: '24px' }}>
            <div style={{ fontSize: '36px', marginBottom: '12px' }}></div>
            <h3 style={{ fontSize: '1.2rem', marginBottom: '8px' }}>Direct Bank Transfers</h3>
            <p style={{ color: '#64748b', fontSize: '14px', lineHeight: '1.6' }}>
              Submit simple status and view screenshots. Once verified, get paid directly to your Nigerian commercial bank account.
            </p>
          </div>
        </div>

        <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '16px', padding: '40px', textAlign: 'center' }}>
          <h2 style={{ marginBottom: '12px' }}>What You Need to Qualify</h2>
          <p style={{ color: '#64748b', maxWidth: '550px', margin: '0 auto 24px' }}>
            To protect advertiser trust, we maintain high standards across all enrolled WhatsApp influencers:
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px', textAlign: 'left', maxWidth: '800px', margin: '0 auto 32px' }}>
            <div style={{ background: 'white', padding: '16px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
               <strong>Minimum 500+ Views:</strong> Consistent average views on your WhatsApp stories.
            </div>
            <div style={{ background: 'white', padding: '16px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
               <strong>Real Audiences:</strong> Genuine Nigerian contacts, no bot groups or fake screenshots.
            </div>
            <div style={{ background: 'white', padding: '16px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
               <strong>Reliable Completion:</strong> Ability to post within instructions and keep ads up for 24h.
            </div>
            <div style={{ background: 'white', padding: '16px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
               <strong>Active WhatsApp:</strong> Responsive to assigned gigs and notification alerts.
            </div>
          </div>
          <Link to="/register?role=influencer" className="btn btn-primary btn-lg">
            Create Your Influencer Account
          </Link>
        </div>
      </div>
      <Footer />
    </div>
  );
}
