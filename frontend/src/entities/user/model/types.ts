import type { Pet } from "@/entities/pet";

export interface User {
    id: string;
    email: string;
    firstName: string;
    lastName?: string;
    role: "USER" | "ADMIN";
    createdAt: string;
    updatedAt: string;
    pets: Pet[];
}

export interface UserState {
    users: User[];
    isLoading: boolean;
    error: string | null;
    selectedUser: User | null;
}

export interface UserActions {
    loadUsers: () => Promise<void>;
}

export type UserStore = UserState & { actions: UserActions };
