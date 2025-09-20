import { apiService } from './api';

// Types
export interface StockDashboardSummary {
  totalProducts: number;
  lowStockItems: number;
  incomingStock: number;
  outgoingStock: number;
  totalValue: number;
  averageStockTurnover: number;
  stockAlerts: number;
}

export interface TopConsumedItem {
  id: string;
  name: string;
  consumed: number;
  unit: string;
  percentage: number;
}

export interface StockDistribution {
  category: 'RAW_MATERIALS' | 'SEMI_FINISHED' | 'FINISHED_GOODS';
  name: string;
  value: number;
  percentage: number;
}

export interface StockTableItem {
  id: string;
  product: string;
  sku: string;
  category: string;
  unitCost: number;
  unit: string;
  totalValue: number;
  onHand: number;
  freeToUse: number;
  reserved: number;
  incoming: number;
  outgoing: number;
  reorderLevel: number;
  maxLevel: number;
  lastMovement: string;
  status: 'IN_STOCK' | 'LOW_STOCK' | 'OUT_OF_STOCK' | 'OVERSTOCK';
}

export interface StockMovement {
  id: string;
  stockItemId: string;
  stockItem: {
    id: string;
    name: string;
    sku: string;
  };
  type: 'IN' | 'OUT' | 'ADJUSTMENT' | 'TRANSFER';
  quantity: number;
  unit: string;
  unitCost: number;
  totalValue: number;
  reference?: string;
  reason?: string;
  fromLocation?: string;
  toLocation?: string;
  createdBy: {
    id: string;
    firstName: string;
    lastName: string;
  };
  createdAt: string;
}

export interface LowStockAlert {
  id: string;
  stockItemId: string;
  stockItem: {
    id: string;
    name: string;
    sku: string;
    onHand: number;
    reorderLevel: number;
    unit: string;
  };
  severity: 'LOW' | 'CRITICAL' | 'OUT_OF_STOCK';
  message: string;
  createdAt: string;
  acknowledged: boolean;
}

export interface StockFilters {
  category?: string;
  status?: string;
  search?: string;
  page?: number;
  limit?: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

export class StockDashboardService {
  private baseUrl = '/api/stock';

  // Get stock dashboard summary
  async getDashboardSummary(): Promise<StockDashboardSummary> {
    try {
      const response = await apiService.get(`${this.baseUrl}/dashboard/summary`);
      return response.data;
    } catch (error) {
      console.error('Error fetching stock dashboard summary:', error);
      // Fallback to mock data
      return this.getMockDashboardSummary();
    }
  }

  // Get top consumed items
  async getTopConsumedItems(limit: number = 5): Promise<TopConsumedItem[]> {
    try {
      const response = await apiService.get(`${this.baseUrl}/dashboard/top-consumed?limit=${limit}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching top consumed items:', error);
      return this.getMockTopConsumedItems();
    }
  }

  // Get stock distribution
  async getStockDistribution(): Promise<StockDistribution[]> {
    try {
      const response = await apiService.get(`${this.baseUrl}/dashboard/distribution`);
      return response.data;
    } catch (error) {
      console.error('Error fetching stock distribution:', error);
      return this.getMockStockDistribution();
    }
  }

  // Get stock table data
  async getStockTableData(filters?: StockFilters): Promise<PaginatedResponse<StockTableItem>> {
    try {
      const params = new URLSearchParams();
      if (filters) {
        Object.entries(filters).forEach(([key, value]) => {
          if (value !== undefined && value !== null) {
            params.append(key, value.toString());
          }
        });
      }

      const response = await apiService.get(`${this.baseUrl}/items?${params.toString()}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching stock table data:', error);
      return this.getMockStockTableData(filters);
    }
  }

  // Get stock movements
  async getStockMovements(limit: number = 20): Promise<StockMovement[]> {
    try {
      const response = await apiService.get(`${this.baseUrl}/movements?limit=${limit}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching stock movements:', error);
      return this.getMockStockMovements();
    }
  }

  // Get low stock alerts
  async getLowStockAlerts(): Promise<LowStockAlert[]> {
    try {
      const response = await apiService.get(`${this.baseUrl}/alerts/low-stock`);
      return response.data;
    } catch (error) {
      console.error('Error fetching low stock alerts:', error);
      return this.getMockLowStockAlerts();
    }
  }

  // Acknowledge alert
  async acknowledgeAlert(alertId: string): Promise<void> {
    try {
      await apiService.post(`${this.baseUrl}/alerts/${alertId}/acknowledge`);
    } catch (error) {
      console.error('Error acknowledging alert:', error);
      throw error;
    }
  }

  // Adjust stock
  async adjustStock(stockItemId: string, adjustment: {
    type: 'IN' | 'OUT' | 'ADJUSTMENT';
    quantity: number;
    reason?: string;
    reference?: string;
  }): Promise<StockMovement> {
    try {
      const response = await apiService.post(`${this.baseUrl}/items/${stockItemId}/adjust`, adjustment);
      return response.data;
    } catch (error) {
      console.error('Error adjusting stock:', error);
      throw error;
    }
  }

  // Transfer stock
  async transferStock(stockItemId: string, transfer: {
    fromLocation: string;
    toLocation: string;
    quantity: number;
    reason?: string;
  }): Promise<StockMovement> {
    try {
      const response = await apiService.post(`${this.baseUrl}/items/${stockItemId}/transfer`, transfer);
      return response.data;
    } catch (error) {
      console.error('Error transferring stock:', error);
      throw error;
    }
  }

  // Mock data methods for development/fallback
  private getMockDashboardSummary(): StockDashboardSummary {
    return {
      totalProducts: 125,
      lowStockItems: 8,
      incomingStock: 420,
      outgoingStock: 185,
      totalValue: 245000,
      averageStockTurnover: 4.2,
      stockAlerts: 3
    };
  }

  private getMockTopConsumedItems(): TopConsumedItem[] {
    return [
      { id: '1', name: 'Steel Sheets', consumed: 1200, unit: 'kg', percentage: 35 },
      { id: '2', name: 'Aluminum Bars', consumed: 850, unit: 'kg', percentage: 25 },
      { id: '3', name: 'Screws M6', consumed: 5000, unit: 'pieces', percentage: 20 },
      { id: '4', name: 'Paint', consumed: 450, unit: 'liters', percentage: 15 },
      { id: '5', name: 'Rubber Gaskets', consumed: 200, unit: 'pieces', percentage: 5 }
    ];
  }

  private getMockStockDistribution(): StockDistribution[] {
    return [
      { category: 'RAW_MATERIALS', name: 'Raw Materials', value: 45, percentage: 45 },
      { category: 'SEMI_FINISHED', name: 'Semi-Finished', value: 30, percentage: 30 },
      { category: 'FINISHED_GOODS', name: 'Finished Goods', value: 25, percentage: 25 }
    ];
  }

  private getMockStockTableData(filters?: StockFilters): PaginatedResponse<StockTableItem> {
    const mockData: StockTableItem[] = [
      {
        id: 'stock-001',
        product: 'Steel Sheet 2mm',
        sku: 'ST-2MM-001',
        category: 'Raw Materials',
        unitCost: 25.50,
        unit: 'kg',
        totalValue: 12750,
        onHand: 500,
        freeToUse: 350,
        reserved: 150,
        incoming: 200,
        outgoing: 75,
        reorderLevel: 100,
        maxLevel: 1000,
        lastMovement: '2024-01-17T10:30:00Z',
        status: 'IN_STOCK'
      },
      {
        id: 'stock-002',
        product: 'Aluminum Bar 10mm',
        sku: 'AL-10MM-001',
        category: 'Raw Materials',
        unitCost: 15.75,
        unit: 'kg',
        totalValue: 1575,
        onHand: 45,
        freeToUse: 25,
        reserved: 20,
        incoming: 100,
        outgoing: 30,
        reorderLevel: 50,
        maxLevel: 500,
        lastMovement: '2024-01-17T09:15:00Z',
        status: 'LOW_STOCK'
      },
      {
        id: 'stock-003',
        product: 'Motor Assembly',
        sku: 'MOT-ASM-001',
        category: 'Semi-Finished',
        unitCost: 125.00,
        unit: 'pieces',
        totalValue: 6250,
        onHand: 50,
        freeToUse: 35,
        reserved: 15,
        incoming: 25,
        outgoing: 10,
        reorderLevel: 20,
        maxLevel: 100,
        lastMovement: '2024-01-17T11:45:00Z',
        status: 'IN_STOCK'
      }
    ];

    let filteredData = mockData;
    if (filters) {
      if (filters.category) {
        filteredData = filteredData.filter(item => 
          item.category.toLowerCase().includes(filters.category!.toLowerCase())
        );
      }
      if (filters.status) {
        filteredData = filteredData.filter(item => item.status === filters.status);
      }
      if (filters.search) {
        filteredData = filteredData.filter(item => 
          item.product.toLowerCase().includes(filters.search!.toLowerCase()) ||
          item.sku.toLowerCase().includes(filters.search!.toLowerCase())
        );
      }
    }

    const page = filters?.page || 1;
    const limit = filters?.limit || 10;
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedData = filteredData.slice(startIndex, endIndex);

    return {
      data: paginatedData,
      pagination: {
        page,
        limit,
        total: filteredData.length,
        pages: Math.ceil(filteredData.length / limit),
        hasNext: endIndex < filteredData.length,
        hasPrev: page > 1
      }
    };
  }

  private getMockStockMovements(): StockMovement[] {
    return [
      {
        id: 'mov-001',
        stockItemId: 'stock-001',
        stockItem: {
          id: 'stock-001',
          name: 'Steel Sheet 2mm',
          sku: 'ST-2MM-001'
        },
        type: 'IN',
        quantity: 200,
        unit: 'kg',
        unitCost: 25.50,
        totalValue: 5100,
        reference: 'PO-2024-001',
        reason: 'Purchase Order',
        createdBy: {
          id: 'user-001',
          firstName: 'John',
          lastName: 'Manager'
        },
        createdAt: '2024-01-17T10:30:00Z'
      },
      {
        id: 'mov-002',
        stockItemId: 'stock-002',
        stockItem: {
          id: 'stock-002',
          name: 'Aluminum Bar 10mm',
          sku: 'AL-10MM-001'
        },
        type: 'OUT',
        quantity: 30,
        unit: 'kg',
        unitCost: 15.75,
        totalValue: 472.50,
        reference: 'WO-2024-001',
        reason: 'Work Order consumption',
        createdBy: {
          id: 'user-002',
          firstName: 'Jane',
          lastName: 'Operator'
        },
        createdAt: '2024-01-17T09:15:00Z'
      }
    ];
  }

  private getMockLowStockAlerts(): LowStockAlert[] {
    return [
      {
        id: 'alert-001',
        stockItemId: 'stock-002',
        stockItem: {
          id: 'stock-002',
          name: 'Aluminum Bar 10mm',
          sku: 'AL-10MM-001',
          onHand: 45,
          reorderLevel: 50,
          unit: 'kg'
        },
        severity: 'LOW',
        message: 'Stock level (45 kg) is below reorder level (50 kg)',
        createdAt: '2024-01-17T08:00:00Z',
        acknowledged: false
      },
      {
        id: 'alert-002',
        stockItemId: 'stock-004',
        stockItem: {
          id: 'stock-004',
          name: 'Hydraulic Oil',
          sku: 'HYD-OIL-001',
          onHand: 5,
          reorderLevel: 20,
          unit: 'liters'
        },
        severity: 'CRITICAL',
        message: 'Stock level (5 liters) is critically low (reorder level: 20 liters)',
        createdAt: '2024-01-17T07:30:00Z',
        acknowledged: false
      }
    ];
  }
}

// Export singleton instance
export const stockDashboardService = new StockDashboardService();