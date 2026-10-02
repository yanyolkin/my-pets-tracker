import { create } from "zustand";
import { apiClient } from "@/shared/api";
import { type sessionState } from "./types";

export const useSessionStore = create<sessionState>((set) => ({
    user: null,
    isInitiated: false,
    isLoading: false,

    setAuth: (user) => set({ user: user, isInitiated: true }),

    clearAuth: () => set({ user: null, isInitiated: true }),

    checkAuth: async () => {
        set({ isLoading: true });
        try {
            const response = await apiClient.get("/auth/me");
            console.log(response.data);
            set({ user: response.data.data.user, isInitiated: true });
        } catch {
            set({ user: null, isInitiated: true });
        } finally {
            set({ isLoading: false });
        }
    },

    logout: async () => {
        try {
            await apiClient.post("/auth/logout");
        } catch (e) {
            console.error("Ошибка логаута на сервере:", e);
        } finally {
            set({ user: null, isInitiated: true });
        }
    },
}));
