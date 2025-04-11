export interface User {
    uid: string;
    email: string;
    emailVerified: boolean;
    createdAt: string;
    provider: string;
}

export interface AuthState {
    user: User | null;
    token: string | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    error: string | null
}

export interface LoginCredentials {
    email: string;
    password: string;
}

export interface RegisterCredentials extends LoginCredentials {
    confirmPassword?: string;
}

