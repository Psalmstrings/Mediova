import React, { useState, useEffect } from 'react';
import DashboardLayout from '../../layouts/DashboardLayout';
import { adminGetGigDetail } from '../../services/api';
import { useParams, Link } from 'react-router-dom';
import { toast } from '../../components/ui/Toast';

export default function AdminGigDetail() {
  const { id } = useParams();
  const [gig, setGig] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchGig(); }, [id]);

  const fetchGig = async () => {
    try {
      const { data } = await adminGetGigDetail(id);
      setGig(data.gig);
    } catch {
      toast.error('Failed to load gig details.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <DashboardLayout title="Gig Detail" role="admin">
        <div style={{ textAlign: 'center', padding: '60px' }}>
          <div className="spinner" style={{ margin: '0 auto 16px' }} />
        </div>
      </DashboardLayout>
    );
  }

  if (!gig) {
    return (
      <DashboardLayout title="Gig Detail" role="admin">
        <div className="empty-state">
          
          <div className="empty-title">Gig not found</div>
          <Link to="/admin/gigs" className="btn btn-primary" style={{ marginTop: '16px' }}>Back to Gigs</Link>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout title="Gig Detail" role="admin">
      <div className="page-header">
        <div>
          <Link to="/admin/gigs" style={{ fontSize: '14px', color: 'var(--primary)', marginBottom: '8px', display: 'block' }}>
            ← Back to Gigs
          </Link>
          <h2 className="page-title">Gig Detail</h2>
        </div>
      </div>

      <div className="grid-2" style={{ gap: '24px' }}>
        <div className="card">
          <div className="card-header"><h3>Influencer</h3></div>
          <div className="card-body">
            <p><strong>Name:</strong> {gig.influencer?.name || '—'}</p>
            <p><strong>Location:</strong> {gig.influencer?.location || '—'}</p>
            <p><strong>Status:</strong> {gig.status}</p>
            <p><strong>Reward:</strong> ₦{Number(gig.reward || 0).toLocaleString()}</p>
          </div>
        </div>
        <div className="card">
          <div className="card-header"><h3>Campaign</h3></div>
          <div className="card-body">
            <p><strong>Title:</strong> {gig.campaign?.title || '—'}</p>
            <p><strong>Category:</strong> {gig.campaign?.category || '—'}</p>
            <Link to={`/admin/campaigns/${gig.campaign?._id}`} className="btn btn-outline btn-sm" style={{ marginTop: '12px' }}>
              View Campaign
            </Link>
          </div>
        </div>
      </div>

      {gig.proofImages?.length > 0 && (
        <div className="card" style={{ marginTop: '24px' }}>
          <div className="card-header"><h3>Submitted Proof</h3></div>
          <div className="card-body">
            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
              {gig.proofImages.map((img, i) => (
                <a key={i} href={img} target="_blank" rel="noreferrer">
                  <img src={img} alt={`Proof ${i + 1}`} style={{ width: '200px', height: '150px', objectFit: 'cover', borderRadius: 'var(--radius)' }} />
                </a>
              ))}
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
