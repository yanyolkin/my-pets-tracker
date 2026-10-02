import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { apiClient } from "@/shared/api";
import { useSessionStore } from "@/entities/session";
import { registerSchema, type RegisterFormData } from "../model/registerSchema";
import styles from "./authForm.module.css";
import { Button, Input } from "@/shared/ui";

export const RegisterForm = () => {
    const [serverError, setServerError] = useState<string | null>(null);
    const setAuth = useSessionStore((state) => state.setAuth);

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting, isValid },
    } = useForm<RegisterFormData>({
        resolver: zodResolver(registerSchema),
        defaultValues: { firstName: "", lastName: "", email: "", password: "" },
        mode: "onChange",
    });

    const onSubmit = async (data: RegisterFormData) => {
        setServerError(null);
        try {
            const response = await apiClient.post("/auth/register", data);
            setAuth(response.data.data.user);
        } catch {
            setServerError("Ошибка регистрации. Возможно, этот email занят.");
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
            <h2 style={{ textAlign: "center" }}>Регистрация</h2>
            {serverError && <div className={styles.error}>{serverError}</div>}

            <Input
                placeholder="Имя"
                {...register("firstName")}
                error={errors.firstName?.message}
            />
            <Input
                placeholder="Фамилия"
                {...register("lastName")}
                error={errors.lastName?.message}
            />

            <Input
                placeholder="email"
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
                {isSubmitting ? "Регистрация..." : "Зарегистрироваться"}
            </Button>
        </form>
    );
};
