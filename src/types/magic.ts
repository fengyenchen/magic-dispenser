export interface MagicItem { // 商品屬性
  id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  category: 'ingredient' | 'spell'; // 魔藥原料 or 法術
}

export interface CartItem { // 購物車某項商品屬性
  id: string;
  user_id: string;
  magic_item_id: string;
  quantity: number;
}

export interface Order { // 訂單屬性
    id: string;
    user_id: string;
    cart_items: CartItem[];
    total_price: number;
    status: 'brewing' | 'completed' | 'failed';
    created_at: string;
}