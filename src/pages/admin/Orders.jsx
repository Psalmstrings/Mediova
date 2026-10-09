import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import DashboardLayout from '../../layouts/DashboardLayout';
import { adminGetCampaigns } from '../../services/api';
import { toast } from '../../components/ui/Toast';

const STATUS_COLORS = {
  'Awaiting Payment': { color: '#d97706', bg: '#fffbeb' },
  'Active':           { color: '#059669', bg: '#ecfdf5' },
  'Completed':        { color: '#2563eb', bg: '#eff6ff' },
  'Rejected':         { color: '#dc2626', bg: '#fef2f2' },
  'Cancelled':        { color: '#64748b', bg: '#f8fafc' },
  'Pending':          { color: '#7c3aed', bg: '#f5f3ff' },
};

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');

  useEffect(() => { fetchOrders(); }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const { data } = await adminGetCampaigns();
      setOrders(data.campaigns || []);
    } catch {
      toast.error('Failed to load orders.');
    } finally {
      setLoading(false);
    }
  };

  const filtered = orders.filter((o) => {
    const matchSearch = !search ||
      o.title?.toLowerCase().includes(search.toLowerCase()) ||
      o.vendor?.businessName?.toLowerCase().includes(search.toLowerCase());
    const matchStatus = !status || o.status === status;
    return matchSearch && matchStatus;
  });

  return (
    <DashboardLayout title="Orders" role="admin">
      <div className="page-header">
        <div>
          <h2 className="page-title">Advertising Orders</h2>
          <p className="page-subtitle">All vendor advertising orders and their current payment status.</p>
        </div>
        <Link to="/admin/campaigns" className="btn btn-primary">
          Manage Campaigns
        </Link>
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: '12px', marginBottom: '24px', flexWrap: 'wrap' }}>
        <input
          className="input"
          style={{ flex: 1, minWidth: '200px' }}
          placeholder="Search by title or vendor..."
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
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '60px' }}>
          <div className="spinner" style={{ margin: '0 auto 16px' }} />
          <p style={{ color: '#64748b' }}>Loading orders...</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="empty-state">
          
          <div className="empty-title">No orders found</div>
          <div className="empty-desc">Orders will appear here as vendors place advertisements.</div>
        </div>
      ) : (
        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th>Campaign / Order</th>
                <th>Vendor</th>
                <th>Budget</th>
                <th>Status</th>
                <th>Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((order) => {
                const sc = STATUS_COLORS[order.status] || STATUS_COLORS['Pending'];
                return (
                  <tr key={order._id}>
                    <td>
                      <div style={{ fontWeight: '600' }}>{order.title}</div>
                      <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{order.category}</div>
                    </td>
                    <td>{order.vendor?.businessName || '—'}</td>
                    <td style={{ fontWeight: '600' }}>₦{Number(order.budget || 0).toLocaleString()}</td>
                    <td>
                      <span style={{
                        padding: '3px 10px', borderRadius: 'var(--radius-full)',
                        fontSize: '12px', fontWeight: '600',
                        color: sc.color, background: sc.bg,
                      }}>
                        {order.status}
                      </span>
                    </td>
                    <td style={{ color: 'var(--text-muted)', fontSize: '13px' }}>
                      {new Date(order.createdAt).toLocaleDateString('en-NG')}
                    </td>
                    <td>
                      <Link to={`/admin/campaigns/${order._id}`} className="btn btn-sm btn-outline">
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
