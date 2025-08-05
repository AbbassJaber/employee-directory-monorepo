import { ApiResponse } from '@/types';
import {
    Employee,
    UpdateEmployeeRequest,
    CreateEmployeeRequest,
    GetEmployeesResponse,
} from '@/features/employees/types';
import api from './api';

export const employeeService = {
    getEmployees: async (params?: {
        page?: number;
        limit?: number;
        search?: string;
        sortField?: string;
        sortOrder?: 'asc' | 'desc';
        filters?: {
            departmentIds?: number[];
            locationIds?: number[];
            reportsToIds?: number[];
        };
    }): Promise<ApiResponse<GetEmployeesResponse>> => {
        const response = await api.get('/v1/employees', { params });
        return response.data;
    },
    getAllEmployees: async (): Promise<ApiResponse<Employee[]>> => {
        const response = await api.get('/v1/employees/all');
        return response.data;
    },

    getEmployee: async (id: number): Promise<ApiResponse<Employee>> => {
        const response = await api.get(`/v1/employees/${id}`);
        return response.data;
    },

    getEmployeeById: async (id: number): Promise<ApiResponse<Employee>> => {
        try {
            const response = await api.get<ApiResponse<Employee>>(
                `/v1/employees/${id}`
            );
            return response.data;
        } catch (error: any) {
            throw new Error(
                error.response?.data?.error || 'Failed to fetch employee'
            );
        }
    },

    updateEmployee: async (
        id: number,
        data: UpdateEmployeeRequest & { profilePhoto?: File }
    ): Promise<ApiResponse<Employee>> => {
        try {
            const formData = new FormData();

            // Add employee data
            Object.keys(data).forEach(key => {
                if (key === 'profilePhoto') {
                    if (data.profilePhoto) {
                        formData.append('profilePhoto', data.profilePhoto);
                    }
                } else if (key === 'permissions') {
                    if (data.permissions) {
                        formData.append(
                            'permissions',
                            JSON.stringify(data.permissions)
                        );
                    }
                } else if (key === 'hireDate') {
                    formData.append('hireDate', data.hireDate.toISOString());
                } else if (
                    data[key as keyof UpdateEmployeeRequest] !== undefined
                ) {
                    formData.append(
                        key,
                        String(data[key as keyof UpdateEmployeeRequest])
                    );
                }
            });

            const response = await api.put<ApiResponse<Employee>>(
                `/v1/employees/${id}`,
                formData,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                }
            );
            return response.data;
        } catch (error: any) {
            throw new Error(
                error.response?.data?.error || 'Failed to update employee'
            );
        }
    },

    getReportingManagers: async (): Promise<ApiResponse<Employee[]>> => {
        const response = await api.get('/v1/employees/reporting-managers');
        return response.data;
    },

    createEmployee: async (
        data: CreateEmployeeRequest
    ): Promise<ApiResponse<Employee>> => {
        try {
            const formData = new FormData();

            // Add employee data
            Object.keys(data).forEach(key => {
                if (key === 'profilePhoto') {
                    if (data.profilePhoto) {
                        formData.append('profilePhoto', data.profilePhoto);
                    }
                } else if (key === 'permissions') {
                    formData.append(
                        'permissions',
                        JSON.stringify(data.permissions)
                    );
                } else if (key === 'hireDate') {
                    formData.append('hireDate', data.hireDate.toISOString());
                } else {
                    formData.append(
                        key,
                        String(data[key as keyof CreateEmployeeRequest])
                    );
                }
            });

            const response = await api.post<ApiResponse<Employee>>(
                '/v1/employees',
                formData,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                }
            );
            return response.data;
        } catch (error: any) {
            throw new Error(
                error.response?.data?.error || 'Failed to create employee'
            );
        }
    },

    deleteEmployee: async (id: number): Promise<ApiResponse<void>> => {
        const response = await api.delete(`/v1/employees/${id}`);
        return response.data;
    },
};
