import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { toast } from '../components/ui/Toast';

const getInitials = (name = '') =>
  name.split(' ').slice(0, 2).map((n) => n[0]).join('').toUpperCase();

// ===== INFLUENCER NAVIGATION =====
const influencerNav = [
  { label: 'Dashboard', to: '/influencer/dashboard', icon: '📊' },
  { label: 'Available Gigs', to: '/influencer/gigs', icon: '🎯' },
  { label: 'Earnings & Payouts', to: '/influencer/earnings', icon: '💰' },
  { label: 'Disputes & Appeals', to: '/influencer/complaints', icon: '⚖️' },
  { label: 'Notifications', to: '/influencer/notifications', icon: '🔔', notif: true },
  { label: 'Profile & Reach', to: '/influencer/profile', icon: '👤' },
  { section: 'Support & Guidance' },
  { label: 'Help & Support Desk', to: '/contact', icon: '💬' },
  { label: 'Platform FAQs', to: '/faq', icon: '❓' },
];

// ===== VENDOR NAVIGATION =====
const vendorNav = [
  { label: 'Dashboard', to: '/vendor/dashboard', icon: '📊' },
  { label: 'Place Advert', to: '/vendor/advertise', icon: '📢', highlight: true },
  { label: 'My Orders', to: '/vendor/orders', icon: '📦' },
  { label: 'Disputes & Appeals', to: '/vendor/complaints', icon: '⚖️' },
  { label: 'Notifications', to: '/vendor/notifications', icon: '🔔', notif: true },
  { label: 'Account Profile', to: '/vendor/profile', icon: '🏢' },
  { section: 'Support & Guidance' },
  { label: 'Help & Support Desk', to: '/contact', icon: '💬' },
  { label: 'Platform FAQs', to: '/faq', icon: '❓' },
];

// ===== ADMIN NAVIGATION =====
const adminNav = [
  { section: 'Overview' },
  { label: 'Dashboard', to: '/admin/dashboard', icon: '📊' },
  { label: 'Notifications', to: '/admin/notifications', icon: '🔔', notif: true },
  { section: 'Broker Operations' },
  { label: 'Orders', to: '/admin/orders', icon: '📦' },
  { label: 'Campaigns', to: '/admin/campaigns', icon: '📢' },
  { label: 'Gigs', to: '/admin/gigs', icon: '🎯' },
  { label: 'Proof Submissions', to: '/admin/submissions', icon: '📹' },
  { section: 'Marketplace Users' },
  { label: 'Influencers', to: '/admin/influencers', icon: '🌟' },
  { label: 'Vendors', to: '/admin/vendors', icon: '🏢' },
  { label: 'All Users', to: '/admin/users', icon: '👥' },
  { section: 'Finance & Governance' },
  { label: 'Payments & Payouts', to: '/admin/payments', icon: '💳' },
  { label: 'Refund Requests', to: '/admin/refunds', icon: '↩️' },
  { label: 'Complaints & Appeals', to: '/admin/complaints', icon: '⚖️' },
  { label: 'Support Inquiries', to: '/admin/support', icon: '📩' },
  { label: 'Categories', to: '/admin/categories', icon: '🏷️' },
  { label: 'Reach Packages', to: '/admin/packages', icon: '📦' },
  { label: 'Platform Settings', to: '/admin/settings', icon: '⚙️' },
];

const NavItems = ({ items, unreadCount, onNavClick }) => (
  <>
    {items.map((item, i) => {
      if (item.section) {
        return (
          <div key={i} className="nav-section-label">
            {item.section}
          </div>
        );
      }
      return (
        <NavLink
          key={i}
          to={item.to}
          onClick={onNavClick}
          className={({ isActive }) =>
            `nav-item${isActive ? ' active' : ''}${item.highlight ? ' nav-highlight' : ''}`
          }
        >
          {item.icon && <span className="nav-item-icon" style={{ marginRight: '8px', fontSize: '15px' }}>{item.icon}</span>}
          <span className="nav-item-text">{item.label}</span>
          {item.notif && unreadCount > 0 && (
            <span className="nav-badge">{unreadCount > 9 ? '9+' : unreadCount}</span>
          )}
        </NavLink>
      );
    })}
  </>
);

export default function DashboardLayout({ children, title, role }) {
  const { user, logout, unreadCount, switchActiveRole } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [switchingRole, setSwitchingRole] = useState(false);

  const activeRole = role || user?.role || 'vendor';
  const navMap = { influencer: influencerNav, vendor: vendorNav, admin: adminNav };
  const navItems = navMap[activeRole] || [];

  // Close sidebar on route change
  useEffect(() => {
    setSidebarOpen(false);
  }, [location.pathname, location.search]);

  // Close sidebar on Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && sidebarOpen) {
        setSidebarOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [sidebarOpen]);

  // Lock background scroll when drawer is open on mobile
  useEffect(() => {
    if (sidebarOpen) {
      document.body.style.overflow = 'hidden';
      document.body.style.touchAction = 'none';
    } else {
      document.body.style.overflow = '';
      document.body.style.touchAction = '';
    }
    return () => {
      document.body.style.overflow = '';
      document.body.style.touchAction = '';
    };
  }, [sidebarOpen]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleRoleSwitch = async (targetRole) => {
    if (switchingRole || targetRole === activeRole) return;
    setSwitchingRole(true);
    try {
      const res = await switchActiveRole(targetRole);
      if (res.success) {
        toast.success(`Switched to ${targetRole === 'vendor' ? 'Advertiser' : 'Influencer'} dashboard`);
        navigate(targetRole === 'vendor' ? '/vendor/dashboard' : '/influencer/dashboard');
      } else {
        toast.error(res.message || 'Failed to switch portal.');
      }
    } catch {
      toast.error('Failed to switch portal.');
    } finally {
      setSwitchingRole(false);
      setSidebarOpen(false);
    }
  };

  const roleLabel = { admin: 'Administrator', influencer: 'WhatsApp Influencer', vendor: 'Advertiser' };
  const userRoles = Array.isArray(user?.roles) && user.roles.length > 0 ? user.roles : [user?.role];
  const canSwitchToVendor = userRoles.includes('vendor') && activeRole !== 'vendor';
  const canSwitchToInfluencer = userRoles.includes('influencer') && activeRole !== 'influencer';

  return (
    <div className="dashboard-layout">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="sidebar-overlay"
          onClick={() => setSidebarOpen(false)}
          aria-label="Close navigation overlay"
        />
      )}

      {/* Left-Side Navigation Sidebar / Drawer */}
      <aside className={`sidebar${sidebarOpen ? ' open' : ''}`} aria-label="Dashboard navigation">
        <div className="sidebar-header">
          <Link to="/" className="sidebar-brand">
            <span className="brand-dot"></span>
            <span className="brand-name">MEDIOVA</span>
          </Link>
          <button
            type="button"
            className="sidebar-close-btn"
            onClick={() => setSidebarOpen(false)}
            aria-label="Close navigation menu"
          >
            ✕
          </button>
        </div>

        {/* Portal Switcher if enrolled in multiple roles */}
        {(canSwitchToVendor || canSwitchToInfluencer) && (
          <div style={{ padding: '10px 16px', background: 'rgba(255,255,255,0.04)', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
            <span style={{ fontSize: '11px', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: '700', display: 'block', marginBottom: '6px' }}>
              Enrolled Portals:
            </span>
            {canSwitchToVendor && (
              <button
                type="button"
                onClick={() => handleRoleSwitch('vendor')}
                className="btn btn-sm btn-ghost btn-block"
                style={{ fontSize: '12px', justifyContent: 'flex-start', color: '#10b981', padding: '6px 8px' }}
                disabled={switchingRole}
              >
                🔄 Switch to Advertiser Portal
              </button>
            )}
            {canSwitchToInfluencer && (
              <button
                type="button"
                onClick={() => handleRoleSwitch('influencer')}
                className="btn btn-sm btn-ghost btn-block"
                style={{ fontSize: '12px', justifyContent: 'flex-start', color: '#10b981', padding: '6px 8px' }}
                disabled={switchingRole}
              >
                🔄 Switch to Influencer Portal
              </button>
            )}
          </div>
        )}

        <nav className="sidebar-nav">
          <NavItems items={navItems} unreadCount={unreadCount} onNavClick={() => setSidebarOpen(false)} />
        </nav>

        <div className="sidebar-footer">
          <div className="sidebar-user" onClick={() => { setSidebarOpen(false); navigate(`/${activeRole}/profile`); }}>
            <div className="sidebar-avatar">
              {user?.profileImage ? (
                <img src={user.profileImage} alt={user?.name || 'User'} />
              ) : (
                getInitials(user?.name)
              )}
            </div>
            <div className="sidebar-user-info">
              <div className="sidebar-username">{user?.name || 'User'}</div>
              <div className="sidebar-role">{roleLabel[user?.role] || user?.role}</div>
            </div>
          </div>
          <button
            type="button"
            className="btn btn-ghost btn-sm btn-block logout-btn"
            onClick={handleLogout}
          >
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Container */}
      <div className="main-content">
        {/* Topbar Header */}
        <header className="topbar">
          <div className="topbar-left">
            <button
              type="button"
              className="hamburger"
              onClick={() => setSidebarOpen(!sidebarOpen)}
              aria-label="Toggle navigation drawer"
            >
              <span className="hamburger-line"></span>
              <span className="hamburger-line"></span>
              <span className="hamburger-line"></span>
            </button>
          </div>

          <div className="topbar-center">
            <h1 className="topbar-title" title={title}>{title}</h1>
          </div>

          <div className="topbar-right">
            <NavLink
              to={`/${activeRole}/notifications`}
              className="notif-btn"
              title="Notifications"
              aria-label={`Notifications, ${unreadCount} unread`}
            >
              <span className="notif-bell-icon">🔔</span>
              {unreadCount > 0 && (
                <span className="notif-dot">{unreadCount > 9 ? '9+' : unreadCount}</span>
              )}
            </NavLink>

            <div
              className="user-badge"
              onClick={() => navigate(`/${activeRole}/profile`)}
              title={`Signed in as ${user?.name || 'User'} (${user?.role})`}
            >
              <div className="sidebar-avatar avatar-sm">
                {user?.profileImage ? (
                  <img src={user.profileImage} alt={user?.name || 'User'} />
                ) : (
                  getInitials(user?.name)
                )}
              </div>
              <span className="user-badge-name">
                {user?.name ? user.name.split(' ')[0] : 'Account'}
              </span>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="page-content">{children}</main>
      </div>
    </div>
  );
}
