interface PriorityScore {
    baseScore: number;
    urgencyMultiplier: number;
    deadlineFactor: number;
    resourceAvailability: number;
    customerTier: number;
    totalScore: number;
}
interface PriorityQueueItem {
    id: string;
    type: 'MANUFACTURING_ORDER' | 'WORK_ORDER';
    priority: number;
    dueDate: Date;
    estimatedDuration: number;
    resourceRequirements: string[];
    metadata: any;
}
export declare class PriorityService {
    private readonly URGENCY_WEIGHTS;
    private readonly CUSTOMER_TIER_WEIGHTS;
    calculatePriorityScore(orderId: string, type: 'MANUFACTURING_ORDER' | 'WORK_ORDER'): Promise<PriorityScore>;
    private calculateUrgencyMultiplier;
    private calculateDeadlineFactor;
    private calculateResourceAvailability;
    private updatePriorityScore;
    getPriorityQueue(workCenterId?: string, limit?: number): Promise<PriorityQueueItem[]>;
    private calculateEstimatedDuration;
    optimizeSchedule(workCenterId: string): Promise<PriorityQueueItem[]>;
    private applyOptimizationAlgorithm;
    private updateWorkOrderPriorities;
    getPriorityAnalytics(timeRange?: 'day' | 'week' | 'month'): Promise<any[]>;
    handlePriorityChange(orderId: string, newPriority: string, reason: string): Promise<void>;
}
export declare const priorityService: PriorityService;
export {};
//# sourceMappingURL=priority.service.d.ts.map