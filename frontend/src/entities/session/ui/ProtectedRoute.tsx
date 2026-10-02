import { type ReactNode } from "react";
import { useSessionStore } from "../model/store";
import { Navigate, useLocation } from "react-router-dom";

export const ProtectedRoute = ({
    children,
    allowedRoles,
}: {
    children: ReactNode;
    allowedRoles?: ("USER" | "ADMIN")[];
}) => {
    const { user, isInitiated } = useSessionStore();
    const location = useLocation();

    if (!isInitiated) {
        return (
            <div style={{ padding: "2rem", textAlign: "center" }}>
                Инициализация сессии...
            </div>
        );
    }

    if (!user) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    if (allowedRoles && !allowedRoles.includes(user.role)) {
        return <Navigate to="/403" replace />;
    }

    return <>{children}</>;
};
