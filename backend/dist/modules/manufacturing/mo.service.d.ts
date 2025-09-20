import { CreateManufacturingOrderDto, UpdateManufacturingOrderDto } from './dto';
export declare class ManufacturingOrderService {
    createManufacturingOrder(data: CreateManufacturingOrderDto, userId: string): Promise<any>;
    getManufacturingOrders(page?: number, limit?: number, filters?: any): Promise<{
        orders: any[];
        pagination: {
            page: number;
            limit: number;
            total: number;
            pages: number;
        };
    }>;
    getManufacturingOrderById(id: string): Promise<any>;
    updateManufacturingOrder(id: string, data: UpdateManufacturingOrderDto, userId: string): Promise<any>;
    deleteManufacturingOrder(id: string, userId: string): Promise<{
        message: string;
    }>;
    getManufacturingOrderStats(): Promise<{
        total: number;
        planned: number;
        inProgress: number;
        completed: number;
        cancelled: number;
        urgent: number;
    }>;
    private generateOrderNumber;
    private createEvent;
}
//# sourceMappingURL=mo.service.d.ts.map