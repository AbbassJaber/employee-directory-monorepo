import axios, { AxiosInstance, AxiosResponse, AxiosError } from 'axios';
import { useAuthStore } from '@/stores/authStore';
import toast from 'react-hot-toast';

const API_URL = import.meta.env.VITE_API_URL;

interface ExtendedAxiosInstance extends AxiosInstance {
    _isLoggingOut?: boolean;
    isAttached?: boolean;
}

const api: ExtendedAxiosInstance = axios.create({
    baseURL: API_URL,
    timeout: 10000,
    withCredentials: true,
});

if (!api.isAttached) {
    let refreshTokenPromise: Promise<any> | null = null;
    api._isLoggingOut = false; // Flag to prevent logout loops

    // Request interceptor to add auth token
    api.interceptors.request.use(
        config => {
            const token = useAuthStore.getState().accessToken;
            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
            }

            return config;
        },
        error => {
            return Promise.reject(error);
        }
    );

    // Response interceptor to handle token refresh
    api.interceptors.response.use(
        (response: AxiosResponse) => {
            return response;
        },
        async (error: AxiosError) => {
            if (error?.response?.status == 429) {
                toast.error(error?.response?.data as string);
                return Promise.reject(error);
            }

            const originalRequest = error.config as any;
            // Don't try to refresh tokens for login requests or if already retried
            // For logout requests, we still want to refresh if possible to properly revoke tokens
            // But prevent infinite loops with the isLoggingOut flag
            if (
                error.response?.status === 401 &&
                !originalRequest._retry &&
                !api._isLoggingOut &&
                !originalRequest.url?.includes('/auth/login') &&
                !originalRequest.url?.includes('/auth/refresh-token')
            ) {
                originalRequest._retry = true;

                try {
                    // If there's already a refresh in progress, wait for it
                    if (refreshTokenPromise) {
                        await refreshTokenPromise;
                    } else {
                        // Start a new refresh token request
                        refreshTokenPromise = axios.post(
                            `${API_URL}/v1/auth/refresh-token`,
                            {},
                            {
                                withCredentials: true,
                            }
                        );

                        try {
                            const response = await refreshTokenPromise;
                            const { accessToken } = response.data.data;

                            // Update token in store (refresh token is handled by cookies)
                            useAuthStore.getState().setAccessToken(accessToken);
                        } catch (refreshError) {
                            // Refresh failed, logout user
                            api._isLoggingOut = true;
                            useAuthStore.getState().logout();
                            toast.error('Session expired. Please login again.');
                            throw refreshError;
                        } finally {
                            // Clear the promise regardless of success/failure
                            refreshTokenPromise = null;
                        }
                    }

                    const newToken = useAuthStore.getState().accessToken;
                    originalRequest.headers.Authorization = `Bearer ${newToken}`;
                    return api(originalRequest);
                } catch (refreshError) {
                    return Promise.reject(refreshError);
                }
            }

            return Promise.reject(error);
        }
    );
    api.isAttached = true;
}

export const resetLogoutFlag = () => {
    api._isLoggingOut = false;
};

export default api;
