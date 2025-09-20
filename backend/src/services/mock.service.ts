// Universal mock service for all manufacturing modules
// This provides basic CRUD operations with mock data
import { logger } from '../config/logger';

export class MockService {
  protected data: any[] = [];
  protected idCounter = 1;

  async findAll() {
    logger.info(`Mock service findAll called, returning ${this.data.length} items`);
    return this.data;
  }

  async findById(id: string) {
    logger.info(`Mock service findById called with id: ${id}`);
    const item = this.data.find(item => item.id === id);
    return item || null;
  }

  async create(data: any) {
    logger.info('Mock service create called with data:', data);
    const newItem = {
      id: this.idCounter.toString(),
      ...data,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.data.push(newItem);
    this.idCounter++;
    return newItem;
  }

  async update(id: string, data: any) {
    logger.info(`Mock service update called with id: ${id} and data:`, data);
    const index = this.data.findIndex(item => item.id === id);
    if (index === -1) {
      return null;
    }
    this.data[index] = {
      ...this.data[index],
      ...data,
      updatedAt: new Date()
    };
    return this.data[index];
  }

  async delete(id: string) {
    logger.info(`Mock service delete called with id: ${id}`);
    const index = this.data.findIndex(item => item.id === id);
    if (index === -1) {
      return false;
    }
    this.data.splice(index, 1);
    return true;
  }
}