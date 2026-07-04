import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { getMagicItems, updateMagicItem, createMagicItem, deleteMagicItem } from '../../services/magicService';
import type { MagicItem } from '../../types/magic';

export default function Inventory() {
    const auth = useContext(AuthContext);
    const navigate = useNavigate();
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [magicItems, setMagicItems] = useState<MagicItem[]>([]);

    const [editingItem, setEditingItem] = useState<MagicItem | null>(null);
    const [isChanging, setIsChanging] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    const fetchMagicItems = async () => {
        try {
            setIsLoading(true);
            const data = await getMagicItems();
            setMagicItems(data);
        } catch (err: any) {
            setError(err.message || '無法取得魔法商品資料');
        } finally {
            setIsLoading(false);
        }
    };

    const handleChangeItem = async (e: any, action: 'update' | 'create') => {
        e.preventDefault();
        if (!editingItem) return;

        try {
            setIsChanging(true);

            if (action === 'create') {
                await createMagicItem({
                    name: editingItem.name,
                    price: editingItem.price,
                    description: editingItem.description,
                    stock: editingItem.stock,
                    category: editingItem.category
                });
            } else if (action === 'update') {
                await updateMagicItem(editingItem.id, {
                    name: editingItem.name,
                    price: editingItem.price,
                    description: editingItem.description,
                    stock: editingItem.stock,
                    category: editingItem.category
                });
            }
            await fetchMagicItems();
            setEditingItem(null);
        } catch (err: any) {
            setError(err.message || '更新失敗');
        } finally {
            setIsChanging(false);
        }
    };

    const handleDeleteItem = async (id: string) => {
        try {
            setIsDeleting(true);
            await deleteMagicItem(id);
            await fetchMagicItems();
            setEditingItem(null);
        } catch (err: any) {
            setError(err.message || '刪除失敗');
        } finally {
            setIsDeleting(false);
        }
    };

    useEffect(() => {
        fetchMagicItems();
    }, []);

    if (isLoading) return <div className="h-screen bg-background-dark text-primary font-serif flex items-center justify-center animate-pulse">正在加載庫存資料...</div>;
    if (error) return <div className="h-screen bg-background-dark text-red-400 font-serif flex items-center justify-center">{error}</div>;

    return (
        <main className="w-full min-h-screen bg-background p-6 lg:p-10">

            {/* 標題 */}
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center border-b border-primary/20 pb-4 gap-4">
                <h1 className="text-2xl font-bold tracking-widest">物資庫存管理</h1>
                {/* 導覽列：小螢幕用 */}
                <div className="w-full flex justify-between lg:hidden">
                    <div className="flex gap-2">
                        <button onClick={() => navigate('/admin/dashboard')} className="text-[10px] border border-primary/20 px-2 py-1 rounded bg-secondary/10">訂單</button>
                        <button onClick={() => navigate('/admin/history')} className="text-[10px] border border-primary/20 px-2 py-1 rounded bg-secondary/10">歷史</button>
                        <button onClick={() => navigate('/menu')} className="text-[10px] border border-primary/20 px-2 py-1 rounded bg-secondary/10">學生端</button>
                    </div>
                    <div className="flex gap-2">
                        <button onClick={fetchMagicItems} className="text-[10px] border border-primary/20 px-2 py-1 rounded bg-secondary/10">刷新</button>
                        <button onClick={auth?.logout} className="text-[10px] border border-primary/20 px-2 py-1 rounded bg-secondary/10">登出</button>
                    </div>
                </div>
            </div>

            {/* 內容 */}
            <div className="w-full flex justify-end items-center mt-6 mb-4">
                <button
                    className="border border-secondary/30 px-3 py-2 rounded text-primary text-sm bg-secondary/10 hover:bg-primary/20 transition cursor-pointer"
                    onClick={() => setEditingItem({
                        id: '',
                        name: '',
                        price: 0,
                        description: '',
                        stock: 0,
                        category: 'ingredient' // 預設為材料
                    })}
                >
                    新增物資
                </button>
            </div>


            <div className="w-full min-h-screen mt-6">
                {isLoading ? (
                    <div className="min-h-128 flex justify-center items-center text-primary font-serif animate-pulse">
                        正在擷取商品庫存資料...
                    </div>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                        {magicItems.map((item) => (
                            <div
                                key={item.id}
                                className="bg-background-dark hover:bg-white/5 border border-secondary/30 rounded p-6 flex flex-col justify-between hover:border-secondary/50 transition duration cursor-pointer"
                                onClick={() => {
                                    setEditingItem(item);
                                }}
                            >
                                <div className="flex flex-col flex-1 justify-between">
                                    <div>
                                        <div className="flex justify-between items-center mb-4">
                                            <span className="text-xs font-mono tracking-widest bg-secondary/10 border border-secondary/30 px-2 py-0.5 text-primary/80 rounded-full">
                                                {item.category?.toUpperCase() || 'UNKNOWN'}
                                            </span>
                                            <span className="font-mono text-xs flex flex-row items-center gap-1 text-primary">
                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-4">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 0 0 2.25-2.25V6.75A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25v10.5A2.25 2.25 0 0 0 4.5 19.5Z" />
                                                </svg>
                                                {item.price} 阿卡幣
                                            </span>
                                        </div>
                                        <h3 className="font-serif text-xl font-bold text-white/90 line-clamp-1">
                                            {item.name}
                                        </h3>
                                        <p className="text-xs text-primary/70 font-serif mt-2 line-clamp-2">
                                            {item.description}
                                        </p>
                                    </div>
                                    <p className="text-xs text-primary/70 font-serif mt-2 flex flex-row items-center gap-1">
                                        庫存：<span className="font-mono text-sm text-primary">{item.stock}</span>
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* 編輯面板彈出視窗 */}
            {editingItem && (
                <div className="fixed inset-0 z-20 flex items-center justify-center backdrop-blur-sm">
                    {/* 背景遮罩 (點擊可關閉) */}
                    <div
                        className="absolute inset-0"
                        onClick={() => setEditingItem(null)}
                    />

                    <div className="relative max-w-md bg-background-dark border-l border-secondary/30 p-6 flex flex-col justify-between shadow-2xl rounded text-white">
                        <div className="flex justify-between items-center border-b border-primary/20 pb-3 mb-4">
                            <h2 className="text-lg font-bold font-serif tracking-wide">{editingItem.id ? '編輯魔法物資' : '新增魔法物資'}</h2>
                            <button
                                onClick={() => setEditingItem(null)}
                                className="text-primary/60 hover:text-primary transition text-sm cursor-pointer"
                            >
                                ✕ 關閉
                            </button>
                        </div>

                        <form onSubmit={(e) => handleChangeItem(e, editingItem.id ? 'update' : 'create')} className="flex flex-col gap-4">
                            <div>
                                <label className="block text-xs text-primary/70 mb-1 font-mono">名稱 (NAME)</label>
                                <input
                                    type="text"
                                    value={editingItem.name || ''}
                                    onChange={(e) => setEditingItem({ ...editingItem, name: e.target.value })}
                                    className="w-full bg-background border border-secondary/30 rounded px-3 py-2 text-sm focus:outline-none focus:border-primary/60 "
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-xs text-primary/70 mb-2 font-mono">分類 (CATEGORY)</label>
                                <div className="grid grid-cols-2 gap-2">
                                    <button
                                        type="button"
                                        onClick={() => setEditingItem({ ...editingItem, category: 'ingredient' })}
                                        className={`py-2 text-xs rounded border transition ${editingItem.category === 'ingredient'
                                            ? 'bg-primary/20 border-primary text-primary font-bold'
                                            : 'bg-background border-secondary/30 text-primary/60 hover:bg-white/5 cursor-pointer'
                                            }`}
                                    >
                                        INGREDIENT (材料)
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setEditingItem({ ...editingItem, category: 'spell' })}
                                        className={`py-2 text-xs rounded border transition ${editingItem.category === 'spell'
                                            ? 'bg-primary/20 border-primary text-primary font-bold'
                                            : 'bg-background border-secondary/30 text-primary/60 hover:bg-white/5 cursor-pointer'
                                            }`}
                                    >
                                        SPELL (咒語)
                                    </button>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs text-primary/70 mb-1 font-mono">價格 (PRICE)</label>
                                    <input
                                        type="number"
                                        value={editingItem.price ?? 0}
                                        onChange={(e) => setEditingItem({ ...editingItem, price: Number(e.target.value) })}
                                        className="w-full bg-background border border-secondary/30 rounded px-3 py-2 text-sm focus:outline-none focus:border-primary/60"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs text-primary/70 mb-1 font-mono">庫存 (STOCK)</label>
                                    <input
                                        type="number"
                                        value={editingItem.stock ?? 0}
                                        onChange={(e) => setEditingItem({ ...editingItem, stock: Number(e.target.value) })}
                                        className="w-full bg-background border border-secondary/30 rounded px-3 py-2 text-sm focus:outline-none focus:border-primary/60"
                                        required
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs text-primary/70 mb-1 font-mono">描述 (DESCRIPTION)</label>
                                <textarea
                                    value={editingItem.description || ''}
                                    onChange={(e) => setEditingItem({ ...editingItem, description: e.target.value })}
                                    className="w-full bg-background border border-secondary/30 rounded px-3 py-2 text-sm focus:outline-none focus:border-primary/60 h-20 resize-none"
                                />
                            </div>

                            <div className="flex justify-between items-center gap-2">
                                <button
                                    type="button"
                                    onClick={() => handleDeleteItem(editingItem.id)}
                                    className="px-4 py-2 border border-red-500/60 bg-red-500/10 rounded text-xs text-red-300 hover:bg-red-500/20 transition cursor-pointer"
                                >
                                    {isDeleting ? '刪除中...' : '刪除'}
                                </button>
                                <div className="flex justify-end items-center gap-2">
                                    <button
                                        type="button"
                                        onClick={() => setEditingItem(null)}
                                        className="px-4 py-2 border border-primary/20 rounded text-xs hover:bg-white/5 transition cursor-pointer"
                                    >
                                        取消
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={isChanging}
                                        className="px-4 py-2 bg-primary/20 border border-primary/50 text-primary rounded text-xs hover:bg-primary/30 transition cursor-pointer disabled:opacity-55"
                                    >
                                        {isChanging ? '儲存中...' : '儲存'}
                                    </button>
                                </div>

                            </div>
                        </form>
                    </div>
                </div>
            )}

        </main>
    );
}