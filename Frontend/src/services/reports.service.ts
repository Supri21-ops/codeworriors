import { apiService } from './api';

// Types
export interface ReportSummary {
  ordersCompletedOnTime: number; // percentage
  averageDelay: number; // hours
  operatorEfficiency: number; // percentage
  totalWorkOrders: number;
  completedWorkOrders: number;
  delayedWorkOrders: number;
  totalOperators: number;
  activeOperators: number;
}

export interface DelayTrendData {
  date: string;
  delay: number; // hours
  workOrdersCount: number;
  onTimeCount: number;
  delayedCount: number;
}

export interface OperatorEfficiencyData {
  operatorId: string;
  operator: {
    id: string;
    firstName: string;
    lastName: string;
    employeeId: string;
  };
  workCenter: {
    id: string;
    name: string;
    code: string;
  };
  expectedTime: number; // minutes
  actualTime: number; // minutes
  efficiency: number; // percentage
  tasksCompleted: number;
  onTimeCompletions: number;
}

export interface WorkOrderAnalysisData {
  id: string;
  orderNumber: string;
  operation: string;
  workCenter: {
    id: string;
    name: string;
    code: string;
  };
  operator: {
    id: string;
    firstName: string;
    lastName: string;
  };
  product: {
    id: string;
    name: string;
    sku: string;
  };
  quantity: number;
  expectedDuration: number; // minutes
  actualDuration: number; // minutes
  efficiency: number; // percentage
  status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'DELAYED' | 'CANCELLED';
  startTime: string;
  endTime?: string;
  delayTime?: number; // minutes
  delayReason?: string;
  qualityScore?: number;
  cost: {
    labor: number;
    material: number;
    overhead: number;
    total: number;
  };
}

export interface ProductionMetrics {
  totalProduction: number;
  onTimeDeliveries: number;
  qualityScore: number;
  utilizationRate: number;
  throughputRate: number;
  cycleTime: number; // minutes
  setupTime: number; // minutes
  downtime: number; // minutes
}

export interface ReportFilters {
  dateFrom?: string;
  dateTo?: string;
  operatorId?: string;
  workCenterId?: string;
  productId?: string;
  status?: string;
  priority?: string;
  delayedOnly?: boolean;
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

export interface ExportOptions {
  format: 'EXCEL' | 'PDF' | 'CSV';
  reportType: 'WORK_ORDER_ANALYSIS' | 'OPERATOR_EFFICIENCY' | 'DELAY_TREND' | 'PRODUCTION_SUMMARY';
  filters?: ReportFilters;
  fileName?: string;
}

export class ReportsService {
  private baseUrl = '/api/reports';

  // Get report summary/KPIs
  async getReportSummary(filters?: ReportFilters): Promise<ReportSummary> {
    try {
      const params = new URLSearchParams();
      if (filters) {
        Object.entries(filters).forEach(([key, value]) => {
          if (value !== undefined && value !== null) {
            params.append(key, value.toString());
          }
        });
      }

      const response = await apiService.get(`${this.baseUrl}/summary?${params.toString()}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching report summary:', error);
      // Fallback to mock data
      return this.getMockReportSummary();
    }
  }

  // Get delay trend data
  async getDelayTrend(filters?: ReportFilters): Promise<DelayTrendData[]> {
    try {
      const params = new URLSearchParams();
      if (filters) {
        Object.entries(filters).forEach(([key, value]) => {
          if (value !== undefined && value !== null) {
            params.append(key, value.toString());
          }
        });
      }

      const response = await apiService.get(`${this.baseUrl}/delay-trend?${params.toString()}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching delay trend:', error);
      return this.getMockDelayTrend();
    }
  }

  // Get operator efficiency data
  async getOperatorEfficiency(filters?: ReportFilters): Promise<OperatorEfficiencyData[]> {
    try {
      const params = new URLSearchParams();
      if (filters) {
        Object.entries(filters).forEach(([key, value]) => {
          if (value !== undefined && value !== null) {
            params.append(key, value.toString());
          }
        });
      }

      const response = await apiService.get(`${this.baseUrl}/operator-efficiency?${params.toString()}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching operator efficiency:', error);
      return this.getMockOperatorEfficiency();
    }
  }

  // Get work order analysis data
  async getWorkOrderAnalysis(filters?: ReportFilters): Promise<PaginatedResponse<WorkOrderAnalysisData>> {
    try {
      const params = new URLSearchParams();
      if (filters) {
        Object.entries(filters).forEach(([key, value]) => {
          if (value !== undefined && value !== null) {
            params.append(key, value.toString());
          }
        });
      }

      const response = await apiService.get(`${this.baseUrl}/work-order-analysis?${params.toString()}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching work order analysis:', error);
      return this.getMockWorkOrderAnalysis(filters);
    }
  }

  // Get production metrics
  async getProductionMetrics(filters?: ReportFilters): Promise<ProductionMetrics> {
    try {
      const params = new URLSearchParams();
      if (filters) {
        Object.entries(filters).forEach(([key, value]) => {
          if (value !== undefined && value !== null) {
            params.append(key, value.toString());
          }
        });
      }

      const response = await apiService.get(`${this.baseUrl}/production-metrics?${params.toString()}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching production metrics:', error);
      return this.getMockProductionMetrics();
    }
  }

  // Export report
  async exportReport(options: ExportOptions): Promise<Blob> {
    try {
      const params = new URLSearchParams();
      params.append('format', options.format);
      params.append('reportType', options.reportType);
      
      if (options.filters) {
        Object.entries(options.filters).forEach(([key, value]) => {
          if (value !== undefined && value !== null) {
            params.append(key, value.toString());
          }
        });
      }

      if (options.fileName) {
        params.append('fileName', options.fileName);
      }

      const response = await apiService.get(`${this.baseUrl}/export?${params.toString()}`, {
        responseType: 'blob'
      });

      return response.data;
    } catch (error) {
      console.error('Error exporting report:', error);
      throw error;
    }
  }

  // Download exported report
  async downloadReport(options: ExportOptions): Promise<void> {
    try {
      const blob = await this.exportReport(options);
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      
      const fileExtension = options.format.toLowerCase();
      const fileName = options.fileName || `${options.reportType.toLowerCase()}_report.${fileExtension}`;
      
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      
      // Cleanup
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading report:', error);
      throw error;
    }
  }

  // Get available operators for filtering
  async getAvailableOperators(): Promise<Array<{ id: string; firstName: string; lastName: string; employeeId: string }>> {
    try {
      const response = await apiService.get(`${this.baseUrl}/filters/operators`);
      return response.data;
    } catch (error) {
      console.error('Error fetching operators:', error);
      return this.getMockOperators();
    }
  }

  // Get available work centers for filtering
  async getAvailableWorkCenters(): Promise<Array<{ id: string; name: string; code: string }>> {
    try {
      const response = await apiService.get(`${this.baseUrl}/filters/work-centers`);
      return response.data;
    } catch (error) {
      console.error('Error fetching work centers:', error);
      return this.getMockWorkCenters();
    }
  }

  // Mock data methods for development/fallback
  private getMockReportSummary(): ReportSummary {
    return {
      ordersCompletedOnTime: 78,
      averageDelay: 1.2,
      operatorEfficiency: 92,
      totalWorkOrders: 145,
      completedWorkOrders: 113,
      delayedWorkOrders: 18,
      totalOperators: 12,
      activeOperators: 8
    };
  }

  private getMockDelayTrend(): DelayTrendData[] {
    return Array.from({ length: 30 }, (_, i) => ({
      date: new Date(Date.now() - (29 - i) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      delay: Math.random() * 4,
      workOrdersCount: Math.floor(Math.random() * 10) + 5,
      onTimeCount: Math.floor(Math.random() * 8) + 2,
      delayedCount: Math.floor(Math.random() * 3)
    }));
  }

  private getMockOperatorEfficiency(): OperatorEfficiencyData[] {
    return [
      {
        operatorId: 'op-001',
        operator: {
          id: 'op-001',
          firstName: 'John',
          lastName: 'Smith',
          employeeId: 'EMP001'
        },
        workCenter: {
          id: 'wc-001',
          name: 'Assembly Line A',
          code: 'ALA'
        },
        expectedTime: 480,
        actualTime: 445,
        efficiency: 92.7,
        tasksCompleted: 15,
        onTimeCompletions: 13
      },
      {
        operatorId: 'op-002',
        operator: {
          id: 'op-002',
          firstName: 'Jane',
          lastName: 'Doe',
          employeeId: 'EMP002'
        },
        workCenter: {
          id: 'wc-002',
          name: 'Machining Center B',
          code: 'MCB'
        },
        expectedTime: 360,
        actualTime: 380,
        efficiency: 94.7,
        tasksCompleted: 12,
        onTimeCompletions: 11
      }
    ];
  }

  private getMockWorkOrderAnalysis(filters?: ReportFilters): PaginatedResponse<WorkOrderAnalysisData> {
    const mockData: WorkOrderAnalysisData[] = [
      {
        id: 'wo-001',
        orderNumber: 'WO-2024-001',
        operation: 'Assembly',
        workCenter: {
          id: 'wc-001',
          name: 'Assembly Line A',
          code: 'ALA'
        },
        operator: {
          id: 'op-001',
          firstName: 'John',
          lastName: 'Smith'
        },
        product: {
          id: 'prod-001',
          name: 'Steel Frame',
          sku: 'SF-001'
        },
        quantity: 10,
        expectedDuration: 120,
        actualDuration: 110,
        efficiency: 91.7,
        status: 'COMPLETED',
        startTime: '2024-01-17T08:00:00Z',
        endTime: '2024-01-17T10:00:00Z',
        qualityScore: 95,
        cost: {
          labor: 200.00,
          material: 500.00,
          overhead: 100.00,
          total: 800.00
        }
      },
      {
        id: 'wo-002',
        orderNumber: 'WO-2024-002',
        operation: 'Machining',
        workCenter: {
          id: 'wc-002',
          name: 'Machining Center B',
          code: 'MCB'
        },
        operator: {
          id: 'op-002',
          firstName: 'Jane',
          lastName: 'Doe'
        },
        product: {
          id: 'prod-002',
          name: 'Aluminum Component',
          sku: 'AC-002'
        },
        quantity: 25,
        expectedDuration: 90,
        actualDuration: 100,
        efficiency: 90.0,
        status: 'DELAYED',
        startTime: '2024-01-17T09:00:00Z',
        endTime: '2024-01-17T11:40:00Z',
        delayTime: 10,
        delayReason: 'Machine calibration required',
        qualityScore: 88,
        cost: {
          labor: 150.00,
          material: 300.00,
          overhead: 75.00,
          total: 525.00
        }
      }
    ];

    let filteredData = mockData;
    if (filters) {
      if (filters.operatorId) {
        filteredData = filteredData.filter(item => item.operator.id === filters.operatorId);
      }
      if (filters.workCenterId) {
        filteredData = filteredData.filter(item => item.workCenter.id === filters.workCenterId);
      }
      if (filters.status) {
        filteredData = filteredData.filter(item => item.status === filters.status);
      }
      if (filters.delayedOnly) {
        filteredData = filteredData.filter(item => item.status === 'DELAYED');
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

  private getMockProductionMetrics(): ProductionMetrics {
    return {
      totalProduction: 1250,
      onTimeDeliveries: 92.3,
      qualityScore: 94.5,
      utilizationRate: 87.2,
      throughputRate: 15.8,
      cycleTime: 45.5,
      setupTime: 12.3,
      downtime: 8.7
    };
  }

  private getMockOperators(): Array<{ id: string; firstName: string; lastName: string; employeeId: string }> {
    return [
      { id: 'op-001', firstName: 'John', lastName: 'Smith', employeeId: 'EMP001' },
      { id: 'op-002', firstName: 'Jane', lastName: 'Doe', employeeId: 'EMP002' },
      { id: 'op-003', firstName: 'Bob', lastName: 'Wilson', employeeId: 'EMP003' },
      { id: 'op-004', firstName: 'Alice', lastName: 'Johnson', employeeId: 'EMP004' }
    ];
  }

  private getMockWorkCenters(): Array<{ id: string; name: string; code: string }> {
    return [
      { id: 'wc-001', name: 'Assembly Line A', code: 'ALA' },
      { id: 'wc-002', name: 'Machining Center B', code: 'MCB' },
      { id: 'wc-003', name: 'Paint Shop C', code: 'PSC' },
      { id: 'wc-004', name: 'Quality Control D', code: 'QCD' }
    ];
  }
}

// Export singleton instance
export const reportsService = new ReportsService();