import axios from 'axios';
import Cookies from 'js-cookie';

export const instance = axios.create({
  baseURL: `${process.env.REACT_APP_BACKEND_URL}/api/v1`,
});

instance.interceptors.request.use((config) => {
  // Try reading from cookie first
  let token = Cookies.get('token');
  
  // If not in cookie, check localStorage (legacy support or direct access)
  if (!token) {
    token = localStorage.getItem('token');
  }

  if (token && token !== 'undefined' && token !== 'null') {
    config.headers.Authorization = `Bearer ${token}`;
  }
  
  // Prevent aggressive browser caching of GET requests
  if (config.method.toLowerCase() === 'get') {
    config.headers['Cache-Control'] = 'no-cache, no-store, must-revalidate';
    config.headers['Pragma'] = 'no-cache';
    config.headers['Expires'] = '0';
  }
  
  return config;
});
