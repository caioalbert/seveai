import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
});

// Interceptor para adicionar o token de autenticação
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Função auxiliar para tratar erros
const handleError = (error) => {
  console.error('API Error:', error.response || error);
  throw error;
};

// Autenticação
export const auth = {
  login: async (credentials) => {
    try {
      const response = await api.post('/auth/login', credentials);
      const { token, user } = response.data;
      localStorage.setItem('token', token);
      localStorage.setItem('role', user.role);  // Armazena a role no localStorage
      return response.data;
    } catch (error) {
      handleError(error);
    }
  },
  register: (userData) => api.post('/auth/register', userData).catch(handleError),
};

// Mesas
export const tables = {
  getAll: () => api.get('/tables').catch(handleError),
  create: (table) => api.post('/tables', table).catch(handleError),
  update: (id, table) => api.put(`/tables/${id}`, table).catch(handleError),
  delete: (id) => api.delete(`/tables/${id}`).catch(handleError),
};

// Usuários (Substitui waiters)
export const users = {
  getAllUsers: () => api.get('/users', { params: { role: 'waiter' } }).catch(handleError),
  create: (user) => api.post('/users', user).catch(handleError),
  update: (id, user) => api.put(`/users/${id}`, user).catch(handleError),
  delete: (id) => api.delete(`/users/${id}`).catch(handleError),
};

// Produtos
export const products = {
  getAll: () => api.get('/products').catch(handleError),
  create: (product) => api.post('/products', product).catch(handleError),
  update: (id, product) => api.put(`/products/${id}`, product).catch(handleError),
  delete: (id) => api.delete(`/products/${id}`).catch(handleError),
  updateStock: (id, stock) => api.put(`/products/${id}/stock`, { stock }).catch(handleError),  // Corrigido
};

// Pedidos
export const orders = {
  getAll: (params) => api.get('/orders', { params }).catch(handleError),
  create: (order) => api.post('/orders', order).catch(handleError),
  update: (id, order) => api.put(`/orders/${id}`, order).catch(handleError),
  delete: (id) => api.delete(`/orders/${id}`).catch(handleError),
  addItems: (id, items) => api.post(`/orders/${id}/items`, { products: items }).catch(handleError),  // Nova função
};

// Reservas
export const reservations = {
  getAll: () => api.get('/reservations').catch(handleError),
  create: (reservation) => api.post('/reservations', reservation).catch(handleError),
  update: (id, reservation) => api.put(`/reservations/${id}`, reservation).catch(handleError),
  delete: (id) => api.delete(`/reservations/${id}`).catch(handleError),
};

// Cozinha
export const kitchen = {
  getQueue: () => api.get('/kitchen/queue').catch(handleError),
  updateOrderItem: (id, item) => api.put(`/kitchen/item/${id}`, item).catch(handleError),
};

// Relatórios Financeiros
export const financialReports = {
  getDaily: () => api.get('/financial-reports/daily').catch(handleError),
  getWeekly: () => api.get('/financial-reports/weekly').catch(handleError),
  getCustom: (startDate, endDate) => api.get('/financial-reports/custom', {
    params: { startDate, endDate }
  }).catch(handleError),
};

export const restaurants = {
  getAll: () => api.get('/restaurants').catch(handleError),
  create: (restaurant) => api.post('/restaurants', restaurant).catch(handleError),
  update: (id, restaurant) => api.put(`/restaurants/${id}`, restaurant).catch(handleError),
  delete: (id) => api.delete(`/restaurants/${id}`).catch(handleError),
};

// Exportações individuais para manter compatibilidade
export const getTables = tables.getAll;
export const createTable = tables.create;
export const updateTable = tables.update;
export const deleteTable = tables.delete;

export const getUsers = users.getAllUsers;
export const createUser = users.create;
export const updateUser = users.update;
export const deleteUser = users.delete;

export const getProducts = products.getAll;
export const createProduct = products.create;
export const updateProduct = products.update;
export const deleteProduct = products.delete;
export const updateProductStock = products.updateStock;

export const getOrders = orders.getAll;
export const createOrder = orders.create;
export const updateOrder = orders.update;
export const deleteOrder = orders.delete;
export const addOrderItems = orders.addItems;

export const getReservations = reservations.getAll;
export const createReservation = reservations.create;
export const updateReservation = reservations.update;
export const deleteReservation = reservations.delete;

export const login = auth.login;
export const register = auth.register;

export const getDailyFinancialReport = financialReports.getDaily;
export const getWeeklyFinancialReport = financialReports.getWeekly;
export const getCustomFinancialReport = financialReports.getCustom;

export const getRestaurants = restaurants.getAll;
export const createRestaurant = restaurants.create;
export const updateRestaurant = restaurants.update;
export const deleteRestaurant = restaurants.delete;

export default {
  auth,
  tables,
  users,
  products,
  orders,
  reservations,
  kitchen,
  financialReports,
  restaurants
};
