export interface PaginationOptions {
    page: number;
    limit: number;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
}
export interface PaginationResult<T> {
    data: T[];
    pagination: {
        page: number;
        limit: number;
        total: number;
        pages: number;
        hasNext: boolean;
        hasPrev: boolean;
    };
}
export declare class PaginationHelper {
    static validatePagination(page: number, limit: number): PaginationOptions;
    static calculateSkip(page: number, limit: number): number;
    static createPaginationResult<T>(data: T[], total: number, page: number, limit: number): PaginationResult<T>;
    static getSortOptions(sortBy?: string, sortOrder?: string): {
        createdAt: string;
    } | {
        [sortBy]: string;
        createdAt?: undefined;
    };
}
//# sourceMappingURL=pagination.d.ts.map