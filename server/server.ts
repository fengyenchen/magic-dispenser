import express from 'express';
import type { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';

import magicRouter from './routes/magicRoutes';
import authRouter from './routes/authRoutes';

dotenv.config({ path: path.resolve(process.cwd(), 'server/.env') });

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors({
    origin: process.env.NODE_ENV === 'production' ? false : true,
    credentials: true
}));

app.use(express.json());

app.get('/api/health', (_req: Request, res: Response) => {
    res.json({
        status: "ok",
    });
});

app.use('/api/auth', authRouter);
app.use('/api/magic', magicRouter);

// 全域錯誤處理 middleware
app.use((err: any, _req: Request, res: Response, _next: any) => {
    console.error(err.stack);
    res.status(500).json({
        error: 'Internal Server Error',
    });
});

// 啟動伺服器
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

export default app;