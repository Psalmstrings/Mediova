import React, { useState, useEffect } from 'react';
import DashboardLayout from '../../layouts/DashboardLayout';
import { adminGetUsers, adminUpdateUserStatus } from '../../services/api';
import { toast } from '../../components/ui/Toast';

export default function AdminUsers() {
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState([]);
  const [total, setTotal] = useState(0);
  const [roleFilter, setRoleFilter] = useState('');
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchUsers();
  }, [roleFilter]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const params = {
        role: roleFilter || undefined,
        search: search || undefined,
      };
      const { data } = await adminGetUsers(params);
      setUsers(data.users || []);
      setTotal(data.total || 0);
    } catch (err) {
      toast.error('Failed to load users.');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleStatus = async (user) => {
    const nextStatus = user.accountStatus === 'active' ? 'suspended' : 'active';
    try {
      const { data } = await adminUpdateUserStatus(user._id, { accountStatus: nextStatus });
      toast.success(data.message || `User ${nextStatus}`);
      setUsers(users.map((u) => (u._id === user._id ? { ...u, accountStatus: nextStatus } : u)));
    } catch (err) {
      toast.error('Failed to change user status.');
    }
  };

  return (
    <DashboardLayout title="User Management" role="admin">
      <div className="page-header">
        <div>
          <h2 className="page-title">All Platform Users ({total})</h2>
          <p className="page-subtitle">Inspect registered influencers, vendors, and manage account statuses.</p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="card" style={{ padding: '16px', marginBottom: '20px' }}>
        <form
          onSubmit={(e) => { e.preventDefault(); fetchUsers(); }}
          style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'center' }}
        >
          <input
            type="text"
            className="form-control"
            placeholder="Search by name or email..."
            style={{ flex: 1, minWidth: '220px' }}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <select
            className="form-control"
            style={{ width: '180px' }}
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
          >
            <option value="">All Roles</option>
            <option value="influencer">Influencers Only</option>
            <option value="vendor">Vendors Only</option>
            <option value="admin">Admins Only</option>
          </select>

          <button type="submit" className="btn btn-primary">Search</button>
        </form>
      </div>

      <div className="card">
        <div className="card-body" style={{ padding: 0 }}>
          {loading ? (
            <div style={{ textAlign: 'center', padding: '50px' }}>
              <div className="spinner" style={{ margin: '0 auto 12px' }} />
              <p style={{ color: '#64748b' }}>Loading users...</p>
            </div>
          ) : users.length === 0 ? (
            <div className="empty-state">
              
              <h3>No users found</h3>
            </div>
          ) : (
            <div className="table-wrapper" style={{ border: 'none', borderRadius: 0 }}>
              <table className="data-table">
                <thead>
                  <tr>
                    <th>User</th>
                    <th>Role</th>
                    <th>Email Status</th>
                    <th>Account Status</th>
                    <th>Registered</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((u) => (
                    <tr key={u._id}>
                      <td>
                        <strong>{u.name}</strong>
                        <div style={{ fontSize: '12px', color: '#64748b' }}>{u.email}</div>
                        {u.phone && <div style={{ fontSize: '11px', color: '#94a3b8' }}> {u.phone}</div>}
                      </td>
                      <td>
                        <span className={`badge ${u.role === 'admin' ? 'badge-purple' : u.role === 'vendor' ? 'badge-info' : 'badge-success'}`}>
                          {u.role.toUpperCase()}
                        </span>
                      </td>
                      <td>
                        {u.emailVerified ? (
                          <span style={{ color: '#059669', fontSize: '13px' }}>✓ Verified</span>
                        ) : (
                          <span style={{ color: '#d97706', fontSize: '13px' }}>Unverified</span>
                        )}
                      </td>
                      <td>
                        <span className={`badge ${u.accountStatus === 'active' ? 'badge-success' : 'badge-error'}`}>
                          {u.accountStatus}
                        </span>
                      </td>
                      <td style={{ fontSize: '13px', color: '#64748b' }}>
                        {new Date(u.createdAt).toLocaleDateString()}
                      </td>
                      <td>
                        {u.role !== 'admin' && (
                          <button
                            onClick={() => handleToggleStatus(u)}
                            className={`btn btn-sm ${u.accountStatus === 'active' ? 'btn-danger' : 'btn-success'}`}
                          >
                            {u.accountStatus === 'active' ? 'Suspend' : 'Activate'}
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
