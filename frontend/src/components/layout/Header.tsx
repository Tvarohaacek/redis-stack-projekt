import { Link, useLocation } from 'react-router-dom';
import { ShoppingBag, BarChart3, Plus } from 'lucide-react';

export default function Header() {
    const location = useLocation();

    const isActive = (path: string) => location.pathname === path;

    return (
        <header className="bg-white shadow-sm border-b border-gray-200">
            <div className="container mx-auto px-4 py-4 max-w-7xl">
                <div className="flex items-center justify-between">
                    <Link to="/" className="flex items-center gap-2 text-2xl font-bold text-primary-600">
                        <ShoppingBag className="w-8 h-8" />
                        <span>Product Catalog</span>
                    </Link>

                    <nav className="flex items-center gap-4">
                        <Link
                            to="/"
                            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                                isActive('/')
                                    ? 'bg-primary-100 text-primary-700'
                                    : 'text-gray-600 hover:bg-gray-100'
                            }`}
                        >
                            <ShoppingBag className="w-5 h-5" />
                            <span className="font-medium">Products</span>
                        </Link>

                        <Link
                            to="/add"
                            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                                isActive('/add')
                                    ? 'bg-primary-100 text-primary-700'
                                    : 'text-gray-600 hover:bg-gray-100'
                            }`}
                        >
                            <Plus className="w-5 h-5" />
                            <span className="font-medium">Add Product</span>
                        </Link>

                        <Link
                            to="/stats"
                            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                                isActive('/stats')
                                    ? 'bg-primary-100 text-primary-700'
                                    : 'text-gray-600 hover:bg-gray-100'
                            }`}
                        >
                            <BarChart3 className="w-5 h-5" />
                            <span className="font-medium">Cache Stats</span>
                        </Link>
                    </nav>
                </div>
            </div>
        </header>
    );
}