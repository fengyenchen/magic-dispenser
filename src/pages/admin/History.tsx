import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { getAllOrders } from '../../services/orderService';
import { getMagicItem } from '../../services/magicService';

export default function History() {
    const auth = useContext(AuthContext);
    const navigate = useNavigate();
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    const [todayRevenue, setTodayRevenue] = useState<number>(0);
    const [todayOrderCount, setTodayOrderCount] = useState<number>(0);
    const [todaySalesList, setTodaySalesList] = useState<Array<{
        id: string;
        name: string;
        quantity: number;
        price: number;
        category: string;
    }>>([]);

    const fetchOrders = async () => {
        try {
            setIsLoading(true);
            const data = await getAllOrders();

            const today = new Date().toDateString();
            const todaysOrders = data.filter((order: any) => {
                const orderDate = new Date(order.created_at);
                return orderDate.toDateString() === today;
            });

            const revenue = todaysOrders.reduce((total: number, order: any) => total + (order.total_price || 0), 0);
            setTodayRevenue(revenue);

            const todayOrderCount = todaysOrders.length;
            setTodayOrderCount(todayOrderCount);

            // item_id => quantity
            const todayItems: { [key: string]: number } = {};
            todaysOrders.forEach((order: any) => {
                let items = order.cart_items;
                items.forEach((item: any) => {
                    const qty = Number(item.quantity) || 0;
                    todayItems[item.magic_item_id] = (todayItems[item.magic_item_id] || 0) + qty;
                });
            });

            const itemIds = Object.keys(todayItems);
            try {
                const todayFullList = await Promise.all(
                    itemIds.map(async (id) => {
                        try {
                            const itemDetail = await getMagicItem(id);
                            return {
                                id: id,
                                name: itemDetail.name,
                                quantity: todayItems[id],
                                price: itemDetail.price,
                                category: itemDetail.category
                            };
                        } catch {
                            return {
                                id: id,
                                name: `未知物品 (${id.substring(0, 5)})`,
                                quantity: todayItems[id],
                                price: 0,
                                category: '未知'
                            };
                        }
                    })
                );

                todayFullList.sort((a, b) => (b.quantity - a.quantity) || (b.price - a.price) || a.category.localeCompare(b.category) || a.id.localeCompare(b.id));
                setTodaySalesList(todayFullList);
            } catch (listErr) {
                setTodaySalesList([]);
            }
        } catch (err: any) {
            setError(err.message || '無法取得歷史資料');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchOrders();
    }, []);

    if (isLoading) return <div className="h-screen bg-background-dark text-primary font-serif flex items-center justify-center animate-pulse">正在加載歷史資料...</div>;
    if (error) return <div className="h-screen bg-background-dark text-red-400 font-serif flex items-center justify-center">{error}</div>;

    return (
        <main className="w-full min-h-screen bg-background p-6 lg:p-10">

            {/* 標題 */}
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center border-b border-primary/20 pb-4 gap-4">
                <h1 className="text-2xl font-bold tracking-widest">歷史資料分析</h1>
                {/* 導覽列：小螢幕用 */}
                <div className="w-full flex justify-between lg:hidden">
                    <div className="flex gap-2">
                        <button onClick={() => navigate('/admin/dashboard')} className="text-[10px] border border-primary/20 px-2 py-1 rounded bg-secondary/10">訂單</button>
                        <button onClick={() => navigate('/admin/inventory')} className="text-[10px] border border-primary/20 px-2 py-1 rounded bg-secondary/10">庫存</button>
                        <button onClick={() => navigate('/menu')} className="text-[10px] border border-primary/20 px-2 py-1 rounded bg-secondary/10">學生端</button>
                    </div>
                    <div className="flex gap-2">
                        <button onClick={fetchOrders} className="text-[10px] border border-primary/20 px-2 py-1 rounded bg-secondary/10">刷新</button>
                        <button onClick={auth?.logout} className="text-[10px] border border-primary/20 px-2 py-1 rounded bg-secondary/10">登出</button>
                    </div>
                </div>
            </div>

            {/* 內容 */}
            <div className="w-full flex mt-6 mb-4">

                {/* 今日 */}
                <div className="w-full mb-6">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-bold text-primary/80">今日</h2>
                        <span className="text-xs font-mono tracking-widest bg-secondary/10 border border-secondary/30 px-2 py-0.5 text-primary/80 rounded-full">{new Date().toLocaleDateString()}</span>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 lg:grid-rows-2 gap-4">
                        {/* 總營收 */}
                        <div className="row-span-1 col-span-1 font-serif bg-background-dark border border-secondary/30 rounded p-6 flex flex-col">
                            <h2 className="text-lg font-bold text-white/90 border-b border-secondary/20 pb-2 mb-2">總營收</h2>
                            <p className="text-2xl font-bold flex justify-between items-center">{todayRevenue}<span className="text-lg text-primary/70">AC</span></p>
                        </div>

                        {/* 商品銷量排行 */}
                        <div className="row-span-2 col-span-2 font-serif bg-background-dark border border-secondary/30 rounded p-6 flex flex-col">
                            <h2 className="text-lg font-bold text-white/90 border-b border-secondary/20 pb-2">商品銷量排行</h2>
                            <div className="flex flex-col max-h-52 overflow-y-auto pr-1">
                                {todaySalesList.length === 0 ? (
                                    <p className="text-primary/80 text-sm">尚無銷售紀錄</p>
                                ) : (
                                    todaySalesList.map((item, index) => (
                                        <div key={index} className="flex justify-between text-sm border-b border-secondary/20 items-center hover:bg-secondary/10 transition px-2 py-3 rounded">
                                            <div className="flex justify-start gap-4 items-center">
                                                <p className="truncate text-primary/80">
                                                    {index + 1}. {item.name}
                                                </p>
                                                <span className="hidden md:block text-xs font-mono tracking-widest bg-secondary/10 border border-secondary/30 px-2 py-0.5 text-primary/80 rounded-full">
                                                    {item.category}
                                                </span>
                                            </div>
                                            <span className="font-bold text-primary/80">
                                                {item.quantity} 件
                                            </span>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>

                        {/* 總單數 */}
                        <div className="row-span-1 col-span-1 font-serif bg-background-dark border border-secondary/30 rounded p-6 flex flex-col">
                            <h2 className="text-lg font-bold text-white/90 border-b border-secondary/20 pb-2 mb-2">總單數</h2>
                            <p className="text-2xl font-bold flex justify-between items-center">{todayOrderCount}<span className="text-lg text-primary/70">單</span></p>
                        </div>

                    </div>
                </div>

            </div>
        </main>
    );
}