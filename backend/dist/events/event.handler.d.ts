import { EachMessagePayload } from 'kafkajs';
export declare class EventHandler {
    handleManufacturingOrderEvent(payload: EachMessagePayload): Promise<void>;
    handleWorkOrderEvent(payload: EachMessagePayload): Promise<void>;
    handleInventoryEvent(payload: EachMessagePayload): Promise<void>;
    handlePriorityEvent(payload: EachMessagePayload): Promise<void>;
    handleVectorSearchEvent(payload: EachMessagePayload): Promise<void>;
    private handleManufacturingOrderCreated;
    private handleManufacturingOrderUpdated;
    private handleManufacturingOrderCompleted;
    private handleManufacturingOrderCancelled;
    private handleWorkOrderCreated;
    private handleWorkOrderStarted;
    private handleWorkOrderCompleted;
    private handleWorkOrderCancelled;
    private handleStockMovement;
    private handleLowStockAlert;
    private handleOutOfStockAlert;
    private handlePriorityUpdated;
    private handlePriorityChanged;
    private handleScheduleOptimized;
    private handleDocumentIndexed;
    private handleSearchPerformed;
    private handleRecommendationsGenerated;
    private createNotification;
}
export declare const eventHandler: EventHandler;
//# sourceMappingURL=event.handler.d.ts.map