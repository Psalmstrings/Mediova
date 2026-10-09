import React, { useState, useEffect } from 'react';
import DashboardLayout from '../../layouts/DashboardLayout';
import { adminGetVendors } from '../../services/api';
import { toast } from '../../components/ui/Toast';

export default function AdminVendors() {
  const [loading, setLoading] = useState(true);
  const [vendors, setVendors] = useState([]);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState('');
  const [stateFilter, setStateFilter] = useState('');

  useEffect(() => {
    fetchVendors();
  }, [stateFilter]);

  const fetchVendors = async () => {
    try {
      setLoading(true);
      const params = {
        search: search || undefined,
        state: stateFilter || undefined,
      };
      const { data } = await adminGetVendors(params);
      setVendors(data.vendors || []);
      setTotal(data.total || 0);
    } catch (err) {
      toast.error('Failed to load vendors.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout title="Advertiser Directory" role="admin">
      <div className="page-header">
        <div>
          <h2 className="page-title">Registered Businesses & Vendors ({total})</h2>
          <p className="page-subtitle">Commercial clients placing WhatsApp advertising orders.</p>
        </div>
      </div>

      <div className="card" style={{ padding: '16px', marginBottom: '20px' }}>
        <form
          onSubmit={(e) => { e.preventDefault(); fetchVendors(); }}
          style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'center' }}
        >
          <input
            type="text"
            className="form-control"
            placeholder="Search business name or contact email..."
            style={{ flex: 1, minWidth: '220px' }}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <input
            type="text"
            className="form-control"
            placeholder="Filter State (e.g. Lagos)..."
            style={{ width: '180px' }}
            value={stateFilter}
            onChange={(e) => setStateFilter(e.target.value)}
          />

          <button type="submit" className="btn btn-primary">Filter</button>
        </form>
      </div>

      <div className="card">
        <div className="card-body" style={{ padding: 0 }}>
          {loading ? (
            <div style={{ textAlign: 'center', padding: '60px' }}>
              <div className="spinner" style={{ margin: '0 auto 16px' }} />
              <p style={{ color: '#64748b' }}>Loading vendors...</p>
            </div>
          ) : vendors.length === 0 ? (
            <div className="empty-state">
              
              <h3>No vendors found</h3>
            </div>
          ) : (
            <div className="table-wrapper" style={{ border: 'none', borderRadius: 0 }}>
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Business Name</th>
                    <th>Contact Person</th>
                    <th>Category</th>
                    <th>Location</th>
                    <th>Contact Info</th>
                    <th>Registered</th>
                  </tr>
                </thead>
                <tbody>
                  {vendors.map((v) => (
                    <tr key={v._id}>
                      <td>
                        <strong>{v.businessName}</strong>
                        {v.website && (
                          <div style={{ fontSize: '12px' }}>
                            <a href={v.website} target="_blank" rel="noreferrer" style={{ color: '#2563eb' }}>{v.website}</a>
                          </div>
                        )}
                      </td>
                      <td>
                        {v.contactPerson || v.userId?.name}
                      </td>
                      <td>
                        <span className="badge badge-muted">{v.businessCategory}</span>
                      </td>
                      <td>
                        {v.area ? `${v.area}, ` : ''}{v.state}
                      </td>
                      <td>
                        <div style={{ fontSize: '13px' }}>✉️ {v.userId?.email}</div>
                        {v.phone && <div style={{ fontSize: '12px', color: '#64748b' }}> {v.phone}</div>}
                        {v.whatsapp && <div style={{ fontSize: '12px', color: '#059669' }}> WA: {v.whatsapp}</div>}
                      </td>
                      <td style={{ fontSize: '13px', color: '#64748b' }}>
                        {new Date(v.createdAt).toLocaleDateString()}
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
