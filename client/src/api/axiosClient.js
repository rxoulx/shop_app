import axios from 'axios';

const axiosClient = axios.create({
  baseURL: 'https://refactored-xylophone-xrppjwr77g46hvx6w-4000.app.github.dev/api',
  headers: { 'Content-Type': 'application/json' },
});

// Interceptor tu dong lay token tu localStorage dinh vao moi request
axiosClient.interceptors.request.use((config) => {
  const saved = localStorage.getItem('auth');
  if (saved) {
    try {
      const { token } = JSON.parse(saved);
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (e) {
      console.error('Loi parse auth tu localStorage:', e);
    }
  }
  return config;
});

export default axiosClient;
