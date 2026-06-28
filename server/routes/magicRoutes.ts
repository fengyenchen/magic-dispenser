import { Router, Request, Response, NextFunction } from 'express';
import pool from '../db';

const router = Router();

// GET: 取得所有商品
router.get('/', async (_req: Request, res: Response, next: NextFunction) => {
    try {
        const { rows } = await pool.query('SELECT * FROM magic_items');
        res.status(200).json({
            status: 'success',
            data: rows
        });
    } catch (err) {
        next(err);
    }
});

// POST: 新增商品
router.post('/', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { name, price, description, stock, category } = req.body;

        if (!name || !price || !category) {
            return res.status(400).json({ status: 'error', message: '商品名稱、價格與分類為必填欄位' });
        }

        const { rows } = await pool.query(
            `
            INSERT INTO magic_items (name, price, description, stock, category) 
            VALUES ($1, $2, $3, $4, $5) 
            RETURNING *
            `,
            [name, price, description, stock || 0, category]
        );

        res.status(201).json({
            status: 'success',
            data: rows[0]
        });
    } catch (err) {
        next(err);
    }
});

// PUT: 更新商品
router.put('/:id', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        const { name, price, description, stock, category } = req.body;

        const { rows } = await pool.query(
            `
            UPDATE magic_items
            SET name = COALESCE($1, name),
            price = COALESCE($2, price),
            description = COALESCE($3, description),
            stock = COALESCE($4, stock),
            category = COALESCE($5, category)
            WHERE id = $6
            RETURNING *
            `,
            [name, price, description, stock, category, id]
        );

        if (rows.length === 0) {
            return res.status(404).json({ status: 'error', message: '商品不存在' });
        }

        res.status(200).json({
            status: 'success',
            data: rows[0]
        });
    } catch (err) {
        next(err);
    }
});

// DELETE: 刪除商品
router.delete('/:id', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;

        const { rowCount } = await pool.query('DELETE FROM magic_items WHERE id = $1', [id]);

        if (rowCount === 0) {
            return res.status(404).json({ status: 'error', message: '商品不存在' });
        }

        res.status(200).json({
            status: 'success',
            message: '商品已刪除'
        });
    } catch (err) {
        next(err);
    }
});

export default router;