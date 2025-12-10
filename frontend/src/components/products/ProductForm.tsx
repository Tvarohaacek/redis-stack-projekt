import { useState } from 'react';
import type { FormEvent } from 'react';
import { Save, Loader2 } from 'lucide-react';
import type { Product, CreateProductDTO } from '../../types';

interface ProductFormProps {
    product?: Product;
    categories: string[];
    onSubmit: (data: CreateProductDTO) => Promise<void>;
    submitLabel?: string;
}

export default function ProductForm({
                                        product,
                                        categories,
                                        onSubmit,
                                        submitLabel = 'Save Product',
                                    }: ProductFormProps) {
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState<CreateProductDTO>({
        name: product?.name || '',
        description: product?.description || '',
        price: product?.price || 0,
        category: product?.category || '',
        imageUrl: product?.imageUrl || '',
        stock: product?.stock || 0,
    });

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            await onSubmit(formData);
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
    ) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: name === 'price' || name === 'stock' ? parseFloat(value) || 0 : value,
        }));
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            {/* Name */}
            <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                    Product Name *
                </label>
                <input
                    id="name"
                    name="name"
                    type="text"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    className="input"
                    placeholder="Enter product name"
                />
            </div>

            {/* Description */}
            <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                    Description *
                </label>
                <textarea
                    id="description"
                    name="description"
                    required
                    value={formData.description}
                    onChange={handleChange}
                    rows={4}
                    className="input resize-none"
                    placeholder="Enter product description"
                />
            </div>

            {/* Price and Stock */}
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-2">
                        Price ($) *
                    </label>
                    <input
                        id="price"
                        name="price"
                        type="number"
                        step="0.01"
                        min="0"
                        required
                        value={formData.price}
                        onChange={handleChange}
                        className="input"
                        placeholder="0.00"
                    />
                </div>

                <div>
                    <label htmlFor="stock" className="block text-sm font-medium text-gray-700 mb-2">
                        Stock *
                    </label>
                    <input
                        id="stock"
                        name="stock"
                        type="number"
                        min="0"
                        required
                        value={formData.stock}
                        onChange={handleChange}
                        className="input"
                        placeholder="0"
                    />
                </div>
            </div>

            {/* Category */}
            <div>
                <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
                    Category *
                </label>
                <select
                    id="category"
                    name="category"
                    required
                    value={formData.category}
                    onChange={handleChange}
                    className="input"
                >
                    <option value="">Select a category</option>
                    {categories.map((cat) => (
                        <option key={cat} value={cat}>
                            {cat}
                        </option>
                    ))}
                    <option value="other">Other (custom)</option>
                </select>
            </div>

            {/* Custom Category Input */}
            {formData.category === 'other' && (
                <div>
                    <label htmlFor="customCategory" className="block text-sm font-medium text-gray-700 mb-2">
                        Custom Category *
                    </label>
                    <input
                        id="customCategory"
                        name="category"
                        type="text"
                        required
                        onChange={handleChange}
                        className="input"
                        placeholder="Enter custom category"
                    />
                </div>
            )}

            {/* Image URL */}
            <div>
                <label htmlFor="imageUrl" className="block text-sm font-medium text-gray-700 mb-2">
                    Image URL
                </label>
                <input
                    id="imageUrl"
                    name="imageUrl"
                    type="url"
                    value={formData.imageUrl}
                    onChange={handleChange}
                    className="input"
                    placeholder="https://example.com/image.jpg"
                />
                {formData.imageUrl && (
                    <div className="mt-3 rounded-lg overflow-hidden border border-gray-200">
                        <img
                            src={formData.imageUrl}
                            alt="Preview"
                            className="w-full h-48 object-cover"
                            onError={(e) => {
                                e.currentTarget.src = '';
                                e.currentTarget.style.display = 'none';
                            }}
                        />
                    </div>
                )}
            </div>

            {/* Submit Button */}
            <button
                type="submit"
                disabled={loading}
                className="btn-primary w-full flex items-center justify-center gap-2"
            >
                {loading ? (
                    <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        <span>Saving...</span>
                    </>
                ) : (
                    <>
                        <Save className="w-5 h-5" />
                        <span>{submitLabel}</span>
                    </>
                )}
            </button>
        </form>
    );
}