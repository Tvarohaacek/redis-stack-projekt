import prisma from '../config/database';
import cacheService from './cache.service';
import { CreateProductDTO, UpdateProductDTO, QueryParams } from '../types';

class ProductService {
    // GET ALL s pagination a search
    async getProducts(params: QueryParams) {
        const { page = 1, limit = 12, search, category } = params;
        const skip = (page - 1) * limit;

        // Pokud je search nebo category, použijeme search cache
        if (search || category) {
            const cacheKey = `search:${search || ''}:${category || 'all'}:${page}`;
            const cached = await cacheService.getProductSearch(search || '', category, page);

            if (cached) {
                return { ...cached, cache: { hit: true, source: 'redis' as const } };
            }
        } else {
            // Jinak použijeme list cache
            const cached = await cacheService.getProductList(page, limit);
            if (cached) {
                return { ...cached, cache: { hit: true, source: 'redis' as const } };
            }
        }

        // Sestavení WHERE podmínky
        const where: any = {};

        if (search) {
            where.OR = [
                { name: { contains: search, mode: 'insensitive' } },
                { description: { contains: search, mode: 'insensitive' } },
            ];
        }

        if (category) {
            where.category = category;
        }

        // Dotaz do databáze
        const [products, total] = await Promise.all([
            prisma.product.findMany({
                where,
                skip,
                take: limit,
                orderBy: { createdAt: 'desc' },
            }),
            prisma.product.count({ where }),
        ]);

        const result = {
            data: products,
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit),
            },
        };

        // Uložení do cache
        if (search || category) {
            await cacheService.setProductSearch(search || '', category, page, result);
        } else {
            await cacheService.setProductList(page, limit, result);
        }

        return { ...result, cache: { hit: false, source: 'database' as const } };
    }

    // GET BY ID
    async getProductById(id: string) {
        // Pokus o načtení z cache
        const cached = await cacheService.getProduct(id);

        if (cached) {
            return { data: cached, cache: { hit: true, source: 'redis' as const } };
        }

        // Načtení z databáze
        const product = await prisma.product.findUnique({
            where: { id },
        });

        if (!product) {
            return null;
        }

        // Uložení do cache
        await cacheService.setProduct(id, product);

        return { data: product, cache: { hit: false, source: 'database' as const } };
    }

    // CREATE
    async createProduct(data: CreateProductDTO) {
        const product = await prisma.product.create({
            data,
        });

        // Invalidace list cache (nový produkt ovlivňuje listy)
        await cacheService.invalidateProductLists();

        return product;
    }

    // UPDATE
    async updateProduct(id: string, data: UpdateProductDTO) {
        const product = await prisma.product.update({
            where: { id },
            data,
        });

        // Invalidace cache pro tento produkt a všechny listy
        await cacheService.deleteProduct(id);

        return product;
    }

    // DELETE
    async deleteProduct(id: string) {
        const product = await prisma.product.delete({
            where: { id },
        });

        // Invalidace cache
        await cacheService.deleteProduct(id);

        return product;
    }

    // GET CATEGORIES (pro filter)
    async getCategories() {
        const products = await prisma.product.findMany({
            select: { category: true },
            distinct: ['category'],
        });

        return products.map(p => p.category).sort();
    }
}

export default new ProductService();