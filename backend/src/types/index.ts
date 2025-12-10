import { z } from 'zod';

// Product validation schemas
export const createProductSchema = z.object({
    name: z.string().min(1).max(200),
    description: z.string().min(1).max(1000),
    price: z.number().positive(),
    category: z.string().min(1).max(100),
    imageUrl: z.string().url().optional(),
    stock: z.number().int().min(0).default(0),
});

export const updateProductSchema = createProductSchema.partial();

export const queryParamsSchema = z.object({
    page: z.string().optional().transform(val => val ? parseInt(val) : 1),
    limit: z.string().optional().transform(val => val ? parseInt(val) : 12),
    search: z.string().optional(),
    category: z.string().optional(),
});

// Types
export type CreateProductDTO = z.infer<typeof createProductSchema>;
export type UpdateProductDTO = z.infer<typeof updateProductSchema>;
export type QueryParams = z.infer<typeof queryParamsSchema>;

export interface CacheStats {
    hits: number;
    misses: number;
    hitRate: string;
}

export interface ApiResponse<T> {
    success: boolean;
    data?: T;
    error?: string;
    cache?: {
        hit: boolean;
        source: 'redis' | 'database';
        ttl?: number;
    };
}

export interface PaginatedResponse<T> {
    data: T[];
    pagination: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
    };
    cache?: {
        hit: boolean;
        source: 'redis' | 'database';
    };
}