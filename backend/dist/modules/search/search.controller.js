"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.searchController = exports.SearchController = void 0;
const vector_service_1 = require("../../services/vector.service");
const logger_1 = require("../../config/logger");
class SearchController {
    async searchManufacturingOrders(req, res) {
        try {
            const { query, filters = {} } = req.body;
            const userId = req.user?.id;
            if (!query) {
                return res.status(400).json({ success: false, message: 'Search query is required' });
            }
            const results = await vector_service_1.vectorService.searchManufacturingOrders(query, filters);
            res.json({ success: true, data: results, total: results.length });
        }
        catch (error) {
            logger_1.logger.error('Search manufacturing orders error:', error);
            res.status(500).json({ success: false, message: 'Internal server error' });
        }
    }
    async searchWorkOrders(req, res) {
        try {
            const { query, filters = {} } = req.body;
            const userId = req.user?.id;
            if (!query) {
                return res.status(400).json({ success: false, message: 'Search query is required' });
            }
            const results = await vector_service_1.vectorService.searchManufacturingOrders(query, { ...filters, type: 'work_order' });
            res.json({ success: true, data: results, total: results.length });
        }
        catch (error) {
            logger_1.logger.error('Search work orders error:', error);
            res.status(500).json({ success: false, message: 'Internal server error' });
        }
    }
    async getRecommendations(req, res) {
        try {
            const { orderId } = req.params;
            const type = req.query.type === 'recommended_products' ? 'recommended_products' : 'similar_orders';
            const recommendations = await vector_service_1.vectorService.getRecommendations(orderId, type);
            res.json({ success: true, data: recommendations });
        }
        catch (error) {
            logger_1.logger.error('Get recommendations error:', error);
            res.status(500).json({ success: false, message: 'Internal server error' });
        }
    }
    async getSearchAnalytics(req, res) {
        try {
            const analytics = await vector_service_1.vectorService.getCollectionStats('manufacturing-orders');
            const productAnalytics = await vector_service_1.vectorService.getCollectionStats('products');
            res.json({ success: true, manufacturingOrders: analytics, products: productAnalytics });
        }
        catch (error) {
            logger_1.logger.error('Get search analytics error:', error);
            res.status(500).json({ success: false, message: 'Internal server error' });
        }
    }
}
exports.SearchController = SearchController;
exports.searchController = new SearchController();
//# sourceMappingURL=search.controller.js.map