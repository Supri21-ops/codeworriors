"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateParams = exports.validateQuery = exports.validateRequest = void 0;
const errors_1 = require("../libs/errors");
const validateRequest = (schema) => {
    return (req, res, next) => {
        const { error, value } = schema.validate(req.body, {
            abortEarly: false,
            allowUnknown: false,
            stripUnknown: true
        });
        if (error) {
            const errorMessage = error.details
                .map(detail => detail.message)
                .join(', ');
            throw new errors_1.AppError(`Validation error: ${errorMessage}`, 400);
        }
        req.body = value;
        next();
    };
};
exports.validateRequest = validateRequest;
const validateQuery = (schema) => {
    return (req, res, next) => {
        const { error, value } = schema.validate(req.query, {
            abortEarly: false,
            allowUnknown: false,
            stripUnknown: true
        });
        if (error) {
            const errorMessage = error.details
                .map(detail => detail.message)
                .join(', ');
            throw new errors_1.AppError(`Query validation error: ${errorMessage}`, 400);
        }
        req.query = value;
        next();
    };
};
exports.validateQuery = validateQuery;
const validateParams = (schema) => {
    return (req, res, next) => {
        const { error, value } = schema.validate(req.params, {
            abortEarly: false,
            allowUnknown: false,
            stripUnknown: true
        });
        if (error) {
            const errorMessage = error.details
                .map(detail => detail.message)
                .join(', ');
            throw new errors_1.AppError(`Params validation error: ${errorMessage}`, 400);
        }
        req.params = value;
        next();
    };
};
exports.validateParams = validateParams;
//# sourceMappingURL=validation.middleware.js.map