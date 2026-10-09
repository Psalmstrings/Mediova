import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import DashboardLayout from '../../layouts/DashboardLayout';
import { adminGetDashboard } from '../../services/api';
import { toast } from '../../components/ui/Toast';

export default function AdminDashboard() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({});

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const { data } = await adminGetDashboard();
      setStats(data.stats || {});
    } catch {
      toast.error('Failed to load admin statistics.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <DashboardLayout title="Admin Control Center" role="admin">
        <div style={{ textAlign: 'center', padding: '60px' }}>
          <div className="spinner" style={{ margin: '0 auto 16px' }} />
          <p style={{ color: 'var(--text-muted)' }}>Loading marketplace metrics...</p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout title="Admin Control Center" role="admin">
      <div className="page-header">
        <div>
          <h2 className="page-title">Operational Brokerage Overview</h2>
          <p className="page-subtitle">Central operational control, campaign matching, user verification, and payment auditing.</p>
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <Link to="/admin/campaigns" className="btn btn-primary">
            Review Campaigns
          </Link>
          <Link to="/admin/submissions" className="btn btn-outline">
            Review Proofs
          </Link>
        </div>
      </div>

      {/* Financial Overview Cards */}
      <div className="grid-2" style={{ gap: '20px', marginBottom: '28px' }}>
        <div className="card" style={{ padding: '24px', background: '#0F172A', color: 'white', borderLeft: '4px solid var(--brand-green)' }}>
          <div style={{ fontSize: '12px', color: 'var(--brand-green-light)', fontWeight: '700', letterSpacing: '0.5px' }}>
            TOTAL PLATFORM REVENUE
          </div>
          <div style={{ fontSize: '2.4rem', fontWeight: '900', color: '#FFFFFF', margin: '8px 0' }}>
            ₦{Number(stats.totalRevenue || 0).toLocaleString()}
          </div>
          <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.6)' }}>
            Confirmed advertiser payments verified via bank transfer
          </div>
        </div>

        <div className="card" style={{ padding: '24px', background: '#0F172A', color: 'white', borderLeft: '4px solid var(--brand-yellow)' }}>
          <div style={{ fontSize: '12px', color: 'var(--brand-yellow)', fontWeight: '700', letterSpacing: '0.5px' }}>
            INFLUENCER PAYOUT LIABILITY
          </div>
          <div style={{ fontSize: '2.4rem', fontWeight: '900', color: '#FFFFFF', margin: '8px 0' }}>
            ₦{Number(stats.influencerPayoutLiability || 0).toLocaleString()}
          </div>
          <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.6)' }}>
            Approved earnings pending payout disbursement
          </div>
        </div>
      </div>

      {/* Operational Metrics (No emoji spam) */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-info">
            <div className="stat-label">Total Influencers</div>
            <div className="stat-value">{stats.totalInfluencers || 0}</div>
            <div className="stat-sub">
              <Link to="/admin/influencers?verificationStatus=pending" style={{ color: 'var(--brand-yellow-dark)', fontWeight: '700' }}>
                {stats.pendingInfluencerVerification || 0} pending verification &rarr;
              </Link>
            </div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-info">
            <div className="stat-label">Total Vendors</div>
            <div className="stat-value">{stats.totalVendors || 0}</div>
            <div className="stat-sub">Registered advertisers</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-info">
            <div className="stat-label">Awaiting Payment</div>
            <div className="stat-value" style={{ color: 'var(--status-pending)' }}>{stats.awaitingPayment || 0}</div>
            <div className="stat-sub">
              <Link to="/admin/campaigns?status=Awaiting+Payment" style={{ color: 'var(--brand-green)', fontWeight: '600' }}>
                Verify bank transfers &rarr;
              </Link>
            </div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-info">
            <div className="stat-label">Active Campaigns</div>
            <div className="stat-value" style={{ color: 'var(--brand-green)' }}>{stats.activeCampaigns || 0}</div>
            <div className="stat-sub">Currently running gigs</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-info">
            <div className="stat-label">Pending Proof Reviews</div>
            <div className="stat-value" style={{ color: 'var(--error)' }}>{stats.pendingGigReviews || 0}</div>
            <div className="stat-sub">
              <Link to="/admin/submissions" style={{ color: 'var(--error)', fontWeight: '600' }}>
                Audit screenshots &rarr;
              </Link>
            </div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-info">
            <div className="stat-label">Completed Campaigns</div>
            <div className="stat-value">{stats.completedCampaigns || 0}</div>
            <div className="stat-sub">Concluded successfully</div>
          </div>
        </div>
      </div>

      {/* Broker Action Shortcuts */}
      <div className="card" style={{ marginTop: '28px' }}>
        <div className="card-header">
          <h3 style={{ fontSize: '1.1rem', fontWeight: '700' }}>Operational Broker Shortcuts</h3>
        </div>
        <div className="card-body">
          <div className="grid-3" style={{ gap: '16px' }}>
            <Link to="/admin/campaigns?status=Awaiting+Payment" className="card" style={{ padding: '20px', borderLeft: '3px solid var(--brand-yellow)' }}>
              <div style={{ fontWeight: '700', fontSize: '15px', marginBottom: '4px', color: 'var(--brand-dark)' }}>Confirm Vendor Payments</div>
              <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>Review bank transfers submitted via WhatsApp and mark orders paid.</p>
            </Link>

            <Link to="/admin/campaigns" className="card" style={{ padding: '20px', borderLeft: '3px solid var(--brand-green)' }}>
              <div style={{ fontWeight: '700', fontSize: '15px', marginBottom: '4px', color: 'var(--brand-dark)' }}>Match & Distribute Gigs</div>
              <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>Filter verified influencers by location and assign campaign reach.</p>
            </Link>

            <Link to="/admin/submissions" className="card" style={{ padding: '20px', borderLeft: '3px solid #0284C7' }}>
              <div style={{ fontWeight: '700', fontSize: '15px', marginBottom: '4px', color: 'var(--brand-dark)' }}>Audit WhatsApp Proofs</div>
              <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>Inspect status posts & views count screenshots to release rewards.</p>
            </Link>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
