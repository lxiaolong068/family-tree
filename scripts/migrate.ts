import { neon } from '@neondatabase/serverless';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';

// 加载环境变量
dotenv.config();

async function runMigration() {
  const dbUrl = process.env.NEON_DATABASE_URL;
  
  if (!dbUrl) {
    console.error('NEON_DATABASE_URL environment variable is not set');
    process.exit(1);
  }
  
  try {
    console.log('Connecting to database...');
    const sql = neon(dbUrl);
    
    // 读取迁移文件
    const migrationPath = path.join(process.cwd(), 'drizzle', '0002_add_relationships.sql');
    const migrationSql = fs.readFileSync(migrationPath, 'utf8');
    
    console.log('Running migration...');
    console.log(migrationSql);
    
    // 执行迁移
    const result = await sql(migrationSql);
    
    console.log('Migration completed successfully');
    console.log(result);
    
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  }
}

runMigration();
