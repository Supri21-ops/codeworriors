import { MockService } from '../../services/mock.service';

export class ProductService extends MockService {
  constructor() {
    super();
    this.data = [
      { 
        id: '1', 
        name: 'Sample Product', 
        description: 'Mock product', 
        price: 100, 
        sku: 'PROD-001',
        category: 'Electronics',
        createdAt: new Date(), 
        updatedAt: new Date() 
      }
    ];
    this.idCounter = 2;
  }

  // Alias methods for controller compatibility
  async getAllProducts(filters?: any) {
    return this.findAll();
  }

  async getProductById(id: string) {
    return this.findById(id);
  }

  async createProduct(data: any) {
    return this.create(data);
  }

  async updateProduct(id: string, data: any) {
    return this.update(id, data);
  }

  async deleteProduct(id: string) {
    return this.delete(id);
  }
}