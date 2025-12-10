import { Request, Response } from 'express';
import productService from '../services/product.service';
import cacheService from '../services/cache.service';
import {
    createProductSchema,
    updateProductSchema,
    queryParamsSchema,
} from '../types';

export const productController = {
    // GET /api/products
    async getProducts(req: Request, res: Response) {
        try {
            const params = queryParamsSchema.parse(req.query);
            const result = await productService.getProducts(params);

            res.json({
                success: true,
                ...result,
            });
        } catch (error: any) {
            res.status(400).json({
                success: false,
                error: error.message,
            });
        }
    },

    // GET /api/products/:id
    async getProductById(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const result = await productService.getProductById(id);

            if (!result) {
                return res.status(404).json({
                    success: false,
                    error: 'Product not found',
                });
            }

            res.json({
                success: true,
                ...result,
            });
        } catch (error: any) {
            res.status(400).json({
                success: false,
                error: error.message,
            });
        }
    },

    // POST /api/products
    async createProduct(req: Request, res: Response) {
        try {
            const validatedData = createProductSchema.parse(req.body);
            const product = await productService.createProduct(validatedData);

            res.status(201).json({
                success: true,
                data: product,
            });
        } catch (error: any) {
            res.status(400).json({
                success: false,
                error: error.message,
            });
        }
    },

    // PUT /api/products/:id
    async updateProduct(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const validatedData = updateProductSchema.parse(req.body);
            const product = await productService.updateProduct(id, validatedData);

            res.json({
                success: true,
                data: product,
            });
        } catch (error: any) {
            if (error.code === 'P2025') {
                return res.status(404).json({
                    success: false,
                    error: 'Product not found',
                });
            }
            res.status(400).json({
                success: false,
                error: error.message,
            });
        }
    },

    // DELETE /api/products/:id
    async deleteProduct(req: Request, res: Response) {
        try {
            const { id } = req.params;
            await productService.deleteProduct(id);

            res.json({
                success: true,
                message: 'Product deleted successfully',
            });
        } catch (error: any) {
            if (error.code === 'P2025') {
                return res.status(404).json({
                    success: false,
                    error: 'Product not found',
                });
            }
            res.status(400).json({
                success: false,
                error: error.message,
            });
        }
    },

    // GET /api/categories
    async getCategories(req: Request, res: Response) {
        try {
            const categories = await productService.getCategories();

            res.json({
                success: true,
                data: categories,
            });
        } catch (error: any) {
            res.status(400).json({
                success: false,
                error: error.message,
            });
        }
    },

    // GET /api/cache/stats
    async getCacheStats(req: Request, res: Response) {
        try {
            const stats = cacheService.getStats();

            res.json({
                success: true,
                data: stats,
            });
        } catch (error: any) {
            res.status(400).json({
                success: false,
                error: error.message,
            });
        }
    },

    // POST /api/cache/flush
    async flushCache(req: Request, res: Response) {
        try {
            await cacheService.flushAll();
            cacheService.resetStats();

            res.json({
                success: true,
                message: 'Cache flushed successfully',
            });
        } catch (error: any) {
            res.status(400).json({
                success: false,
                error: error.message,
            });
        }
    },
};