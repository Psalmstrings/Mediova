import React, { useState, useEffect } from 'react';
import DashboardLayout from '../../layouts/DashboardLayout';
import { adminGetRefunds, adminUpdateRefund } from '../../services/api';
import { toast } from '../../components/ui/Toast';

export default function AdminRefunds() {
  const [refunds, setRefunds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedRefund, setSelectedRefund] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Modal form
  const [actionStatus, setActionStatus] = useState('approved');
  const [transferRef, setTransferRef] = useState('');
  const [adminNotes, setAdminNotes] = useState('');
  const [rejectionReason, setRejectionReason] = useState('');

  useEffect(() => {
    fetchRefunds();
  }, [filterStatus]);

  const fetchRefunds = async () => {
    try {
      setLoading(true);
      const params = filterStatus !== 'all' ? { status: filterStatus } : {};
      const { data } = await adminGetRefunds(params);
      setRefunds(data.refundRequests || []);
    } catch {
      toast.error('Failed to load refund requests.');
    } finally {
      setLoading(false);
    }
  };

  const openActionModal = (refund) => {
    setSelectedRefund(refund);
    setActionStatus(refund.status === 'pending' ? 'approved' : refund.status);
    setTransferRef(refund.transferReference || '');
    setAdminNotes(refund.adminNotes || '');
    setRejectionReason(refund.rejectionReason || '');
    setModalOpen(true);
  };

  const handleUpdateRefund = async (e) => {
    e.preventDefault();
    if (actionStatus === 'refunded' && !transferRef.trim()) {
      toast.error('Bank Transfer Reference is required when marking as Refunded.');
      return;
    }
    if (actionStatus === 'rejected' && !rejectionReason.trim()) {
      toast.error('Please specify a rejection reason for the advertiser.');
      return;
    }

    try {
      setSubmitting(true);
      await adminUpdateRefund(selectedRefund._id, {
        status: actionStatus,
        transferReference: transferRef.trim(),
        adminNotes: adminNotes.trim(),
        rejectionReason: rejectionReason.trim(),
      });
      toast.success('Refund request updated successfully.');
      setModalOpen(false);
      fetchRefunds();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update refund request.');
    } finally {
      setSubmitting(false);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'refunded':
        return <span className="badge badge-success">Refunded</span>;
      case 'approved':
        return <span className="badge badge-info">Approved (Awaiting Payout)</span>;
      case 'under_review':
        return <span className="badge badge-warning">Under Review</span>;
      case 'rejected':
        return <span className="badge badge-danger">Rejected</span>;
      default:
        return <span className="badge badge-muted">Pending</span>;
    }
  };

  return (
    <DashboardLayout title="Refund Management" role="admin">
      <div className="page-header" style={{ marginBottom: '24px' }}>
        <div>
          <h2 className="page-title">Refund Requests & Disbursals</h2>
          <p className="page-subtitle">
            Audit finding 12 — Review advertiser refund submissions, verify campaign delivery logs, and record bank disbursement references.
          </p>
        </div>
        <div>
          <select
            className="form-control"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            style={{ width: '180px' }}
          >
            <option value="all">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="under_review">Under Review</option>
            <option value="approved">Approved</option>
            <option value="refunded">Refunded</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '60px' }}>
          <div className="spinner" style={{ margin: '0 auto 16px' }} />
          <p style={{ color: '#64748b' }}>Loading refund requests...</p>
        </div>
      ) : refunds.length === 0 ? (
        <div className="card" style={{ padding: '48px', textAlign: 'center' }}>
          <p style={{ color: '#64748b', margin: 0 }}>No refund requests found matching the current filter.</p>
        </div>
      ) : (
        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Advertiser</th>
                <th>Campaign</th>
                <th>Amount</th>
                <th>Reason</th>
                <th>Status</th>
                <th>Transfer Ref</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {refunds.map((r) => (
                <tr key={r._id}>
                  <td style={{ fontSize: '13px', whiteSpace: 'nowrap' }}>
                    {new Date(r.createdAt).toLocaleDateString('en-GB')}
                  </td>
                  <td>
                    <div style={{ fontWeight: 600 }}>{r.vendorId?.name || 'Advertiser'}</div>
                    <div style={{ fontSize: '12px', color: '#64748b' }}>{r.vendorId?.email}</div>
                  </td>
                  <td>
                    <div style={{ fontWeight: 600 }}>{r.campaignId?.title || 'Campaign'}</div>
                    <div style={{ fontSize: '12px', color: '#64748b' }}>Order #{r.campaignId?.orderNumber}</div>
                  </td>
                  <td style={{ fontWeight: 700, color: '#0f172a' }}>
                    ₦{Number(r.amountRequested).toLocaleString()}
                  </td>
                  <td style={{ fontSize: '13px', maxWidth: '200px' }}>
                    <div style={{ fontWeight: 600, textTransform: 'capitalize' }}>
                      {r.reasonCategory?.replace(/_/g, ' ')}
                    </div>
                    <div style={{ color: '#64748b', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }} title={r.details}>
                      {r.details}
                    </div>
                  </td>
                  <td>{getStatusBadge(r.status)}</td>
                  <td style={{ fontSize: '12px', fontFamily: 'monospace' }}>
                    {r.transferReference || '—'}
                  </td>
                  <td>
                    <button
                      className="btn btn-sm btn-outline"
                      onClick={() => openActionModal(r)}
                    >
                      Process
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Process Modal */}
      {modalOpen && selectedRefund && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(15, 23, 42, 0.6)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999,
            padding: '16px',
          }}
          onClick={() => setModalOpen(false)}
        >
          <div
            className="card"
            style={{ maxWidth: '580px', width: '100%', maxHeight: '90vh', overflowY: 'auto' }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ margin: 0, fontSize: '1.2rem' }}>Process Refund Request</h3>
              <button
                className="btn btn-ghost btn-sm"
                onClick={() => setModalOpen(false)}
                style={{ fontSize: '18px' }}
              >
                &times;
              </button>
            </div>

            <div style={{ padding: '20px' }}>
              {/* Refund Info Summary */}
              <div style={{ background: '#f8fafc', padding: '16px', borderRadius: '8px', marginBottom: '20px', fontSize: '13px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                  <div><strong>Advertiser:</strong> {selectedRefund.vendorId?.name}</div>
                  <div><strong>Amount:</strong> ₦{Number(selectedRefund.amountRequested).toLocaleString()}</div>
                  <div><strong>Campaign:</strong> {selectedRefund.campaignId?.title}</div>
                  <div><strong>Status:</strong> {selectedRefund.status}</div>
                </div>
                <div style={{ marginTop: '12px', borderTop: '1px solid #e2e8f0', paddingTop: '10px' }}>
                  <strong>Refund Account Details:</strong>
                  <div>Bank: {selectedRefund.bankAccount?.bankName}</div>
                  <div>Account No: {selectedRefund.bankAccount?.accountNumber}</div>
                  <div>Account Name: {selectedRefund.bankAccount?.accountName}</div>
                </div>
                <div style={{ marginTop: '12px', borderTop: '1px solid #e2e8f0', paddingTop: '10px' }}>
                  <strong>Reason & Explanation:</strong>
                  <div style={{ color: '#475569', marginTop: '4px' }}>{selectedRefund.details}</div>
                </div>
              </div>

              <form onSubmit={handleUpdateRefund} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div className="form-group">
                  <label className="form-label">Update Status</label>
                  <select
                    className="form-control"
                    value={actionStatus}
                    onChange={(e) => setActionStatus(e.target.value)}
                  >
                    <option value="pending">Pending</option>
                    <option value="under_review">Under Review</option>
                    <option value="approved">Approved</option>
                    <option value="refunded">Refunded (Disbursement Completed)</option>
                    <option value="rejected">Rejected</option>
                  </select>
                </div>

                {actionStatus === 'refunded' && (
                  <div className="form-group">
                    <label className="form-label" style={{ color: '#059669', fontWeight: 600 }}>
                      Bank Transfer Reference *
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="e.g. NIP/REF2026102212345/GTB"
                      value={transferRef}
                      onChange={(e) => setTransferRef(e.target.value)}
                      required
                    />
                    <small style={{ color: '#64748b' }}>
                      Required for financial reconciliation when disbursing funds back to the advertiser.
                    </small>
                  </div>
                )}

                {actionStatus === 'rejected' && (
                  <div className="form-group">
                    <label className="form-label" style={{ color: '#dc2626', fontWeight: 600 }}>
                      Rejection Reason *
                    </label>
                    <textarea
                      className="form-control"
                      rows="3"
                      placeholder="Explain why this request is ineligible according to the MEDIOVA Refund Policy..."
                      value={rejectionReason}
                      onChange={(e) => setRejectionReason(e.target.value)}
                      required
                    />
                  </div>
                )}

                <div className="form-group">
                  <label className="form-label">Internal Administrator Notes</label>
                  <textarea
                    className="form-control"
                    rows="2"
                    placeholder="Optional notes for internal platform compliance records..."
                    value={adminNotes}
                    onChange={(e) => setAdminNotes(e.target.value)}
                  />
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '12px' }}>
                  <button
                    type="button"
                    className="btn btn-outline"
                    onClick={() => setModalOpen(false)}
                    disabled={submitting}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={submitting}
                  >
                    {submitting ? 'Updating...' : 'Save & Update Status'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
