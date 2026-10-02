import { RegisterForm } from "@/features/auth";
import { Link } from "react-router-dom";

export const RegisterPage = () => {
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
            <RegisterForm />
            <p style={{ textAlign: "center" }}>
                Уже есть аккаунт? <Link to="/login">Войти</Link>
            </p>
        </div>
    );
};
