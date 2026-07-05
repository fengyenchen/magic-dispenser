import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const parseDatabaseDate = (dateStr: string | undefined | null): Date => {
  if (!dateStr) return new Date(0);

  // 先將資料庫的日期字串轉換為 Date 物件
  const parsedDate = new Date(dateStr);

  // 取得使用者的時區偏移量（以毫秒為單位）
  const userTimezoneOffsetMs = parsedDate.getTimezoneOffset() * -60000;

  // 將使用者的時區偏移量加到解析後的日期上，得到正確的本地時間
  const correctedTimestamp = parsedDate.getTime() + userTimezoneOffsetMs;

  return new Date(correctedTimestamp);
};