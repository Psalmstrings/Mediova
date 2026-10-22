import React, { useState, useEffect } from 'react';
import DashboardLayout from '../../layouts/DashboardLayout';
import { adminGetComplaints, adminUpdateComplaint } from '../../services/api';
import { toast } from '../../components/ui/Toast';

export default function AdminComplaints() {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Modal form state
  const [newStatus, setNewStatus] = useState('under_investigation');
  const [investigationNotes, setInvestigationNotes] = useState('');
  const [resolutionSummary, setResolutionSummary] = useState('');

  useEffect(() => {
    fetchComplaints();
  }, [filterStatus]);

  const fetchComplaints = async () => {
    try {
      setLoading(true);
      const params = filterStatus !== 'all' ? { status: filterStatus } : {};
      const { data } = await adminGetComplaints(params);
      setComplaints(data.complaints || []);
    } catch {
      toast.error('Failed to load complaints.');
    } finally {
      setLoading(false);
    }
  };

  const openReviewModal = (complaint) => {
    setSelectedComplaint(complaint);
    setNewStatus(complaint.status === 'submitted' ? 'under_investigation' : complaint.status);
    setInvestigationNotes(complaint.internalInvestigationNotes || '');
    setResolutionSummary(complaint.resolutionSummary || '');
    setModalOpen(true);
  };

  const handleUpdateComplaint = async (e) => {
    e.preventDefault();
    if ((newStatus === 'resolved' || newStatus === 'dismissed') && !resolutionSummary.trim()) {
      toast.error('Please provide a formal Resolution Summary for the complainant.');
      return;
    }

    try {
      setSubmitting(true);
      await adminUpdateComplaint(selectedComplaint._id, {
        status: newStatus,
        internalInvestigationNotes: investigationNotes.trim(),
        resolutionSummary: resolutionSummary.trim(),
      });
      toast.success('Complaint status updated successfully.');
      setModalOpen(false);
      fetchComplaints();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update complaint.');
    } finally {
      setSubmitting(false);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'resolved':
        return <span className="badge badge-success">Resolved</span>;
      case 'under_investigation':
        return <span className="badge badge-warning">Under Investigation</span>;
      case 'appealed':
        return <span className="badge badge-info">Appealed</span>;
      case 'dismissed':
        return <span className="badge badge-danger">Dismissed</span>;
      default:
        return <span className="badge badge-muted">Submitted</span>;
    }
  };

  return (
    <DashboardLayout title="Complaints & Appeals" role="admin">
      <div className="page-header" style={{ marginBottom: '24px' }}>
        <div>
          <h2 className="page-title">Complaints, Grievances & Appeals</h2>
          <p className="page-subtitle">
            Audit finding 9 — Review platform disputes, influencer performance grievances, and remuneration appeals with transparent tracking.
          </p>
        </div>
        <div>
          <select
            className="form-control"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            style={{ width: '200px' }}
          >
            <option value="all">All Statuses</option>
            <option value="submitted">Submitted</option>
            <option value="under_investigation">Under Investigation</option>
            <option value="resolved">Resolved</option>
            <option value="appealed">Appealed</option>
            <option value="dismissed">Dismissed</option>
          </select>
        </div>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '60px' }}>
          <div className="spinner" style={{ margin: '0 auto 16px' }} />
          <p style={{ color: '#64748b' }}>Loading complaints registry...</p>
        </div>
      ) : complaints.length === 0 ? (
        <div className="card" style={{ padding: '48px', textAlign: 'center' }}>
          <p style={{ color: '#64748b', margin: 0 }}>No complaints or appeals found matching the selected filter.</p>
        </div>
      ) : (
        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th>Ticket ID</th>
                <th>Date</th>
                <th>Complainant</th>
                <th>Role</th>
                <th>Category</th>
                <th>Subject</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {complaints.map((c) => (
                <tr key={c._id}>
                  <td style={{ fontWeight: 600, fontFamily: 'monospace', fontSize: '13px' }}>
                    {c.complaintNumber || c._id.slice(-6).toUpperCase()}
                  </td>
                  <td style={{ fontSize: '13px', whiteSpace: 'nowrap' }}>
                    {new Date(c.createdAt).toLocaleDateString('en-GB')}
                  </td>
                  <td>
                    <div style={{ fontWeight: 600 }}>{c.complainantId?.name || 'User'}</div>
                    <div style={{ fontSize: '12px', color: '#64748b' }}>{c.complainantId?.email}</div>
                  </td>
                  <td>
                    <span className={`badge ${c.complainantRole === 'influencer' ? 'badge-info' : 'badge-primary'}`}>
                      {c.complainantRole}
                    </span>
                  </td>
                  <td style={{ textTransform: 'capitalize', fontSize: '13px' }}>
                    {c.category?.replace(/_/g, ' ')}
                  </td>
                  <td style={{ maxWidth: '220px', fontSize: '13px' }}>
                    <div style={{ fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {c.subject}
                    </div>
                  </td>
                  <td>{getStatusBadge(c.status)}</td>
                  <td>
                    <button
                      className="btn btn-sm btn-outline"
                      onClick={() => openReviewModal(c)}
                    >
                      Investigate
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Investigation Modal */}
      {modalOpen && selectedComplaint && (
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
            style={{ maxWidth: '640px', width: '100%', maxHeight: '90vh', overflowY: 'auto' }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ margin: 0, fontSize: '1.2rem' }}>
                Complaint #{selectedComplaint.complaintNumber || selectedComplaint._id.slice(-6).toUpperCase()}
              </h3>
              <button
                className="btn btn-ghost btn-sm"
                onClick={() => setModalOpen(false)}
                style={{ fontSize: '18px' }}
              >
                &times;
              </button>
            </div>

            <div style={{ padding: '20px' }}>
              <div style={{ background: '#f8fafc', padding: '16px', borderRadius: '8px', marginBottom: '20px', fontSize: '13px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '12px' }}>
                  <div><strong>Complainant:</strong> {selectedComplaint.complainantId?.name} ({selectedComplaint.complainantRole})</div>
                  <div><strong>Category:</strong> {selectedComplaint.category?.replace(/_/g, ' ')}</div>
                  <div><strong>Date Filed:</strong> {new Date(selectedComplaint.createdAt).toLocaleString()}</div>
                  <div><strong>Current Status:</strong> {selectedComplaint.status}</div>
                </div>
                <div style={{ borderTop: '1px solid #e2e8f0', paddingTop: '10px' }}>
                  <strong>Subject:</strong> {selectedComplaint.subject}
                </div>
                <div style={{ marginTop: '8px' }}>
                  <strong>Detailed Statement:</strong>
                  <p style={{ margin: '4px 0 0', color: '#334155', whiteSpace: 'pre-wrap', background: '#fff', padding: '10px', borderRadius: '4px', border: '1px solid #e2e8f0' }}>
                    {selectedComplaint.description}
                  </p>
                </div>
                {selectedComplaint.desiredOutcome && (
                  <div style={{ marginTop: '8px' }}>
                    <strong>Desired Outcome:</strong>
                    <div style={{ color: '#475569', marginTop: '2px' }}>{selectedComplaint.desiredOutcome}</div>
                  </div>
                )}
              </div>

              <form onSubmit={handleUpdateComplaint} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div className="form-group">
                  <label className="form-label">Review Status</label>
                  <select
                    className="form-control"
                    value={newStatus}
                    onChange={(e) => setNewStatus(e.target.value)}
                  >
                    <option value="submitted">Submitted</option>
                    <option value="under_investigation">Under Investigation</option>
                    <option value="resolved">Resolved</option>
                    <option value="dismissed">Dismissed</option>
                    <option value="appealed">Appealed (Escalated)</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Internal Investigation Notes (Admin only)</label>
                  <textarea
                    className="form-control"
                    rows="2"
                    placeholder="Log review findings, proof verification notes, or mediation steps..."
                    value={investigationNotes}
                    onChange={(e) => setInvestigationNotes(e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label" style={{ fontWeight: 600 }}>
                    Official Resolution Summary (Visible to Complainant)
                  </label>
                  <textarea
                    className="form-control"
                    rows="3"
                    placeholder="State the findings, decision, and remedy provided according to MEDIOVA Complaints Policy..."
                    value={resolutionSummary}
                    onChange={(e) => setResolutionSummary(e.target.value)}
                  />
                  <small style={{ color: '#64748b' }}>
                    This text is displayed on the user's dashboard when checking their complaint resolution.
                  </small>
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
                    {submitting ? 'Saving...' : 'Record Determination'}
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
