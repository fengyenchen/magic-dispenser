-- 角色表
CREATE TABLE IF NOT EXISTS roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    account VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    username VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL CHECK (role IN ('student', 'professor'))
);

-- 魔法商品表
CREATE TABLE IF NOT EXISTS magic_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    price INT NOT NULL,
    stock INT NOT NULL,
    category VARCHAR(50) NOT NULL CHECK (category IN ('ingredient', 'spell'))
);

-- 購物車項目表
CREATE TABLE IF NOT EXISTS cart_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES roles(id) ON DELETE CASCADE,
    magic_item_id UUID NOT NULL REFERENCES magic_items(id) ON DELETE CASCADE,
    quantity INT NOT NULL CHECK (quantity > 0) -- 限制數量必須大於 0
);

-- 訂單表
CREATE TABLE IF NOT EXISTS orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES roles(id),
    cart_items JSONB NOT NULL,
    total_price INT NOT NULL,
    status VARCHAR(50) NOT NULL CHECK (status IN ('brewing', 'completed', 'failed')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);