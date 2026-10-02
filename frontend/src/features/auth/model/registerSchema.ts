import { z } from "zod";

export const registerSchema = z.object({
    firstName: z.string().min(2, "Имя должно содержать минимум 2 символа"),
    lastName: z
        .string()
        .min(2, "Фамилия должна содержать минимум 2 символа")
        .optional(),
    email: z.email("Некорректный формат email").min(1, "Email обязателен"),
    password: z.string().min(6, "Пароль должен быть не менее 6 символов"),
});

export type RegisterFormData = z.infer<typeof registerSchema>;
