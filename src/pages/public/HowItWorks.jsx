import React from 'react';
import { Link } from 'react-router-dom';
import { PublicNav, Footer } from './LandingPage';

export default function HowItWorks() {
  return (
    <div>
      <PublicNav />
      <div style={{ background: 'linear-gradient(135deg, #0B1320 0%, #0F172A 100%)', color: 'white', padding: '70px 24px', textAlign: 'center', borderBottom: '3px solid var(--brand-yellow)' }}>
        <h1 style={{ color: 'white', fontSize: '2.5rem', marginBottom: '12px', fontWeight: '900' }}>How DOPtv Operates</h1>
        <p style={{ color: 'rgba(255,255,255,0.75)', maxWidth: '600px', margin: '0 auto', fontSize: '1.1rem' }}>
          A managed advertising brokerage system connecting businesses with verified WhatsApp Status audiences.
        </p>
      </div>

      <div style={{ maxWidth: '1000px', margin: '60px auto', padding: '0 24px' }}>
        <div style={{ background: 'var(--brand-green-light)', border: '1px solid var(--brand-green)', borderRadius: '16px', padding: '32px', marginBottom: '40px' }}>
          <h2 style={{ color: 'var(--brand-green-dark)', marginBottom: '14px', fontWeight: '800' }}>The Managed Brokerage Flow</h2>
          <p style={{ color: 'var(--brand-green-dark)', lineHeight: '1.7', fontSize: '15px' }}>
            At DOPtv, <strong>Vendors and Influencers never directly interact or negotiate</strong>. The Admin functions as the central broker and controller: confirming payments, checking campaign requirements, matching suitable influencers by location and category, distributing gigs, verifying proof screenshots, and paying influencers.
          </p>
        </div>

        <div className="grid-2" style={{ gap: '40px' }}>
          <div className="card" style={{ padding: '32px' }}>
            <h3 style={{ color: '#059669', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span></span> For WhatsApp Influencers
            </h3>
            <ol style={{ paddingLeft: '20px', display: 'flex', flexDirection: 'column', gap: '16px', color: '#334155', lineHeight: '1.6' }}>
              <li><strong>Register & Verify Email:</strong> Create your profile with personal details, location, and phone number.</li>
              <li><strong>Submit WhatsApp Reach:</strong> Enter your average Status views and upload screenshots as proof.</li>
              <li><strong>Get Verified by Admin:</strong> Admin reviews your proof and verifies your official view tier.</li>
              <li><strong>Receive Gig Assignments:</strong> When an ad matches your location and audience category, Admin assigns it to you.</li>
              <li><strong>Post on WhatsApp Status:</strong> Keep the flyer/ad live for the required 24 hours.</li>
              <li><strong>Upload Screenshot Proof:</strong> Submit screenshots of your posted status and view metrics.</li>
              <li><strong>Get Paid:</strong> Admin approves your proof and transfers payment directly to your Nigerian bank account!</li>
            </ol>
            <div style={{ marginTop: '28px' }}>
              <Link to="/register?role=influencer" className="btn btn-primary btn-block">
                Become an Influencer
              </Link>
            </div>
          </div>

          <div className="card" style={{ padding: '32px' }}>
            <h3 style={{ color: '#2563eb', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span></span> For Businesses & Vendors
            </h3>
            <ol style={{ paddingLeft: '20px', display: 'flex', flexDirection: 'column', gap: '16px', color: '#334155', lineHeight: '1.6' }}>
              <li><strong>Create Business Account:</strong> Register your business, specify category, state, and neighborhood.</li>
              <li><strong>Create Advertisement:</strong> Upload your flyer/video, ad copy, call to action, and target audience.</li>
              <li><strong>Select Reach Package:</strong> Choose from 1,000 views, 5,000 views, 10,000 views, up to 50,000+ views.</li>
              <li><strong>Submit Order & Contact Admin:</strong> Get a generated WhatsApp message to complete payment with Admin.</li>
              <li><strong>Admin Matches Influencers:</strong> Admin filters influencers in your target location and assigns the gigs.</li>
              <li><strong>Track Live Progress:</strong> Monitor campaign distribution and verification checkpoints on your dashboard.</li>
              <li><strong>Review Campaign Results:</strong> Access full performance reports once all influencer posts are complete.</li>
            </ol>
            <div style={{ marginTop: '28px' }}>
              <Link to="/register?role=vendor" className="btn btn-block" style={{ background: '#2563eb', color: 'white' }}>
                Place an Advertisement
              </Link>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
