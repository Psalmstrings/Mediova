import React, { useState, useEffect } from 'react';
import DashboardLayout from '../../layouts/DashboardLayout';
import { getInfluencerProfile, updateInfluencerProfile, submitReachProof } from '../../services/api';
import { toast } from '../../components/ui/Toast';

const nigerianStates = [
  'Lagos', 'Abuja (FCT)', 'Rivers', 'Oyo', 'Kano', 'Enugu', 'Delta', 'Anambra',
  'Ogun', 'Kaduna', 'Edo', 'Imo', 'Akwa Ibom', 'Plateau', 'Ondo', 'Kwara', 'Other',
];

const availableCategories = [
  'Fashion', 'Beauty', 'Electronics', 'Technology', 'Food', 'Restaurants',
  'Real Estate', 'Education', 'Finance', 'Business', 'Events', 'Entertainment',
  'Sports', 'Travel', 'Fitness', 'Automobile', 'E-commerce', 'Jobs & Career', 'Lifestyle',
];

export default function InfluencerProfile() {
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState(null);

  // Edit Profile State
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [whatsappNumber, setWhatsappNumber] = useState('');
  const [state, setState] = useState('Lagos');
  const [city, setCity] = useState('');
  const [lga, setLga] = useState('');
  const [area, setArea] = useState('');
  const [additionalAreas, setAdditionalAreas] = useState('');
  const [categories, setCategories] = useState([]);
  const [savingProfile, setSavingProfile] = useState(false);

  // Reach Proof Upload State
  const [averageViews, setAverageViews] = useState('');
  const [proofFile, setProofFile] = useState(null);
  const [uploadingProof, setUploadingProof] = useState(false);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const { data } = await getInfluencerProfile();
      const p = data.profile;
      setProfile(p);
      setName(p.userId?.name || '');
      setPhone(p.userId?.phone || '');
      setWhatsappNumber(p.whatsappNumber || '');
      setState(p.state || 'Lagos');
      setCity(p.city || '');
      setLga(p.lga || '');
      setArea(p.area || '');
      setAdditionalAreas(Array.isArray(p.additionalAreas) ? p.additionalAreas.join(', ') : '');
      setCategories(p.categories || []);
      setAverageViews(p.averageViews || '');
    } catch (err) {
      toast.error('Failed to load profile.');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setSavingProfile(true);
    try {
      const payload = {
        name,
        phone,
        whatsappNumber,
        state,
        city,
        lga,
        area,
        additionalAreas: additionalAreas.split(',').map((s) => s.trim()).filter(Boolean),
        categories,
      };
      const { data } = await updateInfluencerProfile(payload);
      toast.success(data.message || 'Profile updated successfully!');
      setProfile(data.profile);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update profile.');
    } finally {
      setSavingProfile(false);
    }
  };

  const handleUploadProof = async (e) => {
    e.preventDefault();
    if (!proofFile && !averageViews) {
      toast.warning('Please select a screenshot file or enter your average views.');
      return;
    }

    setUploadingProof(true);
    try {
      const formData = new FormData();
      formData.append('averageViews', averageViews);
      if (proofFile) formData.append('proofImages', proofFile);

      const { data } = await submitReachProof(formData);
      toast.success(data.message || 'Proof submitted for Admin review.');
      setProfile(data.profile);
      setProofFile(null);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to upload proof.');
    } finally {
      setUploadingProof(false);
    }
  };

  const toggleCategory = (cat) => {
    if (categories.includes(cat)) {
      setCategories(categories.filter((c) => c !== cat));
    } else {
      setCategories([...categories, cat]);
    }
  };

  if (loading) {
    return (
      <DashboardLayout title="My Profile" role="influencer">
        <div style={{ textAlign: 'center', padding: '60px' }}>
          <div className="spinner" style={{ margin: '0 auto 16px' }} />
          <p style={{ color: '#64748b' }}>Loading profile...</p>
        </div>
      </DashboardLayout>
    );
  }

  const isVerified = profile?.verificationStatus === 'verified';

  return (
    <DashboardLayout title="Influencer Profile" role="influencer">
      {/* Profile Overview Card */}
      <div className="card" style={{ padding: '28px', marginBottom: '28px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <div style={{ width: '70px', height: '70px', borderRadius: '50%', background: '#059669', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px', fontWeight: '800' }}>
            {profile?.userId?.name?.slice(0, 2).toUpperCase()}
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <h2 style={{ fontSize: '1.5rem', margin: 0 }}>{profile?.userId?.name}</h2>
              {isVerified ? (
                <span className="badge badge-success">✓ Verified Reach</span>
              ) : (
                <span className="badge badge-warning">Verification: {profile?.verificationStatus || 'Pending'}</span>
              )}
            </div>
            <div style={{ color: '#64748b', fontSize: '14px', marginTop: '4px' }}>
               {profile?.area}, {profile?.state} • Joined {new Date(profile?.createdAt).toLocaleDateString()}
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '24px' }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '12px', color: '#64748b' }}>Verified Views</div>
            <div style={{ fontSize: '1.4rem', fontWeight: '800', color: '#059669' }}>
              {Number(profile?.verifiedViews).toLocaleString()}
            </div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '12px', color: '#64748b' }}>Reliability Score</div>
            <div style={{ fontSize: '1.4rem', fontWeight: '800', color: '#2563eb' }}>
              {profile?.reliabilityScore || 100}%
            </div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '12px', color: '#64748b' }}>Completed Gigs</div>
            <div style={{ fontSize: '1.4rem', fontWeight: '800', color: '#0f172a' }}>
              {profile?.completedGigs || 0}
            </div>
          </div>
        </div>
      </div>

      <div className="grid-2" style={{ gap: '28px', alignItems: 'flex-start' }}>
        {/* Reach Proof Submission Card */}
        <div className="card">
          <div className="card-header">
            <h3 style={{ fontSize: '1.2rem' }}> WhatsApp Reach Verification</h3>
          </div>
          <div className="card-body">
            <p style={{ color: '#64748b', fontSize: '13px', lineHeight: '1.6', marginBottom: '20px' }}>
              Upload recent screenshots of your WhatsApp Status views. The Admin reviews your proof and assigns your official verified views tier.
            </p>

            <form onSubmit={handleUploadProof}>
              <div className="form-group">
                <label className="form-label">Average Status Views</label>
                <input
                  type="number"
                  required
                  min="100"
                  className="form-control"
                  placeholder="e.g. 1500"
                  value={averageViews}
                  onChange={(e) => setAverageViews(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Upload Status Views Screenshot</label>
                <input
                  type="file"
                  accept="image/*"
                  className="form-control"
                  onChange={(e) => setProofFile(e.target.files[0])}
                />
                <span className="form-hint">Upload a screenshot showing your views count.</span>
              </div>

              <button type="submit" className="btn btn-primary btn-block" disabled={uploadingProof}>
                {uploadingProof ? 'Uploading Screenshots...' : 'Submit Reach Proof for Admin Review'}
              </button>
            </form>

            {profile?.proofImages && profile.proofImages.length > 0 && (
              <div style={{ marginTop: '24px' }}>
                <strong style={{ fontSize: '13px' }}>Uploaded Verification Screenshots:</strong>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))', gap: '8px', marginTop: '10px' }}>
                  {profile.proofImages.map((img, i) => (
                    <a key={i} href={img.url} target="_blank" rel="noreferrer">
                      <img src={img.url} alt={`Reach proof ${i}`} style={{ width: '100%', height: '90px', objectFit: 'cover', borderRadius: '6px', border: '1px solid #e2e8f0' }} />
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Edit Personal & Location Information */}
        <div className="card">
          <div className="card-header">
            <h3 style={{ fontSize: '1.2rem' }}> Personal & Location Details</h3>
          </div>
          <div className="card-body">
            <form onSubmit={handleSaveProfile}>
              <div className="form-group">
                <label className="form-label">Full Name</label>
                <input
                  type="text"
                  required
                  className="form-control"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Phone Number</label>
                  <input
                    type="tel"
                    required
                    className="form-control"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">WhatsApp Number</label>
                  <input
                    type="tel"
                    required
                    className="form-control"
                    value={whatsappNumber}
                    onChange={(e) => setWhatsappNumber(e.target.value)}
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">State</label>
                  <select
                    className="form-control"
                    value={state}
                    onChange={(e) => setState(e.target.value)}
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
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">LGA</label>
                  <input
                    type="text"
                    className="form-control"
                    value={lga}
                    onChange={(e) => setLga(e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Primary Area / Neighborhood</label>
                  <input
                    type="text"
                    required
                    className="form-control"
                    value={area}
                    onChange={(e) => setArea(e.target.value)}
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Additional Areas You Can Reach</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="e.g. Victoria Island, Ikoyi, Yaba"
                  value={additionalAreas}
                  onChange={(e) => setAdditionalAreas(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Preferred Advertising Categories</label>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: '6px' }}>
                  {availableCategories.map((c) => {
                    const sel = categories.includes(c);
                    return (
                      <button
                        type="button"
                        key={c}
                        onClick={() => toggleCategory(c)}
                        style={{
                          padding: '4px 10px',
                          borderRadius: '14px',
                          border: sel ? '1.5px solid #059669' : '1px solid #cbd5e1',
                          background: sel ? '#ecfdf5' : 'white',
                          color: sel ? '#065f46' : '#475569',
                          fontSize: '12px',
                          fontWeight: sel ? '700' : '400',
                          cursor: 'pointer',
                        }}
                      >
                        {sel ? `✓ ${c}` : `+ ${c}`}
                      </button>
                    );
                  })}
                </div>
              </div>

              <button type="submit" className="btn btn-primary btn-block" disabled={savingProfile} style={{ marginTop: '20px' }}>
                {savingProfile ? 'Saving Details...' : 'Save Profile Changes'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
