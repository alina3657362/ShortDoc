import axios, {type AxiosInstance, type InternalAxiosRequestConfig} from 'axios';
import {getToken} from './token.ts';

const baseURL = import.meta.env.DEV
  ? '/api/v1'
  : `${import.meta.env.VITE_API_URL}/api/v1`;
const requestTimeout = 60000;

export const createAPI = () : AxiosInstance => {
    const api = axios.create({
        baseURL,
        timeout: requestTimeout
    });

    api.interceptors.request.use(
        (config: InternalAxiosRequestConfig) => {
            const token = getToken();
            if (token && config.headers) {
                config.headers['Authorization'] = `Bearer ${token}`;
            }
            return config;
        }
    );

    return api;
};

