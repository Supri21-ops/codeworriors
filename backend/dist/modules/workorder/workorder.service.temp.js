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
}
exports.WorkOrderService = WorkOrderService;
//# sourceMappingURL=workorder.service.temp.js.map