import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { apiClient } from "@/shared/api";
import { useSessionStore } from "@/entities/session";
import { loginSchema, type LoginFormData } from "../model/loginSchema";
import styles from "./authForm.module.css";
import { Button, Input } from "@/shared/ui";

export const LoginForm = () => {
    const [serverError, setServerError] = useState<string | null>(null);
    const setAuth = useSessionStore((state) => state.setAuth);
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting, isValid },
    } = useForm<LoginFormData>({
        resolver: zodResolver(loginSchema),
        defaultValues: { email: "", password: "" },
        mode: "onChange",
    });

    const onSubmit = async (data: LoginFormData) => {
        setServerError(null);
        try {
            const response = await apiClient.post("/auth/login", data);
            console.log(response.data);
            setAuth(response.data.data.user);
        } catch {
            setServerError("Неверный email или пароль");
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
            <h2 style={{ textAlign: "center" }}>Вход в приложение</h2>
            {serverError && <div className={styles.error}>{serverError}</div>}

            <Input
                type="text"
                placeholder="Email"
                {...register("email")}
                error={errors.email?.message}
            />

            <Input
                type="password"
                placeholder="Пароль"
                {...register("password")}
                error={errors.password?.message}
            />

            <Button type="submit" disabled={isSubmitting || !isValid}>
                {isSubmitting ? "Вход..." : "Войти"}
            </Button>
        </form>
    );
};
