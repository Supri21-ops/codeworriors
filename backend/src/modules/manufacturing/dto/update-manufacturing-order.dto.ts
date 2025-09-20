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

export const updateManufacturingOrderSchema = Joi.object({
  quantity: Joi.number().positive().optional().messages({
    'number.positive': 'Quantity must be a positive number'
  }),
  priority: Joi.string().valid('LOW', 'NORMAL', 'HIGH', 'URGENT').optional().messages({
    'any.only': 'Priority must be one of: LOW, NORMAL, HIGH, URGENT'
  }),
  status: Joi.string().valid('PLANNED', 'RELEASED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED', 'ON_HOLD').optional().messages({
    'any.only': 'Status must be one of: PLANNED, RELEASED, IN_PROGRESS, COMPLETED, CANCELLED, ON_HOLD'
  }),
  startDate: Joi.date().iso().optional().messages({
    'date.format': 'Start date must be a valid ISO date'
  }),
  endDate: Joi.date().iso().optional().messages({
    'date.format': 'End date must be a valid ISO date'
  }),
  dueDate: Joi.date().iso().optional().messages({
    'date.format': 'Due date must be a valid ISO date'
  }),
  notes: Joi.string().max(500).optional().messages({
    'string.max': 'Notes must not exceed 500 characters'
  })
});
