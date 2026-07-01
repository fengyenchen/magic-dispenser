import type { LoginCredentials, AuthResponse, RegisterCredentials } from '../types/auth';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// 取得目前登入使用者資料
export const getCurrentUser = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
        throw new Error('未找到登入憑證，請重新登入');
    };

    const response = await fetch(`${API_BASE_URL}/api/auth/me`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
    });

    const data = await response.json();

    if (!response.ok || data.status === 'error') {
        throw new Error(data.message || '無法取得使用者資料，請重新登入');
    }

    return data.user; 
};

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