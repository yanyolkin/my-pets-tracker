import { LoginForm } from "@/features/auth";
import { Link } from "react-router-dom";

export const LoginPage = () => {
    return (
        <div
            style={{
                display: "flex",
                flexDirection: "column",
                background: "lightgreen",
                minHeight: "100vh",
                justifyContent: "center",
                alignItems: "center",
                gap: "1rem",
            }}
        >
            <LoginForm />
            <p style={{ textAlign: "center" }}>
                Нет аккаунта? <Link to="/register">Зарегистрироваться</Link>
            </p>
        </div>
    );
};
