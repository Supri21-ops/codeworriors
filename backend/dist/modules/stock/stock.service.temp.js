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
}
exports.StockService = StockService;
//# sourceMappingURL=stock.service.temp.js.map