"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductController = void 0;
const product_service_1 = require("./product.service");
const errors_1 = require("../../libs/errors");
const logger_1 = require("../../config/logger");
class ProductController {
    constructor() {
        this.getProducts = async (req, res) => {
            try {
                const { category, isActive } = req.query;
                const filters = {
                    category: category,
                    isActive: isActive ? isActive === 'true' : undefined
                };
                const products = await this.productService.getAllProducts(filters);
                res.json({
                    success: true,
                    data: products
                });
            }
            catch (error) {
                logger_1.logger.error('Get products controller error:', error);
                if (error instanceof errors_1.AppError) {
                    res.status(error.statusCode).json({
                        success: false,
                        message: error.message
                    });
                }
                else {
                    res.status(500).json({
                        success: false,
                        message: 'Internal server error'
                    });
                }
            }
        };
        this.getProductById = async (req, res) => {
            try {
                const { id } = req.params;
                const product = await this.productService.getProductById(id);
                res.json({
                    success: true,
                    data: product
                });
            }
            catch (error) {
                logger_1.logger.error('Get product by ID controller error:', error);
                if (error instanceof errors_1.AppError) {
                    res.status(error.statusCode).json({
                        success: false,
                        message: error.message
                    });
                }
                else {
                    res.status(500).json({
                        success: false,
                        message: 'Internal server error'
                    });
                }
            }
        };
        this.createProduct = async (req, res) => {
            try {
                const productData = req.body;
                const product = await this.productService.createProduct(productData);
                res.status(201).json({
                    success: true,
                    message: 'Product created successfully',
                    data: product
                });
            }
            catch (error) {
                logger_1.logger.error('Create product controller error:', error);
                if (error instanceof errors_1.AppError) {
                    res.status(error.statusCode).json({
                        success: false,
                        message: error.message
                    });
                }
                else {
                    res.status(500).json({
                        success: false,
                        message: 'Internal server error'
                    });
                }
            }
        };
        this.updateProduct = async (req, res) => {
            try {
                const { id } = req.params;
                const productData = req.body;
                const product = await this.productService.updateProduct(id, productData);
                res.json({
                    success: true,
                    message: 'Product updated successfully',
                    data: product
                });
            }
            catch (error) {
                logger_1.logger.error('Update product controller error:', error);
                if (error instanceof errors_1.AppError) {
                    res.status(error.statusCode).json({
                        success: false,
                        message: error.message
                    });
                }
                else {
                    res.status(500).json({
                        success: false,
                        message: 'Internal server error'
                    });
                }
            }
        };
        this.deleteProduct = async (req, res) => {
            try {
                const { id } = req.params;
                await this.productService.deleteProduct(id);
                res.json({
                    success: true,
                    message: 'Product deleted successfully'
                });
            }
            catch (error) {
                logger_1.logger.error('Delete product controller error:', error);
                if (error instanceof errors_1.AppError) {
                    res.status(error.statusCode).json({
                        success: false,
                        message: error.message
                    });
                }
                else {
                    res.status(500).json({
                        success: false,
                        message: 'Internal server error'
                    });
                }
            }
        };
        this.productService = new product_service_1.ProductService();
    }
}
exports.ProductController = ProductController;
//# sourceMappingURL=product.controller.js.map