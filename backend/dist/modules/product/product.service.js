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
                sku: 'PROD-001',
                category: 'Electronics',
                createdAt: new Date(),
                updatedAt: new Date()
            }
        ];
        this.idCounter = 2;
    }
    async getAllProducts(filters) {
        return this.findAll();
    }
    async getProductById(id) {
        return this.findById(id);
    }
    async createProduct(data) {
        return this.create(data);
    }
    async updateProduct(id, data) {
        return this.update(id, data);
    }
    async deleteProduct(id) {
        return this.delete(id);
    }
}
exports.ProductService = ProductService;
//# sourceMappingURL=product.service.js.map