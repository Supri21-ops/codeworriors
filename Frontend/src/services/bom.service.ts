import { apiService } from './api';

// Types
export interface BOMItem {
  id: string;
  productId: string;
  product: {
    id: string;
    name: string;
    sku: string;
    unitPrice: number;
  };
  quantity: number;
  unit: string;
  unitCost: number;
  totalCost: number;
  level: number;
  parentId?: string;
  children?: BOMItem[];
  notes?: string;
  isOptional: boolean;
  substituteProducts?: {
    id: string;
    name: string;
    sku: string;
    unitPrice: number;
  }[];
  createdAt: string;
  updatedAt: string;
}

export interface BOM {
  id: string;
  productId: string;
  product: {
    id: string;
    name: string;
    sku: string;
    unitPrice: number;
  };
  version: string;
  isActive: boolean;
  items: BOMItem[];
  totalCost: number;
  totalItems: number;
  effectiveDate: string;
  expiryDate?: string;
  notes?: string;
  createdBy: {
    id: string;
    firstName: string;
    lastName: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface BOMSummary {
  totalBOMs: number;
  activeBOMs: number;
  inactiveBOMs: number;
  totalComponents: number;
  avgComponentsPerBOM: number;
  avgCostPerBOM: number;
}

export interface BOMFilters {
  productId?: string;
  isActive?: boolean;
  search?: string;
  version?: string;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface CreateBOMRequest {
  productId: string;
  version: string;
  effectiveDate: string;
  expiryDate?: string;
  notes?: string;
  items: CreateBOMItemRequest[];
}

export interface CreateBOMItemRequest {
  productId: string;
  quantity: number;
  unit: string;
  level: number;
  parentId?: string;
  notes?: string;
  isOptional?: boolean;
  substituteProductIds?: string[];
}

export interface UpdateBOMRequest {
  version?: string;
  isActive?: boolean;
  effectiveDate?: string;
  expiryDate?: string;
  notes?: string;
}

export interface UpdateBOMItemRequest {
  quantity?: number;
  unit?: string;
  level?: number;
  parentId?: string;
  notes?: string;
  isOptional?: boolean;
  substituteProductIds?: string[];
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

export interface BOMCostAnalysis {
  bomId: string;
  totalCost: number;
  materialCost: number;
  laborCost: number;
  overheadCost: number;
  costByCategory: Record<string, number>;
  costByLevel: Record<number, number>;
}

export class BOMService {
  private baseUrl = '/api/bom';

  // Get all BOMs with optional filters
  async getBOMs(filters?: BOMFilters): Promise<PaginatedResponse<BOM>> {
    try {
      const params = new URLSearchParams();
      if (filters) {
        Object.entries(filters).forEach(([key, value]) => {
          if (value !== undefined && value !== null) {
            params.append(key, value.toString());
          }
        });
      }

      const response = await apiService.get(`${this.baseUrl}?${params.toString()}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching BOMs:', error);
      // Fallback to mock data for development
      return this.getMockBOMsResponse(filters);
    }
  }

  // Get BOMs summary/analytics
  async getBOMsSummary(): Promise<BOMSummary> {
    try {
      const response = await apiService.get(`${this.baseUrl}/summary`);
      return response.data;
    } catch (error) {
      console.error('Error fetching BOMs summary:', error);
      // Fallback to mock data
      return this.getMockSummary();
    }
  }

  // Get BOM by ID
  async getBOMById(id: string): Promise<BOM> {
    try {
      const response = await apiService.get(`${this.baseUrl}/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching BOM:', error);
      throw error;
    }
  }

  // Get BOM by product ID
  async getBOMByProductId(productId: string, version?: string): Promise<BOM> {
    try {
      const params = version ? `?version=${version}` : '';
      const response = await apiService.get(`${this.baseUrl}/product/${productId}${params}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching BOM by product:', error);
      throw error;
    }
  }

  // Create new BOM
  async createBOM(bom: CreateBOMRequest): Promise<BOM> {
    try {
      const response = await apiService.post(`${this.baseUrl}`, bom);
      return response.data;
    } catch (error) {
      console.error('Error creating BOM:', error);
      throw error;
    }
  }

  // Update BOM
  async updateBOM(id: string, updates: UpdateBOMRequest): Promise<BOM> {
    try {
      const response = await apiService.put(`${this.baseUrl}/${id}`, updates);
      return response.data;
    } catch (error) {
      console.error('Error updating BOM:', error);
      throw error;
    }
  }

  // Delete BOM
  async deleteBOM(id: string): Promise<void> {
    try {
      await apiService.delete(`${this.baseUrl}/${id}`);
    } catch (error) {
      console.error('Error deleting BOM:', error);
      throw error;
    }
  }

  // Clone BOM (create new version)
  async cloneBOM(id: string, newVersion: string): Promise<BOM> {
    try {
      const response = await apiService.post(`${this.baseUrl}/${id}/clone`, { version: newVersion });
      return response.data;
    } catch (error) {
      console.error('Error cloning BOM:', error);
      throw error;
    }
  }

  // Toggle BOM active status
  async toggleBOMStatus(id: string): Promise<BOM> {
    try {
      const response = await apiService.patch(`${this.baseUrl}/${id}/toggle-status`);
      return response.data;
    } catch (error) {
      console.error('Error toggling BOM status:', error);
      throw error;
    }
  }

  // BOM Item Management
  async addBOMItem(bomId: string, item: CreateBOMItemRequest): Promise<BOMItem> {
    try {
      const response = await apiService.post(`${this.baseUrl}/${bomId}/items`, item);
      return response.data;
    } catch (error) {
      console.error('Error adding BOM item:', error);
      throw error;
    }
  }

  async updateBOMItem(bomId: string, itemId: string, updates: UpdateBOMItemRequest): Promise<BOMItem> {
    try {
      const response = await apiService.put(`${this.baseUrl}/${bomId}/items/${itemId}`, updates);
      return response.data;
    } catch (error) {
      console.error('Error updating BOM item:', error);
      throw error;
    }
  }

  async deleteBOMItem(bomId: string, itemId: string): Promise<void> {
    try {
      await apiService.delete(`${this.baseUrl}/${bomId}/items/${itemId}`);
    } catch (error) {
      console.error('Error deleting BOM item:', error);
      throw error;
    }
  }

  // BOM Analysis
  async getBOMCostAnalysis(id: string): Promise<BOMCostAnalysis> {
    try {
      const response = await apiService.get(`${this.baseUrl}/${id}/cost-analysis`);
      return response.data;
    } catch (error) {
      console.error('Error fetching BOM cost analysis:', error);
      throw error;
    }
  }

  // Export BOM
  async exportBOM(id: string, format: 'csv' | 'excel' | 'pdf'): Promise<Blob> {
    try {
      const response = await apiService.get(`${this.baseUrl}/${id}/export/${format}`, {
        responseType: 'blob'
      });
      return response.data;
    } catch (error) {
      console.error('Error exporting BOM:', error);
      throw error;
    }
  }

  // Validate BOM (check for circular dependencies, etc.)
  async validateBOM(id: string): Promise<{ isValid: boolean; errors: string[] }> {
    try {
      const response = await apiService.post(`${this.baseUrl}/${id}/validate`);
      return response.data;
    } catch (error) {
      console.error('Error validating BOM:', error);
      throw error;
    }
  }

  // Get BOM versions for a product
  async getBOMVersions(productId: string): Promise<BOM[]> {
    try {
      const response = await apiService.get(`${this.baseUrl}/product/${productId}/versions`);
      return response.data;
    } catch (error) {
      console.error('Error fetching BOM versions:', error);
      return [];
    }
  }

  // Mock data methods for development/fallback
  private getMockBOMsResponse(filters?: BOMFilters): PaginatedResponse<BOM> {
    const mockBOMs = this.getMockBOMs();
    let filteredBOMs = mockBOMs;

    if (filters) {
      if (filters.productId) {
        filteredBOMs = filteredBOMs.filter(b => b.productId === filters.productId);
      }
      if (filters.isActive !== undefined) {
        filteredBOMs = filteredBOMs.filter(b => b.isActive === filters.isActive);
      }
      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        filteredBOMs = filteredBOMs.filter(b => 
          b.product.name.toLowerCase().includes(searchLower) || 
          b.product.sku.toLowerCase().includes(searchLower) ||
          b.version.toLowerCase().includes(searchLower)
        );
      }
      if (filters.version) {
        filteredBOMs = filteredBOMs.filter(b => b.version === filters.version);
      }
    }

    const page = filters?.page || 1;
    const limit = filters?.limit || 10;
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedData = filteredBOMs.slice(startIndex, endIndex);

    return {
      data: paginatedData,
      pagination: {
        page,
        limit,
        total: filteredBOMs.length,
        pages: Math.ceil(filteredBOMs.length / limit),
        hasNext: endIndex < filteredBOMs.length,
        hasPrev: page > 1
      }
    };
  }

  private getMockBOMs(): BOM[] {
    return [
      {
        id: 'bom-001',
        productId: 'prod-001',
        product: {
          id: 'prod-001',
          name: 'Steel Widget A',
          sku: 'SWA-001',
          unitPrice: 25.50
        },
        version: 'v1.0',
        isActive: true,
        totalCost: 18.75,
        totalItems: 5,
        effectiveDate: '2024-01-01T00:00:00Z',
        notes: 'Initial BOM for Steel Widget A',
        createdBy: {
          id: 'user-001',
          firstName: 'John',
          lastName: 'Smith'
        },
        items: [
          {
            id: 'item-001',
            productId: 'comp-001',
            product: {
              id: 'comp-001',
              name: 'Steel Rod 10mm',
              sku: 'SR-10',
              unitPrice: 5.00
            },
            quantity: 2,
            unit: 'pcs',
            unitCost: 5.00,
            totalCost: 10.00,
            level: 1,
            isOptional: false,
            createdAt: '2024-01-01T10:00:00Z',
            updatedAt: '2024-01-01T10:00:00Z'
          },
          {
            id: 'item-002',
            productId: 'comp-002',
            product: {
              id: 'comp-002',
              name: 'Bolt M6x20',
              sku: 'BM6-20',
              unitPrice: 0.25
            },
            quantity: 4,
            unit: 'pcs',
            unitCost: 0.25,
            totalCost: 1.00,
            level: 1,
            isOptional: false,
            createdAt: '2024-01-01T10:00:00Z',
            updatedAt: '2024-01-01T10:00:00Z'
          }
        ],
        createdAt: '2024-01-01T10:00:00Z',
        updatedAt: '2024-01-15T14:30:00Z'
      },
      {
        id: 'bom-002',
        productId: 'prod-002',
        product: {
          id: 'prod-002',
          name: 'Aluminum Component B',
          sku: 'ACB-002',
          unitPrice: 45.00
        },
        version: 'v2.1',
        isActive: true,
        totalCost: 32.50,
        totalItems: 8,
        effectiveDate: '2024-01-10T00:00:00Z',
        notes: 'Updated BOM with new aluminum specifications',
        createdBy: {
          id: 'user-002',
          firstName: 'Jane',
          lastName: 'Doe'
        },
        items: [
          {
            id: 'item-003',
            productId: 'comp-003',
            product: {
              id: 'comp-003',
              name: 'Aluminum Sheet 2mm',
              sku: 'AS-2',
              unitPrice: 15.00
            },
            quantity: 1,
            unit: 'sheet',
            unitCost: 15.00,
            totalCost: 15.00,
            level: 1,
            isOptional: false,
            createdAt: '2024-01-10T09:00:00Z',
            updatedAt: '2024-01-10T09:00:00Z'
          }
        ],
        createdAt: '2024-01-10T09:00:00Z',
        updatedAt: '2024-01-16T11:20:00Z'
      }
    ];
  }

  private getMockSummary(): BOMSummary {
    return {
      totalBOMs: 12,
      activeBOMs: 10,
      inactiveBOMs: 2,
      totalComponents: 145,
      avgComponentsPerBOM: 12.1,
      avgCostPerBOM: 28.75
    };
  }
}

// Export singleton instance
export const bomService = new BOMService();