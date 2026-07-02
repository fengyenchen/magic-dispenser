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
    return data;
};

// 取得使用者的所有訂單
export const getOrders = async (userId: string): Promise<any[]> => {
    const response = await fetch(`${API_BASE_URL}/api/order/${userId}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
    });
    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message || '無法取得訂單');
    }
    return data.data;
};