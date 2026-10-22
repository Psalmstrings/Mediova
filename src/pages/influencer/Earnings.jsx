import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
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
  const [payoutSetup, setPayoutSetup] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [bankDetails, setBankDetails] = useState({ accountName: '', bankName: 'Zenith Bank', accountNumber: '' });
  const [isEditingBank, setIsEditingBank] = useState(false);
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
      setPayoutSetup(eRes.data.payoutSetup || null);
      setTransactions(eRes.data.transactions || []);

      const profileBank = pRes.data.profile?.bankDetails;
      if (profileBank && profileBank.accountNumber) {
        setBankDetails({
          accountName: profileBank.accountName || '',
          bankName: profileBank.bankName || 'Zenith Bank',
          accountNumber: profileBank.accountNumber || '',
        });
        setIsEditingBank(false);
      } else {
        setIsEditingBank(true);
      }
    } catch (err) {
      toast.error('Failed to load earnings information.');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveBank = async (e) => {
    e.preventDefault();

    const cleanNum = bankDetails.accountNumber.replace(/[^0-9]/g, '');
    if (cleanNum.length !== 10) {
      toast.error('Nigerian NUBAN account numbers must be exactly 10 digits.');
      return;
    }

    setSavingBank(true);
    try {
      const { data } = await updateBankDetails({
        accountName: bankDetails.accountName.trim(),
        bankName: bankDetails.bankName.trim(),
        accountNumber: cleanNum,
      });
      toast.success(data.message || 'Bank details saved securely!');
      setIsEditingBank(false);
      fetchEarnings();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save bank details.');
    } finally {
      setSavingBank(false);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'eligible_for_payout':
        return <span className="badge badge-success">✓ Eligible for Payout</span>;
      case 'verified':
        return <span className="badge badge-info">✓ Verified Account</span>;
      case 'processing':
        return <span className="badge badge-warning">⏳ Processing Transfer</span>;
      case 'on_hold':
        return <span className="badge badge-danger">On Hold</span>;
      default:
        return <span className="badge badge-warning">Setup Required</span>;
    }
  };

  return (
    <DashboardLayout title="Earnings & Payouts" role="influencer">
      <div className="page-header">
        <div>
          <h2 className="page-title">Earnings & Payout Setup</h2>
          <p className="page-subtitle">Manage your verified disbursement account and track confirmed advertising payments.</p>
        </div>
        <div>
          {payoutSetup && getStatusBadge(payoutSetup.status)}
        </div>
      </div>

      {/* 4 Cards: Total Earned, Pending, Paid, Available */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon green">💰</div>
          <div className="stat-info">
            <div className="stat-label">Total Earned</div>
            <div className="stat-value">₦{Number(summary.totalEarned).toLocaleString()}</div>
            <div className="stat-sub">Lifetime approved</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon amber">⏳</div>
          <div className="stat-info">
            <div className="stat-label">Pending Review</div>
            <div className="stat-value">₦{Number(summary.pendingEarnings).toLocaleString()}</div>
            <div className="stat-sub">Under broker proof review</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon blue">🏦</div>
          <div className="stat-info">
            <div className="stat-label">Paid Out</div>
            <div className="stat-value">₦{Number(summary.paidEarnings).toLocaleString()}</div>
            <div className="stat-sub">Disbursed to bank account</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon purple">✨</div>
          <div className="stat-info">
            <div className="stat-label">Available Balance</div>
            <div className="stat-value">₦{Number(summary.availableBalance).toLocaleString()}</div>
            <div className="stat-sub">Scheduled for transfer</div>
          </div>
        </div>
      </div>

      {/* Grid: Bank Account Details & Remuneration Policy */}
      <div className="grid-2" style={{ gap: '28px', alignItems: 'flex-start', marginBottom: '28px' }}>
        {/* Payout Bank Account Card */}
        <div className="card">
          <div className="card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ fontSize: '1.2rem', margin: 0 }}>🔒 Payout Bank Account</h3>
            {!isEditingBank && bankDetails.accountNumber && (
              <button
                type="button"
                className="btn btn-sm btn-ghost"
                onClick={() => setIsEditingBank(true)}
              >
                ✏️ Update Account
              </button>
            )}
          </div>
          <div className="card-body">
            {!isEditingBank && bankDetails.accountNumber ? (
              <div>
                <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '10px', padding: '20px', marginBottom: '16px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px', fontSize: '14px' }}>
                    <span style={{ color: '#64748b' }}>Account Name:</span>
                    <strong>{bankDetails.accountName}</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px', fontSize: '14px' }}>
                    <span style={{ color: '#64748b' }}>Bank Name:</span>
                    <strong>{bankDetails.bankName}</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px' }}>
                    <span style={{ color: '#64748b' }}>Account Number:</span>
                    <strong style={{ letterSpacing: '1px' }}>
                      •••• •••• {bankDetails.accountNumber.slice(-4)}
                    </strong>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#059669', fontSize: '13px' }}>
                  <span>🛡️</span>
                  <span>Disbursement account verified and encrypted. Payouts are transferred automatically.</span>
                </div>
              </div>
            ) : (
              <div>
                <p style={{ color: '#64748b', fontSize: '13px', lineHeight: '1.6', marginBottom: '16px' }}>
                  Enter your official Nigerian bank account details (Commercial Banks, OPay, Palmpay, Kuda, or Moniepoint). All approved earnings are sent here with 0% platform deductions.
                </p>

                <form onSubmit={handleSaveBank}>
                  <div className="form-group">
                    <label className="form-label" htmlFor="bank-select">
                      Bank / FinTech Institution <span className="required">*</span>
                    </label>
                    <select
                      id="bank-select"
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
                    <label className="form-label" htmlFor="bank-account-num">
                      10-Digit NUBAN Account Number <span className="required">*</span>
                    </label>
                    <input
                      id="bank-account-num"
                      type="text"
                      required
                      maxLength={10}
                      className="form-control"
                      placeholder="0123456789"
                      value={bankDetails.accountNumber}
                      onChange={(e) => setBankDetails({ ...bankDetails, accountNumber: e.target.value })}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label" htmlFor="bank-account-name">
                      Account Holder Name <span className="required">*</span>
                    </label>
                    <input
                      id="bank-account-name"
                      type="text"
                      required
                      className="form-control"
                      placeholder="Exact name on your bank account"
                      value={bankDetails.accountName}
                      onChange={(e) => setBankDetails({ ...bankDetails, accountName: e.target.value })}
                    />
                  </div>

                  <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
                    {bankDetails.accountNumber && (
                      <button
                        type="button"
                        className="btn btn-ghost"
                        onClick={() => setIsEditingBank(false)}
                      >
                        Cancel
                      </button>
                    )}
                    <button
                      type="submit"
                      className="btn btn-primary btn-block"
                      disabled={savingBank}
                    >
                      {savingBank ? 'Encrypting & Saving...' : 'Save Payout Details'}
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>
        </div>

        {/* Remuneration Process & Policy Card */}
        <div className="card">
          <div className="card-header">
            <h3 style={{ fontSize: '1.2rem', margin: 0 }}>📋 Remuneration Guidelines</h3>
          </div>
          <div className="card-body" style={{ fontSize: '13px', lineHeight: '1.7', color: '#334155' }}>
            <div style={{ marginBottom: '14px' }}>
              <strong>1. Qualifying Activities:</strong>
              <p style={{ margin: '4px 0 0', color: '#64748b' }}>
                Posting assigned vendor advertising flyers/videos to your WhatsApp Status for a continuous minimum of 24 hours.
              </p>
            </div>

            <div style={{ marginBottom: '14px' }}>
              <strong>2. Verification & Broker Approval:</strong>
              <p style={{ margin: '4px 0 0', color: '#64748b' }}>
                Upload clear screenshots showing verified view counts prior to the 24-hour mark. Our brokerage review team verifies and approves proofs daily.
              </p>
            </div>

            <div style={{ marginBottom: '14px' }}>
              <strong>3. Zero Deductions (100% Payout):</strong>
              <p style={{ margin: '4px 0 0', color: '#64748b' }}>
                MEDIOVA deducts 0% fees from creators. The full agreed reward displayed on your gig assignment is transferred to your account.
              </p>
            </div>

            <div style={{ marginBottom: '14px' }}>
              <strong>4. Processing SLA:</strong>
              <p style={{ margin: '4px 0 0', color: '#64748b' }}>
                Bank transfers are dispatched within 24 to 48 business hours following gig proof approval.
              </p>
            </div>

            <div style={{ borderTop: '1px solid #e2e8f0', paddingTop: '12px' }}>
              <span style={{ color: '#64748b' }}>Have questions about a delayed or disputed payment?</span>
              <div style={{ marginTop: '8px' }}>
                <Link to="/contact" style={{ color: '#059669', fontWeight: '700', marginRight: '16px' }}>
                  Contact Broker Support →
                </Link>
                <Link to="/complaints-policy" style={{ color: '#2563eb', fontWeight: '600' }}>
                  View Complaints & Appeals Policy
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Transactions / Earnings History Table */}
      <div className="card">
        <div className="card-header">
          <h3 style={{ fontSize: '1.2rem', margin: 0 }}>Transaction & Payout History</h3>
        </div>
        <div className="card-body" style={{ padding: 0 }}>
          {transactions.length === 0 ? (
            <div className="empty-state" style={{ padding: '40px 20px' }}>
              <div style={{ fontSize: '48px', marginBottom: '12px' }}>📊</div>
              <h3>No Transactions Logged Yet</h3>
              <p>Accept an advertising gig from your dashboard, submit status proof, and your rewards will appear here.</p>
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
                    <th>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {transactions.map((t) => (
                    <tr key={t._id}>
                      <td>
                        <strong>{t.campaignId?.title || 'Advertising Gig'}</strong>
                      </td>
                      <td>
                        <span className="badge badge-muted">#{t.gigId?.gigNumber || 'GIG'}</span>
                      </td>
                      <td>
                        <strong style={{ color: '#059669', fontSize: '15px' }}>
                          ₦{Number(t.amount).toLocaleString()}
                        </strong>
                      </td>
                      <td>
                        {t.status === 'paid' && <span className="badge badge-info">✓ Paid Out</span>}
                        {t.status === 'approved' && <span className="badge badge-success">Approved (Eligible)</span>}
                        {t.status === 'pending' && <span className="badge badge-warning">Pending Review</span>}
                      </td>
                      <td style={{ color: '#64748b', fontSize: '13px' }}>
                        {new Date(t.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
