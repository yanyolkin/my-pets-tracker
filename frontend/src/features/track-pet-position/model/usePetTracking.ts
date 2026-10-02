import { useEffect } from "react";
import { usePetStore } from "@/entities/pet";
import { getSocket } from "@/shared/api";

export const usePetTracking = (activePetId: string | null) => {
    const { fetchPetHistory, addRealtimePoint } = usePetStore();

    useEffect(() => {
        if (!activePetId) return;

        fetchPetHistory(activePetId);

        const socket = getSocket();

        if (!socket.connected) {
            socket.connect();
        }

        socket.emit("join_pet_room", { petId: activePetId });

        socket.on("location_update", (data) => {
            if (data.petId === activePetId) {
                addRealtimePoint(data);
            }
        });

        socket.on("connect_error", (err) => {
            console.error("[Socket Auth Error]:", err.message);
        });

        return () => {
            socket.emit("leave_pet_room", { petId: activePetId });
            socket.off("location_update");
            socket.off("connect_error");
        };
    }, [activePetId, fetchPetHistory, addRealtimePoint]);
};
