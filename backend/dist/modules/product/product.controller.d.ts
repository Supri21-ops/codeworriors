import { Request, Response } from 'express';
export declare class ProductController {
    private productService;
    constructor();
    getProducts: (req: Request, res: Response) => Promise<void>;
    getProductById: (req: Request, res: Response) => Promise<void>;
    createProduct: (req: Request, res: Response) => Promise<void>;
    updateProduct: (req: Request, res: Response) => Promise<void>;
    deleteProduct: (req: Request, res: Response) => Promise<void>;
}
//# sourceMappingURL=product.controller.d.ts.map