import React, { useState, useEffect } from 'react';
import DashboardLayout from '../../layouts/DashboardLayout';
import {
  adminGetPackages,
  adminCreatePackage,
  adminUpdatePackage,
  adminDeletePackage,
} from '../../services/api';
import { toast } from '../../components/ui/Toast';

export default function AdminPackages() {
  const [loading, setLoading] = useState(true);
  const [packages, setPackages] = useState([]);
  const [modal, setModal] = useState({ open: false, isEdit: false, id: null, name: '', minimumViews: 1000, price: 5000, description: '', status: 'active', displayOrder: 0 });

  useEffect(() => {
    fetchPackages();
  }, []);

  const fetchPackages = async () => {
    try {
      setLoading(true);
      const { data } = await adminGetPackages();
      setPackages(data.packages || []);
    } catch (err) {
      toast.error('Failed to load packages.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (modal.isEdit) {
        await adminUpdatePackage(modal.id, {
          name: modal.name,
          minimumViews: Number(modal.minimumViews),
          price: Number(modal.price),
          description: modal.description,
          status: modal.status,
          displayOrder: Number(modal.displayOrder),
        });
        toast.success('Package updated!');
      } else {
        await adminCreatePackage({
          name: modal.name,
          minimumViews: Number(modal.minimumViews),
          price: Number(modal.price),
          description: modal.description,
          status: modal.status,
          displayOrder: Number(modal.displayOrder),
        });
        toast.success('Package created!');
      }
      setModal({ open: false, isEdit: false, id: null, name: '', minimumViews: 1000, price: 5000, description: '', status: 'active', displayOrder: 0 });
      fetchPackages();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save package.');
    }
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Delete package "${name}"?`)) return;
    try {
      await adminDeletePackage(id);
      toast.success('Package deleted.');
      fetchPackages();
    } catch (err) {
      toast.error('Failed to delete package.');
    }
  };

  const handleToggleStatus = async (pkg) => {
    const next = pkg.status === 'active' ? 'inactive' : 'active';
    try {
      await adminUpdatePackage(pkg._id, { status: next });
      toast.success(`Package is now ${next}.`);
      fetchPackages();
    } catch (err) {
      toast.error('Failed to update package status.');
    }
  };

  return (
    <DashboardLayout title="Reach Packages" role="admin">
      <div className="page-header">
        <div>
          <h2 className="page-title">Advertising Reach Packages</h2>
          <p className="page-subtitle">Configure views tiers and pricing presented to vendors during order placement.</p>
        </div>
        <button
          className="btn btn-primary"
          onClick={() => setModal({ open: true, isEdit: false, id: null, name: '', minimumViews: 1000, price: 5000, description: '', status: 'active', displayOrder: packages.length })}
        >
          + Add New Package
        </button>
      </div>

      <div className="card">
        <div className="card-body" style={{ padding: 0 }}>
          {loading ? (
            <div style={{ textAlign: 'center', padding: '50px' }}>
              <div className="spinner" style={{ margin: '0 auto 12px' }} />
              <p style={{ color: '#64748b' }}>Loading packages...</p>
            </div>
          ) : packages.length === 0 ? (
            <div className="empty-state">
              
              <h3>No packages configured</h3>
            </div>
          ) : (
            <div className="table-wrapper" style={{ border: 'none', borderRadius: 0 }}>
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Package Name</th>
                    <th>Minimum Views</th>
                    <th>Price (NGN)</th>
                    <th>Status</th>
                    <th>Description</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {packages.map((pkg) => (
                    <tr key={pkg._id}>
                      <td>
                        <strong>{pkg.name}</strong>
                      </td>
                      <td>
                        <strong style={{ color: '#2563eb' }}>{Number(pkg.minimumViews).toLocaleString()} Views</strong>
                      </td>
                      <td>
                        <strong style={{ color: '#059669', fontSize: '15px' }}>₦{Number(pkg.price).toLocaleString()}</strong>
                      </td>
                      <td>
                        <button
                          onClick={() => handleToggleStatus(pkg)}
                          style={{ background: 'none', border: 'none', cursor: 'pointer' }}
                        >
                          <span className={`badge ${pkg.status === 'active' ? 'badge-success' : 'badge-error'}`}>
                            {pkg.status}
                          </span>
                        </button>
                      </td>
                      <td style={{ color: '#64748b', fontSize: '13px' }}>
                        {pkg.description || '—'}
                      </td>
                      <td>
                        <div style={{ display: 'flex', gap: '6px' }}>
                          <button
                            className="btn btn-sm btn-ghost"
                            onClick={() => setModal({ open: true, isEdit: true, id: pkg._id, name: pkg.name, minimumViews: pkg.minimumViews, price: pkg.price, description: pkg.description || '', status: pkg.status, displayOrder: pkg.displayOrder || 0 })}
                          >
                            Edit
                          </button>
                          <button
                            className="btn btn-sm btn-danger"
                            onClick={() => handleDelete(pkg._id, pkg.name)}
                          >
                            Delete
                          </button>
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

      {/* Package Modal */}
      {modal.open && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h3>{modal.isEdit ? 'Edit Package' : 'Create Reach Package'}</h3>
              <button className="btn-icon" onClick={() => setModal({ ...modal, open: false })}>✕</button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="modal-body">
                <div className="form-group">
                  <label className="form-label">Package Name <span className="required">*</span></label>
                  <input
                    type="text"
                    required
                    className="form-control"
                    placeholder="e.g. 10,000 Views"
                    value={modal.name}
                    onChange={(e) => setModal({ ...modal, name: e.target.value })}
                  />
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Minimum Views (Starts at 1,000) <span className="required">*</span></label>
                    <input
                      type="number"
                      required
                      min="1000"
                      className="form-control"
                      value={modal.minimumViews}
                      onChange={(e) => setModal({ ...modal, minimumViews: e.target.value })}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Price in Naira (₦) <span className="required">*</span></label>
                    <input
                      type="number"
                      required
                      min="0"
                      className="form-control"
                      value={modal.price}
                      onChange={(e) => setModal({ ...modal, price: e.target.value })}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Description (Optional)</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="e.g. High-reach campaign for growing businesses"
                    value={modal.description}
                    onChange={(e) => setModal({ ...modal, description: e.target.value })}
                  />
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Status</label>
                    <select
                      className="form-control"
                      value={modal.status}
                      onChange={(e) => setModal({ ...modal, status: e.target.value })}
                    >
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Display Order</label>
                    <input
                      type="number"
                      className="form-control"
                      value={modal.displayOrder}
                      onChange={(e) => setModal({ ...modal, displayOrder: e.target.value })}
                    />
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-ghost" onClick={() => setModal({ ...modal, open: false })}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  {modal.isEdit ? 'Save Changes' : 'Create Package'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
