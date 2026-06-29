import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import Wall from '../components/Wall';
import { login as loginService } from '../services/authService';

export default function Login() {
    const auth = useContext(AuthContext);
    const navigate = useNavigate();

    // 表單狀態
    const [account, setAccount] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    if (!auth) throw new Error('Login 必須在 AuthProvider 內部使用');
    const { login } = auth;

    const handleSubmit = async (e: any) => {
        e.preventDefault();
        setError(null);
        setIsLoading(true);

        try {
            const data = await loginService({ account, password });
            login(data.user, data.token);

            if (data.user.role === 'professor') {
                navigate('/admin/dashboard');
            } else {
                navigate('/menu');
            }
        } catch (err: any) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="relative w-screen h-screen overflow-hidden flex items-center justify-center bg-background-dark">

            {/* 石牆 (z-0) */}
            <div className="absolute inset-0 z-0 opacity-60 pointer-events-none">
                <Wall />
            </div>

            {/* 登入表單 (z-10) */}
            <form
                onSubmit={handleSubmit}
                className="relative z-10 w-full h-screen flex flex-col gap-6 backdrop-blur-[1px] md:backdrop-blur-xs shadow-2xl"
            >
                <div className="m-auto p-auto min-w-xs md:min-w-md">
                    <div className="flex flex-col gap-2 text-center">
                        <h2 className="font-serif text-2xl font-bold tracking-widest text-primary">
                            阿卡那禁忌密鑰驗證
                        </h2>
                        <p className="text-primary/80 text-xs font-serif italic tracking-wide mb-6">
                            請驗證特許帳密以引導黑市網路接入點
                        </p>
                    </div>

                    {/* 錯誤欄位 */}
                    {error && (
                        <div className="bg-secondary/20 border border-secondary/40 rounded-md p-3 text-center text-xs text-primary font-serif animate-pulse mb-4">
                            {error}
                        </div>
                    )}

                    {/* 表單內容 */}
                    <div className="flex flex-col gap-4 mb-2">
                        {/* 帳號 */}
                        <div className="flex flex-col gap-2">
                            <label className="text-xs font-serif text-primary/80 tracking-wider" htmlFor="account">黑市信箱 (Account)</label>
                            <input
                                type="email"
                                name="account"
                                required
                                value={account}
                                onChange={(e) => setAccount(e.target.value)}
                                placeholder="example@example.com"
                                className="w-full bg-background-dark/90 border border-secondary rounded-md px-4 py-3 text-sm text-white focus:outline-none focus:border-primary transition font-mono"
                            />
                        </div>

                        {/* 密碼 */}
                        <div className="flex flex-col gap-2">
                            <label className="text-xs font-serif text-primary/80 tracking-wider" htmlFor="password">加密金鑰 (Password)</label>
                            <input
                                type="password"
                                name="password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="••••••••"
                                className="w-full bg-background-dark/90 border border-secondary rounded-md px-4 py-3 text-sm text-white focus:outline-none focus:border-primary transition font-mono"
                            />
                        </div>
                    </div>

                    {/* 登入按鈕 */}
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full mt-4 py-3 rounded-md bg-primary text-background-dark hover:bg-primary/80 border border-primary/30 font-bold font-serif tracking-widest text-sm transition disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                    >
                        {isLoading ? '正在解析密鑰共鳴...' : '解鎖節點，簽到進場'}
                    </button>
                </div>
            </form>
        </div>
    );
}