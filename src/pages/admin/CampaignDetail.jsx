import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import DashboardLayout from '../../layouts/DashboardLayout';
import {
  adminGetCampaign,
  adminUpdateCampaign,
  adminMatchInfluencers,
  adminAssignGigs,
  adminVerifyPayment,
  adminSubmitCompletedWork,
} from '../../services/api';
import { resolveMediaUrl, downloadMedia } from '../../utils/media';
import { toast } from '../../components/ui/Toast';

export default function AdminCampaignDetail() {
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [campaign, setCampaign] = useState(null);
  const [gigs, setGigs] = useState([]);
  const [gigStats, setGigStats] = useState({});

  // Matching Engine State
  const [matchingLoading, setMatchingLoading] = useState(false);
  const [matchedInfluencers, setMatchedInfluencers] = useState([]);
  const [selectedInfluencers, setSelectedInfluencers] = useState([]); // Array of IDs
  const [customReward, setCustomReward] = useState('');

  // Status Change State
  const [newStatus, setNewStatus] = useState('');
  const [savingStatus, setSavingStatus] = useState(false);

  // Payment Verification State
  const [paymentActionLoading, setPaymentActionLoading] = useState(false);
  const [rejectReasonPrompt, setRejectReasonPrompt] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');

  // Completed Work Submission State
  const [workSummary, setWorkSummary] = useState('');
  const [workNotes, setWorkNotes] = useState('');
  const [workFiles, setWorkFiles] = useState([]);
  const [submittingWork, setSubmittingWork] = useState(false);
  const [workUploadProgress, setWorkUploadProgress] = useState(0);

  // Vendor Profile & Media Gallery State
  const [vendorProfile, setVendorProfile] = useState(null);
  const [selectedMediaIndex, setSelectedMediaIndex] = useState(0);
  const [copiedAdCopy, setCopiedAdCopy] = useState(false);
  const [modalImage, setModalImage] = useState(null);

  useEffect(() => {
    fetchDetail();
  }, [id]);

  const fetchDetail = async () => {
    try {
      setLoading(true);
      const { data } = await adminGetCampaign(id);
      setCampaign(data.campaign);
      if (data.vendorProfile) setVendorProfile(data.vendorProfile);
      setGigs(data.gigs || []);
      setGigStats(data.gigStats || {});
      setNewStatus(data.campaign?.status || '');
      // Automatically run match query using campaign defaults
      if (data.campaign) {
        runMatching(data.campaign);
      }
    } catch (err) {
      toast.error('Failed to load campaign.');
    } finally {
      setLoading(false);
    }
  };

  const runMatching = async (camp) => {
    try {
      setMatchingLoading(true);
      const isNationwide = camp.isNationwide || camp.targetLocation?.isNationwide || false;
      const targetStates = camp.targetStates?.length
        ? camp.targetStates
        : (camp.targetLocation?.state ? [camp.targetLocation.state] : []);

      const params = {
        isNationwide: isNationwide ? 'true' : 'false',
        states: targetStates.join(','),
        state: camp.targetLocation?.state || '',
        area: camp.targetLocation?.area || '',
        category: camp.category || '',
        availability: 'true',
        excludeCampaignId: camp._id,
      };
      const { data } = await adminMatchInfluencers(params);
      setMatchedInfluencers(data.influencers || []);
    } catch {
      // fallback
    } finally {
      setMatchingLoading(false);
    }
  };

  const handleToggleSelect = (inf) => {
    const isSelected = selectedInfluencers.some((item) => item._id === inf._id);
    if (isSelected) {
      setSelectedInfluencers(selectedInfluencers.filter((item) => item._id !== inf._id));
    } else {
      setSelectedInfluencers([...selectedInfluencers, inf]);
    }
  };

  // Dynamic Reach Calculation
  const requiredReach = campaign?.requiredViews || 0;
  const currentAssignedReach = campaign?.assignedReach || 0;
  const newlySelectedReach = selectedInfluencers.reduce(
    (acc, inf) => acc + (inf.verifiedViews || inf.averageViews || 1000),
    0
  );
  const totalProspectiveReach = currentAssignedReach + newlySelectedReach;
  const remainingReach = Math.max(0, requiredReach - totalProspectiveReach);
  const isTargetReached = totalProspectiveReach >= requiredReach;

  // Extract all creative media items
  const creativeMediaList = [];
  if (campaign?.mediaList && Array.isArray(campaign.mediaList) && campaign.mediaList.length > 0) {
    campaign.mediaList.forEach((m) => {
      if (m?.url) creativeMediaList.push(m);
    });
  }
  if (creativeMediaList.length === 0 && campaign?.media?.url) {
    creativeMediaList.push(campaign.media);
  }
  if (creativeMediaList.length === 0 && campaign?.advertMedia?.url) {
    creativeMediaList.push(campaign.advertMedia);
  }
  if (creativeMediaList.length === 0 && campaign?.mediaUrl) {
    creativeMediaList.push({ url: campaign.mediaUrl, type: 'image' });
  }
  if (creativeMediaList.length === 0 && campaign?.adImage) {
    creativeMediaList.push({ url: campaign.adImage, type: 'image' });
  }

  const activeMedia = creativeMediaList[selectedMediaIndex] || creativeMediaList[0] || null;

  const handleCopyAdCopy = () => {
    const textToCopy = campaign?.adCopy || campaign?.description || '';
    if (!textToCopy) return;
    navigator.clipboard.writeText(textToCopy);
    setCopiedAdCopy(true);
    toast.success('Advert copy copied to clipboard!');
    setTimeout(() => setCopiedAdCopy(false), 2500);
  };

  const handleAssignGigs = async () => {
    if (selectedInfluencers.length === 0) {
      toast.warning('Please select at least one influencer to assign.');
      return;
    }

    try {
      // Calculate reward proportional to views or fixed default
      const defaultPerView = (campaign.price * 0.7) / requiredReach; // ~70% payout ratio default

      const assignments = selectedInfluencers.map((inf) => {
        const infViews = inf.verifiedViews || inf.averageViews || 1000;
        const calculatedReward = customReward
          ? Number(customReward)
          : Math.max(1000, Math.round(infViews * defaultPerView));

        return {
          influencerId: inf.userId._id,
          assignedViews: infViews,
          reward: calculatedReward,
        };
      });

      const { data } = await adminAssignGigs({
        campaignId: campaign._id,
        assignments,
      });

      toast.success(data.message || 'Gigs assigned successfully!');
      setSelectedInfluencers([]);
      fetchDetail();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to assign gigs.');
    }
  };

  const handleStatusUpdate = async () => {
    setSavingStatus(true);
    try {
      const { data } = await adminUpdateCampaign(id, { status: newStatus });
      toast.success('Campaign status updated to: ' + newStatus);
      setCampaign(data.campaign);
    } catch (err) {
      toast.error('Failed to update campaign status.');
    } finally {
      setSavingStatus(false);
    }
  };

  const handleVerifyPaymentDecision = async (decision) => {
    if (decision === 'rejected' && !rejectionReason.trim()) {
      toast.warning('Please provide a reason for rejecting this payment.');
      return;
    }
    setPaymentActionLoading(true);
    try {
      const { data } = await adminVerifyPayment(id, {
        decision,
        rejectionReason: decision === 'rejected' ? rejectionReason.trim() : undefined,
      });
      toast.success(data.message || `Payment ${decision} successfully`);
      fetchDetail();
      setRejectReasonPrompt(false);
      setRejectionReason('');
    } catch (err) {
      toast.error(err.response?.data?.message || `Failed to set payment to ${decision}.`);
    } finally {
      setPaymentActionLoading(false);
    }
  };

  const handleSubmitWork = async (e) => {
    e.preventDefault();
    if (!workSummary.trim()) {
      toast.warning('Please provide a completion summary for the vendor.');
      return;
    }
    setSubmittingWork(true);
    setWorkUploadProgress(0);
    try {
      const formData = new FormData();
      formData.append('summary', workSummary.trim());
      if (workNotes) formData.append('notes', workNotes.trim());
      if (workFiles && workFiles.length > 0) {
        for (let i = 0; i < workFiles.length; i++) {
          formData.append('evidence', workFiles[i]);
        }
      }

      const { data } = await adminSubmitCompletedWork(id, formData, (progressEvent) => {
        if (progressEvent.total) {
          const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          setWorkUploadProgress(percent);
        }
      });

      toast.success(data.message || 'Completed work submitted for vendor review!');
      setCampaign(data.campaign);
      setWorkSummary('');
      setWorkNotes('');
      setWorkFiles([]);
      setWorkUploadProgress(0);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to submit completed work.');
    } finally {
      setSubmittingWork(false);
    }
  };

  if (loading) {
    return (
      <DashboardLayout title="Campaign Broker Workspace" role="admin">
        <div style={{ textAlign: 'center', padding: '60px' }}>
          <div className="spinner" style={{ margin: '0 auto 16px' }} />
          <p style={{ color: '#64748b' }}>Loading campaign workspace...</p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout title={`Order #${campaign.orderNumber}`} role="admin">
      <div style={{ marginBottom: '20px' }}>
        <Link to="/admin/campaigns" style={{ color: '#059669', fontWeight: '600', fontSize: '14px' }}>
          ← Back to Campaigns
        </Link>
      </div>

      {/* Top Campaign Summary & Status Controller */}
      <div className="card" style={{ padding: '24px', marginBottom: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
              <span className="badge badge-info">#{campaign.orderNumber}</span>
              <h2 style={{ fontSize: '1.5rem', margin: 0 }}>{campaign.title}</h2>
              <span className="badge badge-muted">{campaign.category}</span>
              <span className={`badge ${campaign.paymentStatus === 'confirmed' ? 'badge-success' : campaign.paymentStatus === 'submitted' ? 'badge-warning' : 'badge-outline'}`}>
                Payment: {campaign.paymentStatus?.toUpperCase() || 'PENDING'}
              </span>
            </div>
            <div style={{ color: '#64748b', fontSize: '13px', marginTop: '8px' }}>
              Advertiser: <strong>{campaign.vendorId?.name}</strong>{' '}
              {vendorProfile?.businessName && (
                <span style={{ color: '#059669', fontWeight: '600' }}>({vendorProfile.businessName})</span>
              )}{' '}
              • Email: <strong>{campaign.vendorId?.email}</strong> • WhatsApp:{' '}
              <strong style={{ color: '#059669' }}>
                {campaign.vendorId?.whatsappNumber || vendorProfile?.whatsapp || campaign.vendorId?.phone || vendorProfile?.phone || 'N/A'}
              </strong>
            </div>
            <div style={{ color: '#475569', fontSize: '13px', marginTop: '4px' }}>
              Target Geography:{' '}
              {campaign.isNationwide ? (
                <span className="badge badge-success" style={{ marginLeft: '4px' }}>
                  {campaign.targetCountry ? `${campaign.targetCountry} - ` : ''}Nationwide (All Regions)
                </span>
              ) : (
                <span>
                  <strong>{campaign.targetCountry || 'Global'}</strong>
                  {campaign.targetRegion && <span> → <strong>{campaign.targetRegion}</strong></span>}
                  {campaign.targetAreas?.length > 0 && (
                    <span style={{ display: 'inline-flex', flexWrap: 'wrap', gap: '4px', marginLeft: '6px' }}>
                      {campaign.targetAreas.map((area) => (
                        <span key={area} className="badge badge-outline" style={{ fontSize: '11px' }}>{area}</span>
                      ))}
                    </span>
                  )}
                </span>
              )}
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <select
                className="form-control"
                style={{ width: '190px' }}
                value={newStatus}
                onChange={(e) => setNewStatus(e.target.value)}
              >
                {[
                  'Draft', 'Submitted', 'Awaiting Payment', 'Payment Confirmed',
                  'Under Review', 'Approved', 'Processing', 'Influencers Assigned',
                  'Active', 'Awaiting Proof', 'Submitted for Vendor Review', 'Completed', 'Rejected', 'Cancelled',
                ].map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
              <button
                onClick={handleStatusUpdate}
                disabled={savingStatus}
                className="btn btn-primary"
              >
                Update Status
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* SIDE-BY-SIDE: ADVERT CREATIVE & PAYMENT RECEIPT AUDIT */}
      <div className="grid-2" style={{ gap: '24px', marginBottom: '24px', alignItems: 'stretch' }}>
        {/* Left: Advert Creative Submission & Full Campaign Specs */}
        <div className="card" style={{ display: 'flex', flexDirection: 'column' }}>
          <div className="card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
            <h3 style={{ fontSize: '1.15rem', margin: 0 }}>📢 Advert Creative &amp; Full Campaign Specs</h3>
            <span className="badge badge-muted" style={{ fontWeight: '700' }}>
              ₦{Number(campaign.price).toLocaleString()} {campaign.currency || 'NGN'} Budget
            </span>
          </div>

          <div className="card-body" style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {/* Multi-Image Gallery */}
            {creativeMediaList.length > 0 ? (
              <div style={{ background: '#f8fafc', padding: '14px', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                  <span style={{ fontSize: '12px', fontWeight: '700', color: '#0f172a', textTransform: 'uppercase' }}>
                    📸 Submitted Creative Images ({creativeMediaList.length}):
                  </span>
                  {activeMedia?.url && (
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button
                        type="button"
                        onClick={() => downloadMedia(activeMedia.url, `${campaign.orderNumber}-creative-${selectedMediaIndex + 1}`)}
                        className="btn btn-sm btn-outline"
                        style={{ fontSize: '12px', padding: '4px 10px', display: 'flex', alignItems: 'center', gap: '4px' }}
                      >
                        ⬇ Download Image
                      </button>
                      <a
                        href={resolveMediaUrl(activeMedia.url)}
                        target="_blank"
                        rel="noreferrer"
                        className="btn btn-sm btn-ghost"
                        style={{ fontSize: '12px', padding: '4px 8px', color: '#2563eb' }}
                      >
                        Open Full ↗
                      </a>
                    </div>
                  )}
                </div>

                {/* Featured / Active Image Display */}
                {activeMedia && (
                  <div
                    onClick={() => setModalImage(resolveMediaUrl(activeMedia.url))}
                    style={{
                      borderRadius: '8px',
                      overflow: 'hidden',
                      border: '1px solid #cbd5e1',
                      maxHeight: '260px',
                      background: '#0f172a',
                      textAlign: 'center',
                      cursor: 'pointer',
                      position: 'relative',
                      marginBottom: creativeMediaList.length > 1 ? '10px' : 0,
                    }}
                    title="Click to zoom"
                  >
                    <img
                      src={resolveMediaUrl(activeMedia.url)}
                      alt="Advert Creative"
                      style={{ maxHeight: '260px', width: 'auto', maxWidth: '100%', objectFit: 'contain' }}
                    />
                    <div
                      style={{
                        position: 'absolute',
                        bottom: '8px',
                        right: '8px',
                        background: 'rgba(15, 23, 42, 0.75)',
                        color: 'white',
                        padding: '3px 8px',
                        borderRadius: '4px',
                        fontSize: '11px',
                        fontWeight: '600',
                      }}
                    >
                      Image {selectedMediaIndex + 1} of {creativeMediaList.length} • Click to Zoom
                    </div>
                  </div>
                )}

                {/* Thumbnail Strip (if multiple images) */}
                {creativeMediaList.length > 1 && (
                  <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '4px' }}>
                    {creativeMediaList.map((m, idx) => {
                      const isSelected = idx === selectedMediaIndex;
                      return (
                        <div
                          key={idx}
                          onClick={() => setSelectedMediaIndex(idx)}
                          style={{
                            width: '64px',
                            height: '64px',
                            minWidth: '64px',
                            borderRadius: '6px',
                            overflow: 'hidden',
                            cursor: 'pointer',
                            border: isSelected ? '2px solid #059669' : '1px solid #cbd5e1',
                            opacity: isSelected ? 1 : 0.7,
                            transition: 'all 0.15s',
                          }}
                        >
                          <img
                            src={resolveMediaUrl(m.url)}
                            alt={`Thumbnail ${idx + 1}`}
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                          />
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            ) : (
              <div style={{ padding: '16px', background: '#f8fafc', borderRadius: '8px', color: '#64748b', fontSize: '13px' }}>
                No creative images uploaded (Text-only broadcast or assets sent directly).
              </div>
            )}

            {/* Campaign Objective, Reach Package & Duration Specs */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '10px', background: '#f8fafc', padding: '12px', borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '13px' }}>
              <div>
                <span style={{ color: '#64748b', fontSize: '11px', textTransform: 'uppercase', display: 'block', fontWeight: '600' }}>Objective</span>
                <strong>{campaign.objective || 'Brand Awareness'}</strong>
              </div>
              <div>
                <span style={{ color: '#64748b', fontSize: '11px', textTransform: 'uppercase', display: 'block', fontWeight: '600' }}>Target Package</span>
                <strong>{campaign.reachPackageName || 'Custom'} ({Number(campaign.requiredViews || 0).toLocaleString()} Views)</strong>
              </div>
              <div>
                <span style={{ color: '#64748b', fontSize: '11px', textTransform: 'uppercase', display: 'block', fontWeight: '600' }}>Broadcast Duration</span>
                <strong>{campaign.duration || '24 Hours'}</strong>
              </div>
              <div>
                <span style={{ color: '#64748b', fontSize: '11px', textTransform: 'uppercase', display: 'block', fontWeight: '600' }}>Call To Action</span>
                <span className="badge badge-info" style={{ fontSize: '11px', marginTop: '2px' }}>
                  {campaign.callToAction?.actionType || 'WhatsApp'}
                </span>
                {campaign.callToAction?.targetValue && (
                  <div style={{ fontSize: '12px', marginTop: '2px', wordBreak: 'break-all' }}>
                    {campaign.callToAction.targetValue}
                  </div>
                )}
              </div>
            </div>

            {/* Brief Campaign Summary */}
            <div>
              <label style={{ fontSize: '12px', fontWeight: '700', color: '#64748b', textTransform: 'uppercase' }}>
                Brief Campaign Summary:
              </label>
              <div style={{ background: '#f8fafc', padding: '12px', borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '14px', marginTop: '4px' }}>
                {campaign.description || 'No description provided.'}
              </div>
            </div>

            {/* Advert Caption / WhatsApp Copy */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <label style={{ fontSize: '12px', fontWeight: '700', color: '#64748b', textTransform: 'uppercase' }}>
                  Advert Caption / WhatsApp Copy (For Influencers):
                </label>
                {(campaign.adCopy || campaign.caption) && (
                  <button
                    type="button"
                    onClick={handleCopyAdCopy}
                    className="btn btn-sm btn-ghost"
                    style={{ fontSize: '11px', padding: '2px 8px', color: copiedAdCopy ? '#059669' : '#2563eb' }}
                  >
                    {copiedAdCopy ? '✓ Copied' : '📋 Copy Text'}
                  </button>
                )}
              </div>
              <div style={{ background: '#f8fafc', padding: '12px', borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '14px', whiteSpace: 'pre-wrap', marginTop: '4px' }}>
                {campaign.adCopy || campaign.caption || 'No specific text copy provided.'}
              </div>
            </div>

            {/* Special Instructions (if any) */}
            {campaign.instructions && (
              <div>
                <label style={{ fontSize: '12px', fontWeight: '700', color: '#b45309', textTransform: 'uppercase' }}>
                  Special Advertiser Instructions:
                </label>
                <div style={{ background: '#fffbeb', border: '1px solid #fde68a', padding: '12px', borderRadius: '8px', fontSize: '13px', color: '#92400e', marginTop: '4px' }}>
                  {campaign.instructions}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right: Payment Receipt & Verification Audit */}
        <div className="card" style={{ display: 'flex', flexDirection: 'column' }}>
          <div className="card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ fontSize: '1.15rem', margin: 0 }}>💳 Payment Receipt Audit</h3>
            <span className={`badge ${campaign.paymentStatus === 'confirmed' ? 'badge-success' : campaign.paymentStatus === 'rejected' ? 'badge-error' : 'badge-warning'}`}>
              {campaign.paymentStatus === 'confirmed' ? '✓ Verified' : campaign.paymentStatus === 'rejected' ? '✗ Rejected' : 'Needs Verification'}
            </span>
          </div>
          <div className="card-body" style={{ flex: 1 }}>
            {campaign.paymentReceipt?.url || campaign.proofImage ? (
              <div style={{ marginBottom: '14px' }}>
                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginBottom: '8px' }}>
                  <button
                    type="button"
                    onClick={() => downloadMedia(campaign.paymentReceipt?.url || campaign.proofImage, `${campaign.orderNumber}-payment-receipt`)}
                    className="btn btn-sm btn-outline"
                    style={{ fontSize: '12px', padding: '4px 10px', display: 'flex', alignItems: 'center', gap: '4px' }}
                  >
                    ⬇ Download Receipt
                  </button>
                  <a
                    href={resolveMediaUrl(campaign.paymentReceipt?.url || campaign.proofImage)}
                    target="_blank"
                    rel="noreferrer"
                    className="btn btn-sm btn-ghost"
                    style={{ fontSize: '12px', padding: '4px 8px', color: '#2563eb' }}
                  >
                    Open Full ↗
                  </a>
                </div>
                <div
                  onClick={() => setModalImage(resolveMediaUrl(campaign.paymentReceipt?.url || campaign.proofImage))}
                  style={{ cursor: 'pointer', textAlign: 'center', background: '#0f172a', borderRadius: '8px', border: '1px solid #cbd5e1', overflow: 'hidden' }}
                  title="Click to zoom receipt"
                >
                  <img
                    src={resolveMediaUrl(campaign.paymentReceipt?.url || campaign.proofImage)}
                    alt="Payment Receipt"
                    style={{ width: '100%', maxHeight: '220px', objectFit: 'contain' }}
                  />
                </div>
                <div style={{ fontSize: '12px', color: '#64748b', marginTop: '4px', textAlign: 'right' }}>
                  Uploaded: {campaign.paymentReceipt?.uploadedAt ? new Date(campaign.paymentReceipt.uploadedAt).toLocaleString() : 'N/A'}
                </div>
              </div>
            ) : (
              <div style={{ padding: '24px', background: '#fffbeb', borderRadius: '8px', border: '1px dashed #f59e0b', color: '#b45309', fontSize: '13px', textAlign: 'center', marginBottom: '14px' }}>
                ⚠️ No payment receipt has been submitted by the vendor yet.
              </div>
            )}

            {campaign.paymentReview?.decision && (
              <div style={{ background: campaign.paymentReview.decision === 'confirmed' ? '#ecfdf5' : '#fef2f2', padding: '12px', borderRadius: '8px', marginBottom: '14px', fontSize: '13px' }}>
                <strong>Audit Decision:</strong> {campaign.paymentReview.decision.toUpperCase()} on{' '}
                {new Date(campaign.paymentReview.reviewedAt).toLocaleDateString()}
                {campaign.paymentReview.rejectionReason && (
                  <div style={{ color: '#b91c1c', marginTop: '4px' }}>
                    Reason: {campaign.paymentReview.rejectionReason}
                  </div>
                )}
              </div>
            )}

            {/* Verification Actions */}
            {campaign.paymentStatus !== 'confirmed' && (
              <div style={{ marginTop: 'auto', paddingTop: '12px', borderTop: '1px solid #f1f5f9' }}>
                {rejectReasonPrompt ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <label style={{ fontSize: '13px', fontWeight: '600', color: '#b91c1c' }}>Reason for rejecting payment:</label>
                    <textarea
                      className="form-control"
                      rows={2}
                      placeholder="e.g. Transaction reference not found on bank statement..."
                      value={rejectionReason}
                      onChange={(e) => setRejectionReason(e.target.value)}
                    />
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button
                        type="button"
                        onClick={() => handleVerifyPaymentDecision('rejected')}
                        disabled={paymentActionLoading}
                        className="btn btn-danger"
                        style={{ flex: 1 }}
                      >
                        Confirm Rejection
                      </button>
                      <button
                        type="button"
                        onClick={() => setRejectReasonPrompt(false)}
                        className="btn btn-outline"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <div style={{ display: 'flex', gap: '10px' }}>
                    <button
                      type="button"
                      onClick={() => handleVerifyPaymentDecision('confirmed')}
                      disabled={paymentActionLoading}
                      className="btn btn-success"
                      style={{ flex: 1 }}
                    >
                      ✓ Confirm Payment (₦{Number(campaign.price).toLocaleString()})
                    </button>
                    <button
                      type="button"
                      onClick={() => setRejectReasonPrompt(true)}
                      disabled={paymentActionLoading}
                      className="btn btn-outline"
                      style={{ color: '#b91c1c', borderColor: '#fca5a5' }}
                    >
                      Reject
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* SECTION 37: DYNAMIC REACH CALCULATOR */}
      <div className="card" style={{ padding: '24px', marginBottom: '28px', background: isTargetReached ? '#ecfdf5' : '#f8fafc', border: isTargetReached ? '2px solid #059669' : '1px solid #e2e8f0' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <h3 style={{ fontSize: '1.2rem', margin: 0, color: isTargetReached ? '#065f46' : '#0f172a' }}>
               Campaign Reach Allocation
            </h3>
            <p style={{ margin: '4px 0 0', fontSize: '13px', color: '#64748b' }}>
              Required: <strong>{Number(requiredReach).toLocaleString()} Views</strong> •
              Assigned: <strong>{Number(currentAssignedReach).toLocaleString()} Views</strong> •
              Selected: <strong style={{ color: '#2563eb' }}>+{Number(newlySelectedReach).toLocaleString()} Views</strong>
            </p>
          </div>

          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '12px', color: '#64748b' }}>Remaining to Target</div>
            <div style={{ fontSize: '1.8rem', fontWeight: '900', color: isTargetReached ? '#059669' : '#d97706' }}>
              {isTargetReached ? '✓ Target Reached!' : `${Number(remainingReach).toLocaleString()} Views`}
            </div>
          </div>
        </div>
      </div>

      <div className="grid-2" style={{ gap: '28px', alignItems: 'flex-start' }}>
        {/* Left Column: SECTION 36 - INFLUENCER MATCHING ENGINE */}
        <div className="card">
          <div className="card-header">
            <div>
              <h3 style={{ fontSize: '1.2rem' }}> Matched Available Influencers</h3>
              <p style={{ margin: 0, fontSize: '12px', color: '#64748b' }}>
                Filtered by: Coverage ({campaign.isNationwide ? 'Nationwide' : campaign.targetStates?.join(', ') || campaign.targetLocation?.state || 'Any'}), Category ({campaign.category || 'All'})
              </p>
            </div>
            {selectedInfluencers.length > 0 && (
              <span className="badge badge-success">{selectedInfluencers.length} Selected</span>
            )}
          </div>

          <div className="card-body" style={{ padding: 0 }}>
            {matchingLoading ? (
              <div style={{ textAlign: 'center', padding: '40px' }}>
                <div className="spinner" style={{ margin: '0 auto 12px' }} />
                <p style={{ color: '#64748b' }}>Filtering matching influencers...</p>
              </div>
            ) : matchedInfluencers.length === 0 ? (
              <div className="empty-state" style={{ padding: '40px 20px' }}>
                
                <h4>No unassigned influencers found for this exact area</h4>
                <p>Check the main directory to onboard or verify more creators.</p>
              </div>
            ) : (
              <div style={{ maxHeight: '420px', overflowY: 'auto' }}>
                {matchedInfluencers.map((inf) => {
                  const isSelected = selectedInfluencers.some((item) => item._id === inf._id);
                  const views = inf.verifiedViews || inf.averageViews || 1000;
                  return (
                    <div
                      key={inf._id}
                      onClick={() => handleToggleSelect(inf)}
                      style={{
                        padding: '14px 20px',
                        borderBottom: '1px solid #f1f5f9',
                        background: isSelected ? '#ecfdf5' : 'white',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        cursor: 'pointer',
                        transition: 'background 0.15s',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => {}} // handled by parent onClick
                          style={{ width: '18px', height: '18px', accentColor: '#059669' }}
                        />
                        <div>
                          <strong>{inf.userId?.name}</strong>
                          <div style={{ fontSize: '12px', color: '#64748b' }}>
                             {inf.area}, {inf.state} • Score: {inf.reliabilityScore || 100}%
                          </div>
                        </div>
                      </div>

                      <div style={{ textAlign: 'right' }}>
                        <div style={{ fontWeight: '800', color: '#059669', fontSize: '15px' }}>
                          {Number(views).toLocaleString()} views
                        </div>
                        <div style={{ fontSize: '11px', color: '#94a3b8' }}>
                          Verified Tier
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          <div className="card-footer" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ fontSize: '13px', color: '#64748b' }}>
              {selectedInfluencers.length} influencers selected (+{Number(newlySelectedReach).toLocaleString()} reach)
            </div>
            <button
              onClick={handleAssignGigs}
              disabled={selectedInfluencers.length === 0}
              className="btn btn-primary"
            >
              Assign Gigs Now →
            </button>
          </div>
        </div>

        {/* Right Column: SECTION 38 - CAMPAIGN GIG TRACKING */}
        <div className="card">
          <div className="card-header">
            <div>
              <h3 style={{ fontSize: '1.2rem' }}> Distributed Gigs ({gigStats.total || 0})</h3>
              <p style={{ margin: 0, fontSize: '12px', color: '#64748b' }}>
                {gigStats.approved || 0} Completed • {gigStats.submitted || 0} In Review • {gigStats.assigned || 0} Awaiting Acceptance
              </p>
            </div>
          </div>

          <div className="card-body" style={{ padding: 0 }}>
            {gigs.length === 0 ? (
              <div className="empty-state" style={{ padding: '40px 20px' }}>
                
                <h4>No gigs assigned yet</h4>
                <p>Select matched influencers on the left and click "Assign Gigs Now".</p>
              </div>
            ) : (
              <div style={{ maxHeight: '480px', overflowY: 'auto' }}>
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Influencer</th>
                      <th>Views</th>
                      <th>Reward</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {gigs.map((g) => (
                      <tr key={g._id}>
                        <td>
                          <strong>{g.influencerId?.name}</strong>
                          <div style={{ fontSize: '11px', color: '#94a3b8' }}>#{g.gigNumber}</div>
                        </td>
                        <td>
                          <strong>{Number(g.assignedViews).toLocaleString()}</strong>
                        </td>
                        <td>
                          <span style={{ color: '#059669', fontWeight: '700' }}>
                            ₦{Number(g.reward).toLocaleString()}
                          </span>
                        </td>
                        <td>
                          {g.status === 'approved' && <span className="badge badge-success">✓ Completed</span>}
                          {g.status === 'submitted' && <span className="badge badge-warning"> In Review</span>}
                          {g.status === 'accepted' && <span className="badge badge-info">Active</span>}
                          {g.status === 'assigned' && <span className="badge badge-muted">Assigned</span>}
                          {g.status === 'declined' && <span className="badge badge-error">Declined</span>}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* SECTION: COMPLETED WORK SUBMISSION & VENDOR REVIEW STATUS */}
      <div className="card" style={{ marginTop: '24px' }}>
        <div className="card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
          <div>
            <h3 style={{ fontSize: '1.2rem', margin: 0 }}>🏁 Campaign Delivery & Completed Work Review</h3>
            <p style={{ margin: '4px 0 0', fontSize: '12px', color: '#64748b' }}>
              Compile final delivery evidence and submit to the advertiser for sign-off or resolution.
            </p>
          </div>
          {campaign.completedWork?.vendorReviewStatus && (
            <span className={`badge ${
              campaign.completedWork.vendorReviewStatus === 'accepted' ? 'badge-success' :
              campaign.completedWork.vendorReviewStatus === 'issue_raised' ? 'badge-error' : 'badge-warning'
            }`}>
              Vendor Status: {campaign.completedWork.vendorReviewStatus.toUpperCase()}
            </span>
          )}
        </div>

        <div className="card-body">
          {/* Active Vendor Review Alert if Issue Raised */}
          {campaign.completedWork?.vendorReviewStatus === 'issue_raised' && (
            <div style={{ background: '#fef2f2', border: '1px solid #fecaca', borderRadius: '8px', padding: '16px', marginBottom: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#b91c1c', fontWeight: '700', marginBottom: '4px' }}>
                ⚠️ Advertiser Raised an Issue on Submitted Delivery
              </div>
              <p style={{ margin: 0, fontSize: '14px', color: '#7f1d1d' }}>
                "{campaign.completedWork.vendorReviewComment || 'Advertiser requested revisions or reported non-delivery.'}"
              </p>
            </div>
          )}

          {campaign.completedWork?.vendorReviewStatus === 'accepted' && (
            <div style={{ background: '#ecfdf5', border: '1px solid #a7f3d0', borderRadius: '8px', padding: '16px', marginBottom: '20px', color: '#065f46' }}>
              <strong>✓ Advertiser Accepted Completed Work:</strong> The advertiser has reviewed and accepted this campaign's delivery proof.
            </div>
          )}

          {/* Current Submitted Completed Work Summary if any */}
          {campaign.completedWork?.summary && (
            <div style={{ background: '#f8fafc', padding: '16px', borderRadius: '8px', border: '1px solid #e2e8f0', marginBottom: '24px' }}>
              <div style={{ fontSize: '12px', color: '#64748b', fontWeight: '700', textTransform: 'uppercase', marginBottom: '6px' }}>
                Latest Delivery Submission (Submitted {new Date(campaign.completedWork.submittedAt).toLocaleString()}):
              </div>
              <div style={{ fontSize: '14px', whiteSpace: 'pre-wrap', marginBottom: '12px' }}>
                {campaign.completedWork.summary}
              </div>
              {campaign.completedWork.notes && (
                <div style={{ fontSize: '13px', color: '#475569', marginBottom: '12px' }}>
                  <strong>Admin Notes:</strong> {campaign.completedWork.notes}
                </div>
              )}
              {campaign.completedWork.evidenceUrls?.length > 0 && (
                <div>
                  <div style={{ fontSize: '12px', color: '#64748b', marginBottom: '8px' }}>Delivery Evidence Files:</div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                    {campaign.completedWork.evidenceUrls.map((ev, idx) => (
                      <a
                        key={idx}
                        href={ev.url}
                        target="_blank"
                        rel="noreferrer"
                        style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '6px 12px', background: 'white', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '13px', textDecoration: 'none', color: '#2563eb' }}
                      >
                        📄 {ev.caption || `Evidence #${idx + 1}`} ↗
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Submission Form for Admin */}
          <form onSubmit={handleSubmitWork} style={{ borderTop: campaign.completedWork?.summary ? '1px dashed #e2e8f0' : 'none', paddingTop: campaign.completedWork?.summary ? '20px' : 0 }}>
            <h4 style={{ fontSize: '1rem', marginBottom: '12px' }}>
              {campaign.completedWork?.summary ? 'Submit Revised Delivery Proof' : 'Submit Delivery Proof to Advertiser'}
            </h4>

            <div className="form-group">
              <label className="form-label">Delivery Summary (Visible to Vendor) *</label>
              <textarea
                required
                rows={3}
                className="form-control"
                placeholder="Detail the execution of the campaign: views achieved, influencer links, delivery timeframe..."
                value={workSummary}
                onChange={(e) => setWorkSummary(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Internal / Vendor Notes (Optional)</label>
              <input
                type="text"
                className="form-control"
                placeholder="Additional details or reference IDs..."
                value={workNotes}
                onChange={(e) => setWorkNotes(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Upload Evidence Files (Screenshots, Compilation Videos, PDFs - max 5 files)</label>
              <input
                type="file"
                multiple
                accept="image/*,video/*,.pdf"
                className="form-control"
                onChange={(e) => setWorkFiles(Array.from(e.target.files || []))}
              />
              <span className="form-hint">Selected: {workFiles.length} file(s)</span>
            </div>

            {submittingWork && workUploadProgress > 0 && (
              <div style={{ marginBottom: '16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: '#64748b', marginBottom: '4px' }}>
                  <span>Uploading delivery evidence...</span>
                  <span>{workUploadProgress}%</span>
                </div>
                <div style={{ width: '100%', height: '8px', background: '#e2e8f0', borderRadius: '4px', overflow: 'hidden' }}>
                  <div style={{ width: `${workUploadProgress}%`, height: '100%', background: '#059669', transition: 'width 0.2s' }} />
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={submittingWork}
              className="btn btn-primary"
            >
              {submittingWork ? 'Uploading & Submitting...' : '🚀 Submit Delivery Proof to Vendor'}
            </button>
          </form>
        </div>
      </div>

      {/* Modal Zoom Overlay for Images / Receipts */}
      {modalImage && (
        <div
          onClick={() => setModalImage(null)}
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.85)',
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'zoom-out',
            padding: '20px'
          }}
        >
          <div style={{ position: 'relative', maxWidth: '90vw', maxHeight: '90vh' }} onClick={(e) => e.stopPropagation()}>
            <img
              src={modalImage}
              alt="Zoomed Media"
              style={{
                maxWidth: '90vw',
                maxHeight: '85vh',
                objectFit: 'contain',
                borderRadius: '8px',
                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)'
              }}
            />
            <div style={{ textAlign: 'center', marginTop: '12px', display: 'flex', justifyContent: 'center', gap: '8px' }}>
              <button
                type="button"
                className="btn btn-sm"
                style={{ background: '#059669', color: '#fff' }}
                onClick={() => downloadMedia(modalImage, `${campaign.orderNumber}-view`)}
              >
                ⬇ Download
              </button>
              <a
                href={modalImage}
                target="_blank"
                rel="noreferrer"
                className="btn btn-sm"
                style={{ background: '#3b82f6', color: '#fff' }}
              >
                ↗ Open in New Tab
              </a>
              <button
                type="button"
                className="btn btn-sm"
                style={{ background: '#475569', color: '#fff' }}
                onClick={() => setModalImage(null)}
              >
                ✕ Close
              </button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
