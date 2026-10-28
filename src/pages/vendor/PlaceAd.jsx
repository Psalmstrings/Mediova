import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import DashboardLayout from '../../layouts/DashboardLayout';
import { getOrderOptions, createCampaign } from '../../services/api';
import { toast } from '../../components/ui/Toast';
import CountrySelect from '../../components/ui/CountrySelect';
import {
  COUNTRIES,
  getCountryMeta,
  getRegionsForCountry,
  getLgasForState,
} from '../../config/locations';

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
  const [paymentSettings, setPaymentSettings] = useState(null);
  const [maxCampaignAreas, setMaxCampaignAreas] = useState(15);

  // Success / Confirmation State
  const [orderSuccess, setOrderSuccess] = useState(null);

  // Form Fields
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    objective: 'Brand Awareness',
    adCopy: '',
    actionType: 'WhatsApp',
    targetValue: '',
    mediaFiles: [],
    mediaPreviews: [],
    mediaFile: null,
    mediaPreview: null,
    // Global Location Targeting
    targetCountry: 'Nigeria',
    targetCountryCode: 'NG',
    targetRegion: 'Lagos',
    targetAreas: ['Ikeja (Alausa/GRA)', 'Lagos Island'],
    customAreaInput: '',
    isNationwide: false,
    // Package & Reach
    selectedPackage: null,
    requiredViews: 1000,
    price: 5000,
    currency: 'NGN',
    duration: '24 Hours',
    instructions: '',
    // Payment Receipt
    receiptFile: null,
    receiptPreview: null,
  });

  useEffect(() => {
    fetchOptions();
  }, []);

  const fetchOptions = async () => {
    try {
      setLoadingOptions(true);
      const { data } = await getOrderOptions();
      const cats = data.categories || [];
      const pkgs = data.packages || [];
      const objs = data.objectives || [];
      setCategories(cats);
      setPackages(pkgs);
      if (objs.length > 0) setObjectives(objs);
      if (data.durations?.length > 0) setDurations(data.durations);
      if (data.paymentSettings) setPaymentSettings(data.paymentSettings);
      if (data.maxCampaignAreas) setMaxCampaignAreas(data.maxCampaignAreas);

      if (cats.length > 0) {
        setFormData((prev) => ({
          ...prev,
          category: prev.category || cats[0].name,
        }));
      }
      if (objs.length > 0) {
        setFormData((prev) => ({
          ...prev,
          objective: prev.objective || objs[0].name,
        }));
      }
      if (pkgs.length > 0) {
        setFormData((prev) => ({
          ...prev,
          selectedPackage: prev.selectedPackage || pkgs[0]._id,
          requiredViews: prev.requiredViews || pkgs[0].minimumViews || pkgs[0].views || 1000,
          price: prev.price || pkgs[0].price || 5000,
          currency: data.paymentSettings?.currency || 'NGN',
        }));
      }
    } catch (err) {
      toast.error('Failed to load campaign setup options.');
    } finally {
      setLoadingOptions(false);
    }
  };

  const handleCountryChange = (e) => {
    const newCountry = e.target.value;
    const countryMeta = getCountryMeta(newCountry);
    const availableRegions = getRegionsForCountry(newCountry);
    const initialRegion = availableRegions[0] || '';
    const availableAreas = getLgasForState(initialRegion);

    setFormData((prev) => ({
      ...prev,
      targetCountry: newCountry,
      targetCountryCode: countryMeta?.code || 'NG',
      targetRegion: initialRegion,
      targetAreas: availableAreas.length > 0 ? [availableAreas[0]] : [],
      customAreaInput: '',
      isNationwide: false,
    }));
  };

  const handleRegionChange = (e) => {
    const newRegion = e.target.value;
    const availableAreas = getLgasForState(newRegion);
    setFormData((prev) => ({
      ...prev,
      targetRegion: newRegion,
      targetAreas: availableAreas.length > 0 ? [availableAreas[0]] : [],
      customAreaInput: '',
    }));
  };

  const handleAddArea = (areaToAdd) => {
    if (!areaToAdd || !areaToAdd.trim()) return;
    const clean = areaToAdd.trim();

    if (formData.targetAreas.includes(clean)) {
      toast.info(`"${clean}" is already in your target areas list.`);
      return;
    }

    if (formData.targetAreas.length >= maxCampaignAreas) {
      toast.warning(`You have reached the administrator-configured limit of ${maxCampaignAreas} areas per campaign.`);
      return;
    }

    setFormData((prev) => ({
      ...prev,
      targetAreas: [...prev.targetAreas, clean],
      customAreaInput: '',
    }));
  };

  const handleRemoveArea = (areaToRemove) => {
    setFormData((prev) => ({
      ...prev,
      targetAreas: prev.targetAreas.filter((a) => a !== areaToRemove),
    }));
  };

  const handlePackageSelect = (pkg) => {
    setFormData((prev) => ({
      ...prev,
      selectedPackage: pkg._id,
      requiredViews: pkg.minimumViews || pkg.views || 1000,
      price: pkg.price,
    }));
  };

  const handleMediaChange = (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    const validFiles = [];
    for (const file of files) {
      if (!file.type.startsWith('image/')) {
        toast.error(`"${file.name}" is not an image (JPEG, PNG, WEBP supported).`);
        continue;
      }
      if (file.size > 15 * 1024 * 1024) {
        toast.error(`"${file.name}" exceeds the 15MB file size limit.`);
        continue;
      }
      validFiles.push(file);
    }

    if (validFiles.length === 0) return;

    const currentFiles = formData.mediaFiles || [];
    const combinedFiles = [...currentFiles, ...validFiles].slice(0, 10);
    const combinedPreviews = combinedFiles.map((f) => ({
      file: f,
      url: URL.createObjectURL(f),
      name: f.name,
      size: (f.size / (1024 * 1024)).toFixed(2),
    }));

    setFormData((prev) => ({
      ...prev,
      mediaFiles: combinedFiles,
      mediaPreviews: combinedPreviews,
      mediaFile: combinedFiles[0] || null,
      mediaPreview: combinedPreviews[0]?.url || null,
    }));
  };

  const handleRemoveMedia = (indexToRemove) => {
    const updatedFiles = (formData.mediaFiles || []).filter((_, idx) => idx !== indexToRemove);
    const updatedPreviews = (formData.mediaPreviews || []).filter((_, idx) => idx !== indexToRemove);

    setFormData((prev) => ({
      ...prev,
      mediaFiles: updatedFiles,
      mediaPreviews: updatedPreviews,
      mediaFile: updatedFiles[0] || null,
      mediaPreview: updatedPreviews[0]?.url || null,
    }));
  };

  const handleReceiptChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('Payment receipt must be an image (JPEG, PNG, WEBP).');
      return;
    }

    setFormData((prev) => ({
      ...prev,
      receiptFile: file,
      receiptPreview: URL.createObjectURL(file),
    }));
  };

  // Step 1 Validation
  const handleNextStep1 = () => {
    if (!formData.title.trim()) {
      toast.warning('Please enter a campaign name/title.');
      return;
    }
    if (!formData.description.trim()) {
      toast.warning('Please enter a brief campaign description.');
      return;
    }
    if (!formData.category) {
      toast.warning('Please choose a category.');
      return;
    }
    if ((!formData.mediaFiles || formData.mediaFiles.length === 0) && !formData.mediaFile) {
      toast.warning('Please upload at least one advert flyer/image.');
      return;
    }
    setStep(2);
  };

  // Step 2 Validation
  const handleNextStep2 = () => {
    if (!formData.isNationwide && formData.targetAreas.length === 0) {
      toast.warning('Please select at least one target area or choose Nationwide coverage.');
      return;
    }
    if (!formData.isNationwide && formData.targetAreas.length > maxCampaignAreas) {
      toast.warning(`Cannot exceed maximum allowed ${maxCampaignAreas} areas.`);
      return;
    }
    setStep(3);
  };

  // Final Submission
  const handleSubmitCampaign = async (e) => {
    e.preventDefault();
    if (submitting) return;

    setSubmitting(true);
    try {
      const dataPayload = new FormData();
      dataPayload.append('title', formData.title.trim());
      dataPayload.append('description', formData.description.trim());
      dataPayload.append('category', formData.category);
      dataPayload.append('objective', formData.objective);
      dataPayload.append('adCopy', formData.adCopy || '');

      const ctaData = {
        actionType: formData.actionType,
        targetValue: formData.targetValue || '',
      };
      dataPayload.append('callToAction', JSON.stringify(ctaData));

      // Global targeting fields
      dataPayload.append('targetCountry', formData.targetCountry);
      dataPayload.append('targetCountryCode', formData.targetCountryCode);
      dataPayload.append('targetRegion', formData.targetRegion);
      dataPayload.append('targetAreas', JSON.stringify(formData.targetAreas));
      dataPayload.append('isNationwide', String(Boolean(formData.isNationwide)));

      dataPayload.append('reachPackageId', formData.selectedPackage || '');
      dataPayload.append('requiredViews', String(formData.requiredViews));
      dataPayload.append('price', String(formData.price));
      dataPayload.append('currency', formData.currency);
      dataPayload.append('duration', formData.duration);
      dataPayload.append('instructions', formData.instructions || '');

      if (formData.mediaFiles && formData.mediaFiles.length > 0) {
        formData.mediaFiles.forEach((f) => {
          dataPayload.append('media', f);
          dataPayload.append('mediaFiles', f);
        });
      } else if (formData.mediaFile) {
        dataPayload.append('media', formData.mediaFile);
      }

      if (formData.receiptFile) {
        dataPayload.append('receipt', formData.receiptFile);
      }

      const res = await createCampaign(dataPayload);
      if (res.data.success) {
        setOrderSuccess({
          orderNumber: res.data.orderNumber,
          campaign: res.data.campaign,
        });
        toast.success('Campaign and payment details submitted successfully!');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to submit campaign. Please check your fields and try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loadingOptions) {
    return (
      <DashboardLayout title="Create Advert Campaign" role="vendor">
        <div style={{ textAlign: 'center', padding: '60px' }}>
          <div className="spinner" style={{ margin: '0 auto 16px' }} />
          <p style={{ color: '#64748b' }}>Loading campaign setup options...</p>
        </div>
      </DashboardLayout>
    );
  }

  // Success Confirmation Screen
  if (orderSuccess) {
    return (
      <DashboardLayout title="Order Submitted" role="vendor">
        <div className="card" style={{ maxWidth: '640px', margin: '30px auto', padding: '40px 32px', textAlign: 'center' }}>
          <div style={{ fontSize: '56px', marginBottom: '16px' }}>🎉</div>
          <span className="badge badge-warning" style={{ fontSize: '13px', padding: '6px 16px' }}>
            {formData.receiptFile ? 'Payment Submitted & Awaiting Review' : 'Order Submitted & Awaiting Payment'}
          </span>
          <h2 style={{ fontSize: '1.6rem', marginTop: '16px', marginBottom: '8px', color: '#0f172a' }}>
            Campaign Order Received!
          </h2>
          <p style={{ color: '#475569', fontSize: '14px', lineHeight: '1.6' }}>
            Your advertising order <strong>#{orderSuccess.orderNumber}</strong> has been submitted to the MEDIOVA administration team.
            {formData.receiptFile
              ? ' Our finance team will verify your payment receipt shortly and activate gig assignments for verified influencers.'
              : ' Please ensure payment is completed so our team can approve your advert and assign influencers.'}
          </p>

          <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '16px', margin: '24px 0', textAlign: 'left', fontSize: '13px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
              <span style={{ color: '#64748b' }}>Campaign:</span>
              <strong style={{ color: '#0f172a' }}>{formData.title}</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
              <span style={{ color: '#64748b' }}>Target Country:</span>
              <span>{formData.targetCountry}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
              <span style={{ color: '#64748b' }}>Target Reach:</span>
              <span>{Number(formData.requiredViews).toLocaleString()} Views</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: '#64748b' }}>Total Amount:</span>
              <strong style={{ color: '#059669', fontSize: '15px' }}>{formData.currency} {Number(formData.price).toLocaleString()}</strong>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
            <Link to={`/vendor/orders/${orderSuccess.campaign._id}`} className="btn btn-primary" style={{ padding: '12px 24px', fontWeight: '600' }}>
              View Order Progress &rarr;
            </Link>
            <Link to="/vendor/dashboard" className="btn btn-ghost" style={{ padding: '12px 24px' }}>
              Vendor Dashboard
            </Link>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  const currentRegions = getRegionsForCountry(formData.targetCountry);
  const currentRegionLgas = getLgasForState(formData.targetRegion);

  return (
    <DashboardLayout title="Create Advertising Campaign" role="vendor">
      <div style={{ maxWidth: '820px', margin: '0 auto' }}>
        {/* Progress Tracker */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '32px' }}>
          {[
            { num: 1, label: 'Advert Details' },
            { num: 2, label: 'Global Targeting' },
            { num: 3, label: 'Review & Pay' },
          ].map((s) => (
            <div
              key={s.num}
              style={{
                flex: 1,
                textAlign: 'center',
                position: 'relative',
              }}
            >
              <div
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '50%',
                  background: step >= s.num ? '#059669' : '#e2e8f0',
                  color: step >= s.num ? '#ffffff' : '#64748b',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: '700',
                  fontSize: '14px',
                  margin: '0 auto 6px',
                  transition: 'all 0.3s',
                }}
              >
                {step > s.num ? '✓' : s.num}
              </div>
              <span style={{ fontSize: '12px', fontWeight: step === s.num ? '700' : '500', color: step === s.num ? '#047857' : '#64748b' }}>
                {s.label}
              </span>
            </div>
          ))}
        </div>

        {/* STEP 1: Advert Details */}
        {step === 1 && (
          <div className="card" style={{ padding: '32px' }}>
            <h3 style={{ margin: '0 0 6px', fontSize: '1.25rem', color: '#0f172a', fontWeight: '700' }}>
              Step 1: Campaign Content &amp; Media
            </h3>
            <p style={{ margin: '0 0 24px', fontSize: '13px', color: '#64748b' }}>
              Provide the advert details and upload the flyer or promotional image for influencers to post.
            </p>

            <div className="form-group" style={{ marginBottom: '16px' }}>
              <label className="form-label">
                Campaign / Advertisement Title <span style={{ color: '#dc2626' }}>*</span>
              </label>
              <input
                type="text"
                required
                className="form-control"
                placeholder="e.g. Summer Fashion Sale 2026"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                style={{ height: '44px', borderRadius: '8px' }}
              />
            </div>

            <div className="form-row" style={{ marginBottom: '16px' }}>
              <div className="form-group" style={{ margin: 0 }}>
                <label className="form-label">Category <span style={{ color: '#dc2626' }}>*</span></label>
                <select
                  className="form-control"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  style={{ height: '44px', borderRadius: '8px' }}
                >
                  {categories.length === 0 ? (
                    <option value="" disabled>Loading categories...</option>
                  ) : (
                    <>
                      <option value="" disabled>-- Select a Category --</option>
                      {categories.map((c) => (
                        <option key={c._id || c.name} value={c.name}>{c.name}</option>
                      ))}
                    </>
                  )}
                </select>
              </div>

              <div className="form-group" style={{ margin: 0 }}>
                <label className="form-label">Campaign Objective</label>
                <select
                  className="form-control"
                  value={formData.objective}
                  onChange={(e) => setFormData({ ...formData, objective: e.target.value })}
                  style={{ height: '44px', borderRadius: '8px' }}
                >
                  {objectives.length > 0 ? (
                    objectives.map((o) => (
                      <option key={o._id || o.name} value={o.name}>{o.name}</option>
                    ))
                  ) : (
                    <>
                      <option value="Brand Awareness">Brand Awareness</option>
                      <option value="Direct Sales / Inquiries">Direct Sales / Inquiries</option>
                      <option value="Store / Event Traffic">Store / Event Traffic</option>
                      <option value="App / Website Clicks">App / Website Clicks</option>
                    </>
                  )}
                </select>
              </div>
            </div>

            <div className="form-group" style={{ marginBottom: '16px' }}>
              <label className="form-label">Brief Campaign Summary <span style={{ color: '#dc2626' }}>*</span></label>
              <textarea
                rows="2"
                required
                className="form-control"
                placeholder="What is this campaign advertising?"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                style={{ borderRadius: '8px' }}
              />
            </div>

            {/* Advert Images Upload (Supports multiple images) */}
            <div style={{ marginBottom: '20px', padding: '20px', border: '2px dashed #cbd5e1', borderRadius: '12px', background: '#f8fafc' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px', flexWrap: 'wrap', gap: '8px' }}>
                <label className="form-label" style={{ fontWeight: '700', margin: 0 }}>
                  Upload Advert Flyers / Creative Images <span style={{ color: '#dc2626' }}>*</span>
                </label>
                {formData.mediaPreviews?.length > 0 && (
                  <span className="badge badge-success" style={{ fontSize: '12px' }}>
                    {formData.mediaPreviews.length} image{formData.mediaPreviews.length > 1 ? 's' : ''} attached (Max 10)
                  </span>
                )}
              </div>

              <input
                type="file"
                multiple
                accept="image/jpeg,image/png,image/webp,image/*"
                onChange={handleMediaChange}
                className="form-control"
                style={{ padding: '10px' }}
              />
              <span className="form-hint" style={{ fontSize: '12px', color: '#64748b', marginTop: '6px', display: 'block' }}>
                You can select multiple images at once or add more sequentially. Supported formats: JPEG, PNG, WEBP (max 15MB each, up to 10 images).
              </span>

              {formData.mediaPreviews?.length > 0 && (
                <div style={{ marginTop: '16px' }}>
                  <div style={{ fontSize: '13px', fontWeight: '600', color: '#0f172a', marginBottom: '10px' }}>
                    Attached Images ({formData.mediaPreviews.length}):
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))', gap: '12px' }}>
                    {formData.mediaPreviews.map((p, idx) => (
                      <div
                        key={idx}
                        style={{
                          position: 'relative',
                          border: '1px solid #cbd5e1',
                          borderRadius: '8px',
                          overflow: 'hidden',
                          background: 'white',
                          boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
                        }}
                      >
                        <img
                          src={p.url}
                          alt={`Advert Preview ${idx + 1}`}
                          style={{ width: '100%', height: '100px', objectFit: 'cover', display: 'block' }}
                        />
                        <div style={{ padding: '6px 8px', fontSize: '11px', color: '#475569', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} title={p.name}>
                          #{idx + 1} • {p.name}
                        </div>
                        <button
                          type="button"
                          onClick={() => handleRemoveMedia(idx)}
                          style={{
                            position: 'absolute',
                            top: '4px',
                            right: '4px',
                            background: 'rgba(239, 68, 68, 0.9)',
                            color: 'white',
                            border: 'none',
                            borderRadius: '50%',
                            width: '22px',
                            height: '22px',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '12px',
                            fontWeight: 'bold',
                          }}
                          title="Remove image"
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Caption & CTA */}
            <div className="form-group" style={{ marginBottom: '16px' }}>
              <label className="form-label">Ad Caption (Text for influencers to post)</label>
              <textarea
                rows="3"
                className="form-control"
                placeholder="e.g. Get 20% off all designer sneakers this weekend only! Tap link below or send WhatsApp DM..."
                value={formData.adCopy}
                onChange={(e) => setFormData({ ...formData, adCopy: e.target.value })}
                style={{ borderRadius: '8px' }}
              />
            </div>

            <div className="form-row" style={{ marginBottom: '24px' }}>
              <div className="form-group" style={{ margin: 0 }}>
                <label className="form-label">Call to Action</label>
                <select
                  className="form-control"
                  value={formData.actionType}
                  onChange={(e) => setFormData({ ...formData, actionType: e.target.value })}
                  style={{ height: '44px', borderRadius: '8px' }}
                >
                  {ctaOptions.map((cta) => (
                    <option key={cta} value={cta}>{cta}</option>
                  ))}
                </select>
              </div>

              <div className="form-group" style={{ margin: 0 }}>
                <label className="form-label">CTA Target Link or Contact</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="e.g. https://store.com or +2348012345678"
                  value={formData.targetValue}
                  onChange={(e) => setFormData({ ...formData, targetValue: e.target.value })}
                  style={{ height: '44px', borderRadius: '8px' }}
                />
              </div>
            </div>

            <button
              type="button"
              className="btn btn-primary"
              onClick={handleNextStep1}
              style={{ width: '100%', padding: '14px', fontWeight: '600', borderRadius: '8px' }}
            >
              Continue to Global Targeting &rarr;
            </button>
          </div>
        )}

        {/* STEP 2: Global Location Targeting */}
        {step === 2 && (
          <div className="card" style={{ padding: '32px' }}>
            <h3 style={{ margin: '0 0 6px', fontSize: '1.25rem', color: '#0f172a', fontWeight: '700' }}>
              Step 2: Global Audience Targeting &amp; Reach
            </h3>
            <p style={{ margin: '0 0 24px', fontSize: '13px', color: '#64748b' }}>
              Choose the geographic location of WhatsApp creators and select your desired viewer reach.
            </p>

            {/* Target Country */}
            <div style={{ marginBottom: '16px' }}>
              <CountrySelect
                label="Target Country"
                required
                name="targetCountry"
                value={formData.targetCountry}
                onChange={handleCountryChange}
              />
            </div>

            {/* Nationwide Option */}
            <div style={{ marginBottom: '20px', padding: '12px 16px', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', margin: 0 }}>
                <input
                  type="checkbox"
                  checked={formData.isNationwide}
                  onChange={(e) => setFormData({ ...formData, isNationwide: e.target.checked })}
                  style={{ width: '18px', height: '18px', accentColor: '#059669', cursor: 'pointer' }}
                />
                <span style={{ fontSize: '14px', fontWeight: '600', color: '#0f172a' }}>
                  Target Nationwide in {formData.targetCountry}
                </span>
              </label>
              <div style={{ fontSize: '12px', color: '#64748b', marginTop: '4px', marginLeft: '28px' }}>
                Distribute your campaign across influencers throughout the entire nation rather than specific local areas.
              </div>
            </div>

            {/* Administrative Region & Local Areas (if not nationwide) */}
            {!formData.isNationwide && (
              <div style={{ marginBottom: '24px', background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '20px' }}>
                <div className="form-group" style={{ marginBottom: '16px' }}>
                  <label className="form-label" style={{ fontWeight: '600' }}>
                    Select Region / State / Division in {formData.targetCountry} <span style={{ color: '#dc2626' }}>*</span>
                  </label>
                  {currentRegions.length > 0 ? (
                    <select
                      className="form-control"
                      value={formData.targetRegion}
                      onChange={handleRegionChange}
                      style={{ height: '44px', borderRadius: '8px' }}
                    >
                      {currentRegions.map((r) => (
                        <option key={r} value={r}>{r}</option>
                      ))}
                    </select>
                  ) : (
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Enter administrative region or province"
                      value={formData.targetRegion}
                      onChange={(e) => setFormData({ ...formData, targetRegion: e.target.value })}
                      style={{ height: '44px', borderRadius: '8px' }}
                    />
                  )}
                </div>

                {/* Multiple Local Areas Selection with Limit Tracker */}
                <div style={{ marginBottom: '16px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                    <label className="form-label" style={{ margin: 0, fontWeight: '600' }}>
                      Select Local Target Areas
                    </label>
                    <span style={{ fontSize: '12px', fontWeight: '700', color: formData.targetAreas.length >= maxCampaignAreas ? '#dc2626' : '#059669' }}>
                      Selected: {formData.targetAreas.length} / {maxCampaignAreas} Max Allowed
                    </span>
                  </div>

                  {/* Quick-add from known LGAs/Districts */}
                  {currentRegionLgas.length > 0 && (
                    <div style={{ marginBottom: '12px' }}>
                      <select
                        className="form-control"
                        onChange={(e) => {
                          if (e.target.value) {
                            handleAddArea(e.target.value);
                            e.target.value = '';
                          }
                        }}
                        disabled={formData.targetAreas.length >= maxCampaignAreas}
                        style={{ height: '44px', borderRadius: '8px' }}
                      >
                        <option value="">-- Click to add an area from {formData.targetRegion} --</option>
                        {currentRegionLgas.map((lga) => (
                          <option key={lga} value={lga} disabled={formData.targetAreas.includes(lga)}>
                            {lga} {formData.targetAreas.includes(lga) ? '(Added)' : ''}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}

                  {/* Custom area input */}
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Or type a custom neighborhood/area..."
                      value={formData.customAreaInput}
                      onChange={(e) => setFormData({ ...formData, customAreaInput: e.target.value })}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handleAddArea(formData.customAreaInput);
                        }
                      }}
                      disabled={formData.targetAreas.length >= maxCampaignAreas}
                      style={{ height: '44px', borderRadius: '8px' }}
                    />
                    <button
                      type="button"
                      className="btn btn-primary"
                      onClick={() => handleAddArea(formData.customAreaInput)}
                      disabled={formData.targetAreas.length >= maxCampaignAreas || !formData.customAreaInput.trim()}
                      style={{ padding: '0 20px', borderRadius: '8px', whiteSpace: 'nowrap' }}
                    >
                      + Add Area
                    </button>
                  </div>

                  {/* Selected Areas Chips */}
                  <div style={{ marginTop: '14px', display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                    {formData.targetAreas.length === 0 ? (
                      <span style={{ fontSize: '13px', color: '#94a3b8', fontStyle: 'italic' }}>
                        No local areas selected yet. Add at least one area or check Nationwide above.
                      </span>
                    ) : (
                      formData.targetAreas.map((area) => (
                        <span
                          key={area}
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '6px',
                            background: '#ecfdf5',
                            border: '1px solid #a7f3d0',
                            color: '#065f46',
                            padding: '6px 12px',
                            borderRadius: '20px',
                            fontSize: '12px',
                            fontWeight: '600',
                          }}
                        >
                          📍 {area}
                          <button
                            type="button"
                            onClick={() => handleRemoveArea(area)}
                            style={{
                              background: 'transparent',
                              border: 'none',
                              color: '#065f46',
                              cursor: 'pointer',
                              fontWeight: '700',
                              padding: '0 2px',
                              lineHeight: 1,
                            }}
                            title={`Remove ${area}`}
                          >
                            &times;
                          </button>
                        </span>
                      ))
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Reach Package Selection */}
            <div style={{ marginBottom: '24px' }}>
              <label className="form-label" style={{ fontWeight: '600', marginBottom: '8px', display: 'block' }}>
                Select Desired Audience Reach Package
              </label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 180px), 1fr))', gap: '12px' }}>
                {packages.map((pkg) => {
                  const isSelected = formData.selectedPackage === pkg._id;
                  const views = pkg.minimumViews || pkg.views || 1000;
                  return (
                    <div
                      key={pkg._id}
                      onClick={() => handlePackageSelect(pkg)}
                      style={{
                        padding: '16px',
                        borderRadius: '12px',
                        border: isSelected ? '2px solid #059669' : '1px solid #cbd5e1',
                        background: isSelected ? '#ecfdf5' : '#ffffff',
                        cursor: 'pointer',
                        transition: 'all 0.2s',
                      }}
                    >
                      <div style={{ fontWeight: '700', fontSize: '14px', color: isSelected ? '#065f46' : '#0f172a' }}>
                        {pkg.name}
                      </div>
                      <div style={{ fontSize: '1.25rem', fontWeight: '800', color: '#059669', margin: '4px 0' }}>
                        {formData.currency} {Number(pkg.price).toLocaleString()}
                      </div>
                      <div style={{ fontSize: '12px', color: '#64748b' }}>
                        {Number(views).toLocaleString()} Verified Views
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Duration */}
            <div className="form-group" style={{ marginBottom: '24px' }}>
              <label className="form-label" style={{ fontWeight: '600' }}>Campaign Posting Duration</label>
              <select
                className="form-control"
                value={formData.duration}
                onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                style={{ height: '44px', borderRadius: '8px' }}
              >
                {durations.map((d) => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
            </div>

            <div style={{ display: 'flex', gap: '12px' }}>
              <button
                type="button"
                className="btn btn-ghost"
                onClick={() => setStep(1)}
                style={{ flex: 1, padding: '14px', borderRadius: '8px' }}
              >
                &larr; Back to Details
              </button>
              <button
                type="button"
                className="btn btn-primary"
                onClick={handleNextStep2}
                style={{ flex: 2, padding: '14px', fontWeight: '600', borderRadius: '8px' }}
              >
                Review &amp; Proceed to Payment &rarr;
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: Review & Payment Instructions & Receipt Upload */}
        {step === 3 && (
          <form onSubmit={handleSubmitCampaign}>
            <div className="card" style={{ padding: 'clamp(16px, 4vw, 32px)', marginBottom: '24px' }}>
              <h3 style={{ margin: '0 0 6px', fontSize: '1.25rem', color: '#0f172a', fontWeight: '700' }}>
                Step 3: Review Campaign &amp; Payment
              </h3>
              <p style={{ margin: '0 0 20px', fontSize: '13px', color: '#64748b' }}>
                Verify your order details below and follow the official payment instructions.
              </p>

              {/* Order Summary Box */}
              <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '12px', padding: 'clamp(12px, 3vw, 20px)', marginBottom: '24px' }}>
                <h4 style={{ margin: '0 0 12px', fontSize: '14px', color: '#0f172a', fontWeight: '700' }}>
                  Campaign Summary:
                </h4>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 160px), 1fr))', gap: '12px', fontSize: '13px' }}>
                  <div>
                    <span style={{ color: '#64748b' }}>Campaign:</span> <strong>{formData.title}</strong>
                  </div>
                  <div>
                    <span style={{ color: '#64748b' }}>Category:</span> <strong>{formData.category}</strong>
                  </div>
                  <div>
                    <span style={{ color: '#64748b' }}>Target Country:</span> <strong>{formData.targetCountry}</strong>
                  </div>
                  <div>
                    <span style={{ color: '#64748b' }}>Target Location:</span>{' '}
                    <strong>{formData.isNationwide ? 'Nationwide' : `${formData.targetRegion} (${formData.targetAreas.join(', ')})`}</strong>
                  </div>
                  <div>
                    <span style={{ color: '#64748b' }}>Reach Target:</span>{' '}
                    <strong>{Number(formData.requiredViews).toLocaleString()} Views</strong>
                  </div>
                  <div>
                    <span style={{ color: '#64748b' }}>Duration:</span> <strong>{formData.duration}</strong>
                  </div>
                </div>

                {formData.mediaPreviews?.length > 0 && (
                  <div style={{ marginTop: '14px', paddingTop: '12px', borderTop: '1px solid #e2e8f0' }}>
                    <span style={{ color: '#64748b', fontSize: '12px', display: 'block', marginBottom: '6px' }}>Attached Creative Images ({formData.mediaPreviews.length}):</span>
                    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                      {formData.mediaPreviews.map((p, i) => (
                        <img key={i} src={p.url} alt={`Flyer ${i + 1}`} style={{ width: '50px', height: '50px', objectFit: 'cover', borderRadius: '6px', border: '1px solid #cbd5e1' }} />
                      ))}
                    </div>
                  </div>
                )}

                <div style={{ marginTop: '16px', paddingTop: '16px', borderTop: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '14px', fontWeight: '600', color: '#334155' }}>Total Payable:</span>
                  <span style={{ fontSize: '1.5rem', fontWeight: '800', color: '#059669' }}>
                    {formData.currency} {Number(formData.price).toLocaleString()}
                  </span>
                </div>
              </div>

              {/* Section 13: Admin-Managed Payment Instructions */}
              <div style={{ background: '#ecfdf5', border: '1px solid #a7f3d0', borderRadius: '12px', padding: '24px', marginBottom: '24px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
                  <span style={{ fontSize: '24px' }}>🏦</span>
                  <h4 style={{ margin: 0, fontSize: '15px', color: '#065f46', fontWeight: '700' }}>
                    Official Payment Instructions (Admin Verified)
                  </h4>
                </div>

                <p style={{ fontSize: '13px', color: '#047857', marginBottom: '16px', lineHeight: '1.6' }}>
                  {paymentSettings?.instructions || 'Please transfer the exact campaign amount to our official brokerage account below and upload your receipt screenshot for admin confirmation.'}
                </p>

                <div style={{ background: '#ffffff', borderRadius: '10px', border: '1px solid #bbf7d0', padding: 'clamp(12px, 3vw, 16px)', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 150px), 1fr))', gap: '14px' }}>
                  <div>
                    <div style={{ fontSize: '11px', textTransform: 'uppercase', color: '#64748b', fontWeight: '600' }}>Bank Name</div>
                    <div style={{ fontSize: '15px', fontWeight: '700', color: '#0f172a' }}>{paymentSettings?.bankName || 'Zenith Bank'}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: '11px', textTransform: 'uppercase', color: '#64748b', fontWeight: '600' }}>Account Name</div>
                    <div style={{ fontSize: '15px', fontWeight: '700', color: '#0f172a' }}>{paymentSettings?.accountName || 'MEDIOVA Media Brokerage Ltd'}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: '11px', textTransform: 'uppercase', color: '#64748b', fontWeight: '600' }}>Account Number</div>
                    <div style={{ fontSize: '18px', fontWeight: '800', color: '#059669', letterSpacing: '0.5px' }}>{paymentSettings?.accountNumber || '1012345678'}</div>
                  </div>
                  {paymentSettings?.sortCode && (
                    <div>
                      <div style={{ fontSize: '11px', textTransform: 'uppercase', color: '#64748b', fontWeight: '600' }}>Sort / Routing Code</div>
                      <div style={{ fontSize: '14px', fontWeight: '600', color: '#0f172a' }}>{paymentSettings.sortCode}</div>
                    </div>
                  )}
                </div>
              </div>

              {/* Section 13.3: Payment Receipt Upload */}
              <div style={{ padding: '20px', border: '2px dashed #cbd5e1', borderRadius: '12px', background: '#f8fafc', marginBottom: '24px' }}>
                <label className="form-label" style={{ fontWeight: '700', fontSize: '14px', marginBottom: '6px', display: 'block' }}>
                  Upload Payment Transfer Receipt (Screenshot / Photo)
                </label>
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp,image/*"
                  onChange={handleReceiptChange}
                  className="form-control"
                  style={{ padding: '10px' }}
                />
                <span className="form-hint" style={{ fontSize: '12px', color: '#64748b', marginTop: '6px', display: 'block' }}>
                  Upload proof of transfer. Admin reviews and confirms payment before influencers are assigned.
                </span>

                {formData.receiptPreview && (
                  <div style={{ marginTop: '16px', display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <img
                      src={formData.receiptPreview}
                      alt="Receipt Preview"
                      style={{ width: '90px', height: '90px', objectFit: 'cover', borderRadius: '8px', border: '1px solid #e2e8f0' }}
                    />
                    <div>
                      <div style={{ fontSize: '13px', fontWeight: '600', color: '#059669' }}>
                        ✓ Receipt Attached: {formData.receiptFile?.name}
                      </div>
                      <div style={{ fontSize: '12px', color: '#64748b' }}>
                        Will be submitted alongside your campaign for administrator review.
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Actions */}
              <div style={{ display: 'flex', gap: '12px' }}>
                <button
                  type="button"
                  className="btn btn-ghost"
                  onClick={() => setStep(2)}
                  disabled={submitting}
                  style={{ flex: 1, padding: '14px', borderRadius: '8px' }}
                >
                  &larr; Back to Targeting
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={submitting}
                  style={{ flex: 2, padding: '14px', fontWeight: '600', borderRadius: '8px' }}
                >
                  {submitting ? 'Submitting Campaign & Receipt...' : 'Submit Complete Campaign Order'}
                </button>
              </div>
            </div>
          </form>
        )}
      </div>
    </DashboardLayout>
  );
}
