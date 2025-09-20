"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginSchema = void 0;
const joi_1 = __importDefault(require("joi"));
exports.loginSchema = joi_1.default.object({
    emailOrUsername: joi_1.default.string().required().messages({
        'string.empty': 'Email or username is required',
        'any.required': 'Email or username is required'
    }),
    password: joi_1.default.string().required().min(6).messages({
        'string.empty': 'Password is required',
        'string.min': 'Password must be at least 6 characters long',
        'any.required': 'Password is required'
    })
});
//# sourceMappingURL=login.dto.js.map