import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import DashboardLayout from '../../layouts/DashboardLayout';
import { adminGetEarnings } from '../../services/api';
import { toast } from '../../components/ui/Toast';

export default function AdminPayments() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchPayments(); }, []);

  const fetchPayments = async () => {
    try {
      setLoading(true);
      const { data } = await adminGetEarnings();
      setTransactions(data.transactions || []);
    } catch {
      toast.error('Failed to load payments.');
    } finally {
      setLoading(false);
    }
  };

  const totalIn = transactions
    .filter((t) => t.type === 'campaign_payment')
    .reduce((s, t) => s + (t.amount || 0), 0);

  const totalOut = transactions
    .filter((t) => t.type === 'influencer_payout')
    .reduce((s, t) => s + (t.amount || 0), 0);

  return (
    <DashboardLayout title="Payments" role="admin">
      <div className="page-header">
        <div>
          <h2 className="page-title">Payments & Payouts</h2>
          <p className="page-subtitle">Track vendor payments received and influencer payouts disbursed.</p>
        </div>
        <Link to="/admin/earnings" className="btn btn-outline">
          Earnings & Payouts
        </Link>
      </div>

      {/* Summary cards */}
      <div className="stats-grid" style={{ marginBottom: '28px' }}>
        <div className="stat-card">
          <div className="stat-info">
            <div className="stat-label">Total Vendor Payments</div>
            <div className="stat-value">₦{totalIn.toLocaleString()}</div>
            <div className="stat-sub">Received via bank transfer</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-info">
            <div className="stat-label">Total Influencer Payouts</div>
            <div className="stat-value">₦{totalOut.toLocaleString()}</div>
            <div className="stat-sub">Paid to influencers</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-info">
            <div className="stat-label">Net Platform Margin</div>
            <div className="stat-value" style={{ color: 'var(--primary)' }}>
              ₦{(totalIn - totalOut).toLocaleString()}
            </div>
            <div className="stat-sub">Revenue minus payouts</div>
          </div>
        </div>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '60px' }}>
          <div className="spinner" style={{ margin: '0 auto 16px' }} />
          <p style={{ color: '#64748b' }}>Loading transactions...</p>
        </div>
      ) : transactions.length === 0 ? (
        <div className="empty-state">
          
          <div className="empty-title">No transactions yet</div>
          <div className="empty-desc">Payment records will appear here.</div>
        </div>
      ) : (
        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th>Type</th>
                <th>User</th>
                <th>Amount</th>
                <th>Reference</th>
                <th>Date</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((t) => (
                <tr key={t._id}>
                  <td>
                    <span style={{
                      padding: '3px 10px', borderRadius: 'var(--radius-full)',
                      fontSize: '12px', fontWeight: '600',
                      color: t.type === 'campaign_payment' ? '#059669' : '#d97706',
                      background: t.type === 'campaign_payment' ? '#ecfdf5' : '#fffbeb',
                    }}>
                      {t.type === 'campaign_payment' ? 'Vendor Payment' : 'Influencer Payout'}
                    </span>
                  </td>
                  <td>{t.user?.name || '—'}</td>
                  <td style={{ fontWeight: '700' }}>₦{Number(t.amount || 0).toLocaleString()}</td>
                  <td style={{ fontSize: '13px', color: 'var(--text-muted)' }}>{t.reference || '—'}</td>
                  <td style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
                    {new Date(t.createdAt).toLocaleDateString('en-NG')}
                  </td>
                  <td>
                    <span style={{
                      padding: '3px 10px', borderRadius: 'var(--radius-full)',
                      fontSize: '12px', fontWeight: '600',
                      color: t.status === 'completed' ? '#059669' : '#d97706',
                      background: t.status === 'completed' ? '#ecfdf5' : '#fffbeb',
                    }}>
                      {t.status || 'completed'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </DashboardLayout>
  );
}
