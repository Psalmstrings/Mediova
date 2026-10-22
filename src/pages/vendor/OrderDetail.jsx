import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import DashboardLayout from '../../layouts/DashboardLayout';
import { getVendorCampaign, getOrderOptions, submitRefundRequest, getMyRefundRequests } from '../../services/api';
import { toast } from '../../components/ui/Toast';

const nigerianBanks = [
  'Access Bank', 'Citibank', 'Ecobank Nigeria', 'Fidelity Bank', 'First Bank of Nigeria',
  'First City Monument Bank (FCMB)', 'Guaranty Trust Bank (GTBank)', 'Heritage Bank',
  'Keystone Bank', 'Kuda Bank', 'Moniepoint MFB', 'OPay', 'Palmpay', 'Polaris Bank',
  'Providus Bank', 'Stanbic IBTC Bank', 'Standard Chartered Bank', 'Sterling Bank',
  'SunTrust Bank', 'Union Bank of Nigeria', 'United Bank for Africa (UBA)',
  'Unity Bank', 'Wema Bank', 'Zenith Bank',
];

export default function VendorOrderDetail() {
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [campaign, setCampaign] = useState(null);
  const [analytics, setAnalytics] = useState(null);
  const [adminWhatsapp, setAdminWhatsapp] = useState('+2348012345678');

  // Refund State
  const [existingRefund, setExistingRefund] = useState(null);
  const [showRefundModal, setShowRefundModal] = useState(false);
  const [refundForm, setRefundForm] = useState({
    reason: 'Campaign Cancelled Before Launch',
    description: '',
    accountName: '',
    bankName: 'Zenith Bank',
    accountNumber: '',
  });
  const [submittingRefund, setSubmittingRefund] = useState(false);

  useEffect(() => {
    fetchDetail();
  }, [id]);

  const fetchDetail = async () => {
    try {
      setLoading(true);
      const [cRes, oRes, rRes] = await Promise.all([
        getVendorCampaign(id),
        getOrderOptions(),
        getMyRefundRequests().catch(() => ({ data: { refunds: [] } })),
      ]);
      setCampaign(cRes.data.campaign);
      setAnalytics(cRes.data.analytics);
      if (oRes.data.adminWhatsapp) setAdminWhatsapp(oRes.data.adminWhatsapp);

      const matchedRefund = rRes.data.refunds?.find(
        (r) => r.campaignId?._id === id || r.campaignId === id
      );
      if (matchedRefund) setExistingRefund(matchedRefund);
    } catch (err) {
      toast.error('Failed to load campaign timeline.');
    } finally {
      setLoading(false);
    }
  };

  const handleRefundSubmit = async (e) => {
    e.preventDefault();
    const cleanNum = refundForm.accountNumber.replace(/[^0-9]/g, '');
    if (cleanNum.length !== 10) {
      toast.error('Account number must be exactly 10 digits.');
      return;
    }
    if (!refundForm.description.trim()) {
      toast.warning('Please provide a reason explanation.');
      return;
    }

    setSubmittingRefund(true);
    try {
      const payload = {
        campaignId: campaign._id,
        reason: refundForm.reason,
        description: refundForm.description.trim(),
        bankDetails: {
          accountName: refundForm.accountName.trim(),
          bankName: refundForm.bankName.trim(),
          accountNumber: cleanNum,
        },
      };
      const { data } = await submitRefundRequest(payload);
      toast.success(data.message || 'Refund request submitted for administrative review.');
      setShowRefundModal(false);
      setExistingRefund(data.refund);
      fetchDetail();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to submit refund request.');
    } finally {
      setSubmittingRefund(false);
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
    `Hello MEDIOVA Team, I am contacting you regarding advertising order #${campaign.orderNumber} for "${campaign.title}".`
  );
  const waUrl = `https://wa.me/${waClean}?text=${waText}`;

  // Target Location Display String
  const targetLocationDisplay = campaign.targetLocation?.isNationwide
    ? '🇳🇬 Nationwide (All 36 States & FCT Abuja)'
    : campaign.targetLocation?.targetStates?.length
    ? `${campaign.targetLocation.targetStates.join(', ')} (${campaign.targetLocation.area || 'General'})`
    : `${campaign.targetLocation?.area || 'General'}, ${campaign.targetLocation?.state || 'Lagos'}`;

  const isEligibleForRefund =
    campaign.paymentStatus === 'confirmed' &&
    campaign.status !== 'Completed' &&
    campaign.paymentStatus !== 'refunded';

  return (
    <DashboardLayout title={`Order #${campaign.orderNumber}`} role="vendor">
      <div style={{ marginBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Link to="/vendor/orders" style={{ color: '#2563eb', fontWeight: '600', fontSize: '14px' }}>
          ← Back to All Orders
        </Link>
        <div style={{ display: 'flex', gap: '8px' }}>
          {existingRefund && (
            <span className="badge badge-warning" style={{ padding: '6px 12px' }}>
              Refund Status: {existingRefund.status}
            </span>
          )}
          {isEligibleForRefund && !existingRefund && (
            <button
              type="button"
              className="btn btn-sm btn-ghost"
              style={{ color: '#dc2626' }}
              onClick={() => setShowRefundModal(true)}
            >
              Request Refund
            </button>
          )}
        </div>
      </div>

      <div className="grid-2" style={{ gap: '28px', alignItems: 'flex-start' }}>
        {/* Left Column: Timeline & Progress */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <div className="card">
            <div className="card-header">
              <h3 style={{ fontSize: '1.2rem', margin: 0 }}>Campaign Progress Timeline</h3>
              <span className="badge badge-info">{campaign.status}</span>
            </div>
            <div className="card-body">
              <div className="order-timeline">
                {timelineStages.map((stage) => (
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
              <h3 style={{ fontSize: '1.2rem', margin: 0 }}>Campaign Delivery Analytics</h3>
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
                Note: In accordance with platform confidentiality and privacy covenants, individual creator identities and telephone numbers are protected behind the MEDIOVA Privacy Firewall.
              </p>
            </div>
          </div>

          {/* Refund Status Card (if refund active) */}
          {existingRefund && (
            <div className="card" style={{ borderLeft: '4px solid #f59e0b' }}>
              <div className="card-header">
                <h3 style={{ fontSize: '1.1rem', margin: 0 }}>Refund Request (#{existingRefund.refundNumber})</h3>
                <span className="badge badge-warning">{existingRefund.status}</span>
              </div>
              <div className="card-body" style={{ fontSize: '13px', lineHeight: '1.6' }}>
                <p><strong>Reason:</strong> {existingRefund.reason}</p>
                <p><strong>Explanation:</strong> {existingRefund.description}</p>
                <p><strong>Reversal Bank:</strong> {existingRefund.bankDetails?.bankName} (•••• {existingRefund.bankDetails?.accountNumber?.slice(-4)})</p>
                {existingRefund.transferReference && (
                  <p style={{ color: '#059669', fontWeight: '700' }}>
                    Bank Transfer Reference: {existingRefund.transferReference}
                  </p>
                )}
                {existingRefund.adminNotes && (
                  <p style={{ color: '#64748b' }}>Admin Note: {existingRefund.adminNotes}</p>
                )}
                <div style={{ marginTop: '12px', fontSize: '12px', color: '#64748b' }}>
                  Governed by the <Link to="/refund-policy" target="_blank" style={{ color: '#059669', textDecoration: 'underline' }}>MEDIOVA Refund Policy</Link>.
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Order Details & WhatsApp Action */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {/* Payment & Contact Admin Card */}
          <div className="card" style={{ padding: '24px' }}>
            <h3 style={{ fontSize: '1.2rem', marginBottom: '8px' }}>Need Support or Update?</h3>
            <p style={{ color: '#64748b', fontSize: '14px', lineHeight: '1.6', marginBottom: '20px' }}>
              Your dedicated campaign broker is available on WhatsApp to assist with payment confirmation, multi-state reach allocations, or adjustments.
            </p>

            <a
              href={waUrl}
              target="_blank"
              rel="noreferrer"
              className="btn btn-whatsapp btn-block btn-lg"
            >
              💬 Message Admin on WhatsApp →
            </a>
          </div>

          {/* Campaign Summary Card */}
          <div className="card">
            <div className="card-header">
              <h3 style={{ fontSize: '1.2rem', margin: 0 }}>Campaign Brief</h3>
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
                  <span style={{ color: '#64748b' }}>Target Geographical Coverage:</span>
                  <div style={{ fontWeight: '600', color: '#0f172a' }}>{targetLocationDisplay}</div>
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

      {/* Refund Request Modal */}
      {showRefundModal && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: '16px',
          }}
        >
          <div className="card" style={{ maxWidth: '520px', width: '100%', padding: '28px', maxHeight: '90vh', overflowY: 'auto' }}>
            <h3 style={{ marginBottom: '8px' }}>Request Campaign Refund</h3>
            <p style={{ color: '#64748b', fontSize: '13px', lineHeight: '1.6', marginBottom: '20px' }}>
              Refunds are reviewed by finance controllers within 3-5 business days under the{' '}
              <Link to="/refund-policy" target="_blank" style={{ color: '#059669', textDecoration: 'underline' }}>
                MEDIOVA Refund Policy
              </Link>
              . Approved amounts are transferred directly to your bank account.
            </p>

            <form onSubmit={handleRefundSubmit}>
              <div className="form-group">
                <label className="form-label">Refund Reason <span className="required">*</span></label>
                <select
                  className="form-control"
                  value={refundForm.reason}
                  onChange={(e) => setRefundForm({ ...refundForm, reason: e.target.value })}
                >
                  <option value="Campaign Cancelled Before Launch">Campaign Cancelled Before Launch (100% Refund)</option>
                  <option value="Reach SLA Not Met">Reach SLA Not Met by Platform</option>
                  <option value="Influencer Non-Delivery">Influencer Non-Delivery</option>
                  <option value="Duplicate Payment">Duplicate Bank Payment</option>
                  <option value="Billing Error">Billing Error</option>
                  <option value="Other">Other Reason</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Detailed Explanation <span className="required">*</span></label>
                <textarea
                  required
                  rows={3}
                  className="form-control"
                  placeholder="Explain why you are requesting a refund for this order..."
                  value={refundForm.description}
                  onChange={(e) => setRefundForm({ ...refundForm, description: e.target.value })}
                />
              </div>

              <h4 style={{ fontSize: '14px', margin: '16px 0 8px' }}>Disbursement Bank Account (For Reversal)</h4>

              <div className="form-group">
                <label className="form-label">Bank Name <span className="required">*</span></label>
                <select
                  className="form-control"
                  value={refundForm.bankName}
                  onChange={(e) => setRefundForm({ ...refundForm, bankName: e.target.value })}
                >
                  {nigerianBanks.map((b) => (
                    <option key={b} value={b}>{b}</option>
                  ))}
                </select>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">10-Digit NUBAN <span className="required">*</span></label>
                  <input
                    type="text"
                    required
                    maxLength={10}
                    className="form-control"
                    placeholder="0123456789"
                    value={refundForm.accountNumber}
                    onChange={(e) => setRefundForm({ ...refundForm, accountNumber: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Account Holder Name <span className="required">*</span></label>
                  <input
                    type="text"
                    required
                    className="form-control"
                    placeholder="Exact name on account"
                    value={refundForm.accountName}
                    onChange={(e) => setRefundForm({ ...refundForm, accountName: e.target.value })}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', gap: '12px', marginTop: '20px' }}>
                <button
                  type="button"
                  className="btn btn-ghost"
                  onClick={() => setShowRefundModal(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={submittingRefund}
                  style={{ flex: 1 }}
                >
                  {submittingRefund ? 'Submitting Request...' : 'Submit Refund Request →'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
