import { getMagicItem } from './magicService';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// 建立訂單
export const createOrder = async (userId: string, totalPrice: number): Promise<any> => {
    const response = await fetch(`${API_BASE_URL}/api/order`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: userId, total_price: totalPrice })
    });
    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message || '無法建立訂單');
    }
    return data.data;
};

// 取得所有訂單
export const getAllOrders = async (): Promise<any[]> => {
    const response = await fetch(`${API_BASE_URL}/api/order`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
    });
    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message || '無法取得訂單');
    }
    return data.data;
};


// 取得使用者的所有訂單
export const getOrders = async (userId: string): Promise<any[]> => {
    const response = await fetch(`${API_BASE_URL}/api/order/user/${userId}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
    });
    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message || '無法取得訂單');
    }
    return data.data;
};

// 取得訂單資訊
export const getOrder = async (orderId: string): Promise<any> => {
    const response = await fetch(`${API_BASE_URL}/api/order/detail/${orderId}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message || '無法取得訂單詳細資訊');
    }

    let dataList = data.data?.cart_items;

    // 防呆：如果是字串就解析它；如果本來就是物件/陣列就不用動；如果是空的就給空陣列
    if (typeof dataList === 'string') {
        dataList = JSON.parse(dataList);
    }
    if (!Array.isArray(dataList)) {
        dataList = [];
    }

    for (const item of dataList) {
        const magicItem = await getMagicItem(item.magic_item_id);
            item.magic_item_name = magicItem.name;
            item.price = magicItem.price;
    }

    return dataList
};

// 更新訂單狀態
export const updateOrderStatus = async (orderId: string, status: string): Promise<any> => {
    const response = await fetch(`${API_BASE_URL}/api/order/status/${orderId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
    });
    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message || '無法更新訂單狀態');
    }
    return data.data;
};