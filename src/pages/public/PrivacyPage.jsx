import React from 'react';
import { PublicNav, Footer } from './LandingPage';

export default function PrivacyPage() {
  return (
    <div>
      <PublicNav />
      <div style={{ background: '#0f172a', color: 'white', padding: '60px 24px', textAlign: 'center' }}>
        <h1 style={{ color: 'white', fontSize: '2.5rem', marginBottom: '8px' }}>Privacy Policy</h1>
        <p style={{ color: '#94a3b8' }}>How MEDIOVA collects, protects, and handles personal data</p>
      </div>
      <div style={{ maxWidth: '850px', margin: '60px auto', padding: '0 24px', lineHeight: '1.8', color: '#334155' }}>
        <h2 style={{ marginBottom: '16px', color: '#0f172a' }}>1. Strict Privacy Firewall</h2>
        <p style={{ marginBottom: '24px' }}>
          In accordance with our core architecture, <strong>influencer phone numbers, bank account details, and residential identities are NEVER disclosed to advertisers or vendors</strong>. Only authorized MEDIOVA administrators can view sensitive influencer details to distribute payouts and confirm reach.
        </p>

        <h2 style={{ marginBottom: '16px', color: '#0f172a' }}>2. Data We Collect</h2>
        <p style={{ marginBottom: '24px' }}>
          We collect registration emails, contact telephone numbers, state and neighborhood location references, and uploaded media (status screenshots, advertisement flyers). We do not store sensitive payment card information as online payment gateways are not used.
        </p>

        <h2 style={{ marginBottom: '16px', color: '#0f172a' }}>3. Data Protection</h2>
        <p style={{ marginBottom: '24px' }}>
          All credentials are protected using industry-standard salted hashing (bcrypt) and encrypted JSON Web Tokens. All server communications utilize HTTPS encryption.
        </p>
      </div>
      <Footer />
    </div>
  );
}
