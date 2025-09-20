import Joi from 'joi';
export interface SignupDto {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    role?: 'ADMIN' | 'MANAGER' | 'SUPERVISOR' | 'OPERATOR' | 'USER';
}
export declare const signupSchema: Joi.ObjectSchema<any>;
//# sourceMappingURL=signup.dto.d.ts.map