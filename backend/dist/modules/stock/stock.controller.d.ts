import { Request, Response } from 'express';
export declare class StockController {
    private stockService;
    constructor();
    getStockItems: (req: Request, res: Response) => Promise<void>;
    getStockItemById: (req: Request, res: Response) => Promise<void>;
    createStockItem: (req: Request, res: Response) => Promise<void>;
    updateStockItem: (req: Request, res: Response) => Promise<void>;
    deleteStockItem: (req: Request, res: Response) => Promise<void>;
    getStockMovements: (req: Request, res: Response) => Promise<void>;
    createStockMovement: (req: Request, res: Response) => Promise<void>;
    getStockSummary: (req: Request, res: Response) => Promise<void>;
    getLowStockItems: (req: Request, res: Response) => Promise<void>;
    getDashboardSummary: (req: Request, res: Response) => Promise<void>;
    getTopConsumedItems: (req: Request, res: Response) => Promise<void>;
    getStockDistribution: (req: Request, res: Response) => Promise<void>;
    getLowStockAlerts: (req: Request, res: Response) => Promise<void>;
}
//# sourceMappingURL=stock.controller.d.ts.map