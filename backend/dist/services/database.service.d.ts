export declare abstract class DatabaseService {
    protected tableName: string;
    constructor(tableName: string);
    findAll(options?: {
        where?: Record<string, any>;
        orderBy?: string;
        limit?: number;
        offset?: number;
    }): Promise<any[]>;
    findById(id: string): Promise<any>;
    create(data: Record<string, any>): Promise<any>;
    update(id: string, data: Record<string, any>): Promise<any>;
    delete(id: string): Promise<boolean>;
}
//# sourceMappingURL=database.service.d.ts.map