import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { PublicNav, Footer } from './LandingPage';

export default function FAQPage() {
  const [openItem, setOpenItem] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('all');

  const faqData = [
    {
      category: 'general',
      categoryName: '1. Platform Overview & Managed Brokerage',
      items: [
        {
          id: 'gen-1',
          question: 'What is MEDIOVA and how does the managed advertising brokerage model work?',
          answer: (
            <div>
              <p style={{ marginBottom: '12px' }}>
                MEDIOVA is Nigeria’s premier managed advertising marketplace connecting commercial brands with verified WhatsApp Status creators. We operate as an end-to-end managed brokerage:
              </p>
              <ul>
                <li><strong>Managed Intermediation:</strong> Advertisers contract directly with MEDIOVA for guaranteed audience reach, while WhatsApp creators contract directly with MEDIOVA to fulfill broadcast assignments.</li>
                <li><strong>Rigorous Audience Auditing:</strong> Every creator is required to submit unedited screen-recording video proofs demonstrating verified WhatsApp Status views before earning verification.</li>
                <li><strong>Escrow Financial Security:</strong> Campaign funds are held safely in platform escrow and disbursed to creators only after broadcast verification is audited and approved.</li>
                <li><strong>Creator Privacy Firewall:</strong> Personal contact numbers, bank details, and identities of influencers are strictly protected from third parties and advertisers.</li>
              </ul>
            </div>
          ),
        },
        {
          id: 'gen-2',
          question: 'Why is there no direct messaging between Advertisers and Creators?',
          answer: (
            <div>
              <p style={{ marginBottom: '12px' }}>
                MEDIOVA deliberately eliminates direct back-and-forth messaging between advertisers and influencers to safeguard both sides:
              </p>
              <ul>
                <li><strong>Eliminates Unreliable Creators &amp; Haggling:</strong> Advertisers avoid flaky creators, endless price negotiations, and missed deadlines.</li>
                <li><strong>Eliminates Fake Screenshots &amp; Inflated Metrics:</strong> All view metrics are verified through video screen-recording audits conducted by our administrative team.</li>
                <li><strong>Guarantees Creator Payment:</strong> Creators are protected from non-paying advertisers since all campaign funds are deposited in escrow before gig assignment.</li>
                <li><strong>Enforces SLA Compliance:</strong> Standardized 24-hour broadcast requirements and auditable proof timelines are neutrally enforced.</li>
              </ul>
            </div>
          ),
        },
      ],
    },
    {
      category: 'advertisers',
      categoryName: '2. Advertisers & Commercial Vendors',
      items: [
        {
          id: 'adv-1',
          question: 'How do Advertisers place and launch a campaign on MEDIOVA?',
          answer: (
            <div>
              <p style={{ marginBottom: '12px' }}>
                Launching a campaign on MEDIOVA is quick, streamlined, and structured:
              </p>
              <ul>
                <li><strong>Step 1 &ndash; Configure Audience Package:</strong> Select your target reach package, desired category vertical, and geographic location (State and LGA).</li>
                <li><strong>Step 2 &ndash; Submit Creative Assets:</strong> Upload your promotional copies, graphic flyers, images (multiple images supported), and target destination link or WhatsApp chat URL.</li>
                <li><strong>Step 3 &ndash; Fund Order Escrow:</strong> Transfer the campaign fee to MEDIOVA’s official escrow bank account and upload your electronic transaction receipt.</li>
                <li><strong>Step 4 &ndash; Verification &amp; Broadcast:</strong> Admin verifies your deposit within 2 to 4 business hours and matches your order with active, verified WhatsApp creators.</li>
              </ul>
            </div>
          ),
        },
        {
          id: 'adv-2',
          question: 'What types of advertisements are accepted or strictly prohibited?',
          answer: (
            <div>
              <p style={{ marginBottom: '12px' }}>
                To maintain a safe, reputable environment, all campaign materials must comply with Nigerian advertising codes and our content policy:
              </p>
              <ul>
                <li><strong>Permitted Commercial Categories:</strong> Fashion &amp; Apparel, Consumer Electronics, Professional Services, Real Estate, Education &amp; Training, Events &amp; Entertainment, Food &amp; Restaurants, and verified Software / Tech Products.</li>
                <li><strong>Prohibited Verticals:</strong> Unregistered financial investment schemes (Ponzi / pyramid schemes), unregulated lotteries or betting, counterfeit goods, adult or sexually suggestive materials, and unauthorized prescription medicines.</li>
                <li><strong>ARCON / APCON Compliance:</strong> Advertisers targeting Nigerian audiences warrant compliance with the Advertising Regulatory Council of Nigeria (ARCON) guidelines.</li>
              </ul>
            </div>
          ),
        },
        {
          id: 'adv-3',
          question: 'What happens if assigned creators fail to deliver the guaranteed reach?',
          answer: (
            <div>
              <p style={{ marginBottom: '12px' }}>
                We stand behind our verified delivery commitments with structured performance guarantees:
              </p>
              <ul>
                <li><strong>Automatic Inventory Reallocation:</strong> If a creator is unable to complete a broadcast within the required window, the gig is immediately reallocated to another vetted creator in the same tier.</li>
                <li><strong>Pro-Rata Platform Credit:</strong> If total delivered audience views fall below the guaranteed threshold, the difference is credited to your wallet balance.</li>
                <li><strong>Escrow Refund Entitlement:</strong> In cases of severe non-delivery where platform SLAs lapse, advertisers may request a full bank refund under our Refund Policy.</li>
              </ul>
            </div>
          ),
        },
      ],
    },
    {
      category: 'creators',
      categoryName: '3. WhatsApp Creators & Influencers',
      items: [
        {
          id: 'cre-1',
          question: 'How do WhatsApp creators join MEDIOVA and get verified?',
          answer: (
            <div>
              <p style={{ marginBottom: '12px' }}>
                Creators can monetize their active WhatsApp Status audiences by following our verification process:
              </p>
              <ul>
                <li><strong>Step 1 &ndash; Creator Registration:</strong> Create a Creator account, specify your content niche, location (State and LGA), and estimated daily status view range.</li>
                <li><strong>Step 2 &ndash; Verification Video Submission:</strong> Record an unedited screen-recording video starting from your WhatsApp Status tab, opening your status viewer analytics, and showing total real-time viewer count.</li>
                <li><strong>Step 3 &ndash; Admin Video Audit:</strong> Our compliance team audits the screen recording to verify organic views, absence of automation bots, and date/time authenticity.</li>
                <li><strong>Step 4 &ndash; Verification Badge &amp; Gig Allocation:</strong> Once approved, your profile receives the Verified badge and becomes eligible to receive paid campaign assignments.</li>
              </ul>
            </div>
          ),
        },
        {
          id: 'cre-2',
          question: 'What are the rules and obligations when broadcasting a paid gig?',
          answer: (
            <div>
              <p style={{ marginBottom: '12px' }}>
                Creators must observe high professional standards during all active assignments:
              </p>
              <ul>
                <li><strong>Continuous 24-Hour Broadcast:</strong> The sponsored flyer and copy must remain on your WhatsApp Status continuously for twenty-four (24) full hours without deletion or privacy restriction.</li>
                <li><strong>Unedited Screen-Recording Proof:</strong> Prior to the 24-hour expiration mark, you must upload an unedited video recording showing your status viewer count and live timestamp.</li>
                <li><strong>Strict Anti-Fraud Enforcement:</strong> Submission of cropped static screenshots, recycled videos, third-party proofs, or digitally altered metrics results in immediate account disqualification.</li>
                <li><strong>Availability Management:</strong> If you are traveling or unable to broadcast, simply toggle your account status to "Unavailable" in your dashboard.</li>
              </ul>
            </div>
          ),
        },
        {
          id: 'cre-3',
          question: 'Can I decline a gig assigned to my account?',
          answer: (
            <div>
              <p style={{ marginBottom: '12px' }}>
                Yes. Creators maintain control over the brands they represent:
              </p>
              <ul>
                <li><strong>Voluntary Declination:</strong> If an ad conflicts with your personal brand, values, or schedule, you may decline the assignment with a brief reason.</li>
                <li><strong>Timely Notice:</strong> Declining within 2 hours of assignment allows the brokerage team to swiftly reallocate the order without delaying the advertiser's campaign.</li>
                <li><strong>No Penalties:</strong> Occasional respectful declination does not harm your standing or verified tier.</li>
              </ul>
            </div>
          ),
        },
      ],
    },
    {
      category: 'payments',
      categoryName: '4. Payments, Escrow & Withdrawals',
      items: [
        {
          id: 'pay-1',
          question: 'When and how do creators receive their earned gig rewards?',
          answer: (
            <div>
              <p style={{ marginBottom: '12px' }}>
                We pride ourselves on prompt, reliable creator disbursements:
              </p>
              <ul>
                <li><strong>Proof Audit Review:</strong> Admin reviews the submitted screen-recording proof within 24 hours of gig completion.</li>
                <li><strong>Instant Balance Credit:</strong> Upon approval, the agreed campaign remuneration is immediately credited to your available account balance.</li>
                <li><strong>Bank Disbursement SLA:</strong> Payout requests are processed and sent directly to your verified Nigerian commercial bank account within 24 to 48 business hours.</li>
                <li><strong>Zero Withdrawal Fees:</strong> MEDIOVA absorbs standard interbank transfer charges so you receive 100% of your approved earnings.</li>
              </ul>
            </div>
          ),
        },
        {
          id: 'pay-2',
          question: 'How does MEDIOVA protect financial data and personal privacy?',
          answer: (
            <div>
              <p style={{ marginBottom: '12px' }}>
                Financial and personal data security is engineered into every layer of our platform:
              </p>
              <ul>
                <li><strong>NDPA 2023 Compliance:</strong> Operating strictly under the Nigeria Data Protection Act 2023, data is collected solely for lawful execution of advertising contracts.</li>
                <li><strong>Financial Data Masking:</strong> Bank account numbers and payment receipts are encrypted and accessible only to authorized finance administrators.</li>
                <li><strong>Creator Privacy Firewall:</strong> Advertisers never receive creators' phone numbers or banking credentials.</li>
                <li><strong>Secure Cloud Infrastructure:</strong> Transport Layer Security (TLS 1.3), bcrypt cryptographic password hashing, and role-based access control protect all system data.</li>
              </ul>
            </div>
          ),
        },
      ],
    },
    {
      category: 'disputes',
      categoryName: '5. Disputes, Refunds & Appeals',
      items: [
        {
          id: 'dis-1',
          question: 'How do I cancel a campaign or request a refund?',
          answer: (
            <div>
              <p style={{ marginBottom: '12px' }}>
                Cancellations and refunds are administered in accordance with our transparent Refund Policy:
              </p>
              <ul>
                <li><strong>100% Refund Prior to Assignment:</strong> If you cancel your order before creators are assigned and campaign assets are distributed, you qualify for a full 100% refund or platform credit.</li>
                <li><strong>SLA Expiration Refund:</strong> If an order cannot be completed due to creator unavailability or SLA expiration, full unutilized escrow balances are promptly returned.</li>
                <li><strong>How to Submit:</strong> Submit a refund request through the Support section of your dashboard or via the Contact &amp; Support form with your Order Reference.</li>
              </ul>
            </div>
          ),
        },
        {
          id: 'dis-2',
          question: 'How do I appeal a rejected proof or file an operational grievance?',
          answer: (
            <div>
              <p style={{ marginBottom: '12px' }}>
                If you believe a video proof was rejected in error, or if you experience any operational failure:
              </p>
              <ul>
                <li><strong>File a Grievance Ticket:</strong> Open a ticket on the Contact &amp; Support page or within your dashboard under "File Complaint / Appeal".</li>
                <li><strong>Attach Additional Proof:</strong> Provide your unedited screen recording, gig reference number, and timestamp details.</li>
                <li><strong>24–48 Hour Review:</strong> An independent dispute officer reviews the evidence neutrally.</li>
                <li><strong>Ombudsman Escalation:</strong> If unsatisfied with the initial decision, you have a 7-day window to escalate to the Senior Marketplace Ombudsman.</li>
              </ul>
            </div>
          ),
        },
      ],
    },
  ];

  const filteredCategories =
    selectedCategory === 'all'
      ? faqData
      : faqData.filter((c) => c.category === selectedCategory);

  const toggleItem = (id) => {
    setOpenItem((prev) => (prev === id ? null : id));
  };

  return (
    <div>
      <PublicNav />
      {/* Header Banner */}
      <div className="policy-banner">
        <div className="policy-banner-container">
          <span className="policy-banner-badge">
            Platform Governance &amp; Knowledge Base
          </span>
          <h1 className="policy-banner-title">
            Help &amp; Frequently Asked Questions
          </h1>
          <p className="policy-banner-subtitle">
            Everything you need to know about advertising campaigns, WhatsApp status verification, payments, and platform rules
          </p>
          <div className="policy-banner-meta">
            Updated for 2026 Operations &bull; Comprehensive User &amp; Partner Guide
          </div>
        </div>
      </div>

      {/* Governance Quick Links Bar */}
      <div className="governance-nav-bar">
        <div className="governance-nav-inner">
          <span style={{ fontSize: '12px', fontWeight: '700', color: '#64748b', textTransform: 'uppercase', marginRight: '6px', whiteSpace: 'nowrap' }}>
            Governance:
          </span>
          <Link to="/contact" className="btn btn-sm btn-ghost" style={{ fontSize: '12px', whiteSpace: 'nowrap', borderRadius: '20px' }}>
            Contact &amp; Support
          </Link>
          <Link to="/faq" className="btn btn-sm btn-primary" style={{ fontSize: '12px', whiteSpace: 'nowrap', borderRadius: '20px' }}>
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

      {/* Category Filter Pills */}
      <div style={{ background: '#ffffff', borderBottom: '1px solid #f1f5f9', padding: '16px 24px' }}>
        <div style={{ maxWidth: '900px', margin: '0 auto', display: 'flex', gap: '8px', overflowX: 'auto' }}>
          <button
            type="button"
            className={`btn btn-sm ${selectedCategory === 'all' ? 'btn-secondary' : 'btn-ghost'}`}
            onClick={() => setSelectedCategory('all')}
            style={{ borderRadius: '20px', fontSize: '13px' }}
          >
            All Questions
          </button>
          <button
            type="button"
            className={`btn btn-sm ${selectedCategory === 'general' ? 'btn-secondary' : 'btn-ghost'}`}
            onClick={() => setSelectedCategory('general')}
            style={{ borderRadius: '20px', fontSize: '13px' }}
          >
            Platform Overview
          </button>
          <button
            type="button"
            className={`btn btn-sm ${selectedCategory === 'advertisers' ? 'btn-secondary' : 'btn-ghost'}`}
            onClick={() => setSelectedCategory('advertisers')}
            style={{ borderRadius: '20px', fontSize: '13px' }}
          >
            Advertisers &amp; Vendors
          </button>
          <button
            type="button"
            className={`btn btn-sm ${selectedCategory === 'creators' ? 'btn-secondary' : 'btn-ghost'}`}
            onClick={() => setSelectedCategory('creators')}
            style={{ borderRadius: '20px', fontSize: '13px' }}
          >
            Creators &amp; Influencers
          </button>
          <button
            type="button"
            className={`btn btn-sm ${selectedCategory === 'payments' ? 'btn-secondary' : 'btn-ghost'}`}
            onClick={() => setSelectedCategory('payments')}
            style={{ borderRadius: '20px', fontSize: '13px' }}
          >
            Payments &amp; Security
          </button>
          <button
            type="button"
            className={`btn btn-sm ${selectedCategory === 'disputes' ? 'btn-secondary' : 'btn-ghost'}`}
            onClick={() => setSelectedCategory('disputes')}
            style={{ borderRadius: '20px', fontSize: '13px' }}
          >
            Disputes &amp; Refunds
          </button>
        </div>
      </div>

      {/* FAQ Content Body */}
      <div className="policy-content" style={{ maxWidth: '850px', margin: '40px auto 60px', padding: '0 24px', lineHeight: '1.85', color: '#334155' }}>
        
        <div style={{ background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: '8px', padding: '16px 20px', marginBottom: '36px', fontSize: '13px', lineHeight: '1.6' }}>
          <strong style={{ color: '#1e40af' }}>ℹ️ Need Immediate Assistance?</strong> If you have an active order or verified gig assignment requiring direct support, our Lagos brokerage team is available Monday &ndash; Saturday. You can generate a tracked support ticket anytime on our <Link to="/contact" style={{ color: '#059669', fontWeight: '700' }}>Contact &amp; Support Page</Link>.
        </div>

        {filteredCategories.map((catSection) => (
          <div key={catSection.category} style={{ marginBottom: '40px' }}>
            <h2 style={{ marginBottom: '16px', color: '#0f172a', fontSize: '1.4rem', borderBottom: '2px solid #e2e8f0', paddingBottom: '8px' }}>
              {catSection.categoryName}
            </h2>

            <div className="faq-list" style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {catSection.items.map((item) => {
                const isOpen = openItem === item.id;
                return (
                  <div
                    key={item.id}
                    style={{
                      border: '1px solid #e2e8f0',
                      borderRadius: '8px',
                      background: isOpen ? '#ffffff' : '#f8fafc',
                      overflow: 'hidden',
                      transition: 'all 0.2s ease',
                      boxShadow: isOpen ? '0 4px 6px -1px rgba(0, 0, 0, 0.05)' : 'none',
                    }}
                  >
                    <div
                      onClick={() => toggleItem(item.id)}
                      style={{
                        padding: '16px 20px',
                        cursor: 'pointer',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        gap: '12px',
                        fontWeight: '600',
                        color: '#0f172a',
                        fontSize: '15px',
                        background: isOpen ? '#f1f5f9' : 'transparent',
                        userSelect: 'none',
                      }}
                    >
                      <span>{item.question}</span>
                      <span style={{ color: '#059669', fontSize: '14px', flexShrink: 0 }}>
                        {isOpen ? '▲ Collapse' : '▼ Expand'}
                      </span>
                    </div>

                    {isOpen && (
                      <div
                        style={{
                          padding: '20px',
                          borderTop: '1px solid #e2e8f0',
                          background: '#ffffff',
                          fontSize: '14px',
                          lineHeight: '1.85',
                          color: '#334155',
                        }}
                      >
                        {item.answer}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ))}

        {/* Bottom Cross-Links */}
        <div style={{ borderTop: '1px solid #e2e8f0', paddingTop: '28px', display: 'flex', gap: '20px', flexWrap: 'wrap', marginTop: '40px' }}>
          <Link to="/contact" style={{ color: '#059669', fontWeight: '700' }}>
            Contact &amp; Support Desk →
          </Link>
          <Link to="/terms" style={{ color: '#059669', fontWeight: '700' }}>
            Terms &amp; Confidentiality →
          </Link>
          <Link to="/privacy" style={{ color: '#059669', fontWeight: '700' }}>
            Privacy Policy (NDPA 2023) →
          </Link>
          <Link to="/refund-policy" style={{ color: '#059669', fontWeight: '700' }}>
            Refund Policy →
          </Link>
          <Link to="/complaints-policy" style={{ color: '#059669', fontWeight: '700' }}>
            Complaints &amp; Appeals Policy →
          </Link>
        </div>
      </div>
      <Footer />
    </div>
  );
}
