import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

const baseURL = 'https://server.sevabazar.com/'

const api = axios.create({
  baseURL: 'https://server.sevabazar.com/', // Use http and local IP for development
});

api.interceptors.request.use(
  async config => {
    const tokenData = await AsyncStorage.getItem('token');
    const token = JSON.parse(tokenData);

    if (config.url !== '/customers/login' && config.url !== '/customers/signup') {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  error => {
    return Promise.reject(error);
  },
);

export {baseURL}

export default api;
