import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { Platform } from 'react-native';
import DeviceInfo from 'react-native-device-info';

// Automatic BASE_URL detection for development
// For production, use: 'https://server.sevabazar.com'
let baseURL = 'https://server.sevabazar.com';

if (__DEV__) {
  baseURL = (Platform.OS === 'android' && DeviceInfo.isEmulatorSync())
    ? 'http://10.0.2.2:8000'
    : 'http://192.168.137.1:8000';
}


const api = axios.create({
  baseURL: baseURL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  async config => {
    const tokenData = await AsyncStorage.getItem('token');
    const token = JSON.parse(tokenData);

    if (
      config.url !== '/customers/login' &&
      config.url !== '/customers/signup'
    ) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  error => {
    return Promise.reject(error);
  },
);

export { baseURL };

export default api;
