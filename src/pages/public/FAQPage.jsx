import React, { useState } from 'react';
import { PublicNav, Footer } from './LandingPage';

export default function FAQPage() {
  const [open, setOpen] = useState(null);

  const items = [
    { q: 'How does DOPtv guarantee WhatsApp views?', a: 'Every influencer submitted to DOPtv must upload initial proof of their average status views. When assigned a campaign, influencers submit screenshots showing the flyer posted as well as view metrics after completion. Admin checks each submission manually before approving payouts.' },
    { q: 'Why is there no direct messaging between vendors and influencers?', a: 'DOPtv operates strictly as a managed brokerage platform. This protects vendors from flaky influencers, haggling, and fake analytics, while guaranteeing that influencers are paid promptly and fairly without payment disputes.' },
    { q: 'How do vendors make payment?', a: 'After creating an ad order on the platform, you will be given an order reference and a direct WhatsApp link to contact our Admin brokerage team. You complete payment via direct bank transfer, and Admin activates the campaign immediately.' },
    { q: 'When do influencers receive their earnings?', a: 'Once an influencer submits proof screenshots and the Admin approves the gig, the reward is credited to the influencer’s approved balance. Payouts are transferred to the influencer’s registered Nigerian bank account.' },
    { q: 'Can I decline a gig assigned to me?', a: 'Yes. If a campaign conflicts with your personal brand or you are temporarily unavailable, you may decline the gig with a brief explanation. You can also toggle your availability to "Unavailable" in your dashboard.' },
    { q: 'What kind of advertisements are accepted?', a: 'We accept legitimate commercial businesses, fashion, electronics, education, events, foods, beauty products, software, and real estate. We strictly reject fraudulent schemes, adult content, or unauthorized activities.' },
  ];

  return (
    <div>
      <PublicNav />
      <div style={{ background: '#0f172a', color: 'white', padding: '60px 24px', textAlign: 'center' }}>
        <h1 style={{ color: 'white', fontSize: '2.5rem', marginBottom: '8px' }}>Frequently Asked Questions</h1>
        <p style={{ color: '#94a3b8' }}>Everything you need to know about advertising or earning on DOPtv</p>
      </div>

      <div style={{ maxWidth: '800px', margin: '60px auto', padding: '0 24px' }}>
        <div className="faq-list">
          {items.map((item, i) => (
            <div key={i} className="faq-item">
              <div className="faq-question" onClick={() => setOpen(open === i ? null : i)}>
                <span>{item.q}</span>
                <span>{open === i ? '▲' : '▼'}</span>
              </div>
              {open === i && <div className="faq-answer">{item.a}</div>}
            </div>
          ))}
        </div>
      </div>
      <Footer />
    </div>
  );
}
