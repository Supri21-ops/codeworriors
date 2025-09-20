"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MockService = void 0;
const logger_1 = require("../config/logger");
class MockService {
    constructor() {
        this.data = [];
        this.idCounter = 1;
    }
    async findAll() {
        logger_1.logger.info(`Mock service findAll called, returning ${this.data.length} items`);
        return this.data;
    }
    async findById(id) {
        logger_1.logger.info(`Mock service findById called with id: ${id}`);
        const item = this.data.find(item => item.id === id);
        return item || null;
    }
    async create(data) {
        logger_1.logger.info('Mock service create called with data:', data);
        const newItem = {
            id: this.idCounter.toString(),
            ...data,
            createdAt: new Date(),
            updatedAt: new Date()
        };
        this.data.push(newItem);
        this.idCounter++;
        return newItem;
    }
    async update(id, data) {
        logger_1.logger.info(`Mock service update called with id: ${id} and data:`, data);
        const index = this.data.findIndex(item => item.id === id);
        if (index === -1) {
            return null;
        }
        this.data[index] = {
            ...this.data[index],
            ...data,
            updatedAt: new Date()
        };
        return this.data[index];
    }
    async delete(id) {
        logger_1.logger.info(`Mock service delete called with id: ${id}`);
        const index = this.data.findIndex(item => item.id === id);
        if (index === -1) {
            return false;
        }
        this.data.splice(index, 1);
        return true;
    }
}
exports.MockService = MockService;
//# sourceMappingURL=mock.service.js.map