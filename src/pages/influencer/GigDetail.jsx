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

  // Completion Video Evidence State
  const [videoFile, setVideoFile] = useState(null);
  const [videoPreview, setVideoPreview] = useState(null);
  const [reportedViews, setReportedViews] = useState('');
  const [notes, setNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  // Modal and decline state
  const [showCompletionModal, setShowCompletionModal] = useState(false);
  const [showDecline, setShowDecline] = useState(false);
  const [declineReason, setDeclineReason] = useState('');
  const [scheduleBAccepted, setScheduleBAccepted] = useState(false);

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
    if (!scheduleBAccepted) {
      toast.warning('Please confirm the Schedule B Influencer Declaration before accepting this gig.');
      return;
    }
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

  const handleVideoFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('video/')) {
      toast.error('Invalid format. Completion evidence must be a video file (MP4, MOV, WEBM).');
      return;
    }

    if (file.size > 100 * 1024 * 1024) {
      toast.error('Video exceeds 100MB maximum limit. Please trim or compress.');
      return;
    }

    setVideoFile(file);
    setVideoPreview(URL.createObjectURL(file));
  };

  const handleSubmitProof = async (e) => {
    e.preventDefault();

    if (!reportedViews || Number(reportedViews) <= 0) {
      toast.warning('Please enter the total WhatsApp views count achieved.');
      return;
    }

    const hasExistingVideo = submission?.videoUrl || submission?.proofImages?.length > 0;
    if (!videoFile && !hasExistingVideo) {
      toast.warning('Please select your WhatsApp status completion video.');
      return;
    }

    setSubmitting(true);
    setUploadProgress(0);

    try {
      const formData = new FormData();
      formData.append('reportedViews', reportedViews);
      formData.append('notes', notes);
      if (videoFile) {
        formData.append('video', videoFile);
      }

      const { data } = await submitGigProof(id, formData, (progressEvent) => {
        const pct = Math.round((progressEvent.loaded * 100) / progressEvent.total);
        setUploadProgress(pct);
      });

      toast.success(data.message || 'Gig completion video submitted! Admin broker will review shortly.');
      setGig(data.gig);
      setSubmission(data.submission);
      setShowCompletionModal(false);
      setVideoFile(null);
      setVideoPreview(null);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to submit evidence. Please try again.');
    } finally {
      setSubmitting(false);
      setUploadProgress(0);
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
  const isPendingSubmission = ['accepted', 'in_progress'].includes(gig.status);
  const isSubmitted = gig.status === 'submitted';
  const isApproved = gig.status === 'approved';
  const isRejected = gig.status === 'rejected';

  return (
    <DashboardLayout title={`Gig #${gig.gigNumber}`} role="influencer">
      <div style={{ marginBottom: '20px' }}>
        <Link to="/influencer/gigs" style={{ color: '#059669', fontWeight: '600', fontSize: '14px', textDecoration: 'none' }}>
          &larr; Back to All Gigs
        </Link>
      </div>

      {/* Status Alert Banner */}
      {isSubmitted && (
        <div className="alert alert-info" style={{ marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span style={{ fontSize: '24px' }}>⏳</span>
          <div>
            <strong>Completion Video Under Admin Review</strong>
            <p style={{ margin: '4px 0 0', fontSize: '13px' }}>
              Your completion video and reported reach of {Number(submission?.reportedViews || 0).toLocaleString()} views were received on{' '}
              {submission?.submittedAt ? new Date(submission.submittedAt).toLocaleString() : 'today'}. Once approved, your reward of ₦{Number(gig.reward).toLocaleString()} will be credited to your available balance.
            </p>
          </div>
        </div>
      )}

      {isApproved && (
        <div className="alert alert-success" style={{ marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span style={{ fontSize: '24px' }}>✅</span>
          <div>
            <strong>Gig Completed &amp; Approved!</strong>
            <p style={{ margin: '4px 0 0', fontSize: '13px' }}>
              Your work was approved by the admin. ₦{Number(gig.reward).toLocaleString()} has been credited to your verified earnings balance.
            </p>
          </div>
        </div>
      )}

      {isRejected && (
        <div className="alert alert-danger" style={{ marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span style={{ fontSize: '24px' }}>⚠️</span>
          <div>
            <strong>Completion Evidence Revision Requested</strong>
            <p style={{ margin: '4px 0 0', fontSize: '13px' }}>
              {gig.rejectionReason || submission?.reviewComment || 'Proof video did not satisfy view count or visibility requirements.'}
            </p>
            <button
              onClick={() => setShowCompletionModal(true)}
              className="btn btn-sm btn-danger"
              style={{ marginTop: '8px' }}
            >
              Resubmit Completion Video
            </button>
          </div>
        </div>
      )}

      {/* Main Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '24px' }}>
        {/* Campaign Task Details Card */}
        <div className="card" style={{ padding: 'clamp(16px, 3.5vw, 28px)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px', marginBottom: '20px' }}>
            <div>
              <span className="badge badge-info" style={{ marginBottom: '8px', display: 'inline-block' }}>
                {camp?.category || 'Advertising Campaign'}
              </span>
              <h2 style={{ fontSize: '1.5rem', margin: '4px 0', color: '#0f172a' }}>
                {camp?.title || 'Advertising Task'}
              </h2>
              <div style={{ fontSize: '13px', color: '#64748b' }}>
                Assigned Views Target: <strong>{Number(gig.assignedViews).toLocaleString()} Views</strong> &bull; Duration: {camp?.duration || '24 Hours'}
              </div>
            </div>

            <div style={{ textAlign: 'left' }}>
              <div style={{ fontSize: '12px', color: '#64748b', textTransform: 'uppercase' }}>Payout Reward</div>
              <div style={{ fontSize: '1.75rem', fontWeight: '800', color: '#059669' }}>
                ₦{Number(gig.reward).toLocaleString()}
              </div>
              <span className={`badge badge-${gig.status === 'approved' ? 'success' : gig.status === 'submitted' ? 'warning' : 'primary'}`}>
                {gig.status.replace('_', ' ')}
              </span>
            </div>
          </div>

          {/* Campaign Ad Media & Copy */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 280px), 1fr))', gap: '24px', marginBottom: '24px' }}>
            {camp?.media?.url && (
              <div>
                <label className="form-label" style={{ fontWeight: '600', marginBottom: '8px', display: 'block' }}>
                  Advert Image / Flyer to Post:
                </label>
                {camp.media.type === 'video' ? (
                  <video
                    src={camp.media.url}
                    controls
                    style={{ width: '100%', borderRadius: '10px', maxHeight: '300px', background: '#000' }}
                  />
                ) : (
                  <img
                    src={camp.media.url}
                    alt={camp.title}
                    style={{ width: '100%', borderRadius: '10px', maxHeight: '300px', objectFit: 'cover', border: '1px solid #e2e8f0' }}
                  />
                )}
                <div style={{ marginTop: '8px' }}>
                  <a
                    href={camp.media.url}
                    target="_blank"
                    rel="noreferrer"
                    download
                    className="btn btn-sm btn-ghost"
                    style={{ width: '100%', textAlign: 'center' }}
                  >
                    📥 Download Advert Media
                  </a>
                </div>
              </div>
            )}

            <div>
              <div style={{ marginBottom: '16px' }}>
                <label className="form-label" style={{ fontWeight: '600', marginBottom: '4px', display: 'block' }}>
                  Caption / Ad Copy to Include:
                </label>
                <div
                  style={{
                    background: '#f8fafc',
                    border: '1px solid #e2e8f0',
                    borderRadius: '8px',
                    padding: '14px',
                    fontSize: '14px',
                    lineHeight: '1.6',
                    whiteSpace: 'pre-wrap',
                    color: '#334155',
                  }}
                >
                  {camp?.adCopy || camp?.description || 'No specific text caption provided. Post advert media.'}
                </div>
              </div>

              {camp?.callToAction?.targetValue && (
                <div style={{ marginBottom: '16px' }}>
                  <label className="form-label" style={{ fontWeight: '600', marginBottom: '4px', display: 'block' }}>
                    Call to Action ({camp.callToAction.actionType}):
                  </label>
                  <div style={{ padding: '10px 14px', background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '8px', fontSize: '13px', color: '#166534', fontWeight: '500' }}>
                    {camp.callToAction.actionType}: {camp.callToAction.targetValue}
                  </div>
                </div>
              )}

              {camp?.instructions && (
                <div>
                  <label className="form-label" style={{ fontWeight: '600', marginBottom: '4px', display: 'block' }}>
                    Special Instructions from Vendor:
                  </label>
                  <div style={{ fontSize: '13px', color: '#475569', lineHeight: '1.6', background: '#fffbeb', border: '1px solid #fef3c7', padding: '12px', borderRadius: '8px' }}>
                    {camp.instructions}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Action Buttons for Assigned status */}
          {gig.status === 'assigned' && (
            <div style={{ borderTop: '1px solid #e2e8f0', paddingTop: '20px', marginTop: '16px' }}>
              <div style={{
                marginBottom: '16px',
                padding: '16px',
                background: '#f8fafc',
                border: '1px solid #cbd5e1',
                borderRadius: '8px'
              }}>
                <label style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', cursor: 'pointer', margin: 0 }}>
                  <input
                    type="checkbox"
                    checked={scheduleBAccepted}
                    onChange={(e) => setScheduleBAccepted(e.target.checked)}
                    style={{ marginTop: '3px', width: '18px', height: '18px', flexShrink: 0 }}
                  />
                  <span style={{ fontSize: '13px', color: '#1e293b', lineHeight: '1.5' }}>
                    <strong>Schedule B — Influencer / Promoter Declaration:</strong> I confirm that I have reviewed the campaign brief and creative guidelines. I agree to publish only approved, unaltered campaign materials for the required duration (minimum 24 hours), submit authentic and unaltered video proof of views, and abide by the <a href="/terms" target="_blank" rel="noopener noreferrer" style={{ color: '#2563eb', textDecoration: 'underline' }}>MEDIOVA Terms and Conditions of Service</a>.
                  </span>
                </label>
              </div>

              <div style={{ display: 'flex', gap: '16px', justifyContent: 'flex-end', flexWrap: 'wrap' }}>
                <button
                  type="button"
                  className="btn btn-ghost"
                  onClick={() => setShowDecline(!showDecline)}
                  style={{ color: '#dc2626' }}
                >
                  Decline Gig
                </button>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={handleAccept}
                  disabled={!scheduleBAccepted}
                  style={{
                    padding: '12px 28px',
                    fontWeight: '600',
                    opacity: scheduleBAccepted ? 1 : 0.6,
                    cursor: scheduleBAccepted ? 'pointer' : 'not-allowed'
                  }}
                >
                  Accept Gig (Earn ₦{Number(gig.reward).toLocaleString()})
                </button>
              </div>
            </div>
          )}

          {/* Decline Form */}
          {showDecline && gig.status === 'assigned' && (
            <form onSubmit={handleDecline} style={{ marginTop: '16px', padding: '16px', background: '#fef2f2', borderRadius: '8px', border: '1px solid #fee2e2' }}>
              <label className="form-label" style={{ color: '#991b1b', fontWeight: '600' }}>Reason for Declining:</label>
              <input
                type="text"
                required
                className="form-control"
                placeholder="e.g. Schedule conflict, niche mismatch..."
                value={declineReason}
                onChange={(e) => setDeclineReason(e.target.value)}
                style={{ marginBottom: '12px' }}
              />
              <button type="submit" className="btn btn-danger btn-sm">Confirm Decline</button>
            </form>
          )}

          {/* Action Button for Accepted/In-Progress status */}
          {(isPendingSubmission || isRejected) && (
            <div style={{ borderTop: '1px solid #e2e8f0', paddingTop: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
              <div style={{ fontSize: '13px', color: '#64748b' }}>
                Status: <strong>Accepted</strong> &bull; Complete the WhatsApp status post and submit your video evidence.
              </div>
              <button
                type="button"
                className="btn btn-primary"
                onClick={() => setShowCompletionModal(true)}
                style={{ padding: '12px 24px', fontWeight: '600' }}
              >
                📹 Submit Completed Gig Video
              </button>
            </div>
          )}

          {/* Submitted Video Evidence Preview */}
          {submission?.videoUrl && (
            <div style={{ marginTop: '24px', borderTop: '1px solid #e2e8f0', paddingTop: '20px' }}>
              <h4 style={{ margin: '0 0 12px', fontSize: '1rem', color: '#0f172a' }}>
                Submitted Completion Evidence:
              </h4>
              <div style={{ maxWidth: '400px', background: '#000', borderRadius: '10px', overflow: 'hidden' }}>
                <video src={submission.videoUrl} controls style={{ width: '100%', maxHeight: '300px' }} />
              </div>
              <div style={{ marginTop: '10px', fontSize: '13px', color: '#475569' }}>
                Reported Views: <strong>{Number(submission.reportedViews || 0).toLocaleString()} Views</strong>
                {submission.notes && <span> &bull; Notes: "{submission.notes}"</span>}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 10.2 Dedicated Gig-Completion Instructions Modal */}
      {showCompletionModal && (
        <div
          className="modal-overlay"
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(15, 23, 42, 0.75)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 2000,
            padding: '16px',
            backdropFilter: 'blur(4px)',
          }}
          onClick={() => !submitting && setShowCompletionModal(false)}
        >
          <div
            className="modal-card"
            style={{
              background: '#ffffff',
              borderRadius: '16px',
              maxWidth: '640px',
              width: '100%',
              maxHeight: '90vh',
              display: 'flex',
              flexDirection: 'column',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
              overflow: 'hidden',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div
              style={{
                padding: '20px 24px',
                borderBottom: '1px solid #e2e8f0',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                background: '#f8fafc',
              }}
            >
              <div>
                <h3 style={{ margin: 0, fontSize: '1.2rem', color: '#0f172a', fontWeight: '700' }}>
                  Submit Gig Completion Video Evidence
                </h3>
                <span style={{ fontSize: '12px', color: '#64748b' }}>
                  Gig #{gig.gigNumber} &bull; Target: {Number(gig.assignedViews).toLocaleString()} Views
                </span>
              </div>
              <button
                disabled={submitting}
                onClick={() => setShowCompletionModal(false)}
                style={{ background: 'transparent', border: 'none', fontSize: '24px', cursor: 'pointer', color: '#64748b' }}
              >
                &times;
              </button>
            </div>

            {/* Scrollable Body */}
            <div style={{ padding: '24px', overflowY: 'auto', flex: 1 }}>
              {/* Instructions */}
              <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '10px', padding: '16px', marginBottom: '20px' }}>
                <h4 style={{ margin: '0 0 10px', fontSize: '13px', color: '#047857', fontWeight: '700' }}>
                  How to Record Your WhatsApp-View Completion Evidence:
                </h4>
                <ul style={{ margin: 0, paddingLeft: '20px', fontSize: '13px', color: '#334155', lineHeight: '1.6' }}>
                  <li>Open your WhatsApp Status tab after the campaign has been active (typically 20-24 hours).</li>
                  <li>Record a 15-45 second video showing the posted flyer/caption on your status.</li>
                  <li>Tap the status viewer counter to display total viewers.</li>
                  <li>Slowly scroll down through the viewers to demonstrate authentic engagement.</li>
                  <li>Supported video formats: MP4, MOV, WEBM (up to 100MB).</li>
                </ul>
              </div>

              <form onSubmit={handleSubmitProof}>
                {/* Video File Input */}
                <div style={{ marginBottom: '16px' }}>
                  <label className="form-label" style={{ fontWeight: '600', marginBottom: '6px', display: 'block' }}>
                    Select Completion Video Recording <span style={{ color: '#dc2626' }}>*</span>
                  </label>
                  <input
                    type="file"
                    accept="video/mp4,video/quicktime,video/webm,video/*"
                    onChange={handleVideoFileChange}
                    className="form-control"
                    style={{ padding: '10px' }}
                  />
                </div>

                {/* Preview */}
                {videoPreview && (
                  <div style={{ marginBottom: '16px', textAlign: 'center' }}>
                    <video
                      src={videoPreview}
                      controls
                      style={{ maxWidth: '100%', maxHeight: '200px', borderRadius: '8px', background: '#000' }}
                    />
                    <div style={{ fontSize: '12px', color: '#059669', marginTop: '4px', fontWeight: '600' }}>
                      ✓ Video ready: {videoFile?.name} ({(videoFile?.size / (1024 * 1024)).toFixed(1)} MB)
                    </div>
                  </div>
                )}

                {/* Reported Views */}
                <div className="form-group" style={{ marginBottom: '16px' }}>
                  <label className="form-label" style={{ fontWeight: '600', marginBottom: '6px', display: 'block' }}>
                    Total WhatsApp Status Views Achieved <span style={{ color: '#dc2626' }}>*</span>
                  </label>
                  <input
                    type="number"
                    min="1"
                    required
                    placeholder="e.g. 1250"
                    className="form-control"
                    value={reportedViews}
                    onChange={(e) => setReportedViews(e.target.value)}
                    style={{ height: '44px', borderRadius: '8px' }}
                  />
                  <span className="form-hint" style={{ fontSize: '12px', color: '#64748b', marginTop: '4px', display: 'block' }}>
                    Must match the total count clearly visible in your submitted video evidence.
                  </span>
                </div>

                {/* Notes */}
                <div className="form-group" style={{ marginBottom: '20px' }}>
                  <label className="form-label" style={{ fontWeight: '600', marginBottom: '6px', display: 'block' }}>
                    Notes for Admin Reviewer (Optional)
                  </label>
                  <textarea
                    rows="2"
                    className="form-control"
                    placeholder="e.g. Status was active for 24 hours. Views exceeded target by 15%..."
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    style={{ borderRadius: '8px' }}
                  />
                </div>

                {/* Progress bar */}
                {submitting && (
                  <div style={{ marginBottom: '16px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '4px', color: '#059669', fontWeight: '600' }}>
                      <span>Uploading video proof to secure storage...</span>
                      <span>{uploadProgress}%</span>
                    </div>
                    <div style={{ width: '100%', height: '8px', background: '#e2e8f0', borderRadius: '4px', overflow: 'hidden' }}>
                      <div
                        style={{
                          width: `${uploadProgress}%`,
                          height: '100%',
                          background: '#059669',
                          transition: 'width 0.3s ease',
                        }}
                      />
                    </div>
                  </div>
                )}

                {/* Actions */}
                <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
                  <button
                    type="button"
                    className="btn btn-ghost"
                    onClick={() => setShowCompletionModal(false)}
                    disabled={submitting}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={submitting || (!videoFile && !submission?.videoUrl)}
                    style={{ fontWeight: '600', minWidth: '180px' }}
                  >
                    {submitting ? `Uploading (${uploadProgress}%)...` : 'Submit Video Evidence'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
