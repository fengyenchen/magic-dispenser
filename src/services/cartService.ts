const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// 取得大釜 (購物車) 內的物資
export const getCartItems = async (userId: string): Promise<any[]> => {
    const response = await fetch(`${API_BASE_URL}/api/cart/${userId}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
    });
    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message || '無法讀取大釜內物資');
    }

    return data.data;
};

// 將物資加入大釜 (購物車)
export const addToCart = async (userId: string, magicItemId: string): Promise<any> => {
    const response = await fetch(`${API_BASE_URL}/api/cart`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: userId, magic_item_id: magicItemId })
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message || '大釜拒絕了該物資');
    }

    return data;
};

// 調整大釜 (購物車) 內物資的數量
export const adjustCartQuantity = async (cartId: string, delta: number): Promise<any> => {
    const response = await fetch(`${API_BASE_URL}/api/cart/adjust`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cart_id: cartId, delta })
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message || '無法更新購物車物資數量');
    }

    return data;
};

// 從大釜 (購物車) 移除物資
export const removeFromCart = async (cartId: string): Promise<any> => {
    const response = await fetch(`${API_BASE_URL}/api/cart/${cartId}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' }
    });
    
    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message || '無法從大釜移除物資');
    }
    return data;
}