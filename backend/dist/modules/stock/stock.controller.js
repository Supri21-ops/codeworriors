"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StockController = void 0;
const stock_service_1 = require("./stock.service");
const errors_1 = require("../../libs/errors");
const logger_1 = require("../../config/logger");
class StockController {
    constructor() {
        this.getStockItems = async (req, res) => {
            try {
                const stockItems = await this.stockService.getAllStockItems();
                res.json({
                    success: true,
                    data: stockItems
                });
            }
            catch (error) {
                logger_1.logger.error('Get stock items controller error:', error);
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
        this.getStockItemById = async (req, res) => {
            try {
                const { id } = req.params;
                const stockItem = await this.stockService.getStockItemById(id);
                res.json({
                    success: true,
                    data: stockItem
                });
            }
            catch (error) {
                logger_1.logger.error('Get stock item by ID controller error:', error);
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
        this.createStockItem = async (req, res) => {
            try {
                const stockData = req.body;
                const stockItem = await this.stockService.createStockItem(stockData);
                res.status(201).json({
                    success: true,
                    message: 'Stock item created successfully',
                    data: stockItem
                });
            }
            catch (error) {
                logger_1.logger.error('Create stock item controller error:', error);
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
        this.updateStockItem = async (req, res) => {
            try {
                const { id } = req.params;
                const stockData = req.body;
                const stockItem = await this.stockService.updateStockItem(id, stockData);
                res.json({
                    success: true,
                    message: 'Stock item updated successfully',
                    data: stockItem
                });
            }
            catch (error) {
                logger_1.logger.error('Update stock item controller error:', error);
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
        this.deleteStockItem = async (req, res) => {
            try {
                const { id } = req.params;
                await this.stockService.deleteStockItem(id);
                res.json({
                    success: true,
                    message: 'Stock item deleted successfully'
                });
            }
            catch (error) {
                logger_1.logger.error('Delete stock item controller error:', error);
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
        this.getStockMovements = async (req, res) => {
            try {
                const movements = await this.stockService.getStockMovements();
                res.json({
                    success: true,
                    data: movements
                });
            }
            catch (error) {
                logger_1.logger.error('Get stock movements controller error:', error);
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
        this.createStockMovement = async (req, res) => {
            try {
                const movementData = req.body;
                const userId = req.user?.id;
                if (!userId) {
                    throw new errors_1.AppError('User not authenticated', 401);
                }
                const movement = await this.stockService.createStockMovement(movementData, userId);
                res.status(201).json({
                    success: true,
                    message: 'Stock movement created successfully',
                    data: movement
                });
            }
            catch (error) {
                logger_1.logger.error('Create stock movement controller error:', error);
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
        this.getStockSummary = async (req, res) => {
            try {
                const summary = await this.stockService.getStockSummary();
                res.json({
                    success: true,
                    data: summary
                });
            }
            catch (error) {
                logger_1.logger.error('Get stock summary controller error:', error);
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
        this.getLowStockItems = async (req, res) => {
            try {
                const lowStockItems = await this.stockService.getLowStockItems();
                res.json({
                    success: true,
                    data: lowStockItems
                });
            }
            catch (error) {
                logger_1.logger.error('Get low stock items controller error:', error);
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
        this.getDashboardSummary = async (req, res) => {
            try {
                const summary = {
                    totalProducts: 150,
                    lowStockItems: 8,
                    incomingStock: 25,
                    outgoingStock: 42,
                    totalValue: 125000,
                    averageStockTurnover: 4.2,
                    stockAlerts: 3
                };
                res.json({
                    success: true,
                    data: summary
                });
            }
            catch (error) {
                logger_1.logger.error('Get dashboard summary controller error:', error);
                res.status(500).json({
                    success: false,
                    message: 'Internal server error'
                });
            }
        };
        this.getTopConsumedItems = async (req, res) => {
            try {
                const limit = parseInt(req.query.limit) || 5;
                const topConsumed = [
                    { id: '1', name: 'Steel Sheets', consumed: 85, unit: 'kg', percentage: 25 },
                    { id: '2', name: 'Aluminum Rods', consumed: 65, unit: 'pcs', percentage: 19 },
                    { id: '3', name: 'Copper Wire', consumed: 55, unit: 'm', percentage: 16 },
                    { id: '4', name: 'Plastic Components', consumed: 45, unit: 'pcs', percentage: 13 },
                    { id: '5', name: 'Screws & Bolts', consumed: 35, unit: 'pcs', percentage: 10 }
                ].slice(0, limit);
                res.json({
                    success: true,
                    data: topConsumed
                });
            }
            catch (error) {
                logger_1.logger.error('Get top consumed items controller error:', error);
                res.status(500).json({
                    success: false,
                    message: 'Internal server error'
                });
            }
        };
        this.getStockDistribution = async (req, res) => {
            try {
                const distribution = [
                    { category: 'RAW_MATERIALS', name: 'Raw Materials', value: 75000, percentage: 60 },
                    { category: 'SEMI_FINISHED', name: 'Semi-Finished', value: 37500, percentage: 30 },
                    { category: 'FINISHED_GOODS', name: 'Finished Goods', value: 12500, percentage: 10 }
                ];
                res.json({
                    success: true,
                    data: distribution
                });
            }
            catch (error) {
                logger_1.logger.error('Get stock distribution controller error:', error);
                res.status(500).json({
                    success: false,
                    message: 'Internal server error'
                });
            }
        };
        this.getLowStockAlerts = async (req, res) => {
            try {
                const alerts = [
                    {
                        id: '1',
                        stockItemId: 'item-1',
                        stockItem: {
                            id: 'item-1',
                            name: 'Steel Sheets',
                            sku: 'STL-001',
                            onHand: 5,
                            reorderLevel: 20,
                            unit: 'kg'
                        },
                        severity: 'CRITICAL',
                        message: 'Stock level critically low',
                        createdAt: new Date().toISOString(),
                        acknowledged: false
                    },
                    {
                        id: '2',
                        stockItemId: 'item-2',
                        stockItem: {
                            id: 'item-2',
                            name: 'Copper Wire',
                            sku: 'COP-001',
                            onHand: 15,
                            reorderLevel: 30,
                            unit: 'm'
                        },
                        severity: 'LOW',
                        message: 'Stock level below reorder point',
                        createdAt: new Date().toISOString(),
                        acknowledged: false
                    }
                ];
                res.json({
                    success: true,
                    data: alerts
                });
            }
            catch (error) {
                logger_1.logger.error('Get low stock alerts controller error:', error);
                res.status(500).json({
                    success: false,
                    message: 'Internal server error'
                });
            }
        };
        this.stockService = new stock_service_1.StockService();
    }
}
exports.StockController = StockController;
//# sourceMappingURL=stock.controller.js.map