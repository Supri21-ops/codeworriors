"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StockService = void 0;
const mock_service_1 = require("../../services/mock.service");
class StockService extends mock_service_1.MockService {
    constructor() {
        super();
        this.data = [
            {
                id: '1',
                productId: '1',
                quantity: 100,
                location: 'Warehouse A',
                unitCost: 10,
                reorderLevel: 20,
                createdAt: new Date(),
                updatedAt: new Date()
            }
        ];
        this.idCounter = 2;
    }
    async getAllStockItems() { return this.findAll(); }
    async getStockItemById(id) { return this.findById(id); }
    async createStockItem(data) { return this.create(data); }
    async updateStockItem(id, data) { return this.update(id, data); }
    async deleteStockItem(id) { return this.delete(id); }
    async getStockMovements() { return []; }
    async createStockMovement(data, userId) { return { id: '1', ...data, userId }; }
    async getStockSummary() { return { totalValue: 1000, totalItems: this.data.length }; }
    async getLowStockItems() { return this.data.filter((item) => item.quantity < item.reorderLevel); }
}
exports.StockService = StockService;
//# sourceMappingURL=stock.service.js.map