import React, { useState, useEffect } from 'react';
import DashboardLayout from '../../layouts/DashboardLayout';
import { adminGetSupportTickets, adminUpdateSupportTicket } from '../../services/api';
import { toast } from '../../components/ui/Toast';

export default function AdminSupportTickets() {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Form state
  const [ticketStatus, setTicketStatus] = useState('In Progress');
  const [adminReply, setAdminReply] = useState('');

  useEffect(() => {
    fetchTickets();
  }, [filterStatus]);

  const fetchTickets = async () => {
    try {
      setLoading(true);
      const params = filterStatus !== 'all' ? { status: filterStatus } : {};
      const { data } = await adminGetSupportTickets(params);
      setTickets(data.tickets || []);
    } catch {
      toast.error('Failed to load support tickets.');
    } finally {
      setLoading(false);
    }
  };

  const openTicketModal = (ticket) => {
    setSelectedTicket(ticket);
    setTicketStatus(ticket.status === 'Open' ? 'In Progress' : ticket.status);
    setAdminReply(ticket.adminReply || '');
    setModalOpen(true);
  };

  const handleUpdateTicket = async (e) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      await adminUpdateSupportTicket(selectedTicket._id, {
        status: ticketStatus,
        adminReply: adminReply.trim(),
      });
      toast.success('Support ticket updated successfully.');
      setModalOpen(false);
      fetchTickets();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update support ticket.');
    } finally {
      setSubmitting(false);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Resolved':
        return <span className="badge badge-success">Resolved</span>;
      case 'In Progress':
        return <span className="badge badge-warning">In Progress</span>;
      case 'Closed':
        return <span className="badge badge-muted">Closed</span>;
      default:
        return <span className="badge badge-info">Open</span>;
    }
  };

  return (
    <DashboardLayout title="Support Tickets" role="admin">
      <div className="page-header" style={{ marginBottom: '24px' }}>
        <div>
          <h2 className="page-title">Customer Support & Help Desk</h2>
          <p className="page-subtitle">
            Audit finding 10 — Manage support inquiries submitted through the public contact desk and platform user dashboards.
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
            <option value="Open">Open</option>
            <option value="In Progress">In Progress</option>
            <option value="Resolved">Resolved</option>
            <option value="Closed">Closed</option>
          </select>
        </div>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '60px' }}>
          <div className="spinner" style={{ margin: '0 auto 16px' }} />
          <p style={{ color: '#64748b' }}>Loading tickets...</p>
        </div>
      ) : tickets.length === 0 ? (
        <div className="card" style={{ padding: '48px', textAlign: 'center' }}>
          <p style={{ color: '#64748b', margin: 0 }}>No support tickets found matching the selected filter.</p>
        </div>
      ) : (
        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th>Ticket ID</th>
                <th>Date</th>
                <th>Sender</th>
                <th>Category</th>
                <th>Subject</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {tickets.map((t) => (
                <tr key={t._id}>
                  <td style={{ fontWeight: 600, fontFamily: 'monospace', fontSize: '13px' }}>
                    {t.ticketNumber || t._id.slice(-6).toUpperCase()}
                  </td>
                  <td style={{ fontSize: '13px', whiteSpace: 'nowrap' }}>
                    {new Date(t.createdAt).toLocaleDateString('en-GB')}
                  </td>
                  <td>
                    <div style={{ fontWeight: 600 }}>{t.name}</div>
                    <div style={{ fontSize: '12px', color: '#64748b' }}>{t.email}</div>
                  </td>
                  <td style={{ fontSize: '13px' }}>
                    <span className="badge badge-outline">{t.category}</span>
                  </td>
                  <td style={{ maxWidth: '240px', fontSize: '13px' }}>
                    <div style={{ fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {t.subject}
                    </div>
                  </td>
                  <td>{getStatusBadge(t.status)}</td>
                  <td>
                    <button
                      className="btn btn-sm btn-outline"
                      onClick={() => openTicketModal(t)}
                    >
                      View & Reply
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Ticket Response Modal */}
      {modalOpen && selectedTicket && (
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
            style={{ maxWidth: '620px', width: '100%', maxHeight: '90vh', overflowY: 'auto' }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ margin: 0, fontSize: '1.2rem' }}>
                Ticket #{selectedTicket.ticketNumber || selectedTicket._id.slice(-6).toUpperCase()}
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
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '8px' }}>
                  <div><strong>From:</strong> {selectedTicket.name}</div>
                  <div><strong>Email:</strong> {selectedTicket.email}</div>
                  <div><strong>Category:</strong> {selectedTicket.category}</div>
                  <div><strong>Date:</strong> {new Date(selectedTicket.createdAt).toLocaleString()}</div>
                </div>
                {selectedTicket.referenceNumber && (
                  <div style={{ marginBottom: '8px' }}>
                    <strong>Reference:</strong> {selectedTicket.referenceNumber}
                  </div>
                )}
                <div style={{ borderTop: '1px solid #e2e8f0', paddingTop: '8px' }}>
                  <strong>Subject:</strong> {selectedTicket.subject}
                </div>
                <div style={{ marginTop: '8px' }}>
                  <strong>Message:</strong>
                  <p style={{ margin: '4px 0 0', color: '#334155', whiteSpace: 'pre-wrap', background: '#fff', padding: '10px', borderRadius: '4px', border: '1px solid #e2e8f0' }}>
                    {selectedTicket.message}
                  </p>
                </div>
              </div>

              <form onSubmit={handleUpdateTicket} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div className="form-group">
                  <label className="form-label">Ticket Status</label>
                  <select
                    className="form-control"
                    value={ticketStatus}
                    onChange={(e) => setTicketStatus(e.target.value)}
                  >
                    <option value="Open">Open</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Resolved">Resolved</option>
                    <option value="Closed">Closed</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Admin Response / Internal Resolution</label>
                  <textarea
                    className="form-control"
                    rows="4"
                    placeholder="Provide response or steps taken..."
                    value={adminReply}
                    onChange={(e) => setAdminReply(e.target.value)}
                  />
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
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
                    {submitting ? 'Saving...' : 'Update Ticket'}
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
