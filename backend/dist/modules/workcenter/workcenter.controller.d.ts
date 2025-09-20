import { Request, Response } from 'express';
export declare class WorkCenterController {
    private workCenterService;
    constructor();
    getWorkCenters: (req: Request, res: Response) => Promise<void>;
    getWorkCenterById: (req: Request, res: Response) => Promise<void>;
    createWorkCenter: (req: Request, res: Response) => Promise<void>;
    updateWorkCenter: (req: Request, res: Response) => Promise<void>;
    deleteWorkCenter: (req: Request, res: Response) => Promise<void>;
    getWorkCenterCapacity: (req: Request, res: Response) => Promise<void>;
    updateWorkCenterCapacity: (req: Request, res: Response) => Promise<void>;
}
//# sourceMappingURL=workcenter.controller.d.ts.map