import { useNavigate, Outlet } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';

export default function Admin() {
    const navigate = useNavigate();
    const auth = useContext(AuthContext);

    // 強制重整矩陣的小工具
    const handleRefresh = () => {
        window.location.reload();
    };

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
                            className="w-full py-2.5 px-4 rounded bg-primary text-background-dark font-bold text-xs tracking-widest flex justify-start items-center gap-2 transition cursor-pointer"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-4">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
                            </svg>
                            大釜訂單監控
                        </button>

                        <button
                            onClick={() => navigate('/admin/inventory')}
                            className="w-full py-2.5 px-4 rounded text-primary/70 hover:bg-primary/10 hover:text-primary text-xs tracking-widest flex justify-start items-center gap-2 transition border border-transparent hover:border-primary/20 cursor-pointer"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-4">
                                <path strokeLinecap="round" strokeLinejoin="round" d="m20.25 7.5-.625 10.632a2.25 2.25 0 0 1-2.247 2.118H6.622a2.25 2.25 0 0 1-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125Z" />
                            </svg>
                            禁忌物資管制
                        </button>

                        <button
                            onClick={() => navigate('/menu')}
                            className="w-full py-2.5 px-4 rounded text-primary/50 hover:bg-primary/5 hover:text-primary text-xs tracking-wide flex justify-start items-center gap-2 transition cursor-pointer"
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
                    <button
                        onClick={() => {
                            auth?.logout();
                        }}
                        className="w-full py-2 border border-primary/30 rounded text-xs bg-secondary/10 hover:bg-primary/20 transition tracking-widest font-mono cursor-pointer"
                    >
                        LOGOUT
                    </button>
                </div>

            </aside>

            <main className="flex-1 overflow-y-auto h-screen">
                <Outlet />
            </main>

        </div>
    );
}