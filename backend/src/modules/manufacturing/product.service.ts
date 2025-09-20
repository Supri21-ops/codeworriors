// Mock Product Service
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
        createdAt: new Date(), 
        updatedAt: new Date() 
      }
    ];
    this.idCounter = 2;
  }
}