import { useLocation, useNavigate } from "react-router-dom";
import { usePetStore } from "@/entities/pet";
import { PetTrackerMap } from "@/widgets/pet-tracker-map";
import { Button } from "@/shared/ui";
import styles from "./MapPage.module.css";

export const MapPage = () => {
    const navigate = useNavigate();
    const { pets, activePetId } = usePetStore();
    const activePet = pets.find((p) => p.id === activePetId);
    const location = useLocation();
    console.log(location.state);
    const isAdmin = location.state?.from?.startsWith("/user");
    const fromPage = isAdmin ? "/admin" : "/";

    return (
        <div className={styles.pageWrapper}>
            <div className={styles.topBar}>
                <Button variant="secondary" onClick={() => navigate(fromPage)}>
                    {isAdmin ? "← В админ панель" : "← В профиль"}
                </Button>
            </div>

            {activePet ? (
                <PetTrackerMap />
            ) : (
                <div className={styles.fallbackWrapper}>
                    <div className={styles.fallbackCard}>
                        <h3>Нет активного трека питомца</h3>
                        <p>
                            Пожалуйста, выберите питомца в профиле, чтобы начать
                            отслеживание в реальном времени.
                        </p>
                        <Button
                            className={styles.backButton}
                            onClick={() => navigate("/")}
                        >
                            В профиль
                        </Button>
                    </div>
                </div>
            )}
        </div>
    );
};
