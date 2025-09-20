import { DatabaseService } from '../../services/database.service';
export interface CreateBomData {
    name: string;
    description?: string;
    version?: string;
    items: {
        productId: string;
        quantity: number;
        unit?: string;
    }[];
}
export interface UpdateBomData {
    name?: string;
    description?: string;
    version?: string;
    isActive?: boolean;
    items?: {
        productId: string;
        quantity: number;
        unit?: string;
    }[];
}
export declare class BomService extends DatabaseService {
    constructor();
    getAllBoms(): Promise<any[]>;
    getBomById(id: string): Promise<any>;
    createBom(data: CreateBomData): Promise<any>;
    updateBom(id: string, data: UpdateBomData): Promise<any>;
    deleteBom(id: string): Promise<boolean>;
}
//# sourceMappingURL=bom.service.d.ts.map