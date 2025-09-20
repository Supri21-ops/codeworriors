import { apiService } from './api';

export interface ManufacturingOrder {
  id: string;
  orderNumber: string;
  productId: string;
  product: {
    id: string;
    name: string;
    description?: string;
    sku: string;
  };
  quantity: number;
  priority: 'LOW' | 'NORMAL' | 'HIGH' | 'URGENT';
  status: 'PLANNED' | 'RELEASED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED' | 'ON_HOLD';
  startDate?: string;
  endDate?: string;
  dueDate: string;
  notes?: string;
  priorityScore?: number;
  customerTier: 'BRONZE' | 'SILVER' | 'GOLD' | 'PLATINUM';
  createdBy: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
  workOrders: WorkOrder[];
  createdAt: string;
  updatedAt: string;
}

export interface WorkOrder {
  id: string;
  orderNumber: string;
  manufacturingOrderId: string;
  workCenterId: string;
  workCenter: {
    id: string;
    name: string;
    code: string;
  };
  status: 'PLANNED' | 'RELEASED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED' | 'ON_HOLD';
  priority: 'LOW' | 'NORMAL' | 'HIGH' | 'URGENT';
  plannedStartDate?: string;
  plannedEndDate?: string;
  actualStartDate?: string;
  actualEndDate?: string;
  assignedUserId?: string;
  assignedUser?: {
    id: string;
    firstName: string;
    lastName: string;
  };
  notes?: string;
  priorityScore?: number;
  schedulePosition?: number;
  estimatedDuration?: number;
  actualDuration?: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateManufacturingOrderData {
  productId: string;
  quantity: number;
  priority?: 'LOW' | 'NORMAL' | 'HIGH' | 'URGENT';
  dueDate: string;
  notes?: string;
  customerTier?: 'BRONZE' | 'SILVER' | 'GOLD' | 'PLATINUM';
}

export interface UpdateManufacturingOrderData {
  quantity?: number;
  priority?: 'LOW' | 'NORMAL' | 'HIGH' | 'URGENT';
  status?: 'PLANNED' | 'RELEASED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED' | 'ON_HOLD';
  startDate?: string;
  endDate?: string;
  dueDate?: string;
  notes?: string;
  customerTier?: 'BRONZE' | 'SILVER' | 'GOLD' | 'PLATINUM';
}

export interface ManufacturingOrderFilters {
  status?: string;
  priority?: string;
  productId?: string;
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

export interface ManufacturingOrderStats {
  total: number;
  planned: number;
  inProgress: number;
  completed: number;
  cancelled: number;
  urgent: number;
}

class ManufacturingService {
  async getManufacturingOrders(filters: ManufacturingOrderFilters = {}): Promise<PaginatedResponse<ManufacturingOrder>> {
    const params = new URLSearchParams();
    
    if (filters.status) params.append('status', filters.status);
    if (filters.priority) params.append('priority', filters.priority);
    if (filters.productId) params.append('productId', filters.productId);
    if (filters.page) params.append('page', filters.page.toString());
    if (filters.limit) params.append('limit', filters.limit.toString());

    const response = await apiService.get<PaginatedResponse<ManufacturingOrder>>(
      `/manufacturing/orders?${params.toString()}`
    );
    return response;
  }

  async getManufacturingOrderById(id: string): Promise<ManufacturingOrder> {
    const response = await apiService.get<{ data: ManufacturingOrder }>(`/manufacturing/orders/${id}`);
    return response.data;
  }

  async createManufacturingOrder(data: CreateManufacturingOrderData): Promise<ManufacturingOrder> {
    const response = await apiService.post<{ data: ManufacturingOrder }>('/manufacturing/orders', data);
    return response.data;
  }

  async updateManufacturingOrder(id: string, data: UpdateManufacturingOrderData): Promise<ManufacturingOrder> {
    const response = await apiService.put<{ data: ManufacturingOrder }>(`/manufacturing/orders/${id}`, data);
    return response.data;
  }

  async deleteManufacturingOrder(id: string): Promise<void> {
    await apiService.delete(`/manufacturing/orders/${id}`);
  }

  async getManufacturingOrderStats(): Promise<ManufacturingOrderStats> {
    const response = await apiService.get<{ data: ManufacturingOrderStats }>('/manufacturing/stats');
    return response.data;
  }

  async getWorkOrders(filters: any = {}): Promise<PaginatedResponse<WorkOrder>> {
    const params = new URLSearchParams();
    
    Object.entries(filters).forEach(([key, value]) => {
      if (value) params.append(key, value.toString());
    });

    const response = await apiService.get<PaginatedResponse<WorkOrder>>(
      `/manufacturing/work-orders?${params.toString()}`
    );
    return response;
  }

  async getWorkOrderById(id: string): Promise<WorkOrder> {
    const response = await apiService.get<{ data: WorkOrder }>(`/manufacturing/work-orders/${id}`);
    return response.data;
  }

  async createWorkOrder(data: any): Promise<WorkOrder> {
    const response = await apiService.post<{ data: WorkOrder }>('/manufacturing/work-orders', data);
    return response.data;
  }

  async updateWorkOrder(id: string, data: any): Promise<WorkOrder> {
    const response = await apiService.put<{ data: WorkOrder }>(`/manufacturing/work-orders/${id}`, data);
    return response.data;
  }

  async deleteWorkOrder(id: string): Promise<void> {
    await apiService.delete(`/manufacturing/work-orders/${id}`);
  }
}

export const manufacturingService = new ManufacturingService();
