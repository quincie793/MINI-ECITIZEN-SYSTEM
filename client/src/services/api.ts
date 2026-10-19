import axios from 'axios';

const api = axios.create({
  // Hardcoded Render URL for production
  baseURL: 'https://mini-ecitizen-system.onrender.com/api', 
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;