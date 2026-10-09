import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import DashboardLayout from '../../layouts/DashboardLayout';
import { adminGetVendorDetail } from '../../services/api';
import { toast } from '../../components/ui/Toast';

export default function VendorDetail() {
  const { id } = useParams();
  const [vendor, setVendor] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchVendor(); }, [id]);

  const fetchVendor = async () => {
    try {
      const { data } = await adminGetVendorDetail(id);
      setVendor(data.vendor);
    } catch {
      toast.error('Failed to load vendor.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <DashboardLayout title="Vendor Detail" role="admin">
        <div style={{ textAlign: 'center', padding: '60px' }}>
          <div className="spinner" style={{ margin: '0 auto 16px' }} />
        </div>
      </DashboardLayout>
    );
  }

  if (!vendor) {
    return (
      <DashboardLayout title="Vendor Detail" role="admin">
        <div className="empty-state">
          
          <div className="empty-title">Vendor not found</div>
          <Link to="/admin/vendors" className="btn btn-primary" style={{ marginTop: '16px' }}>Back to Vendors</Link>
        </div>
      </DashboardLayout>
    );
  }

  const user = vendor.user || vendor;
  const profile = vendor.profile || vendor;

  return (
    <DashboardLayout title="Vendor Detail" role="admin">
      <div className="page-header">
        <div>
          <Link to="/admin/vendors" style={{ fontSize: '14px', color: 'var(--primary)', marginBottom: '8px', display: 'block' }}>
            ← Back to Vendors
          </Link>
          <h2 className="page-title">{profile.businessName || user.name}</h2>
          <p className="page-subtitle">Vendor account details and campaign history.</p>
        </div>
      </div>

      <div className="grid-2" style={{ gap: '24px' }}>
        {/* Account Info */}
        <div className="card">
          <div className="card-header"><h3>Account Information</h3></div>
          <div className="card-body" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {profile.logo && (
              <img src={profile.logo} alt="Logo" style={{ width: '80px', height: '80px', borderRadius: 'var(--radius)', objectFit: 'cover' }} />
            )}
            <div><span style={{ color: 'var(--text-muted)', fontSize: '13px' }}>Name</span><br /><strong>{user.name}</strong></div>
            <div><span style={{ color: 'var(--text-muted)', fontSize: '13px' }}>Email</span><br /><strong>{user.email}</strong></div>
            <div><span style={{ color: 'var(--text-muted)', fontSize: '13px' }}>Business</span><br /><strong>{profile.businessName || '—'}</strong></div>
            <div><span style={{ color: 'var(--text-muted)', fontSize: '13px' }}>Phone</span><br /><strong>{user.phone || '—'}</strong></div>
            <div><span style={{ color: 'var(--text-muted)', fontSize: '13px' }}>Location</span><br /><strong>{profile.location || '—'}</strong></div>
            <div>
              <span style={{ color: 'var(--text-muted)', fontSize: '13px' }}>Status</span><br />
              <span style={{
                padding: '2px 10px', borderRadius: 'var(--radius-full)',
                fontSize: '12px', fontWeight: '600',
                color: user.isActive ? '#059669' : '#dc2626',
                background: user.isActive ? '#ecfdf5' : '#fef2f2',
              }}>
                {user.isActive ? 'Active' : 'Inactive'}
              </span>
            </div>
            <div>
              <span style={{ color: 'var(--text-muted)', fontSize: '13px' }}>Joined</span><br />
              <strong>{new Date(user.createdAt).toLocaleDateString('en-NG', { day: 'numeric', month: 'long', year: 'numeric' })}</strong>
            </div>
          </div>
        </div>

        {/* Campaigns */}
        <div className="card">
          <div className="card-header"><h3>Campaign Summary</h3></div>
          <div className="card-body">
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '16px', background: 'var(--surface2)', borderRadius: 'var(--radius)' }}>
                <span>Total Campaigns</span>
                <strong>{vendor.totalCampaigns || 0}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '16px', background: 'var(--surface2)', borderRadius: 'var(--radius)' }}>
                <span>Active Campaigns</span>
                <strong style={{ color: '#059669' }}>{vendor.activeCampaigns || 0}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '16px', background: 'var(--surface2)', borderRadius: 'var(--radius)' }}>
                <span>Total Spent</span>
                <strong>₦{Number(vendor.totalSpent || 0).toLocaleString()}</strong>
              </div>
            </div>
            <Link to={`/admin/campaigns?vendor=${id}`} className="btn btn-outline btn-sm" style={{ marginTop: '16px' }}>
              View All Campaigns
            </Link>
          </div>
        </div>
      </div>

      {profile.businessDescription && (
        <div className="card" style={{ marginTop: '24px' }}>
          <div className="card-header"><h3>About Business</h3></div>
          <div className="card-body">
            <p style={{ color: 'var(--text-secondary)' }}>{profile.businessDescription}</p>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
