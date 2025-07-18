import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authService = {
  login: async (credentials) => {
    const response = await api.post('/auth/login', credentials);
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    return response.data;
  },
  
  register: async (userData) => {
    const response = await api.post('/auth/register', userData);
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    return response.data;
  },
  
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },
  
  getCurrentUser: () => {
    return JSON.parse(localStorage.getItem('user'));
  },
  
  getToken: () => {
    return localStorage.getItem('token');
  }
};

export const formService = {
  createForm: async (formData) => {
    const response = await api.post('/forms', formData);
    return response.data;
  },
  
  getForms: async () => {
    const response = await api.get('/forms');
    return response.data;
  },
  
  getForm: async (id) => {
    const response = await api.get(`/forms/${id}`);
    return response.data;
  },
  
  updateForm: async (id, formData) => {
    const response = await api.put(`/forms/${id}`, formData);
    return response.data;
  },
  
  deleteForm: async (id) => {
    const response = await api.delete(`/forms/${id}`);
    return response.data;
  }
};

export const responseService = {
  submitResponse: async (responseData) => {
    const response = await axios.post(`${API_URL}/responses`, responseData);
    return response.data;
  },
  
  getFormResponses: async (formId) => {
    const response = await api.get(`/responses/form/${formId}`);
    return response.data;
  },
  
  getDashboard: async () => {
    const response = await api.get('/responses/dashboard');
    return response.data;
  },

  exportFormResponses: async (formId, formTitle) => {
    const response = await api.get(`/responses/export/${formId}`, {
      responseType: 'blob'
    });
    
    // Create blob link to download
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `${formTitle}_responses.csv`);
    document.body.appendChild(link);
    link.click();
    link.remove();
    
    return response.data;
  }
};

export default api;
