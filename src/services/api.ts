
import axios from 'axios';

const API_BASE_URL = 'http://143.198.118.203:8100';
const API_USER = 'test';
const API_PASS = 'test2023';

// Create axios instance with basic auth
const api = axios.create({
  baseURL: API_BASE_URL,
  auth: {
    username: API_USER,
    password: API_PASS
  },
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});

// Error handling interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error.response || error);
    return Promise.reject(error);
  }
);

// Products API
export const productsApi = {
  getAll: async () => {
    const response = await api.get('/ejemplos/product_list_rest/');
    return response.data;
  },
  add: async (data: { product_name: string; product_price: number; product_image: string }) => {
    const response = await api.post('/ejemplos/product_add_rest/', data);
    return response.data;
  },
  update: async (data: { 
    product_id: number; 
    product_name: string; 
    product_price: number; 
    product_image: string;
    product_state: string;
  }) => {
    const response = await api.post('/ejemplos/product_edit_rest/', data);
    return response.data;
  },
  delete: async (product_id: number) => {
    const response = await api.post('/ejemplos/product_del_rest/', { product_id });
    return response.data;
  }
};

// Categories API
export const categoriesApi = {
  getAll: async () => {
    const response = await api.get('/ejemplos/category_list_rest/');
    return response.data;
  },
  add: async (data: { category_name: string }) => {
    const response = await api.post('/ejemplos/category_add_rest/', data);
    return response.data;
  },
  update: async (data: { 
    category_id: number; 
    category_name: string; 
    category_state: string;
  }) => {
    const response = await api.post('/ejemplos/category_edit_rest/', data);
    return response.data;
  },
  delete: async (category_id: number) => {
    const response = await api.post('/ejemplos/category_del_rest/', { category_id });
    return response.data;
  }
};

// Providers API
export const providersApi = {
  getAll: async () => {
    const response = await api.get('/ejemplos/provider_list_rest/');
    return response.data;
  },
  add: async (data: { 
    provider_name: string;
    provider_last_name: string;
    provider_mail: string;
    provider_state: string;
  }) => {
    const response = await api.post('/ejemplos/provider_add_rest/', data);
    return response.data;
  },
  update: async (data: { 
    provider_id: number;
    provider_name: string;
    provider_last_name: string;
    provider_mail: string;
    provider_state: string;
  }) => {
    const response = await api.post('/ejemplos/provider_edit_rest/', data);
    return response.data;
  },
  delete: async (provider_id: number) => {
    const response = await api.post('/ejemplos/provider_del_rest/', { provider_id });
    return response.data;
  }
};

export default api;
