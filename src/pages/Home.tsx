import { useNavigate } from 'react-router-dom';
import Wall from '../components/Wall';

export default function Home() {
    const navigate = useNavigate();

    return (
        <div className="relative w-screen h-screen overflow-hidden flex items-center justify-center bg-background">

            {/* 石牆 (z-0) */}
            <div className="absolute inset-0 z-0 opacity-40 pointer-events-none animate-pulse">
                <Wall />
            </div>

            {/* 光暈 (z-0) */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-125 h-125 bg-primary/30 rounded-full blur-3xl z-0 animate-pulse" />

            {/* 主內容卡片 (z-10) */}
            <div className="relative z-10 w-full max-w-2xl mx-4 p-8 md:p-12 bg-background-dark/60 backdrop-blur-xl border border-primary/20 rounded-xl shadow-3xl">
                
                {/* 角落裝飾 */}
                <div className="absolute top-0 left-0 -translate-x-1/2 -translate-y-1/2 w-4 h-4 bg-primary/80 blur-lg rounded-full"></div>
                <div className="absolute top-0 right-0 translate-x-1/2 -translate-y-1/2 w-4 h-4 bg-primary/80 blur-lg rounded-full"></div>
                <div className="absolute bottom-0 left-0 -translate-x-1/2 translate-y-1/2 w-4 h-4 bg-primary/80 blur-lg rounded-full"></div>
                <div className="absolute bottom-0 right-0 translate-x-1/2 translate-y-1/2 w-4 h-4 bg-primary/80 blur-lg rounded-full"></div>

                <div className="flex flex-col gap-6 text-center">
                    
                    {/* 上標 */}
                    <span className="font-serif text-xs tracking-[0.25rem] text-primary/60 uppercase">
                        Welcome to
                    </span>
                    
                    {/* 主標題 */}
                    <h1 className="font-serif text-2xl md:text-3xl font-bold tracking-widest text-primary">
                        新亞特蘭提斯 — 霓虹交界處
                    </h1>

                    {/* 裝飾線 */}
                    <div className="flex items-center justify-center gap-4 my-1">
                        <div className="h-px w-16 bg-linear-to-r from-transparent to-primary/30"></div>
                        <div className="w-1.5 h-1.5 bg-primary/60 rotate-45 animate-pulse"></div>
                        <div className="h-px w-16 bg-linear-to-l from-transparent to-primary/30"></div>
                    </div>

                    {/* 故事說明 */}
                    <p className="text-primary/70 text-xs md:text-sm font-serif leading-relaxed tracking-wide text-justify max-w-xl mx-auto">
                        這是一個魔法與科技高度融合的崩壞未來。在繁華的霓虹都市底層，有一條專門販售違禁魔法物資的暗巷——
                        <span className="text-primary font-bold">「第 9 號觀測站」</span>。
                        <br /><br />
                        巷子盡頭那面粗糙的黑石牆上，安裝著一台由古老煉金術與駭客技術改裝而成的「阿卡那（Arcana）自動販賣機」。這台孤零零矗立在斑駁石牆前的舊型終端實體，透過「大釜購物車」的魔力共鳴來運作。
                        <br /><br />
                        當拾荒巫師將「法術插件」投入大釜時，古老的齒輪便開始瘋狂咬合，以微秒的速度扣除物理庫存，提煉出能夠突破秩序、捕捉靈感的
                        <span className="text-primary font-bold">「暫時永恆」</span>。
                    </p>

                    {/* 登入按鈕 */}
                    <div className="mt-4">
                        <button
                            onClick={() => navigate('/login')}
                            className="w-full md:w-64 flex justify-center items-center mx-auto py-3 px-6 rounded-md border border-primary/60 bg-background-dark/40 text-primary font-bold tracking-widest transition hover:border-primary hover:bg-background-dark/80 cursor-pointer"
                        >
                            開始
                        </button>
                    </div>
                    
                </div>
            </div>
        </div>
    );
}