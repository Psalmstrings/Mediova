import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import DashboardLayout from '../../layouts/DashboardLayout';
import { getNotifications, markAllNotificationsRead, markNotificationRead } from '../../services/api';
import { toast } from '../../components/ui/Toast';

const typeConfig = {
  new_vendor:           { label: 'New Vendor',            color: '#2563eb', bg: '#eff6ff' },
  new_influencer:       { label: 'New Influencer',         color: '#059669', bg: '#ecfdf5' },
  influencer_verification: { label: 'Verification Needed', color: '#d97706', bg: '#fffbeb' },
  new_order:            { label: 'New Order',             color: '#7c3aed', bg: '#f5f3ff' },
  payment_required:     { label: 'Payment Required',      color: '#dc2626', bg: '#fef2f2' },
  gig_submitted:        { label: 'Gig Submitted',         color: '#0284c7', bg: '#f0f9ff' },
  gig_review:           { label: 'Gig Review',            color: '#ea580c', bg: '#fff7ed' },
  campaign_completed:   { label: 'Campaign Completed',    color: '#059669', bg: '#ecfdf5' },
  withdrawal_request:   { label: 'Withdrawal Request',    color: '#dc2626', bg: '#fef2f2' },
  system:               { label: 'System',                color: '#64748b', bg: '#f8fafc' },
};

function timeAgo(date) {
  const seconds = Math.floor((Date.now() - new Date(date)) / 1000);
  if (seconds < 60) return 'Just now';
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  if (seconds < 604800) return `${Math.floor(seconds / 86400)}d ago`;
  return new Date(date).toLocaleDateString('en-NG', { day: 'numeric', month: 'short' });
}

const actionLink = (notif) => {
  const ref = notif.referenceId;
  switch (notif.type) {
    case 'new_influencer':
    case 'influencer_verification': return ref ? `/admin/influencers/${ref}` : '/admin/influencers';
    case 'new_vendor': return ref ? `/admin/vendors/${ref}` : '/admin/vendors';
    case 'new_order':
    case 'payment_required': return ref ? `/admin/campaigns/${ref}` : '/admin/campaigns';
    case 'gig_submitted':
    case 'gig_review': return '/admin/submissions';
    case 'campaign_completed': return ref ? `/admin/campaigns/${ref}` : '/admin/campaigns';
    case 'withdrawal_request': return '/admin/earnings';
    default: return null;
  }
};

export default function AdminNotifications() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const { data } = await getNotifications();
      setNotifications(data.notifications || []);
    } catch {
      // Use mock data if API not available
      setNotifications([]);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAllRead = async () => {
    try {
      await markAllNotificationsRead();
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
      toast.success('All notifications marked as read.');
    } catch {
      toast.error('Failed to mark notifications as read.');
    }
  };

  const handleMarkRead = async (id) => {
    try {
      await markNotificationRead(id);
      setNotifications((prev) =>
        prev.map((n) => (n._id === id ? { ...n, read: true } : n))
      );
    } catch {}
  };

  const filtered = filter === 'unread'
    ? notifications.filter((n) => !n.read)
    : notifications;

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <DashboardLayout title="Notifications" role="admin">
      <div className="page-header">
        <div>
          <h2 className="page-title">Notifications</h2>
          <p className="page-subtitle">Stay updated on important activity across your platform.</p>
        </div>
        {unreadCount > 0 && (
          <button className="btn btn-outline" onClick={handleMarkAllRead}>
            Mark All Read
          </button>
        )}
      </div>

      {/* Filter tabs */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '24px' }}>
        {['all', 'unread'].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`btn btn-sm ${filter === f ? 'btn-primary' : 'btn-ghost'}`}
          >
            {f === 'all' ? `All (${notifications.length})` : `Unread (${unreadCount})`}
          </button>
        ))}
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '60px' }}>
          <div className="spinner" style={{ margin: '0 auto 16px' }} />
          <p style={{ color: '#64748b' }}>Loading notifications...</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="empty-state">
          
          <div className="empty-title">
            {filter === 'unread' ? 'No unread notifications' : 'No notifications yet'}
          </div>
          <div className="empty-desc">
            {filter === 'unread'
              ? 'You\'re all caught up!'
              : 'Platform activity will appear here.'}
          </div>
        </div>
      ) : (
        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
          {filtered.map((notif, idx) => {
            const cfg = typeConfig[notif.type] || typeConfig.system;
            const link = actionLink(notif);
            return (
              <div
                key={notif._id || idx}
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '16px',
                  padding: '20px 24px',
                  borderBottom: idx < filtered.length - 1 ? '1px solid var(--border-light)' : 'none',
                  background: notif.read ? 'transparent' : '#fafffe',
                  transition: 'background 0.2s',
                }}
              >
                {/* Dot */}
                <div style={{
                  width: '8px', height: '8px', borderRadius: '50%',
                  background: notif.read ? 'transparent' : 'var(--primary)',
                  marginTop: '6px', flexShrink: 0,
                  border: notif.read ? '1px solid var(--border)' : 'none',
                }} />

                {/* Badge + content */}
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px', flexWrap: 'wrap' }}>
                    <span style={{
                      fontSize: '11px', fontWeight: '700', letterSpacing: '0.5px',
                      padding: '2px 8px', borderRadius: 'var(--radius-full)',
                      color: cfg.color, background: cfg.bg, textTransform: 'uppercase',
                    }}>
                      {cfg.label}
                    </span>
                    <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                      {timeAgo(notif.createdAt || new Date())}
                    </span>
                  </div>
                  <div style={{ fontWeight: notif.read ? '400' : '600', color: 'var(--text-primary)', marginBottom: '4px' }}>
                    {notif.title || notif.message || 'Platform notification'}
                  </div>
                  {notif.body && (
                    <div style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>
                      {notif.body}
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexShrink: 0 }}>
                  {link && (
                    <Link
                      to={link}
                      className="btn btn-sm btn-outline"
                      onClick={() => !notif.read && handleMarkRead(notif._id)}
                    >
                      View
                    </Link>
                  )}
                  {!notif.read && (
                    <button
                      className="btn btn-sm btn-ghost"
                      onClick={() => handleMarkRead(notif._id)}
                      title="Mark as read"
                    >
                      ✓
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </DashboardLayout>
  );
}
