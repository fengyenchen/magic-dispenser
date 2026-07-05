import { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAllOrders } from '../../services/orderService';
import { getMagicItem } from '../../services/magicService';
import * as React from "react"
import { isWithinInterval } from "date-fns"
import { type DateRange } from "react-day-picker"
import { Calendar } from "../../components/ui/calendar"
import type { Order } from '../../types/magic';
import LogoutDialog from '../../components/LogoutDialog';

interface SalesItem {
    id: string;
    name: string;
    quantity: number;
    price: number;
    category: string;
}

export default function History() {
    const navigate = useNavigate();
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    const [allOrders, setAllOrders] = useState<Order[]>([]);

    const [todayRevenue, setTodayRevenue] = useState<number>(0);
    const [todayOrderCount, setTodayOrderCount] = useState<number>(0);
    const [todaySalesList, setTodaySalesList] = useState<SalesItem[]>([]);

    const [dateRange, setDateRange] = React.useState<DateRange | undefined>(() => {
        const now = new Date();
        now.setHours(0, 0, 0, 0);
        return {
            from: new Date(now.getFullYear(), now.getMonth(), now.getDate() - 30),
            to: now
        };
    });

    const fetchOrders = async (isBackground: boolean = false) => {
        try {
            if (!isBackground) {
                setIsLoading(true);
            }
            const data: Order[] = await getAllOrders();
            setAllOrders(data);

            const today = new Date();
            today.setHours(0, 0, 0, 0);

            const todaysOrders = data.filter((order) => {
                const orderDate = new Date(order.created_at);
                return orderDate.getDate() === today.getDate();
            });

            const revenue = todaysOrders.reduce((total, order) => total + (order.total_price || 0), 0);
            setTodayRevenue(revenue);

            setTodayOrderCount(todaysOrders.length);

            // item_id => quantity
            const todayItems: { [key: string]: number } = {};
            todaysOrders.forEach((order) => {
                let items = order.cart_items || [];
                items.forEach((item) => {
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
            if (!isBackground) {
                setIsLoading(false);
            }
        }
    };

    const pastStats = useMemo(() => {
        if (!dateRange?.from || !dateRange?.to) {
            return { revenue: 0, count: 0 };
        }

        const startDate = new Date(dateRange.from);
        startDate.setHours(0, 0, 0, 0);
        const endDate = new Date(dateRange.to);
        endDate.setHours(23, 59, 59, 999);

        const filteredOrders = allOrders.filter((order) => {
            const orderDate = new Date(order.created_at);
            return isWithinInterval(orderDate, { start: startDate, end: endDate });
        });

        const revenue = filteredOrders.reduce((total, order) => total + (order.total_price || 0), 0);

        return {
            revenue,
            count: filteredOrders.length
        };
    }, [allOrders, dateRange]);

    useEffect(() => {
        fetchOrders(false);

        // 每 5 秒刷新一次訂單資料
        const timer = setInterval(() => {
            fetchOrders(true);
        }, 5000);

        return () => clearInterval(timer);
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
                        <button onClick={() => fetchOrders(false)} className="text-[10px] border border-primary/20 px-2 py-1 rounded bg-secondary/10">刷新</button>
                        <LogoutDialog trigger={
                            <button className="text-[10px] border border-primary/20 px-2 py-1 rounded bg-secondary/10">登出</button>
                        } />
                    </div>
                </div>
            </div>

            {/* 內容 */}
            <div className="w-full flex flex-col mt-6 mb-4">

                {/* 今日 */}
                <div className="w-full mb-6">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-bold text-primary/80">今日</h2>
                        <span className="text-xs font-mono tracking-widest bg-secondary/10 border border-secondary/30 px-2 py-0.5 text-primary/80 rounded-full">{new Date().toLocaleDateString()}</span>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 lg:grid-rows-2 gap-4">
                        {/* 總營收 */}
                        <div className="lg:row-span-1 lg:col-span-1 font-serif bg-background-dark border border-secondary/30 rounded p-6 flex flex-col">
                            <h2 className="text-lg font-bold text-white/90 border-b border-secondary/20 pb-2 mb-2">總營收</h2>
                            <p className="text-2xl font-bold flex justify-between items-center">{todayRevenue}<span className="text-lg text-primary/70">AC</span></p>
                        </div>

                        {/* 商品銷量排行 */}
                        <div className="lg:row-span-2 lg:col-span-2 font-serif bg-background-dark border border-secondary/30 rounded p-6 flex flex-col">
                            <h2 className="text-lg font-bold text-white/90 border-b border-secondary/20 pb-2">商品銷量排行</h2>
                            <div className="flex flex-col max-h-52 overflow-y-auto pr-1">
                                {todaySalesList.length === 0 ? (
                                    <p className="text-primary/80 text-sm pt-3">尚無銷售紀錄</p>
                                ) : (
                                    todaySalesList.map((item, index) => (
                                        <div key={item.id} className="flex justify-between text-sm border-b border-secondary/20 items-center hover:bg-secondary/10 transition px-2 py-3 rounded">
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
                        <div className="lg:row-span-1 lg:col-span-1 font-serif bg-background-dark border border-secondary/30 rounded p-6 flex flex-col">
                            <h2 className="text-lg font-bold text-white/90 border-b border-secondary/20 pb-2 mb-2">總單數</h2>
                            <p className="text-2xl font-bold flex justify-between items-center">{todayOrderCount}<span className="text-lg text-primary/70">單</span></p>
                        </div>

                    </div>
                </div>

                {/* 日曆 */}
                <div className="w-full">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-bold text-primary/80">過去</h2>
                        <span className="text-xs font-mono tracking-widest bg-secondary/10 border border-secondary/30 px-2 py-0.5 text-primary/80 rounded-full">
                            from {dateRange?.from?.toLocaleDateString() || '未選擇'} to {dateRange?.to?.toLocaleDateString() || '未選擇'}
                        </span>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 lg:grid-rows-2 gap-4">
                        <div className="w-full h-full lg:col-span-1 lg:row-span-2 flex justify-center lg:justify-start">
                            <Calendar
                                mode="range"
                                defaultMonth={dateRange?.from}
                                selected={dateRange}
                                onSelect={setDateRange}
                                numberOfMonths={2}
                                className="rounded-lg border border-secondary/30"
                            />
                        </div>

                        {/* 總營收 */}
                        <div className="lg:row-span-1 lg:col-span-1 font-serif bg-background-dark border border-secondary/30 rounded p-6 flex flex-col">
                            <h2 className="text-lg font-bold text-white/90 border-b border-secondary/20 pb-2 mb-2">總營收</h2>
                            <p className="text-2xl font-bold flex justify-between items-center">{pastStats.revenue}<span className="text-lg text-primary/70">AC</span></p>
                        </div>

                        {/* 總單數 */}
                        <div className="lg:row-span-1 lg:col-span-1 font-serif bg-background-dark border border-secondary/30 rounded p-6 flex flex-col">
                            <h2 className="text-lg font-bold text-white/90 border-b border-secondary/20 pb-2 mb-2">總單數</h2>
                            <p className="text-2xl font-bold flex justify-between items-center">{pastStats.count}<span className="text-lg text-primary/70">單</span></p>
                        </div>

                    </div>
                </div>

            </div>
        </main>
    );
}