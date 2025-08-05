import api from './api';
import { ApiResponse } from '@/types';

export interface Permission {
    id: number;
    name: string;
    description: string;
}

export interface Department {
    id: number;
    name: string;
}

export interface Location {
    id: number;
    name: string;
}

export const miscellaneousService = {
    getDepartments: async (): Promise<ApiResponse<Department[]>> => {
        try {
            const response = await api.get<ApiResponse<Department[]>>(
                '/v1/misc/departments'
            );
            return response.data;
        } catch (error: any) {
            throw new Error(
                error.response?.data?.error || 'Failed to fetch departments'
            );
        }
    },

    getLocations: async (): Promise<ApiResponse<Location[]>> => {
        try {
            const response =
                await api.get<ApiResponse<Location[]>>('/v1/misc/locations');
            return response.data;
        } catch (error: any) {
            throw new Error(
                error.response?.data?.error || 'Failed to fetch locations'
            );
        }
    },

    getPermissions: async (): Promise<ApiResponse<Permission[]>> => {
        try {
            const response = await api.get<ApiResponse<Permission[]>>(
                '/v1/misc/permissions'
            );
            return response.data;
        } catch (error: any) {
            throw new Error(
                error.response?.data?.error || 'Failed to fetch permissions'
            );
        }
    },
};
