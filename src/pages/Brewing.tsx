import { useEffect, useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Wall from '../components/Wall';
import Loader from '../components/Loader';
import { getOrder } from '../services/orderService';

export default function Brewing() {
    const { orderId } = useParams<{ orderId: string }>();
    const navigate = useNavigate();
    const [orderList, setOrderList] = useState<any[]>([]);

    // 日誌
    const logs = [
        "Establishing handshake with Kronos Cauldron...",
        "Injecting Liquid High-Energy Ether modules...",
        "Stabilizing transmutation matrix at 180°C...",
        "Synchronizing spell_gate encryption array...",
        "TRANSMUTATION SUCCESSFUL. Dispersing assets to collection bay."
    ];

    const fetchOrderList = async () => {
        if (!orderId) return;

        try {
            setOrderList(await getOrder(orderId));
        } catch (error) {
            console.error('Error fetching order details:', error);
        }
    };

    useEffect(() => {
        fetchOrderList();
    }, []);

    const totalPrice = useMemo(() => {
        return orderList.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    }, [orderList]);

    return (
        <div className="relative w-screen h-screen overflow-hidden flex items-center justify-center bg-background-dark">

            {/* 石牆 (z-0) */}
            <div className="absolute inset-0 z-0 opacity-40 pointer-events-none animate-pulse">
                <Wall />
            </div>

            {/* 動畫遮罩 (z-20) */}
            <Loader
                title="ARCANA_TRANSMUTATION_SYSTEM"
                logs={logs}
            />

            {/* 釀造完成面板 (z-10) */}
            <div className="relative z-10 w-full max-w-md mx-4 bg-background-dark/80 border border-secondary/30 rounded-md p-6 flex flex-col gap-5 shadow-2xl backdrop-blur-xs">

                <div className="flex flex-col justify-center items-center gap-2 border-b border-secondary/20 pb-3">
                    <h2 className="font-serif text-xl font-bold tracking-widest text-primary">
                        物質已調配完成
                    </h2>
                    {orderId && (
                        <p className="text-[9px] font-mono text-primary/40 tracking-wider uppercase">
                            REG_CONTRACT_ID: {orderId}
                        </p>
                    )}
                </div>

                <div className="flex flex-col items-center justify-center py-4">
                    <ul className="text-sm text-primary/70 w-full px-4">
                        <li className="overflow-y-auto max-h-48">
                            {orderList.map((item) => (
                                <li className="mb-2 flex justify-between items-center" key={item.cart_item_id}>
                                    <span>{item.magic_item_name} × {item.quantity}</span>
                                    <span className="font-bold">{item.quantity * item.price}</span>
                                </li>
                            ))}
                        </li>

                        <li className="border-b border-secondary/70 my-4"></li>
                        <li className="flex justify-end items-center">
                            共 <span className="font-bold mx-1"> {totalPrice} </span> 阿卡幣
                        </li>
                    </ul>
                </div>

                <div className="border-t border-secondary/10 pt-4">
                    <button
                        onClick={() => navigate('/menu')}
                        className="w-full py-3 rounded-md bg-primary text-background-dark hover:bg-primary/80 border border-primary/30 font-bold font-serif tracking-widest text-xs transition cursor-pointer animate-pulse duration-1000"
                    >
                        返回物資供應端
                    </button>
                </div>

            </div>

        </div>
    );
}