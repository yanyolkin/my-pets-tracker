import { usePetStore } from "@/entities/pet";
import { Navigate } from "react-router-dom";

export const MapRouteGuard = ({ children }: { children: React.ReactNode }) => {
    const activePetId = usePetStore((state) => state.activePetId);

    if (!activePetId) {
        return <Navigate to="/" replace />;
    }

    return <>{children}</>;
};