"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.db = void 0;
const logger_1 = require("./logger");
const mockUsers = [
    {
        id: '1',
        email: 'admin@example.com',
        password: '$2a$12$rZnrCg8WW.2XnIWJx1x8FO8e8aMKBJGUYOG6m5.3D1k.KgK8k8k8k',
        name: 'Administrator',
        role: 'ADMIN',
        created_at: new Date(),
        updated_at: new Date()
    },
    {
        id: '2',
        email: 'user@example.com',
        password: '$2a$12$rZnrCg8WW.2XnIWJx1x8FO8e8aMKBJGUYOG6m5.3D1k.KgK8k8k8k',
        name: 'Test User',
        role: 'USER',
        created_at: new Date(),
        updated_at: new Date()
    }
];
exports.db = {
    query: async (sql, params = []) => {
        logger_1.logger.info(`Mock DB Query: ${sql} with params:`, params);
        if (sql.includes('SELECT') && sql.includes('users')) {
            if (sql.includes('WHERE email')) {
                const email = params[0];
                const user = mockUsers.find(u => u.email === email);
                return {
                    rows: user ? [user] : [],
                    rowCount: user ? 1 : 0
                };
            }
            if (sql.includes('WHERE id')) {
                const id = params[0];
                const user = mockUsers.find(u => u.id === id);
                return {
                    rows: user ? [user] : [],
                    rowCount: user ? 1 : 0
                };
            }
        }
        if (sql.includes('INSERT') && sql.includes('users')) {
            const newUser = {
                id: (mockUsers.length + 1).toString(),
                email: params[0],
                password: params[1],
                name: params[2],
                role: params[3] || 'USER',
                created_at: new Date(),
                updated_at: new Date()
            };
            mockUsers.push(newUser);
            return {
                rows: [newUser],
                rowCount: 1
            };
        }
        if (sql.includes('UPDATE')) {
            return {
                rows: [],
                rowCount: 1
            };
        }
        return {
            rows: [],
            rowCount: 0
        };
    },
    connect: async () => {
        logger_1.logger.info('Mock database connected');
        return true;
    },
    disconnect: async () => {
        logger_1.logger.info('Mock database disconnected');
    }
};
//# sourceMappingURL=database.js.map