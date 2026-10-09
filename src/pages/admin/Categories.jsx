import React, { useState, useEffect } from 'react';
import DashboardLayout from '../../layouts/DashboardLayout';
import {
  adminGetCategories,
  adminCreateCategory,
  adminUpdateCategory,
  adminDeleteCategory,
} from '../../services/api';
import { toast } from '../../components/ui/Toast';

export default function AdminCategories() {
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState([]);
  const [typeFilter, setTypeFilter] = useState('ad');

  // Create / Edit Modal
  const [modal, setModal] = useState({ open: false, isEdit: false, id: null, name: '', type: 'ad', description: '', status: 'active' });

  useEffect(() => {
    fetchCategories();
  }, [typeFilter]);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const { data } = await adminGetCategories({ type: typeFilter });
      setCategories(data.categories || []);
    } catch (err) {
      toast.error('Failed to load categories.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (modal.isEdit) {
        await adminUpdateCategory(modal.id, {
          name: modal.name,
          type: modal.type,
          description: modal.description,
          status: modal.status,
        });
        toast.success('Category updated!');
      } else {
        await adminCreateCategory({
          name: modal.name,
          type: modal.type,
          description: modal.description,
          status: modal.status,
        });
        toast.success('Category created!');
      }
      setModal({ open: false, isEdit: false, id: null, name: '', type: 'ad', description: '', status: 'active' });
      fetchCategories();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save category.');
    }
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Delete category "${name}"?`)) return;
    try {
      await adminDeleteCategory(id);
      toast.success('Category deleted.');
      fetchCategories();
    } catch (err) {
      toast.error('Failed to delete category.');
    }
  };

  const handleToggleStatus = async (cat) => {
    const next = cat.status === 'active' ? 'inactive' : 'active';
    try {
      await adminUpdateCategory(cat._id, { status: next });
      toast.success(`Category is now ${next}.`);
      fetchCategories();
    } catch (err) {
      toast.error('Failed to update status.');
    }
  };

  return (
    <DashboardLayout title="Category Management" role="admin">
      <div className="page-header">
        <div>
          <h2 className="page-title">Categories & Objectives</h2>
          <p className="page-subtitle">Manage dynamic advertising categories, influencer interests, and campaign goals.</p>
        </div>
        <button
          className="btn btn-primary"
          onClick={() => setModal({ open: true, isEdit: false, id: null, name: '', type: typeFilter, description: '', status: 'active' })}
        >
          + Add New Category
        </button>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '20px' }}>
        {[
          { key: 'ad', label: ' Advertisement Categories' },
          { key: 'influencer', label: ' Influencer Niche Categories' },
          { key: 'objective', label: ' Campaign Objectives' },
        ].map((t) => (
          <button
            key={t.key}
            onClick={() => setTypeFilter(t.key)}
            className={`btn btn-sm ${typeFilter === t.key ? 'btn-primary' : 'btn-ghost'}`}
            style={{ borderRadius: '20px' }}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="card">
        <div className="card-body" style={{ padding: 0 }}>
          {loading ? (
            <div style={{ textAlign: 'center', padding: '50px' }}>
              <div className="spinner" style={{ margin: '0 auto 12px' }} />
              <p style={{ color: '#64748b' }}>Loading categories...</p>
            </div>
          ) : categories.length === 0 ? (
            <div className="empty-state">
              
              <h3>No categories found</h3>
            </div>
          ) : (
            <div className="table-wrapper" style={{ border: 'none', borderRadius: 0 }}>
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Category Name</th>
                    <th>Type</th>
                    <th>Status</th>
                    <th>Description</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {categories.map((c) => (
                    <tr key={c._id}>
                      <td>
                        <strong>{c.name}</strong>
                      </td>
                      <td>
                        <span className="badge badge-muted">{c.type}</span>
                      </td>
                      <td>
                        <button
                          onClick={() => handleToggleStatus(c)}
                          style={{ background: 'none', border: 'none', cursor: 'pointer' }}
                        >
                          <span className={`badge ${c.status === 'active' ? 'badge-success' : 'badge-error'}`}>
                            {c.status}
                          </span>
                        </button>
                      </td>
                      <td style={{ color: '#64748b', fontSize: '13px' }}>
                        {c.description || '—'}
                      </td>
                      <td>
                        <div style={{ display: 'flex', gap: '6px' }}>
                          <button
                            className="btn btn-sm btn-ghost"
                            onClick={() => setModal({ open: true, isEdit: true, id: c._id, name: c.name, type: c.type, description: c.description || '', status: c.status })}
                          >
                            Edit
                          </button>
                          <button
                            className="btn btn-sm btn-danger"
                            onClick={() => handleDelete(c._id, c.name)}
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

      {/* Modal */}
      {modal.open && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h3>{modal.isEdit ? 'Edit Category' : 'Create New Category'}</h3>
              <button className="btn-icon" onClick={() => setModal({ ...modal, open: false })}>✕</button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="modal-body">
                <div className="form-group">
                  <label className="form-label">Name <span className="required">*</span></label>
                  <input
                    type="text"
                    required
                    className="form-control"
                    value={modal.name}
                    onChange={(e) => setModal({ ...modal, name: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Type</label>
                  <select
                    className="form-control"
                    value={modal.type}
                    onChange={(e) => setModal({ ...modal, type: e.target.value })}
                  >
                    <option value="ad">Advertisement Category</option>
                    <option value="influencer">Influencer Category</option>
                    <option value="objective">Campaign Objective</option>
                  </select>
                </div>

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
                  <label className="form-label">Description (Optional)</label>
                  <input
                    type="text"
                    className="form-control"
                    value={modal.description}
                    onChange={(e) => setModal({ ...modal, description: e.target.value })}
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-ghost" onClick={() => setModal({ ...modal, open: false })}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  {modal.isEdit ? 'Save Changes' : 'Create Category'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
