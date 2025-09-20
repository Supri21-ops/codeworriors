import { Pool } from 'pg';
import { config } from './env';
import { logger } from './logger';

// Create a pg Pool using DATABASE_URL. This provides a simple db.query API.
const pool = new Pool({ connectionString: config.DATABASE_URL });

const db = {
	query: async (text: string, params: any[] = []) => {
		const start = Date.now();
		try {
			const res = await pool.query(text, params);
			const duration = Date.now() - start;
			logger.debug(`SQL Query (${duration}ms): ${text} -- params: ${JSON.stringify(params)}`);
			return { rows: res.rows, rowCount: res.rowCount } as any;
		} catch (error) {
			logger.error('Database query error:', error);
			throw error;
		}
	},

	connect: async () => {
		try {
			await pool.connect();
			logger.info('Database pool connected');
			return true;
		} catch (error) {
			logger.error('Database pool connection failed:', error);
			throw error;
		}
	},

	disconnect: async () => {
		try {
			await pool.end();
			logger.info('Database pool closed');
		} catch (error) {
			logger.error('Error closing database pool:', error);
		}
	}
};

export { db };