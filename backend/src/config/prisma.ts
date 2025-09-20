import { Pool } from 'pg';
import { config } from './env';

// Direct PostgreSQL connection using pg
export const pool = new Pool({ connectionString: config.DATABASE_URL });