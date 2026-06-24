import axios from 'axios';
import Cookies from 'js-cookie';
export const instance = axios.create({
  baseURL: `${process.env.REACT_APP_BACKEND_URL}/api/v1`,
  headers: {
    Authorization: `Bearer ${Cookies.get('token')}`,
  },
});

instance.interceptors.request.use((config) => {
  config.headers.Authorization = `Bearer ${Cookies.get('token')}`;
  return config;
});
