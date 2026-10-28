import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import DashboardLayout from '../../layouts/DashboardLayout';
import { getInfluencerProfile, getMyGigs, getMyEarnings, updateAvailability, getVerificationStatus } from '../../services/api';
import { toast } from '../../components/ui/Toast';
import InfluencerVerificationModal from '../../components/influencer/InfluencerVerificationModal';

export default function InfluencerDashboard() {
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState(null);
  const [verificationSubmission, setVerificationSubmission] = useState(null);
  const [verificationStatus, setVerificationStatus] = useState('pending');
  const [isVerificationModalOpen, setIsVerificationModalOpen] = useState(false);
  const [submissionSuccessBanner, setSubmissionSuccessBanner] = useState(false);
  const [gigs, setGigs] = useState([]);
  const [earnings, setEarnings] = useState({ totalEarned: 0, pendingEarnings: 0, availableBalance: 0, paidEarnings: 0 });

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [pRes, gRes, eRes, vRes] = await Promise.all([
        getInfluencerProfile(),
        getMyGigs(),
        getMyEarnings(),
        getVerificationStatus().catch(() => ({ data: {} })),
      ]);
      setProfile(pRes.data.profile);
      setGigs(gRes.data.gigs || []);
      setEarnings(eRes.data.summary || {});
      setVerificationSubmission(vRes.data.submission || pRes.data.verificationSubmission || null);
      setVerificationStatus(vRes.data.status || pRes.data.profile?.verificationStatus || 'pending');
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

  const handleVerificationSuccess = (newSubmission) => {
    setVerificationSubmission(newSubmission);
    setVerificationStatus('under_review');
    setSubmissionSuccessBanner(true);
    setIsVerificationModalOpen(false);
    fetchDashboardData();
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

  const isVerified = verificationStatus === 'verified' || profile?.verificationStatus === 'verified';
  const isUnderReview = verificationStatus === 'under_review' || (!isVerified && verificationSubmission?.status === 'under_review');
  const isRejected = verificationStatus === 'rejected' || profile?.verificationStatus === 'rejected';

  return (
    <DashboardLayout title="Influencer Dashboard" role="influencer">
      {/* Verification Submission Success Banner */}
      {submissionSuccessBanner && (
        <div
          style={{
            background: '#ecfdf5',
            border: '1px solid #a7f3d0',
            borderRadius: '12px',
            padding: '16px 20px',
            marginBottom: '20px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: '12px',
            boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span style={{ fontSize: '26px' }}>🎉</span>
            <div>
              <strong style={{ color: '#065f46', fontSize: '15px', display: 'block' }}>
                Verification Video Submitted Successfully!
              </strong>
              <div style={{ color: '#047857', fontSize: '13px', marginTop: '2px' }}>
                Your video has been uploaded and queued. Your Verification Status is now <strong>Pending Approval</strong> by our administrative brokerage team.
              </div>
            </div>
          </div>
          <button
            type="button"
            className="btn btn-sm btn-ghost"
            style={{ color: '#065f46', fontWeight: 'bold', fontSize: '16px', padding: '4px 8px' }}
            onClick={() => setSubmissionSuccessBanner(false)}
          >
            ✕
          </button>
        </div>
      )}

      {/* 8.1 Mandatory Influencer Verification Banner */}
      {!isVerified && (
        <div
          style={{
            background: isRejected ? '#fef2f2' : isUnderReview ? '#eff6ff' : '#fffbeb',
            border: isRejected ? '1px solid #fecaca' : isUnderReview ? '1px solid #bfdbfe' : '1px solid #fef3c7',
            borderRadius: '12px',
            padding: '16px 20px',
            marginBottom: '20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '14px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', flex: 1, minWidth: '240px' }}>
            <span style={{ fontSize: '24px', flexShrink: 0, marginTop: '2px' }}>
              {isRejected ? '⚠️' : isUnderReview ? '⏳' : '📹'}
            </span>
            <div style={{ minWidth: 0 }}>
              <h4 style={{ margin: '0 0 4px', fontSize: '15px', color: isRejected ? '#991b1b' : isUnderReview ? '#1e40af' : '#92400e', fontWeight: '700', lineHeight: 1.3 }}>
                {isRejected
                  ? 'Account Verification Required: Correction Needed'
                  : isUnderReview
                  ? 'Verification Status: Pending Approval'
                  : 'Your account is pending verification. Complete the verification process to become eligible for gigs.'}
              </h4>
              <p style={{ margin: 0, fontSize: '13px', color: isRejected ? '#b91c1c' : isUnderReview ? '#2563eb' : '#b45309', lineHeight: '1.5', overflowWrap: 'break-word' }}>
                {isRejected
                  ? `Your verification submission was not approved: ${verificationSubmission?.rejectionReason || 'Video did not meet criteria'}. Please record and submit a corrected video.`
                  : isUnderReview
                  ? 'Your verification video has been submitted and is currently pending administrator review. Once verified, you will be automatically eligible for paid advertising gigs.'
                  : 'Submit a quick screen recording of your active WhatsApp status view metrics. Only approved, verified accounts are eligible for paid gig assignments.'}
              </p>
            </div>
          </div>

          <button
            type="button"
            className="btn btn-primary"
            onClick={() => setIsVerificationModalOpen(true)}
            style={{
              padding: '10px 18px',
              fontSize: '13px',
              fontWeight: '600',
              borderRadius: '8px',
              background: isRejected ? '#dc2626' : isUnderReview ? '#2563eb' : '#059669',
              border: 'none',
              color: '#ffffff',
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              flexShrink: 0,
            }}
          >
            {isRejected ? 'Resubmit Verification' : isUnderReview ? 'View Verification Details' : 'Complete Verification'}
          </button>
        </div>
      )}

      {/* Top Banner with Profile & Availability */}
      <div className="card" style={{ padding: '20px', marginBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <div style={{ minWidth: '220px', flex: 1 }}>
          <h2 style={{ fontSize: 'clamp(1.15rem, 3.5vw, 1.4rem)', margin: 0, color: '#0f172a', fontWeight: '700', lineHeight: 1.3 }}>
            Hello, {profile?.userId?.name}! 
          </h2>
          <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: '8px 12px', marginTop: '8px', fontSize: '13px', color: '#64748b' }}>
            <span>📍 {profile?.area || 'General'}, {profile?.state || profile?.userId?.location?.region || 'Global'} ({profile?.userId?.country || 'Nigeria'})</span>
            <span>
              {isVerified ? (
                <span className="badge badge-success" style={{ padding: '3px 8px', fontSize: '11.5px' }}>
                  ✓ Verified ({Number(profile?.verifiedViews || 0).toLocaleString()} views)
                </span>
              ) : isUnderReview ? (
                <span className="badge badge-warning" style={{ padding: '3px 8px', fontSize: '11.5px' }}>
                  ⏳ Pending Approval
                </span>
              ) : (
                <span className="badge badge-secondary" style={{ padding: '3px 8px', fontSize: '11.5px' }}>
                  Unverified (Pending Video)
                </span>
              )}
            </span>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
          <span style={{ fontSize: '12.5px', fontWeight: '600', color: profile?.availability ? '#059669' : '#dc2626', whiteSpace: 'nowrap' }}>
            {profile?.availability ? '● Available' : '○ Unavailable'}
          </span>
          <button
            type="button"
            onClick={handleToggleAvailability}
            className={`btn btn-sm ${profile?.availability ? 'btn-ghost' : 'btn-primary'}`}
            style={{ borderRadius: '6px', fontSize: '12px', padding: '6px 12px', whiteSpace: 'nowrap' }}
          >
            {profile?.availability ? 'Set Unavailable' : 'Set Available'}
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="stats-grid" style={{ marginBottom: '28px' }}>
        <div className="stat-card">
          <div className="stat-info">
            <div className="stat-label">Available Gigs</div>
            <div className="stat-value" style={{ color: '#059669' }}>{newGigs.length}</div>
            <div className="stat-sub">Ready to accept</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-info">
            <div className="stat-label">Active Gigs</div>
            <div className="stat-value" style={{ color: '#2563eb' }}>{activeGigs.length}</div>
            <div className="stat-sub">In progress</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-info">
            <div className="stat-label">Under Review</div>
            <div className="stat-value" style={{ color: '#d97706' }}>{pendingReviewGigs.length}</div>
            <div className="stat-sub">Evidence submitted</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-info">
            <div className="stat-label">Completed Gigs</div>
            <div className="stat-value" style={{ color: '#16a34a' }}>{completedGigs.length}</div>
            <div className="stat-sub">Paid out</div>
          </div>
        </div>
      </div>

      {/* Active/New Gigs Section */}
      <div className="card" style={{ padding: '24px', marginBottom: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h3 style={{ margin: 0, fontSize: '1.15rem', color: '#0f172a', fontWeight: '700' }}>
            Recent Assigned Gigs
          </h3>
          <Link to="/influencer/gigs" style={{ color: '#059669', fontSize: '13px', fontWeight: '600' }}>
            View All Gigs &rarr;
          </Link>
        </div>

        {gigs.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '36px 16px', color: '#64748b' }}>
            <div style={{ fontSize: '36px', marginBottom: '8px' }}>📋</div>
            <p style={{ margin: 0, fontSize: '14px' }}>No gigs assigned yet.</p>
            {!isVerified && (
              <p style={{ margin: '6px 0 0', fontSize: '13px', color: '#b45309' }}>
                Complete your account verification video to become eligible for campaign assignments.
              </p>
            )}
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {gigs.slice(0, 5).map((gig) => (
              <div
                key={gig._id}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '14px 18px',
                  borderRadius: '10px',
                  border: '1px solid #f1f5f9',
                  background: '#f8fafc',
                  flexWrap: 'wrap',
                  gap: '12px',
                }}
              >
                <div>
                  <div style={{ fontWeight: '600', fontSize: '14px', color: '#0f172a' }}>
                    {gig.campaignId?.title || `Gig #${gig.gigNumber}`}
                  </div>
                  <div style={{ fontSize: '12px', color: '#64748b', marginTop: '2px' }}>
                    Target: {Number(gig.assignedViews).toLocaleString()} WhatsApp Views &bull; Reward: ₦{Number(gig.reward).toLocaleString()}
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <span className={`badge badge-${gig.status === 'approved' ? 'success' : gig.status === 'submitted' ? 'warning' : 'info'}`}>
                    {gig.status}
                  </span>
                  <Link
                    to={`/influencer/gigs/${gig._id}`}
                    className="btn btn-sm btn-ghost"
                    style={{ fontSize: '12px', padding: '6px 12px' }}
                  >
                    View Details
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Verification Modal Component */}
      <InfluencerVerificationModal
        isOpen={isVerificationModalOpen}
        onClose={() => setIsVerificationModalOpen(false)}
        verificationSubmission={verificationSubmission}
        verificationStatus={verificationStatus}
        onSuccess={handleVerificationSuccess}
      />
    </DashboardLayout>
  );
}
