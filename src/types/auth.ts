import type { Users } from './magic';

export interface LoginCredentials { // 登入表單的帳密
  account: string;
  password: string;
}

export interface AuthResponse { // 後端登入回傳的資料
  user: Users;
  token: string;
}