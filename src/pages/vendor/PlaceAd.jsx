import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import DashboardLayout from '../../layouts/DashboardLayout';
import { getOrderOptions, createCampaign } from '../../services/api';
import { toast } from '../../components/ui/Toast';

const nigerianStates = [
  'Lagos', 'Abuja (FCT)', 'Rivers', 'Oyo', 'Kano', 'Enugu', 'Delta', 'Anambra',
  'Ogun', 'Kaduna', 'Edo', 'Imo', 'Akwa Ibom', 'Plateau', 'Ondo', 'Kwara', 'Other',
];

const ctaOptions = ['WhatsApp', 'Call', 'Website', 'Visit Store', 'Buy Now', 'Learn More', 'Send Message'];

export default function VendorPlaceAd() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [loadingOptions, setLoadingOptions] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // Dynamic Options from DB
  const [categories, setCategories] = useState([]);
  const [objectives, setObjectives] = useState([]);
  const [packages, setPackages] = useState([]);
  const [durations, setDurations] = useState(['24 Hours', '48 Hours', '3 Days', '7 Days']);

  // Success / Payment Confirmation Modal
  const [orderSuccess, setOrderSuccess] = useState(null);

  // Form Fields
  const [formData, setFormData] = useState({
    // Step 1
    title: '',
    description: '',
    // Step 2
    category: '',
    // Step 3
    objective: 'Brand Awareness',
    // Step 4
    adCopy: '',
    actionType: 'WhatsApp',
    targetValue: '',
    mediaFile: null,
    mediaPreview: null,
    // Step 5
    state: 'Lagos',
    city: 'Lagos',
    lga: '',
    area: '',
    targetRadius: '5km',
    // Step 6
    selectedPackage: null,
    requiredViews: 1000,
    price: 5000,
    // Step 7
    duration: '24 Hours',
    instructions: '',
  });

  useEffect(() => {
    fetchOptions();
  }, []);

  const fetchOptions = async () => {
    try {
      setLoadingOptions(true);
      const { data } = await getOrderOptions();
      setCategories(data.categories || []);
      setObjectives(data.objectives || []);
      setPackages(data.packages || []);
      if (data.durations && data.durations.length > 0) setDurations(data.durations);

      if (data.categories?.length > 0) {
        setFormData((prev) => ({ ...prev, category: data.categories[0].name }));
      }
      if (data.objectives?.length > 0) {
        setFormData((prev) => ({ ...prev, objective: data.objectives[0].name }));
      }
      if (data.packages?.length > 0) {
        setFormData((prev) => ({
          ...prev,
          selectedPackage: data.packages[0]._id,
          requiredViews: data.packages[0].minimumViews,
          price: data.packages[0].price,
        }));
      }
    } catch (err) {
      toast.error('Failed to load order configuration.');
    } finally {
      setLoadingOptions(false);
    }
  };

  const handleMediaChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({
        ...formData,
        mediaFile: file,
        mediaPreview: URL.createObjectURL(file),
      });
    }
  };

  const handleSelectPackage = (pkg) => {
    setFormData({
      ...formData,
      selectedPackage: pkg._id,
      requiredViews: pkg.minimumViews,
      price: pkg.price,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const dataPayload = new FormData();
      dataPayload.append('title', formData.title);
      dataPayload.append('description', formData.description);
      dataPayload.append('category', formData.category);
      dataPayload.append('objective', formData.objective);
      dataPayload.append('adCopy', formData.adCopy);
      dataPayload.append('callToAction[actionType]', formData.actionType);
      dataPayload.append('callToAction[targetValue]', formData.targetValue);
      dataPayload.append('targetLocation[state]', formData.state);
      dataPayload.append('targetLocation[city]', formData.city);
      dataPayload.append('targetLocation[lga]', formData.lga);
      dataPayload.append('targetLocation[area]', formData.area || 'General');
      dataPayload.append('targetRadius', formData.targetRadius);
      dataPayload.append('reachPackageId', formData.selectedPackage || '');
      dataPayload.append('requiredViews', formData.requiredViews);
      dataPayload.append('price', formData.price);
      dataPayload.append('duration', formData.duration);
      dataPayload.append('instructions', formData.instructions);

      if (formData.mediaFile) {
        dataPayload.append('media', formData.mediaFile);
      }

      const res = await createCampaign(dataPayload);
      if (res.data.success) {
        setOrderSuccess({
          orderNumber: res.data.orderNumber,
          campaign: res.data.campaign,
          whatsappUrl: res.data.whatsappUrl,
        });
        toast.success('Advertising order submitted successfully!');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to submit campaign request. Check required fields.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loadingOptions) {
    return (
      <DashboardLayout title="Place Advertisement" role="vendor">
        <div style={{ textAlign: 'center', padding: '60px' }}>
          <div className="spinner" style={{ margin: '0 auto 16px' }} />
          <p style={{ color: '#64748b' }}>Loading campaign setup options...</p>
        </div>
      </DashboardLayout>
    );
  }

  // If order was successfully submitted, show the WhatsApp Payment confirmation modal
  if (orderSuccess) {
    return (
      <DashboardLayout title="Order Received" role="vendor">
        <div className="card" style={{ maxWidth: '680px', margin: '40px auto', padding: '40px', textAlign: 'center' }}>
          <div style={{ fontSize: '64px', marginBottom: '16px' }}></div>
          <span className="badge badge-warning" style={{ fontSize: '13px', padding: '6px 16px' }}>
            Awaiting Payment Confirmation
          </span>
          <h2 style={{ fontSize: '1.75rem', marginTop: '16px', marginBottom: '8px' }}>
            Advertising Request Received!
          </h2>
          <p style={{ color: '#64748b', fontSize: '15px', lineHeight: '1.6', marginBottom: '24px' }}>
            Your order <strong>#{orderSuccess.orderNumber}</strong> has been logged. To activate and distribute your campaign, please contact our advertising broker team on WhatsApp to confirm payment.
          </p>

          <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '20px', textAlign: 'left', marginBottom: '28px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '14px' }}>
              <span style={{ color: '#64748b' }}>Campaign:</span>
              <strong>{orderSuccess.campaign?.title}</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '14px' }}>
              <span style={{ color: '#64748b' }}>Required Views:</span>
              <strong style={{ color: '#2563eb' }}>{Number(orderSuccess.campaign?.requiredViews).toLocaleString()} Views</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px' }}>
              <span style={{ color: '#64748b' }}>Total Amount:</span>
              <strong style={{ color: '#059669', fontSize: '18px' }}>₦{Number(orderSuccess.campaign?.price).toLocaleString()}</strong>
            </div>
          </div>

          <a
            href={orderSuccess.whatsappUrl}
            target="_blank"
            rel="noreferrer"
            className="btn btn-whatsapp btn-lg btn-block"
            style={{ fontSize: '16px', padding: '16px' }}
          >
             Contact Admin on WhatsApp to Complete Payment →
          </a>

          <div style={{ marginTop: '20px' }}>
            <Link to={`/vendor/orders/${orderSuccess.campaign?._id}`} className="btn btn-ghost btn-block">
              View Order Progress Timeline
            </Link>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  const stepsList = [
    'Info', 'Category', 'Objective', 'Media', 'Target', 'Reach', 'Duration', 'Review',
  ];

  return (
    <DashboardLayout title="Place Advertisement" role="vendor">
      <div className="page-header">
        <div>
          <h2 className="page-title">Place an Advertisement</h2>
          <p className="page-subtitle">Configure your WhatsApp campaign in 8 straightforward steps.</p>
        </div>
      </div>

      {/* Progress Steps Header */}
      <div className="step-wizard" style={{ maxWidth: '900px', margin: '0 auto 32px' }}>
        {stepsList.map((label, idx) => {
          const stepNum = idx + 1;
          const isDone = step > stepNum;
          const isActive = step === stepNum;
          return (
            <div key={label} className="step-item">
              <div className={`step-circle ${isActive ? 'active' : ''} ${isDone ? 'done' : ''}`}>
                {isDone ? '✓' : stepNum}
              </div>
              <span className={`step-label ${isActive ? 'active' : ''}`}>{label}</span>
              {stepNum < stepsList.length && <div className={`step-line ${isDone ? 'done' : ''}`} />}
            </div>
          );
        })}
      </div>

      <div className="card" style={{ maxWidth: '800px', margin: '0 auto' }}>
        <div className="card-body" style={{ padding: '32px' }}>
          {/* STEP 1: Campaign Information */}
          {step === 1 && (
            <div>
              <h3 style={{ marginBottom: '8px' }}>Step 1: Campaign Information</h3>
              <p style={{ color: '#64748b', fontSize: '14px', marginBottom: '24px' }}>
                Give your campaign a recognizable title and detail what you are promoting.
              </p>

              <div className="form-group">
                <label className="form-label">Campaign / Advertisement Name <span className="required">*</span></label>
                <input
                  type="text"
                  required
                  className="form-control"
                  placeholder="e.g. Samsung Galaxy S24 Ultra Promo"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">What are you promoting? (Description) <span className="required">*</span></label>
                <textarea
                  required
                  className="form-control"
                  rows={4}
                  placeholder="Describe your product, service, special discount, or event in detail..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
              </div>

              <button
                type="button"
                className="btn btn-primary"
                onClick={() => {
                  if (!formData.title || !formData.description) {
                    toast.warning('Please enter both a campaign name and description.');
                    return;
                  }
                  setStep(2);
                }}
              >
                Next: Select Category →
              </button>
            </div>
          )}

          {/* STEP 2: Category */}
          {step === 2 && (
            <div>
              <h3 style={{ marginBottom: '8px' }}>Step 2: Choose Advertising Category</h3>
              <p style={{ color: '#64748b', fontSize: '14px', marginBottom: '24px' }}>
                Categories are used by the Admin broker to match your campaign with relevant influencer audiences.
              </p>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '12px', marginBottom: '28px' }}>
                {categories.map((c) => {
                  const sel = formData.category === c.name;
                  return (
                    <div
                      key={c._id || c.name}
                      onClick={() => setFormData({ ...formData, category: c.name })}
                      style={{
                        padding: '16px',
                        borderRadius: '10px',
                        border: sel ? '2px solid #2563eb' : '1px solid #e2e8f0',
                        background: sel ? '#eff6ff' : 'white',
                        cursor: 'pointer',
                        fontWeight: sel ? '700' : '500',
                        color: sel ? '#1e40af' : '#334155',
                        textAlign: 'center',
                        fontSize: '14px',
                      }}
                    >
                      {c.name}
                    </div>
                  );
                })}
              </div>

              <div style={{ display: 'flex', gap: '12px' }}>
                <button type="button" className="btn btn-ghost" onClick={() => setStep(1)}>← Back</button>
                <button type="button" className="btn btn-primary" onClick={() => setStep(3)}>Next: Campaign Objective →</button>
              </div>
            </div>
          )}

          {/* STEP 3: Campaign Objective */}
          {step === 3 && (
            <div>
              <h3 style={{ marginBottom: '8px' }}>Step 3: Campaign Objective</h3>
              <p style={{ color: '#64748b', fontSize: '14px', marginBottom: '24px' }}>
                What is the primary result you want to achieve with this WhatsApp campaign?
              </p>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '12px', marginBottom: '28px' }}>
                {[
                  'Brand Awareness', 'Product Promotion', 'Generate Sales', 'Generate WhatsApp Leads',
                  'Event Promotion', 'Website Traffic', 'Product Launch', 'Location Promotion', 'General Awareness',
                ].map((obj) => {
                  const sel = formData.objective === obj;
                  return (
                    <div
                      key={obj}
                      onClick={() => setFormData({ ...formData, objective: obj })}
                      style={{
                        padding: '16px',
                        borderRadius: '10px',
                        border: sel ? '2px solid #2563eb' : '1px solid #e2e8f0',
                        background: sel ? '#eff6ff' : 'white',
                        cursor: 'pointer',
                        fontWeight: sel ? '700' : '500',
                        color: sel ? '#1e40af' : '#334155',
                        textAlign: 'center',
                        fontSize: '14px',
                      }}
                    >
                      {obj}
                    </div>
                  );
                })}
              </div>

              <div style={{ display: 'flex', gap: '12px' }}>
                <button type="button" className="btn btn-ghost" onClick={() => setStep(2)}>← Back</button>
                <button type="button" className="btn btn-primary" onClick={() => setStep(4)}>Next: Advertisement Media →</button>
              </div>
            </div>
          )}

          {/* STEP 4: Advertisement Media & Copy */}
          {step === 4 && (
            <div>
              <h3 style={{ marginBottom: '8px' }}>Step 4: Advertisement Media & Copy</h3>
              <p style={{ color: '#64748b', fontSize: '14px', marginBottom: '24px' }}>
                Upload the creative flyer or video influencers will post, along with your caption.
              </p>

              <div className="form-group">
                <label className="form-label">Upload Ad Flyer / Image / Video</label>
                <input
                  type="file"
                  accept="image/*,video/mp4"
                  className="form-control"
                  onChange={handleMediaChange}
                />
                <span className="form-hint">Accepted formats: JPEG, PNG, WEBP, MP4 (Max 25MB)</span>
              </div>

              {formData.mediaPreview && (
                <div style={{ marginBottom: '20px', textAlign: 'center' }}>
                  <img
                    src={formData.mediaPreview}
                    alt="Preview"
                    style={{ maxHeight: '240px', borderRadius: '8px', border: '1px solid #e2e8f0', margin: '0 auto' }}
                  />
                </div>
              )}

              <div className="form-group">
                <label className="form-label">Advertisement Caption / Copy</label>
                <textarea
                  className="form-control"
                  rows={3}
                  placeholder="Text influencers should write alongside the flyer on their Status..."
                  value={formData.adCopy}
                  onChange={(e) => setFormData({ ...formData, adCopy: e.target.value })}
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Call to Action (CTA)</label>
                  <select
                    className="form-control"
                    value={formData.actionType}
                    onChange={(e) => setFormData({ ...formData, actionType: e.target.value })}
                  >
                    {ctaOptions.map((opt) => (
                      <option key={opt} value={opt}>{opt}</option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">CTA Target (Phone/WhatsApp/Link)</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="e.g. +2348012345678 or https://..."
                    value={formData.targetValue}
                    onChange={(e) => setFormData({ ...formData, targetValue: e.target.value })}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', gap: '12px', marginTop: '16px' }}>
                <button type="button" className="btn btn-ghost" onClick={() => setStep(3)}>← Back</button>
                <button type="button" className="btn btn-primary" onClick={() => setStep(5)}>Next: Target Location →</button>
              </div>
            </div>
          )}

          {/* STEP 5: Target Location */}
          {step === 5 && (
            <div>
              <h3 style={{ marginBottom: '8px' }}>Step 5: Target Location</h3>
              <p style={{ color: '#64748b', fontSize: '14px', marginBottom: '24px' }}>
                Specify where your target buyers reside. Admin will match influencers situated in or reaching these areas.
              </p>

              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Target State <span className="required">*</span></label>
                  <select
                    className="form-control"
                    value={formData.state}
                    onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                  >
                    {nigerianStates.map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">City / Town</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="e.g. Lagos, Ikeja"
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">LGA</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="e.g. Eti-Osa"
                    value={formData.lga}
                    onChange={(e) => setFormData({ ...formData, lga: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Area / Neighborhood <span className="required">*</span></label>
                  <input
                    type="text"
                    required
                    className="form-control"
                    placeholder="e.g. Lekki Phase 1"
                    value={formData.area}
                    onChange={(e) => setFormData({ ...formData, area: e.target.value })}
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Target Radius (Optional)</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="e.g. 5km around Lekki Phase 1"
                  value={formData.targetRadius}
                  onChange={(e) => setFormData({ ...formData, targetRadius: e.target.value })}
                />
              </div>

              <div style={{ display: 'flex', gap: '12px' }}>
                <button type="button" className="btn btn-ghost" onClick={() => setStep(4)}>← Back</button>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={() => {
                    if (!formData.area) {
                      toast.warning('Please enter a target area or neighborhood.');
                      return;
                    }
                    setStep(6);
                  }}
                >
                  Next: Required Reach →
                </button>
              </div>
            </div>
          )}

          {/* STEP 6: Required Reach Packages */}
          {step === 6 && (
            <div>
              <h3 style={{ marginBottom: '8px' }}>Step 6: Required Advertising Reach</h3>
              <p style={{ color: '#64748b', fontSize: '14px', marginBottom: '24px' }}>
                Minimum advertising reach packages start at 1,000 views. Select your package:
              </p>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '16px', marginBottom: '28px' }}>
                {packages.map((pkg) => {
                  const sel = formData.selectedPackage === pkg._id;
                  return (
                    <div
                      key={pkg._id}
                      onClick={() => handleSelectPackage(pkg)}
                      style={{
                        padding: '20px',
                        borderRadius: '12px',
                        border: sel ? '2px solid #2563eb' : '1px solid #e2e8f0',
                        background: sel ? '#eff6ff' : 'white',
                        cursor: 'pointer',
                        textAlign: 'center',
                      }}
                    >
                      <h4 style={{ fontSize: '1.1rem', marginBottom: '6px', color: sel ? '#1e40af' : '#0f172a' }}>
                        {pkg.name}
                      </h4>
                      <div style={{ fontSize: '1.4rem', fontWeight: '800', color: '#059669', marginBottom: '6px' }}>
                        ₦{Number(pkg.price).toLocaleString()}
                      </div>
                      <p style={{ fontSize: '12px', color: '#64748b', margin: 0 }}>
                        {Number(pkg.minimumViews).toLocaleString()}+ Guaranteed Views
                      </p>
                    </div>
                  );
                })}
              </div>

              <div style={{ display: 'flex', gap: '12px' }}>
                <button type="button" className="btn btn-ghost" onClick={() => setStep(5)}>← Back</button>
                <button type="button" className="btn btn-primary" onClick={() => setStep(7)}>Next: Duration →</button>
              </div>
            </div>
          )}

          {/* STEP 7: Campaign Duration & Instructions */}
          {step === 7 && (
            <div>
              <h3 style={{ marginBottom: '8px' }}>Step 7: Campaign Duration</h3>
              <p style={{ color: '#64748b', fontSize: '14px', marginBottom: '24px' }}>
                Choose how long each influencer must leave your advertisement live on Status.
              </p>

              <div className="form-group">
                <label className="form-label">Duration</label>
                <select
                  className="form-control"
                  value={formData.duration}
                  onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                >
                  {durations.map((d) => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Special Instructions for Influencers (Optional)</label>
                <textarea
                  className="form-control"
                  rows={3}
                  placeholder="e.g. Post between 8am and 10am. Tag our handle in replies."
                  value={formData.instructions}
                  onChange={(e) => setFormData({ ...formData, instructions: e.target.value })}
                />
              </div>

              <div style={{ display: 'flex', gap: '12px' }}>
                <button type="button" className="btn btn-ghost" onClick={() => setStep(6)}>← Back</button>
                <button type="button" className="btn btn-primary" onClick={() => setStep(8)}>Next: Review Order →</button>
              </div>
            </div>
          )}

          {/* STEP 8: Review & Submit */}
          {step === 8 && (
            <div>
              <h3 style={{ marginBottom: '8px' }}>Step 8: Review Advertising Order</h3>
              <p style={{ color: '#64748b', fontSize: '14px', marginBottom: '24px' }}>
                Verify your campaign configuration before submitting.
              </p>

              <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '24px', display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '28px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px' }}>
                  <span style={{ color: '#64748b' }}>Campaign Name:</span>
                  <strong>{formData.title}</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px' }}>
                  <span style={{ color: '#64748b' }}>Category:</span>
                  <strong>{formData.category}</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px' }}>
                  <span style={{ color: '#64748b' }}>Objective:</span>
                  <strong>{formData.objective}</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px' }}>
                  <span style={{ color: '#64748b' }}>Target Location:</span>
                  <strong>{formData.area}, {formData.state} ({formData.targetRadius})</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px' }}>
                  <span style={{ color: '#64748b' }}>Required Reach:</span>
                  <strong style={{ color: '#2563eb' }}>{Number(formData.requiredViews).toLocaleString()} Views</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px' }}>
                  <span style={{ color: '#64748b' }}>Duration:</span>
                  <strong>{formData.duration}</strong>
                </div>
                <div style={{ borderTop: '1px solid #e2e8f0', paddingTop: '12px', display: 'flex', justifyContent: 'space-between', fontSize: '16px' }}>
                  <span style={{ fontWeight: '700' }}>Total Cost:</span>
                  <strong style={{ color: '#059669', fontSize: '20px' }}>₦{Number(formData.price).toLocaleString()}</strong>
                </div>
              </div>

              <div className="alert alert-info">
                ℹ️ <strong>Manual Payment Notice:</strong> After submission, you will be connected with our Admin brokerage team on WhatsApp to confirm payment via bank transfer.
              </div>

              <div style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
                <button type="button" className="btn btn-ghost" onClick={() => setStep(7)}>← Back</button>
                <button
                  type="button"
                  className="btn btn-primary btn-lg btn-block"
                  disabled={submitting}
                  onClick={handleSubmit}
                >
                  {submitting ? 'Submitting Order...' : 'Submit Advertising Request →'}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
