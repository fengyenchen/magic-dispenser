export interface Users { // 使用者屬性
  id: string;
  account: string;
  password: string;
  username: string;
  role: 'student' | 'professor';
}

export interface LoginCredentials { // 登入表單的帳密
  account: string;
  password: string;
}

export interface AuthResponse { // 後端登入回傳的資料
  user: Users;
  token: string;
}

export interface RegisterCredentials { // 註冊表單的帳密
  account: string;
  password: string;
  username: string;
  role: 'student' | 'professor';
}