import React from 'react';
import { PublicNav, Footer } from './LandingPage';

export default function TermsPage() {
  return (
    <div>
      <PublicNav />
      <div style={{ background: '#0f172a', color: 'white', padding: '60px 24px', textAlign: 'center' }}>
        <h1 style={{ color: 'white', fontSize: '2.5rem', marginBottom: '8px' }}>Terms & Conditions</h1>
        <p style={{ color: '#94a3b8' }}>DOPtv Marketplace Terms of Service and Operational Rules</p>
      </div>
      <div style={{ maxWidth: '850px', margin: '60px auto', padding: '0 24px', lineHeight: '1.8', color: '#334155' }}>
        <h2 style={{ marginBottom: '16px', color: '#0f172a' }}>1. Managed Brokerage Structure</h2>
        <p style={{ marginBottom: '24px' }}>
          DOPtv operates exclusively as an advertising broker and manager. Vendors and Influencers are prohibited from bypassing the platform or establishing unmanaged private arrangements for gigs distributed via DOPtv.
        </p>

        <h2 style={{ marginBottom: '16px', color: '#0f172a' }}>2. Influencer Obligations</h2>
        <p style={{ marginBottom: '24px' }}>
          Influencers agree to maintain assigned advertisements on their WhatsApp Status for a continuous minimum duration of 24 hours without deleting, archiving, or obstructing them. Submission of fabricated, modified, or re-used screenshots constitutes fraud resulting in permanent ban and forfeiture of pending balance.
        </p>

        <h2 style={{ marginBottom: '16px', color: '#0f172a' }}>3. Advertiser & Vendor Content</h2>
        <p style={{ marginBottom: '24px' }}>
          Vendors confirm they possess legal copyright or license for all uploaded images, media, logos, and promotional copies. DOPtv reserves the right to decline or terminate campaigns advertising prohibited goods, illegal investments, or misleading offers.
        </p>

        <h2 style={{ marginBottom: '16px', color: '#0f172a' }}>4. Payments & Confirmations</h2>
        <p style={{ marginBottom: '24px' }}>
          Campaign orders are activated upon manual confirmation of payment by the platform administrator via official WhatsApp communication channels. All influencer payouts are processed according to approved submission verification metrics.
        </p>
      </div>
      <Footer />
    </div>
  );
}
