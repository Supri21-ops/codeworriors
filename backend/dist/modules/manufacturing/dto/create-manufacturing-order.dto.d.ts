import Joi from 'joi';
export interface CreateManufacturingOrderDto {
    productId: string;
    quantity: number;
    priority?: 'LOW' | 'NORMAL' | 'HIGH' | 'URGENT';
    dueDate: string;
    notes?: string;
}
export declare const createManufacturingOrderSchema: Joi.ObjectSchema<any>;
//# sourceMappingURL=create-manufacturing-order.dto.d.ts.map