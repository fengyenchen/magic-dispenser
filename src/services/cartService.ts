const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

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

export const addOneFromCart = async (userId: string, magicItemId: string): Promise<any> => {
    const response = await fetch(`${API_BASE_URL}/api/cart/add`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: userId, magic_item_id: magicItemId })
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message || '無法更新購物車物資數量');
    }

    return data;
};

export const subtractOneFromCart = async (userId: string, magicItemId: string): Promise<any> => {
    const response = await fetch(`${API_BASE_URL}/api/cart/subtract`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: userId, magic_item_id: magicItemId })
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message || '無法更新購物車物資數量');
    }

    return data;
};
