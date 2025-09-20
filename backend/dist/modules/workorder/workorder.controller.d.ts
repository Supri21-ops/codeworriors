import { Request, Response } from 'express';
export declare class WorkOrderController {
    private workOrderService;
    constructor();
    getWorkOrders: (req: Request, res: Response) => Promise<void>;
    getWorkOrderById: (req: Request, res: Response) => Promise<void>;
    createWorkOrder: (req: Request, res: Response) => Promise<void>;
    updateWorkOrder: (req: Request, res: Response) => Promise<void>;
    deleteWorkOrder: (req: Request, res: Response) => Promise<void>;
    startWorkOrder: (req: Request, res: Response) => Promise<void>;
    pauseWorkOrder: (req: Request, res: Response) => Promise<void>;
    completeWorkOrder: (req: Request, res: Response) => Promise<void>;
    cancelWorkOrder: (req: Request, res: Response) => Promise<void>;
}
//# sourceMappingURL=workorder.controller.d.ts.map