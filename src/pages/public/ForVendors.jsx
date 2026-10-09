import React from 'react';
import { Link } from 'react-router-dom';
import { PublicNav, Footer } from './LandingPage';

export default function ForVendors() {
  return (
    <div>
      <PublicNav />
      <div style={{ background: 'linear-gradient(135deg, #0B1320 0%, #166534 100%)', color: 'white', padding: '80px 24px', textAlign: 'center', borderBottom: '3px solid var(--brand-yellow)' }}>
        <span style={{ background: 'rgba(234, 179, 8, 0.15)', border: '1px solid rgba(234, 179, 8, 0.3)', color: 'var(--brand-yellow)', padding: '6px 16px', borderRadius: '20px', fontSize: '13px', fontWeight: '800', letterSpacing: '0.5px' }}>
          FOR BUSINESSES & ADVERTISERS
        </span>
        <h1 style={{ color: 'white', fontSize: '2.8rem', marginTop: '16px', marginBottom: '16px', fontWeight: '900' }}>
          Your Business Deserves to Be Seen
        </h1>
        <p style={{ color: 'rgba(255,255,255,0.8)', maxWidth: '650px', margin: '0 auto 32px', fontSize: '1.15rem', lineHeight: '1.7' }}>
          Reach thousands of real, local customers where they spend the most time: their WhatsApp friend list. Broadcast your message through trusted micro-influencers.
        </p>
        <Link to="/register?role=vendor" className="btn btn-lg" style={{ background: 'var(--brand-yellow)', color: '#0F172A', fontWeight: '800' }}>
          Place an Advertisement Now &rarr;
        </Link>
      </div>

      <div style={{ maxWidth: '1100px', margin: '60px auto', padding: '0 24px' }}>
        <div className="grid-3" style={{ gap: '24px', marginBottom: '60px' }}>
          <div className="card" style={{ padding: '24px' }}>
            <div style={{ fontSize: '36px', marginBottom: '12px' }}></div>
            <h3 style={{ fontSize: '1.2rem', marginBottom: '8px' }}>Hyper-Local Targeting</h3>
            <p style={{ color: '#64748b', fontSize: '14px', lineHeight: '1.6' }}>
              Target customers in Lekki, Ikeja, Surulere, Abuja Garki, Port Harcourt Rumuola, or specific local government areas.
            </p>
          </div>
          <div className="card" style={{ padding: '24px' }}>
            <div style={{ fontSize: '36px', marginBottom: '12px' }}></div>
            <h3 style={{ fontSize: '1.2rem', marginBottom: '8px' }}>Guaranteed Verified Views</h3>
            <p style={{ color: '#64748b', fontSize: '14px', lineHeight: '1.6' }}>
              Packages starting from 1,000 views to 50,000+ views. Every view count is verified through audited screenshot submissions.
            </p>
          </div>
          <div className="card" style={{ padding: '24px' }}>
            <div style={{ fontSize: '36px', marginBottom: '12px' }}></div>
            <h3 style={{ fontSize: '1.2rem', marginBottom: '8px' }}>Fully Managed Campaign</h3>
            <p style={{ color: '#64748b', fontSize: '14px', lineHeight: '1.6' }}>
              You don’t have to chat with dozens of individual creators. We assign, coordinate, monitor deadlines, and compile your proof.
            </p>
          </div>
        </div>

        <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '16px', padding: '40px' }}>
          <h2 style={{ textAlign: 'center', marginBottom: '32px' }}>Popular Advertising Packages</h2>
          <div className="grid-3" style={{ gap: '20px' }}>
            <div style={{ background: 'white', padding: '28px', borderRadius: '12px', border: '1px solid #e2e8f0', textAlign: 'center' }}>
              <h3 style={{ fontSize: '1.25rem', marginBottom: '8px' }}>Starter Reach</h3>
              <div style={{ fontSize: '2rem', fontWeight: '800', color: '#059669', marginBottom: '8px' }}>1,000 Views</div>
              <p style={{ color: '#64748b', fontSize: '13px', marginBottom: '20px' }}>Ideal for testing new products or neighborhood promotions.</p>
              <Link to="/register?role=vendor" className="btn btn-secondary btn-block">Order Now</Link>
            </div>
            <div style={{ background: 'white', padding: '28px', borderRadius: '12px', border: '2px solid #2563eb', textAlign: 'center', position: 'relative' }}>
              <div style={{ position: 'absolute', top: '-12px', left: '50%', transform: 'translateX(-50%)', background: '#2563eb', color: 'white', fontSize: '11px', fontWeight: '700', padding: '4px 12px', borderRadius: '10px' }}>POPULAR</div>
              <h3 style={{ fontSize: '1.25rem', marginBottom: '8px' }}>Growth Reach</h3>
              <div style={{ fontSize: '2rem', fontWeight: '800', color: '#2563eb', marginBottom: '8px' }}>10,000 Views</div>
              <p style={{ color: '#64748b', fontSize: '13px', marginBottom: '20px' }}>Perfect for brand awareness, product launches, & events.</p>
              <Link to="/register?role=vendor" className="btn btn-block" style={{ background: '#2563eb', color: 'white' }}>Order Now</Link>
            </div>
            <div style={{ background: 'white', padding: '28px', borderRadius: '12px', border: '1px solid #e2e8f0', textAlign: 'center' }}>
              <h3 style={{ fontSize: '1.25rem', marginBottom: '8px' }}>Dominance Reach</h3>
              <div style={{ fontSize: '2rem', fontWeight: '800', color: '#059669', marginBottom: '8px' }}>25,000+ Views</div>
              <p style={{ color: '#64748b', fontSize: '13px', marginBottom: '20px' }}>Comprehensive multi-influencer blitz across top cities.</p>
              <Link to="/register?role=vendor" className="btn btn-secondary btn-block">Order Now</Link>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
