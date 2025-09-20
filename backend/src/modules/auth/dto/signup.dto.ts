import Joi from 'joi';

export interface SignupDto {
  email: string;
  username: string;
  password: string;
  firstName: string;
  lastName: string;
  role?: 'ADMIN' | 'MANAGER' | 'SUPERVISOR' | 'OPERATOR' | 'USER';
}

export const signupSchema = Joi.object({
  email: Joi.string().email().required().messages({
    'string.email': 'Please provide a valid email address',
    'string.empty': 'Email is required',
    'any.required': 'Email is required'
  }),
  username: Joi.string().alphanum().min(3).max(30).required().messages({
    'string.alphanum': 'Username must contain only alphanumeric characters',
    'string.min': 'Username must be at least 3 characters long',
    'string.max': 'Username must not exceed 30 characters',
    'string.empty': 'Username is required',
    'any.required': 'Username is required'
  }),
  password: Joi.string().min(6).required().messages({
    'string.min': 'Password must be at least 6 characters long',
    'string.empty': 'Password is required',
    'any.required': 'Password is required'
  }),
  firstName: Joi.string().min(2).max(50).required().messages({
    'string.min': 'First name must be at least 2 characters long',
    'string.max': 'First name must not exceed 50 characters',
    'string.empty': 'First name is required',
    'any.required': 'First name is required'
  }),
  lastName: Joi.string().min(2).max(50).required().messages({
    'string.min': 'Last name must be at least 2 characters long',
    'string.max': 'Last name must not exceed 50 characters',
    'string.empty': 'Last name is required',
    'any.required': 'Last name is required'
  }),
  role: Joi.string().valid('ADMIN', 'MANAGER', 'SUPERVISOR', 'OPERATOR', 'USER').optional().messages({
    'any.only': 'Role must be one of: ADMIN, MANAGER, SUPERVISOR, OPERATOR, USER'
  })
});