import { MockService } from '../../services/mock.service';

export class WorkOrderService extends MockService {
  constructor() {
    super();
    this.data = [
      { 
        id: '1', 
        orderNumber: 'WO-001',
        productId: '1',
        quantity: 10,
        status: 'PENDING',
        priority: 'MEDIUM',
        dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
        createdAt: new Date(), 
        updatedAt: new Date() 
      }
    ];
    this.idCounter = 2;
  }

  // Controller compatibility methods
  async getAllWorkOrders(filters?: any) { return this.findAll(); }
  async getWorkOrderById(id: string) { return this.findById(id); }
  async createWorkOrder(data: any) { return this.create(data); }
  async updateWorkOrder(id: string, data: any) { return this.update(id, data); }
  async deleteWorkOrder(id: string) { return this.delete(id); }
  async startWorkOrder(id: string, userId: string) { 
    return this.update(id, { status: 'IN_PROGRESS', startedBy: userId, startedAt: new Date() });
  }
  async pauseWorkOrder(id: string, userId: string) { 
    return this.update(id, { status: 'PAUSED', pausedBy: userId, pausedAt: new Date() });
  }
  async completeWorkOrder(id: string, userId: string) { 
    return this.update(id, { status: 'COMPLETED', completedBy: userId, completedAt: new Date() });
  }
  async cancelWorkOrder(id: string, userId: string, reason?: string) { 
    return this.update(id, { status: 'CANCELLED', cancelledBy: userId, cancelledAt: new Date(), cancelReason: reason });
  }
}