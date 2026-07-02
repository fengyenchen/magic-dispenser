import { Router, Request, Response, NextFunction } from 'express';
import pool from '../db.js';

const router = Router();

// GET: 取得使用者購物車物資
router.get('/:userId', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { userId } = req.params;

        if (!userId) {
            return res.status(400).json({ status: 'error', message: '缺少使用者ID' });
        }

        const { rows } = await pool.query(
            `SELECT 
                c.id AS cart_item_id,
                c.quantity, 
                m.id AS magic_item_id, 
                m.name, 
                m.price, 
                m.stock,
                m.category
            FROM cart_items c
            JOIN magic_items m ON c.magic_item_id = m.id
            WHERE c.user_id = $1
            ORDER BY m.category, m.name
            `,
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

        const { rows: check } = await pool.query(
            'SELECT stock FROM magic_items WHERE id = $1',
            [magic_item_id]
        );

        if (check[0].stock <= 0) {
            return res.status(400).json({ status: 'error', message: '庫存不足，無法加入大釜' });
        }

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

// PUT: 更新購物車物資數量
router.put('/adjust', async (req: any, res: Response, next: NextFunction) => {
    try {
        const { cart_id, delta } = req.body;

        if (!cart_id || delta === undefined) {
            return res.status(400).json({ status: 'error', message: '缺少購物車項目ID或數量變更' });
        }

        const { rows: check } = await pool.query(
            'SELECT m.stock FROM cart_items c JOIN magic_items m ON c.magic_item_id = m.id WHERE c.id = $1',
            [cart_id]
        );

        if (check[0].stock - delta < 0) {
            return res.status(400).json({ status: 'error', message: '庫存不足，無法增加物資數量' });
        }
        
        const { rows: cartItemRows } = await pool.query(
            'UPDATE cart_items SET quantity = quantity + $2 WHERE id = $1 RETURNING *',
            [cart_id, delta]
        );

        await pool.query(
            'UPDATE magic_items SET stock = stock - $2 WHERE id = $1 RETURNING *',
            [cartItemRows[0].magic_item_id, delta]
        );

        const { rows } = await pool.query(
            'SELECT * FROM cart_items WHERE id = $1',
            [cart_id]
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

// DELETE: 從大釜移除物資
router.delete('/:cartId', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { cartId } = req.params;

        if (!cartId) {
            return res.status(400).json({ status: 'error', message: '缺少購物車項目ID' });
        }

        const { rows: target } = await pool.query(
            'SELECT magic_item_id, quantity FROM cart_items WHERE id = $1',
            [cartId]
        );

        if (target.length === 0) {
            return res.status(404).json({ status: 'error', message: '購物車項目不存在' });
        }

        const { magic_item_id, quantity } = target[0];

        await pool.query(
            'UPDATE magic_items SET stock = stock + $2 WHERE id = $1',
            [magic_item_id, quantity]
        );

        await pool.query('DELETE FROM cart_items WHERE id = $1', [cartId]);

        return res.status(200).json({
            status: 'success',
            message: '物資已從大釜移除，庫存已成功歸還！'
        });
    } catch (err) {
        next(err);
    }
});