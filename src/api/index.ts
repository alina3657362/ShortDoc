import axios, {type AxiosInstance, type InternalAxiosRequestConfig} from 'axios';
import {getToken} from './token.ts';

const baseURL = 'https://api/v1';
const requestTimeout = 15000;

export const createAPI = () : AxiosInstance => {
    const api = axios.create({
        baseURL: baseURL,
        timeout: requestTimeout
    });

    api.interceptors.request.use(
        (config : InternalAxiosRequestConfig) => {
            const token = getToken();

            if (token && config.headers){
                config.headers['Authorization'] = `Bearer ${token}`;
            }

            return config;
        }
    );

    return api;
};

