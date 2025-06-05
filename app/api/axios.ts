"use client";
import axios, { AxiosResponse } from "axios";

// Create axios instance with default config
const axiosInstance = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL || "https://api.example.com",
    headers: {
        "Content-Type": "application/json",
    },
    timeout: 10000,
});

// Add a request interceptor to add auth token to requests
axiosInstance.interceptors.request.use(
    (config: any) => {
        return config;
    },
    (error: any) => {
        return Promise.reject(error);
    }
);

// Add a response interceptor to handle common response issues
axiosInstance.interceptors.response.use(
    (response: AxiosResponse) => response,
    (error: any) => {
        return Promise.reject(error);
    }
);

export default axiosInstance; 