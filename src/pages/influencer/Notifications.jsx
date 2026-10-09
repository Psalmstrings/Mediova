import React, { useState, useEffect } from 'react';
import DashboardLayout from '../../layouts/DashboardLayout';
import { getNotifications, markNotificationRead, markAllNotificationsRead } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { toast } from '../../components/ui/Toast';

export default function InfluencerNotifications() {
  const [loading, setLoading] = useState(true);
  const { notifications, setNotifications, setUnreadCount } = useAuth();

  useEffect(() => {
    loadNotifications();
  }, []);

  const loadNotifications = async () => {
    try {
      setLoading(true);
      const { data } = await getNotifications();
      setNotifications(data.notifications || []);
      setUnreadCount(data.unreadCount || 0);
    } catch (err) {
      toast.error('Failed to load notifications.');
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAll = async () => {
    try {
      await markAllNotificationsRead();
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
      setUnreadCount(0);
      toast.success('All marked as read');
    } catch (err) {
      toast.error('Failed to mark read.');
    }
  };

  const handleMarkOne = async (id) => {
    try {
      await markNotificationRead(id);
      setNotifications((prev) => prev.map((n) => (n._id === id ? { ...n, read: true } : n)));
      setUnreadCount((c) => Math.max(0, c - 1));
    } catch {
      // silent
    }
  };

  return (
    <DashboardLayout title="Notifications" role="influencer">
      <div className="page-header">
        <div>
          <h2 className="page-title">Notifications</h2>
          <p className="page-subtitle">Gig alerts, review statuses, and payout confirmations.</p>
        </div>
        {notifications.length > 0 && (
          <button className="btn btn-sm btn-ghost" onClick={handleMarkAll}>
            ✓ Mark All Read
          </button>
        )}
      </div>

      <div className="card">
        <div className="card-body" style={{ padding: 0 }}>
          {loading ? (
            <div style={{ textAlign: 'center', padding: '40px' }}>
              <div className="spinner" style={{ margin: '0 auto 12px' }} />
              <p style={{ color: '#64748b' }}>Loading alerts...</p>
            </div>
          ) : notifications.length === 0 ? (
            <div className="empty-state" style={{ padding: '60px 20px' }}>
              
              <h3>No notifications right now</h3>
              <p>You'll receive alerts when gigs are assigned or earnings are approved.</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              {notifications.map((n) => (
                <div
                  key={n._id}
                  onClick={() => !n.read && handleMarkOne(n._id)}
                  style={{
                    padding: '16px 20px',
                    borderBottom: '1px solid #f1f5f9',
                    background: n.read ? 'white' : '#f0fdf4',
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '16px',
                    cursor: 'pointer',
                  }}
                >
                  <div style={{ fontSize: '24px', flexShrink: 0 }}>
                    {n.type === 'gig' ? '' : n.type === 'payment' ? '' : ''}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <strong style={{ fontSize: '14px', color: n.read ? '#334155' : '#065f46' }}>
                        {n.title}
                      </strong>
                      <span style={{ fontSize: '11px', color: '#94a3b8' }}>
                        {new Date(n.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <p style={{ margin: '4px 0 0', fontSize: '13px', color: '#64748b' }}>
                      {n.message}
                    </p>
                  </div>
                  {!n.read && (
                    <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#059669', flexShrink: 0, marginTop: '6px' }} />
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
