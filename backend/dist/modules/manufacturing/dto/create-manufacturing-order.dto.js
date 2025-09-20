"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createManufacturingOrderSchema = void 0;
const joi_1 = __importDefault(require("joi"));
exports.createManufacturingOrderSchema = joi_1.default.object({
    productId: joi_1.default.string().required().messages({
        'string.empty': 'Product ID is required',
        'any.required': 'Product ID is required'
    }),
    quantity: joi_1.default.number().positive().required().messages({
        'number.positive': 'Quantity must be a positive number',
        'any.required': 'Quantity is required'
    }),
    priority: joi_1.default.string().valid('LOW', 'NORMAL', 'HIGH', 'URGENT').optional().messages({
        'any.only': 'Priority must be one of: LOW, NORMAL, HIGH, URGENT'
    }),
    dueDate: joi_1.default.date().iso().required().messages({
        'date.format': 'Due date must be a valid ISO date',
        'any.required': 'Due date is required'
    }),
    notes: joi_1.default.string().max(500).optional().messages({
        'string.max': 'Notes must not exceed 500 characters'
    })
});
//# sourceMappingURL=create-manufacturing-order.dto.js.map