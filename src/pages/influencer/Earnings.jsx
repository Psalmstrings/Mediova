import React, { useState, useEffect } from 'react';
import DashboardLayout from '../../layouts/DashboardLayout';
import { getMyEarnings, getInfluencerProfile, updateBankDetails } from '../../services/api';
import { toast } from '../../components/ui/Toast';

const nigerianBanks = [
  'Access Bank', 'Citibank', 'Ecobank Nigeria', 'Fidelity Bank', 'First Bank of Nigeria',
  'First City Monument Bank (FCMB)', 'Guaranty Trust Bank (GTBank)', 'Heritage Bank',
  'Keystone Bank', 'Kuda Bank', 'Moniepoint MFB', 'OPay', 'Palmpay', 'Polaris Bank',
  'Providus Bank', 'Stanbic IBTC Bank', 'Standard Chartered Bank', 'Sterling Bank',
  'SunTrust Bank', 'Union Bank of Nigeria', 'United Bank for Africa (UBA)',
  'Unity Bank', 'Wema Bank', 'Zenith Bank',
];

export default function InfluencerEarnings() {
  const [loading, setLoading] = useState(true);
  const [summary, setSummary] = useState({ totalEarned: 0, pendingEarnings: 0, paidEarnings: 0, availableBalance: 0 });
  const [transactions, setTransactions] = useState([]);
  const [bankDetails, setBankDetails] = useState({ accountName: '', bankName: 'Zenith Bank', accountNumber: '' });
  const [savingBank, setSavingBank] = useState(false);

  useEffect(() => {
    fetchEarnings();
  }, []);

  const fetchEarnings = async () => {
    try {
      setLoading(true);
      const [eRes, pRes] = await Promise.all([
        getMyEarnings(),
        getInfluencerProfile(),
      ]);
      setSummary(eRes.data.summary || {});
      setTransactions(eRes.data.transactions || []);
      if (pRes.data.profile?.bankDetails) {
        setBankDetails({
          accountName: pRes.data.profile.bankDetails.accountName || '',
          bankName: pRes.data.profile.bankDetails.bankName || 'Zenith Bank',
          accountNumber: pRes.data.profile.bankDetails.accountNumber || '',
        });
      }
    } catch (err) {
      toast.error('Failed to load earnings information.');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveBank = async (e) => {
    e.preventDefault();
    setSavingBank(true);
    try {
      const { data } = await updateBankDetails(bankDetails);
      toast.success(data.message || 'Bank details saved securely!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save bank details.');
    } finally {
      setSavingBank(false);
    }
  };

  return (
    <DashboardLayout title="Earnings & Payouts" role="influencer">
      <div className="page-header">
        <div>
          <h2 className="page-title">Earnings & Bank Details</h2>
          <p className="page-subtitle">Track payments, approved balances, and manage your disbursement bank account.</p>
        </div>
      </div>

      {/* 4 Cards: Total Earned, Pending, Paid, Available for Withdrawal */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon green"></div>
          <div className="stat-info">
            <div className="stat-label">Total Earned</div>
            <div className="stat-value">₦{Number(summary.totalEarned).toLocaleString()}</div>
            <div className="stat-sub">Lifetime approved</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon amber"></div>
          <div className="stat-info">
            <div className="stat-label">Pending Review</div>
            <div className="stat-value">₦{Number(summary.pendingEarnings).toLocaleString()}</div>
            <div className="stat-sub">Awaiting admin review</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon blue"></div>
          <div className="stat-info">
            <div className="stat-label">Paid Out</div>
            <div className="stat-value">₦{Number(summary.paidEarnings).toLocaleString()}</div>
            <div className="stat-sub">Transferred to bank</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon purple"></div>
          <div className="stat-info">
            <div className="stat-label">Available Balance</div>
            <div className="stat-value">₦{Number(summary.availableBalance).toLocaleString()}</div>
            <div className="stat-sub">Ready for transfer</div>
          </div>
        </div>
      </div>

      <div className="grid-2" style={{ gap: '28px', alignItems: 'flex-start' }}>
        {/* Bank Account Form */}
        <div className="card">
          <div className="card-header">
            <h3 style={{ fontSize: '1.2rem' }}> Payout Bank Account</h3>
          </div>
          <div className="card-body">
            <p style={{ color: '#64748b', fontSize: '13px', lineHeight: '1.6', marginBottom: '20px' }}>
              Your bank details are encrypted and kept strictly confidential. They are only viewed by authorized Admin officers to transfer approved gig rewards.
            </p>

            <form onSubmit={handleSaveBank}>
              <div className="form-group">
                <label className="form-label">Bank Name <span className="required">*</span></label>
                <select
                  required
                  className="form-control"
                  value={bankDetails.bankName}
                  onChange={(e) => setBankDetails({ ...bankDetails, bankName: e.target.value })}
                >
                  {nigerianBanks.map((b) => (
                    <option key={b} value={b}>{b}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Account Number <span className="required">*</span></label>
                <input
                  type="text"
                  required
                  maxLength={10}
                  className="form-control"
                  placeholder="10-digit NUBAN"
                  value={bankDetails.accountNumber}
                  onChange={(e) => setBankDetails({ ...bankDetails, accountNumber: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Account Holder Name <span className="required">*</span></label>
                <input
                  type="text"
                  required
                  className="form-control"
                  placeholder="As displayed on your bank app"
                  value={bankDetails.accountName}
                  onChange={(e) => setBankDetails({ ...bankDetails, accountName: e.target.value })}
                />
              </div>

              <button type="submit" className="btn btn-primary btn-block" disabled={savingBank} style={{ marginTop: '16px' }}>
                {savingBank ? 'Saving Account...' : 'Save Bank Details'}
              </button>
            </form>
          </div>
        </div>

        {/* Transactions / Earnings History */}
        <div className="card">
          <div className="card-header">
            <h3 style={{ fontSize: '1.2rem' }}> Earnings History</h3>
          </div>
          <div className="card-body" style={{ padding: 0 }}>
            {transactions.length === 0 ? (
              <div className="empty-state" style={{ padding: '40px 20px' }}>
                
                <h3>No transactions yet</h3>
                <p>Complete your first advertising gig and submit proof to see your earnings listed here.</p>
              </div>
            ) : (
              <div className="table-wrapper" style={{ border: 'none', borderRadius: 0 }}>
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Campaign</th>
                      <th>Gig Ref</th>
                      <th>Amount</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {transactions.map((t) => (
                      <tr key={t._id}>
                        <td>
                          <strong>{t.campaignId?.title || 'Advertising Reward'}</strong>
                          <div style={{ fontSize: '11px', color: '#94a3b8' }}>
                            {new Date(t.createdAt).toLocaleDateString()}
                          </div>
                        </td>
                        <td>
                          <span className="badge badge-muted">#{t.gigId?.gigNumber || 'GIG'}</span>
                        </td>
                        <td>
                          <strong style={{ color: '#059669' }}>₦{Number(t.amount).toLocaleString()}</strong>
                        </td>
                        <td>
                          {t.status === 'paid' && <span className="badge badge-info">✓ Paid Out</span>}
                          {t.status === 'approved' && <span className="badge badge-success">Approved</span>}
                          {t.status === 'pending' && <span className="badge badge-warning">Pending</span>}
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
    </DashboardLayout>
  );
}
