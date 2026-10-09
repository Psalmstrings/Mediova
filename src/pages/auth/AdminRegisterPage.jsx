import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { registerAdmin } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { toast } from '../../components/ui/Toast';

export default function AdminRegisterPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    inviteSecret: '',
  });
  const [loading, setLoading] = useState(false);
  const { saveSession } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data } = await registerAdmin(formData);
      if (data.success) {
        saveSession(data.user, data.token);
        toast.success('Admin account created successfully!');
        navigate('/admin');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Admin setup failed. Check the invitation secret.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-side" style={{ background: '#090d16' }}>
        <div className="auth-side-logo" style={{ color: '#10b981' }}> DOPtv Admin</div>
        <h2>Brokerage Controller Setup</h2>
        <p>Restricted administrative registration for marketplace operations managers.</p>
      </div>

      <div className="auth-form-side">
        <div className="auth-form-container">
          <div className="auth-form-header">
            <Link to="/" style={{ color: '#059669', fontWeight: '800', fontSize: '18px', display: 'inline-block', marginBottom: '12px' }}>
              ← DOPtv Home
            </Link>
            <h1>Admin Authorization</h1>
            <p>Enter administrative details and secret invite key</p>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Admin Full Name <span className="required">*</span></label>
              <input
                type="text"
                required
                className="form-control"
                placeholder="e.g. Chief Broker"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Official Admin Email <span className="required">*</span></label>
              <input
                type="email"
                required
                className="form-control"
                placeholder="admin@doptv.ng"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Password <span className="required">*</span></label>
              <input
                type="password"
                required
                className="form-control"
                placeholder="Min. 6 characters"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Admin Registration Secret <span className="required">*</span></label>
              <input
                type="password"
                required
                className="form-control"
                placeholder="Configured server secret"
                value={formData.inviteSecret}
                onChange={(e) => setFormData({ ...formData, inviteSecret: e.target.value })}
              />
              <span className="form-hint">Matches ADMIN_INVITE_SECRET in server environment.</span>
            </div>

            <button type="submit" className="btn btn-primary btn-block btn-lg" disabled={loading} style={{ marginTop: '20px' }}>
              {loading ? 'Authorizing...' : 'Create Admin Account'}
            </button>
          </form>

          <div className="auth-link">
            Already authorized? <Link to="/login">Sign In</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
