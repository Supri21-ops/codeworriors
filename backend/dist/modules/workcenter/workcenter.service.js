"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WorkCenterService = void 0;
const mock_service_1 = require("../../services/mock.service");
class WorkCenterService extends mock_service_1.MockService {
    constructor() {
        super();
        this.data = [
            {
                id: '1',
                name: 'Assembly Line A',
                description: 'Main assembly line',
                capacity: 50,
                isActive: true,
                createdAt: new Date(),
                updatedAt: new Date()
            }
        ];
        this.idCounter = 2;
    }
    async getAllWorkCenters() { return this.findAll(); }
    async getWorkCenterById(id) { return this.findById(id); }
    async createWorkCenter(data) { return this.create(data); }
    async updateWorkCenter(id, data) { return this.update(id, data); }
    async deleteWorkCenter(id) { return this.delete(id); }
    async getWorkCenterCapacity(id) {
        const wc = await this.findById(id);
        return wc ? { capacity: wc.capacity, currentLoad: 10 } : null;
    }
    async updateWorkCenterCapacity(id, data) {
        return this.update(id, { capacity: data.capacity });
    }
}
exports.WorkCenterService = WorkCenterService;
//# sourceMappingURL=workcenter.service.js.map