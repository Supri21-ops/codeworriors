export declare const db: {
    query: (sql: string, params?: any[]) => Promise<{
        rows: {
            id: string;
            email: any;
            password: any;
            name: any;
            role: any;
            created_at: Date;
            updated_at: Date;
        }[];
        rowCount: number;
    }>;
    connect: () => Promise<boolean>;
    disconnect: () => Promise<void>;
};
//# sourceMappingURL=database.d.ts.map