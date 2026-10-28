import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import DashboardLayout from '../../layouts/DashboardLayout';
import { getMyCampaigns } from '../../services/api';
import { toast } from '../../components/ui/Toast';

export default function VendorOrders() {
  const [loading, setLoading] = useState(true);
  const [campaigns, setCampaigns] = useState([]);
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    fetchOrders();
  }, [statusFilter]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const params = statusFilter === 'all' ? {} : { status: statusFilter };
      const { data } = await getMyCampaigns(params);
      setCampaigns(data.campaigns || []);
    } catch (err) {
      toast.error('Failed to load campaigns.');
    } finally {
      setLoading(false);
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
      'Cancelled': 'badge-muted',
    };
    return <span className={`badge ${map[status] || 'badge-muted'}`}>{status}</span>;
  };

  return (
    <DashboardLayout title="My Advertising Orders" role="vendor">
      <div className="page-header">
        <div>
          <h2 className="page-title">Advertising Campaigns</h2>
          <p className="page-subtitle">Track your placed campaign orders and monitor distribution progress.</p>
        </div>
        <Link to="/vendor/place-ad" className="btn btn-primary" style={{ background: '#2563eb' }}>
          + Place New Advertisement
        </Link>
      </div>

      {/* Filter Tabs */}
      <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '12px', marginBottom: '24px' }}>
        {['all', 'Awaiting Payment', 'Active', 'Influencers Assigned', 'Completed'].map((tab) => (
          <button
            key={tab}
            onClick={() => setStatusFilter(tab)}
            className={`btn btn-sm ${statusFilter === tab ? 'btn-primary' : 'btn-ghost'}`}
            style={{ borderRadius: '20px' }}
          >
            {tab === 'all' ? 'All Orders' : tab}
          </button>
        ))}
      </div>

      <div className="card">
        <div className="card-body" style={{ padding: 0 }}>
          {loading ? (
            <div style={{ textAlign: 'center', padding: '60px 16px' }}>
              <div className="spinner" style={{ margin: '0 auto 16px' }} />
              <p style={{ color: '#64748b' }}>Loading your orders...</p>
            </div>
          ) : campaigns.length === 0 ? (
            <div className="empty-state" style={{ margin: '16px', padding: 'clamp(24px, 5vw, 44px) 16px' }}>
              <h3>No campaigns found</h3>
              <p>Ready to start advertising? Create your first campaign and reach WhatsApp audiences.</p>
              <Link to="/vendor/place-ad" className="btn btn-primary">Place an Advertisement</Link>
            </div>
          ) : (
            <>
              {/* Mobile View: High-Density Responsive Order Cards (<= 768px) */}
              <div className="mobile-only" style={{ padding: '12px' }}>
                {campaigns.map((c) => (
                  <div
                    key={c._id}
                    className="card"
                    style={{
                      padding: '14px',
                      marginBottom: '12px',
                      border: '1px solid #e2e8f0',
                      background: '#ffffff',
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                      <div>
                        <span style={{ fontSize: '11px', fontWeight: '700', color: '#94a3b8' }}>#{c.orderNumber}</span>
                        <h4 style={{ margin: '2px 0 0', fontSize: '14px', color: '#0f172a' }}>{c.title}</h4>
                        <span style={{ fontSize: '12px', color: '#64748b' }}>{c.category}</span>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        {getStatusBadge(c.status)}
                      </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 130px), 1fr))', gap: '8px', fontSize: '12px', margin: '8px 0', padding: '8px 0', borderTop: '1px solid #f1f5f9', borderBottom: '1px solid #f1f5f9' }}>
                      <div>
                        <span style={{ color: '#64748b', display: 'block', fontSize: '10.5px' }}>TARGET AREA</span>
                        <strong>{c.targetLocation?.area || 'Nationwide'}, {c.targetLocation?.state || ''}</strong>
                      </div>
                      <div>
                        <span style={{ color: '#64748b', display: 'block', fontSize: '10.5px' }}>VIEWS</span>
                        <strong style={{ color: '#2563eb' }}>{Number(c.requiredViews).toLocaleString()}</strong>
                      </div>
                      <div>
                        <span style={{ color: '#64748b', display: 'block', fontSize: '10.5px' }}>PRICE</span>
                        <strong style={{ color: '#059669' }}>₦{Number(c.price).toLocaleString()}</strong>
                      </div>
                      <div>
                        <span style={{ color: '#64748b', display: 'block', fontSize: '10.5px' }}>PAYMENT</span>
                        {c.paymentStatus === 'confirmed' ? (
                          <span className="badge badge-success" style={{ fontSize: '11px', padding: '2px 6px' }}>✓ Paid</span>
                        ) : (
                          <span className="badge badge-warning" style={{ fontSize: '11px', padding: '2px 6px' }}>Unpaid</span>
                        )}
                      </div>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: '11px', color: '#94a3b8' }}>{new Date(c.createdAt).toLocaleDateString()}</span>
                      <Link to={`/vendor/orders/${c._id}`} className="btn btn-sm btn-ghost">
                        View Timeline →
                      </Link>
                    </div>
                  </div>
                ))}
              </div>

              {/* Desktop View: Full Data Table (> 768px) */}
              <div className="table-wrapper desktop-only" style={{ border: 'none', borderRadius: 0 }}>
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Order Number</th>
                      <th>Campaign Title</th>
                      <th>Target Area</th>
                      <th>Required Views</th>
                      <th>Price</th>
                      <th>Payment</th>
                      <th>Campaign Status</th>
                      <th>Timeline</th>
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
                          <strong>{c.title}</strong>
                          <div style={{ fontSize: '12px', color: '#64748b' }}>{c.category}</div>
                        </td>
                        <td>
                          {c.targetLocation?.area}, {c.targetLocation?.state}
                        </td>
                        <td>
                          <strong style={{ color: '#2563eb' }}>{Number(c.requiredViews).toLocaleString()}</strong>
                        </td>
                        <td>
                          <strong>₦{Number(c.price).toLocaleString()}</strong>
                        </td>
                        <td>
                          {c.paymentStatus === 'confirmed' ? (
                            <span className="badge badge-success">✓ Confirmed</span>
                          ) : (
                            <span className="badge badge-warning">Unpaid</span>
                          )}
                        </td>
                        <td>{getStatusBadge(c.status)}</td>
                        <td>
                          <Link to={`/vendor/orders/${c._id}`} className="btn btn-sm btn-ghost">
                            View Timeline →
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
