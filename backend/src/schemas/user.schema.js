const { z } = require("zod");

const createUserSchema = z.object({
    body: z.object({
        email: z.email({
            message: "Некорректный формат email или поле не заполнено",
        }),
        password: z
            .string({ message: "Пароль обязателен" })
            .min(6, "Пароль должен быть не менее 6 символов"),
        firstName: z
            .string({ message: "Имя обязательно" })
            .min(2, "Имя должно быть не менее 2 символов"),
        lastName: z.string().optional(),
        role: z.enum(["USER", "ADMIN"]).optional().default("USER"),
    }),
});

const updateUserSchema = z.object({
    params: z.object({
        id: z.uuid({ message: "Некорректный ID формата UUID" }),
    }),
    body: z.object({
        email: z.email({ message: "Некорректный формат email" }).optional(),
        password: z
            .string()
            .min(6, "Пароль должен быть не менее 6 символов")
            .optional(),
        firstName: z
            .string()
            .min(2, "Имя должно быть не менее 2 символов")
            .optional(),
        lastName: z.string().optional(),
        role: z.enum(["USER", "ADMIN"]).optional(),
    }),
});

module.exports = { createUserSchema, updateUserSchema };
