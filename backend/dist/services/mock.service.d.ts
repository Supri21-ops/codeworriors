export declare class MockService {
    protected data: any[];
    protected idCounter: number;
    findAll(): Promise<any[]>;
    findById(id: string): Promise<any>;
    create(data: any): Promise<any>;
    update(id: string, data: any): Promise<any>;
    delete(id: string): Promise<boolean>;
}
//# sourceMappingURL=mock.service.d.ts.map