export declare const db: {
    query: (text: string, params?: any[]) => Promise<{
        rows: any[];
        rowCount: number;
        command: string;
    }>;
    connect: () => Promise<boolean>;
    disconnect: () => Promise<void>;
};
//# sourceMappingURL=database-docker.d.ts.map