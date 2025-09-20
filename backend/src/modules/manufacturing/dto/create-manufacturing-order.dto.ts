import Joi from 'joi';

export interface CreateManufacturingOrderDto {
  productId: string;
  quantity: number;
  priority?: 'LOW' | 'NORMAL' | 'HIGH' | 'URGENT';
  dueDate: string;
  notes?: string;
}

export const createManufacturingOrderSchema = Joi.object({
  productId: Joi.string().required().messages({
    'string.empty': 'Product ID is required',
    'any.required': 'Product ID is required'
  }),
  quantity: Joi.number().positive().required().messages({
    'number.positive': 'Quantity must be a positive number',
    'any.required': 'Quantity is required'
  }),
  priority: Joi.string().valid('LOW', 'NORMAL', 'HIGH', 'URGENT').optional().messages({
    'any.only': 'Priority must be one of: LOW, NORMAL, HIGH, URGENT'
  }),
  dueDate: Joi.date().iso().required().messages({
    'date.format': 'Due date must be a valid ISO date',
    'any.required': 'Due date is required'
  }),
  notes: Joi.string().max(500).optional().messages({
    'string.max': 'Notes must not exceed 500 characters'
  })
});
