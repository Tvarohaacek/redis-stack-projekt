import { ChevronLeft, ChevronRight } from 'lucide-react';
import ProductCard from './ProductCard';
import CacheIndicator from '../common/CacheIndicator';
import type { Product, Pagination, CacheInfo } from '../../types';

interface ProductListProps {
    products: Product[];
    pagination: Pagination;
    cache?: CacheInfo;
    onPageChange: (page: number) => void;
}

export default function ProductList({
                                        products,
                                        pagination,
                                        cache,
                                        onPageChange,
                                    }: ProductListProps) {
    if (products.length === 0) {
        return (
            <div className="text-center py-12">
                <p className="text-gray-500 text-lg">No products found</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Cache Indicator */}
            <div className="flex items-center justify-between">
                <p className="text-gray-600">
                    Showing <span className="font-semibold">{products.length}</span> of{' '}
                    <span className="font-semibold">{pagination.total}</span> products
                </p>
                <CacheIndicator cache={cache} />
            </div>

            {/* Product Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {products.map((product) => (
                    <ProductCard key={product.id} product={product} />
                ))}
            </div>

            {/* Pagination */}
            {pagination.totalPages > 1 && (
                <div className="flex items-center justify-center gap-2 pt-8">
                    <button
                        onClick={() => onPageChange(pagination.page - 1)}
                        disabled={pagination.page === 1}
                        className="p-2 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <ChevronLeft className="w-5 h-5" />
                    </button>

                    <div className="flex items-center gap-1">
                        {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map((page) => (
                            <button
                                key={page}
                                onClick={() => onPageChange(page)}
                                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                                    page === pagination.page
                                        ? 'bg-primary-600 text-white'
                                        : 'hover:bg-gray-100 text-gray-700'
                                }`}
                            >
                                {page}
                            </button>
                        ))}
                    </div>

                    <button
                        onClick={() => onPageChange(pagination.page + 1)}
                        disabled={pagination.page === pagination.totalPages}
                        className="p-2 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <ChevronRight className="w-5 h-5" />
                    </button>
                </div>
            )}
        </div>
    );
}