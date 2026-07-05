import { useEffect, useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { getMagicItems } from '../services/magicService';
import { addToCart, getCartItems, adjustCartQuantity, removeFromCart } from '../services/cartService';
import type { MagicItem } from '../types/magic';
import { useNavigate } from 'react-router-dom';
import { createOrder } from '../services/orderService';
import LogoutDialog from '../components/LogoutDialog';

export default function Menu() {
    const navigate = useNavigate();

    const auth = useContext(AuthContext);
    const user = auth?.user;

    const [items, setItems] = useState<MagicItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const [isSubmitting, setIsSubmitting] = useState<string | null>(null);

    const [isCartOpen, setIsCartOpen] = useState(false);
    const [cartItems, setCartItems] = useState<any[]>([]);
    const [isCartLoading, setIsCartLoading] = useState(false);

    const fetchItems = async () => {
        try {
            setIsLoading(true);
            const data = await getMagicItems();
            setItems(data);
        } catch (err: any) {
            setError(err.message || '無法取得販賣機物資庫存');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchItems();
    }, []);

    const handleOpenCart = async () => {
        if (!user?.id) return;
        setIsCartOpen(true);
        try {
            setIsCartLoading(true);
            const data = await getCartItems(user.id);
            setCartItems(data);
        } catch (err: any) {
            alert(err.message || '無法共鳴大釜庫存');
        } finally {
            setIsCartLoading(false);
        }
    };

    const handleQuantityChange = async (itemId: string, currentQuantity: number, delta: number) => {
        if (!user?.id) {
            alert('無法辨識巫師身分，請重新登入');
            return;
        }
        try {
            if (currentQuantity + delta <= 0) {
                await removeFromCart(itemId);
            } else {
                await adjustCartQuantity(itemId, delta);
            }

            const updatedCart = await getCartItems(user.id);
            setCartItems(updatedCart);
            await fetchItems();
        } catch (err: any) {
            alert(err.message || '更新物資失敗');
        } finally {
            setIsSubmitting(null);
        }
    };

    const handleRemoveItem = async (itemId: string) => {
        if (!user?.id) {
            alert('無法辨識巫師身分，請重新登入');
            return;
        }
        try {
            await removeFromCart(itemId);
            const updatedCart = await getCartItems(user.id);
            setCartItems(updatedCart);
            await fetchItems();
        } catch (err: any) {
            alert(err.message || '移除物資失敗');
        }
    };

    const handleAddClick = async (itemId: string, itemName: string) => {
        if (!user?.id) {
            alert('無法辨識巫師身分，請重新登入');
            return;
        }
        try {
            setIsSubmitting(itemId);
            await addToCart(user.id, itemId);

            if (isCartOpen) {
                const updatedCart = await getCartItems(user.id);
                setCartItems(updatedCart);
            }

            alert(`【${itemName}】已成功投入大釜內部！`);

            await fetchItems();
        } catch (err: any) {
            alert(err.message || '投放失敗');
        } finally {
            setIsSubmitting(null);
        }
    };

    const totalPrice = cartItems.reduce((sum, item) => sum + ((item?.price || 0) * (item?.quantity || 0)), 0);

    const handleCreateOrder = async () => {
        if (!user?.id) {
            alert('無法辨識巫師身分，請重新登入');
            return;
        }
        try {
            const order = await createOrder(user.id, totalPrice);
            setIsCartOpen(false);
            navigate(`/brewing/${order.id}`);
        } catch (err: any) {
            alert(err.message || '建立訂單失敗');
        }
    };

    if (error) return <div className="text-red-400 font-serif text-center py-20">{error}</div>;

    return (
        <div className="relative bg-background-dark text-primary px-6 py-8 md:py-12">

            <div className={`max-w-6xl mx-auto flex ${user?.role === 'professor' ? 'justify-between' : 'justify-end'} items-center mb-6`}>
                {/* 回 dashboard 按鈕 */}
                {user?.role === 'professor' && (
                    <div className="relative group">
                        <button
                            className="cursor-pointer flex flex-row items-center justify-center gap-2 text-primary font-serif text-sm hover:text-primary/70 transition"
                            onClick={() => { navigate('/dashboard') }}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-4">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 15.75 3 12m0 0 3.75-3.75M3 12h18" />
                            </svg>
                        </button>

                        <div className="absolute left-full top-1/2 -translate-y-1/2 ml-3 hidden group-hover:flex items-center z-20">
                            <div className="w-0 h-0 border-y-4 border-y-transparent border-r-4 border-r-primary/30" />
                            <div className="bg-background border border-primary/30 text-primary text-[11px] font-serif px-2 py-1 rounded whitespace-nowrap tracking-wider">
                                回到管理室
                            </div>
                        </div>
                    </div>
                )}

                {/* 登出按鈕 */}
                    <LogoutDialog trigger={
                        <div className="relative group">
                            <button className="cursor-pointer flex flex-row items-center justify-center gap-2 text-primary font-serif text-sm hover:text-primary/70 transition">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-4">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15m3 0 3-3m0 0-3-3m3 3H9" />
                                </svg>
                            </button>

                            <div className="absolute right-full top-1/2 -translate-y-1/2 mr-3 hidden group-hover:flex items-center z-20">
                                <div className="bg-background border border-primary/30 text-primary text-[11px] font-serif px-2 py-1 rounded whitespace-nowrap tracking-wider">
                                    登出
                                </div>
                                <div className="w-0 h-0 border-y-4 border-y-transparent border-l-4 border-l-primary/30" />
                            </div>
                        </div>
                    } />

            </div>

            {/* 頂部標題 */}
            <div className="max-w-6xl mx-auto flex flex-col md:flex-row gap-4 justify-between items-center border-b border-primary/30 pb-6 mb-6">
                <div className="w-full md:w-auto">
                    <h1 className="font-serif text-2xl md:text-3xl font-bold tracking-widest text-primary">歡迎回來，{user?.username || '神祕巫師'}</h1>
                    <p className="text-xs text-primary/60 font-serif mt-4 italic">身分權限 - {user?.role || '未知身分'}</p>
                </div>
                <button
                    className="w-full md:w-auto cursor-pointer flex flex-row items-center justify-center gap-2 text-primary border border-primary/30 px-4 py-2 rounded bg-secondary/10 hover:bg-primary/20 transition font-serif text-sm"
                    onClick={handleOpenCart}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-4">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25 5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z" />
                    </svg>
                    檢視大釜物資
                </button>

            </div>

            {/* 販賣機商品區 */}
            {isLoading ? (
                <div className="w-full min-h-100 flex justify-center items-center text-primary font-serif animate-pulse">
                    正在共鳴黑市販賣機物資...
                </div>
            ) : (
                <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
                    {items.map((item) => (
                        <div
                            key={item.id}
                            className="hover:bg-white/2 border border-secondary/30 rounded p-6 flex flex-col justify-between hover:border-secondary/50 transition"
                        >
                            <div>
                                <div className="flex justify-between items-center mb-4">
                                    <span className="text-xs font-mono tracking-widest bg-secondary/10 border border-secondary/30 px-2 py-0.5 text-primary/80 rounded-full">
                                        {item.category.toUpperCase()}
                                    </span>
                                    <span className="font-mono text-xs flex flex-row justify-between gap-2 text-primary">
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-4">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 0 0 2.25-2.25V6.75A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25v10.5A2.25 2.25 0 0 0 4.5 19.5Z" />
                                        </svg>
                                        {item.price} 阿卡幣
                                    </span>
                                </div>
                                <h3 className="font-serif text-xl font-bold text-white/90 line-clamp-1">
                                    {item.name}
                                </h3>
                                <p className="text-xs text-primary/70 font-serif mt-2 line-clamp-1">
                                    {item.description}
                                </p>
                            </div>

                            <div className="mt-6 pt-4 border-t border-secondary/10 flex justify-between items-center">
                                <span className="text-xs font-mono text-white/90">
                                    庫存: {item.stock} 單位
                                </span>
                                <button
                                    disabled={item.stock <= 0 || isSubmitting === item.id}
                                    onClick={() => handleAddClick(item.id, item.name)}
                                    className="font-serif text-xs px-4 py-2 rounded-md bg-secondary/10 text-primary border hover:bg-primary/20 transition disabled:opacity-20 disabled:cursor-not-allowed cursor-pointer"
                                >
                                    {isSubmitting === item.id ? '正在投放...' : '投入大釜'}
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {isCartOpen && (
                <div className="fixed inset-0 z-20 flex justify-end">
                    {/* 背景遮罩 (點擊可關閉大釜) */}
                    <div
                        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition"
                        onClick={() => setIsCartOpen(false)}
                    />

                    <div className="relative w-full max-w-md h-full bg-background-dark border-l border-secondary/30 p-6 flex flex-col justify-between shadow-2xl">

                        {/* 標題 */}
                        <div className="flex justify-between items-center border-b border-secondary/20 pb-4 mb-6">
                            <div className="flex flex-col gap-2.5">
                                <h2 className="font-serif text-xl font-bold text-primary tracking-wider">大釜調配清單</h2>
                                <p className="text-xs font-mono text-primary/40">{user?.username}</p>
                            </div>
                            <button
                                onClick={() => setIsCartOpen(false)}
                                className="text-primary/60 hover:text-primary cursor-pointer font-serif text-sm transition"
                            >
                                ✕ 關閉
                            </button>
                        </div>

                        {/* 項目列表 */}
                        {isCartLoading ? (
                            <div className="text-center font-serif text-xs text-primary/60 py-10 animate-pulse">正在讀取大釜物資...</div>
                        ) : cartItems.length === 0 ? (
                            <div className="text-center font-serif text-xs text-primary/40 py-20 italic">大釜目前空無一物，尚未投入原料</div>
                        ) : (
                            <div className="flex flex-col gap-4 py-4 overflow-y-auto pr-2 h-full">
                                {cartItems.map((cItem) => (
                                    <div key={cItem.cart_item_id} className="border border-secondary/20 rounded p-4 flex justify-between items-center">
                                        <div className="flex flex-row items-center gap-4">
                                            <button
                                                className="text-primary/60 hover:text-primary cursor-pointer font-serif text-sm transition"
                                                onClick={() => handleRemoveItem(cItem.cart_item_id)}
                                            >
                                                ✕
                                            </button>
                                            <div>
                                                <h4 className="font-serif text-sm font-bold text-white/90">{cItem?.name || '未知原料'}</h4>
                                                <p className="text-[10px] font-mono text-secondary mt-1">
                                                    {cItem?.category ? cItem.category.toUpperCase() : 'UNKNOWN'} · {cItem?.price || 0} 阿卡幣
                                                </p>
                                            </div>

                                        </div>
                                        <div className="flex justify-between items-center gap-1 font-mono text-sm text-primary bg-background-dark/80 px-2 py-1 rounded border border-secondary/10">
                                            <button
                                                className="text-white hover:text-primary/80 py-1 px-2 cursor-pointer transition"
                                                onClick={() => handleQuantityChange(cItem.cart_item_id, cItem?.quantity, -1)}
                                            >
                                                -
                                            </button>
                                            {cItem?.quantity || 0}
                                            <button
                                                className="text-white hover:text-primary/80 py-1 px-2 cursor-pointer transition"
                                                onClick={() => handleQuantityChange(cItem.cart_item_id, cItem?.quantity, 1)}
                                            >
                                                +
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* 總計 */}
                        <div className="border-t border-secondary/20 pt-4 mt-6">
                            <div className="flex justify-between items-center mb-6 font-serif">
                                <span className="text-sm text-primary/70">預計總消耗:</span>
                                <span className="text-lg font-bold text-primary tracking-wide">{totalPrice} 阿卡幣</span>
                            </div>

                            <button
                                disabled={cartItems.length === 0}
                                className="w-full py-3 bg-secondary/10 hover:bg-primary/20 border border-primary/40 rounded text-primary font-serif tracking-widest text-sm font-bold transition disabled:opacity-10 disabled:cursor-not-allowed cursor-pointer"
                                onClick={() => handleCreateOrder()}
                            >
                                開始釀造
                            </button>
                        </div>

                    </div>
                </div>
            )}

        </div>
    );
}