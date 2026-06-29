import { Router, Request, Response, NextFunction } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import pool from '../db';

const router = Router();

const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret_key_arcana';

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
            { id: user.id, role: user.role },
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