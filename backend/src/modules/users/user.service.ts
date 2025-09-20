import { prisma } from '../../config/prisma';
import { logger } from '../../config/logger';
import { AppError } from '../../libs/errors';
import { PaginationHelper } from '../../libs/pagination';

export class UserService {
  async getUsers(page = 1, limit = 10, filters: any = {}) {
    try {
      const pagination = PaginationHelper.validatePagination(page, limit);
      const skip = PaginationHelper.calculateSkip(pagination.page, pagination.limit);
      
      const where: any = {};
      
      if (filters.role) {
        where.role = filters.role;
      }
      
      if (filters.isActive !== undefined) {
        where.isActive = filters.isActive === 'true';
      }
      
      if (filters.search) {
        where.OR = [
          { firstName: { contains: filters.search, mode: 'insensitive' } },
          { lastName: { contains: filters.search, mode: 'insensitive' } },
          { email: { contains: filters.search, mode: 'insensitive' } },
          { username: { contains: filters.search, mode: 'insensitive' } }
        ];
      }

      const [users, total] = await Promise.all([
        prisma.user.findMany({
          where,
          skip,
          take: pagination.limit,
          select: {
            id: true,
            email: true,
            username: true,
            firstName: true,
            lastName: true,
            role: true,
            isActive: true,
            createdAt: true,
            updatedAt: true
          },
          orderBy: { createdAt: 'desc' }
        }),
        prisma.user.count({ where })
      ]);

      return PaginationHelper.createPaginationResult(users, total, pagination.page, pagination.limit);
    } catch (error) {
      logger.error('Get users error:', error);
      throw error;
    }
  }

  async getUserById(id: string) {
    try {
      const user = await prisma.user.findUnique({
        where: { id },
        select: {
          id: true,
          email: true,
          username: true,
          firstName: true,
          lastName: true,
          role: true,
          isActive: true,
          createdAt: true,
          updatedAt: true
        }
      });

      if (!user) {
        throw new AppError('User not found', 404);
      }

      return user;
    } catch (error) {
      logger.error('Get user by ID error:', error);
      throw error;
    }
  }

  async updateUser(id: string, data: any, currentUserId: string) {
    try {
      // Check if user exists
      const existingUser = await prisma.user.findUnique({
        where: { id }
      });

      if (!existingUser) {
        throw new AppError('User not found', 404);
      }

      // Check if user is trying to update their own profile or has admin role
      const currentUser = await prisma.user.findUnique({
        where: { id: currentUserId },
        select: { role: true }
      });

      if (currentUser?.role !== 'ADMIN' && currentUserId !== id) {
        throw new AppError('Insufficient permissions', 403);
      }

      const updateData: any = {};
      
      if (data.firstName !== undefined) updateData.firstName = data.firstName;
      if (data.lastName !== undefined) updateData.lastName = data.lastName;
      if (data.email !== undefined) updateData.email = data.email;
      if (data.username !== undefined) updateData.username = data.username;
      if (data.role !== undefined && currentUser?.role === 'ADMIN') {
        updateData.role = data.role;
      }
      if (data.isActive !== undefined && currentUser?.role === 'ADMIN') {
        updateData.isActive = data.isActive;
      }

      const updatedUser = await prisma.user.update({
        where: { id },
        data: updateData,
        select: {
          id: true,
          email: true,
          username: true,
          firstName: true,
          lastName: true,
          role: true,
          isActive: true,
          createdAt: true,
          updatedAt: true
        }
      });

      logger.info(`User updated: ${updatedUser.email}`);

      return updatedUser;
    } catch (error) {
      logger.error('Update user error:', error);
      throw error;
    }
  }

  async deleteUser(id: string, currentUserId: string) {
    try {
      // Check if user exists
      const existingUser = await prisma.user.findUnique({
        where: { id }
      });

      if (!existingUser) {
        throw new AppError('User not found', 404);
      }

      // Check if user is trying to delete themselves
      if (currentUserId === id) {
        throw new AppError('Cannot delete your own account', 400);
      }

      // Check if user has admin role
      const currentUser = await prisma.user.findUnique({
        where: { id: currentUserId },
        select: { role: true }
      });

      if (currentUser?.role !== 'ADMIN') {
        throw new AppError('Insufficient permissions', 403);
      }

      await prisma.user.delete({
        where: { id }
      });

      logger.info(`User deleted: ${existingUser.email}`);

      return { message: 'User deleted successfully' };
    } catch (error) {
      logger.error('Delete user error:', error);
      throw error;
    }
  }

  async getUserStats() {
    try {
      const [
        total,
        active,
        inactive,
        byRole
      ] = await Promise.all([
        prisma.user.count(),
        prisma.user.count({ where: { isActive: true } }),
        prisma.user.count({ where: { isActive: false } }),
        prisma.user.groupBy({
          by: ['role'],
          _count: { role: true }
        })
      ]);

      return {
        total,
        active,
        inactive,
        byRole: byRole.reduce((acc, item) => {
          acc[item.role] = item._count.role;
          return acc;
        }, {} as Record<string, number>)
      };
    } catch (error) {
      logger.error('Get user stats error:', error);
      throw error;
    }
  }
}