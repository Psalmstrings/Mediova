import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import DashboardLayout from '../../layouts/DashboardLayout';
import {
  getVendorCampaign,
  getOrderOptions,
  submitPaymentReceipt,
  reviewCompletedWork,
  submitRefundRequest,
  getMyRefundRequests,
} from '../../services/api';
import { toast } from '../../components/ui/Toast';
import { resolveMediaUrl, downloadMedia } from '../../utils/media';

export default function VendorOrderDetail() {
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [campaign, setCampaign] = useState(null);
  const [payment, setPayment] = useState(null);
  const [paymentSettings, setPaymentSettings] = useState(null);
  const [selectedMediaIndex, setSelectedMediaIndex] = useState(0);
  const [modalImage, setModalImage] = useState(null);

  // Completed work review state
  const [issueComment, setIssueComment] = useState('');
  const [showIssueModal, setShowIssueModal] = useState(false);
  const [reviewingWork, setReviewingWork] = useState(false);

  // Receipt upload state
  const [receiptFile, setReceiptFile] = useState(null);
  const [receiptPreview, setReceiptPreview] = useState(null);
  const [uploadingReceipt, setUploadingReceipt] = useState(false);

  // Refund State
  const [existingRefund, setExistingRefund] = useState(null);
  const [showRefundModal, setShowRefundModal] = useState(false);
  const [refundForm, setRefundForm] = useState({
    reason: 'Campaign Cancelled Before Launch',
    description: '',
    accountName: '',
    bankName: 'Zenith Bank',
    accountNumber: '',
  });
  const [submittingRefund, setSubmittingRefund] = useState(false);

  useEffect(() => {
    fetchDetail();
  }, [id]);

  const fetchDetail = async () => {
    try {
      setLoading(true);
      const [cRes, oRes, rRes] = await Promise.all([
        getVendorCampaign(id),
        getOrderOptions(),
        getMyRefundRequests().catch(() => ({ data: { refunds: [] } })),
      ]);
      setCampaign(cRes.data.campaign);
      setPayment(cRes.data.payment);
      if (oRes.data.paymentSettings) setPaymentSettings(oRes.data.paymentSettings);

      const matchedRefund = rRes.data.refunds?.find(
        (r) => r.campaignId?._id === id || r.campaignId === id
      );
      if (matchedRefund) setExistingRefund(matchedRefund);
    } catch (err) {
      toast.error('Failed to load campaign timeline.');
    } finally {
      setLoading(false);
    }
  };

  const handleReceiptChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        toast.error('Receipt proof must be an image file (JPEG, PNG, WEBP).');
        return;
      }
      setReceiptFile(file);
      setReceiptPreview(URL.createObjectURL(file));
    }
  };

  const handleUploadReceiptSubmit = async (e) => {
    e.preventDefault();
    if (!receiptFile) {
      toast.warning('Please select a payment receipt image to upload.');
      return;
    }

    setUploadingReceipt(true);
    try {
      const formData = new FormData();
      formData.append('receipt', receiptFile);

      const res = await submitPaymentReceipt(id, formData);
      if (res.data.success) {
        toast.success('Payment receipt uploaded successfully! Admin will verify payment.');
        setCampaign(res.data.campaign);
        setPayment(res.data.payment);
        setReceiptFile(null);
        setReceiptPreview(null);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to upload receipt.');
    } finally {
      setUploadingReceipt(false);
    }
  };

  const handleWorkDecision = async (action, comments = '') => {
    setReviewingWork(true);
    try {
      const res = await reviewCompletedWork(id, { action, comments });
      toast.success(res.data.message);
      setCampaign(res.data.campaign);
      setShowIssueModal(false);
      setIssueComment('');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to process work review.');
    } finally {
      setReviewingWork(false);
    }
  };

  const handleRefundSubmit = async (e) => {
    e.preventDefault();
    const cleanNum = refundForm.accountNumber.replace(/[^0-9]/g, '');
    if (cleanNum.length < 8) {
      toast.error('Please enter a valid account number.');
      return;
    }
    if (!refundForm.description.trim()) {
      toast.warning('Please provide a reason explanation.');
      return;
    }

    setSubmittingRefund(true);
    try {
      const payload = {
        campaignId: campaign._id,
        reason: refundForm.reason,
        description: refundForm.description.trim(),
        bankDetails: {
          accountName: refundForm.accountName.trim(),
          bankName: refundForm.bankName.trim(),
          accountNumber: cleanNum,
        },
      };
      const { data } = await submitRefundRequest(payload);
      toast.success(data.message || 'Refund request submitted for administrative review.');
      setShowRefundModal(false);
      setExistingRefund(data.refund);
      fetchDetail();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to submit refund request.');
    } finally {
      setSubmittingRefund(false);
    }
  };

  if (loading) {
    return (
      <DashboardLayout title="Order Details" role="vendor">
        <div style={{ textAlign: 'center', padding: '60px' }}>
          <div className="spinner" style={{ margin: '0 auto 16px' }} />
          <p style={{ color: '#64748b' }}>Loading campaign details...</p>
        </div>
      </DashboardLayout>
    );
  }

  if (!campaign) {
    return (
      <DashboardLayout title="Order Details" role="vendor">
        <div className="card" style={{ padding: '40px', textAlign: 'center' }}>
          <h3>Order not found</h3>
          <Link to="/vendor/orders" className="btn btn-primary" style={{ marginTop: '16px' }}>
            Back to Orders
          </Link>
        </div>
      </DashboardLayout>
    );
  }

  const isCompletedWorkReady =
    campaign.status === 'Submitted for Vendor Review' ||
    (campaign.completedWork && campaign.completedWork.summary);

  const isWorkAccepted =
    campaign.status === 'Completed' ||
    campaign.completedWork?.vendorReviewStatus === 'accepted';

  const isIssueRaised =
    campaign.status === 'Issue Raised' ||
    campaign.completedWork?.vendorReviewStatus === 'issue_raised';

  const isPaymentPending =
    campaign.paymentStatus === 'unpaid' || campaign.paymentStatus === 'rejected';

  const isEligibleForRefund =
    campaign.paymentStatus === 'confirmed' &&
    campaign.status !== 'Completed' &&
    campaign.paymentStatus !== 'refunded';

  const targetLocationDisplay = campaign.isNationwide
    ? `${campaign.targetCountry || 'Global'} (Nationwide Distribution)`
    : `${campaign.targetRegion || 'Region'} (${campaign.targetAreas?.length ? campaign.targetAreas.join(', ') : campaign.targetLocation?.area || 'General'})`;

  // Extract all media items (supports multi-image mediaList and legacy single media)
  const allMedia = React.useMemo(() => {
    if (!campaign) return [];
    const list = [];
    if (Array.isArray(campaign.mediaList) && campaign.mediaList.length > 0) {
      campaign.mediaList.forEach((m, idx) => {
        if (m && (m.url || typeof m === 'string')) {
          list.push({
            url: resolveMediaUrl(m.url || m),
            type: m.type || 'image',
            title: `Creative #${idx + 1}`
          });
        }
      });
    } else if (campaign.media?.url) {
      list.push({
        url: resolveMediaUrl(campaign.media.url),
        type: campaign.media.type || 'image',
        title: 'Primary Creative'
      });
    } else if (campaign.advertMedia?.url) {
      list.push({
        url: resolveMediaUrl(campaign.advertMedia.url),
        type: campaign.advertMedia.type || 'image',
        title: 'Primary Creative'
      });
    } else if (campaign.mediaUrl) {
      list.push({
        url: resolveMediaUrl(campaign.mediaUrl),
        type: 'image',
        title: 'Primary Creative'
      });
    } else if (campaign.adImage) {
      list.push({
        url: resolveMediaUrl(campaign.adImage),
        type: 'image',
        title: 'Primary Creative'
      });
    }
    return list;
  }, [campaign]);

  const receiptUrl = resolveMediaUrl(
    campaign.paymentReceipt?.url || campaign.proofImage || payment?.receiptUrl
  );

  return (
    <DashboardLayout title={`Campaign #${campaign.orderNumber}`} role="vendor">
      <div style={{ marginBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Link to="/vendor/orders" style={{ color: '#059669', fontWeight: '600', fontSize: '14px', textDecoration: 'none' }}>
          &larr; Back to All Orders
        </Link>
        <div style={{ display: 'flex', gap: '8px' }}>
          {existingRefund && (
            <span className="badge badge-warning" style={{ padding: '6px 12px' }}>
              Refund Status: {existingRefund.status}
            </span>
          )}
          {isEligibleForRefund && !existingRefund && (
            <button
              type="button"
              className="btn btn-sm btn-ghost"
              style={{ color: '#dc2626' }}
              onClick={() => setShowRefundModal(true)}
            >
              Request Refund
            </button>
          )}
        </div>
      </div>

      {/* SECTION 16: COMPLETED WORK REVIEW PANEL (VENDOR REVIEW INTERFACE) */}
      {isCompletedWorkReady && (
        <div
          style={{
            background: isWorkAccepted ? '#f0fdf4' : isIssueRaised ? '#fef2f2' : '#eff6ff',
            border: isWorkAccepted ? '1px solid #bbf7d0' : isIssueRaised ? '1px solid #fecaca' : '1px solid #bfdbfe',
            borderRadius: '12px',
            padding: '24px',
            marginBottom: '28px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '14px' }}>
            <span style={{ fontSize: '28px' }}>
              {isWorkAccepted ? '✅' : isIssueRaised ? '⚠️' : '🎯'}
            </span>
            <div>
              <h3 style={{ margin: 0, fontSize: '1.25rem', color: isWorkAccepted ? '#166534' : isIssueRaised ? '#991b1b' : '#1e40af', fontWeight: '700' }}>
                {isWorkAccepted
                  ? 'Completed Work Accepted'
                  : isIssueRaised
                  ? 'Issue Raised on Completed Work'
                  : 'Completed Work Submitted for Your Review'}
              </h3>
              <span style={{ fontSize: '12px', color: '#64748b' }}>
                Submitted on {campaign.completedWork?.submittedAt ? new Date(campaign.completedWork.submittedAt).toLocaleString() : 'recently'}
              </span>
            </div>
          </div>

          <div style={{ background: '#ffffff', borderRadius: '10px', padding: '18px', border: '1px solid #e2e8f0', marginBottom: '20px' }}>
            <div style={{ marginBottom: '12px' }}>
              <div style={{ fontSize: '12px', color: '#64748b', textTransform: 'uppercase', fontWeight: '600' }}>Completion Summary</div>
              <p style={{ margin: '4px 0 0', fontSize: '14px', color: '#1e293b', fontWeight: '500' }}>
                {campaign.completedWork?.summary || 'Task completed as requested.'}
              </p>
            </div>

            {campaign.completedWork?.notes && (
              <div style={{ marginBottom: '16px' }}>
                <div style={{ fontSize: '12px', color: '#64748b', textTransform: 'uppercase', fontWeight: '600' }}>Admin Broker Notes</div>
                <p style={{ margin: '4px 0 0', fontSize: '13px', color: '#475569' }}>
                  {campaign.completedWork.notes}
                </p>
              </div>
            )}

            {/* Evidence Attachments */}
            {campaign.completedWork?.evidenceUrls?.length > 0 && (
              <div>
                <div style={{ fontSize: '12px', color: '#64748b', textTransform: 'uppercase', fontWeight: '600', marginBottom: '8px' }}>
                  Supporting Evidence &amp; Proof Videos:
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 200px), 1fr))', gap: '14px' }}>
                  {campaign.completedWork.evidenceUrls.map((ev, idx) => {
                    const resolvedEvUrl = resolveMediaUrl(ev.url);
                    const isVid = ev.mediaType === 'video' || resolvedEvUrl.endsWith('.mp4') || resolvedEvUrl.endsWith('.mov') || resolvedEvUrl.endsWith('.webm');
                    return (
                      <div key={idx} style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '10px', textAlign: 'center' }}>
                        {isVid ? (
                          <video src={resolvedEvUrl} controls style={{ width: '100%', maxHeight: '160px', borderRadius: '6px', background: '#000' }} />
                        ) : (
                          <img
                            src={resolvedEvUrl}
                            alt={ev.caption || 'Evidence'}
                            style={{ width: '100%', maxHeight: '160px', objectFit: 'cover', borderRadius: '6px', cursor: 'zoom-in' }}
                            onClick={() => setModalImage(resolvedEvUrl)}
                          />
                        )}
                        <div style={{ fontSize: '12px', color: '#334155', marginTop: '6px', fontWeight: '500' }}>
                          {ev.caption || `Proof Item #${idx + 1}`}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {isIssueRaised && campaign.completedWork?.vendorReviewComment && (
              <div style={{ marginTop: '16px', padding: '12px', background: '#fef2f2', border: '1px solid #fee2e2', borderRadius: '8px' }}>
                <strong style={{ color: '#991b1b', fontSize: '13px' }}>Your Feedback / Issue Raised:</strong>
                <p style={{ margin: '4px 0 0', fontSize: '13px', color: '#b91c1c' }}>
                  {campaign.completedWork.vendorReviewComment}
                </p>
              </div>
            )}
          </div>

          {/* Action buttons if awaiting review */}
          {!isWorkAccepted && !isIssueRaised && (
            <div style={{ display: 'flex', gap: '14px', justifyContent: 'flex-end', flexWrap: 'wrap' }}>
              <button
                type="button"
                className="btn btn-ghost"
                onClick={() => setShowIssueModal(true)}
                disabled={reviewingWork}
                style={{ color: '#dc2626', borderColor: '#fca5a5' }}
              >
                Raise an Issue / Request Revision
              </button>
              <button
                type="button"
                className="btn btn-primary"
                onClick={() => handleWorkDecision('accept')}
                disabled={reviewingWork}
                style={{ padding: '10px 24px', fontWeight: '600' }}
              >
                {reviewingWork ? 'Processing...' : '✓ Accept Completed Work'}
              </button>
            </div>
          )}
        </div>
      )}

      {/* Main Order Details Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 360px), 1fr))', gap: '24px', alignItems: 'flex-start' }}>
        
        {/* Left Column: Campaign Information */}
        <div className="card" style={{ padding: 'clamp(16px, 3.5vw, 24px)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px', marginBottom: '20px' }}>
            <div>
              <span className="badge badge-info" style={{ marginBottom: '6px' }}>{campaign.category}</span>
              <h2 style={{ fontSize: '1.4rem', margin: 0, color: '#0f172a' }}>{campaign.title}</h2>
              <div style={{ fontSize: '13px', color: '#64748b', marginTop: '4px' }}>
                Order #{campaign.orderNumber} &bull; Created {new Date(campaign.createdAt).toLocaleDateString()}
              </div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '12px', color: '#64748b' }}>Status</div>
              <span className="badge badge-primary" style={{ fontSize: '13px', padding: '6px 14px' }}>
                {campaign.status}
              </span>
            </div>
          </div>

          {/* Advert Creatives / Multi-Image Gallery */}
          {allMedia.length > 0 && (
            <div style={{ marginBottom: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px', flexWrap: 'wrap', gap: '8px' }}>
                <span style={{ fontSize: '12px', color: '#64748b', textTransform: 'uppercase', fontWeight: '600' }}>
                  Submitted Creative {allMedia.length > 1 ? `(${selectedMediaIndex + 1} of ${allMedia.length})` : ''}
                </span>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  {allMedia[selectedMediaIndex]?.url && (
                    <button
                      type="button"
                      onClick={() => downloadMedia(allMedia[selectedMediaIndex]?.url, `${campaign.orderNumber}-creative-${selectedMediaIndex + 1}`)}
                      className="btn btn-sm btn-outline"
                      style={{ fontSize: '11px', padding: '3px 8px', display: 'flex', alignItems: 'center', gap: '4px' }}
                    >
                      ⬇ Download Image
                    </button>
                  )}
                  {allMedia.length > 1 && (
                    <span style={{ fontSize: '12px', color: '#059669', fontWeight: '600' }}>
                      {allMedia.length} Creatives Uploaded
                    </span>
                  )}
                </div>
              </div>

              {/* Main Media Preview */}
              <div
                style={{
                  borderRadius: '10px',
                  overflow: 'hidden',
                  textAlign: 'center',
                  background: '#0f172a',
                  maxHeight: '320px',
                  position: 'relative',
                  cursor: 'zoom-in',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
                onClick={() => setModalImage(allMedia[selectedMediaIndex]?.url)}
                title="Click to view full image"
              >
                {allMedia[selectedMediaIndex]?.type === 'video' || allMedia[selectedMediaIndex]?.url?.endsWith('.mp4') ? (
                  <video
                    src={allMedia[selectedMediaIndex]?.url}
                    controls
                    style={{ maxHeight: '320px', maxWidth: '100%', margin: '0 auto' }}
                  />
                ) : (
                  <img
                    src={allMedia[selectedMediaIndex]?.url}
                    alt={campaign.title}
                    style={{ maxHeight: '320px', maxWidth: '100%', margin: '0 auto', objectFit: 'contain' }}
                    onError={(e) => {
                      e.currentTarget.src = 'https://placehold.co/600x400?text=Preview+Unavailable';
                    }}
                  />
                )}
                <div style={{ position: 'absolute', bottom: '8px', right: '12px', background: 'rgba(0,0,0,0.65)', color: '#fff', fontSize: '11px', padding: '3px 8px', borderRadius: '4px' }}>
                  🔍 Click to Zoom
                </div>
              </div>

              {/* Thumbnails if multiple images */}
              {allMedia.length > 1 && (
                <div style={{ display: 'flex', gap: '8px', marginTop: '10px', overflowX: 'auto', paddingBottom: '4px' }}>
                  {allMedia.map((m, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setSelectedMediaIndex(idx)}
                      style={{
                        border: selectedMediaIndex === idx ? '2px solid #059669' : '2px solid #cbd5e1',
                        borderRadius: '6px',
                        padding: '2px',
                        background: '#f1f5f9',
                        cursor: 'pointer',
                        flexShrink: 0
                      }}
                    >
                      <img
                        src={m.url}
                        alt={`Thumb ${idx + 1}`}
                        style={{ width: '56px', height: '56px', objectFit: 'cover', borderRadius: '4px', display: 'block' }}
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', fontSize: '14px' }}>
            <div>
              <span style={{ color: '#64748b', fontSize: '12px', textTransform: 'uppercase', fontWeight: '600' }}>Summary</span>
              <p style={{ margin: '4px 0 0', color: '#334155' }}>{campaign.description}</p>
            </div>

            {campaign.adCopy && (
              <div>
                <span style={{ color: '#64748b', fontSize: '12px', textTransform: 'uppercase', fontWeight: '600' }}>Ad Caption</span>
                <div style={{ margin: '4px 0 0', padding: '12px', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', whiteSpace: 'pre-wrap' }}>
                  {campaign.adCopy}
                </div>
              </div>
            )}

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 140px), 1fr))', gap: '12px', borderTop: '1px solid #e2e8f0', paddingTop: '14px' }}>
              <div>
                <span style={{ color: '#64748b', fontSize: '12px', textTransform: 'uppercase', fontWeight: '600' }}>Target Location</span>
                <div style={{ fontWeight: '600', color: '#0f172a', marginTop: '2px' }}>{targetLocationDisplay}</div>
              </div>
              <div>
                <span style={{ color: '#64748b', fontSize: '12px', textTransform: 'uppercase', fontWeight: '600' }}>Target Reach</span>
                <div style={{ fontWeight: '700', color: '#059669', marginTop: '2px' }}>{Number(campaign.requiredViews).toLocaleString()} Views</div>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 140px), 1fr))', gap: '12px', borderTop: '1px solid #e2e8f0', paddingTop: '14px' }}>
              <div>
                <span style={{ color: '#64748b', fontSize: '12px', textTransform: 'uppercase', fontWeight: '600' }}>Campaign Duration</span>
                <div style={{ fontWeight: '600', color: '#0f172a', marginTop: '2px' }}>{campaign.duration}</div>
              </div>
              <div>
                <span style={{ color: '#64748b', fontSize: '12px', textTransform: 'uppercase', fontWeight: '600' }}>Total Price</span>
                <div style={{ fontWeight: '800', color: '#059669', fontSize: '16px', marginTop: '2px' }}>
                  {campaign.currency} {Number(campaign.price).toLocaleString()}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Payment & Receipt Status */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {/* Payment Card */}
          <div className="card" style={{ padding: 'clamp(16px, 3.5vw, 24px)' }}>
            <h3 style={{ fontSize: '1.15rem', margin: '0 0 14px', color: '#0f172a' }}>Payment Status</h3>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <span style={{ fontSize: '13px', color: '#64748b' }}>Verification Status:</span>
              <span className={`badge badge-${campaign.paymentStatus === 'confirmed' ? 'success' : campaign.paymentStatus === 'submitted' ? 'warning' : 'danger'}`}>
                {campaign.paymentStatus.toUpperCase()}
              </span>
            </div>

            {/* Display submitted receipt if present */}
            {receiptUrl ? (
              <div style={{ marginBottom: '16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                  <span style={{ fontSize: '12px', color: '#64748b', fontWeight: '600' }}>
                    Uploaded Payment Proof:
                  </span>
                  <button
                    type="button"
                    onClick={() => downloadMedia(receiptUrl, `${campaign.orderNumber}-payment-receipt`)}
                    className="btn btn-sm btn-outline"
                    style={{ fontSize: '11px', padding: '2px 8px', display: 'flex', alignItems: 'center', gap: '4px' }}
                  >
                    ⬇ Download Receipt
                  </button>
                </div>
                <div
                  style={{
                    borderRadius: '8px',
                    overflow: 'hidden',
                    border: '1px solid #e2e8f0',
                    maxHeight: '200px',
                    textAlign: 'center',
                    background: '#f8fafc',
                    cursor: 'zoom-in',
                    position: 'relative'
                  }}
                  onClick={() => setModalImage(receiptUrl)}
                  title="Click to view full receipt"
                >
                  <img
                    src={receiptUrl}
                    alt="Receipt"
                    style={{ maxHeight: '200px', maxWidth: '100%', margin: '0 auto', objectFit: 'contain' }}
                    onError={(e) => { e.currentTarget.style.display = 'none'; }}
                  />
                  <div style={{ position: 'absolute', bottom: '6px', right: '8px', background: 'rgba(0,0,0,0.6)', color: '#fff', fontSize: '11px', padding: '2px 8px', borderRadius: '4px' }}>
                    🔍 View Full Receipt
                  </div>
                </div>
                <div style={{ fontSize: '11px', color: '#059669', marginTop: '6px', textAlign: 'center' }}>
                  ✓ Receipt submitted on {campaign.paymentReceipt?.uploadedAt ? new Date(campaign.paymentReceipt.uploadedAt).toLocaleDateString() : 'recently'}
                </div>
              </div>
            ) : null}

            {/* If Payment is Unpaid or Rejected, allow uploading receipt */}
            {isPaymentPending && (
              <form onSubmit={handleUploadReceiptSubmit} style={{ marginTop: '14px', borderTop: '1px solid #e2e8f0', paddingTop: '16px' }}>
                <div style={{ background: '#ecfdf5', padding: '14px', borderRadius: '8px', marginBottom: '14px', fontSize: '13px' }}>
                  <strong style={{ color: '#065f46' }}>Bank Transfer Details:</strong>
                  <div style={{ marginTop: '4px', color: '#047857' }}>
                    {paymentSettings?.bankName || 'Zenith Bank'} &bull; {paymentSettings?.accountNumber || '1012345678'} &bull; {paymentSettings?.accountName || 'MEDIOVA Media Brokerage Ltd'}
                  </div>
                </div>

                <label className="form-label" style={{ fontWeight: '600', fontSize: '13px', marginBottom: '6px', display: 'block' }}>
                  Upload Transfer Receipt / Screenshot
                </label>
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp,image/*"
                  onChange={handleReceiptChange}
                  className="form-control"
                  style={{ padding: '8px', fontSize: '13px' }}
                />

                {receiptPreview && (
                  <div style={{ marginTop: '10px', textAlign: 'center' }}>
                    <img src={receiptPreview} alt="Preview" style={{ maxHeight: '100px', borderRadius: '6px' }} />
                  </div>
                )}

                <button
                  type="submit"
                  className="btn btn-primary btn-block btn-sm"
                  disabled={uploadingReceipt || !receiptFile}
                  style={{ marginTop: '12px', padding: '10px' }}
                >
                  {uploadingReceipt ? 'Uploading Receipt...' : 'Submit Payment Receipt'}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>

      {/* Issue Modal */}
      {showIssueModal && (
        <div
          className="modal-overlay"
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(15, 23, 42, 0.75)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 2000,
            padding: '16px',
          }}
          onClick={() => setShowIssueModal(false)}
        >
          <div
            className="modal-card"
            style={{ background: '#ffffff', borderRadius: '14px', maxWidth: '520px', width: '100%', padding: '28px' }}
            onClick={(e) => e.stopPropagation()}
          >
            <h3 style={{ margin: '0 0 8px', fontSize: '1.2rem', color: '#0f172a' }}>
              Raise an Issue on Completed Work
            </h3>
            <p style={{ margin: '0 0 16px', fontSize: '13px', color: '#64748b' }}>
              Please describe any discrepancies with the agreed view count, flyer presentation, or campaign instructions.
            </p>
            <textarea
              rows="4"
              className="form-control"
              placeholder="Explain the issue in detail for our admin broker team to address..."
              value={issueComment}
              onChange={(e) => setIssueComment(e.target.value)}
              style={{ borderRadius: '8px', marginBottom: '16px' }}
            />
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
              <button
                type="button"
                className="btn btn-ghost"
                onClick={() => setShowIssueModal(false)}
                disabled={reviewingWork}
              >
                Cancel
              </button>
              <button
                type="button"
                className="btn btn-danger"
                onClick={() => handleWorkDecision('raise_issue', issueComment)}
                disabled={reviewingWork || !issueComment.trim()}
                style={{ fontWeight: '600' }}
              >
                {reviewingWork ? 'Submitting...' : 'Submit Issue to Admin'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Refund Request Modal */}
      {showRefundModal && (
        <div
          className="modal-overlay"
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: '16px',
          }}
          onClick={() => setShowRefundModal(false)}
        >
          <div className="card" style={{ maxWidth: '520px', width: '100%', padding: '28px' }} onClick={(e) => e.stopPropagation()}>
            <h3 style={{ marginBottom: '8px' }}>Request Campaign Refund</h3>
            <form onSubmit={handleRefundSubmit}>
              <div className="form-group">
                <label className="form-label">Refund Reason</label>
                <select
                  className="form-control"
                  value={refundForm.reason}
                  onChange={(e) => setRefundForm({ ...refundForm, reason: e.target.value })}
                >
                  <option value="Campaign Cancelled Before Launch">Campaign Cancelled Before Launch</option>
                  <option value="Audience Reach Delivery Shortfall">Audience Reach Delivery Shortfall</option>
                  <option value="Duplicate Transfer">Duplicate Transfer</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Detailed Explanation <span style={{ color: '#dc2626' }}>*</span></label>
                <textarea
                  rows="3"
                  required
                  className="form-control"
                  placeholder="Provide context..."
                  value={refundForm.description}
                  onChange={(e) => setRefundForm({ ...refundForm, description: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Account Name <span style={{ color: '#dc2626' }}>*</span></label>
                <input
                  type="text"
                  required
                  className="form-control"
                  placeholder="Account Holder Name"
                  value={refundForm.accountName}
                  onChange={(e) => setRefundForm({ ...refundForm, accountName: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Bank Name <span style={{ color: '#dc2626' }}>*</span></label>
                <input
                  type="text"
                  required
                  className="form-control"
                  placeholder="Bank Name"
                  value={refundForm.bankName}
                  onChange={(e) => setRefundForm({ ...refundForm, bankName: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Account Number / IBAN <span style={{ color: '#dc2626' }}>*</span></label>
                <input
                  type="text"
                  required
                  className="form-control"
                  placeholder="Account Number"
                  value={refundForm.accountNumber}
                  onChange={(e) => setRefundForm({ ...refundForm, accountNumber: e.target.value })}
                />
              </div>

              <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '20px' }}>
                <button type="button" className="btn btn-ghost" onClick={() => setShowRefundModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-danger" disabled={submittingRefund}>
                  {submittingRefund ? 'Submitting...' : 'Submit Refund Request'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

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
