"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserService = void 0;
const pg_1 = require("pg");
const env_1 = require("../../config/env");
const pool = new pg_1.Pool({ connectionString: env_1.config.DATABASE_URL });
const logger_1 = require("../../config/logger");
const errors_1 = require("../../libs/errors");
const pagination_1 = require("../../libs/pagination");
class UserService {
    async getUsers(page = 1, limit = 10, filters = {}) {
        try {
            const pagination = pagination_1.PaginationHelper.validatePagination(page, limit);
            const skip = pagination_1.PaginationHelper.calculateSkip(pagination.page, pagination.limit);
            const where = {};
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
            let sql = 'SELECT * FROM users WHERE 1=1';
            let countSql = 'SELECT COUNT(*) FROM users WHERE 1=1';
            let params = [];
            let countParams = [];
            if (filters.role) {
                sql += ' AND role = $' + (params.length + 1);
                countSql += ' AND role = $' + (countParams.length + 1);
                params.push(filters.role);
                countParams.push(filters.role);
            }
            if (filters.isActive !== undefined) {
                sql += ' AND isActive = $' + (params.length + 1);
                countSql += ' AND isActive = $' + (countParams.length + 1);
                params.push(filters.isActive === 'true');
                countParams.push(filters.isActive === 'true');
            }
            if (filters.search) {
                sql += ' AND (firstName ILIKE $' + (params.length + 1) + ' OR lastName ILIKE $' + (params.length + 1) + ' OR email ILIKE $' + (params.length + 1) + ' OR username ILIKE $' + (params.length + 1) + ')';
                countSql += ' AND (firstName ILIKE $' + (countParams.length + 1) + ' OR lastName ILIKE $' + (countParams.length + 1) + ' OR email ILIKE $' + (countParams.length + 1) + ' OR username ILIKE $' + (countParams.length + 1) + ')';
                params.push(`%${filters.search}%`);
                countParams.push(`%${filters.search}%`);
            }
            sql += ' ORDER BY createdAt DESC OFFSET $' + (params.length + 1) + ' LIMIT $' + (params.length + 2);
            params.push(skip, pagination.limit);
            const usersRes = await pool.query(sql, params);
            const users = usersRes.rows;
            const totalRes = await pool.query(countSql, countParams);
            const total = parseInt(totalRes.rows[0].count, 10);
            return pagination_1.PaginationHelper.createPaginationResult(users, total, pagination.page, pagination.limit);
        }
        catch (error) {
            logger_1.logger.error('Get users error:', error);
            throw error;
        }
    }
    async getUserById(id) {
        try {
            const { rows } = await pool.query('SELECT * FROM users WHERE id = $1', [id]);
            const user = rows[0];
            if (!user) {
                throw new errors_1.AppError('User not found', 404);
            }
            return user;
        }
        catch (error) {
            logger_1.logger.error('Get user by ID error:', error);
            throw error;
        }
    }
    async updateUser(id, data, currentUserId) {
        try {
            const { rows: existingRows } = await pool.query('SELECT * FROM users WHERE id = $1', [id]);
            const existingUser = existingRows[0];
            if (!existingUser) {
                throw new errors_1.AppError('User not found', 404);
            }
            const { rows: currentRows } = await pool.query('SELECT role FROM users WHERE id = $1', [currentUserId]);
            const currentUser = currentRows[0];
            if (currentUser?.role !== 'ADMIN' && currentUserId !== id) {
                throw new errors_1.AppError('Insufficient permissions', 403);
            }
            const updateData = {};
            if (data.firstName !== undefined)
                updateData.firstName = data.firstName;
            if (data.lastName !== undefined)
                updateData.lastName = data.lastName;
            if (data.email !== undefined)
                updateData.email = data.email;
            if (data.username !== undefined)
                updateData.username = data.username;
            if (data.role !== undefined && currentUser?.role === 'ADMIN') {
                updateData.role = data.role;
            }
            if (data.isActive !== undefined && currentUser?.role === 'ADMIN') {
                updateData.isActive = data.isActive;
            }
            const fields = Object.keys(updateData);
            const values = Object.values(updateData);
            if (fields.length === 0)
                return existingUser;
            let setClause = fields.map((f, i) => `${f} = $${i + 1}`).join(', ');
            await pool.query(`UPDATE users SET ${setClause}, updatedAt = NOW() WHERE id = $${fields.length + 1}`, [...values, id]);
            const { rows: updatedRows } = await pool.query('SELECT * FROM users WHERE id = $1', [id]);
            const updatedUser = updatedRows[0];
            logger_1.logger.info(`User updated: ${updatedUser.email}`);
            return updatedUser;
        }
        catch (error) {
            logger_1.logger.error('Update user error:', error);
            throw error;
        }
    }
    async deleteUser(id, currentUserId) {
        try {
            const { rows: existingRows } = await pool.query('SELECT * FROM users WHERE id = $1', [id]);
            const existingUser = existingRows[0];
            if (!existingUser) {
                throw new errors_1.AppError('User not found', 404);
            }
            if (currentUserId === id) {
                throw new errors_1.AppError('Cannot delete your own account', 400);
            }
            const { rows: currentRows } = await pool.query('SELECT role FROM users WHERE id = $1', [currentUserId]);
            const currentUser = currentRows[0];
            if (currentUser?.role !== 'ADMIN') {
                throw new errors_1.AppError('Insufficient permissions', 403);
            }
            await pool.query('DELETE FROM users WHERE id = $1', [id]);
            logger_1.logger.info(`User deleted: ${existingUser.email}`);
            return { message: 'User deleted successfully' };
        }
        catch (error) {
            logger_1.logger.error('Delete user error:', error);
            throw error;
        }
    }
    async getUserStats() {
        try {
            const totalRes = await pool.query('SELECT COUNT(*) FROM users');
            const activeRes = await pool.query('SELECT COUNT(*) FROM users WHERE isActive = true');
            const inactiveRes = await pool.query('SELECT COUNT(*) FROM users WHERE isActive = false');
            const byRoleRes = await pool.query('SELECT role, COUNT(*) as count FROM users GROUP BY role');
            return {
                total: parseInt(totalRes.rows[0].count, 10),
                active: parseInt(activeRes.rows[0].count, 10),
                inactive: parseInt(inactiveRes.rows[0].count, 10),
                byRole: byRoleRes.rows.reduce((acc, item) => {
                    acc[item.role] = parseInt(item.count, 10);
                    return acc;
                }, {})
            };
        }
        catch (error) {
            logger_1.logger.error('Get user stats error:', error);
            throw error;
        }
    }
}
exports.UserService = UserService;
//# sourceMappingURL=user.service.js.map