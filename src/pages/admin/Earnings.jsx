import React, { useState, useEffect } from 'react';
import DashboardLayout from '../../layouts/DashboardLayout';
import { adminGetTransactions, adminMarkPaid } from '../../services/api';
import { toast } from '../../components/ui/Toast';

export default function AdminEarnings() {
  const [loading, setLoading] = useState(true);
  const [transactions, setTransactions] = useState([]);
  const [total, setTotal] = useState(0);
  const [statusFilter, setStatusFilter] = useState('approved');
  const [payModal, setPayModal] = useState({ open: false, transaction: null, reference: '', notes: '' });

  useEffect(() => {
    fetchTransactions();
  }, [statusFilter]);

  const fetchTransactions = async () => {
    try {
      setLoading(true);
      const params = statusFilter === 'all' ? {} : { status: statusFilter };
      const { data } = await adminGetTransactions(params);
      setTransactions(data.transactions || []);
      setTotal(data.total || 0);
    } catch (err) {
      toast.error('Failed to load transactions.');
    } finally {
      setLoading(false);
    }
  };

  const handlePaySubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await adminMarkPaid(payModal.transaction._id, {
        paymentReference: payModal.reference,
        notes: payModal.notes,
      });
      toast.success(data.message || 'Marked as paid!');
      setPayModal({ open: false, transaction: null, reference: '', notes: '' });
      fetchTransactions();
    } catch (err) {
      toast.error('Failed to update payout.');
    }
  };

  return (
    <DashboardLayout title="Influencer Payouts" role="admin">
      <div className="page-header">
        <div>
          <h2 className="page-title">Influencer Payout Ledger ({total})</h2>
          <p className="page-subtitle">Track approved gig rewards and mark bank transfers as paid.</p>
        </div>
      </div>

      {/* Filter Tabs */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '20px' }}>
        {['approved', 'paid', 'pending', 'all'].map((tab) => (
          <button
            key={tab}
            onClick={() => setStatusFilter(tab)}
            className={`btn btn-sm ${statusFilter === tab ? 'btn-primary' : 'btn-ghost'}`}
            style={{ borderRadius: '20px' }}
          >
            {tab === 'approved' ? ' Due for Payout' : tab === 'paid' ? '✓ Paid Out' : tab === 'pending' ? ' Pending Review' : 'All Transactions'}
          </button>
        ))}
      </div>

      <div className="card">
        <div className="card-body" style={{ padding: 0 }}>
          {loading ? (
            <div style={{ textAlign: 'center', padding: '60px' }}>
              <div className="spinner" style={{ margin: '0 auto 16px' }} />
              <p style={{ color: '#64748b' }}>Loading payouts ledger...</p>
            </div>
          ) : transactions.length === 0 ? (
            <div className="empty-state">
              
              <h3>No transactions found</h3>
            </div>
          ) : (
            <div className="table-wrapper" style={{ border: 'none', borderRadius: 0 }}>
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Influencer</th>
                    <th>Campaign & Gig</th>
                    <th>Amount</th>
                    <th>Status</th>
                    <th>Payment Ref</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {transactions.map((t) => (
                    <tr key={t._id}>
                      <td>
                        <strong>{t.influencerId?.name}</strong>
                        <div style={{ fontSize: '12px', color: '#64748b' }}>{t.influencerId?.email}</div>
                      </td>
                      <td>
                        <strong>{t.campaignId?.title || 'Gig Reward'}</strong>
                        <div style={{ fontSize: '11px', color: '#94a3b8' }}>#{t.gigId?.gigNumber}</div>
                      </td>
                      <td>
                        <strong style={{ color: '#059669', fontSize: '15px' }}>
                          ₦{Number(t.amount).toLocaleString()}
                        </strong>
                      </td>
                      <td>
                        {t.status === 'paid' && <span className="badge badge-info">✓ Paid</span>}
                        {t.status === 'approved' && <span className="badge badge-success">Approved (Due)</span>}
                        {t.status === 'pending' && <span className="badge badge-warning">Pending</span>}
                      </td>
                      <td>
                        {t.paymentReference ? (
                          <span style={{ fontSize: '12px', fontFamily: 'monospace' }}>{t.paymentReference}</span>
                        ) : (
                          <span style={{ color: '#94a3b8', fontSize: '12px' }}>—</span>
                        )}
                      </td>
                      <td>
                        {t.status === 'approved' && (
                          <button
                            className="btn btn-sm btn-primary"
                            onClick={() => setPayModal({ open: true, transaction: t, reference: `TRX-${Date.now().toString().slice(-6)}`, notes: '' })}
                          >
                            Mark Paid
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Mark Paid Modal */}
      {payModal.open && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h3>Confirm Payout: ₦{Number(payModal.transaction?.amount).toLocaleString()}</h3>
              <button className="btn-icon" onClick={() => setPayModal({ open: false, transaction: null, reference: '', notes: '' })}>✕</button>
            </div>
            <form onSubmit={handlePaySubmit}>
              <div className="modal-body">
                <p style={{ color: '#64748b', fontSize: '14px', marginBottom: '16px' }}>
                  Confirm that you have transferred ₦{Number(payModal.transaction?.amount).toLocaleString()} to {payModal.transaction?.influencerId?.name}.
                </p>

                <div className="form-group">
                  <label className="form-label">Bank Transfer Reference Number</label>
                  <input
                    type="text"
                    required
                    className="form-control"
                    value={payModal.reference}
                    onChange={(e) => setPayModal({ ...payModal, reference: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Notes (Optional)</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="e.g. Paid via Zenith Bank Mobile"
                    value={payModal.notes}
                    onChange={(e) => setPayModal({ ...payModal, notes: e.target.value })}
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-ghost" onClick={() => setPayModal({ open: false, transaction: null, reference: '', notes: '' })}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Confirm Paid & Send Notification
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
