import { MockService } from '../../services/mock.service';
export declare class WorkCenterService extends MockService {
    constructor();
    getAllWorkCenters(): Promise<any[]>;
    getWorkCenterById(id: string): Promise<any>;
    createWorkCenter(data: any): Promise<any>;
    updateWorkCenter(id: string, data: any): Promise<any>;
    deleteWorkCenter(id: string): Promise<boolean>;
    getWorkCenterCapacity(id: string): Promise<{
        capacity: any;
        currentLoad: number;
    } | null>;
    updateWorkCenterCapacity(id: string, data: any): Promise<any>;
}
//# sourceMappingURL=workcenter.service.d.ts.map