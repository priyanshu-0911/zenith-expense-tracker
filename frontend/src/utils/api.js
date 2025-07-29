// frontend/src/utils/api.js

import axios from 'axios';

const api = axios.create({
  // Use the live API URL in production, or the relative path for local development
  baseURL: process.env.REACT_APP_API_URL || '/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

/*
  This interceptor runs before each request. It checks for a token
  in localStorage and adds it to the headers if it exists.
*/
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

export default api;