export interface Role {
  id: string;
  account: string;
  password: string;
  username: string;
  role: 'student' | 'professor';
}

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
  userId: string;
  magicItemId: string;
  quantity: number;
}

export interface Order { // 訂單屬性
    id: string;
    userId: string;
    cartItems: CartItem[];
    totalPrice: number;
    status: 'brewing' | 'completed' | 'failed';
    createdAt: string;
}