import { Pool } from '@neondatabase/serverless';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), 'server/.env') });

// 建立連接池實例
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    max: 10, // 同時連線數量上限
    idleTimeoutMillis: 30000, // 連線閒置多久後自動釋放
});

// 測試連線是否成功
pool.query('SELECT NOW()', (err) => {
    if (err) {
        console.error('Neon 連線失敗：', err.message);
    } else {
        console.log('Neon 連線成功！');
    }
});

export default pool;