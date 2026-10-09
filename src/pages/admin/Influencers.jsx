import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import DashboardLayout from '../../layouts/DashboardLayout';
import { adminGetInfluencers, adminVerifyInfluencer } from '../../services/api';
import { toast } from '../../components/ui/Toast';

const nigerianStates = [
  'Lagos', 'Abuja (FCT)', 'Rivers', 'Oyo', 'Kano', 'Enugu', 'Delta', 'Anambra',
  'Ogun', 'Kaduna', 'Edo', 'Imo', 'Akwa Ibom', 'Plateau', 'Ondo', 'Kwara', 'Other',
];

export default function AdminInfluencers() {
  const [searchParams] = useSearchParams();
  const initVerification = searchParams.get('verificationStatus') || '';

  const [loading, setLoading] = useState(true);
  const [influencers, setInfluencers] = useState([]);
  const [total, setTotal] = useState(0);

  // Filters
  const [search, setSearch] = useState('');
  const [stateFilter, setStateFilter] = useState('');
  const [verificationFilter, setVerificationFilter] = useState(initVerification);
  const [minViews, setMinViews] = useState('');

  // Quick Verify Modal
  const [verifyModal, setVerifyModal] = useState({ open: false, influencer: null, views: '', status: 'verified', notes: '' });

  useEffect(() => {
    fetchInfluencers();
  }, [stateFilter, verificationFilter]);

  const fetchInfluencers = async () => {
    try {
      setLoading(true);
      const params = {
        search: search || undefined,
        state: stateFilter || undefined,
        verificationStatus: verificationFilter || undefined,
        minViews: minViews || undefined,
      };
      const { data } = await adminGetInfluencers(params);
      setInfluencers(data.influencers || []);
      setTotal(data.total || 0);
    } catch (err) {
      toast.error('Failed to load influencers.');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenVerify = (inf) => {
    setVerifyModal({
      open: true,
      influencer: inf,
      views: inf.verifiedViews || inf.averageViews || 1000,
      status: 'verified',
      notes: '',
    });
  };

  const handleVerifySubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await adminVerifyInfluencer(verifyModal.influencer.userId._id, {
        verificationStatus: verifyModal.status,
        verifiedViews: Number(verifyModal.views),
        adminNotes: verifyModal.notes,
      });
      toast.success(data.message || 'Influencer verification updated!');
      setVerifyModal({ open: false, influencer: null, views: '', status: 'verified', notes: '' });
      fetchInfluencers();
    } catch (err) {
      toast.error('Failed to update verification.');
    }
  };

  return (
    <DashboardLayout title="Influencer Directory" role="admin">
      <div className="page-header">
        <div>
          <h2 className="page-title">WhatsApp Influencer Network ({total})</h2>
          <p className="page-subtitle">Inspect reach metrics, audit status view proof, and verify view tiers.</p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="card" style={{ padding: '16px', marginBottom: '20px' }}>
        <form
          onSubmit={(e) => { e.preventDefault(); fetchInfluencers(); }}
          style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'center' }}
        >
          <input
            type="text"
            className="form-control"
            placeholder="Search by name or email..."
            style={{ flex: 1, minWidth: '200px' }}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <select
            className="form-control"
            style={{ width: '160px' }}
            value={stateFilter}
            onChange={(e) => setStateFilter(e.target.value)}
          >
            <option value="">All States</option>
            {nigerianStates.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>

          <select
            className="form-control"
            style={{ width: '180px' }}
            value={verificationFilter}
            onChange={(e) => setVerificationFilter(e.target.value)}
          >
            <option value="">All Verification</option>
            <option value="pending">Pending Verification</option>
            <option value="verified">Verified Only</option>
            <option value="rejected">Rejected Only</option>
          </select>

          <input
            type="number"
            className="form-control"
            placeholder="Min views..."
            style={{ width: '120px' }}
            value={minViews}
            onChange={(e) => setMinViews(e.target.value)}
          />

          <button type="submit" className="btn btn-primary">Filter</button>
        </form>
      </div>

      <div className="card">
        <div className="card-body" style={{ padding: 0 }}>
          {loading ? (
            <div style={{ textAlign: 'center', padding: '60px' }}>
              <div className="spinner" style={{ margin: '0 auto 16px' }} />
              <p style={{ color: '#64748b' }}>Loading influencer directory...</p>
            </div>
          ) : influencers.length === 0 ? (
            <div className="empty-state">
              
              <h3>No influencers found</h3>
              <p>Adjust your search and filter parameters.</p>
            </div>
          ) : (
            <div className="table-wrapper" style={{ border: 'none', borderRadius: 0 }}>
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Influencer</th>
                    <th>Location / Area</th>
                    <th>WhatsApp Views</th>
                    <th>Status</th>
                    <th>Reliability</th>
                    <th>Completed</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {influencers.map((inf) => (
                    <tr key={inf._id}>
                      <td>
                        <strong>{inf.userId?.name}</strong>
                        <div style={{ fontSize: '12px', color: '#64748b' }}>{inf.userId?.email}</div>
                        <div style={{ fontSize: '11px', color: '#059669', fontWeight: '600' }}>
                          WA: {inf.whatsappNumber}
                        </div>
                      </td>
                      <td>
                        <strong>{inf.area}</strong>
                        <div style={{ fontSize: '12px', color: '#64748b' }}>{inf.state} ({inf.city || inf.lga})</div>
                      </td>
                      <td>
                        <div style={{ fontSize: '15px', fontWeight: '800', color: inf.verifiedViews > 0 ? '#059669' : '#d97706' }}>
                          {Number(inf.verifiedViews || inf.averageViews).toLocaleString()} views
                        </div>
                        <div style={{ fontSize: '11px', color: '#94a3b8' }}>
                          Sub: {Number(inf.averageViews).toLocaleString()}
                        </div>
                      </td>
                      <td>
                        {inf.verificationStatus === 'verified' && <span className="badge badge-success">✓ Verified</span>}
                        {inf.verificationStatus === 'pending' && <span className="badge badge-warning"> Pending</span>}
                        {inf.verificationStatus === 'rejected' && <span className="badge badge-error">Rejected</span>}
                        <div style={{ marginTop: '4px' }}>
                          {inf.availability ? (
                            <span style={{ fontSize: '11px', color: '#059669' }}>● Available</span>
                          ) : (
                            <span style={{ fontSize: '11px', color: '#94a3b8' }}>○ Unavailable</span>
                          )}
                        </div>
                      </td>
                      <td>
                        <strong>{inf.reliabilityScore || 100}%</strong>
                      </td>
                      <td>
                        {inf.completedGigs || 0} gigs
                      </td>
                      <td>
                        <div style={{ display: 'flex', gap: '6px' }}>
                          <button
                            className="btn btn-sm btn-primary"
                            onClick={() => handleOpenVerify(inf)}
                          >
                            Verify / Adjust
                          </button>
                          <Link
                            to={`/admin/influencers/${inf.userId?._id}`}
                            className="btn btn-sm btn-ghost"
                          >
                            Profile →
                          </Link>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Verify / Adjust Reach Modal */}
      {verifyModal.open && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h3>Verify Reach: {verifyModal.influencer?.userId?.name}</h3>
              <button className="btn-icon" onClick={() => setVerifyModal({ open: false, influencer: null, views: '', status: 'verified', notes: '' })}>✕</button>
            </div>
            <form onSubmit={handleVerifySubmit}>
              <div className="modal-body">
                <p style={{ fontSize: '14px', color: '#64748b', marginBottom: '16px' }}>
                  Audited WhatsApp reach directly dictates campaign matching eligibility.
                </p>

                <div className="form-group">
                  <label className="form-label">Verification Status</label>
                  <select
                    className="form-control"
                    value={verifyModal.status}
                    onChange={(e) => setVerifyModal({ ...verifyModal, status: e.target.value })}
                  >
                    <option value="verified">Verified (Eligible for gigs)</option>
                    <option value="pending">Pending (Awaiting more proof)</option>
                    <option value="rejected">Rejected (Insufficient / fake proof)</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Official Verified Average Views</label>
                  <input
                    type="number"
                    required
                    min="100"
                    className="form-control"
                    value={verifyModal.views}
                    onChange={(e) => setVerifyModal({ ...verifyModal, views: e.target.value })}
                  />
                  <span className="form-hint">Claimed average: {Number(verifyModal.influencer?.averageViews).toLocaleString()}</span>
                </div>

                <div className="form-group">
                  <label className="form-label">Admin Notes to Influencer</label>
                  <textarea
                    className="form-control"
                    rows={2}
                    placeholder="e.g. Verified tier 2,500 based on submitted screenshots."
                    value={verifyModal.notes}
                    onChange={(e) => setVerifyModal({ ...verifyModal, notes: e.target.value })}
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-ghost" onClick={() => setVerifyModal({ open: false, influencer: null, views: '', status: 'verified', notes: '' })}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Save Verification
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
