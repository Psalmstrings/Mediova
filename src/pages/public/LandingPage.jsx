import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';

const faqs = [
  {
    q: 'How does MEDIOVA ensure authentic WhatsApp Status views?',
    a: 'Every influencer is manually vetted. Reach metrics, screenshot submissions, and viewer location stamps are verified by our admin team before payout approval.',
  },
  {
    q: 'How fast do influencers get paid?',
    a: 'Once your 24-hour Status post proof is approved by the admin broker, your balance updates immediately and direct bank transfers are executed without delays.',
  },
  {
    q: 'Do advertisers talk directly to influencers?',
    a: 'No. MEDIOVA is a fully managed brokerage. Advertisers place orders and submit creatives; our platform distributes assignments, verifies execution, and guarantees performance.',
  },
  {
    q: 'Can any WhatsApp user become an influencer?',
    a: 'Anyone with an engaged audience and regular viewers across Nigeria can apply. We welcome micro-influencers with 100+ active status viewers up to major creators.',
  },
  {
    q: 'Which Nigerian locations are supported?',
    a: 'We distribute hyper-local advertising across Lagos, Abuja, Port Harcourt, Ibadan, Enugu, Kano, and dozens of tertiary institution campuses nationwide.',
  },
];

const categories = [
  { name: 'Fashion & Apparel', count: '140+ Campaigns' },
  { name: 'Electronics & Gadgets', count: '95+ Campaigns' },
  { name: 'Real Estate & Rentals', count: '70+ Campaigns' },
  { name: 'Food & Restaurants', count: '230+ Campaigns' },
  { name: 'Tech & Digital Courses', count: '110+ Campaigns' },
  { name: 'Fintech & Investment', count: '85+ Campaigns' },
  { name: 'Events & Entertainment', count: '160+ Campaigns' },
  { name: 'Beauty & Skincare', count: '145+ Campaigns' },
];

const PublicNav = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const dashMap = { admin: '/admin/dashboard', influencer: '/influencer/dashboard', vendor: '/vendor/dashboard' };

  return (
    <nav className="landing-nav">
      <Link to="/" className="sidebar-brand" style={{ textDecoration: 'none' }}>
        <span className="brand-dot"></span>
        <span className="brand-name" style={{ color: 'var(--brand-dark)' }}>
          MEDIOVA
        </span>
      </Link>
      <div className="nav-links">
        <Link to="/how-it-works" className="nav-link">How It Works</Link>
        <Link to="/for-influencers" className="nav-link">For Influencers</Link>
        <Link to="/for-vendors" className="nav-link">For Businesses</Link>
        <Link to="/faq" className="nav-link">FAQ</Link>
      </div>
      <div className="nav-actions">
        {user ? (
          <button className="btn btn-primary" onClick={() => navigate(dashMap[user.role] || '/')}>
            Go to Dashboard
          </button>
        ) : (
          <>
            <Link to="/login" className="btn btn-ghost">Sign In</Link>
            <Link to="/register" className="btn btn-primary">Get Started</Link>
          </>
        )}
      </div>
    </nav>
  );
};

const Footer = () => (
  <footer className="site-footer">
    <div className="footer-grid">
      <div className="footer-brand">
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
          <span className="brand-dot"></span>
          <span style={{ fontSize: '24px', fontWeight: '900', color: 'white', letterSpacing: '-0.5px' }}>
            MEDIOVA
          </span>
        </div>
        <p className="footer-tagline">
          Nigeria's premier WhatsApp Status advertising brokerage. Connecting ambitious brands with trusted local creators.
        </p>
      </div>
      <div className="footer-col">
        <h4>Solutions</h4>
        <div className="footer-links">
          <Link to="/for-vendors" className="footer-link">Advertise Business</Link>
          <Link to="/for-influencers" className="footer-link">Monetize Status</Link>
          <Link to="/how-it-works" className="footer-link">Brokerage Model</Link>
        </div>
      </div>
      <div className="footer-col">
        <h4>Platform</h4>
        <div className="footer-links">
          <Link to="/faq" className="footer-link">Help & FAQs</Link>
          <Link to="/terms" className="footer-link">Terms of Service</Link>
          <Link to="/privacy" className="footer-link">Privacy Policy</Link>
        </div>
      </div>
      <div className="footer-col">
        <h4>Coverage</h4>
        <div className="footer-links">
          <span style={{ fontSize: '13px', color: 'rgba(255,255,255,0.6)' }}>Lagos &bull; Abuja &bull; PH &bull; Nationwide</span>
          <span style={{ fontSize: '13px', color: 'var(--brand-yellow)', marginTop: '8px' }}>Verified Nigerian Creator Network</span>
        </div>
      </div>
    </div>
    <div className="footer-bottom">
      <span>&copy; {new Date().getFullYear()} MEDIOVA Technology Marketplace. All rights reserved.</span>
      <span>Direct WhatsApp Audience Delivery</span>
    </div>
  </footer>
);

export default function LandingPage() {
  const [openFaq, setOpenFaq] = useState(null);

  return (
    <div style={{ background: '#FFFFFF' }}>
      <PublicNav />

      {/* HERO SECTION: Commercial, punchy, sells without over-explaining */}
      <section style={{
        background: 'linear-gradient(180deg, #0B1320 0%, #0F172A 100%)',
        color: 'white',
        padding: '80px 24px 70px',
        textAlign: 'center',
        position: 'relative',
        borderBottom: '3px solid var(--brand-yellow)'
      }}>
        <div style={{ maxWidth: '860px', margin: '0 auto' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            background: 'rgba(234, 179, 8, 0.12)',
            border: '1px solid rgba(234, 179, 8, 0.3)',
            color: 'var(--brand-yellow)',
            padding: '6px 16px',
            borderRadius: '9999px',
            fontSize: '13px',
            fontWeight: '700',
            marginBottom: '24px'
          }}>
            WhatsApp Status Creator Network &bull; Nigeria
          </div>

          <h1 style={{
            fontSize: 'clamp(2.4rem, 5vw, 4rem)',
            fontWeight: '900',
            letterSpacing: '-1px',
            lineHeight: '1.15',
            color: '#FFFFFF',
            marginBottom: '20px'
          }}>
            Turn WhatsApp Views Into <span style={{ color: 'var(--brand-yellow)' }}>Income</span>.<br />
            Get Brands Seen by <span style={{ color: 'var(--brand-green-light)' }}>Real People</span>.
          </h1>

          <p style={{
            fontSize: 'clamp(1rem, 2vw, 1.25rem)',
            color: 'rgba(255,255,255,0.8)',
            maxWidth: '680px',
            margin: '0 auto 36px',
            lineHeight: '1.6'
          }}>
            MEDIOVA is the managed advertising bridge between high-growth Nigerian businesses and verified WhatsApp Status influencers.
          </p>

          <div style={{ display: 'flex', gap: '14px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/register?role=influencer" className="btn btn-lg" style={{ background: 'var(--brand-yellow)', color: '#0F172A', fontWeight: '800' }}>
              Earn as an Influencer
            </Link>
            <Link to="/register?role=vendor" className="btn btn-lg" style={{ background: 'var(--brand-green)', color: 'white', fontWeight: '700' }}>
              Launch an Ad Campaign
            </Link>
          </div>

          {/* Social Proof Row */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
            gap: '20px',
            marginTop: '56px',
            paddingTop: '32px',
            borderTop: '1px solid rgba(255,255,255,0.1)'
          }}>
            <div>
              <div style={{ fontSize: '2.2rem', fontWeight: '900', color: 'var(--brand-yellow)' }}>500+</div>
              <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.6)' }}>Verified Creators</div>
            </div>
            <div>
              <div style={{ fontSize: '2.2rem', fontWeight: '900', color: '#FFFFFF' }}>1.2M+</div>
              <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.6)' }}>Targeted Status Views</div>
            </div>
            <div>
              <div style={{ fontSize: '2.2rem', fontWeight: '900', color: 'var(--brand-green-light)' }}>₦12M+</div>
              <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.6)' }}>Paid to Influencers</div>
            </div>
            <div>
              <div style={{ fontSize: '2.2rem', fontWeight: '900', color: '#FFFFFF' }}>100%</div>
              <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.6)' }}>Proof Verification</div>
            </div>
          </div>
        </div>
      </section>

      {/* DUAL VALUE PROPOSITION (Conversion cards) */}
      <section style={{ padding: '70px 24px', background: 'var(--surface2)' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '44px' }}>
            <h2 style={{ fontSize: '2.2rem', fontWeight: '900', color: 'var(--brand-dark)' }}>Built for Both Sides of the Market</h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '16px' }}>Whether you hold the audience or the product, MEDIOVA makes growth seamless.</p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px' }}>
            {/* For Influencers */}
            <div className="card" style={{ padding: '36px', borderTop: '4px solid var(--brand-yellow)' }}>
              <span style={{ fontSize: '12px', fontWeight: '800', color: 'var(--brand-yellow-dark)', textTransform: 'uppercase', letterSpacing: '1px' }}>
                For WhatsApp Creators
              </span>
              <h3 style={{ fontSize: '1.6rem', fontWeight: '800', margin: '8px 0 16px', color: 'var(--brand-dark)' }}>
                Monetize your status audience weekly.
              </h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '14.5px', lineHeight: '1.6', marginBottom: '24px' }}>
                Stop posting for free. If you have 100+ daily views from friends, colleagues, or classmates, businesses are paying to reach them.
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '28px' }}>
                {['Guaranteed payouts per gig completed', 'Ad creatives provided by admin', 'No client negotiation or chasing invoices', 'Fast direct bank deposits'].map((point) => (
                  <div key={point} style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '14px', color: 'var(--text-primary)' }}>
                    <span style={{ color: 'var(--brand-green)', fontWeight: '900' }}>✓</span> {point}
                  </div>
                ))}
              </div>
              <Link to="/register?role=influencer" className="btn btn-primary btn-block">
                Start Earning on WhatsApp
              </Link>
            </div>

            {/* For Businesses */}
            <div className="card" style={{ padding: '36px', borderTop: '4px solid var(--brand-green)' }}>
              <span style={{ fontSize: '12px', fontWeight: '800', color: 'var(--brand-green)', textTransform: 'uppercase', letterSpacing: '1px' }}>
                For Businesses & Brands
              </span>
              <h3 style={{ fontSize: '1.6rem', fontWeight: '800', margin: '8px 0 16px', color: 'var(--brand-dark)' }}>
                Reach real people where they actually look.
              </h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '14.5px', lineHeight: '1.6', marginBottom: '24px' }}>
                WhatsApp Status has higher open rates than Instagram and email combined. Reach hyper-local buyers in your city with verified delivery.
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '28px' }}>
                {['Target specific states, cities, and schools', 'Admin-verified screenshot proof on every ad', 'Managed end-to-end without influencer drama', 'Predictable cost per targeted status view'].map((point) => (
                  <div key={point} style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '14px', color: 'var(--text-primary)' }}>
                    <span style={{ color: 'var(--brand-green)', fontWeight: '900' }}>✓</span> {point}
                  </div>
                ))}
              </div>
              <Link to="/register?role=vendor" className="btn btn-block" style={{ background: 'var(--brand-dark)', color: 'white' }}>
                Create Brand Campaign
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* HOW IT OPERATES (Brief Broker Model) */}
      <section style={{ padding: '70px 24px', background: '#FFFFFF' }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto', textAlign: 'center' }}>
          <h2 style={{ fontSize: '2rem', fontWeight: '900', color: 'var(--brand-dark)', marginBottom: '12px' }}>
            The Managed Brokerage Advantage
          </h2>
          <p style={{ color: 'var(--text-secondary)', maxWidth: '640px', margin: '0 auto 48px', fontSize: '15px' }}>
            You never have to manage influencers or negotiate rates. MEDIOVA acts as the central coordinator.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px', textAlign: 'left' }}>
            <div className="card" style={{ padding: '24px' }}>
              <div style={{ fontSize: '14px', fontWeight: '800', color: 'var(--brand-green)', marginBottom: '8px' }}>1. ORDER PLACEMENT</div>
              <h4 style={{ fontSize: '16px', fontWeight: '700', marginBottom: '8px' }}>Vendor Sets Goals</h4>
              <p style={{ fontSize: '13.5px', color: 'var(--text-secondary)', lineHeight: '1.6' }}>Advertisers select locations and reach targets. Payment is securely verified via bank transfer.</p>
            </div>
            <div className="card" style={{ padding: '24px' }}>
              <div style={{ fontSize: '14px', fontWeight: '800', color: 'var(--brand-yellow-dark)', marginBottom: '8px' }}>2. SMART MATCHING</div>
              <h4 style={{ fontSize: '16px', fontWeight: '700', marginBottom: '8px' }}>Admin Assigns Gigs</h4>
              <p style={{ fontSize: '13.5px', color: 'var(--text-secondary)', lineHeight: '1.6' }}>We match the campaign with verified local influencers in the desired sector and geographic region.</p>
            </div>
            <div className="card" style={{ padding: '24px' }}>
              <div style={{ fontSize: '14px', fontWeight: '800', color: 'var(--brand-green)', marginBottom: '8px' }}>3. VERIFICATION & PAYOUT</div>
              <h4 style={{ fontSize: '16px', fontWeight: '700', marginBottom: '8px' }}>Proof Review & Release</h4>
              <p style={{ fontSize: '13.5px', color: 'var(--text-secondary)', lineHeight: '1.6' }}>Influencers post, submit proof screenshots, admin approves views, and earnings are deposited.</p>
            </div>
          </div>
        </div>
      </section>

      {/* POPULAR CATEGORIES */}
      <section style={{ padding: '60px 24px', background: 'var(--surface2)' }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '28px', flexWrap: 'wrap', gap: '12px' }}>
            <div>
              <h3 style={{ fontSize: '1.6rem', fontWeight: '800', color: 'var(--brand-dark)' }}>Active Campaign Categories</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>High-converting sectors running daily gigs.</p>
            </div>
            <Link to="/register" style={{ color: 'var(--brand-green)', fontWeight: '700', fontSize: '14px' }}>View all markets &rarr;</Link>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(210px, 1fr))', gap: '14px' }}>
            {categories.map((cat) => (
              <div key={cat.name} className="card" style={{ padding: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontWeight: '600', fontSize: '14px', color: 'var(--text-primary)' }}>{cat.name}</span>
                <span style={{ fontSize: '11px', fontWeight: '700', color: 'var(--brand-green)', background: 'var(--brand-green-light)', padding: '2px 8px', borderRadius: '9999px' }}>
                  {cat.count}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQS */}
      <section style={{ padding: '70px 24px', background: '#FFFFFF' }}>
        <div style={{ maxWidth: '760px', margin: '0 auto' }}>
          <h2 style={{ fontSize: '2rem', fontWeight: '900', color: 'var(--brand-dark)', textAlign: 'center', marginBottom: '36px' }}>
            Frequently Asked Questions
          </h2>
          <div className="faq-list">
            {faqs.map((faq, i) => (
              <div key={i} className="faq-item">
                <div className="faq-question" onClick={() => setOpenFaq(openFaq === i ? null : i)}>
                  <span>{faq.q}</span>
                  <span style={{ fontSize: '12px', fontWeight: '700', color: 'var(--brand-green)' }}>
                    {openFaq === i ? 'CLOSE' : 'OPEN'}
                  </span>
                </div>
                {openFaq === i && (
                  <div className="faq-answer">{faq.a}</div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* BOTTOM ACTION BANNER */}
      <section style={{
        background: '#0B1320',
        color: 'white',
        padding: '60px 24px',
        textAlign: 'center',
        borderTop: '1px solid rgba(255,255,255,0.1)'
      }}>
        <div style={{ maxWidth: '640px', margin: '0 auto' }}>
          <h2 style={{ fontSize: '2.2rem', fontWeight: '900', color: '#FFFFFF', marginBottom: '14px' }}>
            Ready to Join Nigeria's Leading WhatsApp Ad Network?
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '15px', marginBottom: '32px' }}>
            Sign up in minutes. Accounts are verified within 24 hours.
          </p>
          <div style={{ display: 'flex', gap: '14px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/register?role=influencer" className="btn btn-lg" style={{ background: 'var(--brand-yellow)', color: '#0F172A', fontWeight: '800' }}>
              Register as Influencer
            </Link>
            <Link to="/register?role=vendor" className="btn btn-lg" style={{ background: 'transparent', border: '1px solid rgba(255,255,255,0.3)', color: 'white' }}>
              Register as Vendor
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

export { PublicNav, Footer };
