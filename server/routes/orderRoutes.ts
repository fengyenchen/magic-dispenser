import { Router, Request, Response, NextFunction } from 'express';
import pool from '../db';

const router = Router();

// GET: 取得所有訂單
router.get('/', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { rows } = await pool.query('SELECT * FROM orders ORDER BY created_at DESC');

        return res.status(200).json({
            status: 'success',
            data: rows
        });
    } catch (err) {
        next(err);
    }
});

// GET: 取得使用者的所有訂單
router.get('/:userId', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { userId } = req.params;

        if (!userId) {
            return res.status(400).json({ status: 'error', message: '缺少使用者ID' });
        }
    
        const { rows } = await pool.query(
            'SELECT * FROM orders WHERE user_id = $1 ORDER BY created_at DESC',
            [userId]
        );

        return res.status(200).json({
            status: 'success',
            data: rows
        });
    } catch (err) {
        next(err);
    }
});

// POST: 打包某使用者的購物車成一筆訂單
router.post('/', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { user_id, total_price } = req.body;
        
        if (!user_id) {
            return res.status(400).json({ status: 'error', message: '缺少使用者ID' });
        }

        const { rows: cartItems } = await pool.query(
            'SELECT * FROM cart_items WHERE user_id = $1',
            [user_id]
        );

        if (cartItems.length === 0) {
            return res.status(404).json({ status: 'error', message: '購物車為空' });
        }

        const { rows } = await pool.query(
            'INSERT INTO orders (user_id, cart_items, total_price) VALUES ($1, $2, $3) RETURNING *',
            [user_id, JSON.stringify(cartItems), total_price]
        );

        await pool.query('DELETE FROM cart_items WHERE user_id = $1', [user_id]);

        return res.status(201).json({
            status: 'success',
            message: '訂單已成功建立！',
            data: rows[0]
        });
    } catch (err) {
        next(err);
    }
});

export default router;