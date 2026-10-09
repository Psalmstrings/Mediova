import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import DashboardLayout from '../../layouts/DashboardLayout';
import { adminGetGigs } from '../../services/api';
import { toast } from '../../components/ui/Toast';

const STATUS_COLORS = {
  assigned:   { color: '#7c3aed', bg: '#f5f3ff' },
  accepted:   { color: '#2563eb', bg: '#eff6ff' },
  submitted:  { color: '#d97706', bg: '#fffbeb' },
  approved:   { color: '#059669', bg: '#ecfdf5' },
  rejected:   { color: '#dc2626', bg: '#fef2f2' },
  paid:       { color: '#0284c7', bg: '#f0f9ff' },
};

export default function AdminGigs() {
  const [gigs, setGigs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');

  useEffect(() => { fetchGigs(); }, []);

  const fetchGigs = async () => {
    try {
      setLoading(true);
      const { data } = await adminGetGigs();
      setGigs(data.gigs || []);
    } catch {
      toast.error('Failed to load gigs.');
    } finally {
      setLoading(false);
    }
  };

  const filtered = gigs.filter((g) => {
    const matchSearch = !search ||
      g.influencer?.name?.toLowerCase().includes(search.toLowerCase()) ||
      g.campaign?.title?.toLowerCase().includes(search.toLowerCase());
    const matchStatus = !status || g.status === status;
    return matchSearch && matchStatus;
  });

  return (
    <DashboardLayout title="Gigs" role="admin">
      <div className="page-header">
        <div>
          <h2 className="page-title">All Gigs</h2>
          <p className="page-subtitle">Individual gig assignments distributed to influencers.</p>
        </div>
        <Link to="/admin/submissions" className="btn btn-primary">
          Review Submissions
        </Link>
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: '12px', marginBottom: '24px', flexWrap: 'wrap' }}>
        <input
          className="input"
          style={{ flex: 1, minWidth: '200px' }}
          placeholder="Search by influencer or campaign..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select
          className="input"
          style={{ minWidth: '160px' }}
          value={status}
          onChange={(e) => setStatus(e.target.value)}
        >
          <option value="">All Statuses</option>
          {Object.keys(STATUS_COLORS).map((s) => (
            <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
          ))}
        </select>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '60px' }}>
          <div className="spinner" style={{ margin: '0 auto 16px' }} />
          <p style={{ color: '#64748b' }}>Loading gigs...</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="empty-state">
          
          <div className="empty-title">No gigs found</div>
          <div className="empty-desc">Gigs will appear here once assigned to influencers.</div>
        </div>
      ) : (
        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th>Influencer</th>
                <th>Campaign</th>
                <th>Reward</th>
                <th>Status</th>
                <th>Assigned</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((gig) => {
                const sc = STATUS_COLORS[gig.status] || { color: '#64748b', bg: '#f8fafc' };
                return (
                  <tr key={gig._id}>
                    <td>
                      <div style={{ fontWeight: '600' }}>{gig.influencer?.name || '—'}</div>
                      <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{gig.influencer?.location || ''}</div>
                    </td>
                    <td>{gig.campaign?.title || '—'}</td>
                    <td style={{ fontWeight: '600' }}>₦{Number(gig.reward || 0).toLocaleString()}</td>
                    <td>
                      <span style={{
                        padding: '3px 10px', borderRadius: 'var(--radius-full)',
                        fontSize: '12px', fontWeight: '600',
                        color: sc.color, background: sc.bg,
                      }}>
                        {gig.status}
                      </span>
                    </td>
                    <td style={{ color: 'var(--text-muted)', fontSize: '13px' }}>
                      {new Date(gig.assignedAt || gig.createdAt).toLocaleDateString('en-NG')}
                    </td>
                    <td>
                      <Link to={`/admin/gigs/${gig._id}`} className="btn btn-sm btn-outline">
                        View
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </DashboardLayout>
  );
}
