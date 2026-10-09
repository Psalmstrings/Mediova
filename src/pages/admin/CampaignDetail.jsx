import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import DashboardLayout from '../../layouts/DashboardLayout';
import {
  adminGetCampaign,
  adminUpdateCampaign,
  adminMatchInfluencers,
  adminAssignGigs,
} from '../../services/api';
import { toast } from '../../components/ui/Toast';

export default function AdminCampaignDetail() {
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [campaign, setCampaign] = useState(null);
  const [gigs, setGigs] = useState([]);
  const [gigStats, setGigStats] = useState({});

  // Matching Engine State
  const [matchingLoading, setMatchingLoading] = useState(false);
  const [matchedInfluencers, setMatchedInfluencers] = useState([]);
  const [selectedInfluencers, setSelectedInfluencers] = useState([]); // Array of IDs
  const [customReward, setCustomReward] = useState('');

  // Status Change State
  const [newStatus, setNewStatus] = useState('');
  const [savingStatus, setSavingStatus] = useState(false);

  useEffect(() => {
    fetchDetail();
  }, [id]);

  const fetchDetail = async () => {
    try {
      setLoading(true);
      const { data } = await adminGetCampaign(id);
      setCampaign(data.campaign);
      setGigs(data.gigs || []);
      setGigStats(data.gigStats || {});
      setNewStatus(data.campaign?.status || '');
      // Automatically run match query using campaign defaults
      if (data.campaign) {
        runMatching(data.campaign);
      }
    } catch (err) {
      toast.error('Failed to load campaign.');
    } finally {
      setLoading(false);
    }
  };

  const runMatching = async (camp) => {
    try {
      setMatchingLoading(true);
      const params = {
        state: camp.targetLocation?.state || '',
        area: camp.targetLocation?.area || '',
        category: camp.category || '',
        availability: 'true',
        excludeCampaignId: camp._id,
      };
      const { data } = await adminMatchInfluencers(params);
      setMatchedInfluencers(data.influencers || []);
    } catch {
      // fallback
    } finally {
      setMatchingLoading(false);
    }
  };

  const handleToggleSelect = (inf) => {
    const isSelected = selectedInfluencers.some((item) => item._id === inf._id);
    if (isSelected) {
      setSelectedInfluencers(selectedInfluencers.filter((item) => item._id !== inf._id));
    } else {
      setSelectedInfluencers([...selectedInfluencers, inf]);
    }
  };

  // Dynamic Reach Calculation
  const requiredReach = campaign?.requiredViews || 0;
  const currentAssignedReach = campaign?.assignedReach || 0;
  const newlySelectedReach = selectedInfluencers.reduce(
    (acc, inf) => acc + (inf.verifiedViews || inf.averageViews || 1000),
    0
  );
  const totalProspectiveReach = currentAssignedReach + newlySelectedReach;
  const remainingReach = Math.max(0, requiredReach - totalProspectiveReach);
  const isTargetReached = totalProspectiveReach >= requiredReach;

  const handleAssignGigs = async () => {
    if (selectedInfluencers.length === 0) {
      toast.warning('Please select at least one influencer to assign.');
      return;
    }

    try {
      // Calculate reward proportional to views or fixed default
      const defaultPerView = (campaign.price * 0.7) / requiredReach; // ~70% payout ratio default

      const assignments = selectedInfluencers.map((inf) => {
        const infViews = inf.verifiedViews || inf.averageViews || 1000;
        const calculatedReward = customReward
          ? Number(customReward)
          : Math.max(1000, Math.round(infViews * defaultPerView));

        return {
          influencerId: inf.userId._id,
          assignedViews: infViews,
          reward: calculatedReward,
        };
      });

      const { data } = await adminAssignGigs({
        campaignId: campaign._id,
        assignments,
      });

      toast.success(data.message || 'Gigs assigned successfully!');
      setSelectedInfluencers([]);
      fetchDetail();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to assign gigs.');
    }
  };

  const handleStatusUpdate = async () => {
    setSavingStatus(true);
    try {
      const { data } = await adminUpdateCampaign(id, { status: newStatus });
      toast.success('Campaign status updated to: ' + newStatus);
      setCampaign(data.campaign);
    } catch (err) {
      toast.error('Failed to update campaign status.');
    } finally {
      setSavingStatus(false);
    }
  };

  const handleConfirmPayment = async () => {
    try {
      const { data } = await adminUpdateCampaign(id, {
        paymentStatus: 'confirmed',
        status: 'Payment Confirmed',
      });
      toast.success('Payment confirmed!');
      setCampaign(data.campaign);
    } catch (err) {
      toast.error('Failed to confirm payment.');
    }
  };

  if (loading) {
    return (
      <DashboardLayout title="Campaign Broker Workspace" role="admin">
        <div style={{ textAlign: 'center', padding: '60px' }}>
          <div className="spinner" style={{ margin: '0 auto 16px' }} />
          <p style={{ color: '#64748b' }}>Loading campaign workspace...</p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout title={`Order #${campaign.orderNumber}`} role="admin">
      <div style={{ marginBottom: '20px' }}>
        <Link to="/admin/campaigns" style={{ color: '#059669', fontWeight: '600', fontSize: '14px' }}>
          ← Back to Campaigns
        </Link>
      </div>

      {/* Top Campaign Summary & Status Controller */}
      <div className="card" style={{ padding: '24px', marginBottom: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span className="badge badge-info">#{campaign.orderNumber}</span>
              <h2 style={{ fontSize: '1.5rem', margin: 0 }}>{campaign.title}</h2>
              <span className="badge badge-muted">{campaign.category}</span>
            </div>
            <div style={{ color: '#64748b', fontSize: '13px', marginTop: '6px' }}>
              Advertiser: <strong>{campaign.vendorId?.name}</strong> ({campaign.vendorId?.email}) •  Target: <strong>{campaign.targetLocation?.area}, {campaign.targetLocation?.state}</strong>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            {campaign.paymentStatus !== 'confirmed' && (
              <button onClick={handleConfirmPayment} className="btn btn-warning">
                 Confirm Payment (₦{Number(campaign.price).toLocaleString()})
              </button>
            )}

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <select
                className="form-control"
                style={{ width: '190px' }}
                value={newStatus}
                onChange={(e) => setNewStatus(e.target.value)}
              >
                {[
                  'Draft', 'Submitted', 'Awaiting Payment', 'Payment Confirmed',
                  'Under Review', 'Approved', 'Processing', 'Influencers Assigned',
                  'Active', 'Awaiting Proof', 'Completed', 'Rejected', 'Cancelled',
                ].map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
              <button
                onClick={handleStatusUpdate}
                disabled={savingStatus}
                className="btn btn-primary"
              >
                Update
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 37: DYNAMIC REACH CALCULATOR */}
      <div className="card" style={{ padding: '24px', marginBottom: '28px', background: isTargetReached ? '#ecfdf5' : '#f8fafc', border: isTargetReached ? '2px solid #059669' : '1px solid #e2e8f0' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <h3 style={{ fontSize: '1.2rem', margin: 0, color: isTargetReached ? '#065f46' : '#0f172a' }}>
               Campaign Reach Allocation
            </h3>
            <p style={{ margin: '4px 0 0', fontSize: '13px', color: '#64748b' }}>
              Required: <strong>{Number(requiredReach).toLocaleString()} Views</strong> •
              Assigned: <strong>{Number(currentAssignedReach).toLocaleString()} Views</strong> •
              Selected: <strong style={{ color: '#2563eb' }}>+{Number(newlySelectedReach).toLocaleString()} Views</strong>
            </p>
          </div>

          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '12px', color: '#64748b' }}>Remaining to Target</div>
            <div style={{ fontSize: '1.8rem', fontWeight: '900', color: isTargetReached ? '#059669' : '#d97706' }}>
              {isTargetReached ? '✓ Target Reached!' : `${Number(remainingReach).toLocaleString()} Views`}
            </div>
          </div>
        </div>
      </div>

      <div className="grid-2" style={{ gap: '28px', alignItems: 'flex-start' }}>
        {/* Left Column: SECTION 36 - INFLUENCER MATCHING ENGINE */}
        <div className="card">
          <div className="card-header">
            <div>
              <h3 style={{ fontSize: '1.2rem' }}> Matched Available Influencers</h3>
              <p style={{ margin: 0, fontSize: '12px', color: '#64748b' }}>
                Filtered by: State ({campaign.targetLocation?.state}), Area ({campaign.targetLocation?.area}), Category ({campaign.category})
              </p>
            </div>
            {selectedInfluencers.length > 0 && (
              <span className="badge badge-success">{selectedInfluencers.length} Selected</span>
            )}
          </div>

          <div className="card-body" style={{ padding: 0 }}>
            {matchingLoading ? (
              <div style={{ textAlign: 'center', padding: '40px' }}>
                <div className="spinner" style={{ margin: '0 auto 12px' }} />
                <p style={{ color: '#64748b' }}>Filtering matching influencers...</p>
              </div>
            ) : matchedInfluencers.length === 0 ? (
              <div className="empty-state" style={{ padding: '40px 20px' }}>
                
                <h4>No unassigned influencers found for this exact area</h4>
                <p>Check the main directory to onboard or verify more creators.</p>
              </div>
            ) : (
              <div style={{ maxHeight: '420px', overflowY: 'auto' }}>
                {matchedInfluencers.map((inf) => {
                  const isSelected = selectedInfluencers.some((item) => item._id === inf._id);
                  const views = inf.verifiedViews || inf.averageViews || 1000;
                  return (
                    <div
                      key={inf._id}
                      onClick={() => handleToggleSelect(inf)}
                      style={{
                        padding: '14px 20px',
                        borderBottom: '1px solid #f1f5f9',
                        background: isSelected ? '#ecfdf5' : 'white',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        cursor: 'pointer',
                        transition: 'background 0.15s',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => {}} // handled by parent onClick
                          style={{ width: '18px', height: '18px', accentColor: '#059669' }}
                        />
                        <div>
                          <strong>{inf.userId?.name}</strong>
                          <div style={{ fontSize: '12px', color: '#64748b' }}>
                             {inf.area}, {inf.state} • Score: {inf.reliabilityScore || 100}%
                          </div>
                        </div>
                      </div>

                      <div style={{ textAlign: 'right' }}>
                        <div style={{ fontWeight: '800', color: '#059669', fontSize: '15px' }}>
                          {Number(views).toLocaleString()} views
                        </div>
                        <div style={{ fontSize: '11px', color: '#94a3b8' }}>
                          Verified Tier
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          <div className="card-footer" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ fontSize: '13px', color: '#64748b' }}>
              {selectedInfluencers.length} influencers selected (+{Number(newlySelectedReach).toLocaleString()} reach)
            </div>
            <button
              onClick={handleAssignGigs}
              disabled={selectedInfluencers.length === 0}
              className="btn btn-primary"
            >
              Assign Gigs Now →
            </button>
          </div>
        </div>

        {/* Right Column: SECTION 38 - CAMPAIGN GIG TRACKING */}
        <div className="card">
          <div className="card-header">
            <div>
              <h3 style={{ fontSize: '1.2rem' }}> Distributed Gigs ({gigStats.total || 0})</h3>
              <p style={{ margin: 0, fontSize: '12px', color: '#64748b' }}>
                {gigStats.approved || 0} Completed • {gigStats.submitted || 0} In Review • {gigStats.assigned || 0} Awaiting Acceptance
              </p>
            </div>
          </div>

          <div className="card-body" style={{ padding: 0 }}>
            {gigs.length === 0 ? (
              <div className="empty-state" style={{ padding: '40px 20px' }}>
                
                <h4>No gigs assigned yet</h4>
                <p>Select matched influencers on the left and click "Assign Gigs Now".</p>
              </div>
            ) : (
              <div style={{ maxHeight: '480px', overflowY: 'auto' }}>
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Influencer</th>
                      <th>Views</th>
                      <th>Reward</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {gigs.map((g) => (
                      <tr key={g._id}>
                        <td>
                          <strong>{g.influencerId?.name}</strong>
                          <div style={{ fontSize: '11px', color: '#94a3b8' }}>#{g.gigNumber}</div>
                        </td>
                        <td>
                          <strong>{Number(g.assignedViews).toLocaleString()}</strong>
                        </td>
                        <td>
                          <span style={{ color: '#059669', fontWeight: '700' }}>
                            ₦{Number(g.reward).toLocaleString()}
                          </span>
                        </td>
                        <td>
                          {g.status === 'approved' && <span className="badge badge-success">✓ Completed</span>}
                          {g.status === 'submitted' && <span className="badge badge-warning"> In Review</span>}
                          {g.status === 'accepted' && <span className="badge badge-info">Active</span>}
                          {g.status === 'assigned' && <span className="badge badge-muted">Assigned</span>}
                          {g.status === 'declined' && <span className="badge badge-error">Declined</span>}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
