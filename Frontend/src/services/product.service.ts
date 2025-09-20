import { apiService } from './api';

// Types
export interface Product {
  id: string;
  name: string;
  description?: string;
  sku: string;
  category: string;
  unitPrice: number;
  currency: string;
  weight?: number;
  dimensions?: {
    length: number;
    width: number;
    height: number;
    unit: string;
  };
  isActive: boolean;
  minimumStockLevel?: number;
  maximumStockLevel?: number;
  reorderPoint?: number;
  supplier?: {
    id: string;
    name: string;
    contactEmail?: string;
  };
  specifications?: Record<string, any>;
  images?: string[];
  tags?: string[];
  createdAt: string;
  updatedAt: string;
}

export interface ProductSummary {
  totalProducts: number;
  activeProducts: number;
  inactiveProducts: number;
  lowStockProducts: number;
  categories: string[];
}

export interface ProductFilters {
  category?: string;
  isActive?: boolean;
  search?: string;
  minPrice?: number;
  maxPrice?: number;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface CreateProductRequest {
  name: string;
  description?: string;
  sku: string;
  category: string;
  unitPrice: number;
  currency?: string;
  weight?: number;
  dimensions?: {
    length: number;
    width: number;
    height: number;
    unit: string;
  };
  minimumStockLevel?: number;
  maximumStockLevel?: number;
  reorderPoint?: number;
  supplierId?: string;
  specifications?: Record<string, any>;
  tags?: string[];
}

export interface UpdateProductRequest {
  name?: string;
  description?: string;
  sku?: string;
  category?: string;
  unitPrice?: number;
  currency?: string;
  weight?: number;
  dimensions?: {
    length: number;
    width: number;
    height: number;
    unit: string;
  };
  isActive?: boolean;
  minimumStockLevel?: number;
  maximumStockLevel?: number;
  reorderPoint?: number;
  supplierId?: string;
  specifications?: Record<string, any>;
  tags?: string[];
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

export class ProductService {
  private baseUrl = '/product';

  // Get all products with optional filters
  async getProducts(filters?: ProductFilters): Promise<PaginatedResponse<Product>> {
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
      console.error('Error fetching products:', error);
      // Fallback to mock data for development
      return this.getMockProductsResponse(filters);
    }
  }

  // Get products summary/analytics
  async getProductsSummary(): Promise<ProductSummary> {
    try {
      const response = await apiService.get(`${this.baseUrl}/summary`);
      return response.data;
    } catch (error) {
      console.error('Error fetching products summary:', error);
      // Fallback to mock data
      return this.getMockSummary();
    }
  }

  // Get product by ID
  async getProductById(id: string): Promise<Product> {
    try {
      const response = await apiService.get(`${this.baseUrl}/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching product:', error);
      throw error;
    }
  }

  // Create new product
  async createProduct(product: CreateProductRequest): Promise<Product> {
    try {
      const response = await apiService.post(`${this.baseUrl}`, product);
      return response.data;
    } catch (error) {
      console.error('Error creating product:', error);
      throw error;
    }
  }

  // Update product
  async updateProduct(id: string, updates: UpdateProductRequest): Promise<Product> {
    try {
      const response = await apiService.put(`${this.baseUrl}/${id}`, updates);
      return response.data;
    } catch (error) {
      console.error('Error updating product:', error);
      throw error;
    }
  }

  // Delete product
  async deleteProduct(id: string): Promise<void> {
    try {
      await apiService.delete(`${this.baseUrl}/${id}`);
    } catch (error) {
      console.error('Error deleting product:', error);
      throw error;
    }
  }

  // Toggle product active status
  async toggleProductStatus(id: string): Promise<Product> {
    try {
      const response = await apiService.patch(`${this.baseUrl}/${id}/toggle-status`);
      return response.data;
    } catch (error) {
      console.error('Error toggling product status:', error);
      throw error;
    }
  }

  // Get products by category
  async getProductsByCategory(category: string): Promise<Product[]> {
    try {
      const response = await apiService.get(`${this.baseUrl}/category/${category}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching products by category:', error);
      return [];
    }
  }

  // Search products
  async searchProducts(query: string): Promise<Product[]> {
    try {
      const response = await apiService.get(`${this.baseUrl}/search?q=${encodeURIComponent(query)}`);
      return response.data;
    } catch (error) {
      console.error('Error searching products:', error);
      return [];
    }
  }

  // Get product categories
  async getCategories(): Promise<string[]> {
    try {
      const response = await apiService.get(`${this.baseUrl}/categories`);
      return response.data;
    } catch (error) {
      console.error('Error fetching categories:', error);
      return this.getMockCategories();
    }
  }

  // Upload product image
  async uploadProductImage(id: string, file: File): Promise<string> {
    try {
      const formData = new FormData();
      formData.append('image', file);
      
      const response = await apiService.post(`${this.baseUrl}/${id}/images`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data.imageUrl;
    } catch (error) {
      console.error('Error uploading product image:', error);
      throw error;
    }
  }

  // Delete product image
  async deleteProductImage(id: string, imageUrl: string): Promise<void> {
    try {
      await apiService.delete(`${this.baseUrl}/${id}/images`, {
        data: { imageUrl }
      });
    } catch (error) {
      console.error('Error deleting product image:', error);
      throw error;
    }
  }

  // Mock data methods for development/fallback
  private getMockProductsResponse(filters?: ProductFilters): PaginatedResponse<Product> {
    const mockProducts = this.getMockProducts();
    let filteredProducts = mockProducts;

    if (filters) {
      if (filters.category) {
        filteredProducts = filteredProducts.filter(p => p.category === filters.category);
      }
      if (filters.isActive !== undefined) {
        filteredProducts = filteredProducts.filter(p => p.isActive === filters.isActive);
      }
      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        filteredProducts = filteredProducts.filter(p => 
          p.name.toLowerCase().includes(searchLower) || 
          p.sku.toLowerCase().includes(searchLower) ||
          p.description?.toLowerCase().includes(searchLower)
        );
      }
      if (filters.minPrice) {
        filteredProducts = filteredProducts.filter(p => p.unitPrice >= filters.minPrice!);
      }
      if (filters.maxPrice) {
        filteredProducts = filteredProducts.filter(p => p.unitPrice <= filters.maxPrice!);
      }
    }

    const page = filters?.page || 1;
    const limit = filters?.limit || 10;
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedData = filteredProducts.slice(startIndex, endIndex);

    return {
      data: paginatedData,
      pagination: {
        page,
        limit,
        total: filteredProducts.length,
        pages: Math.ceil(filteredProducts.length / limit),
        hasNext: endIndex < filteredProducts.length,
        hasPrev: page > 1
      }
    };
  }

  private getMockProducts(): Product[] {
    return [
      {
        id: 'prod-001',
        name: 'Steel Widget A',
        description: 'High-quality steel widget for industrial applications',
        sku: 'SWA-001',
        category: 'Widgets',
        unitPrice: 25.50,
        currency: 'USD',
        weight: 2.5,
        dimensions: {
          length: 10,
          width: 5,
          height: 3,
          unit: 'cm'
        },
        isActive: true,
        minimumStockLevel: 50,
        maximumStockLevel: 500,
        reorderPoint: 75,
        supplier: {
          id: 'sup-001',
          name: 'Steel Supply Co.',
          contactEmail: 'orders@steelsupply.com'
        },
        tags: ['steel', 'industrial', 'widget'],
        createdAt: '2024-01-01T10:00:00Z',
        updatedAt: '2024-01-15T14:30:00Z'
      },
      {
        id: 'prod-002',
        name: 'Aluminum Component B',
        description: 'Lightweight aluminum component for aerospace',
        sku: 'ACB-002',
        category: 'Components',
        unitPrice: 45.00,
        currency: 'USD',
        weight: 1.2,
        dimensions: {
          length: 15,
          width: 8,
          height: 2,
          unit: 'cm'
        },
        isActive: true,
        minimumStockLevel: 25,
        maximumStockLevel: 200,
        reorderPoint: 40,
        supplier: {
          id: 'sup-002',
          name: 'Aluminum Works',
          contactEmail: 'sales@aluminumworks.com'
        },
        tags: ['aluminum', 'aerospace', 'lightweight'],
        createdAt: '2024-01-02T09:00:00Z',
        updatedAt: '2024-01-16T11:20:00Z'
      },
      {
        id: 'prod-003',
        name: 'Plastic Housing C',
        description: 'Durable plastic housing for electronics',
        sku: 'PHC-003',
        category: 'Housings',
        unitPrice: 12.75,
        currency: 'USD',
        weight: 0.8,
        dimensions: {
          length: 20,
          width: 12,
          height: 8,
          unit: 'cm'
        },
        isActive: true,
        minimumStockLevel: 100,
        maximumStockLevel: 1000,
        reorderPoint: 150,
        supplier: {
          id: 'sup-003',
          name: 'Plastic Industries',
          contactEmail: 'orders@plasticind.com'
        },
        tags: ['plastic', 'electronics', 'housing'],
        createdAt: '2024-01-03T08:30:00Z',
        updatedAt: '2024-01-17T16:45:00Z'
      }
    ];
  }

  private getMockSummary(): ProductSummary {
    return {
      totalProducts: 25,
      activeProducts: 22,
      inactiveProducts: 3,
      lowStockProducts: 5,
      categories: ['Widgets', 'Components', 'Housings', 'Tools', 'Materials']
    };
  }

  private getMockCategories(): string[] {
    return ['Widgets', 'Components', 'Housings', 'Tools', 'Materials', 'Electronics', 'Hardware'];
  }
}

// Export singleton instance
export const productService = new ProductService();