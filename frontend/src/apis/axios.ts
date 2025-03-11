// src/api/axios.ts
import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// axiosInstance.interceptors.request.use(config => {
//   // e.g. attach auth tokens
//   return config;
// });

export default axiosInstance;
