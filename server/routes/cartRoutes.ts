import { Router, Request, Response, NextFunction } from 'express';
import pool from '../db';

const router = Router();

// POST: 新增物資到大釜 (購物車)
router.post('/', async (req: any, res: Response, next: NextFunction) => {
    try {
        const { user_id, magic_item_id } = req.body;

        if (!user_id || !magic_item_id) {
            return res.status(400).json({ status: 'error', message: '缺少使用者或物資ID' });
        }

        const { rows: existing } = await pool.query(
            'SELECT * FROM cart_items WHERE user_id = $1 AND magic_item_id = $2',
            [user_id, magic_item_id]
        );

        await pool.query(
            'UPDATE magic_items SET stock = stock - 1 WHERE id = $1 RETURNING *',
            [magic_item_id]
        );

        if (existing.length > 0) {
            const { rows } = await pool.query(
                'UPDATE cart_items SET quantity = quantity + 1 WHERE user_id = $1 AND magic_item_id = $2 RETURNING *',
                [user_id, magic_item_id]
            );
            return res.status(200).json({ 
                status: 'success', 
                message: '物資已成功投入大釜！',
                data: rows[0]
            });
        } else {
            const { rows } = await pool.query(
                'INSERT INTO cart_items (user_id, magic_item_id, quantity) VALUES ($1, $2, 1) RETURNING *',
                [user_id, magic_item_id]
            );
            return res.status(201).json({
                status: 'success',
                message: '物資已成功投入大釜！',
                data: rows[0]
            });
        }
    } catch (err) {
        next(err);
    }
});

// PUT: 更新購物車物資數量 (加1)
router.put('/add', async (req: any, res: Response, next: NextFunction) => {
    try {
        const { user_id, magic_item_id } = req.body;

        if (!user_id || !magic_item_id) {
            return res.status(400).json({ status: 'error', message: '缺少使用者或物資ID' });
        }

        await pool.query(
            'UPDATE cart_items SET quantity = quantity + 1 WHERE user_id = $1 AND magic_item_id = $2 RETURNING *',
            [user_id, magic_item_id]
        );

        await pool.query(
            'UPDATE magic_items SET stock = stock - 1 WHERE id = $1 RETURNING *',
            [magic_item_id]
        );

        const { rows } = await pool.query(
            'SELECT * FROM cart_items WHERE user_id = $1 AND magic_item_id = $2',
            [user_id, magic_item_id]
        );
        return res.status(200).json({
            status: 'success',
            message: '購物車物資數量已更新！',
            data: rows[0]
        });
    } catch (err) {
        next(err);
    }
});

// PUT: 更新購物車物資數量 (減1)
router.put('/subtract', async (req: any, res: Response, next: NextFunction) => {
    try {
        const { user_id, magic_item_id } = req.body;

        if (!user_id || !magic_item_id) {
            return res.status(400).json({ status: 'error', message: '缺少使用者或物資ID' });
        }

        await pool.query(
            'UPDATE cart_items SET quantity = quantity - 1 WHERE user_id = $1 AND magic_item_id = $2 RETURNING *',
            [user_id, magic_item_id]
        );

        await pool.query(
            'UPDATE magic_items SET stock = stock + 1 WHERE id = $1 RETURNING *',
            [magic_item_id]
        );

        const { rows } = await pool.query(
            'SELECT * FROM cart_items WHERE user_id = $1 AND magic_item_id = $2',
            [user_id, magic_item_id]
        );
        return res.status(200).json({
            status: 'success',
            message: '購物車物資數量已更新！',
            data: rows[0]
        });
    } catch (err) {
        next(err);
    }
});

export default router;