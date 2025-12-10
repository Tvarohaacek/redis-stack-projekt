import { Database, Zap } from 'lucide-react';
import type { CacheInfo } from '../../types';

interface CacheIndicatorProps {
    cache?: CacheInfo;
    className?: string;
}

export default function CacheIndicator({ cache, className = '' }: CacheIndicatorProps) {
    if (!cache) return null;

    const isRedis = cache.source === 'redis';

    return (
        <div className={`inline-flex items-center gap-2 ${className}`}>
      <span
          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${
              isRedis
                  ? 'bg-green-100 text-green-700 border border-green-200'
                  : 'bg-blue-100 text-blue-700 border border-blue-200'
          }`}
      >
        {isRedis ? (
            <>
                <Zap className="w-3.5 h-3.5" />
                <span>FROM CACHE</span>
            </>
        ) : (
            <>
                <Database className="w-3.5 h-3.5" />
                <span>FROM DATABASE</span>
            </>
        )}
      </span>
        </div>
    );
}