import React, { useState } from 'react';
import { submitVerificationVideo } from '../../services/api';
import { toast } from '../ui/Toast';

export default function InfluencerVerificationModal({
  isOpen,
  onClose,
  verificationSubmission,
  verificationStatus = 'pending',
  onSuccess,
}) {
  const [step, setStep] = useState(1);
  const [videoFile, setVideoFile] = useState(null);
  const [videoPreview, setVideoPreview] = useState(null);
  const [notes, setNotes] = useState('');
  const [averageViews, setAverageViews] = useState('');
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  if (!isOpen) return null;

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('video/')) {
      toast.error('Invalid file type. Please select an authentic video file (MP4, MOV, or WEBM).');
      return;
    }

    if (file.size > 100 * 1024 * 1024) {
      toast.error('Video file size exceeds 100MB limit. Please compress or trim the video.');
      return;
    }

    setVideoFile(file);
    setVideoPreview(URL.createObjectURL(file));
  };

  const handleUploadSubmit = async (e) => {
    e.preventDefault();
    if (!videoFile) {
      toast.warning('Please select a recorded verification video to upload.');
      return;
    }

    setUploading(true);
    setUploadProgress(0);

    try {
      const formData = new FormData();
      formData.append('video', videoFile);
      if (notes) formData.append('notes', notes);
      if (averageViews) formData.append('averageViews', averageViews);

      const res = await submitVerificationVideo(formData, (progressEvent) => {
        const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total);
        setUploadProgress(percent);
      });

      if (res.data.success) {
        toast.success('Verification video submitted successfully! Your verification status is now: Pending Approval.');
        if (onSuccess) onSuccess(res.data.submission);
        onClose(); // Automatically return back to dashboard
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to upload verification video. Please retry.');
    } finally {
      setUploading(false);
    }
  };

  return (
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
      onClick={onClose}
    >
      <div
        className="modal-card"
        style={{
          background: '#ffffff',
          borderRadius: '16px',
          maxWidth: '680px',
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
              Influencer Account Verification
            </h3>
            <span style={{ fontSize: '12px', color: '#64748b' }}>
              Required before receiving paid WhatsApp gig assignments
            </span>
          </div>
          <button
            onClick={onClose}
            style={{
              background: 'transparent',
              border: 'none',
              fontSize: '24px',
              cursor: 'pointer',
              color: '#64748b',
              padding: '4px 8px',
            }}
          >
            &times;
          </button>
        </div>

        {/* Body */}
        <div style={{ padding: '24px', overflowY: 'auto', flex: 1 }}>
          {/* Step 1: Verification Instructions */}
          {step === 1 && (
            <div>
              <div style={{ textAlign: 'center', marginBottom: '20px' }}>
                <span style={{ fontSize: '48px', display: 'block', marginBottom: '8px' }}>📹</span>
                <h4 style={{ margin: '0 0 6px', fontSize: '1.25rem', color: '#0f172a' }}>
                  How to Record Your Verification Video
                </h4>
                <p style={{ margin: 0, fontSize: '13px', color: '#64748b' }}>
                  MEDIOVA requires video proof to guarantee genuine audience views for paying vendors.
                </p>
              </div>

              <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '18px', marginBottom: '20px' }}>
                <h5 style={{ margin: '0 0 12px', color: '#047857', fontSize: '14px', fontWeight: '700' }}>
                  Video Recording Guidelines:
                </h5>
                <ol style={{ margin: 0, paddingLeft: '20px', fontSize: '13px', lineHeight: '1.7', color: '#334155' }}>
                  <li>
                    <strong>Open WhatsApp on your phone:</strong> Start a screen recording or have someone record your screen with another camera.
                  </li>
                  <li>
                    <strong>Navigate to Status tab:</strong> Show your active WhatsApp Status list.
                  </li>
                  <li>
                    <strong>Tap on your recent Status:</strong> Open the status viewer list showing the total number of viewers.
                  </li>
                  <li>
                    <strong>Scroll through the viewer list:</strong> Slowly scroll down through the contact names to demonstrate authentic, active contacts (no bot groups).
                  </li>
                  <li>
                    <strong>Keep it under 60 seconds:</strong> A clear 15 to 45 second clip is ideal. Supported formats: MP4, MOV, WEBM (up to 100MB).
                  </li>
                </ol>
              </div>

              <div style={{ background: '#fef2f2', border: '1px solid #fee2e2', borderRadius: '8px', padding: '12px 16px', marginBottom: '24px' }}>
                <div style={{ color: '#b91c1c', fontSize: '13px', fontWeight: '600', marginBottom: '4px' }}>
                  Important Rules:
                </div>
                <div style={{ color: '#991b1b', fontSize: '12px', lineHeight: '1.6' }}>
                  Static screenshots are NOT accepted for account verification. Video must clearly show your phone's screen and clock. Edited or fabricated videos will result in permanent account suspension.
                </div>
              </div>

              <button
                type="button"
                className="btn btn-primary"
                onClick={() => setStep(2)}
                style={{
                  width: '100%',
                  padding: '14px',
                  fontWeight: '600',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                }}
              >
                I Understand &bull; Proceed to Video Upload &rarr;
              </button>
            </div>
          )}

          {/* Step 2: Upload Control */}
          {step === 2 && (
            <form onSubmit={handleUploadSubmit}>
              <div style={{ marginBottom: '16px' }}>
                <label className="form-label" style={{ fontWeight: '600', fontSize: '14px', marginBottom: '6px' }}>
                  Select or Record Verification Video <span style={{ color: '#dc2626' }}>*</span>
                </label>
                <input
                  type="file"
                  accept="video/mp4,video/quicktime,video/webm,video/*"
                  onChange={handleFileChange}
                  className="form-control"
                  style={{ padding: '10px' }}
                />
                <span className="form-hint" style={{ fontSize: '12px', color: '#64748b', marginTop: '4px', display: 'block' }}>
                  Supported formats: MP4, MOV, WEBM. Maximum file size: 100MB.
                </span>
              </div>

              {/* Video Preview */}
              {videoPreview && (
                <div style={{ marginBottom: '16px', textAlign: 'center' }}>
                  <video
                    src={videoPreview}
                    controls
                    style={{
                      maxWidth: '100%',
                      maxHeight: '240px',
                      borderRadius: '8px',
                      background: '#000000',
                    }}
                  />
                  <div style={{ fontSize: '12px', color: '#059669', marginTop: '4px', fontWeight: '600' }}>
                    ✓ Ready to upload: {videoFile?.name} ({(videoFile?.size / (1024 * 1024)).toFixed(1)} MB)
                  </div>
                </div>
              )}

              {/* Average Views Claim */}
              <div className="form-group" style={{ marginBottom: '16px' }}>
                <label className="form-label" style={{ fontWeight: '600', fontSize: '14px', marginBottom: '6px' }}>
                  Average WhatsApp Status Views Count
                </label>
                <input
                  type="number"
                  min="50"
                  max="1000000"
                  placeholder="e.g. 500"
                  className="form-control"
                  value={averageViews}
                  onChange={(e) => setAverageViews(e.target.value)}
                  style={{ height: '44px', borderRadius: '8px' }}
                />
                <span className="form-hint" style={{ fontSize: '12px', color: '#64748b', marginTop: '4px', display: 'block' }}>
                  Enter the approximate number of views your status typically gets in 24 hours.
                </span>
              </div>

              {/* Notes */}
              <div className="form-group" style={{ marginBottom: '20px' }}>
                <label className="form-label" style={{ fontWeight: '600', fontSize: '14px', marginBottom: '6px' }}>
                  Additional Notes for Admin Reviewer (Optional)
                </label>
                <textarea
                  rows="2"
                  className="form-control"
                  placeholder="e.g. Recorded today showing yesterday's status analytics..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  style={{ borderRadius: '8px' }}
                />
              </div>

              {/* Upload Progress Bar */}
              {uploading && (
                <div style={{ marginBottom: '16px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '4px', color: '#059669', fontWeight: '600' }}>
                    <span>Uploading video to secure storage...</span>
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
              <div style={{ display: 'flex', gap: '12px' }}>
                <button
                  type="button"
                  className="btn btn-ghost"
                  onClick={() => setStep(1)}
                  disabled={uploading}
                  style={{ flex: 1, padding: '12px', borderRadius: '8px' }}
                >
                  &larr; Back to Instructions
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={uploading || !videoFile}
                  style={{
                    flex: 2,
                    padding: '12px',
                    borderRadius: '8px',
                    fontWeight: '600',
                    cursor: uploading || !videoFile ? 'not-allowed' : 'pointer',
                  }}
                >
                  {uploading ? `Uploading (${uploadProgress}%)...` : 'Submit Verification Video'}
                </button>
              </div>
            </form>
          )}

          {/* Step 3: Status / Confirmation */}
          {step === 3 && (
            <div style={{ textAlign: 'center', padding: '16px 0' }}>
              <div style={{ fontSize: '56px', marginBottom: '12px' }}>⏳</div>
              <h4 style={{ fontSize: '1.35rem', color: '#0f172a', margin: '0 0 8px' }}>
                Verification Video Under Review
              </h4>
              <p style={{ color: '#475569', fontSize: '14px', lineHeight: '1.6', maxWidth: '480px', margin: '0 auto 20px' }}>
                Your video has been securely stored and submitted to our verification team. Once approved, your account will be marked <strong>Verified &amp; Gig-Eligible</strong> and you will receive notifications when new advertising gigs are assigned to you.
              </p>
              <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '10px', padding: '14px', maxWidth: '400px', margin: '0 auto 24px', fontSize: '13px' }}>
                <div>Status: <span className="badge badge-warning" style={{ fontSize: '13px', padding: '4px 10px' }}>Pending Approval</span></div>
                <div style={{ color: '#64748b', marginTop: '4px' }}>Estimated review time: 1-4 business hours</div>
              </div>
              <button
                type="button"
                className="btn btn-primary"
                onClick={onClose}
                style={{ padding: '12px 32px', borderRadius: '8px', fontWeight: '600' }}
              >
                Done &bull; Return to Dashboard
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
