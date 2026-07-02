# Magic Dispenser

一個物資販賣系統。本專案為前後端分離的全端架構，前端採用現代化 React 框架搭配 3D 視覺渲染，後端結合 Express 伺服器並對接 Neon Serverless PostgreSQL 雲端資料庫。

---

## 🌃 故事背景：【新亞特蘭提斯 — 霓虹交界處】

> *「在機械矩陣的霓虹交界處，Order（秩序）是一條死去的代碼，而 Inspiration（靈感）則藏在廢棄的碎片裡。」*

這是一個魔法與科技高度融合的崩壞未來。在繁華的霓虹都市底層，有一條專門販售違禁魔法物資的暗巷——**「第 9 號觀測站」**。

巷子盡頭那面粗糙的黑石牆上，安裝著一台由古老煉金術與駭客技術改裝而成的「阿卡那（Arcana）自動販賣機」。這台孤零零矗立在斑駁石牆前的舊型終端實體，沒有冷冰冰的觸控螢幕，而是透過 **「大釜購物車」** 的魔力共鳴來運作。

當拾荒巫師在前端介面將「法術插件」或「魔藥原料」投入大釜時，後端的 **Neon 雲端矩陣** 就會即時響應。一旦按下結帳，販賣機內部古老的齒輪就會開始瘋狂咬合，以微秒的速度扣除物理庫存，將物資打包進鎖定的歷史契約中。這台販賣機所販售的，從來就不是普通的商品，而是**在有限的廢棄物質中，提煉出能夠突破秩序、捕捉靈感的「暫時永恆」**。

---

## 👥 兩大命運陣營的交界

在這片被隱匿的結界中，只有兩類人擁有特許的加密金鑰能夠接入這個網路：

### 👤 拾荒巫師 (Scavenger Students) ── 故事主角【瓦倫丁 V@lentine】
他們是遊走在城市邊緣的邊緣人。在大釜中融化廢棄的晶片，在破損的微控制器中提煉古老的「液態高能量乙太」，來到這裡是為了尋找打破常規、點燃創意思維的禁忌原料。
* **命運軌跡：** 
  手握黑市發放的加密通行證簽到進場，在販賣機幽暗的螢幕前瀏覽被禁絕的魔藥與法術。當他們把物資拋入大釜、啟動引導時，必須在漫天魔力煙霧中屏息等待，直到霓虹代碼煉製完成，炸開獲得物資的特效。
* **生存法則：** 
  絕對不要試圖窺探看守者的辦公室，或妄想修改商品的代價。

### 👑 監管教授 (Overlord Professors) ── 守序者【克羅諾斯 Kronos】
人稱「黑醫」的執法官，黑市的幕後看守人與物資壟斷者。負責將高危險性的「過載奈米神經毒素」與「暗影潛行代碼插件」上架至販賣機中，一邊維持著黑市的運作，一邊暗中觀察著那些試圖翻轉矩陣的年輕巫師。
* **命運軌跡：** 
  他擁有穿越禁地防線的特權，能在幽暗的監控後台冷酷地俯瞰全站的歷史總營收，計算著哪個學院最沉迷於課金，並在控制面板上無情地「補貨」、「上架新咒語」或「抹除違禁品」。
* **防禦機制：** 
  他的周身圍繞著核心防禦屏障，任何偽造他身分的低階巫師只要觸碰核心庫存，都會瞬間被矩陣吞噬。
  
---

## 📁 專案架構

```text
.
├── node_modules/
├── public/
├── server/                 # 後端（伺服器端）程式碼目錄
│   ├── db/                 # 資料庫相關腳本目錄
│   │   └── init.sql        # 資料庫結構
│   ├── routes/             # 後端 API 路由目錄
│   │   ├── authRoutes.ts   # 身分驗證與權限路由
│   │   ├── cartRoutes.ts   # 大釜 (購物車) 物資路由
│   │   └── magicRoutes.ts  # 魔法物資管理路由
│   │   └── orderRoutes.ts  # 巫師訂單管理路由
│   ├── .env                # 後端環境變數設定檔
│   ├── .env.example        # 後端環境變數範本檔
│   ├── db.ts               # 資料庫連線與設定（基於 @neondatabase/serverless 的連線池）
│   ├── package.json        # 後端專案專屬的套件配置與指令指令碼
│   └── server.ts           # 後端應用程式的啟動入口檔案（Express 主程式）
├── src/                    # 前端（客戶端）原始碼目錄
│   ├── assets/             # 全域靜態樣式與圖片
│   ├── components/         # 共享組件
│   │   ├── ProtectedRoute.tsx # 路由守衛
│   │   └── Wall.tsx        # 3D 石牆組件
│   ├── context/            # 全域狀態管理目錄
│   │   └── AuthContext.tsx # 管理全站登入狀態與使用者資訊
│   ├── hooks/              # 自定義 React Hooks 目錄
│   ├── pages/              # 頁面組件目錄
│   │   ├── admin/          # 監管教授專屬控制台
│   │   │   ├── Dashboard.tsx
│   │   │   └── Inventory.tsx
│   │   ├── Brewing.tsx     # 大釜煉製 (購物車) 頁面
│   │   ├── Home.tsx        # 首頁
│   │   ├── Login.tsx       # 登入頁面
│   │   └── Menu.tsx        # 物資販賣機主介面
│   ├── services/           # 前端 API 請求服務目錄
│   │   ├── authService.ts  # 身分驗證 API 請求
│   │   ├── cartService.ts  # 大釜 (購物車) 物資 API 請求
│   │   └── magicService.ts # 物資管理 API 請求
│   │   └── orderService.ts # 巫師訂單 API 請求
│   ├── types/              # TypeScript 型別定義目錄
│   │   ├── auth.ts
│   │   └── magic.ts
│   ├── App.tsx             # 前端根組件 (路由調度中心)
│   ├── index.css           # Tailwind CSS v4 設定檔
│   └── main.tsx            # React 渲染入口檔案
├── .env                    # 前端環境變數設定檔
├── .env.example            # 前端環境變數範本檔
├── .gitignore              # 排除安全敏感檔案進入版本控制
├── .oxlintrc.json
├── index.html              # 應用程式單頁入口
├── package-lock.json
├── package.json            # 全端環境配置與一鍵雙開腳本
├── README.md               # 說明文件
├── tsconfig.app.json
├── tsconfig.json
├── tsconfig.node.json
└── vite.config.ts

```

---

## 🛠️ 技術棧

### 前端 (Frontend)

* **核心框架**: React 19、TypeScript
* **建構工具**: Vite 8
* **視覺渲染**: Tailwind CSS v4、React Three Fiber
* **路由與防禦**: React Router Dom

### 後端 (Backend)

* **執行環境**: Node.js & Express
* **資料庫**: Neon Serverless PostgreSQL 雲端資料庫
* **安全防禦**:
* `bcryptjs` (密碼 10 代鹽值雜湊加密)
* `jsonwebtoken` (JWT 身分通行證簽發與校驗)
* `cors` (跨域安全防護)

---

## ⚙️ 部署與環境配置

### 1. 前端配置：`./.env`

參考 `./.env.example`。

### 2. 後端配置：`./server/.env`

參考 `./server/.env.example`。

#### 🔑 如何產生後端安全密鑰 (JWT_SECRET)

請在終端機執行以下 Node.js 指令，來隨機生成一組高強度的 256 位元十六進位字串：

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### 3. 資料庫初始化 (Neon PostgreSQL)

將 `server/db/init.sql` 內部的 SQL 建表語句與種子資料，複製並在 **Neon.tech 的 SQL Editor** 中運行。這會自動建立資料表。

#### 🔐 預設測試帳戶密碼生成說明

因為後端採用 `bcryptjs` 安全防線，資料庫中不可存入明文密碼。若需在 `init.sql` 內手動新增或修改測試巫師的預設密碼，請先在終端機執行以下 Node.js 指令得到雜湊（Hash）碼，再複製貼入 SQL 語句中：

```bash
node -e "const b = require('bcryptjs'); b.hash('你的明文密碼', 10).then(h => console.log(h))"
```

### 4. 啟動

專案已配置 `concurrently` 並行執行核心。不需要開啟兩個終端機視窗，只需要一個指令即可開前後端：

```bash
npm run dev
```

---

## 📡 API 接口說明

### 身分模組 (`/api/auth`)

* `GET /api/auth/me` - 驗證前端傳入之 JWT 通行證，並撈取目前登入的使用者資料
* `GET /api/auth` - 撈取所有黑市使用者
* `POST /api/auth/register` - 註冊新巫師身分 (自動觸發 `bcrypt` 10代鹽值雜湊加密)
* `POST /api/auth/login` - 比對加密金鑰，成功後簽發 24 小時時效之 `JWT 通行證`

### 商品模組 (`/api/magic`)

* `GET /api/magic` - 撈取現存所有物資商品清單
* `GET /api/magic/:id` - 取得指定商品的詳細資訊
* `POST /api/magic` - 新增全新的魔法物資品項進資料庫中
* `PUT /api/magic/:id` - 更新指定商品的詳細資訊（包含名稱、價格、描述、庫存與分類）
* `DELETE /api/magic/:id` - 永久刪除指定的商品品項

### 購物車模組 (`/api/cart`)

* `GET /api/cart/:userId` - 撈取指定巫師大釜 (購物車) 內的所有現存物資清單
* `POST /api/cart` - 將指定的魔法物資品項投入大釜中 (新增至購物車)
* `PUT /api/cart/adjust` - 調整大釜內指定物資的數量
* `DELETE /api/cart/:cartId` - 將指定的魔法物資徹底從大釜中撈出並移除

### 訂單模組 (`/api/order`)

* `GET /api/order` - 撈取現存的所有訂單清單
* `GET /api/order/user/:userId` - 撈取指定巫師的所有歷史訂單紀錄
* `GET /api/order/detail/:orderId` - 取得特定訂單內的所有物資詳細資訊
* `POST /api/order` - 將指定巫師的大釜（購物車）物資打包結帳，封存為一筆新訂單，並自動清空該巫師的購物車