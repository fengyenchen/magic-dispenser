import { useEffect, useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { getMagicItems } from '../services/magicService';
import { addToCart } from '../services/cartService';
import type { MagicItem } from '../types/magic';

export default function Menu() {
    const auth = useContext(AuthContext);
    const user = auth?.user;

    const [items, setItems] = useState<MagicItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const [isSubmitting, setIsSubmitting] = useState<string | null>(null);

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

    const handleAddClick = async (itemId: string, itemName: string) => {
        if (!user?.id) {
            alert('無法辨識巫師身分，請重新登入');
            return;
        }
        try {
            setIsSubmitting(itemId);
            await addToCart(user.id, itemId);
            alert(`【${itemName}】已成功投入大釜內部！`);
            await fetchItems();
        } catch (err: any) {
            alert(err.message || '投放失敗');
        } finally {
            setIsSubmitting(null);
        }
    };

    if (error) return <div className="text-red-400 font-serif text-center py-20">{error}</div>;

    return (
        <div className="bg-background-dark text-primary px-6 py-12">

            {/* 登出按鈕 */}
            <div className="max-w-6xl mx-auto flex justify-end items-center mb-6">
                <button className="cursor-pointer flex flex-row items-center justify-center gap-2 text-primary font-serif text-sm hover:text-primary/70 transition" onClick={() => { auth?.logout() }}>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-4">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15m3 0 3-3m0 0-3-3m3 3H9" />
                    </svg>
                </button>
            </div>

            {/* 頂部標題 */}
            <div className="max-w-6xl mx-auto flex flex-col md:flex-row gap-4 justify-between items-center border-b border-primary/30 pb-6 mb-6">
                <div className="w-full md:w-auto">
                    <h1 className="font-serif text-2xl md:text-3xl font-bold tracking-widest text-primary">歡迎回來，{user?.username || '神祕巫師'}</h1>
                    <p className="text-xs text-primary/60 font-serif mt-4 italic">身分權限 - {user?.role || '未知身分'}</p>
                </div>
                <div className="w-full md:w-auto cursor-pointer flex flex-row items-center justify-center gap-2 text-primary border border-primary/30 px-4 py-2 rounded bg-secondary/10 hover:bg-primary/20 transition font-serif text-sm">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-4">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25 5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z" />
                    </svg>
                    檢視大釜庫存
                </div>

            </div>

            {/* 販賣機商品區 */}
            {isLoading ? (
                <div className="text-primary font-serif text-center py-20 animate-pulse">
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
        </div>
    );
}