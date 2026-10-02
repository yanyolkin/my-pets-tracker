import { create } from "zustand";
import { type UserStore, type UserState } from "./types";
import { apiClient } from "@/shared/api";
import { isAxiosError } from "axios";

const userState: UserState = {
    users: [],
    isLoading: false,
    selectedUser: null,
    error: null,
};

const useUserStore = create<UserStore>((set) => ({
    ...userState,
    actions: {
        loadUsers: async () => {
            set({ isLoading: true });
            try {
                const response = await apiClient.get("admin/users");
                console.log(response.data);
                set({ users: response.data.data.users });
            } catch (err) {
                if (isAxiosError(err)) {
                    set({
                        error:
                            err.response?.data.message ||
                            "Something went wrong",
                    });
                }
            } finally {
                set({ isLoading: false });
            }
        },
    },
}));

export const useUsers = () => useUserStore((state) => state.users);
export const useUserLoading = () => useUserStore((state) => state.isLoading);
export const useUserError = () => useUserStore((state) => state.error);
export const useSelectedUser = () =>
    useUserStore((state) => state.selectedUser);
export const useUserActions = () => useUserStore((state) => state.actions);
