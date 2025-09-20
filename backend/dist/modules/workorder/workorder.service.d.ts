import { MockService } from '../../services/mock.service';
export declare class WorkOrderService extends MockService {
    constructor();
    getAllWorkOrders(filters?: any): Promise<any[]>;
    getWorkOrderById(id: string): Promise<any>;
    createWorkOrder(data: any): Promise<any>;
    updateWorkOrder(id: string, data: any): Promise<any>;
    deleteWorkOrder(id: string): Promise<boolean>;
    startWorkOrder(id: string, userId: string): Promise<any>;
    pauseWorkOrder(id: string, userId: string): Promise<any>;
    completeWorkOrder(id: string, userId: string): Promise<any>;
    cancelWorkOrder(id: string, userId: string, reason?: string): Promise<any>;
}
//# sourceMappingURL=workorder.service.d.ts.map