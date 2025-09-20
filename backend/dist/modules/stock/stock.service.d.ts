import { MockService } from '../../services/mock.service';
export declare class StockService extends MockService {
    constructor();
    getAllStockItems(): Promise<any[]>;
    getStockItemById(id: string): Promise<any>;
    createStockItem(data: any): Promise<any>;
    updateStockItem(id: string, data: any): Promise<any>;
    deleteStockItem(id: string): Promise<boolean>;
    getStockMovements(): Promise<never[]>;
    createStockMovement(data: any, userId: string): Promise<any>;
    getStockSummary(): Promise<{
        totalValue: number;
        totalItems: number;
    }>;
    getLowStockItems(): Promise<any[]>;
}
//# sourceMappingURL=stock.service.d.ts.map