import { Search, X } from 'lucide-react';
import { useState, useEffect } from 'react';

interface SearchBarProps {
    onSearch: (query: string) => void;
    onCategoryChange: (category: string) => void;
    categories: string[];
    initialSearch?: string;
    initialCategory?: string;
}

export default function SearchBar({
                                      onSearch,
                                      onCategoryChange,
                                      categories,
                                      initialSearch = '',
                                      initialCategory = '',
                                  }: SearchBarProps) {
    const [search, setSearch] = useState(initialSearch);
    const [category, setCategory] = useState(initialCategory);

    useEffect(() => {
        const timer = setTimeout(() => {
            onSearch(search);
        }, 500);

        return () => clearTimeout(timer);
    }, [search]);

    const handleCategoryChange = (value: string) => {
        setCategory(value);
        onCategoryChange(value);
    };

    const handleClear = () => {
        setSearch('');
        setCategory('');
        onSearch('');
        onCategoryChange('');
    };

    return (
        <div className="card">
            <div className="flex flex-col md:flex-row gap-4">
                {/* Search Input */}
                <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search products..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="input pl-10"
                    />
                </div>

                {/* Category Filter */}
                <select
                    value={category}
                    onChange={(e) => handleCategoryChange(e.target.value)}
                    className="input md:w-64"
                >
                    <option value="">All Categories</option>
                    {categories.map((cat) => (
                        <option key={cat} value={cat}>
                            {cat}
                        </option>
                    ))}
                </select>

                {/* Clear Button */}
                {(search || category) && (
                    <button
                        onClick={handleClear}
                        className="btn-secondary flex items-center gap-2 whitespace-nowrap"
                    >
                        <X className="w-4 h-4" />
                        Clear
                    </button>
                )}
            </div>
        </div>
    );
}