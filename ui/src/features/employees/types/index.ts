import { PaginationMetadata } from '@/types';

export interface UpdateEmployeeRequest {
    firstName: string;
    lastName: string;
    email: string;
    password?: string;
    phone: string;
    position: string;
    hireDate: Date;
    departmentId: number | null;
    locationId: number | null;
    reportsToId: number | null;
    permissions: string[];
}

export interface ListEmployeesResponse {
    employees: Employee[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}

export interface Employee {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    position: string;
    phone: string;
    hireDate: Date;
    department: {
        id: number;
        name: string;
    };
    location: {
        id: number;
        name: string;
    };
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
    permissions: EmployeePermission[];
}

export interface EmployeePermission {
    name: string;
    description: string;
}

export interface GetEmployeesResponse {
    employees: Employee[];
    paginationMetadata: PaginationMetadata;
}

export interface FormData {
    firstName: string;
    lastName: string;
    email: string;
    password?: string;
    phone: string;
    position: string;
    hireDate: Date;
    departmentId: number | null;
    locationId: number | null;
    reportsToId: number | null;
    permissions: string[];
    profilePhoto?: File;
    removeProfilePhoto?: boolean;
}

export interface CreateEmployeeRequest
    extends Omit<FormData, 'removeProfilePhoto'> {}

export interface FormErrors {
    firstName?: string;
    lastName?: string;
    email?: string;
    password?: string;
    phone?: string;
    position?: string;
    hireDate?: string;
    departmentId?: string;
    locationId?: string;
    reportsToId?: string;
    permissions?: string;
}

export interface DropdownOption {
    label: string;
    value: number;
}

export interface Permission {
    id: number;
    name: string;
    description: string;
}
