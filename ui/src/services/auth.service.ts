import api from './api';

export const authService = {
    login: async (credentials: { email: string; password: string }) => {
        const response = await api.post('/v1/auth/login', credentials);
        return response.data;
    },

    logout: async () => {
        const response = await api.post('/v1/auth/logout');
        return response.data;
    },
};
