interface VectorSearchResult {
    id: string;
    content: string;
    similarity: number;
    metadata: any;
}
interface SearchOptions {
    limit?: number;
    threshold?: number;
    filters?: Record<string, any>;
}
export declare class VectorService {
    private readonly EMBEDDING_DIMENSION;
    createEmbedding(text: string): Promise<number[]>;
    indexDocument(id: string, content: string, metadata?: any, collection?: string): Promise<void>;
    searchSimilar(query: string, collection?: string, options?: SearchOptions): Promise<VectorSearchResult[]>;
    searchManufacturingOrders(query: string, filters?: any): Promise<{
        orderData: any;
        id: string;
        content: string;
        similarity: number;
        metadata: any;
    }[]>;
    searchProducts(query: string, filters?: any): Promise<{
        productData: any;
        id: string;
        content: string;
        similarity: number;
        metadata: any;
    }[]>;
    getRecommendations(orderId: string, type?: 'similar_orders' | 'recommended_products'): Promise<{
        orderData: any;
        id: string;
        content: string;
        similarity: number;
        metadata: any;
    }[] | {
        productData: any;
        id: string;
        content: string;
        similarity: number;
        metadata: any;
    }[]>;
    updateDocumentEmbedding(id: string, content: string, metadata?: any): Promise<void>;
    deleteDocument(id: string): Promise<void>;
    getCollectionStats(collection: string): Promise<{
        collection: string;
        documentCount: any;
    }>;
}
export declare const vectorService: VectorService;
export {};
//# sourceMappingURL=vector.service.d.ts.map