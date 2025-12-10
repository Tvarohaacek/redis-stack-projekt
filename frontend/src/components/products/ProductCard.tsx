import { Link } from 'react-router-dom';
import { Package } from 'lucide-react';
import type { Product } from '../../types';

interface ProductCardProps {
    product: Product;
}

function ProductCard({ product }: ProductCardProps) {
    return (
        <Link
            to={`/product/${product.id}`}
            className="card hover:shadow-lg transition-all duration-200 hover:-translate-y-1 group"
        >
            {/* Image */}
            <div className="aspect-square rounded-lg overflow-hidden bg-gray-100 mb-4">
                {product.imageUrl ? (
                    <img
                        src={product.imageUrl}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center">
                        <Package className="w-16 h-16 text-gray-300" />
                    </div>
                )}
            </div>

            {/* Content */}
            <div className="space-y-2">
                {/* Category Badge */}
                <span className="inline-block px-2 py-1 bg-primary-100 text-primary-700 text-xs font-medium rounded">
          {product.category}
        </span>

                {/* Name */}
                <h3 className="font-bold text-lg text-gray-900 line-clamp-2 group-hover:text-primary-600 transition-colors">
                    {product.name}
                </h3>

                {/* Description */}
                <p className="text-gray-600 text-sm line-clamp-2">{product.description}</p>

                {/* Price & Stock */}
                <div className="flex items-center justify-between pt-2 border-t border-gray-200">
          <span className="text-2xl font-bold text-gray-900">
            ${product.price.toFixed(2)}
          </span>
                    <span
                        className={`text-sm font-medium ${
                            product.stock > 0 ? 'text-green-600' : 'text-red-600'
                        }`}
                    >
            {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
          </span>
                </div>
            </div>
        </Link>
    );
}

export default ProductCard;