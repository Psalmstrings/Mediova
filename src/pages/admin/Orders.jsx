import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import DashboardLayout from '../../layouts/DashboardLayout';
import { adminGetCampaigns } from '../../services/api';
import { toast } from '../../components/ui/Toast';

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [paymentFilter, setPaymentFilter] = useState('');

  useEffect(() => {
    fetchOrders();
  }, []);

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

  const filtered = useMemo(() => {
    return orders.filter((o) => {
      const q = search.toLowerCase().trim();
      const matchSearch =
        !q ||
        o.orderNumber?.toLowerCase().includes(q) ||
        o.title?.toLowerCase().includes(q) ||
        o.category?.toLowerCase().includes(q) ||
        o.vendorId?.name?.toLowerCase().includes(q) ||
        o.vendorId?.email?.toLowerCase().includes(q) ||
        o.vendor?.businessName?.toLowerCase().includes(q);

      const matchStatus = !statusFilter || o.status === statusFilter;
      const matchPayment = !paymentFilter || o.paymentStatus === paymentFilter;

      return matchSearch && matchStatus && matchPayment;
    });
  }, [orders, search, statusFilter, paymentFilter]);

  // Summary Metrics
  const metrics = useMemo(() => {
    const totalOrders = orders.length;
    const paidOrders = orders.filter((o) => o.paymentStatus === 'confirmed');
    const awaitingPayment = orders.filter((o) => o.paymentStatus === 'submitted' || o.paymentStatus === 'unpaid');
    const totalRevenue = paidOrders.reduce((sum, o) => sum + (Number(o.price) || 0), 0);

    return { totalOrders, paidCount: paidOrders.length, awaitingCount: awaitingPayment.length, totalRevenue };
  }, [orders]);

  const getStatusBadge = (st) => {
    const map = {
      'Awaiting Payment': 'badge-warning',
      'Payment Confirmed': 'badge-info',
      'Under Review': 'badge-warning',
      'Approved': 'badge-info',
      'Influencers Assigned': 'badge-purple',
      'Active': 'badge-info',
      'Submitted for Vendor Review': 'badge-purple',
      'Completed': 'badge-success',
      'Rejected': 'badge-error',
      'Cancelled': 'badge-muted',
    };
    return <span className={`badge ${map[st] || 'badge-muted'}`}>{st}</span>;
  };

  const getPaymentBadge = (ps) => {
    if (ps === 'confirmed') {
      return <span className="badge badge-success">✓ Paid / Confirmed</span>;
    }
    if (ps === 'submitted') {
      return <span className="badge badge-warning">⏳ Awaiting Verification</span>;
    }
    if (ps === 'rejected') {
      return <span className="badge badge-error">✗ Receipt Rejected</span>;
    }
    return <span className="badge badge-error">Unpaid</span>;
  };

  return (
    <DashboardLayout title="Advertising Orders" role="admin">
      {/* Page Header */}
      <div className="page-header" style={{ marginBottom: '24px' }}>
        <div>
          <h2 className="page-title" style={{ fontSize: '1.6rem', fontWeight: '700', color: '#0f172a', margin: 0 }}>
            Advertising Orders
          </h2>
          <p className="page-subtitle" style={{ color: '#64748b', fontSize: '14px', marginTop: '4px' }}>
            Comprehensive overview of all vendor advertisement orders, payment audits, and campaign delivery workflows.
          </p>
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            type="button"
            onClick={fetchOrders}
            className="btn btn-ghost"
            style={{ borderRadius: '8px', fontSize: '13px' }}
          >
            ↻ Refresh
          </button>
          <Link to="/admin/campaigns" className="btn btn-primary" style={{ borderRadius: '8px' }}>
            Manage Campaigns →
          </Link>
        </div>
      </div>

      {/* KPI Stat Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 200px), 1fr))', gap: '16px', marginBottom: '24px' }}>
        <div className="card" style={{ padding: '20px' }}>
          <div style={{ fontSize: '12px', color: '#64748b', textTransform: 'uppercase', fontWeight: '600' }}>
            Total Orders Placed
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: '800', color: '#0f172a', marginTop: '6px' }}>
            {metrics.totalOrders}
          </div>
          <div style={{ fontSize: '12px', color: '#059669', marginTop: '4px' }}>
            Across all active vendors
          </div>
        </div>

        <div className="card" style={{ padding: '20px' }}>
          <div style={{ fontSize: '12px', color: '#64748b', textTransform: 'uppercase', fontWeight: '600' }}>
            Confirmed Paid Orders
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: '800', color: '#059669', marginTop: '6px' }}>
            {metrics.paidCount}
          </div>
          <div style={{ fontSize: '12px', color: '#64748b', marginTop: '4px' }}>
            Verified bank / card receipts
          </div>
        </div>

        <div className="card" style={{ padding: '20px' }}>
          <div style={{ fontSize: '12px', color: '#64748b', textTransform: 'uppercase', fontWeight: '600' }}>
            Awaiting Verification / Payment
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: '800', color: '#d97706', marginTop: '6px' }}>
            {metrics.awaitingCount}
          </div>
          <div style={{ fontSize: '12px', color: '#64748b', marginTop: '4px' }}>
            Requires admin payment audit
          </div>
        </div>

        <div className="card" style={{ padding: '20px' }}>
          <div style={{ fontSize: '12px', color: '#64748b', textTransform: 'uppercase', fontWeight: '600' }}>
            Total Verified Revenue
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: '800', color: '#0f172a', marginTop: '6px' }}>
            ₦{Number(metrics.totalRevenue).toLocaleString()}
          </div>
          <div style={{ fontSize: '12px', color: '#059669', marginTop: '4px' }}>
            Funds cleared to MEDIOVA
          </div>
        </div>
      </div>

      {/* Filter Toolbar Card */}
      <div className="card" style={{ padding: '18px 20px', marginBottom: '24px' }}>
        <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap', alignItems: 'center' }}>
          <div style={{ flex: 2, minWidth: '240px', position: 'relative' }}>
            <input
              type="text"
              className="form-control"
              placeholder="🔍 Search by Order #, Title, Category, or Vendor name..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{ height: '42px', borderRadius: '8px' }}
            />
            {search && (
              <button
                type="button"
                onClick={() => setSearch('')}
                style={{
                  position: 'absolute',
                  right: '10px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  color: '#94a3b8',
                  cursor: 'pointer',
                  fontWeight: 'bold',
                }}
              >
                ✕
              </button>
            )}
          </div>

          <div style={{ flex: 1, minWidth: '180px' }}>
            <select
              className="form-control"
              value={paymentFilter}
              onChange={(e) => setPaymentFilter(e.target.value)}
              style={{ height: '42px', borderRadius: '8px' }}
            >
              <option value="">All Payment Statuses</option>
              <option value="confirmed">✓ Confirmed (Paid)</option>
              <option value="submitted">⏳ Awaiting Verification</option>
              <option value="unpaid">Unpaid</option>
              <option value="rejected">Rejected Proof</option>
            </select>
          </div>

          <div style={{ flex: 1, minWidth: '180px' }}>
            <select
              className="form-control"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              style={{ height: '42px', borderRadius: '8px' }}
            >
              <option value="">All Campaign Statuses</option>
              <option value="Payment Confirmed">Payment Confirmed</option>
              <option value="Active">Active</option>
              <option value="Influencers Assigned">Influencers Assigned</option>
              <option value="Submitted for Vendor Review">Vendor Review</option>
              <option value="Completed">Completed</option>
              <option value="Awaiting Payment">Awaiting Payment</option>
              <option value="Rejected">Rejected</option>
              <option value="Cancelled">Cancelled</option>
            </select>
          </div>

          {(search || paymentFilter || statusFilter) && (
            <button
              type="button"
              className="btn btn-ghost"
              onClick={() => {
                setSearch('');
                setPaymentFilter('');
                setStatusFilter('');
              }}
              style={{ height: '42px', fontSize: '13px', color: '#dc2626' }}
            >
              Reset Filters
            </button>
          )}
        </div>
      </div>

      {/* Main Table Card */}
      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <div style={{ padding: '16px 20px', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3 style={{ margin: 0, fontSize: '1.05rem', color: '#0f172a', fontWeight: '700' }}>
            Order Records ({filtered.length})
          </h3>
          <span style={{ fontSize: '12px', color: '#64748b' }}>
            Showing {filtered.length} of {orders.length} total orders
          </span>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '60px' }}>
            <div className="spinner" style={{ margin: '0 auto 16px' }} />
            <p style={{ color: '#64748b' }}>Loading orders...</p>
          </div>
        ) : filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px 20px' }}>
            <div style={{ fontSize: '44px', marginBottom: '12px' }}>📦</div>
            <h4 style={{ margin: '0 0 6px', fontSize: '1.15rem', color: '#0f172a' }}>No orders found</h4>
            <p style={{ margin: 0, fontSize: '14px', color: '#64748b' }}>
              {search || paymentFilter || statusFilter
                ? 'Try adjusting your search criteria or resetting filters.'
                : 'Orders will appear here automatically when vendors submit advertising campaigns.'}
            </p>
          </div>
        ) : (
          <div className="table-wrapper" style={{ border: 'none', borderRadius: 0 }}>
            <table className="data-table">
              <thead>
                <tr>
                  <th style={{ width: '22%' }}>Campaign / Order</th>
                  <th style={{ width: '20%' }}>Vendor / Advertiser</th>
                  <th style={{ width: '15%' }}>Budget / Target</th>
                  <th style={{ width: '15%' }}>Payment Audit</th>
                  <th style={{ width: '13%' }}>Fulfillment Status</th>
                  <th style={{ width: '10%' }}>Date Placed</th>
                  <th style={{ width: '5%', textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((order) => {
                  return (
                    <tr key={order._id}>
                      {/* Campaign / Order */}
                      <td>
                        <div style={{ fontWeight: '700', color: '#0f172a', fontSize: '14px' }}>
                          {order.title}
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '4px', flexWrap: 'wrap' }}>
                          <span className="badge badge-info" style={{ fontSize: '11px', padding: '2px 6px' }}>
                            #{order.orderNumber}
                          </span>
                          <span className="badge badge-muted" style={{ fontSize: '11px', padding: '2px 6px' }}>
                            {order.category}
                          </span>
                        </div>
                      </td>

                      {/* Vendor / Advertiser */}
                      <td>
                        <div style={{ fontWeight: '600', color: '#1e293b' }}>
                          {order.vendorId?.name || order.vendor?.businessName || 'Advertiser'}
                        </div>
                        {order.vendorId?.email && (
                          <div style={{ fontSize: '12px', color: '#64748b', marginTop: '2px' }}>
                            {order.vendorId.email}
                          </div>
                        )}
                        {(order.vendorId?.whatsappNumber || order.vendorId?.phone) && (
                          <div style={{ fontSize: '11px', color: '#059669', fontWeight: '600', marginTop: '2px' }}>
                            WA: {order.vendorId.whatsappNumber || order.vendorId.phone}
                          </div>
                        )}
                      </td>

                      {/* Budget / Price */}
                      <td>
                        <div style={{ fontWeight: '800', color: '#0f172a', fontSize: '15px' }}>
                          {order.currency || '₦'}{Number(order.price || order.budget || 0).toLocaleString()}
                        </div>
                        <div style={{ fontSize: '12px', color: '#059669', fontWeight: '500', marginTop: '2px' }}>
                          {Number(order.requiredViews || 0).toLocaleString()} Views Target
                        </div>
                        <div style={{ fontSize: '11px', color: '#94a3b8' }}>
                          Duration: {order.duration || '24 Hours'}
                        </div>
                      </td>

                      {/* Payment Status */}
                      <td>
                        {getPaymentBadge(order.paymentStatus)}
                        {order.paymentReceipt?.url && (
                          <div style={{ fontSize: '11px', color: '#2563eb', marginTop: '4px' }}>
                            📄 Receipt Attached
                          </div>
                        )}
                      </td>

                      {/* Fulfillment Status */}
                      <td>
                        {getStatusBadge(order.status)}
                      </td>

                      {/* Date */}
                      <td style={{ color: '#475569', fontSize: '13px' }}>
                        <div>{new Date(order.createdAt).toLocaleDateString('en-GB')}</div>
                        <div style={{ fontSize: '11px', color: '#94a3b8' }}>
                          {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </div>
                      </td>

                      {/* Actions */}
                      <td style={{ textAlign: 'right' }}>
                        <Link
                          to={`/admin/campaigns/${order._id}`}
                          className="btn btn-sm btn-primary"
                          style={{ padding: '6px 14px', borderRadius: '6px', whiteSpace: 'nowrap' }}
                        >
                          View →
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
