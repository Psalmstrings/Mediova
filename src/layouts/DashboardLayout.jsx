import { useState } from 'react';
import { NavLink, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const getInitials = (name = '') =>
  name.split(' ').slice(0, 2).map((n) => n[0]).join('').toUpperCase();

// ===== INFLUENCER SIDEBAR NAV (Clean, Professional, No icon overload) =====
const influencerNav = [
  { label: 'Dashboard', to: '/influencer/dashboard' },
  { label: 'Available Gigs', to: '/influencer/gigs' },
  { label: 'Earnings & Payouts', to: '/influencer/earnings' },
  { label: 'Notifications', to: '/influencer/notifications', notif: true },
  { label: 'Profile & Reach', to: '/influencer/profile' },
];

// ===== VENDOR SIDEBAR NAV =====
const vendorNav = [
  { label: 'Dashboard', to: '/vendor/dashboard' },
  { label: 'Place Advertisement', to: '/vendor/advertise', highlight: true },
  { label: 'My Orders', to: '/vendor/orders' },
  { label: 'Notifications', to: '/vendor/notifications', notif: true },
  { label: 'Account Profile', to: '/vendor/profile' },
];

// ===== ADMIN SIDEBAR NAV =====
const adminNav = [
  { section: 'Overview' },
  { label: 'Dashboard', to: '/admin/dashboard' },
  { label: 'Notifications', to: '/admin/notifications', notif: true },
  { section: 'Broker Operations' },
  { label: 'Orders', to: '/admin/orders' },
  { label: 'Campaigns', to: '/admin/campaigns' },
  { label: 'Gigs', to: '/admin/gigs' },
  { label: 'Proof Submissions', to: '/admin/submissions' },
  { section: 'Marketplace Users' },
  { label: 'Influencers', to: '/admin/influencers' },
  { label: 'Vendors', to: '/admin/vendors' },
  { label: 'All Users', to: '/admin/users' },
  { section: 'Finance & Config' },
  { label: 'Payments & Payouts', to: '/admin/payments' },
  { label: 'Categories', to: '/admin/categories' },
  { label: 'Reach Packages', to: '/admin/packages' },
  { label: 'Platform Settings', to: '/admin/settings' },
];

const NavItems = ({ items, unreadCount, onNavClick }) => (
  <>
    {items.map((item, i) => {
      if (item.section) {
        return (
          <div key={i} className="nav-section-label">{item.section}</div>
        );
      }
      return (
        <NavLink
          key={i}
          to={item.to}
          onClick={onNavClick}
          className={({ isActive }) => `nav-item${isActive ? ' active' : ''}${item.highlight ? ' nav-highlight' : ''}`}
        >
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
  const { user, logout, unreadCount } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const activeRole = role || user?.role || 'vendor';
  const navMap = { influencer: influencerNav, vendor: vendorNav, admin: adminNav };
  const navItems = navMap[activeRole] || [];

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const roleLabel = { admin: 'Administrator', influencer: 'WhatsApp Influencer', vendor: 'Advertiser' };

  return (
    <div className="dashboard-layout">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div className="sidebar-overlay" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <aside className={`sidebar${sidebarOpen ? ' open' : ''}`}>
        <div className="sidebar-header">
          <Link to="/" className="sidebar-brand">
            <span className="brand-dot"></span>
            <span className="brand-name">MEDIOVA</span>
          </Link>
          <button className="sidebar-close-btn" onClick={() => setSidebarOpen(false)} aria-label="Close menu">
            &times;
          </button>
        </div>

        <nav className="sidebar-nav">
          <NavItems items={navItems} unreadCount={unreadCount} onNavClick={() => setSidebarOpen(false)} />
        </nav>

        <div className="sidebar-footer">
          <div className="sidebar-user" onClick={() => navigate(`/${activeRole}/profile`)}>
            <div className="sidebar-avatar">
              {user?.profileImage
                ? <img src={user.profileImage} alt={user.name} />
                : getInitials(user?.name)}
            </div>
            <div className="sidebar-user-info">
              <div className="sidebar-username">{user?.name || 'User'}</div>
              <div className="sidebar-role">{roleLabel[user?.role] || user?.role}</div>
            </div>
          </div>
          <button
            className="btn btn-ghost btn-sm btn-block logout-btn"
            onClick={handleLogout}
          >
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Container */}
      <div className="main-content">
        {/* Topbar */}
        <header className="topbar">
          <div className="topbar-left">
            <button
              className="hamburger"
              onClick={() => setSidebarOpen(!sidebarOpen)}
              aria-label="Toggle navigation"
            >
              <span className="hamburger-line"></span>
              <span className="hamburger-line"></span>
              <span className="hamburger-line"></span>
            </button>
            <h1 className="topbar-title">{title}</h1>
          </div>

          <div className="topbar-right">
            <NavLink
              to={`/${activeRole}/notifications`}
              className="notif-btn"
              title="Notifications"
            >
              <span className="notif-icon-label">Alerts</span>
              {unreadCount > 0 && (
                <span className="notif-dot">{unreadCount > 9 ? '9+' : unreadCount}</span>
              )}
            </NavLink>

            <div
              className="user-badge"
              onClick={() => navigate(`/${activeRole}/profile`)}
              title="View Profile"
            >
              <div className="sidebar-avatar avatar-sm">
                {user?.profileImage
                  ? <img src={user.profileImage} alt={user.name} />
                  : getInitials(user?.name)}
              </div>
              <span className="user-badge-name">{user?.name?.split(' ')[0]}</span>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="page-content">
          {children}
        </main>
      </div>
    </div>
  );
}
