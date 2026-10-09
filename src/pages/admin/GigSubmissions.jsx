import React, { useState, useEffect } from 'react';
import DashboardLayout from '../../layouts/DashboardLayout';
import { adminGetSubmissions, adminReviewGig } from '../../services/api';
import { toast } from '../../components/ui/Toast';

export default function AdminGigSubmissions() {
  const [loading, setLoading] = useState(true);
  const [submissions, setSubmissions] = useState([]);
  const [statusFilter, setStatusFilter] = useState('pending');
  const [reviewModal, setReviewModal] = useState({ open: false, submission: null, action: 'approved', comment: '' });

  useEffect(() => {
    fetchSubmissions();
  }, [statusFilter]);

  const fetchSubmissions = async () => {
    try {
      setLoading(true);
      const params = statusFilter === 'all' ? {} : { reviewStatus: statusFilter };
      const { data } = await adminGetSubmissions(params);
      setSubmissions(data.submissions || []);
    } catch (err) {
      toast.error('Failed to load gig submissions.');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenReview = (sub, action) => {
    setReviewModal({
      open: true,
      submission: sub,
      action,
      comment: action === 'approved' ? 'Proof verified. Well done!' : '',
    });
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (reviewModal.action === 'rejected' && !reviewModal.comment.trim()) {
      toast.warning('Please provide a reason for rejection.');
      return;
    }

    try {
      const { data } = await adminReviewGig({
        gigId: reviewModal.submission.gigId._id,
        reviewStatus: reviewModal.action,
        reviewComment: reviewModal.comment,
      });

      toast.success(data.message || `Submission marked as ${reviewModal.action}!`);
      setReviewModal({ open: false, submission: null, action: 'approved', comment: '' });
      fetchSubmissions();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to review submission.');
    }
  };

  return (
    <DashboardLayout title="Proof Review Center" role="admin">
      <div className="page-header">
        <div>
          <h2 className="page-title">Influencer Gig Proof Submissions</h2>
          <p className="page-subtitle">Audit uploaded WhatsApp Status posts and views counter screenshots.</p>
        </div>
      </div>

      {/* Filter Tabs */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '20px' }}>
        {['pending', 'approved', 'rejected', 'all'].map((tab) => (
          <button
            key={tab}
            onClick={() => setStatusFilter(tab)}
            className={`btn btn-sm ${statusFilter === tab ? 'btn-primary' : 'btn-ghost'}`}
            style={{ borderRadius: '20px' }}
          >
            {tab === 'pending' ? ' Pending Review' : tab === 'approved' ? '✓ Approved' : tab === 'rejected' ? '⚠️ Rejected' : 'All Submissions'}
          </button>
        ))}
      </div>

      <div className="card">
        <div className="card-body" style={{ padding: 0 }}>
          {loading ? (
            <div style={{ textAlign: 'center', padding: '60px' }}>
              <div className="spinner" style={{ margin: '0 auto 16px' }} />
              <p style={{ color: '#64748b' }}>Loading submissions...</p>
            </div>
          ) : submissions.length === 0 ? (
            <div className="empty-state">
              
              <h3>No submissions found</h3>
              <p>When influencers complete gigs and upload screenshots, they will appear here for audit.</p>
            </div>
          ) : (
            <div className="table-wrapper" style={{ border: 'none', borderRadius: 0 }}>
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Influencer</th>
                    <th>Campaign</th>
                    <th>Required Views</th>
                    <th>Reported Views</th>
                    <th>Screenshots</th>
                    <th>Status</th>
                    <th>Audit Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {submissions.map((sub) => {
                    const gig = sub.gigId;
                    const camp = gig?.campaignId;
                    return (
                      <tr key={sub._id}>
                        <td>
                          <strong>{sub.influencerId?.name}</strong>
                          <div style={{ fontSize: '12px', color: '#64748b' }}>{sub.influencerId?.email}</div>
                          <div style={{ fontSize: '11px', color: '#94a3b8' }}>#{gig?.gigNumber}</div>
                        </td>
                        <td>
                          <strong>{camp?.title || 'Campaign'}</strong>
                          <div style={{ fontSize: '12px', color: '#059669', fontWeight: '700' }}>
                            Reward: ₦{Number(gig?.reward || 0).toLocaleString()}
                          </div>
                        </td>
                        <td>
                          <strong>{Number(gig?.assignedViews || 0).toLocaleString()}</strong>
                        </td>
                        <td>
                          <strong style={{ color: sub.reportedViews >= (gig?.assignedViews || 0) ? '#059669' : '#d97706', fontSize: '15px' }}>
                            {Number(sub.reportedViews).toLocaleString()}
                          </strong>
                          {sub.notes && (
                            <div style={{ fontSize: '11px', color: '#64748b', maxWidth: '200px' }}>
                              Note: {sub.notes}
                            </div>
                          )}
                        </td>
                        <td>
                          <div style={{ display: 'flex', gap: '6px' }}>
                            {sub.proofImages?.map((img, i) => (
                              <a key={i} href={img.url} target="_blank" rel="noreferrer" title="Click to view full image">
                                <img
                                  src={img.url}
                                  alt="Proof"
                                  style={{ width: '48px', height: '48px', objectFit: 'cover', borderRadius: '4px', border: '1px solid #cbd5e1' }}
                                />
                              </a>
                            ))}
                          </div>
                        </td>
                        <td>
                          {sub.reviewStatus === 'approved' && <span className="badge badge-success">✓ Approved</span>}
                          {sub.reviewStatus === 'pending' && <span className="badge badge-warning"> Pending</span>}
                          {sub.reviewStatus === 'rejected' && <span className="badge badge-error">Rejected</span>}
                        </td>
                        <td>
                          {sub.reviewStatus === 'pending' ? (
                            <div style={{ display: 'flex', gap: '6px' }}>
                              <button
                                className="btn btn-sm btn-success"
                                onClick={() => handleOpenReview(sub, 'approved')}
                              >
                                Approve
                              </button>
                              <button
                                className="btn btn-sm btn-danger"
                                onClick={() => handleOpenReview(sub, 'rejected')}
                              >
                                Reject
                              </button>
                            </div>
                          ) : (
                            <button
                              className="btn btn-sm btn-ghost"
                              onClick={() => handleOpenReview(sub, sub.reviewStatus === 'approved' ? 'rejected' : 'approved')}
                            >
                              Re-evaluate
                            </button>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Review Modal */}
      {reviewModal.open && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h3>
                {reviewModal.action === 'approved' ? ' Approve Submission & Credit Reward' : '⚠️ Reject Submission'}
              </h3>
              <button className="btn-icon" onClick={() => setReviewModal({ open: false, submission: null, action: 'approved', comment: '' })}>✕</button>
            </div>
            <form onSubmit={handleReviewSubmit}>
              <div className="modal-body">
                <p style={{ color: '#64748b', fontSize: '14px', marginBottom: '16px' }}>
                  {reviewModal.action === 'approved'
                    ? `Approving will credit ₦${Number(reviewModal.submission?.gigId?.reward || 0).toLocaleString()} to ${reviewModal.submission?.influencerId?.name}'s earnings ledger.`
                    : `Please specify the reason why this submission is rejected. The influencer will be notified.`}
                </p>

                <div className="form-group">
                  <label className="form-label">
                    {reviewModal.action === 'approved' ? 'Approval Note (Optional)' : 'Reason for Rejection *'}
                  </label>
                  <textarea
                    required={reviewModal.action === 'rejected'}
                    className="form-control"
                    rows={3}
                    placeholder={reviewModal.action === 'approved' ? 'Great execution...' : 'Screenshots are blurry, views count did not reach requirement, etc.'}
                    value={reviewModal.comment}
                    onChange={(e) => setReviewModal({ ...reviewModal, comment: e.target.value })}
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-ghost" onClick={() => setReviewModal({ open: false, submission: null, action: 'approved', comment: '' })}>
                  Cancel
                </button>
                <button
                  type="submit"
                  className={`btn ${reviewModal.action === 'approved' ? 'btn-success' : 'btn-danger'}`}
                >
                  {reviewModal.action === 'approved' ? 'Confirm Approval' : 'Confirm Rejection'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
