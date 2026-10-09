import React, { useState, useEffect } from 'react';
import DashboardLayout from '../../layouts/DashboardLayout';
import { getVendorProfile, updateVendorProfile } from '../../services/api';
import { toast } from '../../components/ui/Toast';

const nigerianStates = [
  'Lagos', 'Abuja (FCT)', 'Rivers', 'Oyo', 'Kano', 'Enugu', 'Delta', 'Anambra',
  'Ogun', 'Kaduna', 'Edo', 'Imo', 'Akwa Ibom', 'Plateau', 'Ondo', 'Kwara', 'Other',
];

export default function VendorProfile() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    businessName: '',
    contactPerson: '',
    businessCategory: '',
    description: '',
    phone: '',
    whatsapp: '',
    state: 'Lagos',
    city: '',
    lga: '',
    area: '',
    businessAddress: '',
    website: '',
    instagram: '',
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const { data } = await getVendorProfile();
      const p = data.profile;
      setFormData({
        name: p.userId?.name || '',
        businessName: p.businessName || '',
        contactPerson: p.contactPerson || '',
        businessCategory: p.businessCategory || '',
        description: p.description || '',
        phone: p.phone || '',
        whatsapp: p.whatsapp || '',
        state: p.state || 'Lagos',
        city: p.city || '',
        lga: p.lga || '',
        area: p.area || '',
        businessAddress: p.businessAddress || '',
        website: p.website || '',
        instagram: p.socialLinks?.instagram || '',
      });
    } catch (err) {
      toast.error('Failed to load business profile.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = {
        ...formData,
        socialLinks: { instagram: formData.instagram },
      };
      const { data } = await updateVendorProfile(payload);
      toast.success(data.message || 'Business profile updated successfully!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update profile.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <DashboardLayout title="Account Settings" role="vendor">
        <div style={{ textAlign: 'center', padding: '60px' }}>
          <div className="spinner" style={{ margin: '0 auto 16px' }} />
          <p style={{ color: '#64748b' }}>Loading business profile...</p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout title="Account Settings" role="vendor">
      <div className="page-header">
        <div>
          <h2 className="page-title">Business Profile & Settings</h2>
          <p className="page-subtitle">Manage company details, contact person, and operational location.</p>
        </div>
      </div>

      <div className="card" style={{ maxWidth: '800px', margin: '0 auto' }}>
        <div className="card-body" style={{ padding: '32px' }}>
          <form onSubmit={handleSubmit}>
            <h4 style={{ marginBottom: '16px' }}>Business Information</h4>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Company / Brand Name <span className="required">*</span></label>
                <input
                  type="text"
                  required
                  className="form-control"
                  value={formData.businessName}
                  onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Contact Person Name</label>
                <input
                  type="text"
                  className="form-control"
                  value={formData.contactPerson}
                  onChange={(e) => setFormData({ ...formData, contactPerson: e.target.value })}
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Phone Number</label>
                <input
                  type="tel"
                  className="form-control"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label className="form-label">WhatsApp Contact Number</label>
                <input
                  type="tel"
                  className="form-control"
                  value={formData.whatsapp}
                  onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })}
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Business Description</label>
              <textarea
                className="form-control"
                rows={3}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
            </div>

            <h4 style={{ margin: '24px 0 16px' }}>Business Location</h4>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">State</label>
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
                  value={formData.lga}
                  onChange={(e) => setFormData({ ...formData, lga: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Area / Neighborhood</label>
                <input
                  type="text"
                  className="form-control"
                  value={formData.area}
                  onChange={(e) => setFormData({ ...formData, area: e.target.value })}
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Full Business Address</label>
              <input
                type="text"
                className="form-control"
                value={formData.businessAddress}
                onChange={(e) => setFormData({ ...formData, businessAddress: e.target.value })}
              />
            </div>

            <h4 style={{ margin: '24px 0 16px' }}>Online Presence</h4>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Website</label>
                <input
                  type="url"
                  className="form-control"
                  placeholder="https://mybusiness.com"
                  value={formData.website}
                  onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Instagram Handle</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="@mybrand"
                  value={formData.instagram}
                  onChange={(e) => setFormData({ ...formData, instagram: e.target.value })}
                />
              </div>
            </div>

            <button type="submit" className="btn btn-primary btn-block btn-lg" disabled={saving} style={{ marginTop: '24px' }}>
              {saving ? 'Saving Profile...' : 'Save Changes'}
            </button>
          </form>
        </div>
      </div>
    </DashboardLayout>
  );
}
