import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import DashboardLayout from '../../layouts/DashboardLayout';
import { getVendorProfile, getMyCampaigns } from '../../services/api';
import { toast } from '../../components/ui/Toast';

export default function VendorDashboard() {
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState(null);
  const [campaigns, setCampaigns] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [pRes, cRes] = await Promise.all([
        getVendorProfile(),
        getMyCampaigns({ limit: 5 }),
      ]);
      setProfile(pRes.data.profile);
      setCampaigns(cRes.data.campaigns || []);
    } catch (err) {
      toast.error('Failed to load vendor dashboard.');
    } finally {
      setLoading(false);
    }
  };

  const totalOrders = campaigns.length;
  const pendingOrders = campaigns.filter((c) => ['Submitted', 'Awaiting Payment', 'Under Review'].includes(c.status)).length;
  const activeCampaigns = campaigns.filter((c) => ['Active', 'Processing', 'Influencers Assigned'].includes(c.status)).length;
  const completedCampaigns = campaigns.filter((c) => c.status === 'Completed').length;
  const totalSpent = campaigns
    .filter((c) => c.paymentStatus === 'confirmed')
    .reduce((acc, c) => acc + (c.price || 0), 0);

  if (loading) {
    return (
      <DashboardLayout title="Advertiser Dashboard" role="vendor">
        <div style={{ textAlign: 'center', padding: '60px' }}>
          <div className="spinner" style={{ margin: '0 auto 16px' }} />
          <p style={{ color: '#64748b' }}>Loading dashboard...</p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout title="Advertiser Dashboard" role="vendor">
      {/* Welcome Banner */}
      <div className="card" style={{
        padding: '28px',
        marginBottom: '28px',
        background: 'linear-gradient(135deg, #0B1320 0%, #166534 100%)',
        color: 'white',
        borderLeft: '4px solid var(--brand-yellow)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '20px'
      }}>
        <div>
          <span style={{ background: 'rgba(234, 179, 8, 0.15)', border: '1px solid rgba(234, 179, 8, 0.3)', color: 'var(--brand-yellow)', padding: '4px 12px', borderRadius: '12px', fontSize: '12px', fontWeight: 'bold' }}>
            {profile?.businessCategory || 'Business Account'}
          </span>
          <h2 style={{ color: 'white', fontSize: '1.6rem', marginTop: '10px', marginBottom: '6px' }}>
            {profile?.businessName || 'My Business'}
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.75)', fontSize: '14px', margin: 0 }}>
            Reach targeted Nigerian customers through verified WhatsApp Status creators.
          </p>
        </div>
        <Link to="/vendor/advertise" className="btn btn-lg" style={{ background: 'var(--brand-yellow)', color: '#0F172A', fontWeight: '800' }}>
          Place an Advertisement &rarr;
        </Link>
      </div>

      {/* Metrics Cards */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-info">
            <div className="stat-label">Total Orders</div>
            <div className="stat-value">{totalOrders}</div>
            <div className="stat-sub">Lifetime requests</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-info">
            <div className="stat-label">Pending Orders</div>
            <div className="stat-value" style={{ color: 'var(--status-pending)' }}>{pendingOrders}</div>
            <div className="stat-sub">Awaiting payment / review</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-info">
            <div className="stat-label">Active Campaigns</div>
            <div className="stat-value" style={{ color: 'var(--brand-green)' }}>{activeCampaigns}</div>
            <div className="stat-sub">Currently running</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-info">
            <div className="stat-label">Total Spent</div>
            <div className="stat-value" style={{ color: 'var(--brand-dark)' }}>₦{Number(totalSpent).toLocaleString()}</div>
            <div className="stat-sub">Confirmed campaigns</div>
          </div>
        </div>
      </div>

      {/* Recent Campaigns Table */}
      <div className="card">
        <div className="card-header">
          <h3 style={{ fontSize: '1.15rem' }}>Recent Advertising Orders</h3>
          <Link to="/vendor/orders" className="btn btn-sm btn-ghost">View All Orders</Link>
        </div>
        <div className="card-body" style={{ padding: 0 }}>
          {campaigns.length === 0 ? (
            <div className="empty-state">
              
              <h3>No campaigns placed yet</h3>
              <p>Launch your first WhatsApp Status advertising blitz to reach targeted local buyers.</p>
              <Link to="/vendor/place-ad" className="btn btn-primary" style={{ background: '#2563eb' }}>
                Place an Advertisement Now
              </Link>
            </div>
          ) : (
            <div className="table-wrapper" style={{ border: 'none', borderRadius: 0 }}>
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Order Ref</th>
                    <th>Campaign</th>
                    <th>Target Area</th>
                    <th>Views</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {campaigns.map((c) => (
                    <tr key={c._id}>
                      <td>
                        <strong>#{c.orderNumber}</strong>
                        <div style={{ fontSize: '11px', color: '#94a3b8' }}>{new Date(c.createdAt).toLocaleDateString()}</div>
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
                        {c.status === 'Completed' && <span className="badge badge-success">Completed</span>}
                        {c.status === 'Active' && <span className="badge badge-info">Active</span>}
                        {c.status === 'Awaiting Payment' && <span className="badge badge-warning">Awaiting Payment</span>}
                        {c.status === 'Influencers Assigned' && <span className="badge badge-purple">Influencers Assigned</span>}
                        {!['Completed', 'Active', 'Awaiting Payment', 'Influencers Assigned'].includes(c.status) && (
                          <span className="badge badge-muted">{c.status}</span>
                        )}
                      </td>
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
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
