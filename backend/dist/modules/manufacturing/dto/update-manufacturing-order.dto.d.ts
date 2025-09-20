import Joi from 'joi';
export interface UpdateManufacturingOrderDto {
    quantity?: number;
    priority?: 'LOW' | 'NORMAL' | 'HIGH' | 'URGENT';
    status?: 'PLANNED' | 'RELEASED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED' | 'ON_HOLD';
    startDate?: string;
    endDate?: string;
    dueDate?: string;
    notes?: string;
}
export declare const updateManufacturingOrderSchema: Joi.ObjectSchema<any>;
//# sourceMappingURL=update-manufacturing-order.dto.d.ts.map