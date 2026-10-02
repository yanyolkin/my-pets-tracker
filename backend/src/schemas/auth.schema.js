const { z } = require("zod");

const registerSchema = z.object({
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
    }),
});

const loginSchema = z.object({
    body: z.object({
        email: z.email({
            message: "Некорректный формат email или поле не заполнено",
        }),
        password: z
            .string({ message: "Пароль обязателен" })
            .min(1, "Пароль не может быть пустым"),
    }),
});

module.exports = {
    registerSchema,
    loginSchema,
};
