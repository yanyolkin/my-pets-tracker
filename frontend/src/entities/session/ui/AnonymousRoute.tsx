import { Navigate, useLocation } from "react-router-dom";
import { useSessionStore } from "../model/store";
import { type ReactNode } from "react";

export const AnonymousRoute = ({ children }: { children: ReactNode }) => {
    const { user, isInitiated } = useSessionStore();
    const location = useLocation();

    const fromPage = location.state?.from?.pathname || "/";

    if (!isInitiated) {
        return (
            <div style={{ padding: "2rem", textAlign: "center" }}>
                Инициализация сессии...
            </div>
        );
    }
    if (user) return <Navigate to={fromPage} replace />;

    return <>{children}</>;
};
