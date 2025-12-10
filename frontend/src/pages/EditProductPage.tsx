import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { productApi } from '../services/api';
import ProductForm from '../components/products/ProductForm';
import Loading from '../components/common/Loading';
import ErrorMessage from '../components/common/ErrorMessage';
import type { Product, CreateProductDTO } from '../types';

export default function EditProductPage() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

    const [product, setProduct] = useState<Product | null>(null);
    const [categories, setCategories] = useState<string[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (id) {
            loadData();
        }
    }, [id]);

    const loadData = async () => {
        setLoading(true);
        setError(null);

        try {
            const [productResponse, categoriesResponse] = await Promise.all([
                productApi.getProduct(id!),
                productApi.getCategories(),
            ]);

            if (productResponse.success && productResponse.data) {
                setProduct(productResponse.data);
            }

            if (categoriesResponse.success && categoriesResponse.data) {
                setCategories(categoriesResponse.data);
            }
        } catch (err: any) {
            setError(err.response?.data?.error || 'Failed to load product');
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (data: CreateProductDTO) => {
        if (!id) return;

        try {
            const response = await productApi.updateProduct(id, data);
            if (response.success) {
                navigate(`/product/${id}`);
            }
        } catch (err: any) {
            alert(err.response?.data?.error || 'Failed to update product');
            throw err;
        }
    };

    if (loading) {
        return <Loading message="Loading product..." />;
    }

    if (error) {
        return <ErrorMessage message={error} onRetry={loadData} />;
    }

    if (!product) {
        return <ErrorMessage message="Product not found" />;
    }

    return (
        <div className="space-y-6 max-w-3xl mx-auto">
            {/* Back Button */}
            <Link
                to={`/product/${id}`}
                className="inline-flex items-center gap-2 text-primary-600 hover:text-primary-700"
            >
                <ArrowLeft className="w-5 h-5" />
                <span className="font-medium">Back to Product</span>
            </Link>

            {/* Header */}
            <div>
                <h1 className="text-4xl font-bold text-gray-900 mb-2">Edit Product</h1>
                <p className="text-gray-600">Update product information</p>
            </div>

            {/* Form */}
            <div className="card">
                <ProductForm
                    product={product}
                    categories={categories}
                    onSubmit={handleSubmit}
                    submitLabel="Update Product"
                />
            </div>
        </div>
    );
}