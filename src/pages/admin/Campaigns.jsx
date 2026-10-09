import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import DashboardLayout from '../../layouts/DashboardLayout';
import { adminGetCampaigns, adminUpdateCampaign } from '../../services/api';
import { toast } from '../../components/ui/Toast';

export default function AdminCampaigns() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initStatus = searchParams.get('status') || 'all';

  const [loading, setLoading] = useState(true);
  const [campaigns, setCampaigns] = useState([]);
  const [total, setTotal] = useState(0);
  const [statusFilter, setStatusFilter] = useState(initStatus);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchCampaigns();
  }, [statusFilter]);

  const fetchCampaigns = async () => {
    try {
      setLoading(true);
      const params = {
        status: statusFilter === 'all' ? undefined : statusFilter,
        search: search || undefined,
      };
      const { data } = await adminGetCampaigns(params);
      setCampaigns(data.campaigns || []);
      setTotal(data.total || 0);
    } catch (err) {
      toast.error('Failed to load campaigns.');
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmPayment = async (campaign) => {
    if (!window.confirm(`Confirm payment of ₦${Number(campaign.price).toLocaleString()} for order #${campaign.orderNumber}?`)) {
      return;
    }

    try {
      const { data } = await adminUpdateCampaign(campaign._id, {
        paymentStatus: 'confirmed',
        status: 'Payment Confirmed',
      });
      toast.success('Payment confirmed! Campaign is ready for influencer matching.');
      fetchCampaigns();
    } catch (err) {
      toast.error('Failed to confirm payment.');
    }
  };

  const getStatusBadge = (status) => {
    const map = {
      'Awaiting Payment': 'badge-warning',
      'Payment Confirmed': 'badge-info',
      'Under Review': 'badge-warning',
      'Approved': 'badge-info',
      'Influencers Assigned': 'badge-purple',
      'Active': 'badge-info',
      'Completed': 'badge-success',
      'Rejected': 'badge-error',
    };
    return <span className={`badge ${map[status] || 'badge-muted'}`}>{status}</span>;
  };

  return (
    <DashboardLayout title="Campaign Brokerage" role="admin">
      <div className="page-header">
        <div>
          <h2 className="page-title">Advertising Campaigns ({total})</h2>
          <p className="page-subtitle">Verify advertiser payments, match influencers, assign gigs, and track deliveries.</p>
        </div>
      </div>

      {/* Filter Tabs */}
      <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '12px', marginBottom: '20px' }}>
        {['all', 'Awaiting Payment', 'Payment Confirmed', 'Influencers Assigned', 'Active', 'Completed'].map((tab) => (
          <button
            key={tab}
            onClick={() => {
              setStatusFilter(tab);
              setSearchParams(tab === 'all' ? {} : { status: tab });
            }}
            className={`btn btn-sm ${statusFilter === tab ? 'btn-primary' : 'btn-ghost'}`}
            style={{ borderRadius: '20px' }}
          >
            {tab === 'all' ? 'All Campaigns' : tab}
          </button>
        ))}
      </div>

      <div className="card">
        <div className="card-body" style={{ padding: 0 }}>
          {loading ? (
            <div style={{ textAlign: 'center', padding: '60px' }}>
              <div className="spinner" style={{ margin: '0 auto 16px' }} />
              <p style={{ color: '#64748b' }}>Loading campaigns...</p>
            </div>
          ) : campaigns.length === 0 ? (
            <div className="empty-state">
              
              <h3>No campaigns found</h3>
            </div>
          ) : (
            <div className="table-wrapper" style={{ border: 'none', borderRadius: 0 }}>
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Order Ref</th>
                    <th>Vendor</th>
                    <th>Campaign Name</th>
                    <th>Target Area</th>
                    <th>Target Reach</th>
                    <th>Price</th>
                    <th>Payment</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {campaigns.map((c) => (
                    <tr key={c._id}>
                      <td>
                        <strong>#{c.orderNumber}</strong>
                        <div style={{ fontSize: '11px', color: '#94a3b8' }}>
                          {new Date(c.createdAt).toLocaleDateString()}
                        </div>
                      </td>
                      <td>
                        <strong>{c.vendorId?.name}</strong>
                        <div style={{ fontSize: '12px', color: '#64748b' }}>{c.vendorId?.email}</div>
                      </td>
                      <td>
                        <strong>{c.title}</strong>
                        <div style={{ fontSize: '12px', color: '#64748b' }}>{c.category}</div>
                      </td>
                      <td>
                        {c.targetLocation?.area}, {c.targetLocation?.state}
                      </td>
                      <td>
                        <strong style={{ color: '#2563eb' }}>{Number(c.requiredViews).toLocaleString()}</strong>
                        <div style={{ fontSize: '11px', color: '#059669' }}>
                          Assigned: {Number(c.assignedReach || 0).toLocaleString()}
                        </div>
                      </td>
                      <td>
                        <strong>₦{Number(c.price).toLocaleString()}</strong>
                      </td>
                      <td>
                        {c.paymentStatus === 'confirmed' ? (
                          <span className="badge badge-success">✓ Confirmed</span>
                        ) : (
                          <button
                            className="btn btn-sm btn-warning"
                            onClick={() => handleConfirmPayment(c)}
                          >
                            Confirm Paid
                          </button>
                        )}
                      </td>
                      <td>{getStatusBadge(c.status)}</td>
                      <td>
                        <Link
                          to={`/admin/campaigns/${c._id}`}
                          className="btn btn-sm btn-primary"
                        >
                          Match & Manage →
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
