import { z } from "zod";

export const loginSchema = z.object({
    email: z.email("Некорректный формат email").min(1, "Email обязателен"),
    password: z.string().min(6, "Пароль должен быть не менее 6 символов"),
});

export type LoginFormData = z.infer<typeof loginSchema>;
