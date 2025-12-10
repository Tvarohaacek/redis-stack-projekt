import { useState, useEffect } from 'react';
import { productApi } from '../services/api';
import SearchBar from '../components/products/SearchBar';
import ProductList from '../components/products/ProductList';
import Loading from '../components/common/Loading';
import ErrorMessage from '../components/common/ErrorMessage';
import type { Product, Pagination, CacheInfo } from '../types';

export default function HomePage() {
    const [products, setProducts] = useState<Product[]>([]);
    const [pagination, setPagination] = useState<Pagination>({
        page: 1,
        limit: 12,
        total: 0,
        totalPages: 0,
    });
    const [cache, setCache] = useState<CacheInfo | undefined>();
    const [categories, setCategories] = useState<string[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Filters
    const [search, setSearch] = useState('');
    const [category, setCategory] = useState('');

    // Load categories
    useEffect(() => {
        loadCategories();
    }, []);

    // Load products when filters change
    useEffect(() => {
        loadProducts();
    }, [pagination.page, search, category]);

    const loadCategories = async () => {
        try {
            const response = await productApi.getCategories();
            if (response.success && response.data) {
                setCategories(response.data);
            }
        } catch (err) {
            console.error('Failed to load categories:', err);
        }
    };

    const loadProducts = async () => {
        setLoading(true);
        setError(null);

        try {
            const response = await productApi.getProducts({
                page: pagination.page,
                limit: pagination.limit,
                search: search || undefined,
                category: category || undefined,
            });

            if (response.success && response.data) {
                setProducts(response.data);
                setPagination(response.pagination);
                setCache(response.cache);
            }
        } catch (err: any) {
            setError(err.response?.data?.error || 'Failed to load products');
        } finally {
            setLoading(false);
        }
    };

    const handlePageChange = (page: number) => {
        setPagination((prev) => ({ ...prev, page }));
    };

    const handleSearch = (query: string) => {
        setSearch(query);
        setPagination((prev) => ({ ...prev, page: 1 }));
    };

    const handleCategoryChange = (cat: string) => {
        setCategory(cat);
        setPagination((prev) => ({ ...prev, page: 1 }));
    };

    return (
        <div className="space-y-8">
            {/* Header */}
            <div>
                <h1 className="text-4xl font-bold text-gray-900 mb-2">Product Catalog</h1>
                <p className="text-gray-600 text-lg">
                    Browse our collection with Redis-powered caching
                </p>
            </div>

            {/* Search Bar */}
            <SearchBar
                onSearch={handleSearch}
                onCategoryChange={handleCategoryChange}
                categories={categories}
                initialSearch={search}
                initialCategory={category}
            />

            {/* Content */}
            {loading ? (
                <Loading message="Loading products..." />
            ) : error ? (
                <ErrorMessage message={error} onRetry={loadProducts} />
            ) : (
                <ProductList
                    products={products}
                    pagination={pagination}
                    cache={cache}
                    onPageChange={handlePageChange}
                />
            )}
        </div>
    );
}