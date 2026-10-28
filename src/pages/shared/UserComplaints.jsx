import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import DashboardLayout from '../../layouts/DashboardLayout';
import { submitComplaint, getMyComplaints } from '../../services/api';
import { toast } from '../../components/ui/Toast';

export default function UserComplaints({ role = 'vendor' }) {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    category: 'Advertising Request Failure',
    referenceNumber: '',
    subject: '',
    description: '',
    preferredContact: 'email',
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchComplaints();
  }, []);

  const fetchComplaints = async () => {
    try {
      setLoading(true);
      const { data } = await getMyComplaints();
      setComplaints(data.complaints || []);
    } catch {
      toast.error('Failed to load your complaints list.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.subject.trim() || !formData.description.trim()) {
      toast.warning('Please enter both a subject and detailed description.');
      return;
    }

    setSubmitting(true);
    try {
      const { data } = await submitComplaint(formData);
      toast.success(data.message || 'Complaint submitted successfully.');
      setShowModal(false);
      setFormData({
        category: role === 'vendor' ? 'Campaign Delivery / Reach Dispute' : 'Delayed / Failed Payout',
        referenceNumber: '',
        subject: '',
        description: '',
        preferredContact: 'email',
      });
      fetchComplaints();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to submit complaint.');
    } finally {
      setSubmitting(false);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Resolved':
        return <span className="badge badge-success">✓ Resolved</span>;
      case 'Under Review':
        return <span className="badge badge-info">⏳ Under Review</span>;
      case 'Awaiting Information':
        return <span className="badge badge-warning">Awaiting Information</span>;
      case 'Closed':
        return <span className="badge badge-muted">Closed</span>;
      default:
        return <span className="badge badge-warning">Open</span>;
    }
  };

  return (
    <DashboardLayout title="Disputes & Appeals" role={role}>
      <div className="page-header">
        <div>
          <h2 className="page-title">Disputes, Grievances & Appeals</h2>
          <p className="page-subtitle">
            Formal mediation desk governed by the{' '}
            <Link to="/complaints-policy" target="_blank" style={{ color: '#059669', textDecoration: 'underline' }}>
              MEDIOVA Complaints & Appeals Policy
            </Link>
            .
          </p>
        </div>
        <button
          type="button"
          className="btn btn-primary"
          onClick={() => setShowModal(true)}
        >
          + Lodge New Complaint / Appeal
        </button>
      </div>

      <div className="card">
        <div className="card-header">
          <h3 style={{ fontSize: '1.2rem', margin: 0 }}>My Submitted Grievances</h3>
        </div>
        <div className="card-body" style={{ padding: 0 }}>
          {loading ? (
            <div style={{ textAlign: 'center', padding: '40px' }}>
              <div className="spinner" style={{ margin: '0 auto 12px' }} />
              <p style={{ color: '#64748b' }}>Loading records...</p>
            </div>
          ) : complaints.length === 0 ? (
            <div className="empty-state" style={{ padding: '40px 20px' }}>
              <div style={{ fontSize: '48px', marginBottom: '12px' }}>⚖️</div>
              <h3>No Complaints Logged</h3>
              <p>You have not submitted any formal disputes. If you experience an operational issue, you can lodge a ticket anytime.</p>
            </div>
          ) : (
            <div className="table-wrapper" style={{ border: 'none', borderRadius: 0 }}>
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Ref #</th>
                    <th>Category</th>
                    <th>Subject</th>
                    <th>Status</th>
                    <th>Resolution Summary</th>
                    <th>Submitted</th>
                  </tr>
                </thead>
                <tbody>
                  {complaints.map((c) => (
                    <tr key={c._id}>
                      <td>
                        <span className="badge badge-muted" style={{ fontWeight: '700' }}>
                          #{c.complaintNumber}
                        </span>
                        {c.referenceNumber && (
                          <div style={{ fontSize: '11px', color: '#64748b', marginTop: '2px' }}>
                            Ref: {c.referenceNumber}
                          </div>
                        )}
                      </td>
                      <td>
                        <strong>{c.category}</strong>
                      </td>
                      <td>
                        <div>{c.subject}</div>
                        <div style={{ fontSize: '12px', color: '#64748b', maxWidth: '300px' }}>
                          {c.description.slice(0, 80)}...
                        </div>
                      </td>
                      <td>{getStatusBadge(c.status)}</td>
                      <td>
                        {c.resolutionSummary ? (
                          <div style={{ color: '#059669', fontSize: '13px' }}>
                            {c.resolutionSummary}
                          </div>
                        ) : (
                          <span style={{ color: '#94a3b8', fontSize: '12px' }}>Investigation in progress</span>
                        )}
                      </td>
                      <td style={{ color: '#64748b', fontSize: '13px' }}>
                        {new Date(c.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Lodge Complaint Modal */}
      {showModal && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: '16px',
          }}
        >
          <div className="card" style={{ maxWidth: '560px', width: '100%', padding: 'clamp(16px, 4vw, 28px)', maxHeight: '90vh', overflowY: 'auto' }}>
            <h3 style={{ marginBottom: '8px' }}>Lodge a Complaint or Appeal</h3>
            <p style={{ color: '#64748b', fontSize: '13px', lineHeight: '1.6', marginBottom: '20px' }}>
              Your grievance will be acknowledged with a tracking ID and investigated objectively within 3-5 business days.
            </p>

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label">Grievance Category <span className="required">*</span></label>
                <select
                  className="form-control"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                >
                  <option value="Advertising Request Failure">Advertising Request Failure</option>
                  <option value="Campaign Delivery / Reach Dispute">Campaign Delivery / Reach Dispute</option>
                  <option value="Influencer Gig Completion">Influencer Gig Completion & Proof Dispute</option>
                  <option value="Delayed / Failed Payout">Delayed or Failed Payout</option>
                  <option value="Refund Dispute">Refund Dispute / Escalation</option>
                  <option value="Account Verification / Access">Account Verification / Restriction Appeal</option>
                  <option value="Misconduct / Campaign Misuse">Misconduct / Campaign Misuse</option>
                  <option value="Privacy Concern">Privacy & Data Handling Concern</option>
                  <option value="Other">Other Operational Issue</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Reference ID (Order #, Gig #, or Transaction #)</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="e.g. AD-1234 or GIG-5678"
                  value={formData.referenceNumber}
                  onChange={(e) => setFormData({ ...formData, referenceNumber: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Subject <span className="required">*</span></label>
                <input
                  type="text"
                  required
                  className="form-control"
                  placeholder="Summary of the issue"
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Detailed Description & Facts <span className="required">*</span></label>
                <textarea
                  required
                  rows={4}
                  className="form-control"
                  placeholder="Explain what happened, dates, amounts, and desired resolution..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Preferred Contact Channel</label>
                <select
                  className="form-control"
                  value={formData.preferredContact}
                  onChange={(e) => setFormData({ ...formData, preferredContact: e.target.value })}
                >
                  <option value="email">Email</option>
                  <option value="whatsapp">WhatsApp</option>
                  <option value="phone">Direct Phone Call</option>
                </select>
              </div>

              <div style={{ display: 'flex', gap: '12px', marginTop: '24px', flexWrap: 'wrap' }}>
                <button
                  type="button"
                  className="btn btn-ghost"
                  onClick={() => setShowModal(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={submitting}
                  style={{ flex: '1 1 180px' }}
                >
                  {submitting ? 'Submitting Grievance...' : 'Submit Formal Complaint →'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
