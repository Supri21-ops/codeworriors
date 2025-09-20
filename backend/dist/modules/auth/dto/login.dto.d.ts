import Joi from 'joi';
export interface LoginDto {
    emailOrUsername: string;
    password: string;
}
export declare const loginSchema: Joi.ObjectSchema<any>;
//# sourceMappingURL=login.dto.d.ts.map