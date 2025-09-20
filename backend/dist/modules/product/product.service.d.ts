import { MockService } from '../../services/mock.service';
export declare class ProductService extends MockService {
    constructor();
    getAllProducts(filters?: any): Promise<any[]>;
    getProductById(id: string): Promise<any>;
    createProduct(data: any): Promise<any>;
    updateProduct(id: string, data: any): Promise<any>;
    deleteProduct(id: string): Promise<boolean>;
}
//# sourceMappingURL=product.service.d.ts.map