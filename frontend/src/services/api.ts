import axios from 'axios';
import type {
    Product,
    CreateProductDTO,
    UpdateProductDTO,
    ApiResponse,
    PaginatedResponse,
    CacheStats,
} from '../types';

const API_URL = import.meta.env.VITE_API_URL || '/api';

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor
api.interceptors.request.use(
    (config) => {
        console.log(`📤 ${config.method?.toUpperCase()} ${config.url}`);
        return config;
    },
    (error) => Promise.reject(error)
);

// Response interceptor
api.interceptors.response.use(
    (response) => {
        if (response.data.cache) {
            const cacheStatus = response.data.cache.hit ? '✅ CACHE HIT' : '❌ CACHE MISS';
            console.log(`${cacheStatus} - Source: ${response.data.cache.source}`);
        }
        return response;
    },
    (error) => {
        console.error('❌ API Error:', error.response?.data || error.message);
        return Promise.reject(error);
    }
);

export const productApi = {
    // GET all products with filters
    getProducts: async (params?: {
        page?: number;
        limit?: number;
        search?: string;
        category?: string;
    }) => {
        const response = await api.get<PaginatedResponse<Product>>('/products', { params });
        return response.data;
    },

    // GET single product
    getProduct: async (id: string) => {
        const response = await api.get<ApiResponse<Product>>(`/products/${id}`);
        return response.data;
    },

    // CREATE product
    createProduct: async (data: CreateProductDTO) => {
        const response = await api.post<ApiResponse<Product>>('/products', data);
        return response.data;
    },

    // UPDATE product
    updateProduct: async (id: string, data: UpdateProductDTO) => {
        const response = await api.put<ApiResponse<Product>>(`/products/${id}`, data);
        return response.data;
    },

    // DELETE product
    deleteProduct: async (id: string) => {
        const response = await api.delete<ApiResponse<void>>(`/products/${id}`);
        return response.data;
    },

    // GET categories
    getCategories: async () => {
        const response = await api.get<ApiResponse<string[]>>('/categories');
        return response.data;
    },

    // GET cache stats
    getCacheStats: async () => {
        const response = await api.get<ApiResponse<CacheStats>>('/cache/stats');
        return response.data;
    },

    // FLUSH cache
    flushCache: async () => {
        const response = await api.post<ApiResponse<void>>('/cache/flush');
        return response.data;
    },
};

export default api;