import { pool } from '../../config/prisma';
import { logger } from '../../config/logger';
import { AppError } from '../../libs/errors';
import { CreateManufacturingOrderDto, UpdateManufacturingOrderDto } from './dto';
import { kafkaService } from '../../config/kafka';
import { vectorService } from '../../services/vector.service';
import { priorityService } from '../../services/priority.service';

export class ManufacturingOrderService {
  async createManufacturingOrder(data: CreateManufacturingOrderDto, userId: string) {
    try {
      // Generate order number
      const orderNumber = await this.generateOrderNumber();

      // Check if product exists
      const productRes = await pool.query('SELECT * FROM products WHERE id = $1', [data.productId]);
      const product = productRes.rows[0];
      if (!product) {
        throw new AppError('Product not found', 404);
      }

      // Create manufacturing order
      const insertRes = await pool.query(
        `INSERT INTO manufacturing_orders (orderNumber, productId, quantity, priority, dueDate, notes, createdById)
         VALUES ($1, $2, $3, $4, $5, $6, $7)
         RETURNING *`,
        [orderNumber, data.productId, data.quantity, data.priority || 'NORMAL', data.dueDate, data.notes, userId]
      );
      const manufacturingOrder = insertRes.rows[0];

      // Publish Kafka event
      await kafkaService.publishManufacturingOrderEvent('MANUFACTURING_ORDER_CREATED', {
        orderId: manufacturingOrder.id,
        orderNumber: manufacturingOrder.orderNumber,
        productName: product.name,
        quantity: manufacturingOrder.quantity,
        userId
      });

      // Index for vector search
      const content = `${product.name} ${product.description || ''} ${manufacturingOrder.notes || ''}`;
      await vectorService.indexDocument(
        manufacturingOrder.id,
        content,
        {
          type: 'manufacturing_order',
          productId: manufacturingOrder.productId,
          quantity: manufacturingOrder.quantity,
          priority: manufacturingOrder.priority,
          status: manufacturingOrder.status
        },
        'manufacturing-orders'
      );

      // Calculate priority score
      await priorityService.calculatePriorityScore(manufacturingOrder.id, 'MANUFACTURING_ORDER');

      logger.info(`Manufacturing order created: ${orderNumber}`);

      return manufacturingOrder;
    } catch (error) {
      logger.error('Create manufacturing order error:', error);
      throw error;
    }
  }

  async getManufacturingOrders(page = 1, limit = 10, filters: any = {}) {
    try {
      const offset = (page - 1) * limit;
      let whereClauses = [];
      let params: any[] = [];
      let paramIdx = 1;
      if (filters.status) {
        whereClauses.push(`status = $${paramIdx}`);
        params.push(filters.status);
        paramIdx++;
      }
      if (filters.priority) {
        whereClauses.push(`priority = $${paramIdx}`);
        params.push(filters.priority);
        paramIdx++;
      }
      if (filters.productId) {
        whereClauses.push(`productId = $${paramIdx}`);
        params.push(filters.productId);
        paramIdx++;
      }
      const whereSQL = whereClauses.length ? `WHERE ${whereClauses.join(' AND ')}` : '';
      const ordersRes = await pool.query(
        `SELECT * FROM manufacturing_orders ${whereSQL} ORDER BY createdAt DESC LIMIT $${paramIdx} OFFSET $${paramIdx + 1}`,
        [...params, limit, offset]
      );
      const countRes = await pool.query(
        `SELECT COUNT(*) FROM manufacturing_orders ${whereSQL}`,
        params
      );
      const total = parseInt(countRes.rows[0].count, 10);
      return {
        orders: ordersRes.rows,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit)
        }
      };
    } catch (error) {
      logger.error('Get manufacturing orders error:', error);
      throw error;
    }
  }

  async getManufacturingOrderById(id: string) {
    try {
      const orderRes = await pool.query('SELECT * FROM manufacturing_orders WHERE id = $1', [id]);
      const order = orderRes.rows[0];
      if (!order) {
        throw new AppError('Manufacturing order not found', 404);
      }
      return order;
    } catch (error) {
      logger.error('Get manufacturing order by ID error:', error);
      throw error;
    }
  }

  async updateManufacturingOrder(id: string, data: UpdateManufacturingOrderDto, userId: string) {
    try {
      const orderRes = await pool.query('SELECT * FROM manufacturing_orders WHERE id = $1', [id]);
      const existingOrder = orderRes.rows[0];
      if (!existingOrder) {
        throw new AppError('Manufacturing order not found', 404);
      }
      // Build update SQL
      let updateFields = [];
      let params: any[] = [];
      let paramIdx = 1;
      if (data.quantity !== undefined) { updateFields.push(`quantity = $${paramIdx}`); params.push(data.quantity); paramIdx++; }
      if (data.priority) { updateFields.push(`priority = $${paramIdx}`); params.push(data.priority); paramIdx++; }
      if (data.status) { updateFields.push(`status = $${paramIdx}`); params.push(data.status); paramIdx++; }
      if (data.startDate) { updateFields.push(`startDate = $${paramIdx}`); params.push(data.startDate); paramIdx++; }
      if (data.endDate) { updateFields.push(`endDate = $${paramIdx}`); params.push(data.endDate); paramIdx++; }
      if (data.dueDate) { updateFields.push(`dueDate = $${paramIdx}`); params.push(data.dueDate); paramIdx++; }
      if (data.notes !== undefined) { updateFields.push(`notes = $${paramIdx}`); params.push(data.notes); paramIdx++; }
      if (updateFields.length === 0) {
        throw new AppError('No fields to update', 400);
      }
      params.push(id);
      const updateSQL = `UPDATE manufacturing_orders SET ${updateFields.join(', ')} WHERE id = $${paramIdx} RETURNING *`;
      const updateRes = await pool.query(updateSQL, params);
      const updatedOrder = updateRes.rows[0];

      // Create event
      await this.createEvent('MANUFACTURING_ORDER_UPDATED', {
        orderId: updatedOrder.id,
        orderNumber: updatedOrder.orderNumber,
        changes: data
      }, userId);

      logger.info(`Manufacturing order updated: ${updatedOrder.orderNumber}`);

      return updatedOrder;
    } catch (error) {
      logger.error('Update manufacturing order error:', error);
      throw error;
    }
  }

  async deleteManufacturingOrder(id: string, userId: string) {
    try {
      const orderRes = await pool.query('SELECT * FROM manufacturing_orders WHERE id = $1', [id]);
      const existingOrder = orderRes.rows[0];
      if (!existingOrder) {
        throw new AppError('Manufacturing order not found', 404);
      }
      // Check if order has work orders
      const workOrdersRes = await pool.query('SELECT * FROM work_orders WHERE manufacturingOrderId = $1', [id]);
      if (workOrdersRes.rows.length > 0) {
        throw new AppError('Cannot delete manufacturing order with existing work orders', 400);
      }
      await pool.query('DELETE FROM manufacturing_orders WHERE id = $1', [id]);
      logger.info(`Manufacturing order deleted: ${existingOrder.orderNumber}`);
      return { message: 'Manufacturing order deleted successfully' };
    } catch (error) {
      logger.error('Delete manufacturing order error:', error);
      throw error;
    }
  }

  async getManufacturingOrderStats() {
    try {
      const totalRes = await pool.query('SELECT COUNT(*) FROM manufacturing_orders');
      const plannedRes = await pool.query("SELECT COUNT(*) FROM manufacturing_orders WHERE status = 'PLANNED'");
      const inProgressRes = await pool.query("SELECT COUNT(*) FROM manufacturing_orders WHERE status = 'IN_PROGRESS'");
      const completedRes = await pool.query("SELECT COUNT(*) FROM manufacturing_orders WHERE status = 'COMPLETED'");
      const cancelledRes = await pool.query("SELECT COUNT(*) FROM manufacturing_orders WHERE status = 'CANCELLED'");
      const urgentRes = await pool.query("SELECT COUNT(*) FROM manufacturing_orders WHERE priority = 'URGENT'");
      return {
        total: parseInt(totalRes.rows[0].count, 10),
        planned: parseInt(plannedRes.rows[0].count, 10),
        inProgress: parseInt(inProgressRes.rows[0].count, 10),
        completed: parseInt(completedRes.rows[0].count, 10),
        cancelled: parseInt(cancelledRes.rows[0].count, 10),
        urgent: parseInt(urgentRes.rows[0].count, 10)
      };
    } catch (error) {
      logger.error('Get manufacturing order stats error:', error);
      throw error;
    }
  }

  private async generateOrderNumber(): Promise<string> {
    const countRes = await pool.query('SELECT COUNT(*) FROM manufacturing_orders');
    const count = parseInt(countRes.rows[0].count, 10);
    const orderNumber = `MO-${String(count + 1).padStart(4, '0')}`;
    return orderNumber;
  }

  private async createEvent(type: string, data: any, userId: string) {
    try {
      await pool.query(
        `INSERT INTO events (type, title, message, data, userId)
         VALUES ($1, $2, $3, $4, $5)`,
        [
          type,
          `Manufacturing Order ${type.split('_').join(' ').toLowerCase()}`,
          `Manufacturing order ${data.orderNumber} has been ${type.split('_')[2]?.toLowerCase()}`,
          JSON.stringify(data),
          userId
        ]
      );
    } catch (error) {
      logger.error('Create event error:', error);
      // Don't throw error for event creation failure
    }
  }
}