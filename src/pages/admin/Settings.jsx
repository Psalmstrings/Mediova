import React, { useState, useEffect } from 'react';
import DashboardLayout from '../../layouts/DashboardLayout';
import { adminGetSettings, adminUpdateSettings } from '../../services/api';
import { toast } from '../../components/ui/Toast';

export default function AdminSettings() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [settings, setSettings] = useState({
    platformName: '',
    supportEmail: '',
    supportPhone: '',
    whatsappNumber: '',
    businessAddress: '',
    defaultWhatsAppMessage: '',
    manualPaymentInstructions: '',
    bankName: '',
    accountName: '',
    accountNumber: '',
    currency: 'NGN',
    sortCode: '',
    swiftBic: '',
    maxCampaignAreas: 15,
    minInfluencerViews: 500,
  });

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const { data } = await adminGetSettings();
      const s = data.settings || {};
      setSettings({
        platformName: s.platformName || 'MEDIOVA Advertising',
        supportEmail: s.supportEmail || 'support@mediova.ng',
        supportPhone: s.supportPhone || '+2348012345678',
        whatsappNumber: s.whatsappNumber || '+2348012345678',
        businessAddress: s.businessAddress || 'Victoria Island, Lagos, Nigeria',
        defaultWhatsAppMessage: s.defaultWhatsAppMessage || '',
        manualPaymentInstructions: s.manualPaymentInstructions || '',
        bankName: s.bankDetails?.bankName || 'Zenith Bank',
        accountName: s.bankDetails?.accountName || 'MEDIOVA Media Brokerage Ltd',
        accountNumber: s.bankDetails?.accountNumber || '1012345678',
        currency: s.bankDetails?.currency || 'NGN',
        sortCode: s.bankDetails?.sortCode || '',
        swiftBic: s.bankDetails?.swiftBic || '',
        maxCampaignAreas: s.maxCampaignAreas !== undefined ? s.maxCampaignAreas : 15,
        minInfluencerViews: s.minInfluencerViews || 500,
      });
    } catch (err) {
      toast.error('Failed to load platform settings.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = {
        platformName: settings.platformName,
        supportEmail: settings.supportEmail,
        supportPhone: settings.supportPhone,
        whatsappNumber: settings.whatsappNumber,
        businessAddress: settings.businessAddress,
        defaultWhatsAppMessage: settings.defaultWhatsAppMessage,
        manualPaymentInstructions: settings.manualPaymentInstructions,
        bankDetails: {
          bankName: settings.bankName,
          accountName: settings.accountName,
          accountNumber: settings.accountNumber,
          currency: settings.currency,
          sortCode: settings.sortCode,
          swiftBic: settings.swiftBic,
        },
        maxCampaignAreas: Number(settings.maxCampaignAreas),
        minInfluencerViews: Number(settings.minInfluencerViews),
      };

      const { data } = await adminUpdateSettings(payload);
      toast.success(data.message || 'Platform settings updated successfully!');
    } catch (err) {
      toast.error('Failed to update settings.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <DashboardLayout title="Platform Settings" role="admin">
        <div style={{ textAlign: 'center', padding: '60px' }}>
          <div className="spinner" style={{ margin: '0 auto 16px' }} />
          <p style={{ color: '#64748b' }}>Loading settings...</p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout title="Platform Settings" role="admin">
      <div className="page-header">
        <div>
          <h2 className="page-title">Brokerage Platform Settings</h2>
          <p className="page-subtitle">Configure WhatsApp communication numbers, payment instructions, and business parameters.</p>
        </div>
      </div>

      <div className="card" style={{ maxWidth: '800px', margin: '0 auto' }}>
        <div className="card-body" style={{ padding: '32px' }}>
          <form onSubmit={handleSubmit}>
            <h4 style={{ marginBottom: '16px' }}>Business Information</h4>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Platform Name</label>
                <input
                  type="text"
                  required
                  className="form-control"
                  value={settings.platformName}
                  onChange={(e) => setSettings({ ...settings, platformName: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Support Email</label>
                <input
                  type="email"
                  required
                  className="form-control"
                  value={settings.supportEmail}
                  onChange={(e) => setSettings({ ...settings, supportEmail: e.target.value })}
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Support Phone</label>
                <input
                  type="tel"
                  required
                  className="form-control"
                  value={settings.supportPhone}
                  onChange={(e) => setSettings({ ...settings, supportPhone: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Official Broker WhatsApp Number (International format e.g. +234...)</label>
                <input
                  type="text"
                  required
                  className="form-control"
                  value={settings.whatsappNumber}
                  onChange={(e) => setSettings({ ...settings, whatsappNumber: e.target.value })}
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Business Office Address</label>
              <input
                type="text"
                className="form-control"
                value={settings.businessAddress}
                onChange={(e) => setSettings({ ...settings, businessAddress: e.target.value })}
              />
            </div>

            <h4 style={{ margin: '24px 0 16px' }}>WhatsApp Integration & Messages</h4>

            <div className="form-group">
              <label className="form-label">Default Pre-filled WhatsApp Order Message</label>
              <textarea
                className="form-control"
                rows={2}
                value={settings.defaultWhatsAppMessage}
                onChange={(e) => setSettings({ ...settings, defaultWhatsAppMessage: e.target.value })}
              />
              <span className="form-hint">Use {'{ORDER_NUMBER}'} and {'{TITLE}'} placeholders.</span>
            </div>

            <h4 style={{ margin: '24px 0 16px' }}>Campaign & Influencer Rules</h4>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Maximum Campaign Local Areas</label>
                <input
                  type="number"
                  min="1"
                  max="100"
                  className="form-control"
                  value={settings.maxCampaignAreas}
                  onChange={(e) => setSettings({ ...settings, maxCampaignAreas: e.target.value })}
                />
                <span className="form-hint">Cap on the number of local areas/districts a vendor can select per targeted advert.</span>
              </div>
              <div className="form-group">
                <label className="form-label">Minimum Influencer Views Required</label>
                <input
                  type="number"
                  min="100"
                  className="form-control"
                  value={settings.minInfluencerViews}
                  onChange={(e) => setSettings({ ...settings, minInfluencerViews: e.target.value })}
                />
                <span className="form-hint">Minimum audited WhatsApp views threshold for influencer verification.</span>
              </div>
            </div>

            <h4 style={{ margin: '24px 0 16px' }}>Bank Transfer Payment Instructions</h4>

            <div className="form-group">
              <label className="form-label">Payment Instructions Shown to Advertisers</label>
              <textarea
                className="form-control"
                rows={2}
                value={settings.manualPaymentInstructions}
                onChange={(e) => setSettings({ ...settings, manualPaymentInstructions: e.target.value })}
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Bank Name</label>
                <input
                  type="text"
                  className="form-control"
                  value={settings.bankName}
                  onChange={(e) => setSettings({ ...settings, bankName: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Account Number / IBAN</label>
                <input
                  type="text"
                  className="form-control"
                  value={settings.accountNumber}
                  onChange={(e) => setSettings({ ...settings, accountNumber: e.target.value })}
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Account Name</label>
                <input
                  type="text"
                  className="form-control"
                  value={settings.accountName}
                  onChange={(e) => setSettings({ ...settings, accountName: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Payment Currency</label>
                <select
                  className="form-control"
                  value={settings.currency}
                  onChange={(e) => setSettings({ ...settings, currency: e.target.value })}
                >
                  <option value="NGN">NGN (Nigerian Naira - ₦)</option>
                  <option value="USD">USD (US Dollar - $)</option>
                  <option value="GBP">GBP (British Pound - £)</option>
                  <option value="EUR">EUR (Euro - €)</option>
                  <option value="KES">KES (Kenyan Shilling - Ksh)</option>
                  <option value="GHS">GHS (Ghanaian Cedi - GH₵)</option>
                  <option value="ZAR">ZAR (South African Rand - R)</option>
                </select>
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Sort Code / Routing Number (Optional)</label>
                <input
                  type="text"
                  className="form-control"
                  value={settings.sortCode}
                  onChange={(e) => setSettings({ ...settings, sortCode: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label className="form-label">SWIFT / BIC Code (Optional for International Transfers)</label>
                <input
                  type="text"
                  className="form-control"
                  value={settings.swiftBic}
                  onChange={(e) => setSettings({ ...settings, swiftBic: e.target.value })}
                />
              </div>
            </div>

            <button type="submit" className="btn btn-primary btn-block btn-lg" disabled={saving} style={{ marginTop: '24px' }}>
              {saving ? 'Saving Platform Settings...' : 'Save Settings'}
            </button>
          </form>
        </div>
      </div>
    </DashboardLayout>
  );
}
