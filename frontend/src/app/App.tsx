import { useSessionStore } from "@/entities/session";
import { useEffect } from "react";
import "./styles.css";
import { AppRouter } from "./providers/AppRouter";

export const App = () => {
    const checkAuth = useSessionStore((state) => state.checkAuth);
    const clearAuth = useSessionStore((state) => state.clearAuth);
    const isInitiated = useSessionStore((state) => state.isInitiated);
    const isLoading = useSessionStore((state) => state.isLoading);

    useEffect(() => {
        checkAuth();

        const handleSessionExpired = () => {
            clearAuth();
        };

        window.addEventListener("auth-session-expired", handleSessionExpired);

        return () => {
            window.removeEventListener(
                "auth-session-expired",
                handleSessionExpired,
            );
        };
    }, [checkAuth, clearAuth]);

    if (!isInitiated || isLoading) {
        return (
            <div style={{ padding: "2rem", textAlign: "center" }}>
                Инициализация сессии...
            </div>
        );
    }

    return <AppRouter />;
};
