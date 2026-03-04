import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8000',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        const refreshToken = localStorage.getItem('refresh_token');
        if (refreshToken) {
          const response = await axios.post('http://localhost:8000/api/token/refresh/', {
            refresh: refreshToken,
          });
          
          const { access } = response.data;
          localStorage.setItem('access_token', access);
          
          originalRequest.headers.Authorization = `Bearer ${access}`;
          return api(originalRequest);
        }
      } catch (refreshError) {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        window.location.href = '/login';
      }
    }
    
    return Promise.reject(error);
  }
);

export default api;

// API endpoints
export const authAPI = {
  login: (username, password) => api.post('/api/login/', { username, password }),
  register: (data) => api.post('/api/register/', data),
};

export const productsAPI = {
  getAll: () => api.get('/api/products/'),
  getById: (id) => api.get(`/api/products/${id}/`),
};

export const cartAPI = {
  getCart: () => api.get('/api/cart/'),
  addItem: (productId, quantity) => api.post('/api/cart/', { product_id: productId, quantity }),
  updateItem: (itemId, quantity) => api.put('/api/cart/', { item_id: itemId, quantity }),
  removeItem: (itemId) => api.delete('/api/cart/', { data: { item_id: itemId } }),
};

export const orderAPI = {
  placeOrder: () => api.post('/api/orders/place/'),
  getOrders: () => api.get('/api/orders/'),
  getOrderById: (id) => api.get(`/api/orders/${id}/`),
};

