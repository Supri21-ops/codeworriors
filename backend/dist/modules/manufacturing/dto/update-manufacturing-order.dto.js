"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateManufacturingOrderSchema = void 0;
const joi_1 = __importDefault(require("joi"));
exports.updateManufacturingOrderSchema = joi_1.default.object({
    quantity: joi_1.default.number().positive().optional().messages({
        'number.positive': 'Quantity must be a positive number'
    }),
    priority: joi_1.default.string().valid('LOW', 'NORMAL', 'HIGH', 'URGENT').optional().messages({
        'any.only': 'Priority must be one of: LOW, NORMAL, HIGH, URGENT'
    }),
    status: joi_1.default.string().valid('PLANNED', 'RELEASED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED', 'ON_HOLD').optional().messages({
        'any.only': 'Status must be one of: PLANNED, RELEASED, IN_PROGRESS, COMPLETED, CANCELLED, ON_HOLD'
    }),
    startDate: joi_1.default.date().iso().optional().messages({
        'date.format': 'Start date must be a valid ISO date'
    }),
    endDate: joi_1.default.date().iso().optional().messages({
        'date.format': 'End date must be a valid ISO date'
    }),
    dueDate: joi_1.default.date().iso().optional().messages({
        'date.format': 'Due date must be a valid ISO date'
    }),
    notes: joi_1.default.string().max(500).optional().messages({
        'string.max': 'Notes must not exceed 500 characters'
    })
});
//# sourceMappingURL=update-manufacturing-order.dto.js.map