import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import DashboardLayout from '../../layouts/DashboardLayout';
import { getInfluencerProfile, getMyGigs, getMyEarnings, updateAvailability } from '../../services/api';
import { toast } from '../../components/ui/Toast';

export default function InfluencerDashboard() {
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState(null);
  const [gigs, setGigs] = useState([]);
  const [earnings, setEarnings] = useState({ totalEarned: 0, pendingEarnings: 0, availableBalance: 0, paidEarnings: 0 });

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [pRes, gRes, eRes] = await Promise.all([
        getInfluencerProfile(),
        getMyGigs(),
        getMyEarnings(),
      ]);
      setProfile(pRes.data.profile);
      setGigs(gRes.data.gigs || []);
      setEarnings(eRes.data.summary || {});
    } catch (err) {
      toast.error('Failed to load dashboard data.');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleAvailability = async () => {
    try {
      const { data } = await updateAvailability({ availability: !profile.availability });
      setProfile({ ...profile, availability: data.availability });
      toast.success(data.message);
    } catch (err) {
      toast.error('Could not update availability.');
    }
  };

  if (loading) {
    return (
      <DashboardLayout title="Influencer Dashboard" role="influencer">
        <div style={{ textAlign: 'center', padding: '60px' }}>
          <div className="spinner" style={{ margin: '0 auto 16px' }} />
          <p style={{ color: '#64748b' }}>Loading your dashboard...</p>
        </div>
      </DashboardLayout>
    );
  }

  const newGigs = gigs.filter((g) => g.status === 'assigned');
  const activeGigs = gigs.filter((g) => ['accepted', 'in_progress'].includes(g.status));
  const completedGigs = gigs.filter((g) => g.status === 'approved');
  const pendingReviewGigs = gigs.filter((g) => g.status === 'submitted');

  const isVerified = profile?.verificationStatus === 'verified';

  return (
    <DashboardLayout title="Influencer Dashboard" role="influencer">
      {/* Verification Notice */}
      {!isVerified && (
        <div className="alert alert-warning" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <strong>Status: Reach Verification {profile?.verificationStatus === 'rejected' ? 'Rejected' : 'Pending'}</strong>
            <p style={{ margin: 0, fontSize: '13px' }}>
              {profile?.verificationStatus === 'rejected'
                ? 'Your reach screenshots did not meet requirements. Please re-upload updated proof.'
                : 'Upload proof screenshots of your WhatsApp Status views so our broker team can verify your reach and assign paying gigs.'}
            </p>
          </div>
          <Link to="/influencer/profile" className="btn btn-sm btn-warning">
            Upload Proof
          </Link>
        </div>
      )}

      {/* Top Banner with Availability Toggle */}
      <div className="card" style={{ padding: '24px', marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h2 style={{ fontSize: '1.4rem', margin: 0 }}>
            Hello, {profile?.userId?.name}! 
          </h2>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginTop: '6px', fontSize: '13px', color: '#64748b' }}>
            <span> {profile?.area}, {profile?.state}</span>
            <span>•</span>
            <span>
              {isVerified ? (
                <span className="badge badge-success">✓ Verified Reach: {Number(profile?.verifiedViews).toLocaleString()} views</span>
              ) : (
                <span className="badge badge-warning">Unverified: {Number(profile?.averageViews).toLocaleString()} submitted views</span>
              )}
            </span>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span style={{ fontSize: '13px', fontWeight: '600', color: profile?.availability ? '#059669' : '#dc2626' }}>
            {profile?.availability ? '● Available for Gigs' : '○ Currently Unavailable'}
          </span>
          <button
            onClick={handleToggleAvailability}
            className={`btn btn-sm ${profile?.availability ? 'btn-ghost' : 'btn-primary'}`}
          >
            {profile?.availability ? 'Set Unavailable' : 'Set Available'}
          </button>
        </div>
      </div>

      {/* Dashboard Stats Cards */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-info">
            <div className="stat-label">Available Gigs</div>
            <div className="stat-value" style={{ color: 'var(--brand-yellow-dark)' }}>{newGigs.length}</div>
            <div className="stat-sub">Ready to accept</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-info">
            <div className="stat-label">Active Gigs</div>
            <div className="stat-value" style={{ color: 'var(--brand-green)' }}>{activeGigs.length}</div>
            <div className="stat-sub">Posting in progress</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-info">
            <div className="stat-label">Pending Review</div>
            <div className="stat-value" style={{ color: 'var(--warning)' }}>{pendingReviewGigs.length}</div>
            <div className="stat-sub">Proof submitted</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-info">
            <div className="stat-label">Available Balance</div>
            <div className="stat-value">₦{Number(earnings.availableBalance).toLocaleString()}</div>
            <div className="stat-sub">Approved for withdrawal</div>
          </div>
        </div>
      </div>

      {/* Secondary Stats */}
      <div className="grid-3" style={{ gap: '16px', marginBottom: '32px' }}>
        <div className="card" style={{ padding: '20px', textAlign: 'center', borderTop: '3px solid var(--brand-green)' }}>
          <div style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>Total Earned to Date</div>
          <div style={{ fontSize: '1.5rem', fontWeight: '800', color: 'var(--brand-green)', marginTop: '4px' }}>
            ₦{Number(earnings.totalEarned).toLocaleString()}
          </div>
        </div>
        <div className="card" style={{ padding: '20px', textAlign: 'center', borderTop: '3px solid var(--brand-yellow)' }}>
          <div style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>Pending Earnings</div>
          <div style={{ fontSize: '1.5rem', fontWeight: '800', color: 'var(--brand-yellow-dark)', marginTop: '4px' }}>
            ₦{Number(earnings.pendingEarnings).toLocaleString()}
          </div>
        </div>
        <div className="card" style={{ padding: '20px', textAlign: 'center', borderTop: '3px solid #0284C7' }}>
          <div style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>Completed Gigs</div>
          <div style={{ fontSize: '1.5rem', fontWeight: '800', color: '#0284C7', marginTop: '4px' }}>
            {completedGigs.length}
          </div>
        </div>
      </div>

      {/* New Assigned Gigs Section */}
      <div className="card" style={{ marginBottom: '32px' }}>
        <div className="card-header">
          <h3 style={{ fontSize: '1.15rem' }}> New Gigs Assigned to You</h3>
          <Link to="/influencer/gigs" className="btn btn-sm btn-ghost">View All ({gigs.length})</Link>
        </div>
        <div className="card-body">
          {newGigs.length === 0 ? (
            <div className="empty-state" style={{ padding: '30px 20px' }}>
              
              <h3>No new gigs assigned right now</h3>
              <p>Keep your status available and verified. You'll receive instant alerts when a campaign matches your location!</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {newGigs.map((gig) => (
                <div
                  key={gig._id}
                  style={{
                    border: '1px solid #e2e8f0',
                    borderRadius: '10px',
                    padding: '16px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    flexWrap: 'wrap',
                    gap: '12px',
                    background: '#f8fafc',
                  }}
                >
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span className="badge badge-info">#{gig.gigNumber}</span>
                      <strong style={{ fontSize: '15px' }}>{gig.campaignId?.title}</strong>
                      <span className="badge badge-muted">{gig.campaignId?.category}</span>
                    </div>
                    <div style={{ fontSize: '13px', color: '#64748b', marginTop: '4px' }}>
                       Target: {gig.campaignId?.targetLocation?.area}, {gig.campaignId?.targetLocation?.state} • Target Views: {Number(gig.assignedViews).toLocaleString()}
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: '12px', color: '#64748b' }}>Reward</div>
                      <div style={{ fontSize: '18px', fontWeight: '800', color: '#059669' }}>
                        ₦{Number(gig.reward).toLocaleString()}
                      </div>
                    </div>
                    <Link to={`/influencer/gigs/${gig._id}`} className="btn btn-sm btn-primary">
                      Review & Accept →
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Active Posting Section */}
      <div className="card">
        <div className="card-header">
          <h3 style={{ fontSize: '1.15rem' }}> Active Campaigns (Submit Proof)</h3>
        </div>
        <div className="card-body">
          {activeGigs.length === 0 ? (
            <div style={{ textAlign: 'center', color: '#94a3b8', padding: '24px' }}>
              No active gigs in progress.
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {activeGigs.map((gig) => (
                <div
                  key={gig._id}
                  style={{
                    border: '1px solid #a7f3d0',
                    background: '#ecfdf5',
                    borderRadius: '10px',
                    padding: '16px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    flexWrap: 'wrap',
                    gap: '12px',
                  }}
                >
                  <div>
                    <div style={{ fontWeight: '700', color: '#064e3b' }}>{gig.campaignId?.title}</div>
                    <div style={{ fontSize: '13px', color: '#047857' }}>
                      Status: Accepted • Required Status Views: {Number(gig.assignedViews).toLocaleString()}
                    </div>
                  </div>
                  <Link to={`/influencer/gigs/${gig._id}`} className="btn btn-sm btn-success">
                    Submit Screenshots & Proof →
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
