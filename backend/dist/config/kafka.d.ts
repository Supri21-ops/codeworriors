import { Consumer, EachMessagePayload } from 'kafkajs';
declare class KafkaService {
    private kafka;
    private producer;
    private consumers;
    constructor();
    connect(): Promise<void>;
    disconnect(): Promise<void>;
    publishEvent(topic: string, event: any, partition?: number): Promise<import("kafkajs").RecordMetadata[]>;
    createConsumer(groupId: string, topics: string[]): Promise<Consumer>;
    startConsumer(groupId: string, topics: string[], messageHandler: (payload: EachMessagePayload) => Promise<void>): Promise<Consumer>;
    publishManufacturingOrderEvent(eventType: string, data: any): Promise<import("kafkajs").RecordMetadata[]>;
    publishWorkOrderEvent(eventType: string, data: any): Promise<import("kafkajs").RecordMetadata[]>;
    publishInventoryEvent(eventType: string, data: any): Promise<import("kafkajs").RecordMetadata[]>;
    publishPriorityEvent(eventType: string, data: any): Promise<import("kafkajs").RecordMetadata[]>;
    publishVectorSearchEvent(eventType: string, data: any): Promise<import("kafkajs").RecordMetadata[]>;
}
export declare const kafkaService: KafkaService;
export default kafkaService;
//# sourceMappingURL=kafka.d.ts.map