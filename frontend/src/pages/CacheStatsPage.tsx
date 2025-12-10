import { useState, useEffect } from 'react';
import { BarChart3, Zap, Database, RefreshCw, Trash2 } from 'lucide-react';
import { productApi } from '../services/api';
import Loading from '../components/common/Loading';
import ErrorMessage from '../components/common/ErrorMessage';
import type { CacheStats } from '../types';

export default function CacheStatsPage() {
    const [stats, setStats] = useState<CacheStats | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [flushing, setFlushing] = useState(false);

    useEffect(() => {
        loadStats();
        const interval = setInterval(loadStats, 5000); // Refresh every 5 seconds
        return () => clearInterval(interval);
    }, []);

    const loadStats = async () => {
        try {
            const response = await productApi.getCacheStats();
            if (response.success && response.data) {
                setStats(response.data);
                setError(null);
            }
        } catch (err: any) {
            setError(err.response?.data?.error || 'Failed to load cache stats');
        } finally {
            setLoading(false);
        }
    };

    const handleFlushCache = async () => {
        if (!confirm('Are you sure you want to flush the entire cache?')) return;

        setFlushing(true);

        try {
            await productApi.flushCache();
            await loadStats();
            alert('Cache flushed successfully!');
        } catch (err: any) {
            alert(err.response?.data?.error || 'Failed to flush cache');
        } finally {
            setFlushing(false);
        }
    };

    if (loading && !stats) {
        return <Loading message="Loading cache statistics..." />;
    }

    if (error && !stats) {
        return <ErrorMessage message={error} onRetry={loadStats} />;
    }

    const total = stats ? stats.hits + stats.misses : 0;

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-4xl font-bold text-gray-900 mb-2">Cache Statistics</h1>
                    <p className="text-gray-600 text-lg">Monitor Redis cache performance</p>
                </div>

                <div className="flex gap-3">
                    <button
                        onClick={loadStats}
                        className="btn-secondary flex items-center gap-2"
                    >
                        <RefreshCw className="w-5 h-5" />
                        Refresh
                    </button>
                    <button
                        onClick={handleFlushCache}
                        disabled={flushing}
                        className="btn-danger flex items-center gap-2"
                    >
                        <Trash2 className="w-5 h-5" />
                        {flushing ? 'Flushing...' : 'Flush Cache'}
                    </button>
                </div>
            </div>

            {stats && (
                <>
                    {/* Stats Cards */}
                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {/* Total Requests */}
                        <div className="card">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="p-3 bg-primary-100 rounded-lg">
                                    <BarChart3 className="w-6 h-6 text-primary-600" />
                                </div>
                                <h3 className="text-lg font-semibold text-gray-900">Total Requests</h3>
                            </div>
                            <p className="text-4xl font-bold text-gray-900">{total}</p>
                        </div>

                        {/* Cache Hits */}
                        <div className="card">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="p-3 bg-green-100 rounded-lg">
                                    <Zap className="w-6 h-6 text-green-600" />
                                </div>
                                <h3 className="text-lg font-semibold text-gray-900">Cache Hits</h3>
                            </div>
                            <p className="text-4xl font-bold text-green-600">{stats.hits}</p>
                        </div>

                        {/* Cache Misses */}
                        <div className="card">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="p-3 bg-blue-100 rounded-lg">
                                    <Database className="w-6 h-6 text-blue-600" />
                                </div>
                                <h3 className="text-lg font-semibold text-gray-900">Cache Misses</h3>
                            </div>
                            <p className="text-4xl font-bold text-blue-600">{stats.misses}</p>
                        </div>

                        {/* Hit Rate */}
                        <div className="card">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="p-3 bg-purple-100 rounded-lg">
                                    <BarChart3 className="w-6 h-6 text-purple-600" />
                                </div>
                                <h3 className="text-lg font-semibold text-gray-900">Hit Rate</h3>
                            </div>
                            <p className="text-4xl font-bold text-purple-600">{stats.hitRate}</p>
                        </div>
                    </div>

                    {/* Visual Representation */}
                    <div className="card">
                        <h2 className="text-2xl font-bold text-gray-900 mb-6">Cache Performance</h2>

                        {total > 0 ? (
                            <div className="space-y-4">
                                {/* Hits Bar */}
                                <div>
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-sm font-medium text-gray-700">Cache Hits</span>
                                        <span className="text-sm font-semibold text-green-600">
                      {stats.hits} ({((stats.hits / total) * 100).toFixed(1)}%)
                    </span>
                                    </div>
                                    <div className="h-8 bg-gray-200 rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-green-500 transition-all duration-500"
                                            style={{ width: `${(stats.hits / total) * 100}%` }}
                                        />
                                    </div>
                                </div>

                                {/* Misses Bar */}
                                <div>
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-sm font-medium text-gray-700">Cache Misses</span>
                                        <span className="text-sm font-semibold text-blue-600">
                      {stats.misses} ({((stats.misses / total) * 100).toFixed(1)}%)
                    </span>
                                    </div>
                                    <div className="h-8 bg-gray-200 rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-blue-500 transition-all duration-500"
                                            style={{ width: `${(stats.misses / total) * 100}%` }}
                                        />
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <p className="text-gray-500 text-center py-8">
                                No cache statistics yet. Start browsing products to see cache performance.
                            </p>
                        )}
                    </div>

                    {/* Info Box */}
                    <div className="card bg-primary-50 border-primary-200">
                        <h3 className="text-lg font-semibold text-primary-900 mb-3">How it works</h3>
                        <ul className="space-y-2 text-primary-800">
                            <li className="flex items-start gap-2">
                                <Zap className="w-5 h-5 flex-shrink-0 mt-0.5" />
                                <span>
                  <strong>Cache Hit:</strong> Data loaded from Redis (fast)
                </span>
                            </li>
                            <li className="flex items-start gap-2">
                                <Database className="w-5 h-5 flex-shrink-0 mt-0.5" />
                                <span>
                  <strong>Cache Miss:</strong> Data loaded from PostgreSQL (slower, then cached)
                </span>
                            </li>
                            <li className="flex items-start gap-2">
                                <RefreshCw className="w-5 h-5 flex-shrink-0 mt-0.5" />
                                <span>
                  Cache automatically expires after TTL (products: 10min, lists: 5min, search: 3min)
                </span>
                            </li>
                        </ul>
                    </div>
                </>
            )}
        </div>
    );
}