import axios from "axios";

// Reusable axios instance
const api = axios.create({
  baseURL:import.meta.env.VITE_API_URL || "http://127.0.0.1:8000/api", // Laravel API endpoint
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
  }
});

// Optional: Add interceptor for auth tokens
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token'); // kunin sa login
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;

