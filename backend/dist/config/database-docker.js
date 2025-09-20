"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.db = void 0;
const child_process_1 = require("child_process");
const util_1 = require("util");
const logger_1 = require("./logger");
const execAsync = (0, util_1.promisify)(child_process_1.exec);
exports.db = {
    query: async (text, params = []) => {
        const start = Date.now();
        try {
            let formattedSql = text;
            params.forEach((param, index) => {
                const placeholder = `$${index + 1}`;
                let value;
                if (param === null || param === undefined) {
                    value = 'NULL';
                }
                else if (typeof param === 'string') {
                    value = `'${param.replace(/'/g, "''").replace(/\\/g, '\\\\')}'`;
                }
                else if (typeof param === 'boolean') {
                    value = param ? 'true' : 'false';
                }
                else if (param instanceof Date) {
                    value = `'${param.toISOString()}'`;
                }
                else {
                    value = String(param);
                }
                formattedSql = formattedSql.replace(new RegExp('\\' + placeholder + '\\b', 'g'), value);
            });
            const singleLineSql = formattedSql.replace(/\s+/g, ' ').trim();
            const escapedSql = singleLineSql.replace(/"/g, '""');
            const command = `docker exec -i pgvector-db psql -U erpuser -d erpdb -q -t -A -F "|" -c "${escapedSql}";`;
            logger_1.logger.info('Executing command:', command);
            const { stdout, stderr } = await execAsync(command, {
                shell: 'powershell.exe',
                maxBuffer: 1024 * 1024
            });
            if (stderr && !stderr.includes('NOTICE')) {
                logger_1.logger.error('Database query error:', stderr);
                throw new Error(stderr);
            }
            const lines = stdout.trim().split('\n').filter(line => line.trim());
            const rows = lines.map(line => {
                const values = line.split('|');
                const row = {};
                const isUsersQuery = text.toLowerCase().includes('users');
                const isProductsQuery = text.toLowerCase().includes('products');
                const isSelectQuery = text.toLowerCase().includes('select');
                const isInsertReturning = text.toLowerCase().includes('insert') && text.toLowerCase().includes('returning');
                if (isSelectQuery || isInsertReturning) {
                    if (isUsersQuery) {
                        row.id = values[0] || null;
                        row.email = values[1] || null;
                        row.password = values[2] || null;
                        row.name = values[3] || null;
                        row.role = values[4] || null;
                        row.created_at = values[5] ? new Date(values[5]) : null;
                        row.updated_at = values[6] ? new Date(values[6]) : null;
                    }
                    else if (isProductsQuery) {
                        row.id = values[0] || null;
                        row.name = values[1] || null;
                        row.description = values[2] || null;
                        row.sku = values[3] || null;
                        row.category = values[4] || null;
                        row.unit = values[5] || null;
                        row.price = values[6] ? parseFloat(values[6]) : 0;
                        row.is_active = values[7] === 't';
                        row.created_at = values[8] ? new Date(values[8]) : null;
                        row.updated_at = values[9] ? new Date(values[9]) : null;
                    }
                    else {
                        values.forEach((value, index) => {
                            row[`col_${index}`] = value;
                        });
                    }
                }
                return row;
            });
            const duration = Date.now() - start;
            logger_1.logger.debug(`Docker Query: ${text}, Duration: ${duration}ms, Rows: ${rows.length}`);
            return {
                rows,
                rowCount: rows.length,
                command: formattedSql
            };
        }
        catch (error) {
            logger_1.logger.error('Database query failed:', error);
            throw error;
        }
    },
    connect: async () => {
        try {
            const { stdout } = await execAsync('docker exec -i pgvector-db psql -U erpuser -d erpdb -c "SELECT 1 as test;"');
            if (stdout.includes('1')) {
                logger_1.logger.info('Database connected successfully via Docker exec');
                return true;
            }
            throw new Error('Connection test failed');
        }
        catch (error) {
            logger_1.logger.error('Database connection failed:', error);
            throw error;
        }
    },
    disconnect: async () => {
        logger_1.logger.info('Database connection closed (Docker exec mode)');
    }
};
//# sourceMappingURL=database-docker.js.map