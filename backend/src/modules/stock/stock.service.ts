import { MockService } from '../../services/mock.service';

export class StockService extends MockService {
  constructor() {
    super();
    this.data = [
      { 
        id: '1', 
        productId: '1',
        quantity: 100, 
        location: 'Warehouse A',
        unitCost: 10,
        reorderLevel: 20,
        createdAt: new Date(), 
        updatedAt: new Date() 
      }
    ];
    this.idCounter = 2;
  }

  // Controller compatibility methods
  async getAllStockItems() { return this.findAll(); }
  async getStockItemById(id: string) { return this.findById(id); }
  async createStockItem(data: any) { return this.create(data); }
  async updateStockItem(id: string, data: any) { return this.update(id, data); }
  async deleteStockItem(id: string) { return this.delete(id); }
  async getStockMovements() { return []; }
  async createStockMovement(data: any, userId: string) { return { id: '1', ...data, userId }; }
  async getStockSummary() { return { totalValue: 1000, totalItems: this.data.length }; }
  async getLowStockItems() { return this.data.filter((item: any) => item.quantity < item.reorderLevel); }
}