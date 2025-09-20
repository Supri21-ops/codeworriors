import { MockService } from '../../services/mock.service';

export class WorkCenterService extends MockService {
  constructor() {
    super();
    this.data = [
      { 
        id: '1', 
        name: 'Assembly Line A',
        description: 'Main assembly line',
        capacity: 50,
        isActive: true,
        createdAt: new Date(), 
        updatedAt: new Date() 
      }
    ];
    this.idCounter = 2;
  }

  // Controller compatibility methods
  async getAllWorkCenters() { return this.findAll(); }
  async getWorkCenterById(id: string) { return this.findById(id); }
  async createWorkCenter(data: any) { return this.create(data); }
  async updateWorkCenter(id: string, data: any) { return this.update(id, data); }
  async deleteWorkCenter(id: string) { return this.delete(id); }
  async getWorkCenterCapacity(id: string) { 
    const wc = await this.findById(id);
    return wc ? { capacity: wc.capacity, currentLoad: 10 } : null;
  }
  async updateWorkCenterCapacity(id: string, data: any) { 
    return this.update(id, { capacity: data.capacity });
  }
}