import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import DashboardLayout from '../../layouts/DashboardLayout';
import { adminGetInfluencer, adminVerifyInfluencer } from '../../services/api';
import { toast } from '../../components/ui/Toast';

export default function AdminInfluencerDetail() {
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState(null);
  const [recentGigs, setRecentGigs] = useState([]);

  // Verification Edit State
  const [verifiedViews, setVerifiedViews] = useState('');
  const [verificationStatus, setVerificationStatus] = useState('verified');
  const [adminNotes, setAdminNotes] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchDetail();
  }, [id]);

  const fetchDetail = async () => {
    try {
      setLoading(true);
      const { data } = await adminGetInfluencer(id);
      setProfile(data.profile);
      setRecentGigs(data.recentGigs || []);
      setVerifiedViews(data.profile.verifiedViews || data.profile.averageViews || 1000);
      setVerificationStatus(data.profile.verificationStatus || 'pending');
      setAdminNotes(data.profile.adminNotes || '');
    } catch (err) {
      toast.error('Failed to load influencer profile.');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveVerification = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const { data } = await adminVerifyInfluencer(id, {
        verificationStatus,
        verifiedViews: Number(verifiedViews),
        adminNotes,
      });
      toast.success(data.message || 'Verification updated successfully!');
      setProfile(data.profile);
    } catch (err) {
      toast.error('Failed to update verification.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <DashboardLayout title="Influencer Profile" role="admin">
        <div style={{ textAlign: 'center', padding: '60px' }}>
          <div className="spinner" style={{ margin: '0 auto 16px' }} />
          <p style={{ color: '#64748b' }}>Loading influencer details...</p>
        </div>
      </DashboardLayout>
    );
  }

  if (!profile) {
    return (
      <DashboardLayout title="Influencer Profile" role="admin">
        <div className="card" style={{ padding: '40px', textAlign: 'center' }}>
          <h3>Influencer not found</h3>
          <Link to="/admin/influencers" className="btn btn-primary" style={{ marginTop: '16px' }}>Back to Directory</Link>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout title={`Influencer: ${profile.userId?.name}`} role="admin">
      <div style={{ marginBottom: '20px' }}>
        <Link to="/admin/influencers" style={{ color: '#059669', fontWeight: '600', fontSize: '14px' }}>
          ← Back to Influencer Directory
        </Link>
      </div>

      <div className="grid-2" style={{ gap: '28px', alignItems: 'flex-start' }}>
        {/* Left Column: Profile, Proof Screenshots, Bank Details */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <div className="card">
            <div className="card-header">
              <div>
                <h2 style={{ fontSize: '1.4rem' }}>{profile.userId?.name}</h2>
                <div style={{ fontSize: '13px', color: '#64748b' }}>
                  {profile.userId?.email} •  {profile.userId?.phone} •  WA: {profile.whatsappNumber}
                </div>
              </div>
              <span className={`badge ${profile.verificationStatus === 'verified' ? 'badge-success' : 'badge-warning'}`}>
                {profile.verificationStatus}
              </span>
            </div>

            <div className="card-body">
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '14px' }}>
                <div><strong>State & City:</strong> {profile.state}, {profile.city || profile.lga}</div>
                <div><strong>Primary Area:</strong> {profile.area}</div>
                <div><strong>Additional Reach Areas:</strong> {profile.additionalAreas?.join(', ') || 'None specified'}</div>
                <div><strong>Categories:</strong> {profile.categories?.join(', ') || 'All categories'}</div>
                <div><strong>Self-Reported Average Views:</strong> {Number(profile.averageViews).toLocaleString()}</div>
                <div><strong>Reliability Score:</strong> {profile.reliabilityScore || 100}%</div>
                <div><strong>Completed Gigs:</strong> {profile.completedGigs || 0}</div>
              </div>
            </div>
          </div>

          {/* Private Bank Details (Authorized Admin Only) */}
          <div className="card">
            <div className="card-header">
              <h3 style={{ fontSize: '1.2rem' }}> Confidential Bank Details (For Payouts)</h3>
            </div>
            <div className="card-body">
              {profile.bankDetails?.accountNumber ? (
                <div style={{ background: '#f8fafc', padding: '16px', borderRadius: '8px', border: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '14px' }}>
                  <div><span style={{ color: '#64748b' }}>Bank Name:</span> <strong>{profile.bankDetails.bankName}</strong></div>
                  <div><span style={{ color: '#64748b' }}>Account Number:</span> <strong style={{ color: '#059669', fontSize: '16px' }}>{profile.bankDetails.accountNumber}</strong></div>
                  <div><span style={{ color: '#64748b' }}>Account Name:</span> <strong>{profile.bankDetails.accountName}</strong></div>
                </div>
              ) : (
                <div style={{ color: '#94a3b8', fontStyle: 'italic' }}>
                  No bank details provided by this influencer yet.
                </div>
              )}
            </div>
          </div>

          {/* Proof Screenshots */}
          <div className="card">
            <div className="card-header">
              <h3 style={{ fontSize: '1.2rem' }}> Uploaded Reach Proof Screenshots</h3>
            </div>
            <div className="card-body">
              {profile.proofImages && profile.proofImages.length > 0 ? (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: '12px' }}>
                  {profile.proofImages.map((img, i) => (
                    <a key={i} href={img.url} target="_blank" rel="noreferrer">
                      <img src={img.url} alt={`Proof ${i}`} style={{ width: '100%', height: '140px', objectFit: 'cover', borderRadius: '8px', border: '1px solid #e2e8f0' }} />
                    </a>
                  ))}
                </div>
              ) : (
                <div style={{ color: '#94a3b8' }}>No verification screenshots uploaded yet.</div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Verify Reach Tool & Recent Gigs */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <div className="card">
            <div className="card-header">
              <h3 style={{ fontSize: '1.2rem' }}> Audit & Verify Reach Tier</h3>
            </div>
            <div className="card-body">
              <form onSubmit={handleSaveVerification}>
                <div className="form-group">
                  <label className="form-label">Verification Status</label>
                  <select
                    className="form-control"
                    value={verificationStatus}
                    onChange={(e) => setVerificationStatus(e.target.value)}
                  >
                    <option value="verified">Verified (Eligible for Campaign Matching)</option>
                    <option value="pending">Pending (Awaiting updated proof)</option>
                    <option value="rejected">Rejected</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Verified Views Count</label>
                  <input
                    type="number"
                    required
                    min="100"
                    className="form-control"
                    value={verifiedViews}
                    onChange={(e) => setVerifiedViews(e.target.value)}
                  />
                  <span className="form-hint">This audited number is used during campaign reach matching.</span>
                </div>

                <div className="form-group">
                  <label className="form-label">Admin Notes to Influencer</label>
                  <textarea
                    className="form-control"
                    rows={3}
                    placeholder="Feedback regarding reach audit..."
                    value={adminNotes}
                    onChange={(e) => setAdminNotes(e.target.value)}
                  />
                </div>

                <button type="submit" className="btn btn-primary btn-block btn-lg" disabled={saving}>
                  {saving ? 'Updating...' : 'Save Audit Decisions'}
                </button>
              </form>
            </div>
          </div>

          {/* Recent Gig Assignments */}
          <div className="card">
            <div className="card-header">
              <h3 style={{ fontSize: '1.2rem' }}> Recent Gig Performance</h3>
            </div>
            <div className="card-body" style={{ padding: 0 }}>
              {recentGigs.length === 0 ? (
                <div style={{ padding: '24px', textAlign: 'center', color: '#94a3b8' }}>
                  No gigs assigned yet.
                </div>
              ) : (
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Campaign</th>
                      <th>Views</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentGigs.map((g) => (
                      <tr key={g._id}>
                        <td>{g.campaignId?.title}</td>
                        <td>{Number(g.assignedViews).toLocaleString()}</td>
                        <td><span className="badge badge-muted">{g.status}</span></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
