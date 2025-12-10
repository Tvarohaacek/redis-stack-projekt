import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Edit, Trash2, Package } from 'lucide-react';
import { productApi } from '../services/api';
import CacheIndicator from '../components/common/CacheIndicator';
import Loading from '../components/common/Loading';
import ErrorMessage from '../components/common/ErrorMessage';
import type { Product, CacheInfo } from '../types';

export default function ProductDetailPage() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

    const [product, setProduct] = useState<Product | null>(null);
    const [cache, setCache] = useState<CacheInfo | undefined>();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [deleting, setDeleting] = useState(false);

    useEffect(() => {
        if (id) {
            loadProduct();
        }
    }, [id]);

    const loadProduct = async () => {
        if (!id) return;

        setLoading(true);
        setError(null);

        try {
            const response = await productApi.getProduct(id);

            if (response.success && response.data) {
                setProduct(response.data);
                setCache(response.cache);
            }
        } catch (err: any) {
            setError(err.response?.data?.error || 'Failed to load product');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async () => {
        if (!id || !confirm('Are you sure you want to delete this product?')) return;

        setDeleting(true);

        try {
            await productApi.deleteProduct(id);
            navigate('/');
        } catch (err: any) {
            alert(err.response?.data?.error || 'Failed to delete product');
        } finally {
            setDeleting(false);
        }
    };

    if (loading) {
        return <Loading message="Loading product..." />;
    }

    if (error) {
        return <ErrorMessage message={error} onRetry={loadProduct} />;
    }

    if (!product) {
        return <ErrorMessage message="Product not found" />;
    }

    return (
        <div className="space-y-6">
            {/* Back Button */}
            <Link to="/" className="inline-flex items-center gap-2 text-primary-600 hover:text-primary-700">
                <ArrowLeft className="w-5 h-5" />
                <span className="font-medium">Back to Products</span>
            </Link>

            {/* Cache Indicator */}
            <CacheIndicator cache={cache} className="justify-end" />

            {/* Product Content */}
            <div className="card">
                <div className="grid md:grid-cols-2 gap-8">
                    {/* Image */}
                    <div className="aspect-square rounded-lg overflow-hidden bg-gray-100">
                        {product.imageUrl ? (
                            <img
                                src={product.imageUrl}
                                alt={product.name}
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center">
                                <Package className="w-24 h-24 text-gray-300" />
                            </div>
                        )}
                    </div>

                    {/* Details */}
                    <div className="space-y-6">
                        {/* Category */}
                        <span className="inline-block px-3 py-1 bg-primary-100 text-primary-700 text-sm font-medium rounded">
              {product.category}
            </span>

                        {/* Name */}
                        <h1 className="text-4xl font-bold text-gray-900">{product.name}</h1>

                        {/* Price */}
                        <div className="text-5xl font-bold text-primary-600">
                            ${product.price.toFixed(2)}
                        </div>

                        {/* Stock */}
                        <div className="flex items-center gap-2">
                            <span className="text-gray-600">Stock:</span>
                            <span
                                className={`font-semibold ${
                                    product.stock > 0 ? 'text-green-600' : 'text-red-600'
                                }`}
                            >
                {product.stock > 0 ? `${product.stock} available` : 'Out of stock'}
              </span>
                        </div>

                        {/* Description */}
                        <div>
                            <h2 className="text-lg font-semibold text-gray-900 mb-2">Description</h2>
                            <p className="text-gray-600 leading-relaxed">{product.description}</p>
                        </div>

                        {/* Metadata */}
                        <div className="pt-6 border-t border-gray-200 space-y-2 text-sm text-gray-500">
                            <p>Created: {new Date(product.createdAt).toLocaleString()}</p>
                            <p>Updated: {new Date(product.updatedAt).toLocaleString()}</p>
                        </div>

                        {/* Actions */}
                        <div className="flex gap-3 pt-4">
                            <Link
                                to={`/edit/${product.id}`}
                                className="btn-primary flex items-center gap-2 flex-1 justify-center"
                            >
                                <Edit className="w-5 h-5" />
                                Edit Product
                            </Link>
                            <button
                                onClick={handleDelete}
                                disabled={deleting}
                                className="btn-danger flex items-center gap-2 flex-1 justify-center"
                            >
                                <Trash2 className="w-5 h-5" />
                                {deleting ? 'Deleting...' : 'Delete'}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}