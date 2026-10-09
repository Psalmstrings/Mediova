import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import DashboardLayout from '../../layouts/DashboardLayout';
import { getMyGigs, acceptGig, declineGig } from '../../services/api';
import { toast } from '../../components/ui/Toast';

export default function InfluencerGigs() {
  const [searchParams, setSearchParams] = useSearchParams();
  const currentFilter = searchParams.get('status') || 'all';

  const [gigs, setGigs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [declineModal, setDeclineModal] = useState({ open: false, gigId: null, reason: '' });

  useEffect(() => {
    fetchGigs();
  }, [currentFilter]);

  const fetchGigs = async () => {
    try {
      setLoading(true);
      const params = currentFilter === 'all' ? {} : { status: currentFilter };
      const { data } = await getMyGigs(params);
      setGigs(data.gigs || []);
    } catch (err) {
      toast.error('Failed to load gigs.');
    } finally {
      setLoading(false);
    }
  };

  const handleAccept = async (id) => {
    try {
      const { data } = await acceptGig(id);
      toast.success(data.message || 'Gig accepted! View details to get media & posting instructions.');
      fetchGigs();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Could not accept gig.');
    }
  };

  const handleDeclineSubmit = async (e) => {
    e.preventDefault();
    try {
      await declineGig(declineModal.gigId, { reason: declineModal.reason });
      toast.info('Gig declined.');
      setDeclineModal({ open: false, gigId: null, reason: '' });
      fetchGigs();
    } catch (err) {
      toast.error('Failed to decline gig.');
    }
  };

  const getStatusBadge = (status) => {
    const map = {
      assigned: { label: 'New / Assigned', cls: 'badge-info' },
      accepted: { label: 'Accepted / In Progress', cls: 'badge-success' },
      in_progress: { label: 'In Progress', cls: 'badge-success' },
      submitted: { label: 'Awaiting Admin Review', cls: 'badge-warning' },
      approved: { label: 'Approved & Credited', cls: 'badge-success' },
      rejected: { label: 'Rejected', cls: 'badge-error' },
      declined: { label: 'Declined', cls: 'badge-muted' },
    };
    const s = map[status] || { label: status, cls: 'badge-muted' };
    return <span className={`badge ${s.cls}`}>{s.label}</span>;
  };

  return (
    <DashboardLayout title="My Advertising Gigs" role="influencer">
      <div className="page-header">
        <div>
          <h2 className="page-title">Advertising Gigs</h2>
          <p className="page-subtitle">Manage your matched WhatsApp Status campaigns and track review statuses.</p>
        </div>
      </div>

      {/* Status Filter Tabs */}
      <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '12px', marginBottom: '24px' }}>
        {[
          { key: 'all', label: 'All Gigs' },
          { key: 'assigned', label: ' New Gigs' },
          { key: 'accepted', label: ' Active' },
          { key: 'submitted', label: ' Submitted' },
          { key: 'approved', label: ' Approved' },
          { key: 'rejected', label: '⚠️ Rejected' },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setSearchParams(tab.key === 'all' ? {} : { status: tab.key })}
            className={`btn btn-sm ${currentFilter === tab.key ? 'btn-primary' : 'btn-ghost'}`}
            style={{ borderRadius: '20px' }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '60px' }}>
          <div className="spinner" style={{ margin: '0 auto 16px' }} />
          <p style={{ color: '#64748b' }}>Loading gigs...</p>
        </div>
      ) : gigs.length === 0 ? (
        <div className="card">
          <div className="empty-state">
            
            <h3>No gigs found for this filter</h3>
            <p>You will see advertising campaigns here when the Admin matches them to your WhatsApp audience.</p>
          </div>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '20px' }}>
          {gigs.map((gig) => {
            const camp = gig.campaignId;
            return (
              <div key={gig._id} className="card" style={{ display: 'flex', flexDirection: 'column' }}>
                <div className="card-header" style={{ padding: '16px 20px', alignItems: 'flex-start' }}>
                  <div>
                    <div style={{ fontSize: '11px', color: '#94a3b8', fontWeight: '700' }}>#{gig.gigNumber}</div>
                    <h3 style={{ fontSize: '1.1rem', marginTop: '2px' }}>{camp?.title}</h3>
                  </div>
                  {getStatusBadge(gig.status)}
                </div>

                <div className="card-body" style={{ padding: '16px 20px', flex: 1 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px', fontSize: '13px' }}>
                    <span style={{ color: '#64748b' }}>Category:</span>
                    <strong>{camp?.category}</strong>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px', fontSize: '13px' }}>
                    <span style={{ color: '#64748b' }}>Target Location:</span>
                    <strong>{camp?.targetLocation?.area}, {camp?.targetLocation?.state}</strong>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px', fontSize: '13px' }}>
                    <span style={{ color: '#64748b' }}>Required Views:</span>
                    <strong style={{ color: '#2563eb' }}>{Number(gig.assignedViews).toLocaleString()} views</strong>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px', fontSize: '13px' }}>
                    <span style={{ color: '#64748b' }}>Required Duration:</span>
                    <strong>{camp?.duration || '24 Hours'}</strong>
                  </div>

                  <div style={{ background: '#f8fafc', padding: '12px', borderRadius: '8px', border: '1px solid #e2e8f0', marginTop: '16px' }}>
                    <div style={{ fontSize: '12px', color: '#64748b' }}>Your Guaranteed Reward:</div>
                    <div style={{ fontSize: '1.4rem', fontWeight: '800', color: '#059669' }}>
                      ₦{Number(gig.reward).toLocaleString()}
                    </div>
                  </div>
                </div>

                <div className="card-footer" style={{ padding: '12px 20px', display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                  {gig.status === 'assigned' && (
                    <>
                      <button
                        className="btn btn-sm btn-ghost"
                        onClick={() => setDeclineModal({ open: true, gigId: gig._id, reason: '' })}
                      >
                        Decline
                      </button>
                      <button
                        className="btn btn-sm btn-primary"
                        onClick={() => handleAccept(gig._id)}
                      >
                        Accept Gig
                      </button>
                    </>
                  )}

                  {['accepted', 'in_progress', 'rejected'].includes(gig.status) && (
                    <Link to={`/influencer/gigs/${gig._id}`} className="btn btn-sm btn-primary btn-block">
                      View Instructions & Submit Proof →
                    </Link>
                  )}

                  {['submitted', 'approved', 'declined'].includes(gig.status) && (
                    <Link to={`/influencer/gigs/${gig._id}`} className="btn btn-sm btn-ghost btn-block">
                      View Gig Details
                    </Link>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Decline Reason Modal */}
      {declineModal.open && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h3>Decline Advertising Gig</h3>
              <button
                className="btn-icon"
                onClick={() => setDeclineModal({ open: false, gigId: null, reason: '' })}
              >
                ✕
              </button>
            </div>
            <form onSubmit={handleDeclineSubmit}>
              <div className="modal-body">
                <p style={{ color: '#64748b', fontSize: '14px', marginBottom: '16px' }}>
                  Please let the Admin broker know why you are declining this gig so we can refine future campaign matches.
                </p>
                <div className="form-group">
                  <label className="form-label">Reason for Declining</label>
                  <textarea
                    required
                    className="form-control"
                    rows={3}
                    placeholder="e.g. Incompatible with my audience, traveling this week, etc."
                    value={declineModal.reason}
                    onChange={(e) => setDeclineModal({ ...declineModal, reason: e.target.value })}
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-ghost"
                  onClick={() => setDeclineModal({ open: false, gigId: null, reason: '' })}
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-danger">
                  Confirm Decline
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
