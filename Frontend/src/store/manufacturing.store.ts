import { create } from 'zustand';
import { ManufacturingOrder, WorkOrder, ManufacturingOrderStats } from '../services/manufacturing.service';
import { manufacturingService } from '../services/manufacturing.service';

interface UpdateWorkOrderPayload {
  status?: 'PLANNED' | 'RELEASED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED' | 'ON_HOLD';
  priority?: 'LOW' | 'NORMAL' | 'HIGH' | 'URGENT';
  plannedStartDate?: string;
  plannedEndDate?: string;
  actualStartDate?: string;
  actualEndDate?: string;
  assignedUserId?: string;
  notes?: string;
  estimatedDuration?: number;
  actualDuration?: number;
}

interface ManufacturingState {
  // Manufacturing Orders
  manufacturingOrders: ManufacturingOrder[];
  currentOrder: ManufacturingOrder | null;
  ordersStats: ManufacturingOrderStats | null;
  ordersLoading: boolean;
  ordersError: string | null;
  statsLoading: boolean;
  statsError: string | null;
  
  // Work Orders
  workOrders: WorkOrder[];
  currentWorkOrder: WorkOrder | null;
  workOrdersLoading: boolean;
  workOrdersError: string | null;
  
  // Filters
  ordersFilters: {
    status?: string;
    priority?: string;
    productId?: string;
    page: number;
    limit: number;
  };
  
  workOrdersFilters: {
    status?: string;
    priority?: string;
    workCenterId?: string;
    page: number;
    limit: number;
  };
  
  // Pagination
  ordersPagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
    hasNext: boolean;
    hasPrev: boolean;
  } | null;
  
  workOrdersPagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
    hasNext: boolean;
    hasPrev: boolean;
  } | null;
  // Internal timestamps to prevent rapid repeated fetches
  _lastOrdersFetch?: number;
  _lastWorkOrdersFetch?: number;
  // Auto-refresh control
  autoRefreshEnabled?: boolean;
  startAutoRefresh: (intervalMs: number) => void;
  stopAutoRefresh: () => void;
  triggerRefresh: (filters?: any) => Promise<void>;

  // Actions
  fetchManufacturingOrders: (filters?: any, options?: { force?: boolean }) => Promise<void>;
  fetchManufacturingOrderById: (id: string) => Promise<void>;
  createManufacturingOrder: (data: any) => Promise<void>;
  updateManufacturingOrder: (id: string, data: any) => Promise<void>;
  deleteManufacturingOrder: (id: string) => Promise<void>;
  fetchOrdersStats: () => Promise<void>;
  
  fetchWorkOrders: (filters?: any) => Promise<void>;
  fetchWorkOrderById: (id: string) => Promise<void>;
  createWorkOrder: (data: any) => Promise<void>;
  updateWorkOrder: (id: string, data: UpdateWorkOrderPayload) => Promise<void>;
  deleteWorkOrder: (id: string) => Promise<void>;
  
  setOrdersFilters: (filters: any) => void;
  setWorkOrdersFilters: (filters: any) => void;
  clearErrors: () => void;
  setCurrentOrder: (order: ManufacturingOrder | null) => void;
  setCurrentWorkOrder: (workOrder: WorkOrder | null) => void;
}

export const useManufacturingStore = create<ManufacturingState>((set, get) => ({
  // Initial state
  manufacturingOrders: [],
  currentOrder: null,
  ordersStats: null,
  ordersLoading: false,
  ordersError: null,
  statsLoading: false,
  statsError: null,
  
  workOrders: [],
  currentWorkOrder: null,
  workOrdersLoading: false,
  workOrdersError: null,
  
  ordersFilters: {
    page: 1,
    limit: 10,
  },
  
  workOrdersFilters: {
    page: 1,
    limit: 10,
  },
  
  ordersPagination: null,
  workOrdersPagination: null,
  _lastOrdersFetch: 0,
  _lastWorkOrdersFetch: 0,
  autoRefreshEnabled: false,
  _autoRefreshTimer: 0,

  // internal auto-refresh timer will be stored in closure

  // Manufacturing Orders Actions
  fetchManufacturingOrders: async (filters = {}, options: { force?: boolean } = {}) => {
    const { ordersLoading, autoRefreshEnabled } = get();
    // Prevent overlapping requests
    if (ordersLoading) return;

    // If this fetch is not forced and auto-refresh is disabled, don't run.
    if (!options.force && !autoRefreshEnabled) return;

    // Prevent immediate repeated fetches (simple debounce)
    const now = Date.now();
    const last = (get() as any)._lastOrdersFetch || 0;
    if (now - last < 800 && !options.force) return; // ignore calls within 800ms unless forced

    set({ ordersLoading: true, ordersError: null, _lastOrdersFetch: now });
    
    try {
      const currentFilters = { ...get().ordersFilters, ...filters };
      const response = await manufacturingService.getManufacturingOrders(currentFilters);
      
      set({
        manufacturingOrders: response.data,
        ordersPagination: response.pagination,
        ordersLoading: false,
        ordersError: null,
      });
    } catch (error: any) {
      set({
        ordersError: error.message || 'Failed to fetch manufacturing orders',
        ordersLoading: false,
      });
    }
  },

  fetchManufacturingOrderById: async (id: string) => {
    set({ ordersLoading: true, ordersError: null });
    
    try {
      const order = await manufacturingService.getManufacturingOrderById(id);
      set({
        currentOrder: order,
        ordersLoading: false,
        ordersError: null,
      });
    } catch (error: any) {
      set({
        ordersError: error.message || 'Failed to fetch manufacturing order',
        ordersLoading: false,
      });
    }
  },

  createManufacturingOrder: async (data: any) => {
    set({ ordersLoading: true, ordersError: null });
    
    try {
  await manufacturingService.createManufacturingOrder(data);
  // Trigger a controlled refresh (force)
  await get().triggerRefresh();
      set({ ordersLoading: false, ordersError: null });
    } catch (error: any) {
      set({
        ordersError: error.message || 'Failed to create manufacturing order',
        ordersLoading: false,
      });
      throw error;
    }
  },

  updateManufacturingOrder: async (id: string, data: any) => {
    set({ ordersLoading: true, ordersError: null });
    
    try {
  await manufacturingService.updateManufacturingOrder(id, data);
  await get().triggerRefresh();
      set({ ordersLoading: false, ordersError: null });
    } catch (error: any) {
      set({
        ordersError: error.message || 'Failed to update manufacturing order',
        ordersLoading: false,
      });
      throw error;
    }
  },

  deleteManufacturingOrder: async (id: string) => {
    set({ ordersLoading: true, ordersError: null });
    
    try {
  await manufacturingService.deleteManufacturingOrder(id);
  await get().triggerRefresh();
      set({ ordersLoading: false, ordersError: null });
    } catch (error: any) {
      set({
        ordersError: error.message || 'Failed to delete manufacturing order',
        ordersLoading: false,
      });
      throw error;
    }
  },

  fetchOrdersStats: async () => {
    const { statsLoading } = get();
    if (statsLoading) return; // Prevent multiple simultaneous requests
    
    set({ statsLoading: true, statsError: null });
    
    try {
      const stats = await manufacturingService.getManufacturingOrderStats();
      set({ 
        ordersStats: stats, 
        statsLoading: false, 
        statsError: null 
      });
    } catch (error: any) {
      console.error('Failed to fetch orders stats:', error);
      set({ 
        statsLoading: false, 
        statsError: error.message || 'Failed to fetch orders stats'
      });
      
      // Set mock data to prevent infinite retries
      set({
        ordersStats: {
          total: 0,
          planned: 0,
          inProgress: 0,
          completed: 0,
          cancelled: 0,
          urgent: 0
        }
      });
    }
  },

  // Work Orders Actions
  fetchWorkOrders: async (filters = {}) => {
    const { workOrdersLoading } = get();
    if (workOrdersLoading) return;

    const now = Date.now();
    const last = (get() as any)._lastWorkOrdersFetch || 0;
    if (now - last < 800) return;

    set({ workOrdersLoading: true, workOrdersError: null, _lastWorkOrdersFetch: now });
    
    try {
      const currentFilters = { ...get().workOrdersFilters, ...filters };
      const response = await manufacturingService.getWorkOrders(currentFilters);
      
      set({
        workOrders: response.data,
        workOrdersPagination: response.pagination,
        workOrdersLoading: false,
        workOrdersError: null,
      });
    } catch (error: any) {
      set({
        workOrdersError: error.message || 'Failed to fetch work orders',
        workOrdersLoading: false,
      });
    }
  },

  // Trigger a forced refresh of manufacturing orders (used by create/update/delete flows)
  triggerRefresh: async (filters = {}) => {
    // call fetchManufacturingOrders with force
    await (get() as any).fetchManufacturingOrders(filters, { force: true });
  },

  // Start periodic auto-refresh; subsequent automatic fetches will run only when enabled
  startAutoRefresh: (intervalMs: number) => {
    // store timer in a closure variable by mutating this store object
    if ((get() as any)._autoRefreshTimer) return;
    set({ autoRefreshEnabled: true });
    const timerId = setInterval(async () => {
      try {
        await (get() as any).fetchManufacturingOrders({}, { force: true });
      } catch (e) {
        // ignore errors from periodic refresh
      }
    }, intervalMs) as unknown as number;
    // Save timer id in state for later clearing
    set({ _autoRefreshTimer: timerId } as any);
  },

  stopAutoRefresh: () => {
    const timerId = (get() as any)._autoRefreshTimer;
    if (timerId) {
      clearInterval(timerId as unknown as number);
      set({ _autoRefreshTimer: 0 } as any);
    }
    set({ autoRefreshEnabled: false });
  },

  fetchWorkOrderById: async (id: string) => {
    set({ workOrdersLoading: true, workOrdersError: null });
    
    try {
      const workOrder = await manufacturingService.getWorkOrderById(id);
      set({
        currentWorkOrder: workOrder,
        workOrdersLoading: false,
        workOrdersError: null,
      });
    } catch (error: any) {
      set({
        workOrdersError: error.message || 'Failed to fetch work order',
        workOrdersLoading: false,
      });
    }
  },

  createWorkOrder: async (data: any) => {
    set({ workOrdersLoading: true, workOrdersError: null });
    
    try {
      await manufacturingService.createWorkOrder(data);
      await get().fetchWorkOrders();
      set({ workOrdersLoading: false, workOrdersError: null });
    } catch (error: any) {
      set({
        workOrdersError: error.message || 'Failed to create work order',
        workOrdersLoading: false,
      });
      throw error;
    }
  },

  updateWorkOrder: async (id: string, data: any) => {
    set({ workOrdersLoading: true, workOrdersError: null });
    
    try {
      await manufacturingService.updateWorkOrder(id, data);
      await get().fetchWorkOrders();
      set({ workOrdersLoading: false, workOrdersError: null });
    } catch (error: any) {
      set({
        workOrdersError: error.message || 'Failed to update work order',
        workOrdersLoading: false,
      });
      throw error;
    }
  },

  deleteWorkOrder: async (id: string) => {
    set({ workOrdersLoading: true, workOrdersError: null });
    
    try {
      await manufacturingService.deleteWorkOrder(id);
      await get().fetchWorkOrders();
      set({ workOrdersLoading: false, workOrdersError: null });
    } catch (error: any) {
      set({
        workOrdersError: error.message || 'Failed to delete work order',
        workOrdersLoading: false,
      });
      throw error;
    }
  },

  // Utility Actions
  setOrdersFilters: (filters: any) => {
    set({ ordersFilters: { ...get().ordersFilters, ...filters } });
  },

  setWorkOrdersFilters: (filters: any) => {
    set({ workOrdersFilters: { ...get().workOrdersFilters, ...filters } });
  },

  clearErrors: () => {
    set({ 
      ordersError: null, 
      workOrdersError: null 
    });
  },

  setCurrentOrder: (order: ManufacturingOrder | null) => {
    set({ currentOrder: order });
  },

  setCurrentWorkOrder: (workOrder: WorkOrder | null) => {
    set({ currentWorkOrder: workOrder });
  },
}));
