import { redisClient } from '../config/redis';
import { CacheStats } from '../types';

class CacheService {
    private hits = 0;
    private misses = 0;

    // Cache TTL v sekundách
    private readonly TTL = {
        PRODUCT: parseInt(process.env.CACHE_TTL_PRODUCT || '600'), // 10 minut
        LIST: parseInt(process.env.CACHE_TTL_LIST || '300'), // 5 minut
        SEARCH: parseInt(process.env.CACHE_TTL_SEARCH || '180'), // 3 minuty
    };

    // Generování klíčů
    private keys = {
        product: (id: string) => `product:${id}`,
        productList: (page: number, limit: number) => `products:list:${page}:${limit}`,
        productSearch: (query: string, category: string | undefined, page: number) =>
            `products:search:${query}:${category || 'all'}:${page}`,
        productsByCategory: (category: string, page: number) => `products:category:${category}:${page}`,
    };

    // GET z cache
    async get<T>(key: string): Promise<T | null> {
        try {
            const data = await redisClient.get(key);

            if (data) {
                this.hits++;
                console.log(`✅ Cache HIT: ${key}`);
                return JSON.parse(data) as T;
            }

            this.misses++;
            console.log(`❌ Cache MISS: ${key}`);
            return null;
        } catch (error) {
            console.error('Cache GET error:', error);
            this.misses++;
            return null;
        }
    }

    // SET do cache
    async set(key: string, value: any, ttl?: number): Promise<void> {
        try {
            const serialized = JSON.stringify(value);
            const expirationTime = ttl || this.TTL.PRODUCT;

            await redisClient.setEx(key, expirationTime, serialized);
            console.log(`💾 Cache SET: ${key} (TTL: ${expirationTime}s)`);
        } catch (error) {
            console.error('Cache SET error:', error);
        }
    }

    // DELETE z cache
    async delete(key: string): Promise<void> {
        try {
            await redisClient.del(key);
            console.log(`🗑️  Cache DELETE: ${key}`);
        } catch (error) {
            console.error('Cache DELETE error:', error);
        }
    }

    // DELETE podle patternu
    async deletePattern(pattern: string): Promise<void> {
        try {
            const keys = await redisClient.keys(pattern);
            if (keys.length > 0) {
                await redisClient.del(keys);
                console.log(`🗑️  Cache DELETE pattern: ${pattern} (${keys.length} keys)`);
            }
        } catch (error) {
            console.error('Cache DELETE pattern error:', error);
        }
    }

    // Invalidace všech list/search cache při změně produktu
    async invalidateProductLists(): Promise<void> {
        await this.deletePattern('products:list:*');
        await this.deletePattern('products:search:*');
        await this.deletePattern('products:category:*');
    }

    // FLUSH ALL - vymazání celé cache
    async flushAll(): Promise<void> {
        try {
            await redisClient.flushAll();
            console.log('🧹 Cache: FLUSHED ALL');
        } catch (error) {
            console.error('Cache FLUSH error:', error);
        }
    }

    // Získání statistik
    getStats(): CacheStats {
        const total = this.hits + this.misses;
        const hitRate = total > 0 ? ((this.hits / total) * 100).toFixed(2) : '0.00';

        return {
            hits: this.hits,
            misses: this.misses,
            hitRate: `${hitRate}%`,
        };
    }

    // Reset statistik
    resetStats(): void {
        this.hits = 0;
        this.misses = 0;
        console.log('📊 Cache stats reset');
    }

    // Pomocné metody pro konkrétní použití

    async getProduct(id: string) {
        return this.get(this.keys.product(id));
    }

    async setProduct(id: string, product: any) {
        return this.set(this.keys.product(id), product, this.TTL.PRODUCT);
    }

    async deleteProduct(id: string) {
        await this.delete(this.keys.product(id));
        await this.invalidateProductLists();
    }

    async getProductList(page: number, limit: number) {
        return this.get(this.keys.productList(page, limit));
    }

    async setProductList(page: number, limit: number, data: any) {
        return this.set(this.keys.productList(page, limit), data, this.TTL.LIST);
    }

    async getProductSearch(query: string, category: string | undefined, page: number) {
        return this.get(this.keys.productSearch(query, category, page));
    }

    async setProductSearch(query: string, category: string | undefined, page: number, data: any) {
        return this.set(this.keys.productSearch(query, category, page), data, this.TTL.SEARCH);
    }
}

export default new CacheService();