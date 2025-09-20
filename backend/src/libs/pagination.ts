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

export class PaginationHelper {
  static validatePagination(page: number, limit: number): PaginationOptions {
    const validatedPage = Math.max(1, Math.floor(page) || 1);
    const validatedLimit = Math.min(100, Math.max(1, Math.floor(limit) || 10));
    
    return {
      page: validatedPage,
      limit: validatedLimit
    };
  }

  static calculateSkip(page: number, limit: number): number {
    return (page - 1) * limit;
  }

  static createPaginationResult<T>(
    data: T[],
    total: number,
    page: number,
    limit: number
  ): PaginationResult<T> {
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

  static getSortOptions(sortBy?: string, sortOrder?: string) {
    const order = sortOrder === 'desc' ? 'desc' : 'asc';
    
    if (!sortBy) {
      return { createdAt: order };
    }

    // Validate sortBy field to prevent injection
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