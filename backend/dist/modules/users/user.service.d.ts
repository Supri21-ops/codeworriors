export declare class UserService {
    getUsers(page?: number, limit?: number, filters?: any): Promise<import("../../libs/pagination").PaginationResult<any>>;
    getUserById(id: string): Promise<any>;
    updateUser(id: string, data: any, currentUserId: string): Promise<any>;
    deleteUser(id: string, currentUserId: string): Promise<{
        message: string;
    }>;
    getUserStats(): Promise<{
        total: number;
        active: number;
        inactive: number;
        byRole: Record<string, number>;
    }>;
}
//# sourceMappingURL=user.service.d.ts.map