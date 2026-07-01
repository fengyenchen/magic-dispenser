import type { MagicItem } from '../types/magic';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// 取得所有商品
export const getMagicItems = async (): Promise<MagicItem[]> => {
    const response = await fetch(`${API_BASE_URL}/api/magic`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || '無法取得商品');
    return data.data;
};

// 新增商品
export const createMagicItem = async (item: Omit<MagicItem, 'id'>): Promise<MagicItem> => {
    const response = await fetch(`${API_BASE_URL}/api/magic`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(item)
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || '無法新增商品');
    return data;
};

// 更新商品
export const updateMagicItem = async (id: string, item: Partial<MagicItem>): Promise<MagicItem> => {
    const response = await fetch(`${API_BASE_URL}/api/magic/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(item)
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || '無法更新商品');
    return data;
};

// 刪除商品
export const deleteMagicItem = async (id: string): Promise<void> => {
    const response = await fetch(`${API_BASE_URL}/api/magic/${id}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' }
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || '無法刪除商品');
}