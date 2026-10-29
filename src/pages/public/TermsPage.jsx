import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { PublicNav, Footer } from './LandingPage';

export default function TermsPage() {
  const scrollToSection = (id) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div style={{ background: '#f8fafc', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <PublicNav />

      {/* Header Banner */}
      <div className="policy-banner">
        <div className="policy-banner-container">
          <span className="policy-banner-badge">
            Official Platform Governance &amp; Agreement
          </span>
          <h1 className="policy-banner-title">
            MEDIOVA Terms and Conditions
          </h1>
          <p className="policy-banner-subtitle">
            Platform Terms, Vendor Agreement and Influencer Participation Agreement
          </p>
          <div className="policy-banner-meta">
            Effective Worldwide &bull; Governing All Registered Advertisers and Influencers
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
          <Link to="/faq" className="btn btn-sm btn-ghost" style={{ fontSize: '12px', whiteSpace: 'nowrap', borderRadius: '20px' }}>
            Help &amp; FAQs
          </Link>
          <Link to="/terms" className="btn btn-sm btn-primary" style={{ fontSize: '12px', whiteSpace: 'nowrap', borderRadius: '20px' }}>
            Terms and Conditions
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

      {/* Quick Jump Navigator */}
      <div style={{ maxWidth: '1000px', width: '100%', margin: '20px auto 0', padding: '0 16px', boxSizing: 'border-box' }}>
        <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '14px 18px', display: 'flex', gap: '10px', alignItems: 'center', overflowX: 'auto', WebkitOverflowScrolling: 'touch' }}>
          <span style={{ fontSize: '12px', fontWeight: '700', color: '#0f172a', whiteSpace: 'nowrap' }}>Quick Jump:</span>
          {[
            { id: 'sec-intro', label: '1. Introduction' },
            { id: 'sec-defs', label: '2. Definitions' },
            { id: 'sec-vendor', label: 'Part A: Vendors' },
            { id: 'sec-influencer', label: 'Part B: Influencers' },
            { id: 'sec-general', label: 'Part C: Platform Conditions' },
            { id: 'sec-sched-a', label: 'Schedule A (Vendor)' },
            { id: 'sec-sched-b', label: 'Schedule B (Influencer)' },
            { id: 'sec-contact', label: '30. Contact Details' },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => scrollToSection(item.id)}
              className="btn btn-sm btn-ghost"
              style={{ fontSize: '12px', whiteSpace: 'nowrap', borderRadius: '16px', padding: '4px 12px' }}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main Legal Content Container */}
      <main className="policy-content" style={{ maxWidth: '1000px', width: '100%', margin: '24px auto 60px', padding: '0 16px', boxSizing: 'border-box' }}>
        <div style={{ background: '#ffffff', borderRadius: '16px', border: '1px solid #e2e8f0', padding: 'clamp(20px, 4vw, 40px)', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
          
          {/* Important Notice Callout */}
          <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '12px', padding: '16px 20px', marginBottom: '32px' }}>
            <h4 style={{ margin: '0 0 6px', color: '#166534', fontSize: '15px', fontWeight: '700' }}>
              Notice of Contractual Terms
            </h4>
            <p style={{ margin: 0, fontSize: '13.5px', color: '#15803d', lineHeight: '1.6' }}>
              These Terms and Conditions govern access to and use of MEDIOVA. By registering an account, creating or participating in an advertising campaign, making a payment, receiving compensation, or ticking the acceptance checkbox, you confirm that you have read, understood, and agreed to be bound by these provisions.
            </p>
          </div>

          {/* Section 1 */}
          <section id="sec-intro" style={{ marginBottom: '36px' }}>
            <h2 style={{ fontSize: '1.4rem', color: '#0f172a', fontWeight: '800', borderBottom: '2px solid #e2e8f0', paddingBottom: '8px', marginBottom: '14px' }}>
              1. Introduction and Acceptance of Terms
            </h2>
            <h3 style={{ fontSize: '1.1rem', color: '#1e293b', fontWeight: '700', marginTop: '16px' }}>1.1 Introduction</h3>
            <p style={{ fontSize: '14px', lineHeight: '1.7', color: '#334155' }}>
              Welcome to MEDIOVA, a digital advertising and influencer gig marketplace designed to connect businesses, brands, and individuals seeking advertising services ("Vendors" or "Advertisers") with registered individuals who participate in promotional campaigns ("Influencers" or "Promoters").
            </p>
            <p style={{ fontSize: '14px', lineHeight: '1.7', color: '#334155' }}>
              MEDIOVA provides a digital environment through which Vendors may create and manage advertising opportunities, while Influencers may discover, accept, and complete eligible promotional activities in exchange for agreed compensation.
            </p>
            <p style={{ fontSize: '14px', lineHeight: '1.7', color: '#334155' }}>
              These Terms and Conditions ("Terms" or "Agreement") govern access to and use of the MEDIOVA website, associated applications, digital services, advertising campaigns, and related functionalities.
            </p>

            <h3 style={{ fontSize: '1.1rem', color: '#1e293b', fontWeight: '700', marginTop: '20px' }}>1.2 Acceptance of Agreement</h3>
            <p style={{ fontSize: '14px', lineHeight: '1.7', color: '#334155' }}>
              By registering an account, accessing the platform, creating or participating in a campaign, making a payment, receiving compensation, or otherwise using MEDIOVA, you acknowledge that:
            </p>
            <ul style={{ fontSize: '14px', lineHeight: '1.7', color: '#334155', paddingLeft: '24px' }}>
              <li>You have read and understood these Terms.</li>
              <li>You agree to comply with these Terms and all applicable platform policies.</li>
              <li>You are legally capable of entering into a binding agreement.</li>
              <li>The information you provide to MEDIOVA is accurate and complete.</li>
              <li>You will comply with all applicable laws, advertising regulations, and relevant third-party platform rules.</li>
              <li>Where you use MEDIOVA on behalf of a business or organization, you confirm that you are authorized to accept these Terms on that organization's behalf.</li>
            </ul>
            <p style={{ fontSize: '14px', lineHeight: '1.7', color: '#dc2626', fontWeight: '600' }}>
              If you do not agree with these Terms, you must not register for or use the platform.
            </p>

            <h3 style={{ fontSize: '1.1rem', color: '#1e293b', fontWeight: '700', marginTop: '20px' }}>1.3 Agreement Structure</h3>
            <p style={{ fontSize: '14px', lineHeight: '1.7', color: '#334155' }}>
              These Terms include provisions applying to all users and additional obligations specific to Vendors and Influencers. They must be read alongside MEDIOVA's:
            </p>
            <ul style={{ fontSize: '14px', lineHeight: '1.7', color: '#334155', paddingLeft: '24px' }}>
              <li><Link to="/privacy" style={{ color: '#059669', fontWeight: '600' }}>Privacy Policy</Link>;</li>
              <li>Cookie Policy, where applicable;</li>
              <li>Campaign Guidelines;</li>
              <li><Link to="/refund-policy" style={{ color: '#059669', fontWeight: '600' }}>Payment, Withdrawal, Cancellation and Refund Policy</Link>;</li>
              <li><Link to="/complaints-policy" style={{ color: '#059669', fontWeight: '600' }}>Complaints and Appeals Policy</Link>; and</li>
              <li>Any specific campaign conditions disclosed before acceptance.</li>
            </ul>
            <p style={{ fontSize: '14px', lineHeight: '1.7', color: '#334155' }}>
              Where campaign-specific terms conflict with these Terms, the provisions of these Terms prevail unless the campaign-specific variation is expressly permitted, clearly disclosed, and lawfully agreed. MEDIOVA shall not apply undisclosed campaign conditions retroactively.
            </p>
          </section>

          {/* Section 2 */}
          <section id="sec-defs" style={{ marginBottom: '36px' }}>
            <h2 style={{ fontSize: '1.4rem', color: '#0f172a', fontWeight: '800', borderBottom: '2px solid #e2e8f0', paddingBottom: '8px', marginBottom: '14px' }}>
              2. Definitions
            </h2>
            <p style={{ fontSize: '14px', lineHeight: '1.7', color: '#334155' }}>
              For the purpose of this Agreement:
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '14px', lineHeight: '1.6', color: '#334155' }}>
              <div><strong>MEDIOVA:</strong> The advertising marketplace and related services operated by the platform entity.</div>
              <div><strong>Vendor / Advertiser:</strong> A registered business, organization, or individual that creates, funds, or commissions advertising campaigns through MEDIOVA.</div>
              <div><strong>Influencer / Promoter:</strong> A registered individual who voluntarily accepts and performs advertising tasks through MEDIOVA.</div>
              <div><strong>Campaign:</strong> A promotional opportunity submitted by a Vendor, specifying advertising materials, required activities, duration, eligibility conditions, and compensation.</div>
              <div><strong>Advertising Content:</strong> Any promotional text, image, video, link, audio, brand material, or other communication intended for publication by an Influencer.</div>
              <div><strong>Campaign Brief:</strong> The instructions and requirements communicated to an Influencer before accepting a campaign.</div>
              <div><strong>Campaign Budget:</strong> The amount committed by a Vendor to fund a campaign, including applicable promoter compensation and disclosed platform charges.</div>
              <div><strong>Campaign Reward:</strong> The amount payable to an Influencer upon satisfactory completion and verification of the applicable task.</div>
              <div><strong>Proof of Performance:</strong> Evidence submitted to demonstrate that an advertising task was performed in accordance with the agreed campaign requirements.</div>
              <div><strong>Verification:</strong> The process of reviewing evidence and determining whether a campaign task meets the applicable completion criteria.</div>
              <div><strong>Wallet:</strong> Any platform-supported digital balance feature through which eligible balances, payments, credits, or transactions are displayed.</div>
              <div><strong>Payment Service Provider:</strong> An authorized third-party provider that processes, holds, settles, or disburses payments.</div>
              <div><strong>Prohibited Content:</strong> Advertising or other material that violates applicable laws, advertising regulations, platform policies, or these Terms.</div>
              <div><strong>Account Suspension:</strong> Temporary restriction of some or all access to MEDIOVA.</div>
              <div><strong>Account Termination:</strong> Closure or permanent deactivation of a user's access to MEDIOVA, subject to applicable law and unresolved financial obligations.</div>
            </div>
          </section>

          {/* Section 3 */}
          <section style={{ marginBottom: '36px' }}>
            <h2 style={{ fontSize: '1.4rem', color: '#0f172a', fontWeight: '800', borderBottom: '2px solid #e2e8f0', paddingBottom: '8px', marginBottom: '14px' }}>
              3. Eligibility and Account Registration
            </h2>
            <h3 style={{ fontSize: '1.1rem', color: '#1e293b', fontWeight: '700', marginTop: '16px' }}>3.1 Minimum Eligibility Requirements</h3>
            <p style={{ fontSize: '14px', lineHeight: '1.7', color: '#334155' }}>
              To register or participate on MEDIOVA, users must be at least 18 years old, possess the legal capacity to enter into a contract, provide accurate registration information, maintain an accessible communication channel, comply with applicable verification requirements, and not be prohibited by applicable law from accessing the platform. Business users must be legally authorized to represent the business under which they register.
            </p>
            <h3 style={{ fontSize: '1.1rem', color: '#1e293b', fontWeight: '700', marginTop: '16px' }}>3.2 Account Information</h3>
            <p style={{ fontSize: '14px', lineHeight: '1.7', color: '#334155' }}>
              MEDIOVA may require information appropriate to the user's role (full name, business name, email, phone, location, payout details, or business verification documents). Users must promptly update information that becomes inaccurate.
            </p>
            <h3 style={{ fontSize: '1.1rem', color: '#1e293b', fontWeight: '700', marginTop: '16px' }}>3.3 Account Security</h3>
            <p style={{ fontSize: '14px', lineHeight: '1.7', color: '#334155' }}>
              Users are responsible for maintaining password confidentiality and for activities carried out through their accounts. Users must report suspected unauthorized account access promptly.
            </p>
            <h3 style={{ fontSize: '1.1rem', color: '#1e293b', fontWeight: '700', marginTop: '16px' }}>3.4 Multiple or Fraudulent Accounts</h3>
            <p style={{ fontSize: '14px', lineHeight: '1.7', color: '#334155' }}>
              Users must not create multiple accounts to manipulate promotional opportunities, obtain duplicate campaign rewards, circumvent restrictions, or interfere with platform operations.
            </p>
          </section>

          {/* Section 4 */}
          <section style={{ marginBottom: '36px' }}>
            <h2 style={{ fontSize: '1.4rem', color: '#0f172a', fontWeight: '800', borderBottom: '2px solid #e2e8f0', paddingBottom: '8px', marginBottom: '14px' }}>
              4. Nature and Scope of MEDIOVA's Services
            </h2>
            <h3 style={{ fontSize: '1.1rem', color: '#1e293b', fontWeight: '700', marginTop: '16px' }}>4.1 Marketplace Services</h3>
            <p style={{ fontSize: '14px', lineHeight: '1.7', color: '#334155' }}>
              MEDIOVA provides services that enable Vendors to create and fund advertising campaigns, Influencers to discover and accept promotional tasks, campaign instructions and submissions to be reviewed, performance to be verified, and eligible compensation to be disbursed.
            </p>
            <h3 style={{ fontSize: '1.1rem', color: '#1e293b', fontWeight: '700', marginTop: '16px' }}>4.2 MEDIOVA's Role</h3>
            <p style={{ fontSize: '14px', lineHeight: '1.7', color: '#334155' }}>
              Unless MEDIOVA expressly agrees otherwise in writing, it acts as a marketplace facilitator and brokerage service provider rather than the seller, manufacturer, or supplier of the goods and services advertised by Vendors. Vendors remain responsible for their products, services, claims, and obligations to customers. Influencers remain responsible for performing accepted tasks.
            </p>
            <h3 style={{ fontSize: '1.1rem', color: '#1e293b', fontWeight: '700', marginTop: '16px' }}>4.3 No Guaranteed Commercial Results</h3>
            <p style={{ fontSize: '14px', lineHeight: '1.7', color: '#334155' }}>
              Unless expressly agreed in a specific campaign contract, MEDIOVA does not guarantee sales volume, customer conversions, product purchases, or business profitability. Campaign fees are payable for the agreed advertising broadcast services, not for subsequent sales conversions.
            </p>
          </section>

          {/* PART A: VENDORS */}
          <div id="sec-vendor" style={{ background: '#f0fdf4', border: '1px solid #86efac', borderRadius: '12px', padding: '16px 20px', margin: '40px 0 24px' }}>
            <span style={{ fontSize: '12px', fontWeight: '800', textTransform: 'uppercase', color: '#15803d', letterSpacing: '0.05em' }}>Part A</span>
            <h2 style={{ margin: '4px 0 0', fontSize: '1.35rem', color: '#14532d', fontWeight: '800' }}>
              Terms and Conditions for Vendors / Advertisers
            </h2>
          </div>

          {/* Section 5 */}
          <section style={{ marginBottom: '36px' }}>
            <h3 style={{ fontSize: '1.2rem', color: '#0f172a', fontWeight: '800', marginBottom: '12px' }}>
              5. Vendor Registration and Responsibilities
            </h3>
            <p style={{ fontSize: '14px', lineHeight: '1.7', color: '#334155' }}>
              A Vendor must be legally authorized to advertise the products, services, or business represented through MEDIOVA. Vendors agree to provide truthful business information, advertise only lawful products, supply authentic licensed advertising materials, fund campaigns according to disclosed payment terms, and respect consumer protection, advertising, and data protection laws. Vendors remain solely responsible for the legality, quality, safety, and delivery of their products.
            </p>
          </section>

          {/* Section 6 */}
          <section style={{ marginBottom: '36px' }}>
            <h3 style={{ fontSize: '1.2rem', color: '#0f172a', fontWeight: '800', marginBottom: '12px' }}>
              6. Campaign Creation and Submission
            </h3>
            <p style={{ fontSize: '14px', lineHeight: '1.7', color: '#334155' }}>
              Vendors must provide accurate, complete, and achievable campaign briefs specifying business name, promotional objective, approved creative materials, publication channel, required broadcast duration (e.g. 24 Hours for WhatsApp Status), target reach/views, compensation per task, and deadlines. Vendors shall not conceal material conditions or materially alter accepted campaigns without agreement.
            </p>
          </section>

          {/* Section 7 */}
          <section style={{ marginBottom: '36px' }}>
            <h3 style={{ fontSize: '1.2rem', color: '#0f172a', fontWeight: '800', marginBottom: '12px' }}>
              7. Advertising Content and Regulatory Compliance
            </h3>
            <p style={{ fontSize: '14px', lineHeight: '1.7', color: '#334155' }}>
              Advertisements must be truthful, substantiated, and not misleading. Advertisements must not contain false financial return promises, fabricated reviews, or unverified medical/health claims. Vendors must obtain required permits and approvals, including compliance with the Advertising Regulatory Council of Nigeria (ARCON) and the Nigerian Code of Advertising Practice where applicable.
            </p>
            <p style={{ fontSize: '14px', lineHeight: '1.7', color: '#334155' }}>
              Prohibited campaigns include Ponzi/pyramid schemes, unlicensed investment schemes, counterfeit goods, illegal gambling, controlled substances, and sexually exploitative materials.
            </p>
          </section>

          {/* Section 8 */}
          <section style={{ marginBottom: '36px' }}>
            <h3 style={{ fontSize: '1.2rem', color: '#0f172a', fontWeight: '800', marginBottom: '12px' }}>
              8. Campaign Funding, Fees and Payment
            </h3>
            <p style={{ fontSize: '14px', lineHeight: '1.7', color: '#334155' }}>
              Vendors agree to pay the disclosed campaign fees (comprising Influencer compensation, platform service charges, and any payment-processing fees). A campaign becomes eligible for activation once payment has been confirmed. Amounts allocated to verified Influencer rewards are accounted for separately.
            </p>
          </section>

          {/* Section 9 */}
          <section style={{ marginBottom: '36px' }}>
            <h3 style={{ fontSize: '1.2rem', color: '#0f172a', fontWeight: '800', marginBottom: '12px' }}>
              9. Campaign Cancellation and Refunds
            </h3>
            <p style={{ fontSize: '14px', lineHeight: '1.7', color: '#334155' }}>
              A Vendor may cancel prior to activation for a full refund of unused funds, subject only to disclosed non-recoverable payment charges. Once active, Influencers remain entitled to compensation for valid completed work, and remaining unused funds are assessed in accordance with the Refund Policy.
            </p>
          </section>

          {/* PART B: INFLUENCERS */}
          <div id="sec-influencer" style={{ background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: '12px', padding: '16px 20px', margin: '40px 0 24px' }}>
            <span style={{ fontSize: '12px', fontWeight: '800', textTransform: 'uppercase', color: '#1d4ed8', letterSpacing: '0.05em' }}>Part B</span>
            <h2 style={{ margin: '4px 0 0', fontSize: '1.35rem', color: '#1e3a8a', fontWeight: '800' }}>
              Terms and Conditions for Influencers / Promoters
            </h2>
          </div>

          {/* Section 10 */}
          <section style={{ marginBottom: '36px' }}>
            <h3 style={{ fontSize: '1.2rem', color: '#0f172a', fontWeight: '800', marginBottom: '12px' }}>
              10. Influencer Registration and Eligibility
            </h3>
            <p style={{ fontSize: '14px', lineHeight: '1.7', color: '#334155' }}>
              Influencers must have lawful control over the WhatsApp account used for advertising tasks. Influencers must complete identity verification and submit authentic audience and status view metrics. Influencers must not misrepresent their reach or audience.
            </p>
          </section>

          {/* Section 11 */}
          <section style={{ marginBottom: '36px' }}>
            <h3 style={{ fontSize: '1.2rem', color: '#0f172a', fontWeight: '800', marginBottom: '12px' }}>
              11. Campaign Acceptance and Performance
            </h3>
            <p style={{ fontSize: '14px', lineHeight: '1.7', color: '#334155' }}>
              Participation is voluntary. Accepting a campaign brief creates a binding obligation to perform the task according to instructions. Influencers must publish approved materials for the full required duration (e.g., 24 hours on WhatsApp Status) and clearly disclose paid sponsorship. Influencers shall never be required to make false claims or fabricate personal testimonials.
            </p>
          </section>

          {/* Section 12 */}
          <section style={{ marginBottom: '36px' }}>
            <h3 style={{ fontSize: '1.2rem', color: '#0f172a', fontWeight: '800', marginBottom: '12px' }}>
              12. Proof of Performance and Campaign Verification
            </h3>
            <p style={{ fontSize: '14px', lineHeight: '1.7', color: '#334155' }}>
              To receive payout, Influencers must submit genuine, unmanipulated evidence (screen recordings, view counts, timestamps). Submitting fabricated screenshots, bot views, or recycled evidence is strictly prohibited. Submissions will be reviewed against objective criteria. Arbitrary rejection of validly completed work is prohibited.
            </p>
          </section>

          {/* Section 13 */}
          <section style={{ marginBottom: '36px' }}>
            <h3 style={{ fontSize: '1.2rem', color: '#0f172a', fontWeight: '800', marginBottom: '12px' }}>
              13. Influencer Compensation and Withdrawals
            </h3>
            <p style={{ fontSize: '14px', lineHeight: '1.7', color: '#334155' }}>
              Rewards are credited upon verification approval. Earnings transition through: Pending (under review) &rarr; Approved (earned) &rarr; Available (eligible for withdrawal). Withdrawals are processed to verified bank accounts. Undisclosed deductions and arbitrary penalties are prohibited.
            </p>
          </section>

          {/* Section 14 */}
          <section style={{ marginBottom: '36px' }}>
            <h3 style={{ fontSize: '1.2rem', color: '#0f172a', fontWeight: '800', marginBottom: '12px' }}>
              14. Influencer Conduct and Professional Standards
            </h3>
            <p style={{ fontSize: '14px', lineHeight: '1.7', color: '#334155' }}>
              Influencers must not harass other users, manipulate rewards, engage in unauthorized off-platform payment schemes, or compromise platform integrity.
            </p>
          </section>

          {/* Section 15 */}
          <section style={{ marginBottom: '36px' }}>
            <h3 style={{ fontSize: '1.2rem', color: '#0f172a', fontWeight: '800', marginBottom: '12px' }}>
              15. Independent Contractor Relationship
            </h3>
            <p style={{ fontSize: '14px', lineHeight: '1.7', color: '#334155' }}>
              Influencers participate as independent service providers and are not employees, agents, or partners of MEDIOVA or the advertising Vendor.
            </p>
          </section>

          {/* PART C: GENERAL PLATFORM CONDITIONS */}
          <div id="sec-general" style={{ background: '#f8fafc', border: '1px solid #cbd5e1', borderRadius: '12px', padding: '16px 20px', margin: '40px 0 24px' }}>
            <span style={{ fontSize: '12px', fontWeight: '800', textTransform: 'uppercase', color: '#475569', letterSpacing: '0.05em' }}>Part C</span>
            <h2 style={{ margin: '4px 0 0', fontSize: '1.35rem', color: '#0f172a', fontWeight: '800' }}>
              General Platform Conditions
            </h2>
          </div>

          {/* Sections 16-29 Summary Blocks */}
          <section style={{ marginBottom: '28px' }}>
            <h3 style={{ fontSize: '1.15rem', color: '#0f172a', fontWeight: '700' }}>16. Fair Dealing &amp; Non-Circumvention</h3>
            <p style={{ fontSize: '14px', lineHeight: '1.7', color: '#334155' }}>
              Users must act honestly and respectfully. Users must not deliberately bypass MEDIOVA to avoid disclosed platform brokerage fees relating to an active campaign.
            </p>
          </section>

          <section style={{ marginBottom: '28px' }}>
            <h3 style={{ fontSize: '1.15rem', color: '#0f172a', fontWeight: '700' }}>17. Fraud Prevention and Platform Integrity</h3>
            <p style={{ fontSize: '14px', lineHeight: '1.7', color: '#334155' }}>
              MEDIOVA maintains zero tolerance for impersonation, fake evidence, payment fraud, bot metrics, or organized manipulation. Suspected violations will be investigated and may result in account termination and legal recovery.
            </p>
          </section>

          <section style={{ marginBottom: '28px' }}>
            <h3 style={{ fontSize: '1.15rem', color: '#0f172a', fontWeight: '700' }}>18. Privacy and Data Protection</h3>
            <p style={{ fontSize: '14px', lineHeight: '1.7', color: '#334155' }}>
              Personal data is processed in accordance with the Nigeria Data Protection Act (NDPA) 2023 and our separate <Link to="/privacy" style={{ color: '#059669', fontWeight: '600' }}>Privacy Policy</Link>. MEDIOVA shall never sell users' private contact lists or personal WhatsApp conversations to advertisers.
            </p>
          </section>

          <section style={{ marginBottom: '28px' }}>
            <h3 style={{ fontSize: '1.15rem', color: '#0f172a', fontWeight: '700' }}>19. Intellectual Property Rights</h3>
            <p style={{ fontSize: '14px', lineHeight: '1.7', color: '#334155' }}>
              MEDIOVA retains rights to its platform software and trademarks. Vendors retain ownership of their campaign materials, granting Influencers and MEDIOVA a limited license solely to perform the campaign.
            </p>
          </section>

          <section style={{ marginBottom: '28px' }}>
            <h3 style={{ fontSize: '1.15rem', color: '#0f172a', fontWeight: '700' }}>20. Third-Party Platforms (WhatsApp)</h3>
            <p style={{ fontSize: '14px', lineHeight: '1.7', color: '#334155' }}>
              MEDIOVA is an independent platform and is not affiliated with, endorsed by, or sponsored by WhatsApp or Meta. Users must comply with WhatsApp Terms of Service.
            </p>
          </section>

          <section style={{ marginBottom: '28px' }}>
            <h3 style={{ fontSize: '1.15rem', color: '#0f172a', fontWeight: '700' }}>21. Platform Availability &amp; Modifications</h3>
            <p style={{ fontSize: '14px', lineHeight: '1.7', color: '#334155' }}>
              MEDIOVA uses reasonable efforts to maintain platform security and uptime, but uninterrupted availability is not guaranteed.
            </p>
          </section>

          <section style={{ marginBottom: '28px' }}>
            <h3 style={{ fontSize: '1.15rem', color: '#0f172a', fontWeight: '700' }}>22. Account Suspension and Termination</h3>
            <p style={{ fontSize: '14px', lineHeight: '1.7', color: '#334155' }}>
              Accounts may be restricted for fraud, serious breach, or regulatory non-compliance. Termination does not extinguish earned, lawful financial obligations.
            </p>
          </section>

          <section style={{ marginBottom: '28px' }}>
            <h3 style={{ fontSize: '1.15rem', color: '#0f172a', fontWeight: '700' }}>23. Complaints and Dispute Resolution</h3>
            <p style={{ fontSize: '14px', lineHeight: '1.7', color: '#334155' }}>
              Complaints may be submitted via our <Link to="/contact" style={{ color: '#059669', fontWeight: '600' }}>Support &amp; Complaints Desk</Link>. Operational target timelines (acknowledgement within 2 business days, initial assessment within 5 business days, target resolution within 10-20 business days) are proposed operational targets and subject to case complexity.
            </p>
          </section>

          <section style={{ marginBottom: '28px' }}>
            <h3 style={{ fontSize: '1.15rem', color: '#0f172a', fontWeight: '700' }}>24. Limitation of Liability</h3>
            <p style={{ fontSize: '14px', lineHeight: '1.7', color: '#334155' }}>
              Each party is responsible for its own actionable breaches. MEDIOVA facilitates advertising transactions and is not liable for indirect commercial losses or sales conversion deficiencies beyond its reasonable control.
            </p>
          </section>

          <section style={{ marginBottom: '28px' }}>
            <h3 style={{ fontSize: '1.15rem', color: '#0f172a', fontWeight: '700' }}>25. Indemnification</h3>
            <p style={{ fontSize: '14px', lineHeight: '1.7', color: '#334155' }}>
              Users are proportionately responsible for third-party claims arising directly from their own unlawful conduct, fraudulent acts, or material breach of these Terms.
            </p>
          </section>

          <section style={{ marginBottom: '28px' }}>
            <h3 style={{ fontSize: '1.15rem', color: '#0f172a', fontWeight: '700' }}>26. Confidentiality</h3>
            <p style={{ fontSize: '14px', lineHeight: '1.7', color: '#334155' }}>
              Users must protect non-public commercial and campaign information legitimately acquired through MEDIOVA.
            </p>
          </section>

          <section style={{ marginBottom: '28px' }}>
            <h3 style={{ fontSize: '1.15rem', color: '#0f172a', fontWeight: '700' }}>27. Updates to These Terms</h3>
            <p style={{ fontSize: '14px', lineHeight: '1.7', color: '#334155' }}>
              MEDIOVA may update these Terms to reflect legal, regulatory, or operational improvements. Notice will be given for material changes, and renewed affirmative acceptance will be requested where required by law.
            </p>
          </section>

          <section style={{ marginBottom: '28px' }}>
            <h3 style={{ fontSize: '1.15rem', color: '#0f172a', fontWeight: '700' }}>28. Governing Law and Jurisdiction</h3>
            <p style={{ fontSize: '14px', lineHeight: '1.7', color: '#334155' }}>
              These Terms are governed by the laws of the Federal Republic of Nigeria. Disputes not resolved through internal mediation may be brought before competent courts in Nigeria.
            </p>
          </section>

          <section style={{ marginBottom: '36px' }}>
            <h3 style={{ fontSize: '1.15rem', color: '#0f172a', fontWeight: '700' }}>29. General Legal Provisions</h3>
            <p style={{ fontSize: '14px', lineHeight: '1.7', color: '#334155' }}>
              Includes severability of invalid terms, no waiver by delayed enforcement, non-assignability without consent, and entire agreement integration.
            </p>
          </section>

          {/* Section 30: Contact Information with Configurable Details Note */}
          <section id="sec-contact" style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '20px', marginBottom: '40px' }}>
            <h3 style={{ fontSize: '1.2rem', color: '#0f172a', fontWeight: '800', marginTop: 0 }}>
              30. Contact Information &amp; Official Communications
            </h3>
            <p style={{ fontSize: '13.5px', color: '#64748b', marginBottom: '14px' }}>
              Questions, complaints, notices, or inquiries concerning these Terms should be directed to the official platform desk:
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 260px), 1fr))', gap: '14px', fontSize: '13.5px' }}>
              <div>
                <strong style={{ color: '#0f172a', display: 'block' }}>Legal Business Entity:</strong>
                <span style={{ color: '#334155' }}>MEDIOVA Global / MEDIOVA Media Brokerage Ltd</span>
              </div>
              <div>
                <strong style={{ color: '#0f172a', display: 'block' }}>Registered Business Address:</strong>
                <span style={{ color: '#334155' }}>Lagos State, Federal Republic of Nigeria</span>
              </div>
              <div>
                <strong style={{ color: '#0f172a', display: 'block' }}>General Customer Support:</strong>
                <a href="mailto:support@mediova.ng" style={{ color: '#059669', fontWeight: '600' }}>support@mediova.ng</a>
              </div>
              <div>
                <strong style={{ color: '#0f172a', display: 'block' }}>Payment &amp; Dispute Support:</strong>
                <a href="mailto:disputes@mediova.ng" style={{ color: '#059669', fontWeight: '600' }}>disputes@mediova.ng</a>
              </div>
              <div>
                <strong style={{ color: '#0f172a', display: 'block' }}>Privacy &amp; Data Protection:</strong>
                <a href="mailto:privacy@mediova.ng" style={{ color: '#059669', fontWeight: '600' }}>privacy@mediova.ng</a>
              </div>
              <div>
                <strong style={{ color: '#0f172a', display: 'block' }}>Live Web Platform:</strong>
                <a href="https://mediova.vercel.app/" target="_blank" rel="noreferrer" style={{ color: '#059669', fontWeight: '600' }}>https://mediova.vercel.app/</a>
              </div>
            </div>
            <div style={{ marginTop: '14px', paddingTop: '12px', borderTop: '1px solid #e2e8f0', fontSize: '12px', color: '#94a3b8' }}>
              Note: Contact channels and operational target timelines are subject to administrative update by MEDIOVA platform governance.
            </div>
          </section>

          {/* SCHEDULE A */}
          <section id="sec-sched-a" style={{ background: '#f0fdf4', border: '1px solid #86efac', borderRadius: '12px', padding: '24px', marginBottom: '32px' }}>
            <span style={{ fontSize: '11px', fontWeight: '800', color: '#15803d', textTransform: 'uppercase', letterSpacing: '0.05em' }}>SCHEDULE A</span>
            <h3 style={{ margin: '4px 0 12px', fontSize: '1.25rem', color: '#14532d', fontWeight: '800' }}>
              Vendor Declaration and Agreement
            </h3>
            <p style={{ fontSize: '13.5px', color: '#166534', lineHeight: '1.6', marginBottom: '14px' }}>
              Before launching an advertising campaign, each Vendor must confirm and acknowledge:
            </p>
            <ul style={{ fontSize: '13.5px', color: '#166534', lineHeight: '1.7', paddingLeft: '20px', margin: 0 }}>
              <li>I confirm that I am legally authorized to advertise the products or services submitted through MEDIOVA.</li>
              <li>I confirm that the advertising materials and claims are truthful, lawful, and appropriately substantiated.</li>
              <li>I accept responsibility for obtaining applicable regulatory advertising approvals and permissions.</li>
              <li>I understand the disclosed campaign fees, Influencer compensation, and payment conditions.</li>
              <li>I agree not to manipulate campaign results or unreasonably reject valid completed work.</li>
              <li>I understand the applicable cancellation and refund conditions.</li>
              <li>I agree to respect Influencers and comply with platform policies.</li>
              <li>I understand that MEDIOVA does not guarantee sales or conversions unless specifically agreed in writing.</li>
              <li>I acknowledge the applicable data protection and confidentiality obligations.</li>
              <li>I have read and agree to the MEDIOVA Terms and Conditions.</li>
            </ul>
          </section>

          {/* SCHEDULE B */}
          <section id="sec-sched-b" style={{ background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: '12px', padding: '24px', marginBottom: '32px' }}>
            <span style={{ fontSize: '11px', fontWeight: '800', color: '#1d4ed8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>SCHEDULE B</span>
            <h3 style={{ margin: '4px 0 12px', fontSize: '1.25rem', color: '#1e3a8a', fontWeight: '800' }}>
              Influencer Declaration and Agreement
            </h3>
            <p style={{ fontSize: '13.5px', color: '#1e40af', lineHeight: '1.6', marginBottom: '14px' }}>
              Before accepting an advertising campaign gig, each Influencer must confirm and acknowledge:
            </p>
            <ul style={{ fontSize: '13.5px', color: '#1e40af', lineHeight: '1.7', paddingLeft: '20px', margin: 0 }}>
              <li>I confirm that I am at least 18 years old and eligible to use MEDIOVA.</li>
              <li>I confirm that I have lawful control of the account used for advertising.</li>
              <li>I have reviewed the campaign requirements, compensation, and deadlines.</li>
              <li>I agree to publish only the approved advertising content, subject to applicable law.</li>
              <li>I agree to maintain the advertisement for the required period (e.g. 24 Hours on WhatsApp Status).</li>
              <li>I understand that payment is subject to completing the agreed task and reasonable verification.</li>
              <li>I agree to submit genuine and accurate evidence.</li>
              <li>I will not manipulate views, fabricate evidence, or submit fraudulent claims.</li>
              <li>I will comply with advertising disclosure obligations and applicable third-party platform rules.</li>
              <li>I understand the applicable payment, withdrawal, and dispute-resolution arrangements.</li>
              <li>I acknowledge that I may challenge an unfair rejection or payment decision.</li>
              <li>I have read and agree to the MEDIOVA Terms and Conditions.</li>
            </ul>
          </section>

          {/* SCHEDULE C */}
          <section style={{ marginBottom: '32px' }}>
            <h3 style={{ fontSize: '1.2rem', color: '#0f172a', fontWeight: '800', marginBottom: '12px' }}>
              SCHEDULE C — Campaign-Specific Terms
            </h3>
            <p style={{ fontSize: '13.5px', color: '#64748b', marginBottom: '14px' }}>
              Each campaign presents a clear summary of conditions that become binding upon acceptance:
            </p>
            <div className="table-wrapper">
              <table className="data-table" style={{ fontSize: '13px' }}>
                <thead>
                  <tr>
                    <th style={{ width: '30%' }}>Campaign Field</th>
                    <th>Required Binding Information</th>
                  </tr>
                </thead>
                <tbody>
                  <tr><td><strong>Campaign ID</strong></td><td>Unique campaign order identifier</td></tr>
                  <tr><td><strong>Vendor</strong></td><td>Verified business or advertiser name</td></tr>
                  <tr><td><strong>Campaign Title</strong></td><td>Name and description of the campaign</td></tr>
                  <tr><td><strong>Advertising Channel</strong></td><td>WhatsApp Status or other supported digital channel</td></tr>
                  <tr><td><strong>Campaign Instructions</strong></td><td>Required promotional activities and caption copy</td></tr>
                  <tr><td><strong>Approved Materials</strong></td><td>Flyer image or video creative authorized by the Vendor</td></tr>
                  <tr><td><strong>Publication Duration</strong></td><td>Required continuous broadcast period (e.g. 24 Hours)</td></tr>
                  <tr><td><strong>Target Reach</strong></td><td>Assigned views target</td></tr>
                  <tr><td><strong>Reward</strong></td><td>Exact guaranteed amount payable per valid completed task</td></tr>
                  <tr><td><strong>Verification Criteria</strong></td><td>Objective evidence (screen recording, view timestamp)</td></tr>
                  <tr><td><strong>Submission Deadline</strong></td><td>Date and time limit for evidence submission</td></tr>
                </tbody>
              </table>
            </div>
          </section>

          {/* SCHEDULE D */}
          <section style={{ marginBottom: '32px' }}>
            <h3 style={{ fontSize: '1.2rem', color: '#0f172a', fontWeight: '800', marginBottom: '12px' }}>
              SCHEDULE D — Platform Enforcement and Accountability
            </h3>
            <p style={{ fontSize: '13.5px', color: '#64748b', marginBottom: '14px' }}>
              Enforcement measures applied consistently and proportionately:
            </p>
            <div className="table-wrapper">
              <table className="data-table" style={{ fontSize: '13px' }}>
                <thead>
                  <tr>
                    <th style={{ width: '35%' }}>Violation Category</th>
                    <th>Enforcement Action</th>
                  </tr>
                </thead>
                <tbody>
                  <tr><td><strong>Incomplete registration details</strong></td><td>Request correction or verification</td></tr>
                  <tr><td><strong>Incorrect campaign evidence</strong></td><td>Request clarification or reject affected submission</td></tr>
                  <tr><td><strong>Repeated minor violations</strong></td><td>Warning or temporary gig assignment restriction</td></tr>
                  <tr><td><strong>Fabricated screenshots / bots</strong></td><td>Immediate rejection, investigation, and account suspension</td></tr>
                  <tr><td><strong>Payment fraud</strong></td><td>Transaction freeze, legal investigation, account termination</td></tr>
                  <tr><td><strong>Misleading or unlawful advertising</strong></td><td>Immediate campaign removal and account restriction</td></tr>
                  <tr><td><strong>Harassment or threats</strong></td><td>Formal warning, suspension, or termination</td></tr>
                </tbody>
              </table>
            </div>
          </section>

          {/* SCHEDULE E */}
          <section style={{ marginBottom: '36px' }}>
            <h3 style={{ fontSize: '1.2rem', color: '#0f172a', fontWeight: '800', marginBottom: '12px' }}>
              SCHEDULE E — User Rights and Responsibilities Summary
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 280px), 1fr))', gap: '16px' }}>
              <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '10px', padding: '16px' }}>
                <h4 style={{ margin: '0 0 8px', fontSize: '14px', color: '#0f172a', fontWeight: '700' }}>Advertisers Have The Right To:</h4>
                <ul style={{ fontSize: '13px', lineHeight: '1.6', color: '#475569', paddingLeft: '18px', margin: 0 }}>
                  <li>Clear campaign cost breakdown</li>
                  <li>Approved creative distribution</li>
                  <li>Authentic completion evidence</li>
                  <li>Refunds of unused campaign funds</li>
                  <li>Fair dispute mediation</li>
                </ul>
              </div>
              <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '10px', padding: '16px' }}>
                <h4 style={{ margin: '0 0 8px', fontSize: '14px', color: '#0f172a', fontWeight: '700' }}>Influencers Have The Right To:</h4>
                <ul style={{ fontSize: '13px', lineHeight: '1.6', color: '#475569', paddingLeft: '18px', margin: 0 }}>
                  <li>Voluntary campaign acceptance</li>
                  <li>Agreed compensation for verified work</li>
                  <li>Transparent withdrawal terms</li>
                  <li>Fair challenge of rejected work</li>
                  <li>Protection of private personal data</li>
                </ul>
              </div>
              <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '10px', padding: '16px' }}>
                <h4 style={{ margin: '0 0 8px', fontSize: '14px', color: '#0f172a', fontWeight: '700' }}>MEDIOVA Platform Commits To:</h4>
                <ul style={{ fontSize: '13px', lineHeight: '1.6', color: '#475569', paddingLeft: '18px', margin: 0 }}>
                  <li>Fair, objective gig verification</li>
                  <li>Transparent transactional records</li>
                  <li>Timely dispute handling</li>
                  <li>Secure independent brokerage</li>
                  <li>Strict data privacy protection</li>
                </ul>
              </div>
            </div>
          </section>

          {/* FINAL ACCEPTANCE */}
          <div style={{ background: '#0f172a', color: '#ffffff', borderRadius: '12px', padding: '24px', textAlign: 'center', marginTop: '40px' }}>
            <h3 style={{ margin: '0 0 8px', fontSize: '1.25rem', fontWeight: '700', color: '#ffffff' }}>
              Final Acceptance of Contractual Terms
            </h3>
            <p style={{ fontSize: '13.5px', color: '#cbd5e1', maxWidth: '640px', margin: '0 auto 16px', lineHeight: '1.6' }}>
              By creating an account, ticking the acceptance checkbox, accepting a promotional campaign, submitting an advertisement, or otherwise using MEDIOVA, you confirm acceptance of all applicable provisions of this Agreement.
            </p>
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link to="/register" className="btn btn-primary" style={{ background: '#059669', padding: '10px 24px' }}>
                Create Account &rarr;
              </Link>
              <Link to="/login" className="btn btn-ghost" style={{ color: '#ffffff', borderColor: '#475569' }}>
                Sign In to Account
              </Link>
            </div>
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}
