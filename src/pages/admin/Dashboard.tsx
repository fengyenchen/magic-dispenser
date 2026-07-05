import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAllOrders, updateOrderStatus, getOrder } from '../../services/orderService';
import { parseDatabaseDate } from '../../lib/utils';
import LogoutDialog from '../../components/LogoutDialog';

export default function Dashboard() {
    const navigate = useNavigate();

    const [orders, setOrders] = useState<any[]>([]);
    const [selectedOrder, setSelectedOrder] = useState<any>(null);
    const [selectedOrderDetails, setSelectedOrderDetails] = useState<any[] | null>(null);

    const [isLoading, setIsLoading] = useState(true);
    const [isDetailLoading, setIsDetailLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchOrders = async () => {
        try {
            setIsLoading(true);
            const data = await getAllOrders();
            const localizedData = data.map((order: any) => ({
                ...order,
                created_at: parseDatabaseDate(order.created_at) 
            }))

            setOrders(localizedData);
        } catch (err: any) {
            setError(err.message || '無法取得訂單資料');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchOrders();
    }, []);

    const handleSelectOrder = async (order: any) => {
        setSelectedOrder(order);

        try {
            setIsDetailLoading(true);
            const details = await getOrder(order.id);
            setSelectedOrderDetails(details);
        } catch (err: any) {
            alert(err.message || '無法取得魔藥詳細契約內容');
        } finally {
            setIsDetailLoading(false);
        }
    };

    const handleStatusUpdate = async (orderId: string, newStatus: string) => {
        try {
            await updateOrderStatus(orderId, newStatus);

            setOrders(prev => prev.map(order => order.id === orderId ? { ...order, status: newStatus } : order));
            if (selectedOrder && selectedOrder.id === orderId) {
                setSelectedOrder((prev: any) => ({ ...prev, status: newStatus }));
                const details = await getOrder(orderId);
                setSelectedOrderDetails(details);
            }
        } catch (err: any) {
            alert(err.message || '狀態矩陣寫入失敗');
        }
    };

    const brewingOrders = orders.filter(order => order.status === 'brewing');
    const pastOrders = orders.filter(order => order.status === 'completed' || order.status === 'failed');

    if (isLoading) return <div className="h-screen bg-background-dark text-primary font-serif flex items-center justify-center animate-pulse">正在加載訂單資料...</div>;
    if (error) return <div className="h-screen bg-background-dark text-red-400 font-serif flex items-center justify-center">{error}</div>;

    return (
        <main className="w-full h-screen bg-background p-6 lg:p-10 flex flex-col gap-8">

            {/* 標題 */}
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center border-b border-primary/20 pb-4 gap-4">
                <h1 className="text-2xl font-bold tracking-widest">大釜訂單監控</h1>
                {/* 導覽列：小螢幕用 */}
                <div className="w-full flex justify-between lg:hidden">
                    <div className="flex gap-2">
                        <button onClick={() => navigate('/admin/inventory')} className="text-[10px] border border-primary/20 px-2 py-1 rounded bg-secondary/10">庫存</button>
                        <button onClick={() => navigate('/admin/history')} className="text-[10px] border border-primary/20 px-2 py-1 rounded bg-secondary/10">歷史</button>
                        <button onClick={() => navigate('/menu')} className="text-[10px] border border-primary/20 px-2 py-1 rounded bg-secondary/10">學生端</button>
                    </div>
                    <div className="flex gap-2">
                        <button onClick={fetchOrders} className="text-[10px] border border-primary/20 px-2 py-1 rounded bg-secondary/10">刷新</button>
                        <LogoutDialog trigger={
                            <button className="text-[10px] border border-primary/20 px-2 py-1 rounded bg-secondary/10">登出</button>
                        } />
                    </div>
                </div>
            </div>

            {/* 內容 */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">

                {/* 左側 */}
                <div className="lg:col-span-2 flex flex-col gap-8">

                    {/* 上層 (brewing) */}
                    <section className="bg-background-dark border-2 border-primary/50 rounded-md p-4">
                        <div className="flex justify-between items-center mb-4 border-b border-secondary/30 pb-2">
                            <h2 className="text-xs font-bold text-primary/90 tracking-widest flex items-center gap-3">
                                <span className="h-1.5 w-1.5 rounded-full bg-primary/80 animate-ping" />
                                大釜煉製實時反應堆
                            </h2>
                            <span className="font-mono text-[10px] bg-secondary/30 px-2 py-0.5 rounded text-primary/90 border border-primary/50">{brewingOrders.length} 筆</span>
                        </div>

                        {brewingOrders.length === 0 ? (
                            <div className="text-center py-8 text-xs text-primary/30 italic">當前全院大釜靜止，尚無運作中的煉製契約。</div>
                        ) : (
                            <div className="flex flex-col gap-2 max-h-42 overflow-auto pr-1">
                                {brewingOrders.map(order => (
                                    <div
                                        key={order.id}
                                        onClick={() => handleSelectOrder(order)}
                                        className={`p-3 rounded border bg-background-dark/30 flex flex-col lg:flex-row items-start justify-between lg:items-center gap-3 transition cursor-pointer text-xs font-mono ${selectedOrder?.id === order.id ? 'border-primary bg-secondary/5' : 'border-secondary/10 hover:border-secondary/30'}`}
                                    >
                                        <div className="flex flex-col items-start gap-0.5">
                                            <div className="text-white/70 font-bold truncate">{order.id}</div>
                                            <div className="text-[10px] text-primary/50 mt-1 font-serif">消耗 <span className="text-primary font-bold mx-1">{order.total_price} AC</span> · {order.created_at.toLocaleString('zh-TW')}</div>
                                        </div>
                                        <div className="flex gap-1.5" onClick={e => e.stopPropagation()}>
                                            <button
                                                onClick={() => handleStatusUpdate(order.id, 'completed')}
                                                className="flex justify-between items-center gap-1 cursor-pointer bg-primary hover:bg-primary/90 text-background-dark border border-primary/30 font-mono text-xs px-2.5 py-1.5 rounded transition font-semibold"
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-4">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                                                </svg>
                                                完成
                                            </button>
                                            <button
                                                onClick={() => handleStatusUpdate(order.id, 'failed')}
                                                className="flex justify-between items-center gap-1 cursor-pointer hover:bg-primary/10 text-primary border border-primary font-mono text-xs px-2.5 py-1.5 rounded transition font-semibold"
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-4">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                                                </svg>
                                                失敗
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </section>

                    {/* 下層 (past orders) */}
                    <section className="bg-background-dark border border-secondary/20 rounded-md p-4">
                        <div className="flex justify-between items-center mb-4 border-b border-secondary/10 text-white/70 pb-2">
                            <h2 className="flex justify-between items-center gap-2 text-xs font-bold tracking-widest uppercase">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-4">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="m20.25 7.5-.625 10.632a2.25 2.25 0 0 1-2.247 2.118H6.622a2.25 2.25 0 0 1-2.247-2.118L3.75 7.5m8.25 3v6.75m0 0-3-3m3 3 3-3M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125Z" />
                                </svg>
                                歷史封印契約庫
                            </h2>
                            <span className="font-mono text-[10px]">{pastOrders.length} 筆</span>
                        </div>

                        {pastOrders.length === 0 ? (
                            <div className="text-center py-6 text-xs text-primary/20 italic">尚無任何歷史紀錄封存。</div>
                        ) : (
                            <div className="flex flex-col gap-2 max-h-42 overflow-y-auto pr-1">
                                {pastOrders.map(order => (
                                    <div
                                        key={order.id}
                                        onClick={() => handleSelectOrder(order)}
                                        className={`p-3 rounded border bg-background-dark/30 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-3 transition cursor-pointer text-xs font-mono ${selectedOrder?.id === order.id ? 'border-primary bg-secondary/5' : 'border-secondary/10 hover:border-secondary/30'}`}
                                    >
                                        <div className="flex flex-col items-start gap-0.5">
                                            <div className="text-primary/70 truncate">{order.id}</div>
                                            <div className="text-[10px] text-primary/40 mt-0.5 font-serif">消耗 <span className="text-primary font-bold px-1">{order.total_price} AC</span> · {order.created_at.toLocaleString()}</div>
                                        </div>
                                        <div className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold tracking-widest border ${order.status === 'completed' ? 'bg-green-500/5 text-green-400/80 border-green-500/20' : 'bg-red-500/5 text-red-400/80 border-red-500/20'}`}>
                                            {order.status}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </section>

                </div>

                {/* 右側 */}
                <div className="bg-background-dark border border-secondary/30 rounded-md p-6 mb-8">
                    {selectedOrder ? (
                        <div className="flex flex-col gap-4">
                            <div className="border-b border-secondary/20 pb-3">
                                <div className="flex justify-between items-start">
                                    <h3 className="font-serif text-sm font-bold text-primary tracking-wide">契約詳細資訊</h3>
                                    <span className={`text-[9px] uppercase font-mono px-1.5 py-0.5 border rounded ${selectedOrder.status === 'brewing' ? 'border-primary text-primary/90' : selectedOrder.status === 'completed' ? 'border-green-500 text-green-400' : 'border-red-500 text-red-400'}`}>
                                        {selectedOrder.status}
                                    </span>
                                </div>
                                <p className="text-[9px] font-mono text-primary/40 mt-1 uppercase truncate">{selectedOrder.id}</p>
                            </div>

                            <div className="flex flex-col gap-2.5 my-1 max-h-68 overflow-y-auto pr-1">
                                {isDetailLoading ? (
                                    <div className="text-center py-12 text-xs text-primary/50 animate-pulse">正在調閱大釜契約細節...</div>
                                ) : selectedOrderDetails ? (
                                    selectedOrderDetails.map((item: any, idx: number) => (
                                        <div key={idx} className="bg-secondary/5 border border-secondary/10 rounded p-2.5 flex justify-between items-center text-xs">
                                            <div className="flex flex-col gap-0.5">
                                                <h4 className="font-serif text-white/90 font-bold">
                                                    {item.magic_item_name || `魔藥原料 (${item.magic_item_id?.substring(0, 6)})...`}
                                                </h4>
                                                <p className="text-[10px] font-mono text-secondary mt-0.5">
                                                    單價: {item.price !== undefined ? `${item.price} AC` : '未註冊'}
                                                </p>
                                            </div>
                                            <div className="font-mono text-xs text-primary bg-background-dark/80 border border-secondary/10 px-2 py-0.5 rounded">
                                                × {item.quantity}
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="text-center py-12 text-xs text-primary/30 italic">暫無清單資料</div>
                                )}
                            </div>

                            <div className="border-t border-secondary/10 pt-4 font-serif text-xs flex flex-col gap-2">
                                <div className="flex justify-between items-center">
                                    <span className="text-primary/60">時間</span>
                                    <span className="font-mono text-[11px] text-primary/80">{selectedOrder.created_at.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between items-center border-t border-secondary/5 pt-2">
                                    <span className="text-primary/60">總計</span>
                                    <span className="text-lg font-bold text-primary">{selectedOrder.total_price} 阿卡幣</span>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="text-center py-24 font-serif text-xs text-primary/40 italic">
                            點擊左側任一契約以查看詳細內容
                        </div>
                    )}
                </div>

            </div>
        </main>
    );
}