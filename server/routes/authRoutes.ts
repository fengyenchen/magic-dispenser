import { Router, Request, Response, NextFunction } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import pool from '../db';

const router = Router();

const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret_key_arcana';


// GET: 取得目前登入使用者資料

// 擴充 Express Request 型別，讓後面的 authenticate 中間件可以在 req 上用 user 屬性
interface AuthRequest extends Request {
    user?: {
        id: string;
    };
}

// 驗證前端 Request Header 帶過來的 Token
const authenticate = (req: AuthRequest, res: Response, next: NextFunction) => {
    const authHeader = req.headers['authorization'];
    if (!authHeader?.startsWith('Bearer ')) {
        return res.status(401).json({ status: 'error', message: '未提供 Token 或格式錯誤' });
    }
    const token = authHeader.split(' ')[1];

    jwt.verify(token, JWT_SECRET, (err, decoded: any) => {
        if (err) {
            return res.status(403).json({ status: 'error', message: '憑證無效或已過期' });
        }
        req.user = { id: decoded.id };  // 將解密後的使用者 ID 存到 req.user
        next(); // 放行
    });
};

router.get('/me', authenticate, async (req: any, res: Response) => {
    try {
        const userId = req.user.id;

        const { rows } = await pool.query(
            'SELECT id, account, username, role FROM users WHERE id = $1',
            [userId]
        );

        res.status(200).json({
            status: 'success',
            user: rows[0]
        });
    } catch (err) {
        res.status(500).json({ status: 'error', message: '伺服器錯誤' });
    }
});

// GET: 取得所有使用者
router.get('/', async (_req: Request, res: Response, next: NextFunction) => {
    try {
        const { rows } = await pool.query('SELECT id, account, username, role FROM users');
        res.status(200).json({
            status: 'success',
            data: rows
        });
    } catch (err) {
        next(err);
    }
});

// POST: 註冊
router.post('/register', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { account, password, username, role } = req.body;

        if (!account || !password || !username) {
            return res.status(400).json({ status: 'error', message: '信箱、密碼與使用者暱稱皆為必填欄位' });
        }

        const finalRole = role || 'student';
        if (finalRole !== 'student' && finalRole !== 'professor') {
            return res.status(400).json({ status: 'error', message: '無效的使用者角色' });
        }

        // 檢查帳號是否已經存在
        const check = await pool.query('SELECT id FROM users WHERE account = $1', [account]);

        if (check.rows.length > 0) {
            return res.status(400).json({ status: 'error', message: '此信箱已被其他使用者註冊' });
        }

        // 加密密碼
        const hashedPassword = await bcrypt.hash(password, 10);

        const { rows } = await pool.query(
            `
            INSERT INTO users (account, password, username, role) 
            VALUES ($1, $2, $3, $4) 
            RETURNING id, account, username, role
            `,
            [account, hashedPassword, username, finalRole]
        );

        res.status(201).json({
            status: 'success',
            message: '註冊成功！',
            data: rows[0]
        });

    } catch (err) {
        next(err);
    }
});

// POST: 登入
router.post('/login', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { account, password } = req.body;

        if (!account || !password) {
            return res.status(400).json({ status: 'error', message: '帳號和密碼皆為必填' });
        }

        const { rows } = await pool.query('SELECT * FROM users WHERE account = $1', [account]);

        if (rows.length === 0) {
            return res.status(401).json({ status: 'error', message: '帳號或密碼錯誤' });
        }

        const user = rows[0];

        // 比對密碼
        const isPasswordMatch = await bcrypt.compare(password, user.password);

        if (!isPasswordMatch) {
            return res.status(401).json({ status: 'error', message: '帳號或密碼錯誤' });
        }

        // 生成 JWT
        const token = jwt.sign(
            { id: user.id },
            JWT_SECRET,
            { expiresIn: '24h' }
        );

        res.status(200).json({
            status: 'success',
            message: '登入成功',
            token,
            user: {
                id: user.id,
                account: user.account,
                username: user.username,
                role: user.role
            }
        });

    } catch (err) {
        next(err);
    }
});

export default router;