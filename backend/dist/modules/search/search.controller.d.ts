import { Request, Response } from 'express';
export declare class SearchController {
    searchManufacturingOrders(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    searchWorkOrders(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    searchProducts(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    getRecommendations(req: Request, res: Response): Promise<void>;
    getSearchAnalytics(req: Request, res: Response): Promise<void>;
}
export declare const searchController: SearchController;
//# sourceMappingURL=search.controller.d.ts.map