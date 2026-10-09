import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import DashboardLayout from '../../layouts/DashboardLayout';
import { getVendorCampaign, getOrderOptions } from '../../services/api';
import { toast } from '../../components/ui/Toast';

export default function VendorOrderDetail() {
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [campaign, setCampaign] = useState(null);
  const [analytics, setAnalytics] = useState(null);
  const [adminWhatsapp, setAdminWhatsapp] = useState('+2348012345678');

  useEffect(() => {
    fetchDetail();
  }, [id]);

  const fetchDetail = async () => {
    try {
      setLoading(true);
      const [cRes, oRes] = await Promise.all([
        getVendorCampaign(id),
        getOrderOptions(),
      ]);
      setCampaign(cRes.data.campaign);
      setAnalytics(cRes.data.analytics);
      if (oRes.data.adminWhatsapp) setAdminWhatsapp(oRes.data.adminWhatsapp);
    } catch (err) {
      toast.error('Failed to load campaign timeline.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <DashboardLayout title="Order Details" role="vendor">
        <div style={{ textAlign: 'center', padding: '60px' }}>
          <div className="spinner" style={{ margin: '0 auto 16px' }} />
          <p style={{ color: '#64748b' }}>Loading campaign details...</p>
        </div>
      </DashboardLayout>
    );
  }

  if (!campaign) {
    return (
      <DashboardLayout title="Order Details" role="vendor">
        <div className="card" style={{ padding: '40px', textAlign: 'center' }}>
          <h3>Order not found</h3>
          <Link to="/vendor/orders" className="btn btn-primary" style={{ marginTop: '16px' }}>Back to Orders</Link>
        </div>
      </DashboardLayout>
    );
  }

  // Calculate Timeline Steps
  const timelineStages = [
    { key: 'submitted', label: 'Order Submitted', desc: 'Received by broker', done: true },
    { key: 'payment', label: 'Payment Confirmed', desc: 'Verified by Admin', done: campaign.paymentStatus === 'confirmed' },
    { key: 'approved', label: 'Campaign Approved', desc: 'Requirements validated', done: ['Approved', 'Processing', 'Influencers Assigned', 'Active', 'Completed'].includes(campaign.status) },
    { key: 'assigned', label: 'Influencers Assigned', desc: 'Matched to target area', done: ['Influencers Assigned', 'Active', 'Completed'].includes(campaign.status) },
    { key: 'running', label: 'Campaign Running', desc: 'Live on WhatsApp Status', done: ['Active', 'Completed'].includes(campaign.status), active: campaign.status === 'Active' },
    { key: 'completed', label: 'Campaign Completed', desc: 'All proofs audited', done: campaign.status === 'Completed' },
  ];

  // WhatsApp Admin Link
  const waClean = adminWhatsapp.replace(/[^0-9]/g, '');
  const waText = encodeURIComponent(
    `Hello DOPtv Team, I am contacting you regarding advertising order #${campaign.orderNumber} for "${campaign.title}".`
  );
  const waUrl = `https://wa.me/${waClean}?text=${waText}`;

  return (
    <DashboardLayout title={`Order #${campaign.orderNumber}`} role="vendor">
      <div style={{ marginBottom: '20px' }}>
        <Link to="/vendor/orders" style={{ color: '#2563eb', fontWeight: '600', fontSize: '14px' }}>
          ← Back to All Orders
        </Link>
      </div>

      <div className="grid-2" style={{ gap: '28px', alignItems: 'flex-start' }}>
        {/* Left Column: Timeline & Progress */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <div className="card">
            <div className="card-header">
              <h3 style={{ fontSize: '1.2rem' }}> Campaign Progress Timeline</h3>
              <span className="badge badge-info">{campaign.status}</span>
            </div>
            <div className="card-body">
              <div className="order-timeline">
                {timelineStages.map((stage, i) => (
                  <div key={stage.key} className="timeline-item">
                    <div className={`timeline-dot ${stage.done ? 'done' : stage.active ? 'active' : ''}`} />
                    <div className={`timeline-label ${stage.done ? 'done' : stage.active ? 'active' : ''}`}>
                      {stage.done ? '✓ ' : stage.active ? '● ' : '○ '} {stage.label}
                    </div>
                    <div className="timeline-date">{stage.desc}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Campaign Analytics Card */}
          <div className="card">
            <div className="card-header">
              <h3 style={{ fontSize: '1.2rem' }}> Campaign Delivery Analytics</h3>
            </div>
            <div className="card-body">
              <div className="stats-grid" style={{ marginBottom: 0 }}>
                <div className="stat-card" style={{ padding: '16px' }}>
                  <div className="stat-info">
                    <div className="stat-label">Influencers Assigned</div>
                    <div className="stat-value" style={{ fontSize: '1.5rem' }}>
                      {analytics?.totalInfluencers || 0}
                    </div>
                  </div>
                </div>
                <div className="stat-card" style={{ padding: '16px' }}>
                  <div className="stat-info">
                    <div className="stat-label">Completed Gigs</div>
                    <div className="stat-value" style={{ fontSize: '1.5rem', color: '#059669' }}>
                      {analytics?.completedGigs || 0}
                    </div>
                  </div>
                </div>
                <div className="stat-card" style={{ padding: '16px' }}>
                  <div className="stat-info">
                    <div className="stat-label">Completion Rate</div>
                    <div className="stat-value" style={{ fontSize: '1.5rem', color: '#2563eb' }}>
                      {analytics?.completionRate || 0}%
                    </div>
                  </div>
                </div>
              </div>
              <p style={{ fontSize: '12px', color: '#94a3b8', marginTop: '16px', margin: '16px 0 0' }}>
                Note: In accordance with platform privacy rules, influencer names and contact details are managed privately by Admin.
              </p>
            </div>
          </div>
        </div>

        {/* Right Column: Order Details & WhatsApp Action */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {/* Payment & Contact Admin Card */}
          <div className="card" style={{ padding: '24px' }}>
            <h3 style={{ fontSize: '1.2rem', marginBottom: '8px' }}>Need Support or Update?</h3>
            <p style={{ color: '#64748b', fontSize: '14px', lineHeight: '1.6', marginBottom: '20px' }}>
              Your dedicated campaign broker is available on WhatsApp to assist with payment, influencer allocations, or adjustments.
            </p>

            <a
              href={waUrl}
              target="_blank"
              rel="noreferrer"
              className="btn btn-whatsapp btn-block btn-lg"
            >
               Message Admin on WhatsApp →
            </a>
          </div>

          {/* Campaign Summary Card */}
          <div className="card">
            <div className="card-header">
              <h3 style={{ fontSize: '1.2rem' }}> Campaign Brief</h3>
            </div>
            <div className="card-body">
              {campaign.media?.url && (
                <div style={{ marginBottom: '16px', borderRadius: '8px', overflow: 'hidden', textAlign: 'center', background: '#0f172a' }}>
                  <img
                    src={campaign.media.url}
                    alt={campaign.title}
                    style={{ maxHeight: '200px', margin: '0 auto', objectFit: 'contain' }}
                  />
                </div>
              )}

              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '14px' }}>
                <div>
                  <span style={{ color: '#64748b' }}>Campaign Title:</span>
                  <div style={{ fontWeight: '700', fontSize: '15px' }}>{campaign.title}</div>
                </div>
                <div>
                  <span style={{ color: '#64748b' }}>Category:</span>
                  <div style={{ fontWeight: '600' }}>{campaign.category}</div>
                </div>
                <div>
                  <span style={{ color: '#64748b' }}>Target Area:</span>
                  <div style={{ fontWeight: '600' }}>{campaign.targetLocation?.area}, {campaign.targetLocation?.state}</div>
                </div>
                <div>
                  <span style={{ color: '#64748b' }}>Target Reach:</span>
                  <div style={{ fontWeight: '700', color: '#2563eb' }}>{Number(campaign.requiredViews).toLocaleString()} Views</div>
                </div>
                <div>
                  <span style={{ color: '#64748b' }}>Duration:</span>
                  <div style={{ fontWeight: '600' }}>{campaign.duration}</div>
                </div>
                <div style={{ borderTop: '1px solid #e2e8f0', paddingTop: '12px', display: 'flex', justifyContent: 'space-between' }}>
                  <span>Total Budget:</span>
                  <strong style={{ color: '#059669', fontSize: '18px' }}>₦{Number(campaign.price).toLocaleString()}</strong>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
