import { useEffect } from "react";
import { usePetStore } from "@/entities/pet";
import styles from "./MyPetsList.module.css";
import { PetCardWithModal } from "./PetCardWithModal";
import { useLocation } from "react-router-dom";

export const MyPetsList = ({ userId }: { userId?: string }) => {
    const { pets, isLoading, error, fetchPets, fetchUserPetsByAdmin } =
        usePetStore();
    const location = useLocation();
    const adminRoute = location.pathname.startsWith("/user");
    console.log(adminRoute);

    useEffect(() => {
        if (adminRoute && userId) {
            fetchUserPetsByAdmin(userId);
        } else {
            fetchPets();
        }
    }, [fetchPets, fetchUserPetsByAdmin, adminRoute, userId]);

    if (error) {
        return <div className={styles.error}>{error}</div>;
    }

    if (isLoading) {
        return (
            <div className={styles.centered}>Загрузка списка питомцев...</div>
        );
    }

    if (pets.length === 0) {
        return (
            <div className={styles.centered}>
                {!userId
                    ? "У вас пока нет добавленных питомцев"
                    : "У пользователя нету добавленных питомев"}
            </div>
        );
    }

    return (
        <div className={styles.grid}>
            {pets.map((pet) => (
                <PetCardWithModal userId={userId} key={pet.id} pet={pet} />
            ))}
        </div>
    );
};
