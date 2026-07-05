import { useState, useEffect } from 'react';

interface LoaderProps {
    title: string;
    logs: string[];
}

export default function Loader({ title, logs }: LoaderProps) {
    const [currentLog, setCurrentLog] = useState('');
    const [isLogging, setIsLogging] = useState(true);
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        let index = 0;
        const totalLogs = logs.length;

        const interval = setInterval(() => {
            if (index < totalLogs) {
                setCurrentLog(logs[index]);
                index++;
                setProgress(Math.floor((index / totalLogs) * 100));
            } else {
                clearInterval(interval);
                setIsLogging(false);
            }
        }, 400);

        return () => clearInterval(interval);
    }, [logs]);

    // 計算矩陣方塊（共 16 格）
    const totalBlocks = 16;
    const filledBlocks = Math.floor((progress / 100) * totalBlocks);
    const blocksDisplay = "█".repeat(filledBlocks) + "░".repeat(totalBlocks - filledBlocks);

    return (
        <div
            className={`fixed inset-0 z-20 flex flex-col items-center justify-center bg-background-dark p-6 transition duration-700 ease-in-out ${isLogging ? 'opacity-100 visible' : 'opacity-0 invisible pointer-events-none'}`}
        >
            <div className="w-full max-w-xs p-6 border border-primary/30 bg-background-dark/40 rounded-md text-center font-mono text-primary overflow-hidden flex flex-col items-center">
                <div className="text-[10px] opacity-60 mb-3 tracking-widest uppercase w-full">{title}</div>

                {/* 日誌 */}
                <div className="h-8 text-[12px] text-primary/80 mb-3 flex items-center justify-center font-serif italic px-2 w-full">
                    {currentLog}
                </div>

                {/* 進度條 */}
                <div className="w-full overflow-hidden flex items-center justify-center mb-2 text-base sm:text-lg tracking-wide font-bold drop-shadow-[0_0_5px_rgba(230,213,184,0.5)] whitespace-nowrap">
                    [{blocksDisplay}]
                </div>

                {/* 百分比 */}
                <div className="text-xs font-bold text-primary/80 w-full">{progress}%</div>
            </div>
        </div>
    );
}