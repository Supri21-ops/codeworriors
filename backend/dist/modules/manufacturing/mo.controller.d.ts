import { Request, Response } from 'express';
export declare class ManufacturingOrderController {
    private manufacturingOrderService;
    constructor();
    createManufacturingOrder: (req: Request, res: Response) => Promise<void>;
    getManufacturingOrders: (req: Request, res: Response) => Promise<void>;
    getManufacturingOrderById: (req: Request, res: Response) => Promise<void>;
    updateManufacturingOrder: (req: Request, res: Response) => Promise<void>;
    deleteManufacturingOrder: (req: Request, res: Response) => Promise<void>;
    getManufacturingOrderStats: (req: Request, res: Response) => Promise<void>;
}
//# sourceMappingURL=mo.controller.d.ts.map