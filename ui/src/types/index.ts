export interface Department {
    id: number;
    name: string;
    description: string;
}

export interface Location {
    id: number;
    name: string;
    address?: string;
    city?: string;
    state?: string;
    country?: string;
    postalCode?: string;
}

export interface Asset {
    id: number;
    s3Key: string;
    s3Bucket: string;
    originalName: string;
    mimeType: string;
    size: number;
    url?: string;
    cloudFrontUrl?: string;
    createdAt: string;
    updatedAt: string;
}

export interface PaginationParams {
    page: number;
    limit: number;
}

export interface PaginationMetadata {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}

export interface ApiResponse<T> {
    success: boolean;
    data: T;
    message?: string;
}

export type Theme = 'light' | 'dark';

export type Language = 'en' | 'fr';
