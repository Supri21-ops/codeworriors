"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaginationHelper = void 0;
class PaginationHelper {
    static validatePagination(page, limit) {
        const validatedPage = Math.max(1, Math.floor(page) || 1);
        const validatedLimit = Math.min(100, Math.max(1, Math.floor(limit) || 10));
        return {
            page: validatedPage,
            limit: validatedLimit
        };
    }
    static calculateSkip(page, limit) {
        return (page - 1) * limit;
    }
    static createPaginationResult(data, total, page, limit) {
        const pages = Math.ceil(total / limit);
        return {
            data,
            pagination: {
                page,
                limit,
                total,
                pages,
                hasNext: page < pages,
                hasPrev: page > 1
            }
        };
    }
    static getSortOptions(sortBy, sortOrder) {
        const order = sortOrder === 'desc' ? 'desc' : 'asc';
        if (!sortBy) {
            return { createdAt: order };
        }
        const allowedSortFields = [
            'createdAt',
            'updatedAt',
            'name',
            'email',
            'status',
            'priority',
            'quantity',
            'dueDate'
        ];
        if (allowedSortFields.includes(sortBy)) {
            return { [sortBy]: order };
        }
        return { createdAt: order };
    }
}
exports.PaginationHelper = PaginationHelper;
//# sourceMappingURL=pagination.js.map