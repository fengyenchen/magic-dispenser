import { Pool } from '@neondatabase/serverless';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 強制鎖定讀取當前資料夾下的 .env 檔案
dotenv.config({ path: path.resolve(__dirname, '.env') });

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