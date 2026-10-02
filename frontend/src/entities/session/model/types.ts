export type UserRole = "USER" | "ADMIN";

export interface User {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    role: UserRole;
    createdAt: string;
}

export interface sessionState {
    user: User | null;
    isInitiated: boolean; 
    isLoading: boolean;
    setAuth: (user: User) => void;
    clearAuth: () => void;
    checkAuth: () => Promise<void>;
    logout: () => Promise<void>;
}
