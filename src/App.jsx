import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ProtectedRoute, GuestRoute } from './components/RouteGuards';
import { Toaster } from './components/ui/Toast';

// Public Pages
import LandingPage from './pages/public/LandingPage';
import HowItWorks from './pages/public/HowItWorks';
import ForInfluencers from './pages/public/ForInfluencers';
import ForVendors from './pages/public/ForVendors';
import FAQPage from './pages/public/FAQPage';
import ContactPage from './pages/public/ContactPage';
import TermsPage from './pages/public/TermsPage';
import PrivacyPage from './pages/public/PrivacyPage';
import NotFoundPage from './pages/public/NotFoundPage';

// Auth Pages
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import ForgotPasswordPage from './pages/auth/ForgotPasswordPage';
import ResetPasswordPage from './pages/auth/ResetPasswordPage';
import VerifyEmailPage from './pages/auth/VerifyEmailPage';
import AdminRegisterPage from './pages/auth/AdminRegisterPage';

// Influencer Pages
import InfluencerDashboard from './pages/influencer/Dashboard';
import InfluencerGigs from './pages/influencer/Gigs';
import InfluencerGigDetail from './pages/influencer/GigDetail';
import InfluencerEarnings from './pages/influencer/Earnings';
import InfluencerProfile from './pages/influencer/Profile';
import InfluencerNotifications from './pages/influencer/Notifications';

// Vendor Pages
import VendorDashboard from './pages/vendor/Dashboard';
import VendorPlaceAd from './pages/vendor/PlaceAd';
import VendorOrders from './pages/vendor/Orders';
import VendorOrderDetail from './pages/vendor/OrderDetail';
import VendorProfile from './pages/vendor/Profile';
import VendorNotifications from './pages/vendor/Notifications';

// Admin Pages
import AdminDashboard from './pages/admin/Dashboard';
import AdminInfluencers from './pages/admin/Influencers';
import AdminInfluencerDetail from './pages/admin/InfluencerDetail';
import AdminVendors from './pages/admin/Vendors';
import AdminVendorDetail from './pages/admin/VendorDetail';
import AdminCampaigns from './pages/admin/Campaigns';
import AdminCampaignDetail from './pages/admin/CampaignDetail';
import AdminGigSubmissions from './pages/admin/GigSubmissions';
import AdminEarnings from './pages/admin/Earnings';
import AdminCategories from './pages/admin/Categories';
import AdminPackages from './pages/admin/Packages';
import AdminSettings from './pages/admin/Settings';
import AdminUsers from './pages/admin/Users';
import AdminNotifications from './pages/admin/Notifications';
import AdminOrders from './pages/admin/Orders';
import AdminGigs from './pages/admin/Gigs';
import AdminGigDetail from './pages/admin/GigDetail';
import AdminPayments from './pages/admin/Payments';

import './index.css';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Toaster />
        <Routes>
          {/* Public */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/how-it-works" element={<HowItWorks />} />
          <Route path="/for-influencers" element={<ForInfluencers />} />
          <Route path="/influencers" element={<ForInfluencers />} />
          <Route path="/for-vendors" element={<ForVendors />} />
          <Route path="/businesses" element={<ForVendors />} />
          <Route path="/faq" element={<FAQPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/terms" element={<TermsPage />} />
          <Route path="/privacy" element={<PrivacyPage />} />

          {/* Auth */}
          <Route path="/login" element={<GuestRoute><LoginPage /></GuestRoute>} />
          <Route path="/register" element={<GuestRoute><RegisterPage /></GuestRoute>} />
          <Route path="/forgot-password" element={<GuestRoute><ForgotPasswordPage /></GuestRoute>} />
          <Route path="/reset-password" element={<ResetPasswordPage />} />
          <Route path="/verify-email" element={<VerifyEmailPage />} />
          <Route path="/admin-setup" element={<AdminRegisterPage />} />

          {/* Influencer Routes */}
          <Route path="/influencer" element={<ProtectedRoute role="influencer"><InfluencerDashboard /></ProtectedRoute>} />
          <Route path="/influencer/dashboard" element={<ProtectedRoute role="influencer"><InfluencerDashboard /></ProtectedRoute>} />
          <Route path="/influencer/gigs" element={<ProtectedRoute role="influencer"><InfluencerGigs /></ProtectedRoute>} />
          <Route path="/influencer/gigs/:id" element={<ProtectedRoute role="influencer"><InfluencerGigDetail /></ProtectedRoute>} />
          <Route path="/influencer/earnings" element={<ProtectedRoute role="influencer"><InfluencerEarnings /></ProtectedRoute>} />
          <Route path="/influencer/profile" element={<ProtectedRoute role="influencer"><InfluencerProfile /></ProtectedRoute>} />
          <Route path="/influencer/notifications" element={<ProtectedRoute role="influencer"><InfluencerNotifications /></ProtectedRoute>} />

          {/* Vendor Routes */}
          <Route path="/vendor" element={<ProtectedRoute role="vendor"><VendorDashboard /></ProtectedRoute>} />
          <Route path="/vendor/dashboard" element={<ProtectedRoute role="vendor"><VendorDashboard /></ProtectedRoute>} />
          <Route path="/vendor/place-ad" element={<ProtectedRoute role="vendor"><VendorPlaceAd /></ProtectedRoute>} />
          <Route path="/vendor/advertise" element={<ProtectedRoute role="vendor"><VendorPlaceAd /></ProtectedRoute>} />
          <Route path="/vendor/orders" element={<ProtectedRoute role="vendor"><VendorOrders /></ProtectedRoute>} />
          <Route path="/vendor/orders/:id" element={<ProtectedRoute role="vendor"><VendorOrderDetail /></ProtectedRoute>} />
          <Route path="/vendor/profile" element={<ProtectedRoute role="vendor"><VendorProfile /></ProtectedRoute>} />
          <Route path="/vendor/notifications" element={<ProtectedRoute role="vendor"><VendorNotifications /></ProtectedRoute>} />

          {/* Admin Routes */}
          <Route path="/admin" element={<ProtectedRoute role="admin"><AdminDashboard /></ProtectedRoute>} />
          <Route path="/admin/dashboard" element={<ProtectedRoute role="admin"><AdminDashboard /></ProtectedRoute>} />
          <Route path="/admin/users" element={<ProtectedRoute role="admin"><AdminUsers /></ProtectedRoute>} />
          <Route path="/admin/influencers" element={<ProtectedRoute role="admin"><AdminInfluencers /></ProtectedRoute>} />
          <Route path="/admin/influencers/:id" element={<ProtectedRoute role="admin"><AdminInfluencerDetail /></ProtectedRoute>} />
          <Route path="/admin/vendors" element={<ProtectedRoute role="admin"><AdminVendors /></ProtectedRoute>} />
          <Route path="/admin/vendors/:id" element={<ProtectedRoute role="admin"><AdminVendorDetail /></ProtectedRoute>} />
          <Route path="/admin/orders" element={<ProtectedRoute role="admin"><AdminOrders /></ProtectedRoute>} />
          <Route path="/admin/orders/:id" element={<ProtectedRoute role="admin"><AdminCampaignDetail /></ProtectedRoute>} />
          <Route path="/admin/campaigns" element={<ProtectedRoute role="admin"><AdminCampaigns /></ProtectedRoute>} />
          <Route path="/admin/campaigns/:id" element={<ProtectedRoute role="admin"><AdminCampaignDetail /></ProtectedRoute>} />
          <Route path="/admin/gigs" element={<ProtectedRoute role="admin"><AdminGigs /></ProtectedRoute>} />
          <Route path="/admin/gigs/:id" element={<ProtectedRoute role="admin"><AdminGigDetail /></ProtectedRoute>} />
          <Route path="/admin/submissions" element={<ProtectedRoute role="admin"><AdminGigSubmissions /></ProtectedRoute>} />
          <Route path="/admin/payments" element={<ProtectedRoute role="admin"><AdminPayments /></ProtectedRoute>} />
          <Route path="/admin/earnings" element={<ProtectedRoute role="admin"><AdminEarnings /></ProtectedRoute>} />
          <Route path="/admin/categories" element={<ProtectedRoute role="admin"><AdminCategories /></ProtectedRoute>} />
          <Route path="/admin/packages" element={<ProtectedRoute role="admin"><AdminPackages /></ProtectedRoute>} />
          <Route path="/admin/notifications" element={<ProtectedRoute role="admin"><AdminNotifications /></ProtectedRoute>} />
          <Route path="/admin/settings" element={<ProtectedRoute role="admin"><AdminSettings /></ProtectedRoute>} />

          {/* 404 Catch-All */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
