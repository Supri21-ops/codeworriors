"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WorkOrderService = void 0;
const mock_service_1 = require("../../services/mock.service");
class WorkOrderService extends mock_service_1.MockService {
    constructor() {
        super();
        this.data = [
            {
                id: '1',
                orderNumber: 'WO-001',
                productId: '1',
                quantity: 10,
                status: 'PENDING',
                priority: 'MEDIUM',
                dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
                createdAt: new Date(),
                updatedAt: new Date()
            }
        ];
        this.idCounter = 2;
    }
    async getAllWorkOrders(filters) { return this.findAll(); }
    async getWorkOrderById(id) { return this.findById(id); }
    async createWorkOrder(data) { return this.create(data); }
    async updateWorkOrder(id, data) { return this.update(id, data); }
    async deleteWorkOrder(id) { return this.delete(id); }
    async startWorkOrder(id, userId) {
        return this.update(id, { status: 'IN_PROGRESS', startedBy: userId, startedAt: new Date() });
    }
    async pauseWorkOrder(id, userId) {
        return this.update(id, { status: 'PAUSED', pausedBy: userId, pausedAt: new Date() });
    }
    async completeWorkOrder(id, userId) {
        return this.update(id, { status: 'COMPLETED', completedBy: userId, completedAt: new Date() });
    }
    async cancelWorkOrder(id, userId, reason) {
        return this.update(id, { status: 'CANCELLED', cancelledBy: userId, cancelledAt: new Date(), cancelReason: reason });
    }
}
exports.WorkOrderService = WorkOrderService;
//# sourceMappingURL=workorder.service.js.map