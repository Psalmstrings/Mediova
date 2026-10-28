import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import DashboardLayout from '../../layouts/DashboardLayout';
import {
  adminGetInfluencers,
  adminVerifyInfluencer,
  adminGetVerifications,
  adminReviewVerification,
} from '../../services/api';
import { resolveMediaUrl, downloadMedia } from '../../utils/media';
import { toast } from '../../components/ui/Toast';

export default function AdminInfluencers() {
  const [searchParams] = useSearchParams();
  const initVerification = searchParams.get('verificationStatus') || '';

  const [activeTab, setActiveTab] = useState('directory'); // 'directory' | 'verifications'
  const [loading, setLoading] = useState(true);
  const [influencers, setInfluencers] = useState([]);
  const [total, setTotal] = useState(0);

  // Filters
  const [search, setSearch] = useState('');
  const [countryFilter, setCountryFilter] = useState('');
  const [verificationFilter, setVerificationFilter] = useState(initVerification);
  const [minViews, setMinViews] = useState('');

  // Verifications Queue State
  const [verificationsLoading, setVerificationsLoading] = useState(false);
  const [verificationSubmissions, setVerificationSubmissions] = useState([]);
  const [verificationsTotal, setVerificationsTotal] = useState(0);

  // Quick Verify Influencer Modal
  const [verifyModal, setVerifyModal] = useState({ open: false, influencer: null, views: '', status: 'verified', notes: '' });

  // Review Video Submission Modal
  const [reviewVideoModal, setReviewVideoModal] = useState({
    open: false,
    submission: null,
    views: '',
    decision: 'verified',
    rejectionReason: '',
    notes: '',
  });

  useEffect(() => {
    if (activeTab === 'directory') {
      fetchInfluencers();
    } else {
      fetchVerifications();
    }
  }, [activeTab, countryFilter, verificationFilter]);

  const fetchInfluencers = async () => {
    try {
      setLoading(true);
      const params = {
        search: search || undefined,
        country: countryFilter || undefined,
        verificationStatus: verificationFilter || undefined,
        minViews: minViews || undefined,
      };
      const { data } = await adminGetInfluencers(params);
      setInfluencers(data.influencers || []);
      setTotal(data.total || 0);
    } catch (err) {
      toast.error('Failed to load influencers.');
    } finally {
      setLoading(false);
    }
  };

  const fetchVerifications = async () => {
    try {
      setVerificationsLoading(true);
      const { data } = await adminGetVerifications({
        status: verificationFilter || 'pending',
      });
      setVerificationSubmissions(data.submissions || []);
      setVerificationsTotal(data.total || 0);
    } catch (err) {
      toast.error('Failed to load verification submissions queue.');
    } finally {
      setVerificationsLoading(false);
    }
  };

  const handleOpenVerify = (inf) => {
    setVerifyModal({
      open: true,
      influencer: inf,
      views: inf.verifiedViews || inf.averageViews || 1000,
      status: 'verified',
      notes: '',
    });
  };

  const handleVerifySubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await adminVerifyInfluencer(verifyModal.influencer.userId._id, {
        verificationStatus: verifyModal.status,
        verifiedViews: Number(verifyModal.views),
        adminNotes: verifyModal.notes,
      });
      toast.success(data.message || 'Influencer verification updated!');
      setVerifyModal({ open: false, influencer: null, views: '', status: 'verified', notes: '' });
      fetchInfluencers();
    } catch (err) {
      toast.error('Failed to update verification.');
    }
  };

  const handleOpenReviewVideo = (sub) => {
    setReviewVideoModal({
      open: true,
      submission: sub,
      views: sub.reportedViews || 1000,
      decision: 'verified',
      rejectionReason: '',
      notes: '',
    });
  };

  const handleReviewVideoSubmit = async (e) => {
    e.preventDefault();
    if (reviewVideoModal.decision === 'rejected' && !reviewVideoModal.rejectionReason.trim()) {
      toast.warning('Please specify a rejection reason for the influencer.');
      return;
    }

    try {
      const payload = {
        decision: reviewVideoModal.decision,
        verifiedViews: Number(reviewVideoModal.views),
        adminNotes: reviewVideoModal.notes,
        rejectionReason: reviewVideoModal.decision === 'rejected' ? reviewVideoModal.rejectionReason : undefined,
      };

      const { data } = await adminReviewVerification(reviewVideoModal.submission._id, payload);
      toast.success(data.message || `Submission marked as ${reviewVideoModal.decision}!`);
      setReviewVideoModal({
        open: false,
        submission: null,
        views: '',
        decision: 'verified',
        rejectionReason: '',
        notes: '',
      });
      fetchVerifications();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to submit verification review.');
    }
  };

  return (
    <DashboardLayout title="Influencer Directory" role="admin">
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h2 className="page-title">Global Influencer Network</h2>
          <p className="page-subtitle">Inspect reach metrics, audit video status proofs, and verify view tiers.</p>
        </div>

        {/* Tab Switcher */}
        <div style={{ display: 'flex', background: '#f1f5f9', padding: '4px', borderRadius: '8px', gap: '4px' }}>
          <button
            type="button"
            onClick={() => setActiveTab('directory')}
            style={{
              padding: '8px 18px',
              border: 'none',
              borderRadius: '6px',
              fontWeight: '600',
              fontSize: '13px',
              cursor: 'pointer',
              background: activeTab === 'directory' ? '#059669' : 'transparent',
              color: activeTab === 'directory' ? 'white' : '#475569',
              transition: 'all 0.2s',
            }}
          >
            👥 Influencer Directory ({total})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('verifications')}
            style={{
              padding: '8px 18px',
              border: 'none',
              borderRadius: '6px',
              fontWeight: '600',
              fontSize: '13px',
              cursor: 'pointer',
              background: activeTab === 'verifications' ? '#059669' : 'transparent',
              color: activeTab === 'verifications' ? 'white' : '#475569',
              transition: 'all 0.2s',
            }}
          >
            📹 Video Verification Queue {verificationsTotal > 0 ? `(${verificationsTotal})` : ''}
          </button>
        </div>
      </div>

      {activeTab === 'directory' && (
        <>
          {/* Filter and Search Bar */}
          <div className="card" style={{ padding: '16px', marginBottom: '20px' }}>
            <form
              onSubmit={(e) => { e.preventDefault(); fetchInfluencers(); }}
              style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'center' }}
            >
              <input
                type="text"
                className="form-control"
                placeholder="Search by name, email, or WhatsApp..."
                style={{ flex: 1, minWidth: '200px' }}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />

              <input
                type="text"
                className="form-control"
                placeholder="Filter by country or region..."
                style={{ width: '190px' }}
                value={countryFilter}
                onChange={(e) => setCountryFilter(e.target.value)}
              />

              <select
                className="form-control"
                style={{ width: '180px' }}
                value={verificationFilter}
                onChange={(e) => setVerificationFilter(e.target.value)}
              >
                <option value="">All Verification</option>
                <option value="pending">Pending Verification</option>
                <option value="verified">Verified Only</option>
                <option value="rejected">Rejected Only</option>
              </select>

              <input
                type="number"
                className="form-control"
                placeholder="Min views..."
                style={{ width: '120px' }}
                value={minViews}
                onChange={(e) => setMinViews(e.target.value)}
              />

              <button type="submit" className="btn btn-primary">Filter</button>
            </form>
          </div>

          <div className="card">
            <div className="card-body" style={{ padding: 0 }}>
              {loading ? (
                <div style={{ textAlign: 'center', padding: '60px' }}>
                  <div className="spinner" style={{ margin: '0 auto 16px' }} />
                  <p style={{ color: '#64748b' }}>Loading influencer directory...</p>
                </div>
              ) : influencers.length === 0 ? (
                <div className="empty-state">
                  <h3>No influencers found</h3>
                  <p>Adjust your search and filter parameters.</p>
                </div>
              ) : (
                <div className="table-wrapper" style={{ border: 'none', borderRadius: 0 }}>
                  <table className="data-table">
                    <thead>
                      <tr>
                        <th>Influencer</th>
                        <th>Country & Location</th>
                        <th>WhatsApp Views</th>
                        <th>Status</th>
                        <th>Reliability</th>
                        <th>Completed</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {influencers.map((inf) => (
                        <tr key={inf._id}>
                          <td>
                            <strong>{inf.userId?.name}</strong>
                            <div style={{ fontSize: '12px', color: '#64748b' }}>{inf.userId?.email}</div>
                            <div style={{ fontSize: '11px', color: '#059669', fontWeight: '600' }}>
                              WA: {inf.whatsappNumber || inf.userId?.whatsappNumber || 'N/A'}
                            </div>
                          </td>
                          <td>
                            <strong>{inf.userId?.country || 'Global'}</strong>
                            <div style={{ fontSize: '12px', color: '#64748b' }}>
                              {inf.state ? `${inf.state}, ` : ''}{inf.area || inf.city || inf.lga || ''}
                            </div>
                          </td>
                          <td>
                            <div style={{ fontSize: '15px', fontWeight: '800', color: inf.verifiedViews > 0 ? '#059669' : '#d97706' }}>
                              {Number(inf.verifiedViews || inf.averageViews).toLocaleString()} views
                            </div>
                            <div style={{ fontSize: '11px', color: '#94a3b8' }}>
                              Claimed: {Number(inf.averageViews).toLocaleString()}
                            </div>
                          </td>
                          <td>
                            {inf.verificationStatus === 'verified' && <span className="badge badge-success">✓ Verified</span>}
                            {inf.verificationStatus === 'pending' && <span className="badge badge-warning">⏳ Pending</span>}
                            {inf.verificationStatus === 'rejected' && <span className="badge badge-error">Rejected</span>}
                            {inf.latestVerification?.videoUrl && (
                              <div style={{ marginTop: '4px' }}>
                                <span className="badge badge-info" style={{ fontSize: '10px', padding: '2px 6px' }}>
                                  📹 Video Attached
                                </span>
                              </div>
                            )}
                            <div style={{ marginTop: '4px' }}>
                              {inf.availability ? (
                                <span style={{ fontSize: '11px', color: '#059669' }}>● Available</span>
                              ) : (
                                <span style={{ fontSize: '11px', color: '#94a3b8' }}>○ Unavailable</span>
                              )}
                            </div>
                          </td>
                          <td>
                            <strong>{inf.reliabilityScore || 100}%</strong>
                          </td>
                          <td>
                            {inf.completedGigs || 0} gigs
                          </td>
                          <td>
                            <div style={{ display: 'flex', gap: '6px' }}>
                              <button
                                className="btn btn-sm btn-primary"
                                onClick={() => handleOpenVerify(inf)}
                              >
                                Verify / Adjust
                              </button>
                              <Link
                                to={`/admin/influencers/${inf.userId?._id}`}
                                className="btn btn-sm btn-ghost"
                              >
                                Profile →
                              </Link>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </>
      )}

      {activeTab === 'verifications' && (
        <div className="card">
          <div className="card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h3 style={{ fontSize: '1.2rem', margin: 0 }}>📹 Video Verification Review Queue</h3>
              <p style={{ margin: '4px 0 0', fontSize: '12px', color: '#64748b' }}>
                Review one-take screen recording videos submitted by influencers to verify authentic WhatsApp view counts.
              </p>
            </div>
            <select
              className="form-control"
              style={{ width: '160px' }}
              value={verificationFilter}
              onChange={(e) => setVerificationFilter(e.target.value)}
            >
              <option value="pending">Pending Only</option>
              <option value="all">All Submissions</option>
              <option value="verified">Verified Only</option>
              <option value="rejected">Rejected Only</option>
            </select>
          </div>

          <div className="card-body">
            {verificationsLoading ? (
              <div style={{ textAlign: 'center', padding: '60px' }}>
                <div className="spinner" style={{ margin: '0 auto 16px' }} />
                <p style={{ color: '#64748b' }}>Loading verification queue...</p>
              </div>
            ) : verificationSubmissions.length === 0 ? (
              <div className="empty-state" style={{ padding: '40px' }}>
                <h3>No video verifications found</h3>
                <p>There are currently no verification submissions matching this filter.</p>
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '20px' }}>
                {verificationSubmissions.map((sub) => (
                  <div
                    key={sub._id}
                    style={{
                      border: '1px solid #e2e8f0',
                      borderRadius: '10px',
                      overflow: 'hidden',
                      background: 'white',
                      display: 'flex',
                      flexDirection: 'column',
                    }}
                  >
                    {/* Video Player & Download */}
                    <div style={{ background: '#0f172a', position: 'relative' }}>
                      <video
                        src={resolveMediaUrl(sub.videoUrl)}
                        controls
                        style={{ width: '100%', height: '220px', objectFit: 'contain' }}
                      />
                      <div style={{ padding: '6px 10px', background: '#1e293b', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <button
                          type="button"
                          onClick={() => downloadMedia(sub.videoUrl, `verification-${sub.influencerId?.name || 'influencer'}.mp4`)}
                          className="btn btn-sm"
                          style={{ background: '#059669', color: '#fff', fontSize: '11px', padding: '3px 8px' }}
                        >
                          ⬇ Download Video
                        </button>
                        <a
                          href={resolveMediaUrl(sub.videoUrl)}
                          target="_blank"
                          rel="noreferrer"
                          style={{ color: '#38bdf8', fontSize: '11px', textDecoration: 'none' }}
                        >
                          Open in New Tab ↗
                        </a>
                      </div>
                    </div>

                    <div style={{ padding: '16px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                        <div>
                          <strong style={{ fontSize: '15px' }}>{sub.influencerId?.name}</strong>
                          <div style={{ fontSize: '12px', color: '#64748b' }}>
                            {sub.influencerId?.country || 'Global'} • WA: {sub.influencerId?.whatsappNumber || 'N/A'}
                          </div>
                        </div>
                        <span className={`badge ${sub.status === 'verified' ? 'badge-success' : sub.status === 'rejected' ? 'badge-error' : 'badge-warning'}`}>
                          {sub.status.toUpperCase()}
                        </span>
                      </div>

                      <div style={{ background: '#f8fafc', padding: '10px 14px', borderRadius: '8px', fontSize: '13px', margin: '8px 0 14px', display: 'flex', justifyContent: 'space-between' }}>
                        <span>Reported Views: <strong>{Number(sub.reportedViews || 0).toLocaleString()}</strong></span>
                        <span>Date: <strong>{new Date(sub.createdAt).toLocaleDateString()}</strong></span>
                      </div>

                      {sub.status === 'pending' ? (
                        <div style={{ marginTop: 'auto', display: 'flex', gap: '8px' }}>
                          <button
                            type="button"
                            onClick={() => handleOpenReviewVideo(sub)}
                            className="btn btn-primary btn-block"
                          >
                            Review Video Proof →
                          </button>
                        </div>
                      ) : (
                        <div style={{ marginTop: 'auto', fontSize: '12px', color: '#64748b' }}>
                          Reviewed by {sub.reviewedBy?.name || 'Admin'} on {new Date(sub.reviewedAt).toLocaleDateString()}
                          {sub.verifiedViews && <div>Audited Views: <strong>{Number(sub.verifiedViews).toLocaleString()}</strong></div>}
                          {sub.rejectionReason && <div style={{ color: '#b91c1c' }}>Reason: {sub.rejectionReason}</div>}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Review Video Submission Modal */}
      {reviewVideoModal.open && (
        <div className="modal-overlay">
          <div className="modal" style={{ maxWidth: '520px' }}>
            <div className="modal-header">
              <h3>Audit Video: {reviewVideoModal.submission?.influencerId?.name}</h3>
              <button className="btn-icon" onClick={() => setReviewVideoModal({ ...reviewVideoModal, open: false })}>✕</button>
            </div>
            <form onSubmit={handleReviewVideoSubmit}>
              <div className="modal-body">
                {/* Video Player & Download */}
                {reviewVideoModal.submission?.videoUrl && (
                  <div style={{ marginBottom: '18px', background: '#0f172a', borderRadius: '10px', overflow: 'hidden', padding: '8px', textAlign: 'center' }}>
                    <video
                      src={resolveMediaUrl(reviewVideoModal.submission.videoUrl)}
                      controls
                      autoPlay={false}
                      style={{ width: '100%', maxHeight: '240px', objectFit: 'contain' }}
                    />
                    <div style={{ marginTop: '8px', display: 'flex', justifyContent: 'center', gap: '10px' }}>
                      <button
                        type="button"
                        onClick={() => downloadMedia(
                          reviewVideoModal.submission.videoUrl,
                          `verification-${reviewVideoModal.submission.influencerId?.name || 'influencer'}.mp4`
                        )}
                        className="btn btn-sm"
                        style={{ background: '#059669', color: '#fff', fontSize: '11px', padding: '3px 10px' }}
                      >
                        ⬇ Download Video
                      </button>
                      <a
                        href={resolveMediaUrl(reviewVideoModal.submission.videoUrl)}
                        target="_blank"
                        rel="noreferrer"
                        className="btn btn-sm"
                        style={{ background: '#3b82f6', color: '#fff', fontSize: '11px', padding: '3px 10px' }}
                      >
                        Open in New Tab ↗
                      </a>
                    </div>
                  </div>
                )}

                <div className="form-group">
                  <label className="form-label">Decision</label>
                  <select
                    className="form-control"
                    value={reviewVideoModal.decision}
                    onChange={(e) => setReviewVideoModal({ ...reviewVideoModal, decision: e.target.value })}
                  >
                    <option value="verified">Approve & Verify Creator</option>
                    <option value="rejected">Reject Submission</option>
                  </select>
                </div>

                {reviewVideoModal.decision === 'verified' ? (
                  <div className="form-group">
                    <label className="form-label">Audited View Count</label>
                    <input
                      type="number"
                      required
                      min="100"
                      className="form-control"
                      value={reviewVideoModal.views}
                      onChange={(e) => setReviewVideoModal({ ...reviewVideoModal, views: e.target.value })}
                    />
                    <span className="form-hint">Creator reported {Number(reviewVideoModal.submission?.reportedViews || 0).toLocaleString()} views.</span>
                  </div>
                ) : (
                  <div className="form-group">
                    <label className="form-label">Rejection Reason (Visible to Creator) *</label>
                    <textarea
                      required
                      rows={2}
                      className="form-control"
                      placeholder="e.g. Video did not show WhatsApp status viewers list, or recording was trimmed..."
                      value={reviewVideoModal.rejectionReason}
                      onChange={(e) => setReviewVideoModal({ ...reviewVideoModal, rejectionReason: e.target.value })}
                    />
                  </div>
                )}

                <div className="form-group">
                  <label className="form-label">Internal Admin Notes (Optional)</label>
                  <textarea
                    rows={2}
                    className="form-control"
                    placeholder="Notes for platform records..."
                    value={reviewVideoModal.notes}
                    onChange={(e) => setReviewVideoModal({ ...reviewVideoModal, notes: e.target.value })}
                  />
                </div>
              </div>

              <div className="modal-footer">
                <button type="button" className="btn btn-ghost" onClick={() => setReviewVideoModal({ ...reviewVideoModal, open: false })}>
                  Cancel
                </button>
                <button
                  type="submit"
                  className={reviewVideoModal.decision === 'verified' ? 'btn btn-primary' : 'btn btn-danger'}
                >
                  Confirm {reviewVideoModal.decision === 'verified' ? 'Approval' : 'Rejection'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Verify / Adjust Reach Modal */}
      {verifyModal.open && (
        <div className="modal-overlay">
          <div className="modal" style={{ maxWidth: '580px', maxHeight: '90vh', overflowY: 'auto' }}>
            <div className="modal-header">
              <h3>Verify Reach: {verifyModal.influencer?.userId?.name}</h3>
              <button className="btn-icon" onClick={() => setVerifyModal({ open: false, influencer: null, views: '', status: 'verified', notes: '' })}>✕</button>
            </div>
            <form onSubmit={handleVerifySubmit}>
              <div className="modal-body">
                {/* Influencer Uploaded Verification Video */}
                {verifyModal.influencer?.latestVerification?.videoUrl ? (
                  <div style={{ marginBottom: '18px', background: '#f8fafc', border: '1px solid #cbd5e1', borderRadius: '10px', padding: '14px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                      <span style={{ fontSize: '13px', fontWeight: '700', color: '#0f172a' }}>
                        📹 Submitted Verification Video
                      </span>
                      <button
                        type="button"
                        onClick={() => downloadMedia(
                          verifyModal.influencer.latestVerification.videoUrl,
                          `verification-${verifyModal.influencer.userId?.name || 'influencer'}.mp4`
                        )}
                        className="btn btn-sm"
                        style={{ background: '#059669', color: '#fff', fontSize: '11px', padding: '3px 8px' }}
                      >
                        ⬇ Download Video
                      </button>
                    </div>

                    <div style={{ borderRadius: '8px', overflow: 'hidden', background: '#000', maxHeight: '240px', textAlign: 'center' }}>
                      <video
                        src={resolveMediaUrl(verifyModal.influencer.latestVerification.videoUrl)}
                        controls
                        style={{ width: '100%', maxHeight: '240px', objectFit: 'contain' }}
                      />
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: '#64748b', marginTop: '6px' }}>
                      <span>Submitted: {new Date(verifyModal.influencer.latestVerification.createdAt).toLocaleDateString()}</span>
                      <a
                        href={resolveMediaUrl(verifyModal.influencer.latestVerification.videoUrl)}
                        target="_blank"
                        rel="noreferrer"
                        style={{ color: '#2563eb', fontWeight: '600', textDecoration: 'none' }}
                      >
                        Open in New Tab ↗
                      </a>
                    </div>
                  </div>
                ) : (
                  <div style={{ marginBottom: '16px', padding: '12px', background: '#fef3c7', border: '1px solid #fde68a', borderRadius: '8px', fontSize: '13px', color: '#92400e' }}>
                    ℹ️ No verification video uploaded by this creator yet.
                  </div>
                )}

                <p style={{ fontSize: '13px', color: '#64748b', marginBottom: '14px' }}>
                  Audited WhatsApp reach directly dictates campaign matching eligibility.
                </p>

                <div className="form-group">
                  <label className="form-label">Verification Status</label>
                  <select
                    className="form-control"
                    value={verifyModal.status}
                    onChange={(e) => setVerifyModal({ ...verifyModal, status: e.target.value })}
                  >
                    <option value="verified">Verified (Eligible for gigs)</option>
                    <option value="pending">Pending (Awaiting more proof)</option>
                    <option value="rejected">Rejected (Insufficient / fake proof)</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Official Verified Average Views</label>
                  <input
                    type="number"
                    required
                    min="100"
                    className="form-control"
                    value={verifyModal.views}
                    onChange={(e) => setVerifyModal({ ...verifyModal, views: e.target.value })}
                  />
                  <span className="form-hint">Claimed average: {Number(verifyModal.influencer?.averageViews).toLocaleString()}</span>
                </div>

                <div className="form-group">
                  <label className="form-label">Admin Notes to Influencer</label>
                  <textarea
                    className="form-control"
                    rows={2}
                    placeholder="e.g. Verified tier 2,500 based on submitted screenshots."
                    value={verifyModal.notes}
                    onChange={(e) => setVerifyModal({ ...verifyModal, notes: e.target.value })}
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-ghost" onClick={() => setVerifyModal({ open: false, influencer: null, views: '', status: 'verified', notes: '' })}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Save Verification
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
