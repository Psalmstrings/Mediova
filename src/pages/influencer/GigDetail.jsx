import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import DashboardLayout from '../../layouts/DashboardLayout';
import { getGigDetails, acceptGig, declineGig, submitGigProof } from '../../services/api';
import { toast } from '../../components/ui/Toast';

export default function InfluencerGigDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [gig, setGig] = useState(null);
  const [submission, setSubmission] = useState(null);
  const [loading, setLoading] = useState(true);

  // Proof Submission State
  const [statusPostFile, setStatusPostFile] = useState(null);
  const [viewsFile, setViewsFile] = useState(null);
  const [reportedViews, setReportedViews] = useState('');
  const [notes, setNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [declineReason, setDeclineReason] = useState('');
  const [showDecline, setShowDecline] = useState(false);

  useEffect(() => {
    fetchGig();
  }, [id]);

  const fetchGig = async () => {
    try {
      setLoading(true);
      const { data } = await getGigDetails(id);
      setGig(data.gig);
      setSubmission(data.submission);
      if (data.submission) {
        setReportedViews(data.submission.reportedViews || '');
        setNotes(data.submission.notes || '');
      }
    } catch (err) {
      toast.error('Failed to load gig details.');
    } finally {
      setLoading(false);
    }
  };

  const handleAccept = async () => {
    try {
      const { data } = await acceptGig(id);
      toast.success(data.message || 'Gig accepted!');
      fetchGig();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Could not accept gig.');
    }
  };

  const handleDecline = async (e) => {
    e.preventDefault();
    try {
      await declineGig(id, { reason: declineReason });
      toast.info('Gig declined.');
      navigate('/influencer/gigs');
    } catch (err) {
      toast.error('Failed to decline gig.');
    }
  };

  const handleSubmitProof = async (e) => {
    e.preventDefault();

    if (!reportedViews || Number(reportedViews) <= 0) {
      toast.warning('Please enter the total WhatsApp views achieved.');
      return;
    }

    if (!statusPostFile && (!submission || submission.proofImages?.length === 0)) {
      toast.warning('Please select at least one screenshot showing your posted WhatsApp Status.');
      return;
    }

    setSubmitting(true);
    try {
      const formData = new FormData();
      formData.append('reportedViews', reportedViews);
      formData.append('notes', notes);

      if (statusPostFile) formData.append('proofImages', statusPostFile);
      if (viewsFile) formData.append('proofImages', viewsFile);

      const { data } = await submitGigProof(id, formData);
      toast.success(data.message || 'Proof submitted successfully! Admin will review shortly.');
      setGig(data.gig);
      setSubmission(data.submission);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to submit proof.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <DashboardLayout title="Gig Details" role="influencer">
        <div style={{ textAlign: 'center', padding: '60px' }}>
          <div className="spinner" style={{ margin: '0 auto 16px' }} />
          <p style={{ color: '#64748b' }}>Loading gig details...</p>
        </div>
      </DashboardLayout>
    );
  }

  if (!gig) {
    return (
      <DashboardLayout title="Gig Details" role="influencer">
        <div className="card" style={{ padding: '40px', textAlign: 'center' }}>
          <h3>Gig assignment not found</h3>
          <Link to="/influencer/gigs" className="btn btn-primary" style={{ marginTop: '16px' }}>
            Back to Gigs
          </Link>
        </div>
      </DashboardLayout>
    );
  }

  const camp = gig.campaignId;

  return (
    <DashboardLayout title={`Gig #${gig.gigNumber}`} role="influencer">
      <div style={{ marginBottom: '20px' }}>
        <Link to="/influencer/gigs" style={{ color: '#059669', fontWeight: '600', fontSize: '14px' }}>
          ← Back to All Gigs
        </Link>
      </div>

      {/* Rejection Alert if rejected */}
      {gig.status === 'rejected' && (
        <div className="alert alert-error" style={{ marginBottom: '24px' }}>
          <div>
            <strong>Submission Needs Revision:</strong>
            <p style={{ margin: '4px 0 0', fontSize: '13px' }}>
              Admin Note: {gig.rejectionReason || 'Uploaded proof did not meet instructions. Please re-upload valid screenshots below.'}
            </p>
          </div>
        </div>
      )}

      {/* Approval Alert if approved */}
      {gig.status === 'approved' && (
        <div className="alert alert-success" style={{ marginBottom: '24px' }}>
          <div>
            <strong> Submission Approved & Credited!</strong>
            <p style={{ margin: '4px 0 0', fontSize: '13px' }}>
              The Admin broker has verified your proof. ₦{Number(gig.reward).toLocaleString()} has been credited to your available balance.
            </p>
          </div>
        </div>
      )}

      <div className="grid-2" style={{ gap: '28px', alignItems: 'flex-start' }}>
        {/* Left Column: Campaign Information & Flyer */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <div className="card">
            <div className="card-header">
              <div>
                <span className="badge badge-info">Order #{camp?.orderNumber}</span>
                <h2 style={{ fontSize: '1.4rem', marginTop: '6px' }}>{camp?.title}</h2>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '12px', color: '#64748b' }}>Your Reward</div>
                <div style={{ fontSize: '1.6rem', fontWeight: '800', color: '#059669' }}>
                  ₦{Number(gig.reward).toLocaleString()}
                </div>
              </div>
            </div>

            <div className="card-body">
              {/* Flyer / Media Display */}
              {camp?.media?.url ? (
                <div style={{ marginBottom: '20px', borderRadius: '10px', overflow: 'hidden', background: '#0f172a', textAlign: 'center' }}>
                  {camp.media.type === 'video' ? (
                    <video controls src={camp.media.url} style={{ maxHeight: '350px', width: '100%' }} />
                  ) : (
                    <img src={camp.media.url} alt={camp.title} style={{ maxHeight: '350px', margin: '0 auto', objectFit: 'contain' }} />
                  )}
                  <div style={{ padding: '8px', background: '#1e293b', textAlign: 'center' }}>
                    <a href={camp.media.url} target="_blank" rel="noreferrer" className="btn btn-sm btn-ghost" style={{ color: '#a7f3d0' }}>
                      ⬇️ View / Download High-Res Flyer
                    </a>
                  </div>
                </div>
              ) : (
                <div style={{ padding: '24px', background: '#f8fafc', borderRadius: '8px', textAlign: 'center', marginBottom: '20px', color: '#64748b' }}>
                  No media flyer attached. Use the advertisement copy below.
                </div>
              )}

              {/* Advertisement Copy */}
              {camp?.adCopy && (
                <div style={{ marginBottom: '20px' }}>
                  <label className="form-label">Advertisement Caption / Copy to Post:</label>
                  <div style={{ background: '#f8fafc', padding: '16px', borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '14px', whiteSpace: 'pre-wrap' }}>
                    {camp.adCopy}
                  </div>
                </div>
              )}

              {/* Call to action */}
              {camp?.callToAction?.targetValue && (
                <div style={{ marginBottom: '20px', background: '#eff6ff', padding: '12px 16px', borderRadius: '8px', border: '1px solid #bfdbfe' }}>
                  <strong>Call to Action:</strong> {camp.callToAction.actionType} → <span style={{ color: '#2563eb' }}>{camp.callToAction.targetValue}</span>
                </div>
              )}

              {/* Instructions */}
              <div>
                <label className="form-label">Campaign Description & Instructions:</label>
                <p style={{ color: '#475569', fontSize: '14px', lineHeight: '1.7', whiteSpace: 'pre-wrap' }}>
                  {camp?.instructions || camp?.description || 'Post the flyer on your WhatsApp Status and leave active for 24 hours.'}
                </p>
              </div>
            </div>
          </div>

          {/* Posting Guidelines Card */}
          <div className="card" style={{ padding: '24px' }}>
            <h4 style={{ marginBottom: '16px' }}> Posting Requirements</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '14px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#64748b' }}>Required Status Duration:</span>
                <strong>{camp?.duration || '24 Hours'}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#64748b' }}>Target Minimum Views:</span>
                <strong style={{ color: '#2563eb' }}>{Number(gig.assignedViews).toLocaleString()} views</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#64748b' }}>Target Location:</span>
                <strong>{camp?.targetLocation?.area}, {camp?.targetLocation?.state}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#64748b' }}>Category:</span>
                <strong>{camp?.category}</strong>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Actions & Proof Submission */}
        <div>
          {/* If assigned, show Accept / Decline buttons */}
          {gig.status === 'assigned' && (
            <div className="card" style={{ padding: '28px' }}>
              <h3 style={{ marginBottom: '12px' }}>Accept This Gig</h3>
              <p style={{ color: '#64748b', fontSize: '14px', lineHeight: '1.6', marginBottom: '24px' }}>
                Review the flyer and instructions carefully. When you click <strong>Accept</strong>, this gig is allocated to you and you should post within 12 hours.
              </p>

              <button onClick={handleAccept} className="btn btn-primary btn-block btn-lg" style={{ marginBottom: '12px' }}>
                ✓ Accept Gig (Earn ₦{Number(gig.reward).toLocaleString()})
              </button>

              {!showDecline ? (
                <button
                  type="button"
                  onClick={() => setShowDecline(true)}
                  className="btn btn-ghost btn-block"
                >
                  Decline This Assignment
                </button>
              ) : (
                <form onSubmit={handleDecline} style={{ marginTop: '16px', background: '#f8fafc', padding: '16px', borderRadius: '8px' }}>
                  <label className="form-label">Reason for declining:</label>
                  <textarea
                    required
                    className="form-control"
                    rows={2}
                    placeholder="Brief explanation"
                    value={declineReason}
                    onChange={(e) => setDeclineReason(e.target.value)}
                  />
                  <div style={{ display: 'flex', gap: '8px', marginTop: '12px' }}>
                    <button type="submit" className="btn btn-sm btn-danger">Confirm Decline</button>
                    <button type="button" className="btn btn-sm btn-ghost" onClick={() => setShowDecline(false)}>Cancel</button>
                  </div>
                </form>
              )}
            </div>
          )}

          {/* Proof Submission Section (for accepted, in_progress, rejected, submitted) */}
          {['accepted', 'in_progress', 'rejected', 'submitted'].includes(gig.status) && (
            <div className="card">
              <div className="card-header">
                <h3 style={{ fontSize: '1.2rem' }}>
                  {gig.status === 'submitted' ? 'Proof Submitted (Under Review)' : 'Submit Completed Gig Proof'}
                </h3>
              </div>

              <div className="card-body">
                {gig.status === 'submitted' ? (
                  <div>
                    <div className="alert alert-info" style={{ marginBottom: '20px' }}>
                      The Admin broker is reviewing your submitted screenshots. Payout is processed upon verification.
                    </div>

                    <div style={{ marginBottom: '16px' }}>
                      <strong>Reported Views:</strong> {Number(submission?.reportedViews).toLocaleString()}
                    </div>

                    {submission?.notes && (
                      <div style={{ marginBottom: '16px' }}>
                        <strong>Influencer Notes:</strong> {submission.notes}
                      </div>
                    )}

                    {submission?.proofImages && submission.proofImages.length > 0 && (
                      <div>
                        <strong>Submitted Proof Screenshots:</strong>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginTop: '12px' }}>
                          {submission.proofImages.map((img, i) => (
                            <a key={i} href={img.url} target="_blank" rel="noreferrer">
                              <img
                                src={img.url}
                                alt={`Proof ${i + 1}`}
                                style={{ width: '100%', height: '160px', objectFit: 'cover', borderRadius: '8px', border: '1px solid #e2e8f0' }}
                              />
                            </a>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <form onSubmit={handleSubmitProof}>
                    <p style={{ color: '#64748b', fontSize: '14px', lineHeight: '1.6', marginBottom: '20px' }}>
                      After keeping the advertisement on your WhatsApp Status for 24 hours, upload clear screenshots to verify completion:
                    </p>

                    <div className="form-group">
                      <label className="form-label">
                        1. Screenshot of Ad on WhatsApp Status <span className="required">*</span>
                      </label>
                      <input
                        type="file"
                        accept="image/*"
                        className="form-control"
                        onChange={(e) => setStatusPostFile(e.target.files[0])}
                      />
                      <span className="form-hint">Shows the flyer or video posted on your story.</span>
                    </div>

                    <div className="form-group">
                      <label className="form-label">
                        2. Screenshot of WhatsApp Status Views <span className="required">*</span>
                      </label>
                      <input
                        type="file"
                        accept="image/*"
                        className="form-control"
                        onChange={(e) => setViewsFile(e.target.files[0])}
                      />
                      <span className="form-hint">Shows the "Views" counter on that specific status update.</span>
                    </div>

                    <div className="form-group">
                      <label className="form-label">
                        Total Views Achieved <span className="required">*</span>
                      </label>
                      <input
                        type="number"
                        required
                        min="1"
                        className="form-control"
                        placeholder="e.g. 1450"
                        value={reportedViews}
                        onChange={(e) => setReportedViews(e.target.value)}
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label">Completion Notes (Optional)</label>
                      <textarea
                        className="form-control"
                        rows={2}
                        placeholder="e.g. Posted at 9am, kept live for 24 hours. Engaged with 15 replies."
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                      />
                    </div>

                    <button
                      type="submit"
                      className="btn btn-primary btn-block btn-lg"
                      disabled={submitting}
                      style={{ marginTop: '16px' }}
                    >
                      {submitting ? 'Uploading Proof...' : 'Submit Completed Gig Proof →'}
                    </button>
                  </form>
                )}
              </div>
            </div>
          )}

          {/* Approved state overview */}
          {gig.status === 'approved' && (
            <div className="card" style={{ padding: '24px' }}>
              <h4>Summary</h4>
              <p style={{ color: '#059669', fontWeight: '700', fontSize: '18px', marginTop: '8px' }}>
                Reward Credited: ₦{Number(gig.reward).toLocaleString()}
              </p>
              <div style={{ marginTop: '16px' }}>
                <Link to="/influencer/earnings" className="btn btn-secondary btn-block">
                  View Earnings Ledger →
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
