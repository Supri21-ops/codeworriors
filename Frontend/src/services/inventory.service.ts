import { apiService } from './api';

export interface StockItem {
  id: string;
  productName: string;
  sku: string;
  workCenter: string;
  quantity: number;
  reservedQty: number;
  availableQty: number;
  minQty: number;
  maxQty: number;
  status: 'IN_STOCK' | 'LOW_STOCK' | 'OUT_OF_STOCK';
  lastUpdated: string;
  unitPrice?: number;
  totalValue?: number;
}

export interface InventoryFilters {
  status?: string;
  workCenter?: string;
  search?: string;
  page?: number;
  limit?: number;
}

export interface InventoryResponse {
  items: StockItem[];
  total: number;
  page: number;
  limit: number;
  summary: {
    totalItems: number;
    inStockItems: number;
    lowStockItems: number;
    outOfStockItems: number;
    totalValue: number;
  };
}

export interface StockMovement {
  id: string;
  stockItemId: string;
  type: 'IN' | 'OUT' | 'ADJUSTMENT';
  quantity: number;
  reason: string;
  reference?: string;
  createdBy: string;
  createdAt: string;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

class InventoryService {
  private readonly baseUrl = '/stock';

  async getInventory(filters?: InventoryFilters): Promise<InventoryResponse> {
    const params = new URLSearchParams();
    
    if (filters?.status) params.append('status', filters.status);
    if (filters?.workCenter) params.append('workCenter', filters.workCenter);
    if (filters?.search) params.append('search', filters.search);
    if (filters?.page) params.append('page', filters.page.toString());
    if (filters?.limit) params.append('limit', filters.limit.toString());

    const queryString = params.toString();
    const url = queryString ? `${this.baseUrl}?${queryString}` : this.baseUrl;
    
    const response = await apiService.get<ApiResponse<InventoryResponse>>(url);
    return response.data;
  }

  async getStockItem(id: string): Promise<StockItem> {
    const response = await apiService.get<ApiResponse<StockItem>>(`${this.baseUrl}/${id}`);
    return response.data;
  }

  async adjustStock(id: string, data: { quantity: number; reason: string }): Promise<StockItem> {
    const response = await apiService.post<ApiResponse<StockItem>>(`${this.baseUrl}/${id}/adjust`, data);
    return response.data;
  }

  async addStock(id: string, data: { quantity: number; reason: string; reference?: string }): Promise<StockItem> {
    const response = await apiService.post<ApiResponse<StockItem>>(`${this.baseUrl}/${id}/add`, data);
    return response.data;
  }

  async removeStock(id: string, data: { quantity: number; reason: string; reference?: string }): Promise<StockItem> {
    const response = await apiService.post<ApiResponse<StockItem>>(`${this.baseUrl}/${id}/remove`, data);
    return response.data;
  }

  async getStockMovements(itemId?: string): Promise<StockMovement[]> {
    const url = itemId ? `${this.baseUrl}/${itemId}/movements` : `${this.baseUrl}/movements`;
    const response = await apiService.get<ApiResponse<StockMovement[]>>(url);
    return response.data;
  }

  async createStockItem(data: Omit<StockItem, 'id' | 'lastUpdated' | 'availableQty' | 'status'>): Promise<StockItem> {
    const response = await apiService.post<ApiResponse<StockItem>>(this.baseUrl, data);
    return response.data;
  }

  async updateStockItem(id: string, data: Partial<Omit<StockItem, 'id' | 'lastUpdated' | 'availableQty' | 'status'>>): Promise<StockItem> {
    const response = await apiService.put<ApiResponse<StockItem>>(`${this.baseUrl}/${id}`, data);
    return response.data;
  }

  async deleteStockItem(id: string): Promise<void> {
    await apiService.delete(`${this.baseUrl}/${id}`);
  }

  async getTopConsumed(): Promise<any[]> {
    const response = await apiService.get<ApiResponse<any[]>>(`${this.baseUrl}/analytics/top-consumed`);
    return response.data;
  }

  async getStockDistribution(): Promise<any[]> {
    const response = await apiService.get<ApiResponse<any[]>>(`${this.baseUrl}/analytics/distribution`);
    return response.data;
  }
}

export const inventoryService = new InventoryService();