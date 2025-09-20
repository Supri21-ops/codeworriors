import { apiService } from './api';

export interface WorkCenter {
  id: string;
  name: string;
  description: string;
  capacity: number;
  isActive: boolean;
  currentTask?: string;
  utilization?: number;
  cost?: number;
  status?: string;
  downtime?: number;
  usage?: number[];
  createdAt: string;
  updatedAt: string;
}

export interface WorkCenterCapacity {
  capacity: number;
  currentLoad: number;
}

export interface CreateWorkCenterData {
  name: string;
  description?: string;
  capacity: number;
  isActive?: boolean;
}

export interface UpdateWorkCenterData {
  name?: string;
  description?: string;
  capacity?: number;
  isActive?: boolean;
  downtime?: number;
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

class WorkCenterService {
  private BASE_URL = '/workcenter';

  async getWorkCenters(): Promise<WorkCenter[]> {
    const response = await apiService.get<{success: boolean, data: WorkCenter[]}>(this.BASE_URL);
    return response.data;
  }

  async getWorkCenterById(id: string): Promise<WorkCenter> {
    const response = await apiService.get<{success: boolean, data: WorkCenter}>(`${this.BASE_URL}/${id}`);
    return response.data;
  }

  async createWorkCenter(data: CreateWorkCenterData): Promise<WorkCenter> {
    const response = await apiService.post<{success: boolean, data: WorkCenter}>(this.BASE_URL, data);
    return response.data;
  }

  async updateWorkCenter(id: string, data: UpdateWorkCenterData): Promise<WorkCenter> {
    const response = await apiService.put<{success: boolean, data: WorkCenter}>(`${this.BASE_URL}/${id}`, data);
    return response.data;
  }

  async deleteWorkCenter(id: string): Promise<void> {
    await apiService.delete(`${this.BASE_URL}/${id}`);
  }

  async getWorkCenterCapacity(id: string): Promise<WorkCenterCapacity> {
    const response = await apiService.get<{success: boolean, data: WorkCenterCapacity}>(`${this.BASE_URL}/${id}/capacity`);
    return response.data;
  }

  async updateWorkCenterCapacity(id: string, data: {capacity: number}): Promise<WorkCenter> {
    const response = await apiService.put<{success: boolean, data: WorkCenter}>(`${this.BASE_URL}/${id}/capacity`, data);
    return response.data;
  }

  async reportDowntime(id: string): Promise<WorkCenter> {
    // Update the workcenter to increment downtime
    const workcenter = await this.getWorkCenterById(id);
    const currentDowntime = workcenter.downtime || 0;
    return this.updateWorkCenter(id, {downtime: currentDowntime + 1});
  }
}

export const workCenterService = new WorkCenterService();