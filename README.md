# Magic Dispenser

一個物資販賣系統。本專案為前後端分離的全端架構，前端採用現代化 React 框架搭配 3D 視覺渲染，後端結合 Express 伺服器並對接 Neon Serverless PostgreSQL 雲端資料庫。

---

## 核心故事世界觀

> *「在機械矩陣的霓虹交界處， order（秩序）是一條死去的代碼，而 inspiration（靈感）則藏在廢棄的碎片裡。」*

### 🏚️ 1. 廢墟中的黑市節點：阿卡那

在近未來的賽博格世界中，一切都被高度精密的演算法與冰冷的鋼鐵矩陣所監管。而在這座龐大都市的邊緣，存在著一處被歷史遺忘的夾縫——**「阿卡那（Arcana）廢墟」**。這裡曾是一座古老的魔法神殿，如今已被電子線路與廢棄機械右眼所寄生。

這裡的視覺是一片深邃的死寂，四周矗立著由你親手雕琢、歷經風霜與時間啃蝕的**斑駁老石牆**。石牆的縫隙中，攀爬著鏽蝕的銅線與泛著螢光、充滿危險氣息的**霓虹綠微光**。這裡，是秩序與混亂、科技與巫術唯一共存的黑市地下節點。

### 🧙‍♂️ 2. 兩大陣營的魔力共鳴

在這片被隱匿的結界中，只有兩類人擁有特許的加密金鑰能夠接入這個網路：

* **拾荒巫師 (Scavenger Students) —— 故事主角【瓦倫丁 V@lentine】**
他們是遊走在城市邊緣的邊緣人。他們在大釜中融化廢棄的晶片，在破損的微控制器中提煉古老的「液態高能量乙太」。他們來到這裡，是為了尋找打破常規、點燃創意思維的禁忌原料。
* **監管教授 (Overlord Professors) —— 守序者【克羅諾斯 Kronos】**
他們是黑市的幕後看守人與物資壟斷者。他們負責將高危險性的「過載奈米神經毒素」與「暗影潛行代碼插件」上架至販賣機中，一邊維持著黑市的運作，一邊暗中觀察著那些試圖翻轉矩陣的年輕巫師。

### 🧪 3. 禁忌的大釜販賣機：物質與靈感的交換

這台孤零零矗立在斑駁石牆前的舊型自動販賣機，是整個暗網的終端實體。它沒有冷冰冰的觸控螢幕，而是透過「大釜購物車」的魔力共鳴來運作。

當拾荒巫師在前端介面將「法術插件」或「魔藥原料」投入大釜時，後端的 **Neon 雲端矩陣** 就會即時響應。一旦按下結帳，販賣機內部古老的齒輪就會開始瘋狂咬合，以微秒的速度扣除物理庫存，將物資打包進鎖定的歷史契約中。

這台販賣機所販售的，從來就不是普通的商品，而是**在有限的廢棄物質中，提煉出能夠突破秩序、捕捉靈感的「暫時永恆」**。

---

## 📁 專案架構

```text
.
├── node_modules/
├── public/
├── server/                # 後端（伺服器端）程式碼目錄
│   ├── db/                # 資料庫相關腳本目錄
│   ├── routes/            # 後端 API 路由目錄
│   ├── .env               # 後端環境變數設定檔
│   ├── .env.example       # 後端環境變數範本檔
│   ├── db.ts              # 資料庫連線與設定（基於 @neondatabase/serverless 的連線池）
│   ├── package.json       # 後端專案專屬的套件配置與指令指令碼
│   └── server.ts          # 後端應用程式的啟動入口檔案（Express 主程式）
├── src/                   # 前端（客戶端）原始碼目錄
│   ├── assets/            # 全域靜態樣式與圖片
│   ├── components/        # 共享組件
│   ├── context/           # 全域狀態管理目錄
│   │   └── AuthContext.tsx # 管理全站登入狀態與使用者資訊
│   ├── hooks/             # 自定義 React Hooks 目錄
│   ├── pages/             # 頁面組件目錄
│   ├── services/          # 前端 API 請求服務目錄
│   ├── types/             # TypeScript 型別定義目錄
│   ├── App.tsx            # 前端根組件 (路由調度中心)
│   ├── index.css          # Tailwind CSS v4 設定檔
│   └── main.tsx           # React 渲染入口檔案
├── .env                   # 前端環境變數設定檔
├── .env.example           # 前端環境變數範本檔
├── .gitignore             # 排除安全敏感檔案進入版本控制
├── .oxlintrc.json         # Oxlint 極速程式碼檢查設定
├── index.html             # 應用程式單頁入口
├── package-lock.json
├── package.json           # 全端環境配置與一鍵雙開腳本
├── README.md              # 說明文件
├── tsconfig.app.json
├── tsconfig.json
├── tsconfig.node.json
└── vite.config.ts         # Vite 8 建構核心設定

```

---

## 🛠️ 技術棧與底層魔法

### 前端 (Frontend)

* **核心框架**: React 19 & TypeScript
* **建構工具**: Vite 8 (搭配 `vite:oxc` 進行極速編譯)
* **視覺渲染**: Tailwind CSS v4 (幽冥暗黑/霓虹色系)、React Three Fiber & Drei (3D 石牆場景)
* **路由守衛**: React Router Dom v7

### 後端 (Backend)

* **執行環境**: Node.js & Express (使用 `tsx` 進行模組監控與自動熱重載)
* **資料庫**: Neon Serverless PostgreSQL
* **安全防禦**: `bcryptjs` (密碼雜湊加密)、`jsonwebtoken` (JWT 身分通行證簽發)、`cors` (跨域安全防護)

---

## ⚙️ 部署與環境配置

### 1. 前端配置：`./.env`

參考 `./.env.example` 並配置後端 API 基礎路徑。

```env
VITE_API_URL=http://localhost:3000
```

### 2. 後端配置：`./server/.env`

參考 `./server/.env.example` 並配置資料庫連線字串與安全密鑰。

```env
PORT=3000
DATABASE_URL=postgres://<user>:<password>@<neon-pooler-url>.neon.tech/arcana_db?sslmode=require
JWT_SECRET=透過下方指令生成的長金鑰字串
```

#### 🔑 如何產生後端安全密鑰 (JWT_SECRET)

請在終端機執行以下 Node.js 指令，來隨機生成一組高強度的 256 位元十六進位字串：

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### 3. 資料庫初始化 (Neon PostgreSQL)
將 `server/db/init.sql` 內部的 SQL 建表語句與種子資料，複製並在 **Neon.tech 的 SQL Editor** 中運行。這會自動建立並填充資料表。

#### 🔐 預設測試帳戶密碼生成說明
因為後端採用 `bcryptjs` 安全防線，資料庫中絕對不可存入明文密碼。若需在 `init.sql` 內手動新增或修改測試巫師的預設密碼，請先在終端機執行以下 Node.js 指令得到雜湊（Hash）碼，再複製貼入 SQL 語句中：

```bash
node -e "const b = require('bcryptjs'); b.hash('你的明文密碼', 10).then(h => console.log(h))"
```

### 4. 啟動

專案已配置 `concurrently` 並行執行核心。你不需要開啟兩個終端機視窗，只需要一個指令即可雙開前後端：

```bash
npm run dev
```

* **前端執行節點**: 藍色標籤 `[VITE]` $\rightarrow$ `http://localhost:5173`
* **後端執行節點**: 綠色標籤 `[EXPR]` $\rightarrow$ `http://localhost:3000`

---

## 📡 API

### 身分模組 (`/api/auth`)

* `GET /api/auth` - 撈取所有黑市使用者 (安全過濾密碼明文)
* `POST /api/auth/register` - 註冊新巫師身分 (自動觸發 `bcrypt` 10代鹽值雜湊加密)
* `POST /api/auth/login` - 比對加密金鑰，成功後簽發 24 小時時效之 `JWT 通行證`

### 商品模組 (`/api/magic`)

* `GET /api/magic` - 撈取現存所有商品清單
* `POST /api/magic` - 新增物資品項 (教授管理員權限)
* `PUT /api/magic/:id/stock` - 變更指定商品的管制庫存數量
* `DELETE /api/magic/:id` - 永久移除指定商品品項