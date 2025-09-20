import { exec, spawn } from 'child_process';
import { promisify } from 'util';
import { logger } from './logger';
import { writeFileSync, unlinkSync } from 'fs';
import { join } from 'path';
import { tmpdir } from 'os';

const execAsync = promisify(exec);

// Docker-based database interface using exec
export const db = {
  query: async (text: string, params: any[] = []) => {
    const start = Date.now();
    try {
      // Replace $1, $2, etc. with actual values for PostgreSQL
      let formattedSql = text;
      params.forEach((param, index) => {
        const placeholder = `$${index + 1}`;
        let value: string;
        
        if (param === null || param === undefined) {
          value = 'NULL';
        } else if (typeof param === 'string') {
          // Handle single quotes and potential command injection
          value = `'${param.replace(/'/g, "''").replace(/\\/g, '\\\\')}'`;
        } else if (typeof param === 'boolean') {
          value = param ? 'true' : 'false';
        } else if (param instanceof Date) {
          value = `'${param.toISOString()}'`;
        } else {
          value = String(param);
        }
        
        formattedSql = formattedSql.replace(new RegExp('\\' + placeholder + '\\b', 'g'), value);
      });

      // Execute query through Docker - handle multi-line queries properly
      // Convert multi-line SQL to single line and escape properly for PowerShell
      const singleLineSql = formattedSql.replace(/\s+/g, ' ').trim();
      
      // For PowerShell, we need to be more careful with escaping
      // Use double quotes and escape internal double quotes
      const escapedSql = singleLineSql.replace(/"/g, '""');
      const command = `docker exec -i pgvector-db psql -U erpuser -d erpdb -q -t -A -F "|" -c "${escapedSql}";`;
      
      logger.info('Executing command:', command);
      const { stdout, stderr } = await execAsync(command, { 
        shell: 'powershell.exe',
        maxBuffer: 1024 * 1024 // Increase buffer size
      });
      
      if (stderr && !stderr.includes('NOTICE')) {
        logger.error('Database query error:', stderr);
        throw new Error(stderr);
      }

      // Parse the output into rows
      const lines = stdout.trim().split('\n').filter(line => line.trim());
      const rows = lines.map(line => {
        const values = line.split('|');
        // Create a simple object - this is basic parsing, could be enhanced
        const row: any = {};
        
        // Parse based on query type and table
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
          } else if (isProductsQuery) {
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
          } else {
            // Generic parsing - just use the values as an array
            values.forEach((value, index) => {
              row[`col_${index}`] = value;
            });
          }
        }
        
        return row;
      });

      const duration = Date.now() - start;
      logger.debug(`Docker Query: ${text}, Duration: ${duration}ms, Rows: ${rows.length}`);
      
      return { 
        rows, 
        rowCount: rows.length,
        command: formattedSql
      };
    } catch (error) {
      logger.error('Database query failed:', error);
      throw error;
    }
  },

  connect: async () => {
    try {
      const { stdout } = await execAsync('docker exec -i pgvector-db psql -U erpuser -d erpdb -c "SELECT 1 as test;"');
      if (stdout.includes('1')) {
        logger.info('Database connected successfully via Docker exec');
        return true;
      }
      throw new Error('Connection test failed');
    } catch (error) {
      logger.error('Database connection failed:', error);
      throw error;
    }
  },

  disconnect: async () => {
    logger.info('Database connection closed (Docker exec mode)');
  }
};