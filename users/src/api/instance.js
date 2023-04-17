import axios from 'axios';
import Cookies from 'js-cookie';
export const instance = axios.create({
  baseURL: 'http://localhost:5000',
//   headers: {
//     Authorization: `Bearer ${Cookies.get('token')}`,
//   },
});

// instance.interceptors.request.use((config) => {
//   config.headers.Authorization = `Bearer ${Cookies.get('token')}`;
//   return config;
// });
