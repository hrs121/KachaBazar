import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    try {
      if (typeof window !== 'undefined') {
        const token = localStorage.getItem('token');
        if (token && token !== 'undefined' && token !== 'null') {
          config.headers.Authorization = `Bearer ${token}`;
          console.log('Token added to request:', token.substring(0, 20) + '...');
        } else {
          console.log('No valid token found for request');
        }
      }
    } catch (error) {
      console.error('Error setting authorization header:', error);
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.log('API Error:', error.response?.status, error.config?.url, error.response?.data?.message);
    
    // Only redirect to login for 401 errors on critical auth routes (not cart/wishlist)
    if (error.response?.status === 401) {
      const url = error.config?.url || '';
      const isCriticalRoute = url.includes('/login') || url.includes('/register') || url.includes('/profile');
      
      if (isCriticalRoute) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        if (typeof window !== 'undefined') {
          window.location.href = '/login';
        }
      }
    }
    return Promise.reject(error);
  }
);

// Auth API functions
export const authAPI = {
  login: (credentials) => api.post('/users/login', credentials),
  register: (userData) => api.post('/users/register', userData),
  getProfile: () => api.get('/users/profile'),
  updateProfile: (data) => api.put('/users/profile', data),
  addAddress: (address) => api.post('/users/addresses', address),
};

// Products API functions
export const productsAPI = {
  getAllProducts: (params) => api.get('/products/all-products', { params }),
  getFeaturedProducts: (limit) => api.get(`/products/featured?limit=${limit}`),
  getProduct: (id) => api.get(`/products/product/${id}`),
  getMyProducts: (params) => api.get('/products/my-products', { params }),
  addProduct: (data) => api.post('/products/add-product', data),
  updateProduct: (id, data) => api.put(`/products/update-product/${id}`, data),
  deleteProduct: (id) => api.delete(`/products/delete-product/${id}`),
  toggleProductStatus: (id) => api.patch(`/products/toggle-status/${id}`),
  searchProducts: (params) => api.get('/products/search', { params }),
};

// Cart API functions
export const cartAPI = {
  getCart: () => api.get('/cart'),
  addToCart: (data) => api.post('/cart/add', data),
  updateCartItem: (productId, quantity) => api.put(`/cart/update/${productId}`, { quantity }),
  removeFromCart: (productId) => api.delete(`/cart/remove/${productId}`),
  clearCart: () => api.delete('/cart/clear'),
};

// Wishlist API functions
export const wishlistAPI = {
  getWishlist: () => api.get('/wishlist'),
  addToWishlist: (productId) => api.post('/wishlist/add', { productId }),
  removeFromWishlist: (productId) => api.delete(`/wishlist/remove/${productId}`),
  toggleWishlist: (productId) => api.post('/wishlist/toggle', { productId }),
  clearWishlist: () => api.delete('/wishlist/clear'),
};

// Orders API functions
export const ordersAPI = {
  createOrder: (data) => api.post('/orders/create', data),
  getMyOrders: (params) => api.get('/orders/my-orders', { params }),
  getOrder: (id) => api.get(`/orders/${id}`),
  updateOrderStatus: (id, data) => api.put(`/orders/${id}/status`, data),
  getSellerOrders: (params) => api.get('/orders/seller/orders', { params }),
  getAdminOrders: (params) => api.get('/orders/admin/all', { params }),
};

// Upload API functions
export const uploadAPI = {
  uploadImage: (formData) => api.post('/upload/image', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  }),
  uploadImages: (formData) => api.post('/upload/images', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  }),
  deleteImage: (filename) => api.delete(`/upload/image/${filename}`),
};

export default api;
