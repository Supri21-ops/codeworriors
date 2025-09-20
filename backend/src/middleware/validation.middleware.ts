import { Request, Response, NextFunction } from 'express';
import Joi from 'joi';
import { AppError } from '../libs/errors';

export const validateRequest = (schema: Joi.ObjectSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    console.log('\n🔍 VALIDATION MIDDLEWARE - Processing request');
    console.log('📦 Original request body:', JSON.stringify(req.body, null, 2));
    
    const { error, value } = schema.validate(req.body, {
      abortEarly: false,
      allowUnknown: false,
      stripUnknown: true
    });

    if (error) {
      console.log('❌ VALIDATION FAILED:');
      error.details.forEach((detail, index) => {
        console.log(`   ${index + 1}. ${detail.message}`);
      });
      
      const errorMessage = error.details
        .map(detail => detail.message)
        .join(', ');
      
      throw new AppError(`Validation error: ${errorMessage}`, 400);
    }

    console.log('✅ Validation passed');
    console.log('📦 Validated body:', JSON.stringify(value, null, 2));
    
    // Replace req.body with validated and sanitized data
    req.body = value;
    next();
  };
};

export const validateQuery = (schema: Joi.ObjectSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const { error, value } = schema.validate(req.query, {
      abortEarly: false,
      allowUnknown: false,
      stripUnknown: true
    });

    if (error) {
      const errorMessage = error.details
        .map(detail => detail.message)
        .join(', ');
      
      throw new AppError(`Query validation error: ${errorMessage}`, 400);
    }

    // Replace req.query with validated and sanitized data
    req.query = value;
    next();
  };
};

export const validateParams = (schema: Joi.ObjectSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const { error, value } = schema.validate(req.params, {
      abortEarly: false,
      allowUnknown: false,
      stripUnknown: true
    });

    if (error) {
      const errorMessage = error.details
        .map(detail => detail.message)
        .join(', ');
      
      throw new AppError(`Params validation error: ${errorMessage}`, 400);
    }

    // Replace req.params with validated and sanitized data
    req.params = value;
    next();
  };
};
