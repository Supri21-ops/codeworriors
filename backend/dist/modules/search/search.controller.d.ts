import { Request, Response } from 'express';
export declare class SearchController {
    searchManufacturingOrders(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    searchWorkOrders(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    getRecommendations(req: Request, res: Response): Promise<void>;
    getSearchAnalytics(req: Request, res: Response): Promise<void>;
}
export declare const searchController: SearchController;
//# sourceMappingURL=search.controller.d.ts.map