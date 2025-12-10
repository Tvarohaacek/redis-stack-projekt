import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { productApi } from '../services/api';
import ProductForm from '../components/products/ProductForm';
import type { CreateProductDTO } from '../types';

export default function AddProductPage() {
    const navigate = useNavigate();
    const [categories, setCategories] = useState<string[]>([]);

    useEffect(() => {
        loadCategories();
    }, []);

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

    const handleSubmit = async (data: CreateProductDTO) => {
        try {
            const response = await productApi.createProduct(data);
            if (response.success && response.data) {
                navigate(`/product/${response.data.id}`);
            }
        } catch (err: any) {
            alert(err.response?.data?.error || 'Failed to create product');
            throw err;
        }
    };

    return (
        <div className="space-y-6 max-w-3xl mx-auto">
            {/* Back Button */}
            <Link to="/" className="inline-flex items-center gap-2 text-primary-600 hover:text-primary-700">
                <ArrowLeft className="w-5 h-5" />
                <span className="font-medium">Back to Products</span>
            </Link>

            {/* Header */}
            <div>
                <h1 className="text-4xl font-bold text-gray-900 mb-2">Add New Product</h1>
                <p className="text-gray-600">Create a new product in the catalog</p>
            </div>

            {/* Form */}
            <div className="card">
                <ProductForm
                    categories={categories}
                    onSubmit={handleSubmit}
                    submitLabel="Create Product"
                />
            </div>
        </div>
    );
}