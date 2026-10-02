import z from "zod";

export const petSchema = z.object({
    name: z.string().min(1, "Некорректное имя"),
    type: z.string().min(1, "Некорректный тип"),
    breed: z.string().optional(),
    age: z
        .number("Введите корректное число")
        .min(0, "Возраст не может быть отрицательным")
        .max(100, "Возраст не может быть больше ста лет"),
    trackerId: z.string().optional(),
});

export type PetFormData = z.infer<typeof petSchema>;
export type PetFormInputData = z.input<typeof petSchema>;
