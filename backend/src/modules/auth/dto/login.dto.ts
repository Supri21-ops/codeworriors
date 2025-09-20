import Joi from 'joi';

export interface LoginDto {
  emailOrUsername: string;
  password: string;
}

export const loginSchema = Joi.object({
  emailOrUsername: Joi.string().required().messages({
    'string.empty': 'Email or username is required',
    'any.required': 'Email or username is required'
  }),
  password: Joi.string().required().min(6).messages({
    'string.empty': 'Password is required',
    'string.min': 'Password must be at least 6 characters long',
    'any.required': 'Password is required'
  })
});