import { Request, Response } from 'express';
export declare class BomController {
    private bomService;
    constructor();
    getBoms: (req: Request, res: Response) => Promise<void>;
    getBomById: (req: Request, res: Response) => Promise<void>;
    createBom: (req: Request, res: Response) => Promise<void>;
    updateBom: (req: Request, res: Response) => Promise<void>;
    deleteBom: (req: Request, res: Response) => Promise<void>;
}
//# sourceMappingURL=bom.controller.d.ts.map