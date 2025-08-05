import { Request } from 'express';
import { Employee, Permission } from '@prisma/client';

export interface AuthenticatedRequest extends Request {
    user?: EmployeeWithPermissions;
}

export interface EmployeeWithPermissions extends Omit<Employee, 'permissions'> {
    permissions: Permission[];
    department: {
        id: number;
        name: string;
    } | null;
    location: {
        id: number;
        name: string;
    } | null;
    reportsTo: {
        id: number;
        firstName: string;
        lastName: string;
        email: string;
    } | null;
    reports?: {
        id: number;
    }[];
    profileAsset: {
        id: number;
        url: string | null;
        cloudFrontUrl: string | null;
    } | null;
}

export interface LoginRequest {
    email: string;
    password: string;
}

export interface LoginResponse {
    accessToken: string;
    refreshToken: string;
    user: EmployeeWithPermissions;
}

export interface RefreshTokenResponse {
    accessToken: string;
    refreshToken: string;
}

export interface CreateEmployeeRequest {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    phone: string;
    position: string;
    hireDate: string;
    departmentId: number | null;
    locationId: number | null;
    reportsToId: number | null;
    permissions?: string[];
}

export interface UpdateEmployeeRequest {
    firstName?: string;
    lastName?: string;
    email?: string;
    password?: string;
    phone?: string;
    position?: string;
    hireDate?: string;
    departmentId?: number | null;
    locationId?: number | null;
    reportsToId?: number | null;
    permissions?: string[];
}

export interface ListEmployeesResponse {
    employees: EmployeeWithPermissions[];
    paginationMetadata: PaginationMetadata;
}

export interface ApiResponse<T = any> {
    success: boolean;
    data?: T;
    message?: string;
    error?: string;
}

export interface PaginationParams {
    page: number;
    limit: number;
    offset: number;
    sortField?: string;
    sortOrder?: 'asc' | 'desc';
}

export interface PaginationMetadata {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}

export interface AppError extends Error {
    statusCode: number;
    isOperational: boolean;
}

export interface JwtPayload {
    userId: number;
    email: string;
    iat: number;
    exp: number;
}
