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
}
exports.WorkCenterService = WorkCenterService;
//# sourceMappingURL=workcenter.service.temp.js.map