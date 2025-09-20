import { CreateManufacturingOrderDto, UpdateManufacturingOrderDto } from './dto';
export declare class ManufacturingOrderService {
    createManufacturingOrder(data: CreateManufacturingOrderDto, userId: string): Promise<any>;
    getManufacturingOrders(page?: number, limit?: number, filters?: any): Promise<{
        orders: any;
        pagination: {
            page: number;
            limit: number;
            total: any;
            pages: number;
        };
    }>;
    getManufacturingOrderById(id: string): Promise<any>;
    updateManufacturingOrder(id: string, data: UpdateManufacturingOrderDto, userId: string): Promise<any>;
    deleteManufacturingOrder(id: string, userId: string): Promise<{
        message: string;
    }>;
    getManufacturingOrderStats(): Promise<{
        total: any;
        planned: any;
        inProgress: any;
        completed: any;
        cancelled: any;
        urgent: any;
    }>;
    private generateOrderNumber;
    private createEvent;
}
//# sourceMappingURL=mo.service.d.ts.map