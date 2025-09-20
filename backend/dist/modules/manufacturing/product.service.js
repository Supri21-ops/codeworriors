"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductService = void 0;
const mock_service_1 = require("../../services/mock.service");
class ProductService extends mock_service_1.MockService {
    constructor() {
        super();
        this.data = [
            {
                id: '1',
                name: 'Sample Product',
                description: 'Mock product',
                price: 100,
                createdAt: new Date(),
                updatedAt: new Date()
            }
        ];
        this.idCounter = 2;
    }
}
exports.ProductService = ProductService;
//# sourceMappingURL=product.service.js.map