import { apiService } from './api';

// Types
export interface OperatorTask {
  id: string;
  workOrderId: string;
  workOrder: {
    id: string;
    orderNumber: string;
    manufacturingOrderId: string;
    workCenter: {
      id: string;
      name: string;
      code: string;
    };
  };
  title: string;
  description?: string;
  status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'PAUSED' | 'CANCELLED';
  priority: 'LOW' | 'NORMAL' | 'HIGH' | 'URGENT';
  assignedTo: {
    id: string;
    firstName: string;
    lastName: string;
    role: string;
  };
  estimatedDuration: number; // in minutes
  actualDuration?: number; // in minutes
  startTime?: string;
  endTime?: string;
  notes?: string;
  qualityCheckRequired: boolean;
  qualityCheckPassed?: boolean;
  qualityNotes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface OperatorDashboardSummary {
  totalTasks: number;
  pendingTasks: number;
  inProgressTasks: number;
  completedTasks: number;
  pausedTasks: number;
  overdueTasks: number;
  todayCompletedTasks: number;
  avgTaskCompletionTime: number; // in minutes
  productivityScore: number; // percentage
}

export interface WorkCenterStatus {
  id: string;
  name: string;
  code: string;
  status: 'OPERATIONAL' | 'DOWN' | 'MAINTENANCE' | 'SETUP';
  currentOperator?: {
    id: string;
    firstName: string;
    lastName: string;
  };
  currentTask?: {
    id: string;
    title: string;
    estimatedCompletion: string;
  };
  efficiency: number; // percentage
  lastMaintenanceDate: string;
  nextMaintenanceDate: string;
}

export interface QualityCheck {
  id: string;
  taskId: string;
  operatorId: string;
  checklistItems: QualityCheckItem[];
  overallPassed: boolean;
  notes?: string;
  performedAt: string;
}

export interface QualityCheckItem {
  id: string;
  description: string;
  required: boolean;
  passed: boolean;
  notes?: string;
  measurement?: {
    value: number;
    unit: string;
    minValue?: number;
    maxValue?: number;
  };
}

export interface OperatorPerformance {
  operatorId: string;
  operator: {
    id: string;
    firstName: string;
    lastName: string;
    employeeId: string;
  };
  period: {
    startDate: string;
    endDate: string;
  };
  tasksCompleted: number;
  avgCompletionTime: number;
  qualityScore: number;
  productivityScore: number;
  onTimeCompletionRate: number;
  totalWorkingHours: number;
}

export interface ShiftSummary {
  shiftId: string;
  shiftName: string;
  startTime: string;
  endTime: string;
  operators: {
    id: string;
    firstName: string;
    lastName: string;
    status: 'ACTIVE' | 'BREAK' | 'OFFLINE';
  }[];
  tasksCompleted: number;
  tasksInProgress: number;
  tasksPending: number;
  productivity: number;
  qualityScore: number;
}

export interface TaskFilters {
  status?: string;
  priority?: string;
  assignedTo?: string;
  workCenter?: string;
  dateFrom?: string;
  dateTo?: string;
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

export class OperatorService {
  private baseUrl = '/api/operator';

  // Get operator dashboard summary
  async getDashboardSummary(operatorId?: string): Promise<OperatorDashboardSummary> {
    try {
      const params = operatorId ? `?operatorId=${operatorId}` : '';
      const response = await apiService.get(`${this.baseUrl}/dashboard/summary${params}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching dashboard summary:', error);
      // Fallback to mock data
      return this.getMockDashboardSummary();
    }
  }

  // Get operator tasks with filters
  async getTasks(filters?: TaskFilters): Promise<PaginatedResponse<OperatorTask>> {
    try {
      const params = new URLSearchParams();
      if (filters) {
        Object.entries(filters).forEach(([key, value]) => {
          if (value !== undefined && value !== null) {
            params.append(key, value.toString());
          }
        });
      }

      const response = await apiService.get(`${this.baseUrl}/tasks?${params.toString()}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching tasks:', error);
      // Fallback to mock data
      return this.getMockTasksResponse(filters);
    }
  }

  // Get task by ID
  async getTaskById(id: string): Promise<OperatorTask> {
    try {
      const response = await apiService.get(`${this.baseUrl}/tasks/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching task:', error);
      throw error;
    }
  }

  // Start task
  async startTask(taskId: string): Promise<OperatorTask> {
    try {
      const response = await apiService.post(`${this.baseUrl}/tasks/${taskId}/start`);
      return response.data;
    } catch (error) {
      console.error('Error starting task:', error);
      throw error;
    }
  }

  // Pause task
  async pauseTask(taskId: string, reason?: string): Promise<OperatorTask> {
    try {
      const response = await apiService.post(`${this.baseUrl}/tasks/${taskId}/pause`, { reason });
      return response.data;
    } catch (error) {
      console.error('Error pausing task:', error);
      throw error;
    }
  }

  // Resume task
  async resumeTask(taskId: string): Promise<OperatorTask> {
    try {
      const response = await apiService.post(`${this.baseUrl}/tasks/${taskId}/resume`);
      return response.data;
    } catch (error) {
      console.error('Error resuming task:', error);
      throw error;
    }
  }

  // Complete task
  async completeTask(taskId: string, notes?: string): Promise<OperatorTask> {
    try {
      const response = await apiService.post(`${this.baseUrl}/tasks/${taskId}/complete`, { notes });
      return response.data;
    } catch (error) {
      console.error('Error completing task:', error);
      throw error;
    }
  }

  // Submit quality check
  async submitQualityCheck(taskId: string, qualityCheck: Omit<QualityCheck, 'id' | 'taskId' | 'performedAt'>): Promise<QualityCheck> {
    try {
      const response = await apiService.post(`${this.baseUrl}/tasks/${taskId}/quality-check`, qualityCheck);
      return response.data;
    } catch (error) {
      console.error('Error submitting quality check:', error);
      throw error;
    }
  }

  // Get work center statuses
  async getWorkCenterStatuses(): Promise<WorkCenterStatus[]> {
    try {
      const response = await apiService.get(`${this.baseUrl}/work-centers/status`);
      return response.data;
    } catch (error) {
      console.error('Error fetching work center statuses:', error);
      return this.getMockWorkCenterStatuses();
    }
  }

  // Get shift summary
  async getShiftSummary(shiftId?: string): Promise<ShiftSummary> {
    try {
      const params = shiftId ? `?shiftId=${shiftId}` : '';
      const response = await apiService.get(`${this.baseUrl}/shift/summary${params}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching shift summary:', error);
      return this.getMockShiftSummary();
    }
  }

  // Get operator performance
  async getOperatorPerformance(operatorId: string, startDate: string, endDate: string): Promise<OperatorPerformance> {
    try {
      const params = new URLSearchParams({
        startDate,
        endDate
      });
      const response = await apiService.get(`${this.baseUrl}/performance/${operatorId}?${params.toString()}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching operator performance:', error);
      throw error;
    }
  }

  // Report issue
  async reportIssue(taskId: string, issue: { title: string; description: string; severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL' }): Promise<void> {
    try {
      await apiService.post(`${this.baseUrl}/tasks/${taskId}/issues`, issue);
    } catch (error) {
      console.error('Error reporting issue:', error);
      throw error;
    }
  }

  // Mock data methods for development/fallback
  private getMockDashboardSummary(): OperatorDashboardSummary {
    return {
      totalTasks: 25,
      pendingTasks: 8,
      inProgressTasks: 3,
      completedTasks: 12,
      pausedTasks: 1,
      overdueTasks: 1,
      todayCompletedTasks: 6,
      avgTaskCompletionTime: 45,
      productivityScore: 87
    };
  }

  private getMockTasksResponse(filters?: TaskFilters): PaginatedResponse<OperatorTask> {
    const mockTasks = this.getMockTasks();
    let filteredTasks = mockTasks;

    if (filters) {
      if (filters.status) {
        filteredTasks = filteredTasks.filter(t => t.status === filters.status);
      }
      if (filters.priority) {
        filteredTasks = filteredTasks.filter(t => t.priority === filters.priority);
      }
      if (filters.assignedTo) {
        filteredTasks = filteredTasks.filter(t => t.assignedTo.id === filters.assignedTo);
      }
    }

    const page = filters?.page || 1;
    const limit = filters?.limit || 10;
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedData = filteredTasks.slice(startIndex, endIndex);

    return {
      data: paginatedData,
      pagination: {
        page,
        limit,
        total: filteredTasks.length,
        pages: Math.ceil(filteredTasks.length / limit),
        hasNext: endIndex < filteredTasks.length,
        hasPrev: page > 1
      }
    };
  }

  private getMockTasks(): OperatorTask[] {
    return [
      {
        id: 'task-001',
        workOrderId: 'wo-001',
        workOrder: {
          id: 'wo-001',
          orderNumber: 'WO-2024-001',
          manufacturingOrderId: 'mo-001',
          workCenter: {
            id: 'wc-001',
            name: 'Assembly Line A',
            code: 'ALA'
          }
        },
        title: 'Assemble Steel Frame',
        description: 'Assemble the main steel frame components according to BOM specifications',
        status: 'IN_PROGRESS',
        priority: 'HIGH',
        assignedTo: {
          id: 'op-001',
          firstName: 'John',
          lastName: 'Smith',
          role: 'Assembly Operator'
        },
        estimatedDuration: 120,
        actualDuration: 85,
        startTime: '2024-01-17T08:00:00Z',
        qualityCheckRequired: true,
        createdAt: '2024-01-17T07:00:00Z',
        updatedAt: '2024-01-17T09:25:00Z'
      },
      {
        id: 'task-002',
        workOrderId: 'wo-002',
        workOrder: {
          id: 'wo-002',
          orderNumber: 'WO-2024-002',
          manufacturingOrderId: 'mo-002',
          workCenter: {
            id: 'wc-002',
            name: 'Machining Center B',
            code: 'MCB'
          }
        },
        title: 'Machine Aluminum Components',
        description: 'Machine aluminum components to specified tolerances',
        status: 'PENDING',
        priority: 'NORMAL',
        assignedTo: {
          id: 'op-002',
          firstName: 'Jane',
          lastName: 'Doe',
          role: 'Machine Operator'
        },
        estimatedDuration: 90,
        qualityCheckRequired: true,
        createdAt: '2024-01-17T09:00:00Z',
        updatedAt: '2024-01-17T09:00:00Z'
      }
    ];
  }

  private getMockWorkCenterStatuses(): WorkCenterStatus[] {
    return [
      {
        id: 'wc-001',
        name: 'Assembly Line A',
        code: 'ALA',
        status: 'OPERATIONAL',
        currentOperator: {
          id: 'op-001',
          firstName: 'John',
          lastName: 'Smith'
        },
        currentTask: {
          id: 'task-001',
          title: 'Assemble Steel Frame',
          estimatedCompletion: '2024-01-17T10:00:00Z'
        },
        efficiency: 92,
        lastMaintenanceDate: '2024-01-10T08:00:00Z',
        nextMaintenanceDate: '2024-01-24T08:00:00Z'
      },
      {
        id: 'wc-002',
        name: 'Machining Center B',
        code: 'MCB',
        status: 'OPERATIONAL',
        efficiency: 88,
        lastMaintenanceDate: '2024-01-12T08:00:00Z',
        nextMaintenanceDate: '2024-01-26T08:00:00Z'
      }
    ];
  }

  private getMockShiftSummary(): ShiftSummary {
    return {
      shiftId: 'shift-001',
      shiftName: 'Day Shift',
      startTime: '2024-01-17T08:00:00Z',
      endTime: '2024-01-17T16:00:00Z',
      operators: [
        {
          id: 'op-001',
          firstName: 'John',
          lastName: 'Smith',
          status: 'ACTIVE'
        },
        {
          id: 'op-002',
          firstName: 'Jane',
          lastName: 'Doe',
          status: 'ACTIVE'
        },
        {
          id: 'op-003',
          firstName: 'Bob',
          lastName: 'Wilson',
          status: 'BREAK'
        }
      ],
      tasksCompleted: 15,
      tasksInProgress: 4,
      tasksPending: 8,
      productivity: 89,
      qualityScore: 94
    };
  }
}

// Export singleton instance
export const operatorService = new OperatorService();