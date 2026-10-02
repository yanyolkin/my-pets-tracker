import { useForm } from "react-hook-form";
import { type PetFormData, petSchema } from "../model/petSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { usePetStore, type Pet } from "@/entities/pet";
import { Button, Input } from "@/shared/ui";
import styles from "./PetForm.module.css";
import { useEffect } from "react";

interface PetFormProps {
    onSuccess: () => void;
    isOpen: boolean;
    pet?: Pet;
    userId?: string;
}

export const PetForm = ({ userId, pet, isOpen, onSuccess }: PetFormProps) => {
    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting, isValid },
    } = useForm<PetFormData>({
        resolver: zodResolver(petSchema),
        defaultValues: {
            name: pet ? pet.name : "",
            type: pet ? pet.type : "",
            breed: pet?.breed ? pet.breed : "",
            age: pet ? pet.age : 0,
            trackerId: pet?.trackerId ? pet.trackerId : "",
        },
        mode: "onChange",
    });
    const { createPet, updatePet, updateUserPetByAdmin, createUserPetByAdmin } =
        usePetStore();

    const onSubmit = async (data: PetFormData) => {
        try {
            if (pet) {
                if (userId) {
                    await updateUserPetByAdmin(userId, pet.id, data);
                } else {
                    await updatePet(pet.id, data);
                }
            } else {
                if (userId) {
                    await createUserPetByAdmin(userId, data);
                } else {
                    await createPet(data);
                }
            }
            console.log("ok");
            onSuccess();
        } catch (err) {
            console.log(err);
        }
    };

    useEffect(() => {
        if (!isOpen) {
            reset();
        }
    }, [isOpen, reset]);

    return (
        <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
            <Input
                placeholder="Имя"
                {...register("name")}
                error={errors.name?.message}
            />
            <Input
                placeholder="Тип"
                {...register("type")}
                error={errors.type?.message}
            />
            <Input
                placeholder="Порода"
                {...register("breed", {
                    setValueAs: (val) => (val === "" ? undefined : val),
                })}
                error={errors.breed?.message}
            />
            <Input
                type="number"
                placeholder="Возраст"
                {...register("age", {
                    valueAsNumber: true,
                })}
                error={errors.age?.message}
            />
            <Input
                placeholder="Номер трекера"
                {...register("trackerId", {
                    setValueAs: (val) => (val === "" ? undefined : val),
                })}
                error={errors.trackerId?.message}
            />
            <Button type="submit" disabled={!isValid || isSubmitting}>
                {pet ? "Сохранить изменения" : "Создать"}
            </Button>
        </form>
    );
};
