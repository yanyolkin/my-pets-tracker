import { create } from "zustand";
import { apiClient } from "@/shared/api";
import { type PetStore, type Pet, type LocationPoint } from "./types";
import { isAxiosError } from "axios";

export const usePetStore = create<PetStore>((set) => ({
    pets: [],
    activePetId: null,
    historyPoints: [],
    isLoading: false,
    error: null,

    fetchPets: async () => {
        set({ isLoading: true, error: null });
        try {
            const response = await apiClient.get<{ data: { pets: Pet[] } }>(
                "/pets",
            );
            console.log("user fetch");
            set({ pets: response.data.data.pets, isLoading: false });
        } catch (err: unknown) {
            if (isAxiosError(err)) {
                set({
                    error:
                        err.response?.data?.message ||
                        "Не удалось загрузить список питомцев",
                    isLoading: false,
                });
            }
        }
    },

    createPet: async (dto) => {
        set({ isLoading: true, error: null });
        try {
            const response = await apiClient.post<{ data: { pet: Pet } }>(
                "/pets",
                dto,
            );
            set((state) => ({
                pets: [...state.pets, response.data.data.pet],
                isLoading: false,
            }));
        } catch (err: unknown) {
            if (isAxiosError(err)) {
                set({
                    error:
                        err.response?.data?.message ||
                        "Ошибка при добавлении питомца",
                    isLoading: false,
                });
            }
            throw err;
        }
    },

    updatePet: async (petId, dto) => {
        set({ isLoading: true, error: null });
        try {
            const response = await apiClient.patch<{ data: { pet: Pet } }>(
                `/pets/${petId}`,
                dto,
            );
            set((state) => ({
                pets: state.pets.map((p) =>
                    p.id === petId ? response.data.data.pet : p,
                ),
                isLoading: false,
            }));
        } catch (err: unknown) {
            if (isAxiosError(err)) {
                set({
                    error:
                        err.response?.data?.message ||
                        "Ошибка при обновлении данных питомца",
                    isLoading: false,
                });
            }
            throw err;
        }
    },

    deletePet: async (petId) => {
        set({ isLoading: true, error: null });
        try {
            await apiClient.delete(`/pets/${petId}`);
            set((state) => ({
                pets: state.pets.filter((p) => p.id !== petId),
                activePetId:
                    state.activePetId === petId ? null : state.activePetId,
                historyPoints:
                    state.activePetId === petId ? [] : state.historyPoints,
                isLoading: false,
            }));
        } catch (err: unknown) {
            if (isAxiosError(err)) {
                set({
                    error:
                        err.response?.data?.message ||
                        "Ошибка при удалении питомца",
                    isLoading: false,
                });
            }

            throw err;
        }
    },

    fetchUserPetsByAdmin: async (userId) => {
        set({ isLoading: true, error: null });
        try {
            const response = await apiClient.get<{ data: { pets: Pet[] } }>(
                `/admin/users/${userId}/pets`,
            );
            console.log("admin fetch");
            set({ pets: response.data.data.pets, isLoading: false });
        } catch (err: unknown) {
            if (isAxiosError(err)) {
                set({
                    error:
                        err.response?.data?.message ||
                        "Ошибка админки при загрузке питомцев",
                    isLoading: false,
                });
            }
        }
    },

    createUserPetByAdmin: async (userId, dto) => {
        set({ isLoading: true, error: null });
        try {
            const response = await apiClient.post<{ data: { pet: Pet } }>(
                `/admin/users/${userId}/pets`,
                dto,
            );
            set((state) => ({
                pets: [...state.pets, response.data.data.pet],
                isLoading: false,
            }));
        } catch (err: unknown) {
            if (isAxiosError(err)) {
                set({
                    error:
                        err.response?.data?.message ||
                        "Ошибка админки при создании питомца",
                    isLoading: false,
                });
            }
            throw err;
        }
    },

    updateUserPetByAdmin: async (userId, petId, dto) => {
        set({ isLoading: true, error: null });
        try {
            const response = await apiClient.patch<{ data: { pet: Pet } }>(
                `/admin/users/${userId}/pets/${petId}`,
                dto,
            );
            set((state) => ({
                pets: state.pets.map((p) =>
                    p.id === petId ? response.data.data.pet : p,
                ),
                isLoading: false,
            }));
        } catch (err: unknown) {
            if (isAxiosError(err)) {
                set({
                    error:
                        err.response?.data?.message ||
                        "Ошибка админки при обновлении питомца",
                    isLoading: false,
                });
            }
            throw err;
        }
    },

    deleteUserPetByAdmin: async (userId, petId) => {
        set({ isLoading: true, error: null });
        try {
            await apiClient.delete(`/admin/users/${userId}/pets/${petId}`);
            set((state) => ({
                pets: state.pets.filter((p) => p.id !== petId),
                activePetId:
                    state.activePetId === petId ? null : state.activePetId,
                historyPoints:
                    state.activePetId === petId ? [] : state.historyPoints,
                isLoading: false,
            }));
        } catch (err: unknown) {
            if (isAxiosError(err)) {
                set({
                    error:
                        err.response?.data?.message ||
                        "Ошибка админки при удалении питомца",
                    isLoading: false,
                });
            }
            throw err;
        }
    },

    setActivePetId: (id) => {
        set({ activePetId: id });
        if (!id) set({ historyPoints: [] });
    },

    fetchPetHistory: async (petId) => {
        set({ isLoading: true, error: null });
        try {
            const response = await apiClient.get(
                `locations/pets/${petId}/history`,
            );
            console.log(response.data);
            set({
                historyPoints: response.data.data,
                isLoading: false,
            });
        } catch (err: unknown) {
            if (isAxiosError(err)) {
                set({
                    error:
                        err.response?.data?.message ||
                        "Не удалось загрузить историю перемещений",
                    isLoading: false,
                });
            }
        }
    },

    addRealtimePoint: (point) => {
        set((state) => {
            const formattedPoint: LocationPoint = {
                id: point.id || `rt-${Date.now()}`,
                latitude: point.latitude,
                longitude: point.longitude,
                createdAt: point.createdAt,
                petId: point.petId,
            };

            const updatedPets = state.pets.map((pet) =>
                pet.id === point.petId
                    ? {
                          ...pet,
                          lastPosition: formattedPoint,
                      }
                    : pet,
            );

            const isDuplicate = state.historyPoints.some(
                (p) => p.createdAt === point.createdAt,
            );

            const updatedHistory = isDuplicate
                ? state.historyPoints
                : [...state.historyPoints, formattedPoint];

            return {
                pets: updatedPets,
                historyPoints: updatedHistory,
            };
        });
    },

    clearPetState: () =>
        set({ pets: [], activePetId: null, historyPoints: [], error: null }),
}));
