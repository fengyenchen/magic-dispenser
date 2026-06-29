import type { LoginCredentials, AuthResponse, RegisterCredentials } from '../types/auth';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// 取得所有使用者
export const getUsers = async () => {
    const response = await fetch(`${API_BASE_URL}/api/auth`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    });
    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message || '無法取得使用者資料');
    }
    return data.data;
};

// 註冊新使用者
export const register = async (credentials: RegisterCredentials) => {
    const response = await fetch(`${API_BASE_URL}/api/auth/register`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
    });
    
    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message || '註冊失敗');
    }

    return data;
};

// 登入使用者
export const login = async (credentials: LoginCredentials): Promise<AuthResponse> => {
    const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message || '登入失敗');
    }

    return data;
};