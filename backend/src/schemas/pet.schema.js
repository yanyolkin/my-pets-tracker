const { z } = require("zod");

const createPetSchema = z.object({
    body: z.object({
        name: z.string({ message: "Имя питомца обязательно" }).min(1),
        type: z.string({ message: "Тип питомца обязателен" }).min(1),
        breed: z.string().optional(),
        age: z
            .number({ message: "Возраст обязателен" })
            .int()
            .nonnegative("Возраст не может быть отрицательным"),
        trackerId: z
            .string()
            .min(1, "ID трекера не может быть пустым")
            .optional(),
    }),
});

const updatePetSchema = z.object({
    body: z.object({
        name: z.string().min(1).optional(),
        type: z.string().min(1).optional(),
        breed: z.string().optional(),
        age: z.number().int().nonnegative().optional(),
        trackerId: z.string().min(1).nullable().optional(),
    }),
});

const trackerPayloadSchema = z.object({
    body: z.object({
        trackerId: z
            .string({ message: "Идентификатор трекера обязателен" })
            .min(1),
        latitude: z
            .number({ message: "Широта (latitude) должна быть числом" })
            .min(-90, "Широта должна быть в диапазоне от -90 до 90")
            .max(90, "Широта должна быть в диапазоне от -90 до 90"),
        longitude: z
            .number({ message: "Долгота (longitude) должна быть числом" })
            .min(-180, "Долгота должна быть в диапазоне от -180 до 180")
            .max(180, "Долгота должна быть в диапазоне от -180 до 180"),
    }),
});

module.exports = {
    createPetSchema,
    updatePetSchema,
    trackerPayloadSchema,
};
