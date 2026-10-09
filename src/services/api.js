import axios from 'axios';

const API = axios.create({
  baseURL: 'https://mediova-backend.onrender.com/api',
  headers: { 'Content-Type': 'application/json' },
  timeout: 30000,
});

// Attach token from localStorage
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('mediova_token') || localStorage.getItem('doptv_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle 401 globally
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('mediova_token');
      localStorage.removeItem('mediova_user');
      localStorage.removeItem('doptv_token');
      localStorage.removeItem('doptv_user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// =====================
// AUTH
// =====================
export const register = (data) => API.post('/auth/register', data);
export const login = (data) => API.post('/auth/login', data);
export const verifyEmail = (data) => API.post('/auth/verify-email', data);
export const resendVerification = (data) => API.post('/auth/resend-verification', data);
export const forgotPassword = (data) => API.post('/auth/forgot-password', data);
export const resetPassword = (data) => API.post('/auth/reset-password', data);
export const getMe = () => API.get('/auth/me');
export const registerAdmin = (data) => API.post('/auth/admin-register', data);

// =====================
// INFLUENCER
// =====================
export const getInfluencerProfile = () => API.get('/influencers/profile');
export const updateInfluencerProfile = (data) => API.put('/influencers/profile', data);
export const updateAvailability = (data) => API.patch('/influencers/availability', data);
export const updateBankDetails = (data) => API.put('/influencers/bank-details', data);
export const submitReachProof = (formData) =>
  API.post('/influencers/reach-proof', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
export const getMyGigs = (params) => API.get('/influencers/gigs', { params });
export const getGigDetails = (id) => API.get(`/influencers/gigs/${id}`);
export const acceptGig = (id) => API.put(`/influencers/gigs/${id}/accept`);
export const declineGig = (id, data) => API.put(`/influencers/gigs/${id}/decline`, data);
export const submitGigProof = (id, formData) =>
  API.post(`/influencers/gigs/${id}/submit`, formData, { headers: { 'Content-Type': 'multipart/form-data' } });
export const getMyEarnings = () => API.get('/influencers/earnings');

// =====================
// VENDOR
// =====================
export const getVendorProfile = () => API.get('/vendors/profile');
export const updateVendorProfile = (data) => API.put('/vendors/profile', data);
export const getOrderOptions = () => API.get('/vendors/order-options');
export const createCampaign = (formData) =>
  API.post('/vendors/campaigns', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
export const getMyCampaigns = (params) => API.get('/vendors/campaigns', { params });
export const getVendorCampaign = (id) => API.get(`/vendors/campaigns/${id}`);

// =====================
// ADMIN
// =====================
export const adminGetDashboard = () => API.get('/admin/dashboard');
export const adminGetUsers = (params) => API.get('/admin/users', { params });
export const adminUpdateUserStatus = (id, data) => API.patch(`/admin/users/${id}/status`, data);
export const adminGetInfluencers = (params) => API.get('/admin/influencers', { params });
export const adminMatchInfluencers = (params) => API.get('/admin/influencers/match', { params });
export const adminGetInfluencer = (id) => API.get(`/admin/influencers/${id}`);
export const adminVerifyInfluencer = (id, data) => API.patch(`/admin/influencers/${id}/verify`, data);
export const adminUpdateInfluencerAvailability = (id, data) => API.patch(`/admin/influencers/${id}/availability`, data);
export const adminGetVendors = (params) => API.get('/admin/vendors', { params });
export const adminGetVendorDetail = (id) => API.get(`/admin/vendors/${id}`);
export const adminGetCampaigns = (params) => API.get('/admin/campaigns', { params });
export const adminGetCampaign = (id) => API.get(`/admin/campaigns/${id}`);
export const adminUpdateCampaign = (id, data) => API.patch(`/admin/campaigns/${id}/status`, data);
export const adminGetGigs = (params) => API.get('/admin/gigs', { params });
export const adminGetGigDetail = (id) => API.get(`/admin/gigs/${id}`);
export const adminAssignGigs = (data) => API.post('/admin/gigs/assign', data);
export const adminReviewGig = (data) => API.post('/admin/gigs/review', data);
export const adminGetSubmissions = (params) => API.get('/admin/gigs/submissions', { params });
export const adminGetTransactions = (params) => API.get('/admin/transactions', { params });
export const adminGetEarnings = (params) => API.get('/admin/transactions', { params });
export const adminMarkPaid = (id, data) => API.patch(`/admin/transactions/${id}/pay`, data);
export const adminGetCategories = (params) => API.get('/admin/categories', { params });
export const adminCreateCategory = (data) => API.post('/admin/categories', data);
export const adminUpdateCategory = (id, data) => API.put(`/admin/categories/${id}`, data);
export const adminDeleteCategory = (id) => API.delete(`/admin/categories/${id}`);
export const adminGetPackages = () => API.get('/admin/packages');
export const adminCreatePackage = (data) => API.post('/admin/packages', data);
export const adminUpdatePackage = (id, data) => API.put(`/admin/packages/${id}`, data);
export const adminDeletePackage = (id) => API.delete(`/admin/packages/${id}`);
export const adminGetSettings = () => API.get('/admin/settings');
export const adminUpdateSettings = (data) => API.put('/admin/settings', data);

// =====================
// NOTIFICATIONS
// =====================
export const getNotifications = () => API.get('/notifications');
export const markNotificationRead = (id) => API.patch(`/notifications/${id}/read`);
export const markAllNotificationsRead = () => API.patch('/notifications/read-all');

export default API;
