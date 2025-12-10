export interface Product {
    id: string;
    name: string;
    description: string;
    price: number;
    category: string;
    imageUrl?: string;
    stock: number;
    createdAt: string;
    updatedAt: string;
}

export interface CreateProductDTO {
    name: string;
    description: string;
    price: number;
    category: string;
    imageUrl?: string;
    stock: number;
}

export interface UpdateProductDTO extends Partial<CreateProductDTO> {}

export interface CacheInfo {
    hit: boolean;
    source: 'redis' | 'database';
    ttl?: number;
}

export interface Pagination {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
}

export interface ApiResponse<T> {
    success: boolean;
    data?: T;
    error?: string;
    cache?: CacheInfo;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
    pagination: Pagination;
}

export interface CacheStats {
    hits: number;
    misses: number;
    hitRate: string;
}