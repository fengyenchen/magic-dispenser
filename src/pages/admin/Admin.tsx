import { useNavigate, Outlet, useLocation } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';

import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "../../components/ui/alert-dialog"

export default function Admin() {
    const navigate = useNavigate();
    const location = useLocation(); // 取得當前位置資訊
    const auth = useContext(AuthContext);

    const handleRefresh = () => {
        window.location.reload();
    };

    const baseBtnClass = "w-full py-2.5 px-4 rounded text-xs tracking-widest flex justify-start items-center gap-2 transition border cursor-pointer";
    const activeClass = "bg-primary text-background-dark font-bold border-primary";
    const inactiveClass = "text-primary/70 border-transparent hover:bg-primary/10 hover:text-primary hover:border-primary/20";

    return (
        <div className="h-screen bg-background-dark text-primary font-serif flex">

            {/* 側邊欄外殼 */}
            <aside className="w-64 border-r border-primary/20 bg-background-dark/90 p-6 justify-between hidden md:flex flex-col">
                <div className="flex flex-col gap-6">
                    <div>
                        <div className="text-xl font-bold tracking-widest text-primary">ARCANA ADMIN</div>
                    </div>

                    {/* 儀表板按鈕區 */}
                    <nav className="flex flex-col gap-2">
                        <button
                            onClick={() => navigate('/admin/dashboard')}
                            className={`${baseBtnClass} ${location.pathname === "/admin/dashboard" ? activeClass : inactiveClass}`}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-4">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
                            </svg>
                            大釜訂單監控
                        </button>

                        <button
                            onClick={() => navigate('/admin/inventory')}
                            className={`${baseBtnClass} ${location.pathname === "/admin/inventory" ? activeClass : inactiveClass}`}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-4">
                                <path strokeLinecap="round" strokeLinejoin="round" d="m20.25 7.5-.625 10.632a2.25 2.25 0 0 1-2.247 2.118H6.622a2.25 2.25 0 0 1-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125Z" />
                            </svg>
                            物資庫存管理
                        </button>

                        <button
                            onClick={() => navigate('/admin/history')}
                            className={`${baseBtnClass} ${location.pathname === "/admin/history" ? activeClass : inactiveClass}`}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-4">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 2.994v2.25m10.5-2.25v2.25m-14.252 13.5V7.491a2.25 2.25 0 0 1 2.25-2.25h13.5a2.25 2.25 0 0 1 2.25 2.25v11.251m-18 0a2.25 2.25 0 0 0 2.25 2.25h13.5a2.25 2.25 0 0 0 2.25-2.25m-18 0v-7.5a2.25 2.25 0 0 1 2.25-2.25h13.5a2.25 2.25 0 0 1 2.25 2.25v7.5m-6.75-6h2.25m-9 2.25h4.5m.002-2.25h.005v.006H12v-.006Zm-.001 4.5h.006v.006h-.006v-.005Zm-2.25.001h.005v.006H9.75v-.006Zm-2.25 0h.005v.005h-.006v-.005Zm6.75-2.247h.005v.005h-.005v-.005Zm0 2.247h.006v.006h-.006v-.006Zm2.25-2.248h.006V15H16.5v-.005Z" />
                            </svg>
                            歷史資料分析
                        </button>

                        <button
                            onClick={() => navigate('/menu')}
                            className={`${baseBtnClass} ${location.pathname === "/menu" ? activeClass : inactiveClass}`}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-4">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 21v-7.5a.75.75 0 0 1 .75-.75h3a.75.75 0 0 1 .75.75V21m-4.5 0H2.36m11.14 0H18m0 0h3.64m-1.39 0V9.349M3.75 21V9.349m0 0a3.001 3.001 0 0 0 3.75-.615A2.993 2.993 0 0 0 9.75 9.75c.896 0 1.7-.393 2.25-1.016a2.993 2.993 0 0 0 2.25 1.016c.896 0 1.7-.393 2.25-1.015a3.001 3.001 0 0 0 3.75.614m-16.5 0a3.004 3.004 0 0 1-.621-4.72l1.189-1.19A1.5 1.5 0 0 1 5.378 3h13.243a1.5 1.5 0 0 1 1.06.44l1.19 1.189a3 3 0 0 1-.621 4.72M6.75 18h3.75a.75.75 0 0 0 .75-.75V13.5a.75.75 0 0 0-.75-.75H6.75a.75.75 0 0 0-.75.75v3.75c0 .414.336.75.75.75Z" />
                            </svg>
                            模擬學生終端
                        </button>
                    </nav>
                </div>

                <div className="flex flex-col gap-2">
                    {/* 重整按鈕 */}
                    <button
                        onClick={handleRefresh}
                        className="w-full py-2 border border-primary/30 rounded text-xs bg-secondary/10 hover:bg-primary/20 transition tracking-widest font-mono cursor-pointer"
                    >
                        REFRESH
                    </button>
                    {/* 登出按鈕 */}
                    <AlertDialog>
                        <AlertDialogTrigger>
                            <button
                                className="w-full py-2 border border-primary/30 rounded text-xs bg-secondary/10 hover:bg-primary/20 transition tracking-widest font-mono cursor-pointer"
                            >
                                LOGOUT
                            </button>
                        </AlertDialogTrigger>

                        <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle>確定要登出嗎？</AlertDialogTitle>
                                <AlertDialogDescription>
                                    登出後需要重新登入，請確認是否要登出。
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel>
                                    取消
                                </AlertDialogCancel>
                                <AlertDialogAction
                                    onClick={() => auth?.logout()}
                                >
                                    確定
                                </AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>

                </div>
            </aside>

            <main className="flex-1 overflow-y-auto h-screen">
                <Outlet />
            </main>
        </div>
    );
}